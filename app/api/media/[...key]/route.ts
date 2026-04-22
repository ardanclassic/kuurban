import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const key = (await params).key.join('/');
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.BUCKET_NAME;

  if (!bucketName) {
    return new NextResponse("Configuration Error: Bucket name missing", { status: 500 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return new NextResponse("Media body is empty", { status: 404 });
    }

    // Ubah stream ke buffer/blob
    const data = await response.Body.transformToByteArray();
    
    const headers = new Headers();
    headers.set("Content-Type", response.ContentType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(data as any, { headers });
  } catch (error) {
    console.error("S3 Proxy Error:", error);
    return new NextResponse("Error fetching media via S3 SDK", { status: 500 });
  }
}
