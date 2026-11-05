import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  GripVertical, Trash2, Plus, Save, ImagePlus, Eye, EyeOff, Search, ChevronDown, ChevronUp,
  Bold, Italic, List, Monitor, Tablet, Smartphone, Sparkles, Layers, CheckCircle2, AlertCircle,
  HelpCircle, Info, FileText, Image, Calendar, BarChart3, Code as CodeIcon,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import { crudByKey, type CrudSection, type Field } from './sections';
import { convertImageToWebP, formatBytes } from '../lib/webpConverter';
import { invalidateCache } from '../lib/queryCache';

type Row = Record<string, unknown> & { id: string };
type Draft = Record<string, string | boolean>;
type Device = 'desktop' | 'tablet' | 'mobile';
const WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };
const MAX_RAW_IMAGE = 20 * 1024 * 1024; // Allow up to 20 MB camera photos; auto-compressed to ~120 KB WebP
const input = 'w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm disabled:bg-zinc-50 focus:border-[#115E59] focus:outline-none focus:ring-2 focus:ring-[#115E59]/15';

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

export interface GallerySlideItem {
  photo_url: string;
  caption?: string;
}

/** Map Postgres text[] location array to human-friendly dropdown string */
function arrayLocationToSelectValue(val: unknown, options?: string[]): string {
  if (Array.isArray(val)) {
    const arr = val.map((x) => String(x).trim()).filter(Boolean);
    if (arr.length === 0) return options?.[0] ?? 'Aula Utama PP. Jauharul Maknuun';
    // Check if the first item matches one of the explicit options
    const firstNonSystem = arr.find((item) => item !== 'home' && item !== 'galeri' && item !== 'berita' && item !== 'jm-center' && item !== 'prestasi');
    if (firstNonSystem) return firstNonSystem;
    if (arr.includes('home') && arr.includes('galeri')) return 'Beranda & Galeri (Utama)';
    if (arr.includes('galeri')) return 'Halaman Galeri Foto';
    if (arr.includes('home')) return 'Halaman Beranda (Home)';
    return arr[0];
  }
  if (typeof val === 'string' && val.trim()) {
    return val.trim();
  }
  return options?.[0] ?? 'Aula Utama PP. Jauharul Maknuun';
}

/** Convert selected dropdown string into valid Postgres text[] array for location column */
function selectValueToLocationArray(secKey: string, selected: string): string[] {
  const s = selected.trim();
  const defaultTags =
    secKey === 'galeri_foto'
      ? ['home', 'galeri']
      : secKey === 'berita'
        ? ['home', 'berita']
        : secKey === 'prestasi'
          ? ['home', 'prestasi']
          : ['home', 'jm-center'];

  if (!s || s === 'Beranda & Galeri (Utama)' || s === 'Beranda & Berita (Utama)' || s === 'Beranda & JM Center') {
    return defaultTags;
  }
  if (s === 'Halaman Galeri Foto') return ['galeri'];
  if (s === 'Halaman Beranda (Home)') return ['home'];
  // Store the chosen campus location as first element + system page routing tags
  return Array.from(new Set([s, ...defaultTags]));
}

/** Parse gallery_photos JSON string safely */
function parseGalleryPhotos(raw: string, fallbackUrl?: string, fallbackCaption?: string): GallerySlideItem[] {
  let list: GallerySlideItem[] = [];
  if (raw && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed
          .filter((x) => x && typeof x === 'object')
          .map((x) => ({
            photo_url: typeof x.photo_url === 'string' ? x.photo_url : '',
            caption: typeof x.caption === 'string' ? x.caption : '',
          }));
      }
    } catch {
      list = [];
    }
  }
  while (list.length < 3) {
    list.push({
      photo_url: list.length === 0 && fallbackUrl ? fallbackUrl : '',
      caption: list.length === 0 && fallbackCaption ? fallbackCaption : '',
    });
  }
  return list.slice(0, 3);
}

