import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
  throw new Error("Missing CLOUDFLARE_R2_ACCESS_KEY_ID");
}

if (!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
  throw new Error("Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY");
}

if (!process.env.CLOUDFLARE_R2_ENDPOINT) {
  throw new Error("Missing CLOUDFLARE_R2_ENDPOINT");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
export const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
