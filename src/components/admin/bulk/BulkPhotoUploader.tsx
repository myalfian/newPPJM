import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  X,
  Image as ImageIcon,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  ArrowRight,
  Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { invalidateCache } from '../../../lib/queryCache';
import { compressImageToWebP } from '../../../lib/imageCompressor';

export interface PendingPhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  dataUrl: string;
  title: string;
  category: string;
  eventDate: string;
  description: string;
  sizeKB: number;
  compressedSizeKB: number;
}

interface BulkPhotoUploaderProps {
  onSuccess?: () => void;
  onClose?: () => void;
  targetCategory?: string;
}

export const BulkPhotoUploader: React.FC<BulkPhotoUploaderProps> = ({
  onSuccess,
  onClose,
  targetCategory = 'foto'
}) => {
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhotoItem[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState({ current: 0, total: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Common Metadata
  const [batchEventDate, setBatchEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchCategory, setBatchCategory] = useState(targetCategory);
  const [batchCommonDesc, setBatchCommonDesc] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanFileNameToTitle = (filename: string): string => {
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    return nameWithoutExt
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    setCompressing(true);
    setCompressProgress({ current: 0, total: fileArray.length });

    const newItems: PendingPhotoItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setCompressProgress({ current: i + 1, total: fileArray.length });
      try {
        const compressed = await compressImageToWebP(file, 1600, 1600, 0.82);
        newItems.push({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'temp-' + Date.now() + '-' + i,
          file,
          previewUrl: compressed.previewUrl,
          dataUrl: compressed.dataUrl,
          title: cleanFileNameToTitle(file.name),
          category: batchCategory,
          eventDate: batchEventDate,
          description: batchCommonDesc,
          sizeKB: compressed.originalSizeKB,
          compressedSizeKB: compressed.compressedSizeKB
        });
      } catch (err) {
        console.warn('Gagal kompresi file:', file.name, err);
      }
    }

    setPendingPhotos((prev) => [...prev, ...newItems]);
    setCompressing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleApplyBatchMetadata = () => {
    if (pendingPhotos.length === 0) return;
    setPendingPhotos((prev) =>
      prev.map((item) => ({
        ...item,
        eventDate: batchEventDate,
        category: batchCategory,
        description: batchCommonDesc || item.description
      }))
    );
  };

  const handleRemoveItem = (id: string) => {
    setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<PendingPhotoItem>) => {
    setPendingPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleBulkSubmit = async () => {
    if (pendingPhotos.length === 0) return;
    setIsSubmitting(true);
    setSubmitProgress({ current: 0, total: pendingPhotos.length });

    try {
      if (isSupabaseConfigured()) {
        const rows = pendingPhotos.map((item, idx) => {
          const slug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36) + '-' + idx;

          return {
            title: item.title,
            slug,
            category: item.category === 'video' ? 'video' : 'foto',
            event_date: item.eventDate || new Date().toISOString().split('T')[0],
            description: item.description || `Dokumentasi kegiatan santri PP Jauharul Maknuun: ${item.title}`,
            cover_image: item.dataUrl,
            updated_at: new Date().toISOString()
          };
        });

        // Insert in batches of 10 to avoid payload limits
        const chunkSize = 10;
        for (let i = 0; i < rows.length; i += chunkSize) {
          const chunk = rows.slice(i, i + chunkSize);
          const { error } = await supabase.from('galleries').insert(chunk);
          if (error) {
            console.warn('Gagal batch insert galleries:', error);
          }
          setSubmitProgress({ current: Math.min(i + chunkSize, rows.length), total: rows.length });
        }
      }

      invalidateCache('galleries_list');
      invalidateCache('galeri_foto_list');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ppjm-content-updated', { detail: { type: 'galeri' } }));
      }

      setSuccessMessage(`Alhamdulillah, berhasil menerbitkan ${pendingPhotos.length} foto ke galeri dokumentasi!`);
      setTimeout(() => {
        setPendingPhotos([]);
        setSuccessMessage(null);
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      alert(`Terjadi kendala saat menyimpan foto: ${err?.message || 'Koneksi error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-zinc-800 dark:text-zinc-200">
      {/* Header Info */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0E7A4C] to-emerald-950 text-white shadow-md border border-[#C8A951]/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-black/40 text-[#C8A951] font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> BULK UPLOAD
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              Bulk Input &amp; Multi-Foto Galeri
            </h3>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            Pilih hingga puluhan foto sekaligus. Foto otomatis dikompresi ke WebP &amp; diterbitkan langsung ke database Supabase.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-emerald-400/60 dark:border-emerald-600/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer text-center space-y-2 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) handleFilesSelected(e.target.files);
          }}
          className="hidden"
        />
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-[#0E7A4C] dark:text-emerald-300 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
            Klik atau Tarik Foto ke Sini (Multi-Select)
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mendukung JPG, PNG, WebP • Bebas pilih banyak foto sekaligus
          </p>
        </div>
      </div>

      {/* Compression Progress Bar */}
      {compressing && (
        <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengompresi Foto ke WebP...
            </span>
            <span className="text-zinc-500">
              {compressProgress.current} dari {compressProgress.total} file
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-[#0E7A4C] transition-all duration-200"
              style={{
                width: `${(compressProgress.current / Math.max(1, compressProgress.total)) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Common Metadata Control for Entire Batch */}
      {pendingPhotos.length > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0E7A4C]" />
              Atur Metadata Serentak untuk Semua Foto ({pendingPhotos.length} foto dipilih):
            </span>
            <button
              type="button"
              onClick={handleApplyBatchMetadata}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white transition cursor-pointer"
            >
              Terapkan ke Semua
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Tanggal Kegiatan:</label>
              <input
                type="date"
                value={batchEventDate}
                onChange={(e) => setBatchEventDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Kategori:</label>
              <select
                value={batchCategory}
                onChange={(e) => setBatchCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold"
              >
                <option value="foto">Foto Dokumentasi</option>
                <option value="kegiatan">Kegiatan Santri</option>
                <option value="prestasi">Serah Terima Prestasi</option>
                <option value="fasilitas">Fasilitas Kampus</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Keterangan / Album Bersama:</label>
              <input
                type="text"
                placeholder="Contoh: Haflah Khotmil Qur'an 2026"
                value={batchCommonDesc}
                onChange={(e) => setBatchCommonDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid of Pending Photos */}
      {pendingPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <span>Daftar Foto Siap Unggah ({pendingPhotos.length})</span>
            <button
              type="button"
              onClick={() => setPendingPhotos([])}
              className="text-rose-600 hover:underline cursor-pointer"
            >
              Hapus Semua Foto
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {pendingPhotos.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2 relative group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img src={item.dataUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] font-bold">
                    #{idx + 1} • {item.compressedSizeKB} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition shadow-md cursor-pointer"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                    placeholder="Judul / Keterangan Foto"
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={item.eventDate}
                      onChange={(e) => handleUpdateItem(item.id, { eventDate: e.target.value })}
                      className="w-1/2 px-2 py-1 text-[11px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                    <span className="w-1/2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate">
                      WebP Terkompresi
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Total {pendingPhotos.length} foto siap disimpan ke database.
            </span>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBulkSubmit}
              className="px-6 py-3 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-lg flex items-center gap-2 border border-[#C8A951]/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan {submitProgress.current} dari {submitProgress.total}...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan &amp; Terbitkan Semua Foto Sekaligus</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default BulkPhotoUploader;