/** Baris DB → nilai form (semua string/boolean agar mudah diedit). */
function toDraft(sec: CrudSection, row: Row | null): Draft {
  const d: Draft = {};
  for (const f of sec.fields) {
    const v = row ? row[f.key] : f.defaultValue;
    if (f.kind === 'bool') {
      d[f.key] = row ? v === true : Boolean(f.defaultValue ?? false);
    } else if (f.kind === 'lines') {
      d[f.key] = Array.isArray(v) ? (v as unknown[]).map(String).join('\n') : '';
    } else if (f.kind === 'select_array') {
      d[f.key] = arrayLocationToSelectValue(v, f.options);
    } else if (f.kind === 'gallery_photos') {
      const arr = Array.isArray(v) ? v : [];
      d[f.key] = JSON.stringify(arr, null, 2);
    } else if (f.kind === 'json') {
      d[f.key] = v == null ? '' : JSON.stringify(v, null, 2);
    } else if (f.kind === 'date') {
      d[f.key] = typeof v === 'string' && v ? v.slice(0, 10) : new Date().toISOString().slice(0, 10);
    } else if (f.kind === 'select') {
      d[f.key] = v == null || v === '' ? (f.options?.[0] ?? '') : String(v);
    } else {
      d[f.key] = v == null ? '' : String(v);
    }
  }
  return d;
}

/** Nilai form → payload DB. Melempar Error berisi pesan ramah jika tidak valid. */
function toPayload(sec: CrudSection, d: Draft): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of sec.fields) {
    const v = d[f.key];
    if (f.kind === 'bool') {
      out[f.key] = v === true;
      continue;
    }
    const s = String(v ?? '').trim();

    if (f.kind === 'select_array') {
      out[f.key] = selectValueToLocationArray(sec.key, s || (f.options?.[0] ?? ''));
      continue;
    }

    if (f.kind === 'gallery_photos') {
      const primaryUrl = String(d.image_url ?? '').trim();
      const primaryCaption = String(d.description ?? d.title ?? '').trim();
      const slides = parseGalleryPhotos(s, primaryUrl, primaryCaption)
        .filter((item) => item.photo_url.trim() !== '')
        .map((item) => ({
          photo_url: item.photo_url.trim(),
          caption: item.caption?.trim() || primaryCaption || String(d.title ?? 'Dokumentasi PPJM'),
        }));

      if (primaryUrl) {
        if (slides.length === 0) {
          slides.push({ photo_url: primaryUrl, caption: primaryCaption || String(d.title ?? 'Dokumentasi PPJM') });
        } else {
          slides[0].photo_url = primaryUrl;
        }
      }
      out[f.key] = slides;
      continue;
    }

    if (f.required && !s) {
      // Allow gallery_photos Slide 1 to satisfy image_url if user uploaded into Slide 1 first
      if (f.key === 'image_url' && d.photos) {
        const slides = parseGalleryPhotos(String(d.photos));
        const firstUrl = slides.find((item) => item.photo_url.trim())?.photo_url.trim();
        if (firstUrl) {
          out[f.key] = firstUrl;
          continue;
        }
      }
      throw new Error(`Kolom "${f.label}" wajib diisi terlebih dahulu.`);
    }

    if (f.kind === 'lines') {
      out[f.key] = s ? s.split('\n').map((x) => x.trim()).filter(Boolean) : [];
    } else if (f.kind === 'json') {
      if (!s) {
        out[f.key] = f.defaultValue !== undefined ? f.defaultValue : null;
      } else {
        try {
          out[f.key] = JSON.parse(s);
        } catch {
          throw new Error(`Kolom "${f.label}" bukan format JSON yang valid.`);
        }
      }
    } else if (f.kind === 'number') {
      if (!s) {
        out[f.key] = f.defaultValue !== undefined ? Number(f.defaultValue) : null;
      } else if (Number.isNaN(Number(s))) {
        throw new Error(`Kolom "${f.label}" harus berupa angka.`);
      } else {
        out[f.key] = Number(s);
      }
    } else if (f.kind === 'date') {
      out[f.key] = s || new Date().toISOString().slice(0, 10);
    } else if (f.kind === 'select') {
      out[f.key] = s || (f.options?.[0] ?? null);
    } else {
      out[f.key] = s === '' ? (f.defaultValue !== undefined ? f.defaultValue : null) : s;
    }
  }

  if (sec.slugFrom && !out.slug) {
    const baseSlug = slugify(String(d[sec.slugFrom] ?? ''));
    out.slug = baseSlug ? `${baseSlug}-${Date.now().toString(36).slice(-4)}` : `post-${Date.now()}`;
  }
  return out;
}

