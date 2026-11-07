import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { cleanAndNormalizeHtml, decodeHtmlEntities } from '../../utils/richContentUtils';

interface SafeRichContentProps {
  content?: string | null;
  className?: string;
  leadParagraph?: boolean;
}

/**
 * Enterprise-grade SafeRichContent Renderer with Executive Editorial Styling.
 * PP Jauharul Maknuun - Advanced Content Architecture
 *
 * Fitur Utama:
 * 1. Mengeliminasi seluruh entitas karakter HTML (&nbsp;, &quot;, &amp;, dsb.) yang bocor.
 * 2. Strict DOMPurify sanitization melindungi dari XSS, javascript: dan vector injeksi.
 * 3. Menjaga format Word-Like Editor: alignment, table responsive, image card, quote pimpinan, video embed.
 * 4. Tipografi responsif & elegan di mobile, tablet, maupun layar lebar desktop.
 */
export const SafeRichContent: React.FC<SafeRichContentProps> = ({
  content,
  className = '',
  leadParagraph = false
}) => {
  const safeContent = typeof content === 'string' ? content : '';

  // 1. Pra-proses normalisasi string konten
  const preparedContent = useMemo(() => {
    if (!safeContent) return '';
    return cleanAndNormalizeHtml(safeContent);
  }, [safeContent]);

  // 2. Deteksi apakah konten berformat HTML
  const isHtml = useMemo(() => {
    if (!preparedContent) return false;
    return /<[a-z][\s\S]*>/i.test(preparedContent);
  }, [preparedContent]);

  // 3. Sanitasi mendalam & penataan struktur elemen
  const sanitizedHtml = useMemo(() => {
    if (!isHtml || !preparedContent) return '';

    // Registrasi hook sanitasi elemen
    DOMPurify.removeAllHooks();

    DOMPurify.addHook('uponSanitizeElement', (node, data) => {
      const el = node as HTMLElement;
      if (!el || typeof el.getAttribute !== 'function') return;

      // A. Validasi Iframe YouTube
      if (data.tagName === 'iframe') {
        const src = el.getAttribute('src') || '';
        const isYouTube =
          src.startsWith('https://www.youtube.com/embed/') ||
          src.startsWith('https://youtube.com/embed/') ||
          src.startsWith('https://www.youtube-nocookie.com/embed/');
        if (!isYouTube) {
          el.parentNode?.removeChild(el);
        } else {
          el.setAttribute('class', 'w-full aspect-video rounded-xl sm:rounded-2xl shadow-md my-4 border border-slate-200 dark:border-zinc-700');
          el.setAttribute('loading', 'lazy');
        }
      }

      // B. Validasi Link (a href) - tolak script & tambahkan rel aman
      if (data.tagName === 'a') {
        const href = el.getAttribute('href') || '';
        if (href.toLowerCase().startsWith('javascript:') || href.toLowerCase().startsWith('vbscript:')) {
          el.removeAttribute('href');
        } else {
          el.setAttribute('rel', 'noopener noreferrer');
          el.setAttribute('target', '_blank');
          el.classList.add('text-emerald-700', 'dark:text-emerald-400', 'font-semibold', 'underline', 'hover:text-emerald-900', 'transition-colors');
        }
      }

      // C. Validasi Gambar (img src)
      if (data.tagName === 'img') {
        const src = el.getAttribute('src') || '';
        const isAllowedSrc =
          src.startsWith('https://') ||
          src.startsWith('http://') ||
          src.startsWith('/') ||
          src.startsWith('data:image/');
        if (!isAllowedSrc) {
          el.parentNode?.removeChild(el);
        } else {
          el.setAttribute('loading', 'lazy');
          el.setAttribute('class', 'rounded-xl sm:rounded-2xl max-w-full h-auto my-4 border border-slate-200 dark:border-zinc-800 shadow-xs mx-auto block object-cover');
        }
      }

      // D. Validasi Blockquote
      if (data.tagName === 'blockquote') {
        el.setAttribute('class', 'my-3.5 pl-4 sm:pl-5 py-2.5 pr-3.5 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20 italic text-slate-800 dark:text-zinc-200 leading-relaxed font-serif');
      }

      // E. Validasi Tabel
      if (data.tagName === 'table') {
        el.setAttribute('class', 'w-full border-collapse text-left text-xs sm:text-sm my-3 border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden');
      }
      if (data.tagName === 'th') {
        el.setAttribute('class', 'bg-slate-100 dark:bg-zinc-800/80 px-3 py-2 font-bold text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700');
      }
      if (data.tagName === 'td') {
        el.setAttribute('class', 'px-3 py-2 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300');
      }

      // F. Tipografi Headings & Paragraf
      if (data.tagName === 'h1') {
        el.setAttribute('class', 'text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-6 mb-3 tracking-tight leading-tight');
      }
      if (data.tagName === 'h2') {
        el.setAttribute('class', 'text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-emerald-100 mt-5 mb-2.5 tracking-tight border-b border-emerald-500/20 pb-1.5');
      }
      if (data.tagName === 'h3') {
        el.setAttribute('class', 'text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100 mt-4 mb-2');
      }
      if (data.tagName === 'p') {
        el.setAttribute('class', 'mb-3.5 leading-relaxed sm:leading-loose text-slate-700 dark:text-zinc-300');
      }
      if (data.tagName === 'ul') {
        el.setAttribute('class', 'my-3 ml-5 space-y-2 list-disc marker:text-emerald-600 dark:marker:text-emerald-400');
      }
      if (data.tagName === 'ol') {
        el.setAttribute('class', 'my-3 ml-5 space-y-2 list-decimal marker:font-bold marker:text-emerald-600 dark:marker:text-emerald-400');
      }
      if (data.tagName === 'li') {
        el.setAttribute('class', 'pl-1 leading-relaxed text-slate-700 dark:text-zinc-300');
      }
      if (data.tagName === 'hr') {
        el.setAttribute('class', 'my-6 border-slate-200 dark:border-zinc-700/80');
      }
      if (data.tagName === 'strong' || data.tagName === 'b') {
        el.setAttribute('class', 'font-bold text-slate-900 dark:text-white');
      }
      if (data.tagName === 'em' || data.tagName === 'i') {
        el.setAttribute('class', 'italic');
      }
    });

    const sanitized = DOMPurify.sanitize(preparedContent, {
      ALLOWED_TAGS: [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li',
        'strong', 'b', 'em', 'i', 'u', 's', 'sup', 'sub',
        'a', 'img', 'table', 'tr', 'th', 'td', 'thead', 'tbody',
        'iframe', 'hr', 'br', 'span', 'div', 'code', 'pre', 'mark',
        'figure', 'figcaption'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
        'style', 'class', 'colspan', 'rowspan', 'allowfullscreen', 'frameborder',
        'loading', 'title'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|data:image\/(?:jpeg|png|webp|gif);base64,|\/)/i
    });

    // Post-cleaning: decode accidental double-encoded entities inside text nodes
    return sanitized
      .replace(/&amp;nbsp;/gi, ' ')
      .replace(/&amp;quot;/gi, '"')
      .replace(/&amp;apos;/gi, "'")
      .replace(/&amp;#39;/gi, "'");
  }, [preparedContent, isHtml]);

  if (!safeContent) return null;

  // Mode HTML
  if (isHtml) {
    return (
      <div
        className={`safe-word-content text-slate-700 dark:text-zinc-300 leading-relaxed sm:leading-loose text-[14.5px] sm:text-base space-y-2.5 break-words ${
          leadParagraph ? 'first:text-base sm:first:text-lg first:font-medium' : ''
        } ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  // Fallback Teks Biasa / Markdown Sederhana
  const rawBlocks = preparedContent.split(/\n{2,}/);

  return (
    <div className={`space-y-3 text-slate-700 dark:text-zinc-300 text-[14.5px] sm:text-base leading-relaxed ${className}`}>
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Decode seluruh entitas pada blok teks biasa
        const cleanBlock = decodeHtmlEntities(trimmed);

        if (cleanBlock.startsWith('# ')) {
          return (
            <h1 key={bIdx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2 tracking-tight">
              {cleanBlock.substring(2)}
            </h1>
          );
        }
        if (cleanBlock.startsWith('## ')) {
          return (
            <h2 key={bIdx} className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-zinc-100 mt-3 mb-1.5 tracking-tight">
              {cleanBlock.substring(3)}
            </h2>
          );
        }
        if (cleanBlock.startsWith('### ')) {
          return (
            <h3 key={bIdx} className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-200 mt-2.5 mb-1">
              {cleanBlock.substring(4)}
            </h3>
          );
        }
        if (cleanBlock.startsWith('> ')) {
          return (
            <blockquote key={bIdx} className="my-2.5 pl-3.5 py-2 rounded-r-xl border-l-4 border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20 italic text-slate-800 dark:text-zinc-200">
              {cleanBlock.substring(2)}
            </blockquote>
          );
        }
        if (cleanBlock.startsWith('- ') || cleanBlock.startsWith('* ')) {
          return (
            <li key={bIdx} className="list-disc ml-5 leading-relaxed">
              {cleanBlock.substring(2)}
            </li>
          );
        }

        return (
          <p key={bIdx} className="leading-relaxed">
            {cleanBlock}
          </p>
        );
      })}
    </div>
  );
};
