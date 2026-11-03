/**
 * Client-side Automatic WebP Light Version Converter
 * Converts any uploaded image (JPG, PNG, HEIC/BMP/WebP) into an optimized,
 * lightweight .webp File before uploading to Supabase Storage.
 */

export interface WebPConversionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

export interface WebPConvertOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetMaxBytes?: number;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 100 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

function canvasToWebPBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      'image/webp',
      quality,
    );
  });
}

/**
 * Converts an image File into a lightweight WebP File.
 * Automatically scales down oversized camera photos (default max 1600px)
 * and adaptively tunes WebP quality so photos load fast on all devices.
 */
export async function convertImageToWebP(
  inputFile: File,
  options: WebPConvertOptions = {},
): Promise<WebPConversionResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.8,
    targetMaxBytes = 320 * 1024, // Aim for <= ~320 KB for fast web loading
  } = options;

  const originalSize = inputFile.size;

  // Only convert raster images (skip SVG or non-image files)
  if (!inputFile.type.startsWith('image/') || inputFile.type === 'image/svg+xml') {
    return {
      file: inputFile,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      width: 0,
      height: 0,
    };
  }

  try {
    const img = await loadImageElement(inputFile);
    const srcW = img.naturalWidth || img.width || 1200;
    const srcH = img.naturalHeight || img.height || 900;

    // Calculate proportional dimensions without upscaling smaller images
    const ratio = Math.min(1, maxWidth / srcW, maxHeight / srcH);
    const targetW = Math.max(1, Math.round(srcW * ratio));
    const targetH = Math.max(1, Math.round(srcH * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // First pass at requested quality
    let currentQuality = quality;
    let blob = await canvasToWebPBlob(canvas, currentQuality);

    // Adaptive second pass if output is still heavier than targetMaxBytes
    while (blob && blob.size > targetMaxBytes && currentQuality > 0.56) {
      currentQuality = Number((currentQuality - 0.1).toFixed(2));
      const smallerBlob = await canvasToWebPBlob(canvas, currentQuality);
      if (!smallerBlob) break;
      blob = smallerBlob;
    }

    if (!blob) {
      throw new Error('Failed to encode WebP blob');
    }

    const baseName = inputFile.name.replace(/\.[^.]+$/, '') || `photo-${Date.now()}`;
    const safeBaseName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image';

    const webpFile = new File([blob], `${safeBaseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    const compressedSize = webpFile.size;
    const savedPercent =
      originalSize > 0
        ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
        : 0;

    return {
      file: webpFile,
      originalSize,
      compressedSize,
      savedPercent,
      width: targetW,
      height: targetH,
    };
  } catch {
    // Fallback to original file if browser fails to decode image
    return {
      file: inputFile,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      width: 0,
      height: 0,
    };
  }
}

