import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gauge, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Eye, 
  Layers,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Loader2
} from 'lucide-react';
import { 
  SliderSettings, 
  getSliderSettings, 
  saveSliderSettings, 
  DEFAULT_SLIDER_SETTINGS,
  getHeroSlides,
  fetchHeroSlidesFromSupabase,
  saveHeroSlides,
  resetHeroSlidesToDefault
} from '../../lib/sliderSettings';
import { HeroSlide } from '../../data/heroSlides';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

interface SlideFormState {
  id: string;
  badge: string;
  title: string;
  desc: string;
  image: string;
  link: string;
}

const EMPTY_FORM: SlideFormState = {
  id: '',
  badge: '',
  title: '',
  desc: '',
  image: '',
  link: '',
};

export const KelolaSlider: React.FC = () => {
  // 1. State Daftar Slide
  const [slides, setSlides] = useState<HeroSlide[]>(getHeroSlides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSlideForm, setShowSlideForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<SlideFormState>(EMPTY_FORM);
  const [compressing, setCompressing] = useState<boolean>(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [slideSaveMsg, setSlideSaveMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. State Pengaturan Kecepatan Slider
  const [settings, setSettings] = useState<SliderSettings>(getSliderSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewActiveIndex, setPreviewActiveIndex] = useState(0);

  // Muat data terbaru dari Supabase saat halaman dibuka & dengarkan perubahan
  useEffect(() => {
    fetchHeroSlidesFromSupabase().then((remoteSlides) => {
      setSlides(remoteSlides);
    });

    const handleSlidesChanged = (e: Event) => {
      const customEvent = e as CustomEvent<HeroSlide[]>;
      if (customEvent.detail) {
        setSlides(customEvent.detail);
      } else {
        setSlides(getHeroSlides());
      }
    };

    window.addEventListener('ppjm-hero-slides-changed', handleSlidesChanged);
    return () => window.removeEventListener('ppjm-hero-slides-changed', handleSlidesChanged);
  }, []);

  // Pastikan indeks preview tetap valid saat jumlah slide berubah
  useEffect(() => {
    if (previewActiveIndex >= slides.length) {
      setPreviewActiveIndex(0);
    }
  }, [slides.length, previewActiveIndex]);

  // Live preview autoplay simulator
  useEffect(() => {
    if (!settings.isAutoplayEnabled || slides.length <= 1) return;
    const intervalMs = Math.max(settings.autoplayInterval * 1000, 1500);
    const timer = setInterval(() => {
      setPreviewActiveIndex(prev => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [settings.autoplayInterval, settings.isAutoplayEnabled, slides.length]);

  const showToast = (msg: string) => {
    setSlideSaveMsg(msg);
    setTimeout(() => setSlideSaveMsg(null), 3000);
  };

  // Buka form Tambah Slide Baru
  const handleStartAdd = () => {
    setEditingId(null);
    setFormData({
      id: `slide-${Date.now()}`,
      badge: '',
      title: '',
      desc: '',
      image: '',
      link: '',
    });
    setCompressionInfo(null);
    setShowSlideForm(true);
  };

  // Buka form Edit Slide
  const handleStartEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setFormData({
      id: slide.id,
      badge: slide.badge || '',
      title: slide.title || '',
      desc: slide.desc || '',
      image: slide.image || '',
      link: slide.link || '',
    });
    setCompressionInfo(null);
    setShowSlideForm(true);
  };

  // Upload & Kompres Gambar ke WebP DataURL
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }
    setCompressing(true);
    try {
      const res = await compressImageToWebP(file, 1400, 900, 0.82);
      setCompressionInfo(res);
      setFormData(prev => ({ ...prev, image: res.dataUrl }));
    } catch (err: any) {
      alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setCompressing(false);
    }
  };

  // Simpan Slide (Tambah / Edit)
  const handleSaveSlideForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.badge.trim()) {
      alert('Mohon isi Badge / Kategori slide terlebih dahulu.');
      return;
    }
    if (!formData.image.trim()) {
      alert('Mohon pilih dan unggah gambar flyer dari komputer terlebih dahulu.');
      return;
    }

    const newSlide: HeroSlide = {
      id: formData.id || `slide-${Date.now()}`,
      badge: formData.badge.trim(),
      title: formData.title.trim(),
      desc: formData.desc.trim(),
      image: formData.image.trim(),
      link: formData.link.trim(),
      website: 'https://ppjauharulmaknuun.sch.id/',
    };

    let updatedSlides: HeroSlide[];
    if (editingId) {
      updatedSlides = slides.map(s => (s.id === editingId ? { ...s, ...newSlide } : s));
    } else {
      updatedSlides = [...slides, newSlide];
    }

    setSlides(updatedSlides);
    setShowSlideForm(false);
    setEditingId(null);
    setCompressionInfo(null);

    await saveHeroSlides(updatedSlides);
    showToast(editingId ? 'Perubahan slide berhasil disimpan!' : 'Slide baru berhasil ditambahkan!');
  };

  // Hapus Slide (Minimal 1 slide tersisa)
  const handleDeleteSlide = async (id: string) => {
    if (slides.length <= 1) {
      alert('Minimal harus ada 1 slide yang tampil di HeroSlider.');
      return;
    }
    const target = slides.find(s => s.id === id);
    if (!window.confirm(`Hapus slide "${target?.title || target?.badge}" dari beranda?`)) {
      return;
    }
    const updatedSlides = slides.filter(s => s.id !== id);
    setSlides(updatedSlides);
    await saveHeroSlides(updatedSlides);
    showToast('Slide berhasil dihapus.');
  };

  // Geser Urutan Slide (Atas / Bawah)
  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const updated = [...slides];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setSlides(updated);
    await saveHeroSlides(updated);
    showToast('Urutan slide diperbarui.');
  };

  // Reset ke 5 Slide Bawaan PPJM
  const handleResetSlides = async () => {
    if (!window.confirm('Kembalikan daftar konten slide ke 5 Slide Standar PPJM?')) {
      return;
    }
    const defaults = await resetHeroSlidesToDefault();
    setSlides(defaults);
    setShowSlideForm(false);
    setEditingId(null);
    showToast('Konten dikembalikan ke 5 Slide Standar PPJM.');
  };

  const handleSave = () => {
    saveSliderSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SLIDER_SETTINGS);
    saveSliderSettings(DEFAULT_SLIDER_SETTINGS);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activePreviewSlide = slides[previewActiveIndex] || slides[0];

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-m3-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Manajemen Konten & Kecepatan Slider</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kelola Hero Slider Beranda
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90">
            Tambah, ubah, dan atur urutan gambar flyer di HeroSlider beranda beserta kecepatan putar otomatisnya.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-colors shrink-0"
        >
          <span>Lihat di Beranda</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Notifikasi Simpan Slide */}
      {slideSaveMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{slideSaveMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSlideSaveMsg(null)}
            className="text-emerald-700 hover:text-emerald-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= BAGIAN 1: KELOLA KONTEN SLIDE ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Daftar Konten Slide ({slides.length} Slide)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik <strong>Tambah Slide Baru</strong> untuk mengisi banner/flyer baru, atau gunakan panah untuk mengatur urutan tampil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetSlides}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Kembalikan ke 5 Slide Standar PPJM"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 5 Slide Standar</span>
            </button>

            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a6b3c] hover:bg-[#0d4a28] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Slide Baru</span>
            </button>
          </div>
        </div>

        {/* Form Tambah / Edit Slide */}
        {showSlideForm && (
          <form
            onSubmit={handleSaveSlideForm}
            className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-emerald-200/80 space-y-5 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">
                {editingId ? 'Edit Konten Slide' : 'Tambah Slide Baru ke HeroSlider'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowSlideForm(false);
                  setEditingId(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Kolom Kiri: Gambar Flyer (Upload WebP dari Komputer) */}
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  1. Gambar Flyer Slide (Upload dari Komputer • WebP Auto-Compress) <span className="text-red-500">*</span>
                </label>

                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={compressing}
                    className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-emerald-300 bg-white hover:bg-emerald-50/50 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    {compressing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                        <span>Mengompres ke WebP...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span>{formData.image ? 'Ganti Flyer dari Komputer (Auto WebP)' : 'Pilih Gambar Flyer dari Komputer (Auto WebP)'}</span>
                      </>
                    )}
                  </button>

                  {compressionInfo && (
                    <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ✓ Terkompresi ke WebP ({compressionInfo.compressedSizeKB} KB, hemat {compressionInfo.savedPercent}%)
                    </p>
                  )}
                </div>

                {/* Pratinjau Thumbnail Gambar */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="Pratinjau Slide"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#1a6b3c]/90 text-emerald-200 border border-emerald-400/40">
                          <Sparkles className="w-2.5 h-2.5 text-[#ffcc00]" />
                          <span>{formData.badge || 'Contoh Badge'}</span>
                        </span>
                        {formData.title && (
                          <p className="text-xs font-extrabold text-white mt-1 line-clamp-1">
                            {formData.title}
                          </p>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-black/70 hover:bg-black/90 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Ganti
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: '' }));
                            setCompressionInfo(null);
                          }}
                          className="px-2.5 py-1 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 text-slate-400 space-y-1">
                      <ImageIcon className="w-7 h-7 mx-auto opacity-60" />
                      <p className="text-[11px]">Belum ada gambar dipilih</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Badge, Judul, Deskripsi & Link Tujuan */}
              <div className="lg:col-span-7 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Badge / Kategori Pojok Kiri Atas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Takhassus Al-Qur'an Bersanad / PSB 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Judul Slide (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Pendaftaran Santri Baru Tahun Ajaran 2025/2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tampil di bawah badge dan menjadi judul saat kartu diklik. Kosongkan jika gambar flyer sudah penuh tulisan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. Deskripsi Informasi Popup (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder="Keterangan lengkap yang akan tampil di dalam jendela popup ketika pengunjung mengklik kartu slide ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    5. Link Tujuan Saat Slide Diklik (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="Kosongkan agar membuka popup detail, atau isi misal: https://wa.me/628..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSlideForm(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1a6b3c] hover:bg-[#0d4a28] text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'Simpan Perubahan Slide' : 'Tambahkan ke Slider'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Daftar Kartu Slide Saat Ini */}
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title || slide.badge}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono font-bold">
                    #{idx + 1}
                  </span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    <span className="truncate">{slide.badge}</span>
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">
                    {slide.title || <span className="text-slate-400 font-normal italic">(Tanpa judul teks di atas flyer)</span>}
                  </h4>
                  {slide.desc && (
                    <p className="text-xs text-slate-500 line-clamp-1">{slide.desc}</p>
                  )}
                  {slide.link && (
                    <p className="text-[11px] text-blue-600 font-medium truncate">
                      🔗 Link: {slide.link}
                    </p>
                  )}
                </div>
              </div>

              {/* Tombol Aksi: Geser Urutan, Edit, Hapus */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveSlide(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                  title="Geser ke Atas (Tampil Lebih Awal)"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSlide(idx, 'down')}
                  disabled={idx === slides.length - 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                  title="Geser ke Bawah"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(slide)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  title="Hapus Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BAGIAN 2: PENGATURAN KECEPATAN & AUTOPLAY ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-emerald-950">
              Pengaturan Kecepatan & Animasi Transisi
            </h2>
            <p className="text-xs text-slate-500">
              Atur jeda waktu antar slide dan kehalusan pergerakan 3D coverflow.
            </p>
          </div>
        </div>
        
        {/* 1. Pengaturan Autoplay Interval */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-emerald-950">
                1. Durasi Tampil per Slide (Interval)
              </h3>
              <p className="text-xs text-slate-500">
                Lama waktu (dalam detik) sebelum slide berpindah ke slide berikutnya secara otomatis.
              </p>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-sm font-bold self-start sm:self-auto">
              {settings.autoplayInterval} Detik
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={settings.autoplayInterval}
              onChange={(e) => setSettings({ ...settings, autoplayInterval: parseFloat(e.target.value) })}
              className="w-full accent-[#1a6b3c] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: '3 Detik (Cepat)', val: 3, desc: 'Cocok untuk promo singkat' },
                { label: '5.5 Detik (Standar)', val: 5.5, desc: 'Kecepatan ideal terbaca' },
                { label: '8 Detik (Santai)', val: 8, desc: 'Waktu baca flyer lebih lama' },
                { label: '12 Detik (Lambat)', val: 12, desc: 'Sangat rileks' },
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setSettings({ ...settings, autoplayInterval: item.val })}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    settings.autoplayInterval === item.val
                      ? 'bg-emerald-50 border-[#1a6b3c] text-[#1a6b3c] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Pengaturan Kecepatan Transisi Gerakan */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-emerald-950">
                2. Kecepatan Efek Transisi Animasi
              </h3>
              <p className="text-xs text-slate-500">
                Kecepatan geser 3D saat kartu berputar (dalam milidetik / ms).
              </p>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono text-sm font-bold self-start sm:self-auto">
              {settings.transitionSpeed} ms
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Responsif Cepat (350 ms)', val: 350, desc: 'Gerakan tegas dan instan' },
              { label: 'Halus Natural (600 ms)', val: 600, desc: 'Standar rekomendasi elegan' },
              { label: 'Sinematik Lembut (1000 ms)', val: 1000, desc: 'Luncuran lambat dan megah' },
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setSettings({ ...settings, transitionSpeed: item.val })}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  settings.transitionSpeed === item.val
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Saklar Autoplay Otomatis */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              settings.isAutoplayEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {settings.isAutoplayEnabled ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Putar Otomatis (Autoplay)
              </h4>
              <p className="text-xs text-slate-500">
                {settings.isAutoplayEnabled 
                  ? 'Slide akan otomatis berganti sesuai durasi yang dipilih di atas.' 
                  : 'Slide hanya berganti saat pengunjung menekan tombol panah atau menggeser layar.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSettings({ ...settings, isAutoplayEnabled: !settings.isAutoplayEnabled })}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
              settings.isAutoplayEnabled ? 'bg-[#1a6b3c]' : 'bg-gray-300'
            }`}
          >
            <span 
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.isAutoplayEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 4. Live Simulation Preview Card */}
        {activePreviewSlide && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>Simulasi Pratinjau Slide & Kecepatan Saat Ini:</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#071526] text-white flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                <img 
                  src={activePreviewSlide.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono">
                  Slide {(previewActiveIndex % slides.length) + 1}/{slides.length}
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
                  {activePreviewSlide.badge}
                </div>
                <h5 className="font-extrabold text-sm sm:text-base text-white">
                  {activePreviewSlide.title || '(Flyer Visual Tanpa Judul Overlay)'}
                </h5>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {activePreviewSlide.desc || 'Klik slide di beranda untuk melihat gambar penuh.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kembalikan Kecepatan Standar (5.5s)</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Pengaturan Berhasil Disimpan & Aktif!</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a6b3c] hover:bg-[#0d4a28] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan Kecepatan</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
