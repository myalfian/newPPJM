import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Eye,
  ArrowRightLeft,
  MousePointer,
  HelpCircle,
  Compass,
} from 'lucide-react';
import type { AdminOutletContext } from './AdminLayout';
import {
  SliderSettings,
  DEFAULT_SLIDER_SETTINGS,
  getSliderSettings,
  fetchSliderSettingsFromSupabase,
  saveSliderSettings,
  TickerDirection,
} from '../lib/sliderSettings';

export const TickerSettingsPage: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const isSuperAdmin = admin.profile?.role === 'super_admin';
  const canEditTicker = isSuperAdmin || admin.can('info_terkini', 'edit');

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
    if (!canEditTicker) {
      showToast('error', 'Anda tidak memiliki hak akses untuk mengubah pengaturan Info Terkini.');
      return;
    }

    setSaving(true);
    const res = await saveSliderSettings(settings);
    setSaving(false);

    if (res.ok) {
      showToast('success', 'Pengaturan kecepatan Info Terkini berhasil disimpan & langsung aktif di website!');
    } else {
      showToast('error', res.error || 'Gagal menyimpan pengaturan ke database.');
    }
  };

  const handleApplyPreset = (duration: number) => {
    setSettings((s) => ({ ...s, tickerDuration: duration }));
  };

  const handleReset = () => {
    setSettings((s) => ({
      ...s,
      tickerDuration: 75,
      isTickerEnabled: true,
      tickerPauseOnHover: true,
      tickerDirection: 'left',
    }));
    showToast('success', 'Form dikembalikan ke setelan santai standar (75 detik). Silakan simpan.');
  };

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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Pusat Kendali Header Website</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-teal-950 tracking-tight mt-1">
            Pengaturan Kecepatan &amp; Teks Berjalan "INFO TERKINI"
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Atur kelambatan gulir agar teks mudah dibaca, jeda saat mouse melayang, dan status penayangan di bilah atas header.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/s/info_terkini"
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-900/15 bg-white px-3 py-2 text-xs font-bold text-teal-950 hover:bg-teal-50/70 transition shadow-2xs"
          >
            <span>Kelola Isi Berita</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Settings */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#115E59]" />
                <span>Kecepatan Gulir (Durasi Putaran)</span>
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                {settings.tickerDuration} Detik / Putaran
              </span>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">
                Pilihan Kecepatan Cepat (Presets):
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
                      onClick={() => handleApplyPreset(preset.dur)}
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

            {/* Slider Durasi */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#115E59]" />
                  <span>Atur Durasi Presisi (Semakin Besar = Semakin Lambat):</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#115E59] font-black border border-emerald-200">
                  {settings.tickerDuration}s
                </span>
              </div>
              <input
                id="custom-ticker-duration"
                type="range"
                min="15"
                max="180"
                step="5"
                value={settings.tickerDuration}
                onChange={(e) => setSettings((s) => ({ ...s, tickerDuration: parseInt(e.target.value, 10) || 75 }))}
                className="w-full accent-[#115E59] cursor-pointer h-2 bg-zinc-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                <span>Cepat (15s)</span>
                <span>Standar (50s)</span>
                <span className="text-[#115E59] font-bold">Rekomendasi (75s)</span>
                <span>Sangat Lambat (180s)</span>
              </div>
            </div>

            {/* Opsi Arah Gulir & Jeda Hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div className="space-y-1.5">
                <label htmlFor="select-ticker-direction" className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Arah Gerak Teks</span>
                </label>
                <select
                  id="select-ticker-direction"
                  value={settings.tickerDirection}
                  onChange={(e) => setSettings((s) => ({ ...s, tickerDirection: e.target.value as TickerDirection }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-800 focus:border-[#115E59] focus:outline-none focus:ring-2 focus:ring-[#115E59]/20 cursor-pointer"
                >
                  <option value="left">Kanan ke Kiri (Marquee Alami - Standar)</option>
                  <option value="right">Kiri ke Kanan (Terbalik)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/60">
                <div>
                  <label htmlFor="checkbox-ticker-pause" className="text-xs font-bold text-zinc-800 block cursor-pointer flex items-center gap-1.5">
                    <MousePointer className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Jeda Saat Hover</span>
                  </label>
                  <p className="text-[10px] text-zinc-500">Berhenti saat kursor diletakkan di atas teks</p>
                </div>
                <input
                  id="checkbox-ticker-pause"
                  type="checkbox"
                  checked={settings.tickerPauseOnHover}
                  onChange={(e) => setSettings((s) => ({ ...s, tickerPauseOnHover: e.target.checked }))}
                  className="w-4 h-4 accent-[#115E59] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Toggle Tampilkan di Header */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <label htmlFor="checkbox-ticker-enable" className="text-xs font-bold text-zinc-800 block cursor-pointer">
                  Tampilkan Bilah "INFO TERKINI" di Header
                </label>
                <p className="text-[11px] text-zinc-500">
                  Jika dimatikan, pita berita berjalan di atas menu navigasi disembunyikan seluruhnya.
                </p>
              </div>
              <input
                id="checkbox-ticker-enable"
                type="checkbox"
                checked={settings.isTickerEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, isTickerEnabled: e.target.checked }))}
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
              <span>Kembalikan Default (75s)</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[44px] items-center gap-2 px-6 py-2 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-xs font-bold text-white shadow-sm transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Info Terkini'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Interactive Live Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Simulasi Kecepatan Nyata (Live)</span>
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                settings.isTickerEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
              }`}>
                {settings.isTickerEnabled ? 'Status: Aktif' : 'Status: Nonaktif'}
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Kotak di bawah mensimulasikan kecepatan pergerakan teks di header web publik dengan durasi <strong>{settings.tickerDuration} detik</strong>:
            </p>

            {settings.isTickerEnabled ? (
              <div className="rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/15 p-2 overflow-hidden shadow-2xs">
                <div className="flex items-center gap-2 overflow-hidden select-none">
                  <div className="bg-[#1a6b3c] text-white font-black px-2 py-0.5 rounded text-[10px] shrink-0 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-[#d4af37] animate-pulse" />
                    <span>INFO TERKINI</span>
                  </div>
                  <div className="overflow-hidden whitespace-nowrap w-full group">
                    <div
                      className={`animate-ticker text-[#0d4a28] font-medium text-xs inline-flex items-center space-x-5 ${
                        settings.tickerPauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
                      }`}
                      style={{
                        animationDuration: `${settings.tickerDuration || 75}s`,
                        animationDirection: settings.tickerDirection === 'right' ? 'reverse' : 'normal',
                      }}
                    >
                      <span>✨ SPMB TP 2026/2027 Telah Dibuka Resmi</span>
                      <span className="text-[#1a6b3c]/40">|</span>
                      <span>🏆 Akreditasi "A" BAN-PDM Resmi Diraih SMP Plus JM</span>
                      <span className="text-[#1a6b3c]/40">|</span>
                      <span>📖 Program Tahfidz 30 Juz Bersanad &amp; Diniyah Salaf</span>
                      <span className="text-[#1a6b3c]/40">|</span>
                      <span>🔬 Kurikulum Terpadu STEM &amp; Robotika Santri</span>
                      <span className="text-[#1a6b3c]/40">|</span>
                      {/* Loop items */}
                      <span>✨ SPMB TP 2026/2027 Telah Dibuka Resmi</span>
                      <span className="text-[#1a6b3c]/40">|</span>
                      <span>🏆 Akreditasi "A" BAN-PDM Resmi Diraih SMP Plus JM</span>
                      <span className="text-[#1a6b3c]/40">|</span>
                      <span>📖 Program Tahfidz 30 Juz Bersanad &amp; Diniyah Salaf</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center text-xs text-zinc-500 font-medium">
                Bilah "INFO TERKINI" sedang dinonaktifkan di konfigurasi.
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/70 text-[11px] text-teal-950 space-y-1.5">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#115E59]" />
                Sinkronisasi Otomatis Seluruh Pengunjung:
              </p>
              <p className="leading-relaxed text-teal-900">
                Setelah Anda menekan tombol "Simpan Pengaturan Info Terkini", seluruh halaman web publik akan langsung menyerap kecepatan <strong>{settings.tickerDuration}s</strong> secara real-time tanpa perlu reload browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