const RichField: React.FC<{ value: string; disabled: boolean; onChange: (html: string) => void }> = ({ value, disabled, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });
  const b = (a: boolean) => `rounded-lg p-1.5 ${a ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex gap-1 border-b border-zinc-100 p-1">
        <button type="button" className={b(!!editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Tebal"><Bold size={14} /></button>
        <button type="button" className={b(!!editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Miring"><Italic size={14} /></button>
        <button type="button" className={b(!!editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Daftar"><List size={14} /></button>
      </div>
      <EditorContent editor={editor} className="p-2.5 text-sm [&_.ProseMirror]:min-h-[110px] [&_.ProseMirror]:outline-none" />
    </div>
  );
};

const GalleryPhotosEditor: React.FC<{
  value: string;
  primaryImageUrl: string;
  disabled: boolean;
  onChange: (jsonStr: string) => void;
  onPrimaryImageChange: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}> = ({ value, primaryImageUrl, disabled, onChange, onPrimaryImageChange, onUpload }) => {
  const [busySlot, setBusySlot] = useState<number | 'batch' | null>(null);
  const slides = useMemo(() => parseGalleryPhotos(value, primaryImageUrl), [value, primaryImageUrl]);

  const updateSlide = (idx: number, patch: Partial<GallerySlideItem>) => {
    const next = slides.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    if (idx === 0 && patch.photo_url !== undefined && patch.photo_url.trim()) {
      onPrimaryImageChange(patch.photo_url.trim());
    }
    onChange(JSON.stringify(next, null, 2));
  };

  const handleBatchUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusySlot('batch');
    const selected = Array.from(files).slice(0, 3);
    const next = [...slides];
    for (let i = 0; i < selected.length; i++) {
      const uploadedUrl = await onUpload(selected[i]);
      if (uploadedUrl) {
        next[i] = {
          ...next[i],
          photo_url: uploadedUrl,
        };
        if (i === 0) {
          onPrimaryImageChange(uploadedUrl);
        }
      }
    }
    onChange(JSON.stringify(next, null, 2));
    setBusySlot(null);
  };

  return (
    <div className="space-y-2.5 rounded-xl border border-teal-900/15 bg-[#FAF7F0]/70 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950">
          <Sparkles size={14} className="text-amber-600" />
          <span>3 Foto Slider (Otomatis Dikonversi ke Format Ringan WebP)</span>
        </div>
        {!disabled && (
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#115E59] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0F4C48] transition-colors">
            <ImagePlus size={13} />
            <span>{busySlot === 'batch' ? 'Mengonversi & Mengunggah 3 Foto…' : 'Pilih 3 Foto Sekaligus'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={busySlot !== null}
              onChange={(e) => {
                void handleBatchUpload(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        )}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {slides.map((slide, idx) => (
          <div key={idx} className="space-y-2 rounded-lg border border-zinc-200 bg-white p-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-900">
              <span>Slide Foto {idx + 1} {idx === 0 ? '(Utama)' : ''}</span>
              {slide.photo_url && (
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700">
                  WebP Ready
                </span>
              )}
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200/60">
              {slide.photo_url ? (
                <img src={slide.photo_url} alt={`Slide ${idx + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[11px] text-zinc-400">
                  Belum ada foto
                </div>
              )}
            </div>
            {!disabled && (
              <label className="inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-teal-900/20 bg-teal-50/50 py-1.5 text-[11px] font-semibold text-[#115E59] hover:bg-teal-50">
                <ImagePlus size={12} />
                <span>{busySlot === idx ? 'Mengonversi WebP…' : slide.photo_url ? 'Ganti Foto' : 'Upload Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busySlot !== null}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setBusySlot(idx);
                    const url = await onUpload(file);
                    setBusySlot(null);
                    if (url) updateSlide(idx, { photo_url: url });
                  }}
                />
              </label>
            )}
            <input
              type="text"
              value={slide.caption ?? ''}
              disabled={disabled}
              onChange={(e) => updateSlide(idx, { caption: e.target.value })}
              placeholder={`Keterangan foto slide ${idx + 1}…`}
              className="w-full rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-normal text-zinc-700 focus:border-[#115E59] focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/** FieldInputTip: Panduan input spesifik per tipe kolom, ditampilkan di bawah setiap input. */
