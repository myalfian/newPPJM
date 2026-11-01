import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeRichContentProps {
  content?: string | null;
  className?: string;
}

/**
 * Enhanced SafeRichContent Renderer with Microsoft Word-Like Styling Support.
 * Safely sanitizes HTML from SectionWordEditor via DOMPurify, preserving
 * typography (letter-spacing, word-spacing, line-height, text-indent, margins, tables),
 * and falls back gracefully to structured markdown if raw plain text is provided.
 */
export const SafeRichContent: React.FC<SafeRichContentProps> = ({
  content,
  className = '',
}) => {
  if (!content || typeof content !== 'string') return null;

  // Check whether content contains HTML tags
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  const sanitizedHtml = useMemo(() => {
    if (!isHtml) return '';

    // Configure strict DOMPurify whitelist
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol', 'li',
        'strong', 'b', 'em', 'i', 'u', 's', 'sup', 'sub',
        'a', 'img', 'table', 'tr', 'th', 'td', 'thead', 'tbody',
        'iframe', 'hr', 'br', 'span', 'div', 'pre', 'code'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
        'style', 'class', 'colspan', 'rowspan'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|data:image\/(?:jpeg|png|webp|gif|svg\+xml);base64,|\/)/i,
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allowfullscreen', 'frameborder', 'style'],
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: (tagName) => {
          return ['iframe'].includes(tagName.toLowerCase());
        },
        attributeNameCheck: (attr) => {
          return ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'style'].includes(attr.toLowerCase());
        }
      }
    });
  }, [content, isHtml]);

  if (isHtml) {
    return (
      <div
        className={`safe-word-content prose prose-emerald dark:prose-invert max-w-none 
          prose-p:my-2 prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-4 prose-h1:mb-2
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-3 prose-h2:mb-1.5
          prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-2.5 prose-h3:mb-1
          prose-blockquote:border-l-4 prose-blockquote:border-[#0E7A4C] prose-blockquote:bg-emerald-50/60 dark:prose-blockquote:bg-emerald-950/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
          prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800 prose-img:my-3
          prose-a:text-[#0E7A4C] dark:prose-a:text-emerald-400 prose-a:underline hover:prose-a:text-[#0a5a38]
          prose-table:border-collapse prose-table:w-full prose-table:my-3
          prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-th:p-2.5 prose-th:border prose-th:border-zinc-200 dark:prose-th:border-zinc-700
          prose-td:p-2.5 prose-td:border prose-td:border-zinc-200 dark:prose-td:border-zinc-700
          ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  // Fallback: Markdown Renderer for Plain Text Strings
  const rawBlocks = content.split(/\n{2,}/);

  return (
    <div className={`space-y-4 ${className}`}>
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const rawLines = trimmed.split('\n');

        return (
          <p
            key={bIdx}
            className="leading-relaxed sm:leading-loose text-zinc-800 dark:text-zinc-200"
          >
            {rawLines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};
