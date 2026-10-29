import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  X,
  FileCheck,
  ShieldAlert
} from 'lucide-react';

export interface SimpleFormCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isPublished?: boolean;
  onTogglePublished?: (published: boolean) => void;
  onSaveDraft?: () => void | Promise<void>;
  onPublish: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  isSaving?: boolean;
  draftStorageKey?: string;
  lastSavedAt?: Date | string | null;
  children: React.ReactNode;
  deleteWarningTitle?: string;
  deleteWarningMessage?: string;
  className?: string;
  headerActions?: React.ReactNode;
}

export const SimpleFormCard: React.FC<SimpleFormCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  isPublished = false,
  onTogglePublished,
  onSaveDraft,
  onPublish,
  onDelete,
  isSaving = false,
  draftStorageKey,
  lastSavedAt,
  children,
  deleteWarningTitle = 'Hapus Konten Ini?',
  deleteWarningMessage = 'Tindakan ini akan menghapus data ini secara permanen dari server dan website. Data yang sudah dihapus tidak dapat dipulihkan.',
  className = '',
  headerActions
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localAutoSavedTime, setLocalAutoSavedTime] = useState<string | null>(null);

  // Check local draft timestamp if draftStorageKey provided
  useEffect(() => {
    if (!draftStorageKey) return;
    try {
      const savedTime = localStorage.getItem(`${draftStorageKey}_timestamp`);
      if (savedTime) {
        setLocalAutoSavedTime(new Date(savedTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // safe fallback
    }
  }, [draftStorageKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePublishClick = async () => {
    try {
      await onPublish();
      showToast('Konten berhasil ditayangkan ke publik!');
    } catch {
      showToast('Gagal menayangkan konten. Silakan periksa kembali formulir.');
    }
  };

  const handleSaveDraftClick = async () => {
    if (onSaveDraft) {
      try {
        await onSaveDraft();
        showToast('Draf berhasil disimpan dengan aman.');
      } catch {
        showToast('Gagal menyimpan draf.');
      }
    } else {
      showToast('Draf tersimpan otomatis di perangkat Anda.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteModal(false);
      showToast('Konten telah berhasil dihapus.');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus konten.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`relative bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md rounded-2xl transition-all duration-200 ${className}`}>
      
      {/* 1. Header Kartu Formulir Ramah Pengguna */}
      <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#007acc] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                {title}
              </h3>
              {/* Status Tayang Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isPublished
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isPublished ? 'Tayang di Website' : 'Masih Draf (Belum Tayang)'}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {onTogglePublished && (
            <button
              type="button"
              onClick={() => onTogglePublished(!isPublished)}
              className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isPublished
                  ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
              }`}
              title="Ubah status tayang"
            >
              {isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
              <span>{isPublished ? 'Publik' : 'Draf'}</span>
            </button>
          )}

          {headerActions}
        </div>
      </div>

      {/* 2. Formulir Konten Utama */}
      <div className="p-5 sm:p-6 space-y-6">
        {children}
      </div>

      {/* 3. Footer Aksi Utama (Ergonomi Ramah Sentuh Jempol >= 48px) */}
      <div className="p-5 sm:p-6 bg-zinc-50/70 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800/80 rounded-b-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Info Pemulihan Draf & Waktu Tersimpan */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>
            {localAutoSavedTime ? (
              <>Tersimpan di perangkat pukul <strong className="text-zinc-700 dark:text-zinc-300">{localAutoSavedTime}</strong></>
            ) : lastSavedAt ? (
              <>Terakhir disimpan: <strong className="text-zinc-700 dark:text-zinc-300">{String(lastSavedAt)}</strong></>
            ) : (
              'Draf otomatis diamankan di memori peramban Anda'
            )}
          </span>
        </div>

        {/* Action Buttons with High-Contrast Clear Visuals */}
        <div className="flex items-center gap-2.5 sm:self-end">
          {onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={isSaving}
              className="min-h-[48px] px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-600 border border-rose-200/80 dark:border-rose-900/50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              title="Hapus data ini"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          )}

          {onSaveDraft && (
            <button
              type="button"
              onClick={handleSaveDraftClick}
              disabled={isSaving}
              className="flex-1 sm:flex-none min-h-[48px] px-5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-amber-500" />
              <span>Simpan Draf</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePublishClick}
            disabled={isSaving}
            className="flex-1 sm:flex-none min-h-[48px] px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Tayangkan Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Modal Konfirmasi Hapus Berbahasa Indonesia (Zero-Fear Input) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
                {deleteWarningTitle}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {deleteWarningMessage}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              💡 <em>Tips: Jika hanya ingin menyembunyikan sementara dari santri, Anda cukup mengubah statusnya menjadi <strong>Draf</strong> tanpa perlu menghapusnya.</em>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="min-h-[48px] px-5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[48px] px-6 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Toast Feedback Visual Instan */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 text-white shadow-2xl border border-zinc-700 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

