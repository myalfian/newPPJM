import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Trophy,
  Activity,
  Layers,
  Building2,
  UploadCloud,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { BulkPhotoUploader } from './BulkPhotoUploader';
import { BulkPrestasiInputModal } from './BulkPrestasiInputModal';
import { BulkEkskulInputModal } from './BulkEkskulInputModal';
import { useAuth } from '../../../context/AuthContext';

interface BulkInputHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'foto' | 'prestasi' | 'ekskul';
  onSuccess?: () => void;
}

export const BulkInputHubModal: React.FC<BulkInputHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'foto',
  onSuccess
}) => {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'foto' | 'prestasi' | 'ekskul'>(initialTab);

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
            Fungsi input massal (bulk input) data, foto, dan prestasi hanya dapat diakses oleh peran Super Admin untuk menjamin keaslian arsip pesantren.
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/40 text-[#C8A951] flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#C8A951] bg-black/40 px-2 py-0.5 rounded-full border border-[#C8A951]/30">
                  PPJM Enterprise CMS
                </span>
                <span className="text-xs text-emerald-200">• Mass Content Generator</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Pusat Bulk Input Data &amp; Multi-Media Admin
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Module Navigation Tabs */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('foto')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'foto'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. Bulk Upload Multi-Foto (Galeri)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prestasi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'prestasi'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>2. Bulk Input Prestasi (Spreadsheet)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ekskul')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ekskul'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>3. Bulk Input Ekskul Santri</span>
          </button>
        </div>

        {/* Body based on activeTab */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'foto' && (
            <BulkPhotoUploader
              onSuccess={() => {
                if (onSuccess) onSuccess();
              }}
            />
          )}

          {activeTab === 'prestasi' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                <span className="font-bold">Mode Pengisian Massal Prestasi:</span> Masukkan piagam dan piala kejuaraan santri sekaligus menggunakan format spreadsheet atau copy-paste langsung dari Microsoft Excel.
              </div>
              <BulkPrestasiInputModal
                isOpen={true}
                onClose={() => {}}
                onSuccess={() => {
                  if (onSuccess) onSuccess();
                }}
              />
            </div>
          )}

          {activeTab === 'ekskul' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
                <span className="font-bold">Mode Pengisian Massal Ekskul:</span> Input jadwal latihan, pembina, dan lokasi beberapa cabang minat bakat santri sekaligus.
              </div>
              <BulkEkskulInputModal
                isOpen={true}
                onClose={() => {}}
                onSuccess={() => {
                  if (onSuccess) onSuccess();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default BulkInputHubModal;

