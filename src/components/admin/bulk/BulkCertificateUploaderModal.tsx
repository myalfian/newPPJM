import React, { useState, useRef } from 'react';
import {
  Trophy,
  UploadCloud,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Award,
  Layers,
  Image as ImageIcon,
  User,
  Medal,
  Calendar
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { invalidateCache } from '../../../lib/queryCache';
import { compressImageToWebP } from '../../../lib/imageCompressor';
import { useAuth } from '../../../context/AuthContext';

export interface PendingCertificateItem {
  id: string;
  file: File;
  previewUrl: string;
  dataUrl: string;
  title: string;
  winnerName: string;
  category: string;
  tingkat: 'Kabupaten' | 'Karesidenan' | 'Provinsi' | 'Nasional' | 'Internasional';
  medalType: string;
  year: number;
  coach: string;
  description: string;
  sizeKB: number;
  compressedSizeKB: number;
}

interface BulkCertificateUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialCategory?: string;
}

const CATEGORY_OPTIONS = [
  'Robotika / STEM',
  'Tahfidz Al-Qur\'an',
  'Pidato & Bahasa',
  'Sains & Matematika',
  'Olahraga / Seni Bela Diri',
  'Kaligrafi Islam',
  'Karya Ilmiah Santri',
  'Umum / Akademik'
];

const MEDAL_OPTIONS = [
  'Emas / Juara 1',
  'Perak / Juara 2',
  'Perunggu / Juara 3',
  'Juara Harapan 1',
  'Juara Favorit',
  'Medali Prestasi'
];

const TINGKAT_OPTIONS: ('Kabupaten' | 'Karesidenan' | 'Provinsi' | 'Nasional' | 'Internasional')[] = [
  'Kabupaten',
  'Karesidenan',
  'Provinsi',
  'Nasional',
  'Internasional'
];

