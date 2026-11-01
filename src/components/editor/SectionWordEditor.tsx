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
import {
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
  ListCheck,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  Minus,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  RemoveFormatting,
  Smile,
  UploadCloud,
  ChevronDown,
  Sparkles,
  Save,
  Clock,
  FileText,
  Palette,
  Highlighter,
  Sliders,
  Type,
  ZoomIn,
  ZoomOut,
  X,
  Check
} from 'lucide-react';
import {
  SectionType,
  SupabaseBucket,
  getSectionToolbarConfig,
  FieldToolbarConfig
} from '../../config/sectionToolbarConfig';
import {
  LetterSpacing,
  WordSpacing,
  ParagraphSpacing,
  TextIndent,
  LineHeight,
  FontSize
} from './customTipTapExtensions';
import { compressImageToWebP } from '../../lib/imageCompressor';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface SectionWordEditorProps {
  sectionType: SectionType | string;
  fieldName?: string;
  value?: string;
  onChange: (html: string) => void;
  onSave?: (html: string) => void;
  bucket?: SupabaseBucket;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
  className?: string;
}

const FONT_FAMILIES = [
  { label: 'Inter (Modern Sans)', value: 'Inter, sans-serif' },
  { label: 'Amiri (Arabic & Kitab)', value: 'Amiri, serif' },
  { label: 'Poppins (Display & Flyer)', value: 'Poppins, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Georgia (Editorial)', value: 'Georgia, serif' },
  { label: 'Arial (Clean)', value: 'Arial, sans-serif' },
  { label: 'Courier New (Monospace)', value: '"Courier New", monospace' },
];

const FONT_SIZES = ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];

const PRESET_COLORS = [
  '#0E7A4C', // Hijau Pondok PPJM
  '#C8A951', // Gold Maknuun
  '#0A2116', // Dark Onyx
  '#1E3A8A', // Navy Santri
  '#0F766E', // Teal
  '#B45309', // Amber
  '#BE123C', // Rose
  '#6D28D9', // Ungu
  '#18181B', // Hitam Pekat
  '#52525B', // Abu-abu Gelap
  '#71717A', // Abu-abu Sedang
  '#A1A1AA', // Abu-abu Terang
  '#059669', // Emerald Cerah
  '#2563EB', // Biru Cerah
  '#DC2626', // Merah
  '#D97706', // Orange
  '#4F46E5', // Indigo
  '#0284C7', // Sky Blue
  '#16A34A', // Green
  '#475569', // Slate
];

const HIGHLIGHT_COLORS = [
  { label: 'Kuning Stabilo', color: '#FEF08A' },
  { label: 'Hijau Muda', color: '#BBF7D0' },
  { label: 'Cyan / Biru Muda', color: '#BAE6FD' },
  { label: 'Pink Lembut', color: '#FBCFE8' },
  { label: 'Orange Pastel', color: '#FED7AA' },
  { label: 'Hapus Sorotan', color: '' },
];

