import { Extension } from '@tiptap/core';

// 1. Extension: LetterSpacing (letter-spacing)
export const LetterSpacing = Extension.create({
  name: 'letterSpacing',

  addOptions() {
    return {
      types: ['textStyle', 'paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          letterSpacing: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.letterSpacing?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.letterSpacing) {
                return {};
              }
              return {
                style: `letter-spacing: ${attributes.letterSpacing}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing: string) =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { letterSpacing }).run();
        },
      unsetLetterSpacing:
        () =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { letterSpacing: null }).removeEmptyTextStyle().run();
        },
    } as any;
  },
});

// 2. Extension: WordSpacing (word-spacing)
export const WordSpacing = Extension.create({
  name: 'wordSpacing',

  addOptions() {
    return {
      types: ['textStyle', 'paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          wordSpacing: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.wordSpacing?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.wordSpacing) {
                return {};
              }
              return {
                style: `word-spacing: ${attributes.wordSpacing}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setWordSpacing:
        (wordSpacing: string) =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { wordSpacing }).run();
        },
      unsetWordSpacing:
        () =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { wordSpacing: null }).removeEmptyTextStyle().run();
        },
    } as any;
  },
});

// 3. Extension: ParagraphSpacing (marginTop / marginBottom / Before / After)
export const ParagraphSpacing = Extension.create({
  name: 'paragraphSpacing',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          marginTop: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.marginTop?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.marginTop) {
                return {};
              }
              return {
                style: `margin-top: ${attributes.marginTop}`,
              };
            },
          },
          marginBottom: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.marginBottom?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.marginBottom) {
                return {};
              }
              return {
                style: `margin-bottom: ${attributes.marginBottom}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setParagraphSpacing:
        ({ before, after }: { before?: number | string; after?: number | string }) =>
        ({ commands }: any) => {
          const updates: Record<string, any> = {};
          if (before !== undefined) {
            updates.marginTop = typeof before === 'number' ? `${before}pt` : before;
          }
          if (after !== undefined) {
            updates.marginBottom = typeof after === 'number' ? `${after}pt` : after;
          }
          return commands.updateAttributes('paragraph', updates);
        },
    } as any;
  },
});

// 4. Extension: TextIndent (text-indent / marginLeft / Hanging Indent)
export const TextIndent = Extension.create({
  name: 'textIndent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textIndent: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.textIndent?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.textIndent) {
                return {};
              }
              return {
                style: `text-indent: ${attributes.textIndent}`,
              };
            },
          },
          marginLeft: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.marginLeft?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.marginLeft) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.marginLeft}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextIndent:
        (indentType: 'firstLine' | 'hanging' | 'none', size: string = '24px') =>
        ({ commands }: any) => {
          if (indentType === 'firstLine') {
            return commands.updateAttributes('paragraph', { textIndent: size, marginLeft: null });
          }
          if (indentType === 'hanging') {
            return commands.updateAttributes('paragraph', { textIndent: `-${size}`, marginLeft: size });
          }
          return commands.updateAttributes('paragraph', { textIndent: null, marginLeft: null });
        },
    } as any;
  },
});

// 5. Extension: LineHeight
export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.lineHeight?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }: any) => {
          return commands.updateAttributes('paragraph', { lineHeight });
        },
      unsetLineHeight:
        () =>
        ({ commands }: any) => {
          return commands.updateAttributes('paragraph', { lineHeight: null });
        },
    } as any;
  },
});

// 6. Extension: FontSize
export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
    } as any;
  },
});
