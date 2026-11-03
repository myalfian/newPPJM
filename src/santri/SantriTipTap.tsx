import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Highlighter,
  Undo2,
  Redo2,
  Quote,
} from 'lucide-react';

export interface TipTapDoc {
  type: string;
  content?: any[];
  [key: string]: any;
}

/** Normalize any value from jsonb column into a valid TipTap content object or HTML string */
export function parseRichJsonb(val: any, fallbackText = ''): any {
  if (!val) {
    return fallbackText
      ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: fallbackText }] }] }
      : { type: 'doc', content: [{ type: 'paragraph' }] };
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && parsed.type === 'doc') return parsed;
      } catch {
        // treat as HTML/plain string
      }
    }
    if (trimmed.startsWith('<')) return trimmed;
    return {
      type: 'doc',
      content: trimmed.split('\n').filter(Boolean).map((line) => ({
        type: 'paragraph',
        content: [{ type: 'text', text: line }],
      })),
    };
  }
  if (typeof val === 'object') {
    if (val.type === 'doc') return val;
    if (typeof val.html === 'string') return val.html;
    if (typeof val.text === 'string') {
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: val.text }] }],
      };
    }
  }
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}

/** Extract plain text preview from TipTap JSONB */
export function extractPlainText(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') {
    return val.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  if (typeof val === 'object') {
    if (typeof val.text === 'string') return val.text;
    if (Array.isArray(val.content)) {
      return val.content.map(extractPlainText).filter(Boolean).join(' ').trim();
    }
  }
  return '';
}

interface SantriTipTapEditorProps {
  value: any;
  onChange: (json: TipTapDoc) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export const SantriTipTapEditor: React.FC<SantriTipTapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan jawaban, rangkuman materi, atau catatan tugas Anda di sini…',
  disabled = false,
  minHeight = '180px',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: parseRichJsonb(value),
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON() as TipTapDoc);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="h-44 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse" />
    );
  }

  const ToolbarBtn = ({
    active,
    onClick,
    title,
    children,
  }: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40 ${
        active
          ? 'bg-[#115E59] text-white shadow-2xs'
          : 'text-slate-600 hover:bg-emerald-50 hover:text-[#115E59]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden bg-white ${
        disabled
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-slate-200/90 focus-within:border-[#115E59] focus-within:ring-2 focus-within:ring-[#115E59]/15'
      }`}
    >
      {!disabled && (
        <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 border-b border-slate-100 bg-[#FAF8F5]">
          <ToolbarBtn
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Garis Bawah"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('highlight')}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Stabilo Sorotan"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarBtn>
          <span className="w-px h-5 bg-slate-200 mx-1" />
          <ToolbarBtn
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Subjudul H2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Subjudul H3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Daftar Poin"
          >
            <List className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Daftar Bernomor"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Kutipan Dalil / Catatan"
          >
            <Quote className="w-4 h-4" />
          </ToolbarBtn>
          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarBtn
              onClick={() => editor.chain().focus().undo().run()}
              title="Urungkan (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().redo().run()}
              title="Ulangi (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </ToolbarBtn>
          </div>
        </div>
      )}

      <div
        className="px-4 py-3 prose prose-sm max-w-none text-slate-800 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[var(--editor-min-h)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5"
        style={{ ['--editor-min-h' as any]: minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

/** Read-only viewer for TipTap JSONB content */
export const SantriRichViewer: React.FC<{ content: any; className?: string }> = ({
  content,
  className = '',
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight, Link.configure({ openOnClick: true })],
    content: parseRichJsonb(content),
    editable: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(parseRichJsonb(content));
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div
      className={`prose prose-sm max-w-none text-slate-700 leading-relaxed [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_p]:my-1.5 ${className}`}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