export const SectionWordEditor: React.FC<SectionWordEditorProps> = ({
  sectionType,
  fieldName = 'content',
  value = '',
  onChange,
  onSave,
  bucket: customBucket,
  placeholder: customPlaceholder,
  readOnly = false,
  minHeight: customMinHeight,
  className = '',
}) => {
  const config: FieldToolbarConfig = getSectionToolbarConfig(sectionType, fieldName);
  const effectiveBucket = customBucket || config.bucket || 'cms-images';
  const effectivePlaceholder = customPlaceholder || config.placeholder || 'Tuliskan naskah di sini...';
  const effectiveMinHeight = customMinHeight || config.minHeight || '240px';

  const [activeTab, setActiveTab] = useState<'Home' | 'Insert' | 'Layout'>(config.toolbar.tabs[0] || 'Home');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Popovers
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSpacingModal, setShowSpacingModal] = useState(false);

  // File Input Ref for Local Computer Image Selection
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Draft key for offline/crash recovery
  const draftKey = `draft_${sectionType}_${fieldName}`;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#0E7A4C] dark:text-emerald-400 underline font-semibold',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-3 shadow-md border border-zinc-200 dark:border-zinc-800',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse w-full my-3 border border-zinc-300 dark:border-zinc-700',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-zinc-300 dark:border-zinc-700 p-2 text-sm',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-xl overflow-hidden aspect-video w-full my-4 shadow-lg',
        },
      }),
      Placeholder.configure({
        placeholder: effectivePlaceholder,
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
    ],
    content: value || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      // Debounce auto-save to localStorage draft
      try {
        localStorage.setItem(draftKey, html);
      } catch {}
    },
  });

  // Sync external value changes into editor
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  // Check for auto-saved draft recovery on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft && (!value || value === '<p></p>') && editor) {
        editor.commands.setContent(savedDraft, { emitUpdate: true });
        showToast('Naskah dari draf tersimpan berhasil dipulihkan!');
      }
    } catch {}
  }, [draftKey, editor]);

  // Upload Image From Local Computer with Auto-WebP Compression
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5 MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      // 1. Auto-compress to WebP
      const compressed = await compressImageToWebP(file, 1400, 1400, 0.85);

      let finalUrl = compressed.dataUrl;

      // 2. Upload to Supabase Storage if configured
      if (isSupabaseConfigured()) {
        try {
          const res = await fetch(compressed.dataUrl);
          const blob = await res.blob();
          const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
          const filePath = `editor_${Date.now()}_${cleanName.replace(/\.[^/.]+$/, '')}.webp`;

          const { error: uploadError } = await supabase.storage
            .from(effectiveBucket)
            .upload(filePath, blob, {
              contentType: 'image/webp',
              upsert: true,
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from(effectiveBucket).getPublicUrl(filePath);
            if (urlData?.publicUrl) {
              finalUrl = urlData.publicUrl;
            }
          }
        } catch (storageErr) {
          console.warn('Fallback to WebP dataUrl:', storageErr);
        }
      }

      // 3. Insert image into editor
      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({
            src: finalUrl,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            title: file.name,
          })
          .run();
        showToast(`Foto berhasil dioptimalkan WebP & dimasukkan (${compressed.compressedSizeKB} KB)!`);
      }
    } catch (err: any) {
      alert('Gagal memproses gambar: ' + (err?.message || 'Error'));
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  // Keyboard Shortcuts: Ctrl+S to Save, Escape for Fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave && editor) {
          onSave(editor.getHTML());
          showToast('Naskah berhasil disimpan!');
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, editor, isFullscreen]);

  // Statistics calculation
  const textContent = editor?.getText() || '';
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  if (!editor) return null;

  return (
    <div
      className={`word-editor-wrapper bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col overflow-hidden transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen'
          : ''
      } ${className}`}
    >
      {/* Hidden File Input for Image Upload */}
      <input
        ref={imageFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
        }}
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="absolute top-3 right-4 z-50 bg-[#0E7A4C] text-[#C8A951] px-4 py-2 rounded-xl shadow-lg border border-[#C8A951]/40 text-xs font-bold animate-fadeIn flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A951]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. RIBBON TABS (Office Word Style: Home | Insert | Layout) */}
      <div className="bg-[#f3f3f3] dark:bg-zinc-800/90 border-b border-zinc-200 dark:border-zinc-700/80 px-2 pt-1 flex items-center justify-between select-none">
        <div className="flex items-center gap-0.5">
          {config.toolbar.tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer border-t-2 ${
                activeTab === tab
                  ? 'bg-white dark:bg-zinc-900 text-[#0E7A4C] dark:text-emerald-400 border-[#0E7A4C] shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
              }`}
            >
              {tab === 'Home' ? 'Beranda' : tab === 'Insert' ? 'Sisipkan' : 'Tata Letak'}
            </button>
          ))}
        </div>

        {/* Section Context Pill & Quick Actions */}
        <div className="flex items-center gap-2 pb-1 text-[11px] pr-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/50">
            {config.label}
          </span>
          {onSave && (
            <button
              type="button"
              onClick={() => {
                onSave(editor.getHTML());
                showToast('Konten berhasil disimpan ke Supabase!');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>Simpan</span>
            </button>
          )}
          {config.toolbar.insert.fullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Dokumen Layar Penuh'}
              className="p-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* 2. RIBBON TOOLBAR CONTENT PER TAB */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-1.5 px-2 flex flex-wrap items-center gap-1 min-h-[46px]">
        
        {/* ==================== TAB 1: HOME (BERANDA) ==================== */}
        {activeTab === 'Home' && (
          <>
            {/* Group: Clipboard */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 disabled:opacity-40 transition cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 disabled:opacity-40 transition cursor-pointer"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

            {/* Group: Font Family & Size */}
            {config.toolbar.font.fontFamily && (
              <select
                value={editor.getAttributes('textStyle').fontFamily || config.defaultStyle.fontFamily || ''}
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 max-w-[130px] cursor-pointer"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            )}

            {config.toolbar.font.fontSize && (
              <select
                value={editor.getAttributes('textStyle').fontSize || config.defaultStyle.fontSize || '16px'}
                onChange={(e) => (editor.chain().focus() as any).setFontSize(e.target.value).run()}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 w-[70px] cursor-pointer"
              >
                {FONT_SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            )}

            {/* Font Style Toggles */}
            <div className="flex items-center gap-0.5">
              {config.toolbar.font.bold && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  title="Tebal (Ctrl+B)"
                  className={`p-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                    editor.isActive('bold')
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
              )}

              {config.toolbar.font.italic && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  title="Miring (Ctrl+I)"
                  className={`p-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                    editor.isActive('italic')
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              )}

              {config.toolbar.font.underline && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  title="Garis Bawah (Ctrl+U)"
                  className={`p-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                    editor.isActive('underline')
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>
              )}

              {config.toolbar.font.strike && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  title="Coret Teks"
                  className={`p-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                    editor.isActive('strike')
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              )}

              {config.toolbar.font.color && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    title="Warna Huruf"
                    className="p-1.5 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5 text-[#0E7A4C]" />
                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </button>

                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 z-30 p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 w-48">
                      <span className="text-[10px] font-bold text-zinc-400 block mb-1.5">Pilih Warna Teks:</span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              editor.chain().focus().setColor(c).run();
                              setShowColorPicker(false);
                            }}
                            className="w-6 h-6 rounded-md border border-black/10 hover:scale-110 transition cursor-pointer"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {config.toolbar.font.highlight && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                    title="Sorotan Stabilo (Highlight)"
                    className="p-1.5 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </button>

                  {showHighlightPicker && (
                    <div className="absolute top-full left-0 mt-1 z-30 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 w-40 space-y-1">
                      {HIGHLIGHT_COLORS.map((hl) => (
                        <button
                          key={hl.label}
                          type="button"
                          onClick={() => {
                            if (hl.color) {
                              editor.chain().focus().setHighlight({ color: hl.color }).run();
                            } else {
                              editor.chain().focus().unsetHighlight().run();
                            }
                            setShowHighlightPicker(false);
                          }}
                          className="w-full text-left px-2 py-1 text-xs font-semibold rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 cursor-pointer"
                        >
                          <span
                            className="w-4 h-4 rounded border border-zinc-300 shrink-0"
                            style={{ backgroundColor: hl.color || 'transparent' }}
                          />
                          <span>{hl.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {config.toolbar.font.clearFormatting && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                  title="Hapus Pemformatan (Clear Formatting)"
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  <RemoveFormatting className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

            {/* Group: Headings / Styles */}
            {config.toolbar.paragraph.heading && (
              <select
                value={
                  editor.isActive('heading', { level: 1 })
                    ? 'h1'
                    : editor.isActive('heading', { level: 2 })
                    ? 'h2'
                    : editor.isActive('heading', { level: 3 })
                    ? 'h3'
                    : editor.isActive('heading', { level: 4 })
                    ? 'h4'
                    : editor.isActive('blockquote')
                    ? 'quote'
                    : 'p'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                  else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                  else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                  else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
                  else if (val === 'quote') editor.chain().focus().toggleBlockquote().run();
                  else editor.chain().focus().setParagraph().run();
                }}
                className="text-xs font-bold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <option value="p">Normal (Teks)</option>
                {config.toolbar.paragraph.headingsList?.includes('h1') && <option value="h1">Judul 1 (H1)</option>}
                {config.toolbar.paragraph.headingsList?.includes('h2') && <option value="h2">Judul 2 (H2)</option>}
                {config.toolbar.paragraph.headingsList?.includes('h3') && <option value="h3">Sub Judul (H3)</option>}
                {config.toolbar.paragraph.headingsList?.includes('h4') && <option value="h4">Kategori (H4)</option>}
                {config.toolbar.paragraph.headingsList?.includes('blockquote') && <option value="quote">Kutipan Hikmah</option>}
              </select>
            )}

            {/* Group: Paragraph Alignment */}
            {config.toolbar.paragraph.align && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  title="Rata Kiri"
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    editor.isActive({ textAlign: 'left' })
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  title="Rata Tengah"
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    editor.isActive({ textAlign: 'center' })
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  title="Rata Kanan"
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    editor.isActive({ textAlign: 'right' })
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  title="Rata Kanan-Kiri (Justify)"
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    editor.isActive({ textAlign: 'justify' })
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Group: Lists & Quotes */}
            <div className="flex items-center gap-0.5">
              {config.toolbar.paragraph.bulletList && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  title="Daftar Poin (Bullet List)"
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    editor.isActive('bulletList')
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              )}

              {config.toolbar.paragraph.numberedList && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  title="Daftar Nomor (Numbered List)"
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    editor.isActive('orderedList')
                      ? 'bg-emerald-100 text-[#0E7A4C] dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </>
        )}

        {/* ==================== TAB 2: INSERT (SISIPKAN) ==================== */}
        {activeTab === 'Insert' && (
          <>
            {/* Insert Image From Computer */}
            {config.toolbar.insert.image && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900 text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isUploadingImage ? 'Mengompres WebP...' : 'Foto dari Komputer'}</span>
                </button>
              </div>
            )}

            {/* Insert Link */}
            {config.toolbar.insert.link && (
              <button
                type="button"
                onClick={() => {
                  const previousUrl = editor.getAttributes('link').href;
                  setLinkUrl(previousUrl || '');
                  setShowLinkModal(true);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  editor.isActive('link')
                    ? 'bg-emerald-100 border-emerald-300 text-[#0E7A4C]'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Tautan Link</span>
              </button>
            )}

            {/* Insert Table */}
            {config.toolbar.insert.table && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowTableModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Tabel</span>
                </button>

                {editor.isActive('table') && (
                  <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      title="Tambah Kolom"
                      className="px-1.5 py-0.5 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white rounded"
                    >
                      +Kolom
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      title="Tambah Baris"
                      className="px-1.5 py-0.5 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white rounded"
                    >
                      +Baris
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteTable().run()}
                      title="Hapus Tabel"
                      className="px-1.5 py-0.5 text-[10px] font-bold text-rose-600 hover:bg-white rounded"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Insert YouTube Video */}
            {config.toolbar.insert.youtube && (
              <button
                type="button"
                onClick={() => setShowYoutubeModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>Video YouTube</span>
              </button>
            )}

            {/* Insert Horizontal Rule */}
            {config.toolbar.insert.hr && (
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Garis Pembatas (Horizontal Rule)"
                className="px-2 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Garis Batas</span>
              </button>
            )}
          </>
        )}

        {/* ==================== TAB 3: LAYOUT (TATA LETAK) ==================== */}
        {activeTab === 'Layout' && (
          <>
            {/* Line Height Selector */}
            {config.toolbar.paragraph.lineHeight && (
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-zinc-500">Spasi Baris:</span>
                <select
                  onChange={(e) => (editor.chain().focus() as any).setLineHeight(e.target.value).run()}
                  className="text-xs font-semibold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  defaultValue="1.8"
                >
                  <option value="1.0">1.0 (Rapat)</option>
                  <option value="1.15">1.15</option>
                  <option value="1.5">1.5</option>
                  <option value="1.8">1.8 (Standar PPJM)</option>
                  <option value="2.0">2.0 (Ganda)</option>
                  <option value="2.5">2.5 (Ekstra)</option>
                </select>
              </div>
            )}

            <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

            {/* Letter Spacing */}
            {config.toolbar.paragraph.letterSpacing && (
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-zinc-500">Jarak Huruf:</span>
                <select
                  onChange={(e) => (editor.chain().focus() as any).setLetterSpacing(e.target.value).run()}
                  className="text-xs font-semibold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  defaultValue="normal"
                >
                  <option value="normal">Normal</option>
                  <option value="-0.025em">Rapat (Tight)</option>
                  <option value="0.05em">Renggang (Loose)</option>
                  <option value="0.1em">Sangat Renggang</option>
                </select>
              </div>
            )}

            <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

            {/* Text Indent (First line / Hanging) */}
            {config.toolbar.paragraph.textIndent && (
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-zinc-500">Indentasi:</span>
                <button
                  type="button"
                  onClick={() => (editor.chain().focus() as any).setTextIndent('firstLine', '24px').run()}
                  className="px-2 py-1 text-xs font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  Baris Pertama
                </button>
                <button
                  type="button"
                  onClick={() => (editor.chain().focus() as any).setTextIndent('hanging', '24px').run()}
                  className="px-2 py-1 text-xs font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  Gantung
                </button>
                <button
                  type="button"
                  onClick={() => (editor.chain().focus() as any).setTextIndent('none').run()}
                  className="px-2 py-1 text-xs font-bold rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. EDITOR CANVAS AREA (Microsoft Word Page Layout) */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-100/70 dark:bg-zinc-950/80 flex justify-center ${
          isFullscreen ? 'items-start min-h-screen' : ''
        }`}
      >
        <div
          className="word-page bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl p-6 sm:p-10 transition-all min-h-[inherit]"
          style={{
            minHeight: effectiveMinHeight,
            zoom: `${zoomLevel}%`,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* 4. STATUS BAR (Office Bottom Bar: Word Count, Reading Time, Zoom) */}
      <div className="bg-[#f3f3f3] dark:bg-zinc-800/90 border-t border-zinc-200 dark:border-zinc-700/80 px-3 py-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <FileText className="w-3 h-3 text-zinc-400" />
            <strong className="text-zinc-800 dark:text-zinc-200">{wordCount}</strong> kata
          </span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span>{charCount} karakter</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            ~{readingTime} menit baca
          </span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            Draf otomatis aktif (Auto-saved)
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
            className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
            title="Perkecil Tampilan"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="font-mono text-[11px] w-9 text-center font-bold">{zoomLevel}%</span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
            title="Perbesar Tampilan"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* MODAL: LINK */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-3">
            <h4 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-[#0E7A4C]" />
              <span>Sisipkan Tautan (Link)</span>
            </h4>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setShowLinkModal(false);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                Hapus Link
              </button>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (linkUrl.trim()) {
                    editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
                  }
                  setShowLinkModal(false);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0E7A4C] text-[#C8A951] cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: YOUTUBE */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-3">
            <h4 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Video className="w-4 h-4 text-red-600" />
              <span>Sisipkan Video YouTube</span>
            </h4>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowYoutubeModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (youtubeUrl.trim()) {
                    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl.trim() }).run();
                  }
                  setShowYoutubeModal(false);
                  setYoutubeUrl('');
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0E7A4C] text-[#C8A951] cursor-pointer"
              >
                Sisipkan Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TABLE GRID */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <h4 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <TableIcon className="w-4 h-4 text-[#0E7A4C]" />
              <span>Buat Tabel Baru</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Jumlah Baris:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Jumlah Kolom:
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
                    .run();
                  setShowTableModal(false);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0E7A4C] text-[#C8A951] cursor-pointer"
              >
                Buat Tabel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
