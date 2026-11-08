import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams, Link } from 'react-router-dom';
import {
  Sliders,
  Sparkles,
  Gauge,
  Timer,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  Layers,
  ExternalLink,
} from 'lucide-react';
import type { AdminOutletContext } from './AdminLayout';
import {
  SliderSettings,
  DEFAULT_SLIDER_SETTINGS,
  getSliderSettings,
  fetchSliderSettingsFromSupabase,
  saveSliderSettings,
  TransitionEffect,
  TickerDirection,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'all' | 'ticker' | 'slider') || 'all';

  const [settings, setSettings] = useState<SliderSettings>(getSliderSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSliderSettingsFromSupabase().then((latest) => {
      setSettings(latest);
    });
  }, []);

  const setTab = (tab: 'all' | 'ticker' | 'slider') => {
    if (tab === 'all') {
      const sp = new URLSearchParams(searchParams);
      sp.delete('tab');
      setSearchParams(sp, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  };

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
      showToast('success', 'Pengaturan slider global & Info Terkini berhasil disimpan dan diterapkan ke seluruh website!');
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
            Pengaturan Slider &amp; Info Terkini Global
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Pusat kendali terpadu untuk kecepatan teks berjalan "INFO TERKINI" di header dan seluruh slider gambar di website.
          </p>
        </div>
      </div>

      {/* Tab Filter Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#115E59] text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Pengaturan</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('ticker')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'ticker'
              ? 'bg-[#115E59] text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Teks Berjalan "INFO TERKINI"</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('slider')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'slider'
              ? 'bg-[#115E59] text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Slider Foto Global</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-7 shadow-xs space-y-8">
          
          {/* SECTION A: TEKS BERJALAN "INFO TERKINI" */}
          {(activeTab === 'all' || activeTab === 'ticker') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div>
                  <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Teks Berjalan "INFO TERKINI" (Header Website)</span>
                  </h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Atur kecepatan gulir, arah animasi, dan status tampil marquee di header.
                  </p>
                </div>
                <Link
                  to="/admin/s/info_terkini"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#115E59] hover:underline bg-teal-50/70 border border-teal-200/60 px-2.5 py-1 rounded-xl"
                  title="Buka CRUD editor isi berita Info Terkini"
                >
                  <span>Kelola Isi Berita</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              {/* A1. Toggle Aktif/Nonaktif Ticker */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <label htmlFor="toggle-ticker-enabled" className="text-xs font-bold text-zinc-800 block cursor-pointer">
                    Tampilkan Bar Info Terkini di Header
                  </label>
                  <p className="text-[11px] text-zinc-500">
                    Bila dimatikan, bilah berita berjalan di atas menu navigasi disembunyikan sepenuhnya.
                  </p>
                </div>
                <input
                  id="toggle-ticker-enabled"
                  type="checkbox"
                  checked={settings.isTickerEnabled}
                  onChange={(e) => setSettings((s) => ({ ...s, isTickerEnabled: e.target.checked }))}
                  className="w-5 h-5 accent-[#115E59] rounded cursor-pointer"
                />
              </div>

              {/* Quick Presets for Ticker Duration */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-zinc-700 mb-2">
                  Pilihan Cepat Kecepatan Putaran (Presets):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { dur: 100, label: 'Sangat Santai', sub: '100s • Tenang' },
                    { dur: 75, label: 'Rekomendasi', sub: '75s • Nyaman' },
                    { dur: 50, label: 'Sedang', sub: '50s • Standar' },
                    { dur: 35, label: 'Cepat', sub: '35s • Kilat' },
                  ].map((preset) => {
                    const isActive = settings.tickerDuration === preset.dur;
                    return (
                      <button
                        key={preset.dur}
                        type="button"
                        onClick={() => setSettings((s) => ({ ...s, tickerDuration: preset.dur }))}
                        className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                          isActive
                            ? 'border-[#115E59] bg-teal-50/70 text-[#115E59] shadow-2xs ring-2 ring-[#115E59]/20'
                            : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/80 text-zinc-700'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{preset.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{preset.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* A2. Durasi Ticker Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                  <label htmlFor="ticker-duration" className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Durasi Putaran Presisi (Semakin Besar = Semakin Lambat)</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-black border border-amber-200">
                    {settings.tickerDuration} Detik
                  </span>
                </div>
                <input
                  id="ticker-duration"
                  type="range"
                  min="15"
                  max="180"
                  step="5"
                  value={settings.tickerDuration}
                  onChange={(e) => setSettings((s) => ({ ...s, tickerDuration: parseInt(e.target.value, 10) || 75 }))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                  <span>Cepat (15s)</span>
                  <span>Standar (50s)</span>
                  <span className="text-amber-800 font-bold">Rekomendasi (75s)</span>
                  <span>Sangat Lambat (180s)</span>
                </div>
              </div>

              {/* A3. Arah Gulir & Jeda Hover */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="ticker-direction" className="block text-xs font-bold text-zinc-800">
                    Arah Gulir Teks
                  </label>
                  <select
                    id="ticker-direction"
                    value={settings.tickerDirection}
                    onChange={(e) => setSettings((s) => ({ ...s, tickerDirection: e.target.value as TickerDirection }))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-800 focus:border-[#115E59] focus:outline-none focus:ring-2 focus:ring-[#115E59]/20 cursor-pointer"
                  >
                    <option value="left">Kanan ke Kiri (Standar Marquee)</option>
                    <option value="right">Kiri ke Kanan (Terbalik)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/60">
                  <div>
                    <label htmlFor="ticker-pause-hover" className="text-xs font-bold text-zinc-800 block cursor-pointer">
                      Jeda Saat Hover
                    </label>
                    <p className="text-[10px] text-zinc-500">Berhenti saat kursor mouse di atas teks</p>
                  </div>
                  <input
                    id="ticker-pause-hover"
                    type="checkbox"
                    checked={settings.tickerPauseOnHover}
                    onChange={(e) => setSettings((s) => ({ ...s, tickerPauseOnHover: e.target.checked }))}
                    className="w-4 h-4 accent-[#115E59] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: PENGATURAN SLIDER GAMBAR GLOBAL */}
          {(activeTab === 'all' || activeTab === 'slider') && (
            <div className={`space-y-4 ${activeTab === 'all' ? 'pt-4 border-t border-zinc-200' : ''}`}>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div>
                  <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#115E59]" />
                    <span>Slider Gambar Global (Hero, Galeri, Prestasi, Program)</span>
                  </h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Atur interval autoplay dan transisi animasi perpindahan foto pada seluruh kartu multi-foto.
                  </p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#115E59] border border-emerald-200">
                  Multi-Foto Card
                </span>
              </div>

              {/* Quick Presets for Slider Autoplay */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-zinc-700 mb-2">
                  Pilihan Cepat Jeda Putar Otomatis (Presets):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { sec: 3.0, label: 'Dinamis', sub: '3.0 dtk' },
                    { sec: 5.0, label: 'Standar', sub: '5.0 dtk' },
                    { sec: 8.0, label: 'Santai', sub: '8.0 dtk' },
                    { sec: 12.0, label: 'Tenang', sub: '12.0 dtk' },
                  ].map((preset) => {
                    const isActive = settings.autoplayInterval === preset.sec;
                    return (
                      <button
                        key={preset.sec}
                        type="button"
                        onClick={() => setSettings((s) => ({ ...s, autoplayInterval: preset.sec }))}
                        className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                          isActive
                            ? 'border-[#115E59] bg-teal-50/70 text-[#115E59] shadow-2xs ring-2 ring-[#115E59]/20'
                            : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/80 text-zinc-700'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{preset.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{preset.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* B1. Autoplay Interval Slider */}
              <div className="space-y-2 pt-2">
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

              {/* B2. Transition Speed Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                  <label htmlFor="transition-speed" className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#115E59]" />
                    <span>Durasi Transisi Perpindahan (Transition Duration)</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 font-black border border-teal-200">
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
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                  <span>Kilat (150ms)</span>
                  <span>Halus (500ms)</span>
                  <span>Perlahan (2000ms)</span>
                </div>
              </div>

              {/* B3. Transition Effect Select */}
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

              {/* B4. Switch Autoplay Enabled */}
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

              {/* B5. Switch Pause on Hover */}
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
          )}

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
              <span>{saving ? 'Menyimpan ke Cloud…' : 'Simpan Semua Pengaturan Slider'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Interactive Previews */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Preview 1: Live Ticker Header */}
          {(activeTab === 'all' || activeTab === 'ticker') && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Pratinjau Live "INFO TERKINI"</span>
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  settings.isTickerEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}>
                  {settings.isTickerEnabled ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {settings.isTickerEnabled ? (
                <div className="rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/15 p-2 overflow-hidden">
                  <div className="flex items-center gap-2 overflow-hidden select-none">
                    <div className="bg-[#1a6b3c] text-white font-black px-2 py-0.5 rounded text-[10px] shrink-0 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d4af37] animate-pulse" />
                      <span>INFO TERKINI</span>
                    </div>
                    <div className="overflow-hidden whitespace-nowrap w-full group">
                      <div
                        className={`animate-ticker text-[#0d4a28] font-medium text-xs inline-flex items-center space-x-4 ${
                          settings.tickerPauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
                        }`}
                        style={{
                          animationDuration: `${settings.tickerDuration || 75}s`,
                          animationDirection: settings.tickerDirection === 'right' ? 'reverse' : 'normal',
                        }}
                      >
                        <span>✨ SPMB TP 2026/2027 Telah Dibuka</span>
                        <span className="text-[#1a6b3c]/40">|</span>
                        <span>🏆 Akreditasi "A" BAN-PDM Resmi Diraih</span>
                        <span className="text-[#1a6b3c]/40">|</span>
                        <span>🔬 Kurikulum Terpadu STEM &amp; Tahfidz 30 Juz</span>
                        <span className="text-[#1a6b3c]/40">|</span>
                        {/* Loop */}
                        <span>✨ SPMB TP 2026/2027 Telah Dibuka</span>
                        <span className="text-[#1a6b3c]/40">|</span>
                        <span>🏆 Akreditasi "A" BAN-PDM Resmi Diraih</span>
                        <span className="text-[#1a6b3c]/40">|</span>
                        <span>🔬 Kurikulum Terpadu STEM &amp; Tahfidz 30 Juz</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center text-xs text-zinc-500 font-medium">
                  Bilah "INFO TERKINI" sedang dinonaktifkan di konfigurasi.
                </div>
              )}
              <p className="text-[11px] text-zinc-500">
                Durasi aktif: <strong>{settings.tickerDuration}s</strong> per putaran • Arah: <strong>{settings.tickerDirection === 'right' ? 'Kiri ke Kanan' : 'Kanan ke Kiri'}</strong>.
              </p>
            </div>
          )}

          {/* Preview 2: Live Card Image Slider */}
          {(activeTab === 'all' || activeTab === 'slider') && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#115E59]" />
                  <span>Pratinjau Live Card Slider</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  3 Foto Uji Coba
                </span>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-2.5">
                <CardImageSlider
                  images={SAMPLE_PREVIEW_IMAGES}
                  aspectRatio="aspect-[16/10]"
                  alt="Simulasi Kartu Dokumentasi Pondok"
                />
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#115E59]">
                  <CheckCircle2 size={14} />
                  <span>Parameter Aktif di Web Publik:</span>
                </div>
                <p className="text-[11px] text-zinc-600">
                  Autoplay: <strong>{settings.isAutoplayEnabled ? `${settings.autoplayInterval}s` : 'Nonaktif'}</strong> • Transisi: <strong>{settings.transitionSpeed}ms ({settings.transitionEffect})</strong>.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
