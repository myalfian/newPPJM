/**
 * Utility Sanitasi Input & Keamanan URL untuk PP Jauharul Maknuun
 * Melindungi dari ancaman XSS (Cross-Site Scripting), protocol injection, dan file exploit.
 */

/**
 * Sanitasi Teks Umum
 * Menghapus tag script, iframe, object, embed, style, form, dan inline event handlers.
 * Meng-escape karakter berisiko dan membatasi panjang karakter.
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') return '';

  let clean = input;

  // 1. Hapus tag script, iframe, object, embed, form, dan style beserta isinya
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Hapus inline event handlers (onerror=, onclick=, onload=, onmouseover=, dll)
  clean = clean.replace(/\s*on\w+\s*=\s*(['"]).*?\1/gi, '');
  clean = clean.replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '');

  // 3. Netralkan protokol berbahaya di dalam atribut
  clean = clean.replace(/(href|src)\s*=\s*(['"])\s*(javascript|vbscript):.*?\2/gi, '$1="#"');

  // 4. Strip tag HTML yang tidak diinginkan, hanya izinkan teks bersih
  clean = clean.replace(/<[^>]+>/g, '');

  // 5. Escape karakter sisa
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Kembalikan ke text plain untuk input form jika diperlukan, atau decode minimal
  clean = clean
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  clean = clean.trim();

  if (maxLength && clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  return clean;
}

/**
 * Validasi Nama Lengkap:
 * Mengizinkan huruf latin, huruf arab, angka, spasi, titik, koma, strip, dan petik satu.
 * Menolak karakter kurung sudut (< >), slash, atau simbol scripting.
 */
export function isValidFullName(name: string): boolean {
  if (!name || name.trim().length < 2 || name.length > 60) return false;
  // Regex mendukung alfabet, spasi, titik, tanda hubung, petik, dan aksara Arab (\u0600-\u06FF)
  const nameRegex = /^[a-zA-Z0-9\s\.\-'\u0600-\u06FF,]+$/;
  return nameRegex.test(name.trim());
}

/**
 * Sanitasi URL
 * Hanya mengizinkan protokol aman: https, http, rute internal (/), #, mailto, tel, wa.me.
 * Memblokir javascript:, vbscript:, data: (kecuali data:image/ berukuran aman).
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();

  // Izinkan path internal relatif
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Izinkan anchor internal
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  // Blokir skema berbahaya
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text') ||
    lower.startsWith('data:application') ||
    lower.startsWith('data:image/svg+xml')
  ) {
    return '#';
  }

  // Izinkan data:image/ (PNG/JPEG/WebP) untuk preview kecil
  if (lower.startsWith('data:image/jpeg') || lower.startsWith('data:image/png') || lower.startsWith('data:image/webp')) {
    if (trimmed.length < 2 * 1024 * 1024) {
      return trimmed;
    }
    return '#';
  }

  // Izinkan link WhatsApp resmi
  if (trimmed.startsWith('https://wa.me/') || trimmed.startsWith('https://api.whatsapp.com/')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (safeProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // URL tidak valid
  }

  return '#';
}

/**
 * Validasi Magic Number file gambar (Binary Header Check)
 * Membaca 4-8 byte pertama dari file untuk memvalidasi tipe asli (bukan hanya ekstensi palsu).
 */
export async function validateImageMagicBytes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    // Maksimal 12 byte untuk cek signature JPEG, PNG, WebP
    const blob = file.slice(0, 12);
    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result || !(reader.result instanceof ArrayBuffer)) {
        resolve(false);
        return;
      }

      const arr = new Uint8Array(reader.result);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0').toUpperCase();
      }

      // JPEG: FF D8 FF
      const isJpeg = header.startsWith('FFD8FF');

      // PNG: 89 50 4E 47 0D 0A 1A 0A
      const isPng = header.startsWith('89504E47');

      // WebP: RIFF .... WEBP (52 49 46 46 ... 57 45 42 50)
      const isRiff = header.startsWith('52494646');
      const isWebp = isRiff && header.substring(16, 24) === '57454250';

      resolve(isJpeg || isPng || isWebp);
    };

    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(blob);
  });
}

