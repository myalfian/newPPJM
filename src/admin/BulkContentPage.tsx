import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams, Link } from 'react-router-dom';
import {
  Layers,
  ImagePlus,
  Newspaper,
  Database,
  Sparkles,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileJson,
  ArrowRight,
  Camera,
  FolderKanban,
  Wand2,
} from 'lucide-react';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import {
  CRUD_SECTIONS,
  GALERI_CATEGORY_OPTIONS,
  GALERI_LOCATION_OPTIONS,
  BERITA_CATEGORY_OPTIONS,
  type CrudSection,
} from './sections';
import { convertImageToWebP, formatBytes } from '../lib/webpConverter';
import { invalidateCache } from '../lib/queryCache';

type BulkTab = 'foto' | 'artikel' | 'cms';

interface BulkPhotoQueueItem {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  width: number;
  height: number;
  webpFile: File;
  previewUrl: string;
  uploadedUrl?: string;
  title: string;
  category: string;
  location: string;
  eventDate: string;
  description: string;
  isFeatured: boolean;
  status: 'ready' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
}

interface BulkArticleRow {
  id: string;
  title: string;
  category: string;
  location: string;
  excerpt: string;
  content: string;
  image_url: string;
  is_published: boolean;
  uploadingImage?: boolean;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 75);

function humanizeFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  const cleaned = withoutExt
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return 'Dokumentasi Kegiatan PP. Jauharul Maknuun';
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

function toLocationArray(secKey: string, selected: string): string[] {
  const s = selected.trim();
  const baseTags =
    secKey === 'galeri_foto'
      ? ['home', 'galeri']
      : secKey === 'berita'
        ? ['home', 'berita']
        : secKey === 'prestasi'
          ? ['home', 'prestasi']
          : ['home', 'jm-center'];

  if (!s || s.startsWith('Beranda &')) return baseTags;
  if (s === 'Halaman Galeri Foto') return ['galeri'];
  if (s === 'Halaman Beranda (Home)') return ['home'];
  return Array.from(new Set([s, ...baseTags]));
}

