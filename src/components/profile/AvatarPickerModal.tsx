import React, { useState, useRef, useMemo } from 'react';
import { X, Upload, Check, Sparkles, Image as ImageIcon, Loader2, AlertCircle, Type, UserCheck } from 'lucide-react';
import { validateImageMagicBytes, sanitizeUrl } from '../../utils/sanitize';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName?: string;
  onSelectAvatar: (url: string) => Promise<void>;
}

export const ISLAMIC_AVATAR_PRESETS = [
  { id: 'pres-1', title: 'Santriwan Peci Hitam', category: 'Santri', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-2', title: 'Santriwati Hijab Syari', category: 'Santri', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-3', title: 'Asatidz Diniyah', category: 'Pengajar', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-4', title: 'Ustadzah Tahfidz', category: 'Pengajar', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-5', title: 'Santri Muda Qurani', category: 'Santri', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-6', title: 'Khidmah Lab STEM', category: 'Riset', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-7', title: 'Humas & Media Pesantren', category: 'Staf', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-8', title: 'Pembina OSIS', category: 'Organisasi', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-9', title: 'Muadzin Masjid Jami', category: 'Ibadah', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-10', title: 'Keluarga Ndalem', category: 'Pimpinan', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80' },
  { id: 'pres-11', title: 'Logo Resmi PPJM', category: 'Institusi', url: '/logo-ppjm.svg' },
  { id: 'pres-12', title: 'Avatar Santri Default', category: 'Umum', url: '/avatars/guest-avatar.svg' },
];

const INITIAL_COLORS = [
  { name: 'Emerald Hijau', bg: '#0E7A4C', text: '#FFFFFF' },
  { name: 'Gold Maknuun', bg: '#C8A951', text: '#0A2116' },
  { name: 'Navy Santri', bg: '#1E3A8A', text: '#FFFFFF' },
  { name: 'Teal Modern', bg: '#0F766E', text: '#FFFFFF' },
  { name: 'Indigo Khidmah', bg: '#4338CA', text: '#FFFFFF' },
  { name: 'Dark Onyx', bg: '#0A2116', text: '#C8A951' },
];

export const AvatarPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName = 'Santri PPJM',
  onSelectAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'initials'>('presets');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatar || ISLAMIC_AVATAR_PRESETS[0].url);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressionDetails, setCompressionDetails] = useState<string | null>(null);

  // Initial Avatar State
  const [selectedInitialColor, setSelectedInitialColor] = useState(INITIAL_COLORS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitial = useMemo(() => {
    const parts = (userName || 'S').trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0][0] || 'S').toUpperCase();
  }, [userName]);

  if (!isOpen) return null;

  // Generate SVG Data URL untuk avatar initial
  const generateInitialSvg = (color: typeof INITIAL_COLORS[0]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${color.bg}" rx="80" />
      <text x="50%" y="54%" font-family="Plus Jakarta Sans, sans-serif" font-size="150" font-weight="900" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">${userInitial}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // Secure Image File Upload with Magic Number & Canvas WebP Compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsCompressing(true);

    try {
      // 1. Ekstensi file blacklist check (.svg dengan script, .php, .html, .js, .exe)
      const fileNameLower = file.name.toLowerCase();
      const dangerousExts = ['.php', '.html', '.htm', '.js', '.svg', '.sh', '.exe', '.bat'];
      if (dangerousExts.some((ext) => fileNameLower.endsWith(ext))) {
        throw new Error('Format file ditolak! Hanya file gambar JPG, PNG, atau WebP murni yang diizinkan.');
      }

      // 2. MIME type whitelist check
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(file.type)) {
        throw new Error('MIME file tidak valid. Hanya JPG, PNG, dan WebP yang didukung.');
      }

      // 3. Size check (max 5MB sebelum kompresi)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal sebelum kompresi adalah 5MB.');
      }

      // 4. Magic number signature binary check
      const isMagicValid = await validateImageMagicBytes(file);
      if (!isMagicValid) {
        throw new Error('Deteksi tanda tangan file gagal! File ini bukan gambar biner valid.');
      }

      // 5. Canvas Client-side Resizing & WebP Compression to 400x400
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Gagal menguraikan gambar ke elemen canvas.'));
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Browser tidak mendukung 2D Canvas context.');

      // Center crop square 1:1
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 400, 400);

      const webpDataUrl = canvas.toDataURL('image/webp', 0.85);
      URL.revokeObjectURL(objectUrl);

      const originalKB = Math.round(file.size / 1024);
      const compressedKB = Math.round((webpDataUrl.length * 3) / 4 / 1024);

      setCompressedPreview(webpDataUrl);
      setSelectedUrl(webpDataUrl);
      setCompressionDetails(`${originalKB} KB ➔ ${compressedKB} KB (WebP 400×400)`);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal memproses upload gambar.');
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      setUploadError('Gagal menyimpan foto profil ke sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92dvh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Pilih Foto Profil Santri</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                  WebP Secure
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">12 Preset Islami, WebP Compressor, &amp; Initial Avatar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 border-b border-zinc-100 dark:border-zinc-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-black'
                : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Islami (12)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-black'
                : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Foto (WebP)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('initials');
              setSelectedUrl(generateInitialSvg(selectedInitialColor));
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'initials'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-black'
                : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Avatar Huruf</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {ISLAMIC_AVATAR_PRESETS.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedUrl(item.url)}
                    className={`relative p-2 rounded-2xl border text-left transition-all group ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-300'
                    }`}
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                      <img src={sanitizeUrl(item.url)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate mt-1.5">{item.title}</p>
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider">{item.category}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: UPLOAD WEBP */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-500/40 dark:border-emerald-600/40 hover:border-emerald-600 rounded-3xl p-8 text-center cursor-pointer transition-all bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  {isCompressing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Klik atau geser file foto ke sini</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Format JPG, PNG, atau WebP (Maks 5MB) • Auto-compress ke WebP 400×400
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Compressed Preview Result */}
              {compressedPreview && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-500 shadow-md shrink-0">
                    <img src={compressedPreview} alt="WebP Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                      <UserCheck className="w-3 h-3" /> Siap Digunakan
                    </span>
                    <p className="text-xs font-bold text-zinc-800 dark:text-white mt-1">Hasil Kompresi WebP</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{compressionDetails}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INITIAL AVATAR */}
          {activeTab === 'initials' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl"
                  style={{ backgroundColor: selectedInitialColor.bg, color: selectedInitialColor.text }}
                >
                  {userInitial}
                </div>
                <p className="text-xs text-zinc-500">Avatar Huruf dari inisial: <strong className="text-zinc-900 dark:text-white">{userName}</strong></p>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">Pilih Nuansa Warna Identitas:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {INITIAL_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedInitialColor(c);
                        setSelectedUrl(generateInitialSvg(c));
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedInitialColor.name === c.name
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg shadow-xs" style={{ backgroundColor: c.bg }} />
                      <span className="text-[9px] font-medium text-zinc-700 dark:text-zinc-300 truncate w-full text-center">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isSaving || isCompressing || !selectedUrl}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan Foto Profil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
