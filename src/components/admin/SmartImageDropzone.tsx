import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Crop,
  Sparkles
} from 'lucide-react';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

export type AspectRatioPreset = 'banner' | 'square' | 'portrait' | 'landscape' | 'any';

export interface SmartImageDropzoneProps {
  value?: string;
  onChange: (url: string, file?: File) => void;
  label?: string;
  helperText?: string;
  aspectRatioPreset?: AspectRatioPreset;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  className?: string;
}

const PRESET_CONFIG: Record<
  AspectRatioPreset,
  { name: string; ratioClass: string; badge: string; dimensions: string }
> = {
  banner: {
    name: 'Persegi Panjang Flyer / Banner',
    ratioClass: 'aspect-[16/9]',
    badge: '16:9 Banner',
    dimensions: '1920 × 1080 px'
  },
  square: {
    name: 'Kotak Presisi',
    ratioClass: 'aspect-square',
    badge: '1:1 Persegi',
    dimensions: '800 × 800 px'
  },
  portrait: {
    name: 'Potret Formal Pengasuh / Tokoh',
    ratioClass: 'aspect-[4/5]',
    badge: '4:5 Potret',
    dimensions: '800 × 1000 px'
  },
  landscape: {
    name: 'Dokumentasi Lanskap',
    ratioClass: 'aspect-[4/3]',
    badge: '4:3 Dokumentasi',
    dimensions: '1200 × 900 px'
  },
  any: {
    name: 'Rasio Asli Foto',
    ratioClass: 'min-h-[220px]',
    badge: 'Fleksibel',
    dimensions: 'Bebas'
  }
};

export const SmartImageDropzone: React.FC<SmartImageDropzoneProps> = ({
  value,
  onChange,
  label = 'Pilih Foto dari Galeri / Kamera',
  helperText,
  aspectRatioPreset = 'banner',
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const preset = PRESET_CONFIG[aspectRatioPreset];

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih file berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);

    try {
      const result = await compressImageToWebP(file, maxWidth, maxHeight, quality);
      setCompressionStats(result);
      onChange(result.dataUrl, result.file);
    } catch (err: any) {
      console.error('Gagal mengompres gambar:', err);
      setErrorMessage('Terjadi kendala saat memproses gambar. Silakan gunakan foto lain.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleProcessFile(file);
      }
    },
    [maxWidth, maxHeight, quality]
  );

  const handleClear = () => {
    onChange('');
    setCompressionStats(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label & Panduan Rasio Visual */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#007acc]" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
          <Crop className="w-3 h-3 text-amber-500" />
          <span>{preset.badge}</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-400">{preset.dimensions}</span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
      />

      {/* Dropzone Container */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerPicker}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerPicker();
            }
          }}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[180px] ${
            isDragging
              ? 'border-[#007acc] bg-blue-50/60 dark:bg-blue-950/20 scale-[0.99]'
              : 'border-zinc-200/90 dark:border-zinc-800 hover:border-[#007acc]/60 bg-zinc-50/70 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 shadow-xs'
          }`}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <RefreshCw className="w-8 h-8 text-[#007acc] animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Mengompres & Menyesuaikan Foto...
                </p>
                <p className="text-[11px] text-zinc-400">
                  Otomatis mengubah ke format WebP ringan berkualitas tinggi
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70 flex items-center justify-center text-[#007acc] group-hover:scale-110 group-hover:bg-[#007acc] group-hover:text-white transition-all duration-200">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <span className="text-[#007acc] hover:underline">Klik untuk memilih foto</span> atau tarik file ke sini
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Mendukung kamera HP, JPG, PNG & WebP (Otomatis dikompresi agar cepat diakses)
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Teknologi WebP: Muat lebih cepat 3x lipat & hemat kuota santri</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview Box with Controls */
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-900/5 group shadow-sm">
          {/* Main Photo Display */}
          <div className={`w-full overflow-hidden flex items-center justify-center bg-zinc-950/10 ${preset.ratioClass}`}>
            <img
              src={value}
              alt="Pratinjau Foto"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>

          {/* Overlay Status Bar: Compression Stats */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {compressionStats ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-600 text-white shadow-md backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Hemat {compressionStats.savedPercent}% ({compressionStats.originalSizeKB} KB → {compressionStats.compressedSizeKB} KB WebP)
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-zinc-900/80 text-white shadow-md backdrop-blur-md border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Foto Siap Tayang</span>
              </span>
            )}

            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
              {preset.badge}
            </span>
          </div>

          {/* Action Toolbar with Thumb-Friendly Buttons (>= 48px target) */}
          <div className="p-3 bg-white/95 dark:bg-zinc-900/95 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerPicker}
                className="min-h-[44px] sm:min-h-[48px] px-4 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-white bg-zinc-100 hover:bg-[#007acc] dark:bg-zinc-800 dark:hover:bg-[#007acc] border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ganti Foto</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="min-h-[44px] sm:min-h-[48px] px-3.5 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 border border-rose-200/80 dark:border-rose-900/60 transition-all flex items-center gap-2 active:scale-95"
                title="Hapus foto saat ini"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Hapus</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 font-medium">
              {helperText || `Format optimal: ${preset.name}`}
            </p>
          </div>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
