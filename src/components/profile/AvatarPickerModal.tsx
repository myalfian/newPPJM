import React, { useState, useRef } from 'react';
import { X, Upload, Check, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSelectAvatar: (url: string) => Promise<void>;
}

export const AVATAR_PRESETS = [
  {
    id: 'kiai',
    title: 'Pengasuh & Kiai',
    category: 'Pimpinan',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'humas',
    title: 'Ustadz Humas & Media',
    category: 'Konten',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'akademik',
    title: 'Guru Sains & Bahasa',
    category: 'Akademik',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'santri-putra',
    title: 'Santriwan Tahfidz',
    category: 'Santri',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'santri-putri',
    title: 'Santriwati Tahfidz',
    category: 'Santri',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'visitor',
    title: 'Tamu / Pengunjung',
    category: 'Umum',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'logo-ppjm',
    title: 'Logo Resmi PPJM',
    category: 'Institusi',
    url: '/logo-ppjm.svg',
  },
];


export const AvatarPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatar || AVATAR_PRESETS[0].url);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImageToWebP(file, 600, 600, 0.85);
      setCompressionInfo(compressed);
      setSelectedUrl(compressed.previewUrl);
    } catch (err) {
      console.error('Gagal mengompres gambar:', err);
      alert('Gagal memproses gambar. Pastikan format file PNG, JPG, atau WebP.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsSaving(true);
      await onSelectAvatar(selectedUrl);
      onClose();
    } catch (err) {
      console.error('Gagal menerapkan avatar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Pilih Foto Profil</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Gunakan preset elegan atau unggah foto Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Avatar Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 border-2 border-emerald-600 shadow-md shrink-0">
              <img src={selectedUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Pratinjau Avatar Terpilih</p>
              {compressionInfo ? (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  Terkonversi WebP: {compressionInfo.compressedSizeKB} KB (Hemat {compressionInfo.savedPercent}%)
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Preset bawaan siap pakai resolusi tinggi</p>
              )}
            </div>
          </div>

          {/* Upload Custom File */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Unggah dari Perangkat</label>
              <span className="text-[10px] text-zinc-400">Auto-compress ke WebP</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing}
              className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer active:scale-[0.99]"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Mengompresi gambar ke WebP...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Klik untuk Pilih Foto Gambar</span>
                  <span className="text-[10px] text-zinc-400">Mendukung JPG, PNG, WebP (Maks. 5 MB)</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Library */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">
              Pilihan Preset Resmi Pondok
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedUrl(preset.url);
                      setCompressionInfo(null);
                    }}
                    className={`relative p-2 rounded-2xl border transition-all text-left flex flex-col items-center gap-2 group ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-800/40'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-700 relative">
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-700/30 backdrop-blur-[1px] flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <div className="w-full text-center">
                      <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{preset.title}</p>
                      <span className="text-[9px] text-zinc-400">{preset.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Terapkan Avatar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