const FieldInputTip: React.FC<{ kind: Field['kind']; label: string }> = ({ kind, label }) => {
  const tips: Record<string, { icon: React.ElementType; text: string; color: string }> = {
    text: {
      icon: FileText,
      text: 'Ketik teks secara bebas. Hindari karakter khusus berlebihan. Gunakan huruf kapital pertama untuk judul agar rapi.',
      color: 'text-slate-700 border-slate-200 bg-slate-50',
    },
    textarea: {
      icon: FileText,
      text: 'Tulis konten lengkap. Tekan Enter untuk paragraf baru. Hindari menempel teks dengan formatting rumit dari Word.',
      color: 'text-slate-700 border-slate-200 bg-slate-50',
    },
    lines: {
      icon: List,
      text: 'Satu baris = satu entri. Tekan Enter untuk baris baru. Contoh: "Baris 1", "Baris 2", dst.',
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    },
    json: {
      icon: CodeIcon,
      text: 'Masukkan JSON yang valid. Contoh: {"nama": "value", "angka": 1}. Pastikan semua kunci menggunakan kutip ganda.',
      color: 'text-indigo-700 border-indigo-200 bg-indigo-50',
    },
    rich: {
      icon: Bold,
      text: 'Gunakan tombol formatting di atas (tebal, miring, daftar) untuk konten yang akan ditampilkan di website.',
      color: 'text-purple-700 border-purple-200 bg-purple-50',
    },
    select: {
      icon: ChevronDown,
      text: 'Pilih salah satu opsi dari daftar drop-down yang tersedia.',
      color: 'text-blue-700 border-blue-200 bg-blue-50',
    },
    select_array: {
      icon: Layers,
      text: 'Pilih salah satu lokasi. Sistem akan otomatis menambahkan tag halaman yang sesuai.',
      color: 'text-orange-700 border-orange-200 bg-orange-50',
    },
    image: {
      icon: Image,
      text: 'Unggah file gambar dari komputer. Otomatis dikonversi ke format WebP ringan (maksimal 20 MB).',
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    },
    number: {
      icon: BarChart3,
      text: 'Masukkan angka saja. Hindari spasi, koma, atau simbol mata uang.',
      color: 'text-cyan-700 border-cyan-200 bg-cyan-50',
    },
    date: {
      icon: Calendar,
      text: 'Pilih tanggal dari kalender atau ketik dalam format YYYY-MM-DD (contoh: 2026-11-05).',
      color: 'text-cyan-700 border-cyan-200 bg-cyan-50',
    },
    bool: {
      icon: CheckCircle2,
      text: 'Centang jika AKTIF / ditampilkan. Biarkan kosong jika NONAKTIF / disembunyikan.',
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    },
    gallery_photos: {
      icon: Image,
      text: 'Unggah hingga 3 foto slider. Setiap foto otomatis dikonversi ke WebP. Isi keterangan untuk aksesibilitas.',
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    },
  };
  const tip = tips[kind] ?? tips.text;
  return (
    <div className="mt-1 flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-[10px] font-medium bg-[var(--bg)] text-[var(--color)]">
      <tip.icon className="w-3 h-3 shrink-0" />
      <span>{tip.text}</span>
    </div>
  );
};

