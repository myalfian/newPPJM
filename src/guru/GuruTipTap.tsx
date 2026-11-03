import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
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
  Quote,
  Image as ImageIcon,
  Video as YoutubeIcon,
  Undo2,
  Redo2,
  Upload,
} from 'lucide-react';
import { parseRichJsonb } from '../santri/SantriTipTap';

function isSafeHttpUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface GuruTipTapEditorProps {
  value: any;
  onChange: (json: any, html: string) => void;
  onUploadImage?: (file: File) => Promise<{ url: string | null }>;
  placeholder?: string;
  minHeight?: string;
}

export const GuruTipTapEditor: React.FC<GuruTipTapEditorProps> = ({
  value,
  onChange,
  onUploadImage,
  placeholder = 'Tuliskan deskripsi tugas, materi pembelajaran, atau isi berita lengkap di sini…',
  minHeight = '220px',
}) => {
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgFileRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: parseRichJsonb(value),
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON(), ed.getHTML());
    },
  });

  if (!editor) {
    return <div className="h-52 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse" />;
  }

  const handleInsertYoutube = () => {
    const trimmed = youtubeUrl.trim();
    if (!trimmed || !isSafeHttpUrl(trimmed)) return;
    editor.commands.setYoutubeVideo({ src: trimmed });
    setYoutubeUrl('');
    setShowYoutubeInput(false);
  };

  const handleInsertImageUrl = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed || !isSafeHttpUrl(trimmed)) return;
    editor.chain().focus().setImage({ src: trimmed }).run();
    setImageUrl('');
    setShowImageUrlInput(false);
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_MIMES.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES) {
      return;
    }
    if (onUploadImage) {
      setUploadingImg(true);
      const { url } = await onUploadImage(file);
      setUploadingImg(false);
      if (url && (isSafeHttpUrl(url) || url.startsWith('blob:'))) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else {
      const localUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: localUrl }).run();
    }
  };

  const Btn = ({
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
      title={title}
      aria-label={title}
      className={`p-2 rounded-xl transition-colors cursor-pointer ${
        active
          ? 'bg-[#115E59] text-white shadow-2xs'
          : 'text-slate-600 hover:bg-emerald-50 hover:text-[#115E59]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-slate-200/90 focus-within:border-[#115E59] focus-within:ring-2 focus-within:ring-[#115E59]/15 bg-white overflow-hidden transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-[#FAF8F5]">
        <Btn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Tebal (Bold)"
        >
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Miring (Italic)"
        >
          <Italic className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Garis Bawah"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Stabilo"
        >
          <Highlighter className="w-4 h-4" />
        </Btn>

        <span className="w-px h-5 bg-slate-200 mx-1" />

        <Btn
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Judul Bagian H2"
        >
          <Heading2 className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Subjudul H3"
        >
          <Heading3 className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Daftar Poin"
        >
          <List className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Daftar Bernomor"
        >
          <ListOrdered className="w-4 h-4" />
        </Btn>
        <Btn
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Kutipan Dalil / Catatan"
        >
          <Quote className="w-4 h-4" />
        </Btn>

        <span className="w-px h-5 bg-slate-200 mx-1" />

        {/* Upload / Insert Image */}
        <button
          type="button"
          onClick={() => imgFileRef.current?.click()}
          disabled={uploadingImg}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#115E59] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 flex items-center gap-1.5 cursor-pointer"
          title="Unggah Gambar ke Editor"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{uploadingImg ? 'Mengunggah…' : 'Upload Gambar'}</span>
        </button>
        <input
          ref={imgFileRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileSelect}
          className="hidden"
        />

        <Btn
          active={showImageUrlInput}
          onClick={() => {
            setShowImageUrlInput((v) => !v);
            setShowYoutubeInput(false);
          }}
          title="Sisipkan Gambar dari URL"
        >
          <ImageIcon className="w-4 h-4" />
        </Btn>

        {/* Embed YouTube Video */}
        <button
          type="button"
          onClick={() => {
            setShowYoutubeInput((v) => !v);
            setShowImageUrlInput(false);
          }}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
            showYoutubeInput
              ? 'bg-[#115E59] text-white border-[#115E59]'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
          title="Sematkan Video YouTube"
        >
          <YoutubeIcon className="w-3.5 h-3.5" />
          <span>Embed Video</span>
        </button>

        <div className="ml-auto flex items-center gap-0.5">
          <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo2 className="w-4 h-4" />
          </Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo2 className="w-4 h-4" />
          </Btn>
        </div>
      </div>

      {/* Inline Embed Bar for YouTube */}
      {showYoutubeInput && (
        <div className="px-3.5 py-2.5 bg-rose-50/70 border-b border-rose-200/70 flex items-center gap-2">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Tempel tautan video YouTube (mis. https://www.youtube.com/watch?v=...)"
            className="flex-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-xs focus:outline-none focus:border-[#115E59]"
          />
          <button
            type="button"
            onClick={handleInsertYoutube}
            className="px-3.5 py-1.5 rounded-xl bg-[#115E59] text-white text-xs font-bold cursor-pointer"
          >
            Sematkan Video
          </button>
        </div>
      )}

      {/* Inline Embed Bar for Image URL */}
      {showImageUrlInput && (
        <div className="px-3.5 py-2.5 bg-emerald-50/70 border-b border-emerald-200/70 flex items-center gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Tempel URL gambar (https://...)"
            className="flex-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:outline-none focus:border-[#115E59]"
          />
          <button
            type="button"
            onClick={handleInsertImageUrl}
            className="px-3.5 py-1.5 rounded-xl bg-[#115E59] text-white text-xs font-bold cursor-pointer"
          >
            Sisipkan Gambar
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        className="px-4 py-3.5 prose prose-sm max-w-none text-slate-800 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[var(--editor-min-h)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_img]:max-h-80 [&_.ProseMirror_iframe]:w-full [&_.ProseMirror_iframe]:aspect-video [&_.ProseMirror_iframe]:rounded-xl"
        style={{ ['--editor-min-h' as any]: minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export const GuruRichViewer: React.FC<{ content: any }> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Link.configure({ openOnClick: true }),
      Image,
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
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
    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_iframe]:w-full [&_.ProseMirror_iframe]:aspect-video [&_.ProseMirror_iframe]:rounded-xl">
      <EditorContent editor={editor} />
    </div>
  );
};
