import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Typography from '@tiptap/extension-typography';
import Focus from '@tiptap/extension-focus';
import Gapcursor from '@tiptap/extension-gapcursor';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

import {
  Undo,
  Redo,
  Save,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
  Palette,
  Highlighter,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Video,
  Minus,
  Maximize2,
  Minimize2,
  RemoveFormatting,
  Smile,
  Upload,
  Check,
  X,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { compressImageToWebP } from '../../lib/imageCompressor';
import DOMPurify from 'dompurify';
import { SectionType, getSectionToolbarConfig, FieldToolbarConfig } from '../../config/sectionToolbarConfig';
import {
  LetterSpacing,
  WordSpacing,
  ParagraphSpacing,
  TextIndent,
  LineHeight,
  FontSize
} from './customTipTapExtensions';

export interface WordLikeEditorProps {
  sectionType?: SectionType | string;
  fieldName?: string;
  value?: string;
  onChange?: (html: string) => void;
  onSave?: (html: string) => void;
  placeholder?: string;
  bucket?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  toolbarMode?: 'full' | 'minimal';
  autoSave?: boolean;
  wordCount?: boolean;
  tableName?: string;
  className?: string;
}

const FONT_FAMILIES = [
  { label: 'Default Inter', value: 'Inter, sans-serif' },
  { label: 'Amiri (Arabic & Kitab)', value: 'Amiri, serif' },
  { label: 'Poppins (Modern Flyer)', value: 'Poppins, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Georgia (Editorial)', value: 'Georgia, serif' },
  { label: 'Arial (Clean)', value: 'Arial, sans-serif' },
  { label: 'Courier Monospace', value: 'monospace' }
];

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];

const PRESET_COLORS = [
  '#000000', '#0E7A4C', '#1E3A8A', '#B45309', '#BE123C',
  '#4338CA', '#0F766E', '#C8A951', '#475569', '#6B7280'
];

