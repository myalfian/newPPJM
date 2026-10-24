/**
 * Browser Client-Side Auto WebP Compressor
 * Mengompres foto secara otomatis di sisi browser santri/admin sebelum diunggah ke Supabase Storage.
 * Mengurangi ukuran gambar hingga 80-90% tanpa menurunkan ketajaman visual.
 */

export interface CompressionResult {
  file: File;
  previewUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  savedPercent: number;
  width: number;
  height: number;
}

export async function compressImageToWebP(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<CompressionResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung rasio resolusi optimal
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal menginisialisasi canvas grafis'));
          return;
        }

        // Gambar ulang gambar dengan interpolasi halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengompres gambar ke format WebP'));
              return;
            }

            const cleanFileName = file.name
              .replace(/\.[^/.]+$/, '')
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-') + '.webp';

            const compressedFile = new File([blob], cleanFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            const compressedSizeKB = Math.round(blob.size / 1024);
            const savedPercent = Math.max(
              0,
              Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100)
            );

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              file: compressedFile,
              previewUrl,
              originalSizeKB,
              compressedSizeKB,
              savedPercent,
              width,
              height,
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Format file gambar tidak valid'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Gagal membaca file dari perangkat'));
    reader.readAsDataURL(file);
  });
}
