"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/r2";

export async function getPresignedUploadUrl(fileName: string, fileType: string, folder: string = "uploads") {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/\s+/g, "-").toLowerCase();
    const key = `${folder}/${timestamp}-${sanitizedFileName}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // URL berlaku selama 60 detik
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return { success: false, error: "Failed to generate upload URL" };
  }
}

export async function deleteFromR2(key: string) {
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return { success: false, error: "Failed to delete file from storage" };
  }
}