export const WordLikeEditor: React.FC<WordLikeEditorProps> = ({
  sectionType,
  fieldName,
  value = '',
  onChange,
  onSave,
  placeholder = 'Ketik konten naskah di sini...',
  bucket = 'cms-images',
  minHeight = '280px',
  readOnly = false,
  showToolbar = true,
  toolbarMode,
  autoSave = true,
  wordCount = true,
  className = ''
}) => {
  // Ambil config contextual jika sectionType diberikan
  const config: FieldToolbarConfig | null = sectionType
    ? getSectionToolbarConfig(sectionType, fieldName || 'content')
    : null;

  const effectiveBucket = bucket || config?.bucket || 'cms-images';
  const effectivePlaceholder = placeholder || config?.placeholder || 'Ketik konten naskah di sini...';
  const effectiveMinHeight = minHeight || config?.minHeight || '280px';
  const effectiveMode = toolbarMode || (config?.toolbar.insert.table ? 'full' : 'minimal');

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Modals inside editor
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save debounce timer
  const autoSaveTimerRef = useRef<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        heading: {
          levels: [1, 2, 3, 4]
        }
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
          class: 'text-emerald-700 underline font-medium'
        }
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-3 border border-slate-200'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse w-full my-3'
        }
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-slate-100 p-2 border border-slate-300 font-bold'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border border-slate-300'
        }
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl my-3 border border-slate-200'
        }
      }),
      Placeholder.configure({
        placeholder: effectivePlaceholder
      }),
      Superscript,
      Subscript,
      Typography,
      LetterSpacing,
      WordSpacing,
      ParagraphSpacing,
      TextIndent,
      LineHeight,
      FontSize,
      Focus.configure({
        className: 'has-focus',
        mode: 'all'
      }),
      Gapcursor,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4 border-t border-slate-300'
        }
      })
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);

      if (autoSave && onSave) {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        setIsSaving(true);
        autoSaveTimerRef.current = setTimeout(() => {
          onSave(html);
          setIsSaving(false);
          setLastSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        }, 2000);
      }
    }
  });

  // Sync value from props if changed externally
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Handle Image Upload to Supabase Storage
  const handleUploadImage = async (file: File) => {
    if (!editor) return;
    setIsUploadingImage(true);

    try {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      const compressed = await compressImageToWebP(file, 1200, 0.85);
      const fileName = `editor_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

      const { data, error } = await supabase.storage.from(bucket).upload(fileName, compressed, {
        contentType: 'image/webp',
        upsert: true
      });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      editor.chain().focus().setImage({ src: urlData.publicUrl, alt: file.name }).run();
    } catch (err: any) {
      console.error('Upload image failed:', err);
      alert(`Gagal upload gambar: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Paste image clipboard handler
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleUploadImage(file);
          return;
        }
      }
    }
  };

  // Drag & Drop image handler
  const handleDrop = (e: React.DragEvent) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      e.preventDefault();
      handleUploadImage(files[0]);
    }
  };

  // Stats text
  const textContent = editor?.getText() || '';
  const wordCountVal = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCountVal = textContent.length;
  const readingTimeVal = Math.ceil(wordCountVal / 200) || 1;

  if (!editor) return null;

  return (
    <div
      className={`word-like-editor-container border border-slate-300 rounded-2xl bg-white shadow-xs flex flex-col transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none max-w-5xl mx-auto p-4 sm:p-8 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center'
          : className
      }`}
      onPaste={handlePaste}
      onDrop={handleDrop}
    >
      <div
        className={`w-full bg-white flex flex-col flex-1 overflow-hidden ${
          isFullscreen ? 'rounded-2xl shadow-2xl border border-slate-200 h-[92vh]' : 'rounded-2xl'
        }`}
      >
        {/* TOOLBAR 4 BARIS */}
        {showToolbar && (
          <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-col gap-1.5 select-none text-slate-700 sticky top-0 z-10">
            {/* Baris 1: Undo, Redo, Save Indicator, Fullscreen */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Undo (Ctrl+Z)"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-30"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Redo (Ctrl+Y)"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-30"
                >
                  <Redo className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Save button / indicator */}
                <button
                  type="button"
                  title="Simpan Perubahan Sekarang"
                  onClick={() => onSave?.(editor.getHTML())}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>

                <span className="text-[11px] text-slate-500 ml-2 flex items-center gap-1">
                  {isSaving ? (
                    <span className="text-amber-600 font-medium">Menyimpan...</span>
                  ) : lastSavedTime ? (
                    <span className="text-emerald-700 font-medium">Tersimpan {lastSavedTime}</span>
                  ) : (
                    <span>Siap diedit</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Word Style)'}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Baris 2: Font Family, Font Size, Format Teks (Bold, Italic, Color, Highlight) */}
            <div className="flex flex-wrap items-center gap-1">
              {/* Font Family Dropdown */}
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'default') editor.chain().focus().unsetFontFamily().run();
                  else editor.chain().focus().setFontFamily(val).run();
                }}
                className="text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Bold, Italic, Underline, Strike */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded font-bold ${
                  editor.isActive('bold') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Tebal (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded ${
                  editor.isActive('italic') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Miring (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded ${
                  editor.isActive('underline') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Garis Bawah (Ctrl+U)"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded ${
                  editor.isActive('strike') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Coret (Strike)"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Text Color Picker Quick */}
              <div className="flex items-center gap-0.5">
                {PRESET_COLORS.slice(0, 5).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => editor.chain().focus().setColor(c).run()}
                    style={{ backgroundColor: c }}
                    className="w-4 h-4 rounded-full border border-white shadow-2xs hover:scale-110 transition-transform"
                    title={`Warna ${c}`}
                  />
                ))}
              </div>

              {/* Highlight */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                className={`p-1.5 rounded ${
                  editor.isActive('highlight') ? 'bg-yellow-200 text-yellow-900' : 'hover:bg-slate-200'
                }`}
                title="Sorot Warna Kuning"
              >
                <Highlighter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500"
                title="Hapus Pemformatan"
              >
                <RemoveFormatting className="w-4 h-4" />
              </button>
            </div>

            {/* Baris 3: Heading, Alignment, Lists, Quotes */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`px-2 py-1 text-xs rounded ${
                  editor.isActive('paragraph') ? 'bg-emerald-100 text-emerald-800 font-bold' : 'hover:bg-slate-200'
                }`}
              >
                Paragraf
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded ${
                  editor.isActive('heading', { level: 1 }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Judul Besar H1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Sub Judul H2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-1.5 rounded ${
                  editor.isActive('heading', { level: 3 }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Poin H3"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Alignments */}
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-1.5 rounded ${
                  editor.isActive({ textAlign: 'left' }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Rata Kiri"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-1.5 rounded ${
                  editor.isActive({ textAlign: 'center' }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Rata Tengah"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-1.5 rounded ${
                  editor.isActive({ textAlign: 'right' }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Rata Kanan"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-1.5 rounded ${
                  editor.isActive({ textAlign: 'justify' }) ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Rata Kanan Kiri (Justify)"
              >
                <AlignJustify className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Line Spacing Dropdown (Word Line Heights) */}
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'default') (editor.commands as any).unsetLineHeight?.();
                  else (editor.commands as any).setLineHeight?.(val);
                }}
                className="text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                title="Spasi Baris (Line Height)"
              >
                <option value="default">Spasi Baris</option>
                <option value="1.0">1.0 (Rapat)</option>
                <option value="1.15">1.15 (Normal)</option>
                <option value="1.5">1.5 (Word 1.5)</option>
                <option value="1.8">1.8 (Sambutan Ideal)</option>
                <option value="2.0">2.0 (Ganda)</option>
                <option value="2.5">2.5 (Ekstra)</option>
              </select>

              {/* Letter Spacing Dropdown */}
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'default') (editor.commands as any).unsetLetterSpacing?.();
                  else (editor.commands as any).setLetterSpacing?.(val);
                }}
                className="text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                title="Spasi Huruf (Letter Spacing)"
              >
                <option value="default">Spasi Huruf</option>
                <option value="-0.05em">Tight (-0.05em)</option>
                <option value="normal">Normal</option>
                <option value="0.05em">Loose (+0.05em)</option>
                <option value="0.1em">Wide (+0.1em)</option>
              </select>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Lists & Quotes */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded ${
                  editor.isActive('bulletList') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Daftar Bullet"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded ${
                  editor.isActive('orderedList') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Daftar Berurutan"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded ${
                  editor.isActive('blockquote') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
                title="Kutipan (Blockquote)"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* Baris 4 (Hanya pada mode Full): Link, Image Upload, Table, Video, HR */}
            {toolbarMode === 'full' && (
              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-200/60">
                {/* Link */}
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'}`}
                  title="Sisipkan Link Tautan"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                {editor.isActive('link') && (
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="p-1.5 rounded hover:bg-slate-200 text-rose-600"
                    title="Hapus Link"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                )}

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Upload Image Komputer */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 text-xs rounded hover:bg-slate-200 flex items-center gap-1"
                  title="Unggah Gambar dari Komputer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>{isUploadingImage ? 'Mengunggah...' : 'Sisipkan Gambar'}</span>
                </button>

                {/* Table 3x3 Insert */}
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                  }
                  className="px-2 py-1 text-xs rounded hover:bg-slate-200 flex items-center gap-1"
                  title="Sisipkan Tabel 3x3"
                >
                  <TableIcon className="w-4 h-4 text-blue-700" />
                  <span>Tabel</span>
                </button>

                {/* YouTube Video Embed */}
                <button
                  type="button"
                  onClick={() => setIsYoutubeModalOpen(true)}
                  className="px-2 py-1 text-xs rounded hover:bg-slate-200 flex items-center gap-1"
                  title="Sisipkan Video YouTube"
                >
                  <Video className="w-4 h-4 text-red-600" />
                  <span>Video YouTube</span>
                </button>

                {/* Horizontal Rule */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
                  title="Garis Pembatas Horizontal"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTENT AREA EDITOR */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 cursor-text"
          style={{ minHeight }}
          onClick={() => editor.commands.focus()}
        >
          <div style={{ zoom: `${zoomLevel}%` }}>
            <EditorContent editor={editor} className="prose prose-emerald max-w-none focus:outline-none" />
          </div>
        </div>

        {/* STATUS BAR BAWAH (Word Count, Char, Reading Time, Zoom) */}
        {wordCount && (
          <div className="bg-slate-100/80 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span>{wordCountVal} Kata</span>
              <span>{charCountVal} Karakter</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{readingTimeVal} menit baca
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Zoom:</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-bold"
              >
                -
              </button>
              <span className="w-10 text-center font-medium">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-bold"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL LINK */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">Sisipkan Tautan Web</h4>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (linkUrl) {
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                    setLinkUrl('');
                  }
                  setIsLinkModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              >
                Pasang Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL YOUTUBE */}
      {isYoutubeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">Sisipkan Video YouTube</h4>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsYoutubeModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (youtubeUrl) {
                    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
                    setYoutubeUrl('');
                  }
                  setIsYoutubeModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              >
                Sisipkan Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

