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
 * Mengonversi sintaks Markdown atau teks terstruktur menjadi HTML semantik yang bersih.
 */
export function markdownToHtml(md: string): string {
  if (!md || typeof md !== 'string') return '';

  // Jika teks sudah mengandung tag blok HTML, kembalikan langsung
  if (/<(p|div|h[1-6]|ul|ol|li|blockquote|table|section|article)\b/i.test(md)) {
    return md;
  }

  // 1. Perbaiki kalimat yang menempel tanpa spasi setelah tanda titik (contoh: "Saw.Pondok" -> "Saw. Pondok")
  let text = md.replace(/([a-zA-Z0-9\.\'\’\”\)])\.([A-Z\u0600-\u06FF])/g, '$1. $2');

  const lines = text.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  const flushBlockquote = () => {
    if (inBlockquote && blockquoteBuffer.length > 0) {
      htmlParts.push(`<blockquote>${blockquoteBuffer.join('<br />')}</blockquote>`);
      blockquoteBuffer = [];
      inBlockquote = false;
    }
  };

  const flushList = () => {
    if (inList) {
      htmlParts.push(`</${inList}>`);
      inList = null;
    }
  };

  const parseInline = (str: string): string => {
    return str
      // Bold + Italic: ***text***
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold: **text** atau __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic: *text* atau _text_
      .replace(/\*([^\*]+?)\*/g, '<em>$1</em>')
      .replace(/_([^_]+?)_/g, '<em>$1</em>')
      // Inline Code: `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      flushBlockquote();
      continue;
    }

    // Horizontal Rule (---, ***, ___)
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushList();
      flushBlockquote();
      htmlParts.push('<hr />');
      continue;
    }

    // Heading 1 (# Title)
    if (line.startsWith('# ')) {
      flushList();
      flushBlockquote();
      htmlParts.push(`<h1>${parseInline(line.substring(2).trim())}</h1>`);
      continue;
    }

    // Heading 2 (## Subheading)
    if (line.startsWith('## ')) {
      flushList();
      flushBlockquote();
      htmlParts.push(`<h2>${parseInline(line.substring(3).trim())}</h2>`);
      continue;
    }

    // Heading 3 (### Subtitle)
    if (line.startsWith('### ')) {
      flushList();
      flushBlockquote();
      htmlParts.push(`<h3>${parseInline(line.substring(4).trim())}</h3>`);
      continue;
    }

    // Blockquote (> Quote)
    if (line.startsWith('> ')) {
      flushList();
      inBlockquote = true;
      blockquoteBuffer.push(parseInline(line.substring(2).trim()));
      continue;
    } else {
      flushBlockquote();
    }

    // Unordered List item (- atau *)
    if (/^[-*]\s+/.test(line)) {
      if (inList !== 'ul') {
        flushList();
        inList = 'ul';
        htmlParts.push('<ul>');
      }
      const itemContent = line.replace(/^[-*]\s+/, '').trim();
      htmlParts.push(`<li>${parseInline(itemContent)}</li>`);
      continue;
    }

    // Ordered List item (1. 2.)
    if (/^\d+\.\s+/.test(line)) {
      if (inList !== 'ol') {
        flushList();
        inList = 'ol';
        htmlParts.push('<ol>');
      }
      const itemContent = line.replace(/^\d+\.\s+/, '').trim();
      htmlParts.push(`<li>${parseInline(itemContent)}</li>`);
      continue;
    }

    // Paragraf biasa
    flushList();
    htmlParts.push(`<p>${parseInline(line)}</p>`);
  }

  flushList();
  flushBlockquote();

  return htmlParts.join('\n');
}

/**
 * Menormalkan konten HTML sebelum ditampilkan di public via SafeRichContent.
 * - Mengembalikan tag HTML yang ter-escape secara tidak sengaja (&lt;p&gt; -> <p>).
 * - Membersihkan paragraf kosong beruntun (<p><br></p>, <p>&nbsp;</p>).
 * - Menangani double-encoded entities (&amp;nbsp; -> &nbsp;).
 * - Menghilangkan non-breaking space liar yang menyebabkan overflow tabel/card di mobile.
 * - Mengonversi format Markdown menjadi HTML jika input tidak berformat HTML.
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

  // 3. Jika belum berbentuk HTML, konversikan dari format Markdown
  if (!/<[a-z][\s\S]*>/i.test(normalized)) {
    normalized = markdownToHtml(normalized);
  }

  // 4. Bersihkan tumpukan paragraf kosong berlebih (<p><br></p>, <p>&nbsp;</p>, dsb.)
  normalized = normalized.replace(/(<p[^>]*>(\s*|&nbsp;|<br\s*\/?>)*<\/p>\s*){2,}/gi, '<p><br/></p>');

  // 5. Rapikan paragraf kosong di paling awal atau paling akhir
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

/**
 * Standardisasi penulisan lafaz keagamaan & honorifik islami sesuai EYD dan konvensi resmi pesantren:
 * - Allah Swt.
 * - Nabi Muhammad saw. / Rasulullah saw.
 * - Al-Qur'an
 * - hadis (bukan hadist)
 * - insya Allah
 */
export function standardizeIslamicHonorifics(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let res = text;
  // Allah Swt.
  res = res.replace(/\bAllah\s+(SWT|swt|Swt\.?)\b/gi, 'Allah Swt.');
  // Nabi Muhammad saw.
  res = res.replace(/\b(Nabi\s+Muhammad|Rasulullah)\s+(SAW|saw|Saw\.?)\b/gi, '$1 saw.');
  // Al-Qur'an
  res = res.replace(/\b(al[- ]?qur['’`]?an|alquran)\b/gi, "Al-Qur'an");
  // hadist -> hadis
  res = res.replace(/\b(hadits|hadist)\b/gi, 'hadis');
  // insya Allah
  res = res.replace(/\b(insha\s*allah|insyaallah|insya-allah)\b/gi, 'insya Allah');
  // Subhanahu wa Ta'ala
  res = res.replace(/\bsubhanahu\s+wa\s+ta'?ala\b/gi, "Subhanahu wa Ta'ala");
  // Shallallahu 'Alaihi wa Sallam
  res = res.replace(/\bshallallahu\s+'?alaihi\s+wa\s+sallam\b/gi, "Shallallahu 'Alaihi wa Sallam");
  return res;
}

/**
 * Istilah kepesantrenan, akademis, dan bahasa asing yang wajib dicetak miring (*italic*).
 */
export const SCHOOL_ITALIC_TERMS = [
  'tafaqquh fiddin',
  'kutubut turats',
  'dirosah islamiyah',
  'tahfidzul qur\'an',
  'mutafaqqih fiddin',
  'murojaah',
  'ziyadah',
  'madrasah diniyah takmiliyah',
  'sanad muttashil',
  'insan kamil',
  'akhlakul karimah',
  'leadership',
  'full day education',
  'boarding school',
  'smart campus',
  'green campus',
  'science, technology, engineering, & math',
  'Bismillahirrohmanirrohim',
  'Assalamu’alaikum Warahmatullahi Wabarakatuh',
  'Assalamu\'alaikum Warahmatullahi Wabarakatuh',
  'Wassalamu’alaikum Warahmatullahi Wabarakatuh',
  'Wassalamu\'alaikum Warahmatullahi Wabarakatuh',
  'Alhamdulillahi rabbil \'alamin',
  'Aamiin ya Rabbal \'Alamin'
];

/**
 * Menerapkan cetak miring pada istilah pesantren dan istilah asing tanpa merusak tag HTML yang sudah ada.
 */
export function italicizeSchoolTerms(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let res = text;
  for (const term of SCHOOL_ITALIC_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Hanya ganti jika belum berada di dalam tag <em>, <i>, <a>, dsb.
    const regex = new RegExp(`(?<![<*_/])\\b(${escaped})\\b(?![>*_/])`, 'gi');
    res = res.replace(regex, '<em>$1</em>');
  }
  return res;
}

/**
 * Memperbaiki kalimat yang menempel tanpa spasi setelah tanda titik, serta merapikan spasi ganda.
 */
export function cleanSpacingAndJoinedWords(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let clean = text;
  // Perbaiki kalimat menempel (contoh: "Saw.Pondok" -> "Saw. Pondok", "santri.Berangkat" -> "santri. Berangkat")
  clean = clean.replace(/([a-zA-Z0-9\.\'\’\”\)])\.([A-Z\u0600-\u06FF])/g, '$1. $2');
  // Kompres spasi horizontal ganda tetapi pertahankan newline
  clean = clean.replace(/[^\S\r\n]{2,}/g, ' ');
  return clean;
}

export interface SchoolFormatOptions {
  mode?: 'full' | 'eyd_only' | 'speech' | 'news';
}

/**
 * Enterprise School Article Formatter & Style Optimizer.
 * Mengubah draf mentah, pengumuman, atau sambutan pimpinan menjadi artikel web terstruktur
 * sesuai School Website Style Guide resmi:
 * - Struktur anatomi: Judul H1, Salam Iftitah, Teras/Lead, Subjudul H2/H3, Poin Sintesa, Penutup.
 * - Standardisasi honorifik keagamaan dan cetak miring istilah pesantren/asing.
 * - Siap dirender di SafeRichContent maupun diedit kembali di WordLikeEditor (TipTap).
 */
export function autoFormatSchoolArticle(content: string, options: SchoolFormatOptions = { mode: 'full' }): string {
  if (!content || typeof content !== 'string') return '';

  const mode = options.mode || 'full';

  // 1. Bersihkan spasi dan kalimat yang menempel
  let processed = cleanSpacingAndJoinedWords(content.trim());

  // 2. Terapkan EYD honorifik keagamaan
  processed = standardizeIslamicHonorifics(processed);

  // Jika hanya mode EYD saja, langsung kembalikan
  if (mode === 'eyd_only') {
    return italicizeSchoolTerms(processed);
  }

  // 3. Jika input belum berupa HTML blok, ubah menjadi HTML terstruktur semantik
  const isHtml = /<(p|div|h[1-6]|ul|ol|li|blockquote|table|section|article)\b/i.test(processed);

  if (!isHtml) {
    // Jalankan konversi markdown / plain text ke semantic HTML
    processed = markdownToHtml(processed);
  }

  // 4. Terapkan cetak miring istilah pesantren
  processed = italicizeSchoolTerms(processed);

  // 5. Normalisasi HTML akhir
  return cleanAndNormalizeHtml(processed);
}

