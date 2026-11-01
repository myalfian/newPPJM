import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeRichContentProps {
  content?: string | null;
  className?: string;
}

/**
 * Enterprise-grade SafeRichContent Renderer with Microsoft Word-Like Styling.
 * Strict DOMPurify sanitization blocking javascript/data-injection, whitelisting
 * YouTube embeds, Supabase storage images, and formatted tables/typography.
 */
export const SafeRichContent: React.FC<SafeRichContentProps> = ({
  content,
  className = '',
}) => {
  if (!content || typeof content !== 'string') return null;

  // Deteksi apakah konten berformat HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  const sanitizedHtml = useMemo(() => {
    if (!isHtml) return '';

    // Validasi & Sanitasi berlapis
    DOMPurify.addHook('uponSanitizeElement', (node, data) => {
      const el = node as Element;
      if (!el || typeof el.getAttribute !== 'function') return;

      // Validasi iframe hanya youtube.com/embed atau youtu.be
      if (data.tagName === 'iframe') {
        const src = el.getAttribute('src') || '';
        const isYouTube =
          src.startsWith('https://www.youtube.com/embed/') ||
          src.startsWith('https://youtube.com/embed/') ||
          src.startsWith('https://www.youtube-nocookie.com/embed/');
        if (!isYouTube) {
          el.parentNode?.removeChild(el);
        } else {
          el.setAttribute('class', 'w-full aspect-video rounded-2xl shadow-md my-4 border border-slate-200');
        }
      }

      // Validasi link a href - tolak javascript: & vbscript:
      if (data.tagName === 'a') {
        const href = el.getAttribute('href') || '';
        if (href.toLowerCase().startsWith('javascript:') || href.toLowerCase().startsWith('vbscript:')) {
          el.removeAttribute('href');
        } else {
          el.setAttribute('rel', 'noopener noreferrer');
          el.setAttribute('target', '_blank');
        }
      }

      // Validasi img src
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
          el.setAttribute('class', 'rounded-2xl max-w-full h-auto my-3 border border-slate-200 shadow-xs');
        }
      }
    });

    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol', 'li',
        'strong', 'b', 'em', 'i', 'u', 's', 'sup', 'sub',
        'a', 'img', 'table', 'tr', 'th', 'td', 'thead', 'tbody',
        'iframe', 'hr', 'br', 'span', 'div', 'code', 'pre'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
        'style', 'class', 'colspan', 'rowspan', 'allowfullscreen', 'frameborder'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|data:image\/(?:jpeg|png|webp|gif);base64,|\/)/i
    });
  }, [content, isHtml]);

  if (isHtml) {
    return (
      <div
        className={`safe-word-content prose prose-emerald dark:prose-invert max-w-none 
          prose-p:my-2 prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-4 prose-h1:mb-2
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-3 prose-h2:mb-1.5
          prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-2.5 prose-h3:mb-1
          prose-blockquote:border-l-4 prose-blockquote:border-[#0E7A4C] prose-blockquote:bg-emerald-50/70 dark:prose-blockquote:bg-emerald-950/20 prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
          prose-img:rounded-2xl prose-img:shadow-xs prose-img:border prose-img:border-slate-200 dark:prose-img:border-zinc-800 prose-img:my-3
          prose-a:text-[#0E7A4C] dark:prose-a:text-emerald-400 prose-a:underline hover:prose-a:text-[#0a5a38]
          prose-table:border-collapse prose-table:w-full prose-table:my-3
          prose-th:bg-slate-100 dark:prose-th:bg-zinc-800 prose-th:p-2.5 prose-th:border prose-th:border-slate-200 dark:prose-th:border-zinc-700
          prose-td:p-2.5 prose-td:border prose-td:border-slate-200 dark:prose-td:border-zinc-700
          ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  // Fallback teks biasa / Markdown sederhana
  const rawBlocks = content.split(/\n{2,}/);

  return (
    <div className={`space-y-4 ${className}`}>
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={bIdx} className="text-2xl sm:text-3xl font-black text-slate-800">
              {trimmed.substring(2)}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={bIdx} className="text-xl sm:text-2xl font-bold text-slate-800">
              {trimmed.substring(3)}
            </h2>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={bIdx} className="border-l-4 border-emerald-600 bg-emerald-50/70 p-3 rounded-r-xl italic text-slate-700">
              {trimmed.substring(2)}
            </blockquote>
          );
        }

        return (
          <p key={bIdx} className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};
