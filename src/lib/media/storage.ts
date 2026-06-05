import type { StorageProvider } from "./types";
import * as fs from "fs";
import * as path from "path";

const provider = (process.env.STORAGE_PROVIDER || "local") as StorageProvider;

// Lazy-loaded S3 client — only instantiated when provider is r2 or s3
let _s3Client: import("@aws-sdk/client-s3").S3Client | null = null;

async function getS3Client(): Promise<import("@aws-sdk/client-s3").S3Client> {
  if (_s3Client) return _s3Client;
  const { S3Client } = await import("@aws-sdk/client-s3");
  _s3Client = new S3Client({
    region: process.env.STORAGE_REGION || "auto",
    ...(process.env.STORAGE_ENDPOINT
      ? { endpoint: process.env.STORAGE_ENDPOINT }
      : {}),
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY || "",
      secretAccessKey: process.env.STORAGE_SECRET_KEY || "",
    },
    forcePathStyle: provider === "r2", // R2 requires path-style
  });
  return _s3Client;
}

export async function uploadObject(
  key: string,
  buffer: Buffer,
  contentType = "image/webp"
): Promise<string> {
  if (provider === "local") {
    const localPath = path.join(process.cwd(), "public", "media", key);
    await fs.promises.mkdir(path.dirname(localPath), { recursive: true });
    await fs.promises.writeFile(localPath, buffer);
    return `/media/${key}`;
  }

  const bucket = process.env.STORAGE_BUCKET || "loktantra-media";
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = await getS3Client();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const cdnDomain = process.env.STORAGE_CDN_DOMAIN;
  if (cdnDomain) return `https://${cdnDomain}/${key}`;

  if (process.env.STORAGE_ENDPOINT) {
    return `${process.env.STORAGE_ENDPOINT}/${bucket}/${key}`;
  }

  return `https://${bucket}.s3.${process.env.STORAGE_REGION || "ap-south-1"}.amazonaws.com/${key}`;
}

export async function deleteObject(key: string): Promise<void> {
  if (provider === "local") {
    const localPath = path.join(process.cwd(), "public", "media", key);
    await fs.promises.unlink(localPath).catch(() => {});
    return;
  }

  const bucket = process.env.STORAGE_BUCKET || "loktantra-media";
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = await getS3Client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export function buildStorageKey(
  entityType: string,
  entityId: string,
  mediaType: string,
  variant: string,
  format: string
): string {
  // Path layout: /<entityType>/<entityId>/<mediaType>/<variant>.<format>
  // e.g.: /person/cm_xyz/profile/avatar.webp
  return `${entityType}/${entityId}/${mediaType}/${variant}.${format}`;
}

export function getPublicMediaPath(key: string): string {
  if (provider === "local") return `/media/${key}`;
  const cdnDomain = process.env.STORAGE_CDN_DOMAIN;
  if (cdnDomain) return `https://${cdnDomain}/${key}`;
  return key;
}