export const BulkContentPage: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTableParam = searchParams.get('table') || '';

  const [activeTab, setActiveTab] = useState<BulkTab>(() => {
    if (initialTableParam === 'berita') return 'artikel';
    if (initialTableParam && initialTableParam !== 'galeri_foto') return 'cms';
    return 'foto';
  });

  // Status banner
  const [banner, setBanner] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressText, setProgressText] = useState('');

  // ============================================================================
  // TAB 1: BULK UPLOAD GALERI FOTO (AUTO WEBP)
  // ============================================================================
  const [photoQueue, setPhotoQueue] = useState<BulkPhotoQueueItem[]>([]);
  const [batchCategory, setBatchCategory] = useState<string>(GALERI_CATEGORY_OPTIONS[0]);
  const [batchLocation, setBatchLocation] = useState<string>(GALERI_LOCATION_OPTIONS[0]);
  const [batchEventDate, setBatchEventDate] = useState<string>(() =>
    new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
  );
  const [batchDescription, setBatchDescription] = useState<string>(
    'Dokumentasi resmi kegiatan santri Pondok Pesantren Jauharul Maknuun Lasem.',
  );
  const [groupingMode, setGroupingMode] = useState<'album3' | 'single'>('album3');
  const [convertingFiles, setConvertingFiles] = useState(false);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      photoQueue.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBulkPhotos = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setConvertingFiles(true);
    setBanner(null);

    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const newItems: BulkPhotoQueueItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const rawFile = files[i];
      const converted = await convertImageToWebP(rawFile, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82,
        targetMaxBytes: 320 * 1024,
      });

      const previewUrl = URL.createObjectURL(converted.file);
      newItems.push({
        id: crypto.randomUUID(),
        originalName: rawFile.name,
        originalSize: converted.originalSize,
        compressedSize: converted.compressedSize,
        savedPercent: converted.savedPercent,
        width: converted.width,
        height: converted.height,
        webpFile: converted.file,
        previewUrl,
        title: humanizeFilename(rawFile.name),
        category: batchCategory,
        location: batchLocation,
        eventDate: batchEventDate,
        description: batchDescription,
        isFeatured: false,
        status: 'ready',
      });
    }

    setPhotoQueue((prev) => [...prev, ...newItems]);
    setConvertingFiles(false);

    const totalOrig = newItems.reduce((acc, x) => acc + x.originalSize, 0);
    const totalComp = newItems.reduce((acc, x) => acc + x.compressedSize, 0);
    const avgSaved = totalOrig > 0 ? Math.max(0, Math.round(((totalOrig - totalComp) / totalOrig) * 100)) : 0;

    setBanner({
      kind: 'ok',
      text: `${newItems.length} foto berhasil dikonversi otomatis ke format ringan WebP (${formatBytes(totalOrig)} → ${formatBytes(totalComp)}, hemat ${avgSaved}%). Siap diunggah!`,
    });
  };

  const applyBatchSettingsToAllPhotos = () => {
    setPhotoQueue((prev) =>
      prev.map((item) => ({
        ...item,
        category: batchCategory,
        location: batchLocation,
        eventDate: batchEventDate,
        description: batchDescription || item.description,
      })),
    );
    setBanner({
      kind: 'ok',
      text: 'Pengaturan Kategori, Lokasi, Tanggal, dan Deskripsi berhasil diterapkan ke seluruh antrean foto.',
    });
  };

  const uploadSingleWebPFile = async (folder: string, file: File): Promise<string> => {
    const ext = file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from('cms-images').upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (error) throw new Error(error.message);
    return db.storage.from('cms-images').getPublicUrl(path).data.publicUrl;
  };

  const handlePublishBulkPhotos = async () => {
    if (photoQueue.length === 0) {
      setBanner({ kind: 'error', text: 'Pilih minimal 1 foto terlebih dahulu.' });
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      // Step 1: Upload all WebP files to Supabase Storage
      const uploadedItems: BulkPhotoQueueItem[] = [...photoQueue];
      for (let i = 0; i < uploadedItems.length; i++) {
        const item = uploadedItems[i];
        if (item.uploadedUrl) continue;
        setProgressText(`Mengunggah foto WebP (${i + 1}/${uploadedItems.length}): ${item.title}…`);
        setPhotoQueue((prev) => prev.map((p, idx) => (idx === i ? { ...p, status: 'uploading' } : p)));
        const publicUrl = await uploadSingleWebPFile('galeri_foto', item.webpFile);
        uploadedItems[i] = { ...item, uploadedUrl: publicUrl, status: 'done' };
        setPhotoQueue((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, uploadedUrl: publicUrl, status: 'done' } : p)),
        );
      }

      // Step 2: Build database rows according to groupingMode
      setProgressText('Menyimpan data ke tabel galeri_foto…');
      const payloads: Record<string, unknown>[] = [];

      if (groupingMode === 'album3') {
        for (let i = 0; i < uploadedItems.length; i += 3) {
          const chunk = uploadedItems.slice(i, i + 3);
          const lead = chunk[0];
          const slides = chunk.map((c) => ({
            photo_url: c.uploadedUrl!,
            caption: c.description || c.title,
          }));
          payloads.push({
            title: lead.title,
            category: lead.category || batchCategory,
            location: toLocationArray('galeri_foto', lead.location || batchLocation),
            event_date: lead.eventDate || batchEventDate,
            description: lead.description || batchDescription,
            image_url: lead.uploadedUrl!,
            photos: slides,
            is_featured: chunk.some((c) => c.isFeatured),
            is_active: true,
            order_index: Math.floor(i / 3),
          });
        }
      } else {
        uploadedItems.forEach((item, idx) => {
          payloads.push({
            title: item.title,
            category: item.category || batchCategory,
            location: toLocationArray('galeri_foto', item.location || batchLocation),
            event_date: item.eventDate || batchEventDate,
            description: item.description || batchDescription,
            image_url: item.uploadedUrl!,
            photos: [
              {
                photo_url: item.uploadedUrl!,
                caption: item.description || item.title,
              },
            ],
            is_featured: item.isFeatured,
            is_active: true,
            order_index: idx,
          });
        });
      }

      const { error } = await db.from('galeri_foto').insert(payloads);
      if (error) throw new Error(error.message);

      invalidateCache('gallery_photo_activities_v2');
      setBanner({
        kind: 'ok',
        text: `Berhasil mempublikasikan ${uploadedItems.length} foto WebP (${payloads.length} item Galeri) ke halaman Galeri Foto!`,
      });
      setPhotoQueue([]);
    } catch (err) {
      setBanner({
        kind: 'error',
        text: `Gagal menyimpan bulk foto: ${(err as Error).message}`,
      });
    } finally {
      setIsSubmitting(false);
      setProgressText('');
    }
  };

  const photoStats = useMemo(() => {
    const count = photoQueue.length;
    const orig = photoQueue.reduce((a, b) => a + b.originalSize, 0);
    const comp = photoQueue.reduce((a, b) => a + b.compressedSize, 0);
    const savedPct = orig > 0 ? Math.max(0, Math.round(((orig - comp) / orig) * 100)) : 0;
    return { count, orig, comp, savedPct };
  }, [photoQueue]);

  // ============================================================================
  // TAB 2: BULK ARTIKEL / BERITA
  // ============================================================================
  const createEmptyArticle = (): BulkArticleRow => ({
    id: crypto.randomUUID(),
    title: '',
    category: BERITA_CATEGORY_OPTIONS[0],
    location: 'Beranda & Berita (Utama)',
    excerpt: '',
    content: '',
    image_url: '',
    is_published: true,
  });

  const [articles, setArticles] = useState<BulkArticleRow[]>(() => [
    createEmptyArticle(),
    createEmptyArticle(),
  ]);

  const updateArticle = (id: string, patch: Partial<BulkArticleRow>) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const handleUploadArticleCover = async (id: string, rawFile: File) => {
    updateArticle(id, { uploadingImage: true });
    try {
      const converted = await convertImageToWebP(rawFile, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82,
      });
      const url = await uploadSingleWebPFile('berita', converted.file);
      updateArticle(id, { image_url: url, uploadingImage: false });
      setBanner({
        kind: 'ok',
        text: `Sampul berita dikonversi ke WebP (${formatBytes(converted.originalSize)} → ${formatBytes(converted.compressedSize)}).`,
      });
    } catch (err) {
      updateArticle(id, { uploadingImage: false });
      setBanner({ kind: 'error', text: `Gagal upload gambar berita: ${(err as Error).message}` });
    }
  };

  const handlePublishBulkArticles = async () => {
    const validRows = articles.filter((a) => a.title.trim() !== '' && a.content.trim() !== '');
    if (validRows.length === 0) {
      setBanner({
        kind: 'error',
        text: 'Isi minimal 1 baris artikel yang memiliki Judul dan Isi Berita.',
      });
      return;
    }

    setIsSubmitting(true);
    setProgressText(`Mempublikasikan ${validRows.length} artikel secara bulk…`);
    setBanner(null);

    try {
      const nowIso = new Date().toISOString();
      const payloads = validRows.map((a, idx) => {
        const baseSlug = slugify(a.title) || `warta-ppjm-${idx + 1}`;
        const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-4)}${idx}`;
        const rawContent = a.content.trim();
        const htmlContent = rawContent.startsWith('<')
          ? rawContent
          : rawContent
              .split(/\n{2,}/)
              .map((p) => `<p>${p.trim()}</p>`)
              .join('');

        return {
          title: a.title.trim(),
          slug: uniqueSlug,
          category: a.category || BERITA_CATEGORY_OPTIONS[0],
          location: toLocationArray('berita', a.location),
          excerpt: a.excerpt.trim() || a.content.replace(/<[^>]+>/g, '').slice(0, 160),
          content: htmlContent,
          image_url: a.image_url.trim() || null,
          is_published: a.is_published,
          published_at: nowIso,
          author_id: admin.session?.user?.id ?? null,
        };
      });

      const { error } = await db.from('berita').insert(payloads);
      if (error) throw new Error(error.message);

      setBanner({
        kind: 'ok',
        text: `Berhasil mempublikasikan ${payloads.length} artikel berita sekaligus ke website!`,
      });
      setArticles([createEmptyArticle(), createEmptyArticle()]);
    } catch (err) {
      setBanner({
        kind: 'error',
        text: `Gagal mempublikasikan artikel bulk: ${(err as Error).message}`,
      });
    } finally {
      setIsSubmitting(false);
      setProgressText('');
    }
  };

  // ============================================================================
  // TAB 3: BULK MULTI-MODUL CMS (SEMUA TABEL + JSON IMPORTER)
  // ============================================================================
  const [selectedSecKey, setSelectedSecKey] = useState<string>(() => {
    if (initialTableParam && CRUD_SECTIONS.some((s) => s.key === initialTableParam)) {
      return initialTableParam;
    }
    return 'prestasi';
  });

  const selectedSec: CrudSection = useMemo(
    () => CRUD_SECTIONS.find((s) => s.key === selectedSecKey) ?? CRUD_SECTIONS[0],
    [selectedSecKey],
  );

  const buildDefaultCmsRow = useCallback((sec: CrudSection): Record<string, unknown> => {
    const r: Record<string, unknown> = { _rowId: crypto.randomUUID() };
    for (const f of sec.fields) {
      if (f.advanced) continue;
      if (f.kind === 'bool') r[f.key] = Boolean(f.defaultValue ?? false);
      else if (f.kind === 'select') r[f.key] = f.defaultValue ?? f.options?.[0] ?? '';
      else if (f.kind === 'select_array') r[f.key] = f.options?.[0] ?? '';
      else if (f.kind === 'number') r[f.key] = f.defaultValue ?? 2026;
      else if (f.kind === 'date') r[f.key] = new Date().toISOString().slice(0, 10);
      else if (f.kind === 'json') r[f.key] = JSON.stringify(f.defaultValue ?? []);
      else r[f.key] = f.defaultValue ?? '';
    }
    return r;
  }, []);

  const [cmsRows, setCmsRows] = useState<Record<string, unknown>[]>([]);
  const [jsonPasteText, setJsonPasteText] = useState<string>('');
  const [showJsonModal, setShowJsonModal] = useState(false);

  useEffect(() => {
    setCmsRows([buildDefaultCmsRow(selectedSec), buildDefaultCmsRow(selectedSec), buildDefaultCmsRow(selectedSec)]);
  }, [selectedSec, buildDefaultCmsRow]);

  const editableCmsFields = useMemo(
    () => selectedSec.fields.filter((f) => !f.advanced && f.kind !== 'gallery_photos'),
    [selectedSec],
  );

  const updateCmsRowField = (rowId: string, key: string, val: unknown) => {
    setCmsRows((prev) => prev.map((r) => (r._rowId === rowId ? { ...r, [key]: val } : r)));
  };

  const handleCmsImageUpload = async (rowId: string, fieldKey: string, rawFile: File) => {
    try {
      setProgressText(`Mengonversi ${rawFile.name} ke WebP…`);
      const converted = await convertImageToWebP(rawFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      const url = await uploadSingleWebPFile(selectedSec.table, converted.file);
      updateCmsRowField(rowId, fieldKey, url);
      setBanner({
        kind: 'ok',
        text: `Gambar dikonversi ke WebP (${formatBytes(converted.originalSize)} → ${formatBytes(converted.compressedSize)}) & terunggah.`,
      });
    } catch (err) {
      setBanner({ kind: 'error', text: `Gagal upload gambar: ${(err as Error).message}` });
    } finally {
      setProgressText('');
    }
  };

  const handleSaveBulkCmsRows = async () => {
    const validRows = cmsRows.filter((r) => {
      const titleVal = String(r[selectedSec.titleField] ?? '').trim();
      return titleVal.length > 0;
    });

    if (validRows.length === 0) {
      setBanner({
        kind: 'error',
        text: `Isi minimal 1 baris dengan kolom "${selectedSec.titleField}" terisi.`,
      });
      return;
    }

    setIsSubmitting(true);
    setProgressText(`Menyimpan ${validRows.length} baris ke tabel ${selectedSec.table}…`);
    setBanner(null);

    try {
      const payloads = validRows.map((row, idx) => {
        const out: Record<string, unknown> = {};
        for (const f of editableCmsFields) {
          const rawVal = row[f.key];
          if (f.kind === 'bool') {
            out[f.key] = rawVal === true;
          } else if (f.kind === 'select_array') {
            out[f.key] = toLocationArray(selectedSec.key, String(rawVal ?? f.options?.[0] ?? ''));
          } else if (f.kind === 'lines') {
            const s = String(rawVal ?? '').trim();
            out[f.key] = s ? s.split('\n').map((x) => x.trim()).filter(Boolean) : [];
          } else if (f.kind === 'number') {
            const n = Number(rawVal);
            out[f.key] = Number.isFinite(n) ? n : Number(f.defaultValue ?? 0);
          } else if (f.kind === 'json') {
            const s = String(rawVal ?? '').trim();
            out[f.key] = s ? JSON.parse(s) : (f.defaultValue ?? []);
          } else if (f.kind === 'date') {
            out[f.key] = String(rawVal ?? '').trim() || new Date().toISOString().slice(0, 10);
          } else {
            const s = String(rawVal ?? '').trim();
            out[f.key] = s === '' ? (f.defaultValue ?? null) : s;
          }
        }

        if (selectedSec.slugFrom && !out.slug) {
          const base = slugify(String(row[selectedSec.slugFrom] ?? ''));
          out.slug = `${base || 'item'}-${Date.now().toString(36).slice(-4)}${idx}`;
        }
        if (selectedSec.authorField && admin.session) {
          out[selectedSec.authorField] = admin.session.user.id;
        }
        if (selectedSec.orderField) {
          out[selectedSec.orderField] = idx;
        }
        if (selectedSec.activeField) {
          out[selectedSec.activeField] = true;
        }
        if (selectedSec.publishedAtField) {
          out[selectedSec.publishedAtField] = new Date().toISOString();
        }
        return out;
      });

      const { error } = await db.from(selectedSec.table).insert(payloads);
      if (error) throw new Error(error.message);

      if (selectedSec.table === 'galeri_foto') invalidateCache('gallery_photo_activities_v2');
      if (selectedSec.table === 'galeri_videos') invalidateCache('gallery_video_activities_v2');
      if (selectedSec.table === 'info_terkini') {
        invalidateCache('navbar-info-terkini-ticker');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ppjm-ticker-refresh'));
        }
      }

      setBanner({
        kind: 'ok',
        text: `Berhasil menambahkan ${payloads.length} data baru secara bulk ke modul ${selectedSec.label}!`,
      });
      setCmsRows([buildDefaultCmsRow(selectedSec), buildDefaultCmsRow(selectedSec)]);
    } catch (err) {
      setBanner({
        kind: 'error',
        text: `Gagal menyimpan bulk data ${selectedSec.label}: ${(err as Error).message}`,
      });
    } finally {
      setIsSubmitting(false);
      setProgressText('');
    }
  };

  const handleImportJsonToRows = () => {
    try {
      const parsed = JSON.parse(jsonPasteText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Format JSON harus berupa Array objek, mis: [{"title": "..."}]');
      }
      const imported = parsed.map((obj: Record<string, unknown>) => {
        const base = buildDefaultCmsRow(selectedSec);
        for (const k of Object.keys(obj)) {
          base[k] = typeof obj[k] === 'object' && obj[k] !== null ? JSON.stringify(obj[k]) : obj[k];
        }
        return base;
      });
      setCmsRows(imported);
      setShowJsonModal(false);
      setJsonPasteText('');
      setBanner({
        kind: 'ok',
        text: `${imported.length} baris berhasil diimpor ke tabel editor ${selectedSec.label}. Silakan periksa lalu klik Simpan Bulk!`,
      });
    } catch (err) {
      setBanner({ kind: 'error', text: `JSON tidak valid: ${(err as Error).message}` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Super Admin Bulk Studio */}
      <div className="rounded-2xl border border-teal-900/15 bg-gradient-to-br from-[#0F4C48] via-[#115E59] to-[#0c3b38] p-5 sm:p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <Sparkles size={13} />
              <span>Super Admin Power Studio · Auto WebP Light Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Bulk Upload Konten, Galeri Foto &amp; Artikel
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Unggah puluhan foto sekaligus dengan konversi otomatis ke format ringan{' '}
              <span className="font-bold text-amber-300">.webp</span>, terbitkan banyak artikel berita dalam satu layar,
              atau impor data massal ke seluruh tabel CMS Pondok Pesantren Jauharul Maknuun.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/s/galeri_foto"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-bold text-white transition-colors"
            >
              <Camera size={14} /> Kelola Galeri Foto
            </Link>
            <Link
              to="/admin/s/berita"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-bold text-white transition-colors"
            >
              <Newspaper size={14} /> Kelola Berita
            </Link>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/15 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('foto')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'foto'
                ? 'bg-amber-400 text-teal-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ImagePlus size={16} />
            <span>1. Bulk Upload Galeri Foto (Auto WebP)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('artikel')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'artikel'
                ? 'bg-amber-400 text-teal-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Newspaper size={16} />
            <span>2. Bulk Artikel &amp; Berita</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'cms'
                ? 'bg-amber-400 text-teal-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Database size={16} />
            <span>3. Bulk Semua Modul CMS ({CRUD_SECTIONS.length} Tabel)</span>
          </button>
        </div>
      </div>

      {/* Status / Progress Alert */}
      {progressText && (
        <div className="flex items-center gap-3 rounded-xl border border-teal-300 bg-teal-50 p-3.5 text-xs font-semibold text-teal-900">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
          <span>{progressText}</span>
        </div>
      )}

      {banner && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs sm:text-sm font-medium ${
            banner.kind === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          {banner.kind === 'error' ? (
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
          )}
          <div className="flex-1">{banner.text}</div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-xs font-bold underline opacity-75 hover:opacity-100"
          >
            Tutup
          </button>
        </div>
      )}

      {/* =====================================================================
          TAB 1: BULK UPLOAD GALERI FOTO (AUTO WEBP)
         ===================================================================== */}
      {activeTab === 'foto' && (
        <div className="space-y-5">
          {/* Batch Settings Card */}
          <div className="rounded-2xl border border-teal-900/10 bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-teal-950">
                  Pengaturan Default Batch Galeri Foto
                </h2>
                <p className="text-xs text-zinc-500">
                  Pilih Kategori dan Lokasi dari dropdown di bawah. Pengaturan ini otomatis diterapkan ke foto yang diunggah.
                </p>
              </div>
              {photoQueue.length > 0 && (
                <button
                  type="button"
                  onClick={applyBatchSettingsToAllPhotos}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-teal-900/20 bg-teal-50 px-3 py-1.5 text-xs font-bold text-[#115E59] hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  <Wand2 size={13} /> Terapkan ke Semua Foto ({photoQueue.length})
                </button>
              )}
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1 text-xs font-semibold text-zinc-700">
                <span>Kategori Kegiatan (Dropdown)</span>
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#115E59] focus:outline-none"
                >
                  {GALERI_CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-xs font-semibold text-zinc-700">
                <span>Lokasi Kegiatan &amp; Tampil (Dropdown)</span>
                <select
                  value={batchLocation}
                  onChange={(e) => setBatchLocation(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#115E59] focus:outline-none"
                >
                  {GALERI_LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-xs font-semibold text-zinc-700">
                <span>Tanggal Kegiatan</span>
                <input
                  type="text"
                  value={batchEventDate}
                  onChange={(e) => setBatchEventDate(e.target.value)}
                  placeholder="Mis: 20 Juni 2026"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#115E59] focus:outline-none"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold text-zinc-700">
                <span>Mode Penyimpanan Galeri</span>
                <select
                  value={groupingMode}
                  onChange={(e) => setGroupingMode(e.target.value as 'album3' | 'single')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#115E59] focus:outline-none"
                >
                  <option value="album3">Grup per 3 Foto = 1 Album Slider (Rekomendasi)</option>
                  <option value="single">1 Foto = 1 Kartu Galeri Mandiri</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1 text-xs font-semibold text-zinc-700">
              <span>Deskripsi Default Kegiatan</span>
              <input
                type="text"
                value={batchDescription}
                onChange={(e) => setBatchDescription(e.target.value)}
                placeholder="Keterangan singkat yang diterapkan ke foto…"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#115E59] focus:outline-none"
              />
            </label>
          </div>

          {/* Drag & Drop Multi-File WebP Zone */}
          <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#115E59]/35 bg-white p-8 text-center hover:border-[#115E59] hover:bg-teal-50/30 transition-all cursor-pointer">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-[#115E59]">
              <UploadCloud size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-teal-950">
                {convertingFiles
                  ? 'Sedang Mengonversi Foto ke Format Ringan WebP…'
                  : 'Klik atau Tarik Banyak Foto Sekaligus ke Sini'}
              </p>
              <p className="text-xs text-zinc-500">
                Mendukung JPG, PNG, WebP (bisa pilih 3, 12, hingga 50+ foto sekaligus). Otomatis dikonversi ke{' '}
                <span className="font-semibold text-emerald-700">.webp</span> ringan.
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={convertingFiles || isSubmitting}
              className="hidden"
              onChange={(e) => {
                void handleSelectBulkPhotos(e.target.files);
                e.target.value = '';
              }}
            />
          </label>

          {/* Queued Photos Grid */}
          {photoQueue.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-teal-900/10 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-teal-950">
                    Antrean Foto Siap Publikasi ({photoStats.count} Foto WebP)
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Ukuran Asli: {formatBytes(photoStats.orig)} → Ukuran WebP: {formatBytes(photoStats.comp)} (Hemat{' '}
                    {photoStats.savedPct}%)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoQueue([])}
                    disabled={isSubmitting}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Kosongkan Antrean
                  </button>
                  <button
                    type="button"
                    onClick={handlePublishBulkPhotos}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#0F4C48] disabled:opacity-60 cursor-pointer shadow-xs"
                  >
                    <Sparkles size={15} />
                    <span>
                      {isSubmitting
                        ? 'Mengunggah & Menyimpan…'
                        : `Publikasikan ${photoStats.count} Foto ke Galeri`}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {photoQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-[#FAF7F0]/50 p-3 space-y-2.5"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-950/10 border border-zinc-200 flex items-center justify-center">
                        <img src={item.previewUrl} alt={item.title} className="h-full w-full object-contain p-0.5" />
                        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          #{idx + 1}{' '}
                          {groupingMode === 'album3'
                            ? `· Album ${Math.floor(idx / 3) + 1} (Slide ${(idx % 3) + 1})`
                            : ''}
                        </span>
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-700/90 px-2 py-0.5 text-[10px] font-bold text-white">
                          WebP {formatBytes(item.compressedSize)} (-{item.savedPercent}%)
                        </span>
                      </div>

                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          setPhotoQueue((prev) =>
                            prev.map((p) => (p.id === item.id ? { ...p, title: e.target.value } : p)),
                          )
                        }
                        placeholder="Judul foto / kegiatan…"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900"
                      />

                      <div className="grid grid-cols-2 gap-1.5">
                        <select
                          value={item.category}
                          onChange={(e) =>
                            setPhotoQueue((prev) =>
                              prev.map((p) => (p.id === item.id ? { ...p, category: e.target.value } : p)),
                            )
                          }
                          className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700"
                        >
                          {GALERI_CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>

                        <select
                          value={item.location}
                          onChange={(e) =>
                            setPhotoQueue((prev) =>
                              prev.map((p) => (p.id === item.id ? { ...p, location: e.target.value } : p)),
                            )
                          }
                          className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700"
                        >
                          {GALERI_LOCATION_OPTIONS.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          setPhotoQueue((prev) =>
                            prev.map((p) => (p.id === item.id ? { ...p, description: e.target.value } : p)),
                          )
                        }
                        placeholder="Keterangan / caption slide…"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] text-zinc-700 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-200/70">
                      <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isFeatured}
                          onChange={(e) =>
                            setPhotoQueue((prev) =>
                              prev.map((p) => (p.id === item.id ? { ...p, isFeatured: e.target.checked } : p)),
                            )
                          }
                          className="accent-[#115E59]"
                        />
                        <span>Unggulan</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoQueue((prev) => prev.filter((p) => p.id !== item.id))
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: BULK ARTIKEL & BERITA
         ===================================================================== */}
      {activeTab === 'artikel' && (
        <div className="space-y-4 rounded-2xl border border-teal-900/10 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-teal-950">
                Bulk Editor Artikel &amp; Berita Pondok ({articles.length} Baris)
              </h2>
              <p className="text-xs text-zinc-500">
                Tambahkan banyak berita/artikel sekaligus. Gambar sampul otomatis dikonversi ke format ringan WebP.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setArticles((prev) => [...prev, createEmptyArticle()])}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-900/20 bg-teal-50 px-3 py-2 text-xs font-bold text-[#115E59] hover:bg-teal-100 cursor-pointer"
              >
                <Plus size={14} /> Tambah Baris Artikel
              </button>
              <button
                type="button"
                onClick={handlePublishBulkArticles}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#0F4C48] disabled:opacity-60 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>{isSubmitting ? 'Mempublikasikan…' : 'Publikasikan Semua Artikel'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {articles.map((art, idx) => (
              <div
                key={art.id}
                className="rounded-xl border border-zinc-200 bg-[#FAF7F0]/50 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#115E59] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Artikel #{idx + 1}
                  </span>
                  {articles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setArticles((prev) => prev.filter((a) => a.id !== art.id))}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      <Trash2 size={13} /> Hapus Baris
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="space-y-1 text-xs font-semibold text-zinc-700 sm:col-span-1">
                    <span>Judul Berita / Artikel *</span>
                    <input
                      type="text"
                      value={art.title}
                      onChange={(e) => updateArticle(art.id, { title: e.target.value })}
                      placeholder="Masukkan judul berita…"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs font-semibold text-zinc-700">
                    <span>Kategori Berita (Dropdown)</span>
                    <select
                      value={art.category}
                      onChange={(e) => updateArticle(art.id, { category: e.target.value })}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                    >
                      {BERITA_CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1 text-xs font-semibold text-zinc-700">
                    <span>Lokasi Penayangan (Dropdown)</span>
                    <select
                      value={art.location}
                      onChange={(e) => updateArticle(art.id, { location: e.target.value })}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="Beranda & Berita (Utama)">Beranda &amp; Berita (Utama)</option>
                      <option value="Halaman Berita">Halaman Berita</option>
                      <option value="Siaran Pers (Press Release)">Siaran Pers (Press Release)</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5 text-xs font-semibold text-zinc-700">
                    <span>Gambar Sampul (Auto WebP)</span>
                    <div className="flex items-center gap-2.5">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950/10 grid place-items-center">
                        {art.image_url ? (
                          <img src={art.image_url} alt="" className="h-full w-full object-contain p-0.5" />
                        ) : (
                          <ImagePlus size={18} className="text-zinc-400" />
                        )}
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-teal-900/20 bg-white px-3 py-1.5 text-xs font-bold text-[#115E59] hover:bg-teal-50">
                        <ImagePlus size={13} />
                        <span>{art.uploadingImage ? 'Mengonversi WebP…' : 'Upload Sampul'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={art.uploadingImage}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = '';
                            if (f) void handleUploadArticleCover(art.id, f);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <label className="space-y-1 text-xs font-semibold text-zinc-700 sm:col-span-2">
                    <span>Ringkasan Singkat (Excerpt)</span>
                    <textarea
                      rows={2}
                      value={art.excerpt}
                      onChange={(e) => updateArticle(art.id, { excerpt: e.target.value })}
                      placeholder="Ringkasan 1-2 kalimat untuk pratinjau kartu berita…"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm resize-y"
                    />
                  </label>
                </div>

                <label className="block space-y-1 text-xs font-semibold text-zinc-700">
                  <span>Isi Berita Lengkap *</span>
                  <textarea
                    rows={4}
                    value={art.content}
                    onChange={(e) => updateArticle(art.id, { content: e.target.value })}
                    placeholder="Tuliskan isi berita atau tempel naskah berita lengkap di sini…"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm resize-y"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: BULK MULTI-MODUL CMS (SEMUA TABEL WEBSITE)
         ===================================================================== */}
      {activeTab === 'cms' && (
        <div className="space-y-4 rounded-2xl border border-teal-900/10 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <FolderKanban size={18} className="text-[#115E59]" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pilih Modul Target:</span>
              </div>
              <select
                value={selectedSecKey}
                onChange={(e) => {
                  setSelectedSecKey(e.target.value);
                  setSearchParams({ table: e.target.value });
                }}
                className="rounded-xl border border-teal-900/25 bg-teal-50/60 px-3.5 py-2 text-sm font-bold text-teal-950 focus:border-[#115E59] focus:outline-none"
              >
                {CRUD_SECTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    [{s.group}] {s.label} (tabel: {s.table})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowJsonModal((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                <FileJson size={14} /> Impor JSON Massal
              </button>
              <button
                type="button"
                onClick={() => setCmsRows((prev) => [...prev, buildDefaultCmsRow(selectedSec)])}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-900/20 bg-teal-50 px-3 py-2 text-xs font-bold text-[#115E59] hover:bg-teal-100 cursor-pointer"
              >
                <Plus size={14} /> Tambah Baris
              </button>
              <button
                type="button"
                onClick={handleSaveBulkCmsRows}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#0F4C48] disabled:opacity-60 cursor-pointer"
              >
                <Layers size={15} />
                <span>Simpan Semua ke {selectedSec.label}</span>
              </button>
            </div>
          </div>

          {showJsonModal && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-950">
                  Tempel JSON Array untuk Impor Massal ke {selectedSec.label} ({selectedSec.table})
                </p>
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="text-xs font-semibold text-amber-900 underline"
                >
                  Tutup
                </button>
              </div>
              <textarea
                rows={5}
                value={jsonPasteText}
                onChange={(e) => setJsonPasteText(e.target.value)}
                placeholder={`Contoh:\n[\n  { "${selectedSec.titleField}": "Data Contoh 1" },\n  { "${selectedSec.titleField}": "Data Contoh 2" }\n]`}
                className="w-full rounded-lg border border-amber-300 bg-white p-2.5 font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleImportJsonToRows}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#115E59] px-3.5 py-1.5 text-xs font-bold text-white"
              >
                <ArrowRight size={13} /> Muat ke Tabel Editor
              </button>
            </div>
          )}

          <div className="space-y-3">
            {cmsRows.map((row, rIdx) => {
              const rowId = String(row._rowId);
              return (
                <div
                  key={rowId}
                  className="rounded-xl border border-zinc-200 bg-[#FAF7F0]/50 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2">
                    <span className="text-xs font-bold text-teal-950">
                      Baris #{rIdx + 1} · {selectedSec.label}
                    </span>
                    {cmsRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCmsRows((prev) => prev.filter((x) => x._rowId !== rowId))}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {editableCmsFields.map((f) => {
                      const val = row[f.key];
                      const strVal = String(val ?? '');

                      if (f.kind === 'bool') {
                        return (
                          <label
                            key={f.key}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 pt-5 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={val === true}
                              onChange={(e) => updateCmsRowField(rowId, f.key, e.target.checked)}
                              className="h-4 w-4 accent-[#115E59]"
                            />
                            <span>{f.label}</span>
                          </label>
                        );
                      }

                      if (f.kind === 'select' || f.kind === 'select_array') {
                        const opts = f.options ?? [];
                        return (
                          <label key={f.key} className="space-y-1 text-xs font-semibold text-zinc-700">
                            <span>{f.label}</span>
                            <select
                              value={strVal || opts[0] || ''}
                              onChange={(e) => updateCmsRowField(rowId, f.key, e.target.value)}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs"
                            >
                              {opts.map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                          </label>
                        );
                      }

                      if (f.kind === 'image') {
                        return (
                          <div key={f.key} className="space-y-1 text-xs font-semibold text-zinc-700">
                            <span>{f.label}</span>
                            <div className="flex items-center gap-2">
                              {strVal && (
                                <img
                                  src={strVal}
                                  alt=""
                                  className="h-9 w-12 rounded-lg object-contain bg-zinc-950/10 border border-zinc-200 p-0.5"
                                />
                              )}
                              <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-teal-900/20 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#115E59] hover:bg-teal-50">
                                <ImagePlus size={12} />
                                <span>{strVal ? 'Ganti WebP' : 'Upload WebP'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = '';
                                    if (file) void handleCmsImageUpload(rowId, f.key, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <label key={f.key} className="space-y-1 text-xs font-semibold text-zinc-700">
                          <span>
                            {f.label}
                            {f.required && <span className="text-red-600"> *</span>}
                          </span>
                          <input
                            type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : 'text'}
                            value={strVal}
                            placeholder={f.placeholder}
                            onChange={(e) => updateCmsRowField(rowId, f.key, e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkContentPage;