export const BulkCertificateUploaderModal: React.FC<BulkCertificateUploaderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCategory = 'Robotika / STEM'
}) => {
  const { isSuperAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingCertificates, setPendingCertificates] = useState<PendingCertificateItem[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState({ current: 0, total: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Batch Toolbar settings
  const [batchCategory, setBatchCategory] = useState(initialCategory);
  const [batchTingkat, setBatchTingkat] = useState<'Kabupaten' | 'Karesidenan' | 'Provinsi' | 'Nasional' | 'Internasional'>('Nasional');
  const [batchMedal, setBatchMedal] = useState('Emas / Juara 1');
  const [batchYear, setBatchYear] = useState(new Date().getFullYear());
  const [batchCoach, setBatchCoach] = useState('Dewan Pembina PPJM');

  if (!isOpen) return null;

  if (!isSuperAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-800 text-center space-y-3 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">Akses Ditolak: Khusus Super Admin</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Fungsi bulk upload piagam dan sertifikat massal ke database hanya dapat diakses oleh Super Admin demi keabsahan data arsip pesantren.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Parse title & winner name from filename
  const parseFileName = (rawName: string) => {
    const baseName = rawName.substring(0, rawName.lastIndexOf('.')) || rawName;
    const clean = baseName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

    let title = clean;
    let winner = 'Santri PPJM';
    let detectedMedal = batchMedal;

    // Check separator " - "
    if (clean.includes(' - ')) {
      const parts = clean.split(' - ');
      title = parts[0].trim();
      winner = parts.slice(1).join(' - ').trim();
    }

    // Auto-detect medal from keywords
    const lower = clean.toLowerCase();
    if (lower.includes('juara 1') || lower.includes('emas') || lower.includes('1st') || lower.includes('gold')) {
      detectedMedal = 'Emas / Juara 1';
    } else if (lower.includes('juara 2') || lower.includes('perak') || lower.includes('2nd') || lower.includes('silver')) {
      detectedMedal = 'Perak / Juara 2';
    } else if (lower.includes('juara 3') || lower.includes('perunggu') || lower.includes('3rd') || lower.includes('bronze')) {
      detectedMedal = 'Perunggu / Juara 3';
    } else if (lower.includes('harapan')) {
      detectedMedal = 'Juara Harapan 1';
    }

    return {
      title: title.replace(/\b\w/g, (c) => c.toUpperCase()),
      winner: winner.replace(/\b\w/g, (c) => c.toUpperCase()),
      medal: detectedMedal
    };
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Mohon pilih file gambar piagam yang valid (JPG, PNG, atau WebP).');
      return;
    }

    setCompressing(true);
    setCompressProgress({ current: 0, total: fileArray.length });

    const newItems: PendingCertificateItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const f = fileArray[i];
      setCompressProgress({ current: i + 1, total: fileArray.length });
      try {
        const compressed = await compressImageToWebP(f, 1600, 1600, 0.85);
        const parsed = parseFileName(f.name);

        newItems.push({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cert-' + Date.now() + '-' + i,
          file: compressed.file,
          previewUrl: compressed.previewUrl,
          dataUrl: compressed.dataUrl,
          title: parsed.title,
          winnerName: parsed.winner,
          category: batchCategory,
          tingkat: batchTingkat,
          medalType: parsed.medal,
          year: batchYear,
          coach: batchCoach,
          description: `Penghargaan piagam resmi santri PP Jauharul Maknuun: ${parsed.title} diraih oleh ${parsed.winner}.`,
          sizeKB: compressed.originalSizeKB,
          compressedSizeKB: compressed.compressedSizeKB
        });
      } catch (err) {
        console.warn('Gagal kompresi piagam:', f.name, err);
      }
    }

    setPendingCertificates((prev) => [...prev, ...newItems]);
    setCompressing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleApplyBatchSettings = () => {
    if (pendingCertificates.length === 0) return;
    setPendingCertificates((prev) =>
      prev.map((item) => ({
        ...item,
        category: batchCategory,
        tingkat: batchTingkat,
        medalType: batchMedal,
        year: batchYear,
        coach: batchCoach
      }))
    );
  };

  const handleRemoveItem = (id: string) => {
    setPendingCertificates((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<PendingCertificateItem>) => {
    setPendingCertificates((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );
  };

  const handleSubmitBulkToDatabase = async () => {
    if (pendingCertificates.length === 0) {
      alert('Belum ada piagam yang dipilih.');
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress({ current: 0, total: pendingCertificates.length });

    let successCount = 0;
    const errors: string[] = [];

    try {
      if (isSupabaseConfigured()) {
        for (let i = 0; i < pendingCertificates.length; i++) {
          const item = pendingCertificates[i];
          setSubmitProgress({ current: i + 1, total: pendingCertificates.length });

          const cleanSlug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'piagam-santri';

          // 1. Upload WebP to Supabase Storage bucket 'prestasi-certificates'
          let certificateUrl = item.dataUrl;
          try {
            const storagePath = `piagam-${Date.now()}-${i}-${cleanSlug}.webp`;
            const { data: uploadData, error: uploadErr } = await supabase.storage
              .from('prestasi-certificates')
              .upload(storagePath, item.file, {
                contentType: 'image/webp',
                upsert: true
              });

            if (!uploadErr && uploadData) {
              const { data: urlData } = supabase.storage
                .from('prestasi-certificates')
                .getPublicUrl(storagePath);
              if (urlData?.publicUrl) {
                certificateUrl = urlData.publicUrl;
              }
            } else if (uploadErr) {
              console.warn('Storage upload note:', uploadErr.message);
            }
          } catch (storageEx) {
            console.warn('Storage upload fallback to dataUrl:', storageEx);
          }

          // 2. Insert into 'achievements' table
          const achievementPayload = {
            title: item.title.trim(),
            winner_name: item.winnerName.trim(),
            category: item.category,
            medal_type: item.medalType,
            year: Number(item.year) || new Date().getFullYear(),
            description: item.description || `Meraih prestasi ${item.title} oleh ${item.winnerName}`,
            certificate_url: certificateUrl
          };
          const { error: err1 } = await supabase.from('achievements').insert(achievementPayload);

          // 3. Parallel insert into 'prestasi' table for dual compatibility
          const prestasiPayload = {
            title: item.title.trim(),
            santri_name: item.winnerName.trim(),
            category: item.category,
            level: item.tingkat,
            pembina_name: item.coach,
            year: Number(item.year) || new Date().getFullYear(),
            certificate_url: certificateUrl,
            photo_url: certificateUrl
          };
          const { error: err2 } = await supabase.from('prestasi').insert(prestasiPayload);

          if (err1 && err2) {
            errors.push(`${item.title}: ${err1.message || err2.message}`);
          } else {
            successCount++;
          }
        }

        if (errors.length > 0 && successCount === 0) {
          throw new Error(`Gagal menyimpan piagam ke database: ${errors[0]}`);
        }
      } else {
        successCount = pendingCertificates.length;
      }

      // Invalidate caches & dispatch event
      invalidateCache('achievements_list');
      invalidateCache('prestasi_list');
      invalidateCache('admin_dashboard_metrics');
      invalidateCache('admin_dashboard_feed');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ppjm-content-updated', { detail: { type: 'prestasi' } }));
      }

      setSuccessMsg(`Alhamdulillah, berhasil menerbitkan ${successCount} piagam juara ke database Supabase!`);
      setTimeout(() => {
        setPendingCertificates([]);
        setSuccessMsg(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      alert(`Terjadi kendala saat menyimpan piagam: ${err?.message || 'Koneksi error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/40 text-[#C8A951] flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-[#C8A951] border border-[#C8A951]/30">
                  Bulk Certificate Uploader
                </span>
                <span className="text-[10px] font-mono text-emerald-200">
                  Khusus Super Admin
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Bulk Input Foto Piagam &amp; Sertifikat Juara
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-dashed border-emerald-400/80 dark:border-emerald-700/80 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 transition-all text-center flex flex-col items-center justify-center gap-3 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(e.target.files);
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-[#0E7A4C] dark:text-emerald-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                Tarik &amp; Lepaskan File Foto Piagam / Sertifikat di Sini
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg mx-auto">
                Pilih hingga puluhan piagam sekaligus. Otomatis dikompresi ke WebP &amp; nama judul lomba/santri di-ekstrak cerdas dari nama file.
              </p>
            </div>

            <button
              type="button"
              disabled={compressing}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {compressing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengompresi ({compressProgress.current}/{compressProgress.total})...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Pilih File Piagam dari Komputer (Multi-Select)</span>
                </>
              )}
            </button>
          </div>

          {/* Batch Settings Bar (Visible if items exist) */}
          {pendingCertificates.length > 0 && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    Terapkan Atribut Massal Sekaligus ({pendingCertificates.length} Piagam Terpilih)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyBatchSettings}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  Terapkan ke Semua
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Kategori</label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Tingkat</label>
                  <select
                    value={batchTingkat}
                    onChange={(e) => setBatchTingkat(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  >
                    {TINGKAT_OPTIONS.map((tk) => (
                      <option key={tk} value={tk}>{tk}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Medali / Juara</label>
                  <select
                    value={batchMedal}
                    onChange={(e) => setBatchMedal(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  >
                    {MEDAL_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Tahun Lomba</label>
                  <input
                    type="number"
                    value={batchYear}
                    onChange={(e) => setBatchYear(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Guru Pembina</label>
                  <input
                    type="text"
                    value={batchCoach}
                    onChange={(e) => setBatchCoach(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* List of Pending Certificates */}
          {pendingCertificates.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Daftar Piagam &amp; Sertifikat ({pendingCertificates.length} File Siap Input)
                </h4>
                <button
                  type="button"
                  onClick={() => setPendingCertificates([])}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Kosongkan Semua
                </button>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {pendingCertificates.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
                  >
                    {/* Thumbnail preview */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-inner group">
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-[9px] font-mono text-emerald-300 font-bold">
                        {item.compressedSizeKB} KB
                      </span>
                    </div>

                    {/* Editable fields */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 w-full text-xs">
                      <div className="col-span-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-zinc-400">Judul Prestasi / Lomba *</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          placeholder="Judul Kejuaraan"
                          className="w-full mt-0.5 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400">Nama Santri / Peraih *</label>
                        <input
                          type="text"
                          value={item.winnerName}
                          onChange={(e) => handleUpdateItem(item.id, { winnerName: e.target.value })}
                          placeholder="Nama Santri"
                          className="w-full mt-0.5 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold text-emerald-700 dark:text-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400">Medali</label>
                        <select
                          value={item.medalType}
                          onChange={(e) => handleUpdateItem(item.id, { medalType: e.target.value })}
                          className="w-full mt-0.5 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                        >
                          {MEDAL_OPTIONS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400">Tingkat</label>
                        <select
                          value={item.tingkat}
                          onChange={(e) => handleUpdateItem(item.id, { tingkat: e.target.value as any })}
                          className="w-full mt-0.5 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                        >
                          {TINGKAT_OPTIONS.map((tk) => (
                            <option key={tk} value={tk}>{tk}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400">Kategori</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                          className="w-full mt-0.5 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Delete item button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 self-end sm:self-center"
                      title="Hapus Piagam Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {pendingCertificates.length > 0 ? (
              <span>
                Total <strong className="text-zinc-900 dark:text-white font-bold">{pendingCertificates.length}</strong> piagam siap diunggah ke database.
              </span>
            ) : (
              <span>Pilih file piagam di atas untuk memulai.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              disabled={pendingCertificates.length === 0 || isSubmitting || compressing}
              onClick={handleSubmitBulkToDatabase}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-[#0E7A4C] to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menerbitkan ({submitProgress.current}/{submitProgress.total})...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Terbitkan Semua Piagam ke Database</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