const FieldInput: React.FC<{
  sec: CrudSection;
  f: Field;
  value: string | boolean;
  draft: Draft;
  disabled: boolean;
  onChange: (v: string | boolean) => void;
  onDraftField?: (key: string, v: string | boolean) => void;
  onUpload: (file: File) => Promise<string | null>;
}> = ({ sec, f, value, draft, disabled, onChange, onDraftField, onUpload }) => {
  const [busy, setBusy] = useState(false);
  const str = String(value ?? '');
  let control: React.ReactNode;

  switch (f.kind) {
    case 'bool':
      control = (
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#115E59] rounded"
            checked={value === true}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{f.label}</span>
        </label>
      );
      return <div>{control}</div>;

    case 'textarea':
      control = (
        <textarea
          className={`${input} resize-y`}
          rows={3}
          value={str}
          disabled={disabled}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;

    case 'lines':
      control = (
        <textarea
          className={`${input} resize-y font-mono text-xs`}
          rows={3}
          value={str}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;

    case 'json':
      control = (
        <textarea
          className={`${input} resize-y font-mono text-xs`}
          rows={5}
          value={str}
          disabled={disabled}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;

    case 'rich':
      control = <RichField value={str} disabled={disabled} onChange={onChange} />;
      break;

    case 'select': {
      const opts = f.options ?? [];
      const hasCurrent = !str || opts.includes(str);
      control = (
        <select
          className={input}
          value={str || opts[0] || ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {!hasCurrent && str && <option value={str}>{str}</option>}
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    }

    case 'select_array': {
      const opts = f.options ?? [];
      const currentVal = str || opts[0] || '';
      const hasCurrent = !currentVal || opts.includes(currentVal);
      const previewArray = selectValueToLocationArray(sec.key, currentVal);
      control = (
        <div className="space-y-1.5">
          <select
            className={input}
            value={currentVal}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          >
            {!hasCurrent && currentVal && <option value={currentVal}>{currentVal}</option>}
            {opts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10.5px] font-normal text-zinc-500">Tag Lokasi Aktif:</span>
            {previewArray.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-teal-50 border border-teal-200/70 px-2 py-0.5 text-[10px] font-semibold text-teal-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      );
      break;
    }

    case 'gallery_photos':
      control = (
        <GalleryPhotosEditor
          value={str}
          primaryImageUrl={String(draft.image_url ?? '')}
          disabled={disabled}
          onChange={(jsonStr) => onChange(jsonStr)}
          onPrimaryImageChange={(url) => onDraftField?.('image_url', url)}
          onUpload={onUpload}
        />
      );
      break;

    case 'image':
      control = (
        <div className="flex flex-wrap items-center gap-3">
          <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200/70">
            {str ? <img src={str} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="text-zinc-300" />}
          </div>
          <div className="flex flex-col gap-1.5">
            {!disabled && (
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-900/15 px-3 py-1.5 text-xs font-semibold text-[#115E59] hover:bg-teal-100/70 transition-colors w-fit">
                <ImagePlus size={14} />
                <span>{busy ? 'Mengonversi ke WebP & Mengunggah…' : str ? 'Ganti Foto (Auto WebP)' : 'Unggah Foto (Auto WebP)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busy}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setBusy(true);
                    const url = await onUpload(file);
                    setBusy(false);
                    if (url) onChange(url);
                  }}
                />
              </label>
            )}
            <span className="text-[10.5px] font-normal text-emerald-700 flex items-center gap-1">
              <Sparkles size={11} /> Otomatis dikompres ke format ringan .webp sebelum disimpan
            </span>
          </div>
        </div>
      );
      break;

    default:
      control = (
        <input
          className={input}
          type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : 'text'}
          value={str}
          disabled={disabled}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  return (
    <div className="block space-y-1 text-xs font-bold text-zinc-700">
      <span>
        {f.label}
        {f.required && <span className="text-red-600"> *</span>}
      </span>
      {control}
      {f.help && <span className="block font-normal text-zinc-500">{f.help}</span>}
      <FieldInputTip kind={f.kind} label={f.label} />
    </div>
  );
};

const Item: React.FC<{
  sec: CrudSection; row: Row; draft: Draft; open: boolean; sortable: boolean;
  canEdit: boolean; canDelete: boolean; canPublish: boolean; saving: boolean;
  onToggleOpen: () => void; onDraft: (k: string, v: string | boolean) => void;
  onSave: () => void; onDelete: () => void; onToggleActive: () => void; onUpload: (file: File) => Promise<string | null>;
}> = ({ sec, row, draft, open, sortable, canEdit, canDelete, canPublish, saving, onToggleOpen, onDraft, onSave, onDelete, onToggleActive, onUpload }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id, disabled: !sortable });
  const active = sec.activeField ? row[sec.activeField] !== false && row[sec.activeField] != null : true;
  const img = sec.imageField ? (row[sec.imageField] as string | null) : null;
  const main = sec.fields.filter((f) => !f.advanced);
  const adv = sec.fields.filter((f) => f.advanced);
  const [showAdv, setShowAdv] = useState(false);
  const title = String(row[sec.titleField] ?? '') || '(tanpa judul)';
  const sub = sec.subtitleField ? String(row[sec.subtitleField] ?? '') : '';
  const badge = sec.badgeField ? String(row[sec.badgeField] ?? '') : '';

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border bg-white ${isDragging ? 'border-[#115E59] shadow-md' : 'border-zinc-200'} ${active ? '' : 'opacity-60'}`}
    >
      <div className="flex items-center gap-2 p-2.5">
        {sortable && (
          <button {...attributes} {...listeners} className="cursor-grab touch-none text-zinc-400" aria-label="Geser urutan">
            <GripVertical size={16} />
          </button>
        )}
        {sec.imageField && (
          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
            {img && <img src={img} alt="" className="h-full w-full object-cover" />}
          </div>
        )}
        <button type="button" onClick={onToggleOpen} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <p className="truncate text-sm font-semibold text-teal-950">{title}</p>
          <p className="truncate text-xs text-zinc-500">{[badge, sub].filter(Boolean).join(' · ')}</p>
        </button>
        {sec.activeField && canPublish && (
          <button
            onClick={onToggleActive}
            className="text-zinc-500 hover:text-[#115E59]"
            aria-label={active ? 'Sembunyikan dari website' : 'Tampilkan di website'}
            title={active ? 'Tampil di website' : 'Disembunyikan'}
          >
            {active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
        <button onClick={onToggleOpen} className="text-zinc-400" aria-label={open ? 'Tutup' : 'Buka'}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {open && (
        <div className="space-y-3 border-t border-zinc-100 p-3">
          {main.map((f) => (
            <FieldInput
              key={f.key}
              sec={sec}
              f={f}
              value={draft[f.key]}
              draft={draft}
              disabled={!canEdit}
              onChange={(v) => onDraft(f.key, v)}
              onDraftField={(k, v) => onDraft(k, v)}
              onUpload={onUpload}
            />
          ))}
          {adv.length > 0 && (
            <div>
              <button type="button" onClick={() => setShowAdv((v) => !v)} className="text-xs font-semibold text-zinc-600 underline">
                {showAdv ? 'Sembunyikan' : 'Tampilkan'} pengaturan lanjutan
              </button>
              {showAdv && (
                <div className="mt-2 space-y-3 rounded-lg bg-zinc-50 p-3">
                  {adv.map((f) => (
                    <FieldInput
                      key={f.key}
                      sec={sec}
                      f={f}
                      value={draft[f.key]}
                      draft={draft}
                      disabled={!canEdit}
                      onChange={(v) => onDraft(f.key, v)}
                      onDraftField={(k, v) => onDraft(k, v)}
                      onUpload={onUpload}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            {canDelete ? (
              <button onClick={onDelete} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                <Trash2 size={14} /> Hapus
              </button>
            ) : (
              <span />
            )}
            {canEdit && (
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save size={15} /> {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Editor: React.FC<{ sec: CrudSection }> = ({ sec }) => {
  const admin = useOutletContext<AdminOutletContext>();
  const canView = admin.can(sec.key, 'view');
  const canCreate = admin.can(sec.key, 'create');
  const canEdit = admin.can(sec.key, 'edit');
  const canDelete = admin.can(sec.key, 'delete');
  const canPublish = admin.can(sec.key, 'publish');

  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<Draft | null>(null);
  const [q, setQ] = useState('');
  const [device, setDevice] = useState<Device>('desktop');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'error' | 'ok'>('idle');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await db
      .from(sec.table)
      .select('*')
      .order(sec.sort.col, { ascending: sec.sort.asc })
      .limit(300);
    if (error) {
      setStatus('error');
      setMsg(`Gagal memuat data: ${error.message}`);
    }
    const list = ((data as Row[] | null) ?? []).map((r) => ({ ...r, id: String(r.id) }));
    setRows(list);
    setDrafts(Object.fromEntries(list.map((r) => [r.id, toDraft(sec, r)])));
    setReady(true);
  }, [sec]);

  useEffect(() => {
    setReady(false);
    setOpenId(null);
    setNewRow(null);
    setMsg('');
    void load();
  }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const fail = (m: string) => {
    setStatus('error');
    setMsg(m);
  };
  const ok = (m: string) => {
    setStatus('ok');
    setMsg(m);
  };

  /** Automatically converts uploaded image into lightweight WebP before uploading to Supabase Storage */
  const upload = async (rawFile: File): Promise<string | null> => {
    if (rawFile.size > MAX_RAW_IMAGE) {
      fail('Ukuran file asli maksimal 20 MB.');
      return null;
    }

    const converted = await convertImageToWebP(rawFile, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82,
      targetMaxBytes: 320 * 1024,
    });

    const uploadFile = converted.file;
    const isWebp = uploadFile.type === 'image/webp';
    const ext = isWebp ? 'webp' : uploadFile.type === 'image/png' ? 'png' : 'jpg';
    const path = `${sec.table}/${crypto.randomUUID()}.${ext}`;

    const { error } = await db.storage.from('cms-images').upload(path, uploadFile, {
      contentType: uploadFile.type,
      cacheControl: '31536000',
      upsert: false,
    });

    if (error) {
      fail(`Gagal mengunggah gambar: ${error.message}`);
      return null;
    }

    const publicUrl = db.storage.from('cms-images').getPublicUrl(path).data.publicUrl;
    if (isWebp && converted.savedPercent > 0) {
      ok(
        `Foto otomatis dikonversi ke WebP ringan: ${formatBytes(converted.originalSize)} → ${formatBytes(converted.compressedSize)} (Hemat ${converted.savedPercent}%)`,
      );
    } else {
      ok(`Foto berhasil diunggah (${formatBytes(converted.compressedSize)}).`);
    }
    return publicUrl;
  };

  const refreshCaches = () => {
    if (sec.table === 'galeri_foto') invalidateCache('gallery_photo_activities_v2');
    if (sec.table === 'galeri_videos') invalidateCache('gallery_video_activities_v2');
  };

  const saveRow = async (row: Row) => {
    setSavingId(row.id);
    try {
      const payload = toPayload(sec, drafts[row.id]);
      const { error } = await db.from(sec.table).update(payload).eq('id', row.id);
      if (error) {
        throw new Error(`Gagal menyimpan perubahan: ${error.message}`);
      }
      refreshCaches();
      await load();
      ok('Perubahan berhasil disimpan. Website publik telah diperbarui.');
    } catch (e) {
      fail((e as Error).message);
    }
    setSavingId(null);
  };

  const createRow = async () => {
    if (!newRow) return;
    setSavingId('new');
    try {
      const payload = toPayload(sec, newRow);
      if (sec.authorField && admin.session) payload[sec.authorField] = admin.session.user.id;
      if (sec.orderField) payload[sec.orderField] = rows.length;
      if (sec.activeField) payload[sec.activeField] = true;
      if (sec.publishedAtField && !payload[sec.publishedAtField]) {
        payload[sec.publishedAtField] = new Date().toISOString();
      }

      const { error } = await db.from(sec.table).insert(payload);
      if (error) {
        throw new Error(`Gagal menambah data: ${error.message}`);
      }
      refreshCaches();
      setNewRow(null);
      await load();
      ok('Data baru berhasil ditambahkan dan dipublikasikan.');
    } catch (e) {
      fail((e as Error).message);
    }
    setSavingId(null);
  };

  const removeRow = async (row: Row) => {
    if (!window.confirm('Hapus data ini? Tindakan ini tidak bisa dibatalkan.')) return;
    const { error } = await db.from(sec.table).delete().eq('id', row.id);
    if (error) return fail(`Gagal menghapus data: ${error.message}`);
    refreshCaches();
    await load();
    ok('Data berhasil dihapus.');
  };

  const toggleActive = async (row: Row) => {
    if (!sec.activeField) return;
    const next = row[sec.activeField] === false || row[sec.activeField] == null;
    const patch: Record<string, unknown> = { [sec.activeField]: next };
    if (sec.publishedAtField && next && !row[sec.publishedAtField]) {
      patch[sec.publishedAtField] = new Date().toISOString();
    }
    const { error } = await db.from(sec.table).update(patch).eq('id', row.id);
    if (error) return fail(`Gagal mengubah status tampil: ${error.message}`);
    refreshCaches();
    await load();
  };

  const onDragEnd = async (e: DragEndEvent) => {
    if (!sec.orderField || !e.over || e.active.id === e.over.id) return;
    const from = rows.findIndex((r) => r.id === e.active.id);
    const to = rows.findIndex((r) => r.id === e.over!.id);
    const next = arrayMove(rows, from, to);
    setRows(next);
    const results = await Promise.all(
      next.map((r, i) => db.from(sec.table).update({ [sec.orderField!]: i }).eq('id', r.id)),
    );
    if (results.some((r) => r.error)) {
      fail('Urutan tidak tersimpan.');
      await load();
    } else {
      refreshCaches();
    }
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) =>
      [sec.titleField, sec.subtitleField, sec.badgeField].some(
        (k) => k && String(r[k] ?? '').toLowerCase().includes(t),
      ),
    );
  }, [rows, q, sec]);

  const devBtn = (a: boolean) => `rounded-lg p-1.5 ${a ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;
  const sortable = Boolean(sec.orderField && canEdit && !q);

  if (!canView) return <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Anda tidak punya akses melihat bagian ini.</p>;
  if (!ready) return <p className="text-sm text-zinc-500">Memuat…</p>;

  const visible = sec.activeField
    ? filtered.filter((r) => r[sec.activeField!] !== false && r[sec.activeField!] != null)
    : filtered;

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-teal-950">{sec.label}</h1>
            <p className="text-xs text-zinc-500">
              Semua foto yang diunggah otomatis dikonversi ke format ringan <span className="font-semibold text-emerald-700">WebP</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canCreate && (
              <Link
                to={`/admin/bulk?table=${sec.key}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#115E59]/30 bg-teal-50/70 px-3 py-2 text-xs font-bold text-[#115E59] hover:bg-teal-100/70 transition-colors"
              >
                <Layers size={14} /> Bulk Upload / Massal
              </Link>
            )}
            {canCreate && (
              <button
                onClick={() => {
                  setNewRow(toDraft(sec, null));
                  setOpenId(null);
                  setMsg('');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#0F4C48] transition-colors shadow-xs"
              >
                <Plus size={15} /> Tambah {sec.label}
              </button>
            )}
          </div>
        </div>

        {!canEdit && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Anda hanya bisa melihat bagian ini.</p>}

        {msg && (
          <div
            role="status"
            className={`flex items-start gap-2 rounded-xl border p-3 text-xs font-medium ${
              status === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            {status === 'error' ? (
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
            ) : (
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
            )}
            <span>{msg}</span>
          </div>
        )}

        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari…" className={`${input} pl-9`} />
        </div>

        {newRow && (
          <div className="space-y-3 rounded-xl border-2 border-[#115E59]/40 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <p className="text-sm font-bold text-teal-950">Tambah {sec.label} Baru</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700">
                Auto WebP Optimizer Aktif
              </span>
            </div>
            {sec.fields
              .filter((f) => !f.advanced)
              .map((f) => (
                <FieldInput
                  key={f.key}
                  sec={sec}
                  f={f}
                  value={newRow[f.key]}
                  draft={newRow}
                  disabled={false}
                  onChange={(v) => setNewRow((d) => (d ? { ...d, [f.key]: v } : d))}
                  onDraftField={(k, v) => setNewRow((d) => (d ? { ...d, [k]: v } : d))}
                  onUpload={upload}
                />
              ))}
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setNewRow(null)}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={createRow}
                disabled={savingId === 'new'}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#0F4C48]"
              >
                <Save size={15} />
                {savingId === 'new' ? 'Menyimpan…' : 'Simpan & Publikasikan'}
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">Belum ada data.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={filtered.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {filtered.map((r) => (
                  <Item
                    key={r.id}
                    sec={sec}
                    row={r}
                    draft={drafts[r.id] ?? toDraft(sec, r)}
                    open={openId === r.id}
                    sortable={sortable}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canPublish={canPublish}
                    saving={savingId === r.id}
                    onToggleOpen={() => setOpenId((c) => (c === r.id ? null : r.id))}
                    onDraft={(k, v) =>
                      setDrafts((d) => ({ ...d, [r.id]: { ...(d[r.id] ?? toDraft(sec, r)), [k]: v } }))
                    }
                    onSave={() => saveRow(r)}
                    onDelete={() => removeRow(r)}
                    onToggleActive={() => toggleActive(r)}
                    onUpload={upload}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <section className="space-y-3 xl:sticky xl:top-20 xl:self-start">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-teal-950">Pratinjau kartu</p>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} className={devBtn(device === d)} aria-label={d}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[70vh] overflow-auto rounded-2xl border border-teal-900/10 bg-[#FAF7F0] p-3">
          <div className="mx-auto transition-[width]" style={{ width: WIDTH[device], maxWidth: '100%' }}>
            {visible.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-400">Belum ada data yang ditampilkan.</p>
            ) : (
              <div className={`grid gap-2.5 ${device === 'mobile' || !sec.imageField ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {visible.map((r) => {
                  const d = drafts[r.id];
                  const get = (k?: string) => (k ? String((d?.[k] ?? r[k] ?? '') as string) : '');
                  const img = sec.imageField ? get(sec.imageField) : '';
                  return (
                    <article key={r.id} className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xs">
                      {sec.imageField && (
                        <div className="relative aspect-[16/10] bg-zinc-100">
                          {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                          {sec.badgeField && get(sec.badgeField) && (
                            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-emerald-300">
                              {get(sec.badgeField)}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="space-y-1 p-3">
                        {!sec.imageField && sec.badgeField && get(sec.badgeField) && (
                          <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            {get(sec.badgeField)}
                          </span>
                        )}
                        <h3 className="text-sm font-black leading-tight text-zinc-900">
                          {get(sec.titleField) || '(tanpa judul)'}
                        </h3>
                        {sec.subtitleField && (
                          <p className="line-clamp-2 text-xs text-zinc-600">{get(sec.subtitleField)}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-zinc-500">
          Pratinjau ini menampilkan ringkasan kartu. Tata letak lengkap bisa dilihat lewat tombol "Lihat Website".
        </p>
      </section>
    </div>
  );
};

export const CrudRoute: React.FC = () => {
  const { key } = useParams();
  const sec = crudByKey(key);
  if (!sec) return <p className="text-sm text-zinc-600">Bagian tidak ditemukan.</p>;
  return <Editor key={sec.key} sec={sec} />;
};
