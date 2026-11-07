import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Sliders,
  Sparkles,
  Gauge,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  Layers,
} from 'lucide-react';
import type { AdminOutletContext } from './AdminLayout';
import {
  SliderSettings,
  DEFAULT_SLIDER_SETTINGS,
  getSliderSettings,
  fetchSliderSettingsFromSupabase,
  saveSliderSettings,
  TransitionEffect,
} from '../lib/sliderSettings';
import { CardImageSlider } from '../components/common/CardImageSlider';

const SAMPLE_PREVIEW_IMAGES = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
];

export const SliderSettingsPage: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const isSuperAdmin = admin.profile?.role === 'super_admin';

  const [settings, setSettings] = useState<SliderSettings>(getSliderSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSliderSettingsFromSupabase().then((latest) => {
      setSettings(latest);
    });
  }, []);

  const showToast = (kind: 'success' | 'error', text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('error', 'Hanya Super Admin yang berwenang mengubah konfigurasi slider global.');
      return;
    }

    setSaving(true);
    const res = await saveSliderSettings(settings);
    setSaving(false);

    if (res.ok) {
      showToast('success', 'Pengaturan slider global berhasil disimpan dan diterapkan ke seluruh website!');
    } else {
      showToast('error', res.error || 'Gagal menyimpan pengaturan ke database.');
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SLIDER_SETTINGS);
    showToast('success', 'Form dikembalikan ke nilai standar (belum disimpan ke database).');
  };

  if (!isSuperAdmin) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
        <h2 className="text-base font-extrabold text-rose-950">Akses Ditolak</h2>
        <p className="text-xs text-rose-700 max-w-md mx-auto">
          Halaman kontrol kecepatan dan transisi slider global ini dikhususkan secara eksklusif untuk peran <strong>Super Admin</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold text-white shadow-xl ${
            toast.kind === 'success' ? 'bg-[#115E59]' : 'bg-rose-700'
          }`}
        >
          {toast.kind === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-teal-200 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-200 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#115E59]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hak Akses Super Admin</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-teal-950 tracking-tight mt-1">
            Pengaturan Slider &amp; Animasi Global
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Atur kecepatan autoplay, efek transisi perpindahan foto, dan animasi semua card slider di seluruh website secara terpusat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Sliders className="w-4 h-4 text-[#115E59]" />
              <span>Parameter Rotasi &amp; Kecepatan</span>
            </h2>

            {/* 1. Autoplay Interval Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                <label htmlFor="autoplay-interval" className="flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-[#115E59]" />
                  <span>Jeda Putar Otomatis (Autoplay Interval)</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#115E59] font-black border border-emerald-200">
                  {settings.autoplayInterval} Detik
                </span>
              </div>
              <input
                id="autoplay-interval"
                type="range"
                min="2.0"
                max="20.0"
                step="0.5"
                value={settings.autoplayInterval}
                onChange={(e) => setSettings((s) => ({ ...s, autoplayInterval: parseFloat(e.target.value) || 5.0 }))}
                className="w-full accent-[#115E59] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                <span>Cepat (2.0s)</span>
                <span>Standar (5.0s)</span>
                <span>Lambat (20.0s)</span>
              </div>
            </div>

            {/* 2. Transition Speed Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                <label htmlFor="transition-speed" className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#115E59]" />
                  <span>Durasi Transisi Perpindahan (Transition Duration)</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-black border border-amber-200">
                  {settings.transitionSpeed} ms ({((settings.transitionSpeed || 500) / 1000).toFixed(2)}s)
                </span>
              </div>
              <input
                id="transition-speed"
                type="range"
                min="150"
                max="2000"
                step="50"
                value={settings.transitionSpeed}
                onChange={(e) => setSettings((s) => ({ ...s, transitionSpeed: parseInt(e.target.value, 10) || 500 }))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                <span>Kilat (150ms)</span>
                <span>Halus (500ms)</span>
                <span>Perlahan (2000ms)</span>
              </div>
            </div>

            {/* 3. Transition Effect Select */}
            <div className="space-y-2 pt-2">
              <label htmlFor="transition-effect" className="block text-xs font-bold text-zinc-800">
                Jenis Efek Perpindahan (Transition Effect)
              </label>
              <select
                id="transition-effect"
                value={settings.transitionEffect}
                onChange={(e) => setSettings((s) => ({ ...s, transitionEffect: e.target.value as TransitionEffect }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-800 focus:border-[#115E59] focus:outline-none focus:ring-2 focus:ring-[#115E59]/20 cursor-pointer"
              >
                <option value="slide">Geser Horizontal Halus (Slide - Standar)</option>
                <option value="fade">Pudar Lembut (Fade / Crossfade)</option>
                <option value="zoom">Skala Kedalaman (Zoom Scale)</option>
              </select>
              <p className="text-[11px] text-zinc-500">
                Efek ini diterapkan pada semua kartu multi-foto (Galeri, Prestasi, Ekskul, Program, dll).
              </p>
            </div>

            {/* 4. Switch Autoplay Enabled */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <label htmlFor="toggle-autoplay" className="text-xs font-bold text-zinc-800 block cursor-pointer">
                  Aktifkan Putar Otomatis (Autoplay)
                </label>
                <p className="text-[11px] text-zinc-500">
                  Jika dimatikan, slider hanya bergeser saat disentuh / diklik oleh pengguna.
                </p>
              </div>
              <input
                id="toggle-autoplay"
                type="checkbox"
                checked={settings.isAutoplayEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, isAutoplayEnabled: e.target.checked }))}
                className="w-5 h-5 accent-[#115E59] rounded cursor-pointer"
              />
            </div>

            {/* 5. Switch Pause on Hover */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <label htmlFor="toggle-pause-hover" className="text-xs font-bold text-zinc-800 block cursor-pointer">
                  Jeda Otomatis Saat Kursor Melayang (Pause on Hover)
                </label>
                <p className="text-[11px] text-zinc-500">
                  Menjeda rotasi otomatis saat pengguna menaruh mouse di atas kartu untuk membaca teks/caption.
                </p>
              </div>
              <input
                id="toggle-pause-hover"
                type="checkbox"
                checked={settings.pauseOnHover}
                onChange={(e) => setSettings((s) => ({ ...s, pauseOnHover: e.target.checked }))}
                className="w-5 h-5 accent-[#115E59] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[44px] items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Standar Default</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[44px] items-center gap-2 px-6 py-2 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-xs font-bold text-white shadow-sm transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan ke Cloud…' : 'Simpan Pengaturan Slider'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#115E59]" />
              <span>Pratinjau Langsung (Live Preview)</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              3 Foto Uji Coba
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            Komponen di bawah menggunakan <code>CardImageSlider</code> asli yang sama persis dengan web publik. Perubahan slider di sebelah kiri langsung disimulasikan secara real-time.
          </p>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-2.5">
            <CardImageSlider
              images={SAMPLE_PREVIEW_IMAGES}
              aspectRatio="aspect-[16/10]"
              alt="Simulasi Kartu Dokumentasi Pondok"
              customSettings={settings}
              badgeTopLeft={
                <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-black text-white border border-white/20 uppercase tracking-wider">
                  Live Preview
                </span>
              }
            />
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
            <p className="font-bold">Catatan Sinkronisasi Realtime:</p>
            <p className="leading-relaxed text-amber-900">
              Ketika tombol "Simpan" diklik, seluruh halaman publik (Galeri, Prestasi, Ekskul, Berita, dan Beranda) akan langsung menerima konfigurasi ini tanpa memerlukan build ulang aplikasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

