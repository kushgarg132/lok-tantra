import { getImageDimensions } from "./processor";

const MIN_WIDTH = 64;
const MIN_HEIGHT = 64;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FORMATS = new Set(["jpeg", "jpg", "png", "webp", "gif"]);

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export async function validateImageBuffer(
  buffer: Buffer
): Promise<ValidationResult> {
  if (!buffer || buffer.length === 0) {
    return { valid: false, reason: "Empty buffer" };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      reason: `File too large: ${(buffer.length / 1024 / 1024).toFixed(1)} MB (max 10 MB)`,
    };
  }

  if (!hasValidImageSignature(buffer)) {
    return { valid: false, reason: "Not a recognized image format" };
  }

  try {
    const { width, height, format } = await getImageDimensions(buffer);

    if (!width || !height) {
      return { valid: false, reason: "Cannot read image dimensions" };
    }

    if (width < MIN_WIDTH || height < MIN_HEIGHT) {
      return {
        valid: false,
        reason: `Image too small: ${width}×${height} (minimum ${MIN_WIDTH}×${MIN_HEIGHT})`,
      };
    }

    if (!ALLOWED_FORMATS.has(format)) {
      return { valid: false, reason: `Unsupported format: ${format}` };
    }

    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      reason: `Corrupt or unreadable: ${(err as Error).message}`,
    };
  }
}

export function validateSourceUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

// Magic byte checks — fast pre-filter before loading Sharp
function hasValidImageSignature(buf: Buffer): boolean {
  if (buf.length < 12) return false;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return true;

  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return true;

  // GIF: GIF87a or GIF89a
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true;

  return false;
}
