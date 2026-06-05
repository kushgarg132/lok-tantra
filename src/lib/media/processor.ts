import crypto from "crypto";
import type { ProcessedImage } from "./types";

export const VARIANT_SIZES = {
  thumb: { width: 64, height: 64 },
  avatar: { width: 128, height: 128 },
  card: { width: 400, height: 400 },
  banner: { width: 1200, height: 400 },
} as const;

export type VariantName = keyof typeof VARIANT_SIZES;

function checksum(buf: Buffer): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

// Normalize any input image to WebP at capped dimensions
export async function processOriginal(inputBuffer: Buffer): Promise<ProcessedImage> {
  const sharp = (await import("sharp")).default;
  const result = await sharp(inputBuffer)
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    format: "webp",
    fileSize: result.info.size,
    checksum: checksum(result.data),
  };
}

// Generate a single named variant from the original buffer
export async function generateVariant(
  inputBuffer: Buffer,
  variant: VariantName,
  isLogo = false
): Promise<ProcessedImage> {
  const sharp = (await import("sharp")).default;
  const { width, height } = VARIANT_SIZES[variant];

  // Logos: contain + transparent bg; portraits/photos: cover + white bg
  const fit: "contain" | "cover" = isLogo ? "contain" : "cover";
  const background = isLogo
    ? { r: 0, g: 0, b: 0, alpha: 0 }
    : { r: 255, g: 255, b: 255, alpha: 1 };

  const result = await sharp(inputBuffer)
    .resize({ width, height, fit, background })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    format: "webp",
    fileSize: result.info.size,
    checksum: checksum(result.data),
  };
}

export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number; format: string }> {
  const sharp = (await import("sharp")).default;
  const meta = await sharp(buffer).metadata();
  return {
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    format: meta.format ?? "unknown",
  };
}
