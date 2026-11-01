/**
 * Enterprise-grade Rich Content & Entity Processing Utilities
 * PP Jauharul Maknuun - Advanced Content Architecture
 *
 * Mengeliminasi seluruh entitas karakter HTML (&nbsp;, &quot;, &amp;, dsb.),
 * membersihkan tag HTML yang bocor ke ringkasan, dan menormalkan konten TipTap.
 */

/**
 * Peta entitas HTML umum untuk decode cepat & andal
 */
const HTML_ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&#160;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&#34;': '"',
  '&#39;': "'",
  '&#039;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&ndash;': '–',
  '&#8211;': '–',
  '&mdash;': '—',
  '&#8212;': '—',
  '&hellip;': '…',
  '&#8230;': '…',
  '&lsquo;': '‘',
  '&#8216;': '‘',
  '&rsquo;': '’',
  '&#8217;': '’',
  '&ldquo;': '“',
  '&#8220;': '“',
  '&rdquo;': '”',
  '&#8221;': '”',
  '&copy;': '©',
  '&#169;': '©',
  '&reg;': '®',
  '&#174;': '®',
  '&trade;': '™',
  '&#8482;': '™',
  '&bull;': '•',
  '&#8226;': '•',
  '&deg;': '°',
  '&#176;': '°',
  '&plusmn;': '±',
  '&#177;': '±',
  '&times;': '×',
  '&#215;': '×',
  '&divide;': '÷',
  '&#247;': '÷'
};

/**
 * Decode seluruh entitas karakter HTML ke karakter aslinya.
 * Mengatasi single-encoded maupun double-encoded entities (misal: &amp;nbsp; -> ' ').
 */
export function decodeHtmlEntities(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw;

  // 1. Bersihkan double-encoded entities terlebih dahulu
  text = text.replace(/&amp;(nbsp|amp|quot|lt|gt|#39|#039|#x27|apos|ndash|mdash|hellip|ldquo|rdquo|lsquo|rsquo);/gi, '&$1;');

  // 2. Decode menggunakan browser DOMParser jika tersedia di lingkungan klien (paling akurat)
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const decoded = doc.body.textContent || '';
      // Jika doc.body.textContent berhasil dan string tidak kosong
      if (decoded) {
        text = decoded;
      }
    } catch {
      // Fallback ke regex mapping jika parser gagal
    }
  }

  // 3. Fallback / supplementary regex replacement untuk entitas umum dan spasi non-breaking
  for (const [entity, replacement] of Object.entries(HTML_ENTITY_MAP)) {
    text = text.split(entity).join(replacement);
  }

  // Ubah non-breaking space Unicode (\u00A0) menjadi spasi normal
  text = text.replace(/\u00A0/g, ' ');

  return text;
}

/**
 * Menghapus seluruh tag HTML dan menghasilkan teks polos yang bersih, rapi, dan manusiawi.
 * Sangat ideal untuk summary, excerpt card berita, atau meta description.
 */
export function stripHtmlToPlainText(htmlOrText: string, maxLength?: number): string {
  if (!htmlOrText || typeof htmlOrText !== 'string') return '';

  let clean = htmlOrText;

  // 1. Berikan spasi pada penutup tag blok agar kata tidak menempel
  // Contoh: "</p><p>" atau "</h1><p>" atau "</li><li>"
  clean = clean.replace(/<\/(p|div|h[1-6]|li|blockquote|tr|td|th|section|article)>/gi, ' ');
  clean = clean.replace(/<(br|hr)\s*\/?>/gi, ' ');

  // 2. Hapus seluruh tag HTML
  clean = clean.replace(/<[^>]+>/g, '');

  // 3. Decode seluruh entitas karakter HTML
  clean = decodeHtmlEntities(clean);

  // 4. Kompres spasi ganda, tab, dan newline menjadi satu spasi
  clean = clean.replace(/[\s\r\n\t]+/g, ' ').trim();

  // 5. Potong teks secara rapi pada batas kata jika melebihi maxLength
  if (maxLength && clean.length > maxLength) {
    const truncated = clean.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) {
      clean = truncated.substring(0, lastSpace) + '...';
    } else {
      clean = truncated + '...';
    }
  }

  return clean;
}

/**
 * Menormalkan konten HTML sebelum ditampilkan di public via SafeRichContent.
 * - Mengembalikan tag HTML yang ter-escape secara tidak sengaja (&lt;p&gt; -> <p>).
 * - Membersihkan paragraf kosong beruntun (<p><br></p>, <p>&nbsp;</p>).
 * - Menangani double-encoded entities (&amp;nbsp; -> &nbsp;).
 * - Menghilangkan non-breaking space liar yang menyebabkan overflow tabel/card di mobile.
 */
export function cleanAndNormalizeHtml(content: string): string {
  if (!content || typeof content !== 'string') return '';

  let normalized = content.trim();

  // 1. Deteksi jika seluruh HTML ter-escape sebagai string (misal: disimpan sebagai &lt;p&gt;...)
  if (/^&lt;(p|div|h[1-6]|blockquote|table|ul|ol|article|section)\b/i.test(normalized)) {
    normalized = normalized
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }

  // 2. Normalisasi double-encoded entities umum
  normalized = normalized
    .replace(/&amp;nbsp;/gi, '&nbsp;')
    .replace(/&amp;amp;/gi, '&amp;')
    .replace(/&amp;quot;/gi, '&quot;')
    .replace(/&amp;lt;/gi, '&lt;')
    .replace(/&amp;gt;/gi, '&gt;');

  // 3. Bersihkan tumpukan paragraf kosong berlebih (<p><br></p>, <p>&nbsp;</p>, dsb.)
  // Mengganti 3 atau lebih paragraf kosong berturut-turut menjadi satu paragraf kosong
  normalized = normalized.replace(/(<p[^>]*>(\s*|&nbsp;|<br\s*\/?>)*<\/p>\s*){2,}/gi, '<p><br/></p>');

  // 4. Rapikan paragraf kosong di paling awal atau paling akhir
  normalized = normalized.replace(/^(<p[^>]*>(\s*|&nbsp;|<br\s*\/?>)*<\/p>\s*)+/gi, '');
  normalized = normalized.replace(/(<p[^>]*>(\s*|&nbsp;|<br\s*\/?>)*<\/p>\s*)+$/gi, '');

  return normalized;
}

/**
 * Menghitung estimasi waktu membaca dalam menit (berdasarkan kecepatan baca rata-rata 180-200 kata/menit)
 */
export function estimateReadingTime(content: string): number {
  const plainText = stripHtmlToPlainText(content);
  if (!plainText) return 1;
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}

