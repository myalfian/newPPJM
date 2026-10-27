import React from 'react';

interface SafeRichContentProps {
  content?: string | null;
  className?: string;
}

/**
 * Parses inline formatting:
 * - [text](url) -> <a>
 * - **bold** or *bold* -> <strong>
 * - _italic_ -> <em>
 * - raw URLs -> <a> (stripping trailing punctuation like . , ! ? : ; ) )
 */
export const renderInlineFormatting = (text: string): React.ReactNode[] => {
  const tokenPattern = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|https?:\/\/[^\s]+)/g;
  const parts = text.split(tokenPattern);

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. Markdown link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 dark:text-emerald-400 underline font-semibold hover:text-emerald-900 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // 2. Bold: **text** or *text*
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length > 4) ||
      (part.startsWith('*') && part.endsWith('*') && part.length > 2)
    ) {
      const inner = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
      return (
        <strong key={idx} className="font-bold text-zinc-900 dark:text-white">
          {inner}
        </strong>
      );
    }

    // 3. Italic: _text_
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className="italic text-zinc-800 dark:text-zinc-200">
          {inner}
        </em>
      );
    }

    // 4. Raw URL with trailing punctuation handling
    const rawUrlMatch = part.match(/^(https?:\/\/[^\s]+?)([.,!?:;)]+)?$/);
    if (rawUrlMatch) {
      const cleanUrl = rawUrlMatch[1];
      const trailingPunct = rawUrlMatch[2] || '';
      return (
        <React.Fragment key={idx}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-emerald-400 underline break-all hover:text-emerald-900 transition-colors"
          >
            {cleanUrl}
          </a>
          {trailingPunct}
        </React.Fragment>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

interface BlockElement {
  type: 'quote' | 'ul' | 'ol' | 'p';
  lines: string[];
}

/**
 * Safe, zero-dependency Rich Content renderer for React 19.
 * Parses blockquotes, unordered/ordered lists, paragraphs, bold, italic, and URLs without dangerous innerHTML.
 */
export const SafeRichContent: React.FC<SafeRichContentProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const rawBlocks = content.split(/\n{2,}/);

  return (
    <div className={`space-y-4 ${className}`}>
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const rawLines = trimmed.split('\n');
        const elements: BlockElement[] = [];

        let currentType: BlockElement['type'] | null = null;
        let currentLines: string[] = [];

        const flush = () => {
          if (currentLines.length > 0 && currentType) {
            elements.push({ type: currentType, lines: currentLines });
            currentLines = [];
            currentType = null;
          }
        };

        rawLines.forEach((line) => {
          const lTrimmed = line.trim();
          if (!lTrimmed) return;

          if (lTrimmed.startsWith('>')) {
            if (currentType !== 'quote') flush();
            currentType = 'quote';
            currentLines.push(lTrimmed.replace(/^>\s?/, ''));
          } else if (/^[•\-*]\s+/.test(lTrimmed)) {
            if (currentType !== 'ul') flush();
            currentType = 'ul';
            currentLines.push(lTrimmed.replace(/^[•\-*]\s+/, ''));
          } else if (/^\d+\.\s+/.test(lTrimmed)) {
            if (currentType !== 'ol') flush();
            currentType = 'ol';
            currentLines.push(lTrimmed.replace(/^\d+\.\s+/, ''));
          } else {
            if (currentType !== 'p') flush();
            currentType = 'p';
            currentLines.push(lTrimmed);
          }
        });
        flush();

        return (
          <React.Fragment key={bIdx}>
            {elements.map((elem, eIdx) => {
              const subKey = `${bIdx}-${eIdx}`;

              if (elem.type === 'quote') {
                return (
                  <blockquote
                    key={subKey}
                    className="border-l-4 border-emerald-600 dark:border-emerald-500 pl-4 py-1 italic text-zinc-700 dark:text-zinc-300 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-r-xl my-3"
                  >
                    {elem.lines.map((l, lIdx) => (
                      <p key={lIdx} className="leading-relaxed">
                        {renderInlineFormatting(l)}
                      </p>
                    ))}
                  </blockquote>
                );
              }

              if (elem.type === 'ul') {
                return (
                  <ul key={subKey} className="list-disc list-inside space-y-1.5 my-2 text-zinc-700 dark:text-zinc-300">
                    {elem.lines.map((l, lIdx) => (
                      <li key={lIdx} className="leading-relaxed">
                        {renderInlineFormatting(l)}
                      </li>
                    ))}
                  </ul>
                );
              }

              if (elem.type === 'ol') {
                return (
                  <ol key={subKey} className="list-decimal list-inside space-y-1.5 my-2 text-zinc-700 dark:text-zinc-300">
                    {elem.lines.map((l, lIdx) => (
                      <li key={lIdx} className="leading-relaxed">
                        {renderInlineFormatting(l)}
                      </li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={subKey} className="leading-relaxed sm:leading-loose text-zinc-800 dark:text-zinc-200">
                  {elem.lines.map((l, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {lIdx > 0 && <br />}
                      {renderInlineFormatting(l)}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
