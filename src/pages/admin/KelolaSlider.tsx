import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gauge, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Sliders, 
  Eye, 
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { 
  SliderSettings, 
  getSliderSettings, 
  saveSliderSettings, 
  DEFAULT_SLIDER_SETTINGS 
} from '../../lib/sliderSettings';
import { initialHeroSlides } from '../../data/heroSlides';

export const KelolaSlider: React.FC = () => {
  const [settings, setSettings] = useState<SliderSettings>(getSliderSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewActiveIndex, setPreviewActiveIndex] = useState(0);

  // Live preview autoplay simulator
  useEffect(() => {
    if (!settings.isAutoplayEnabled) return;
    const intervalMs = Math.max(settings.autoplayInterval * 1000, 1500);
    const timer = setInterval(() => {
      setPreviewActiveIndex(prev => (prev + 1) % initialHeroSlides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [settings.autoplayInterval, settings.isAutoplayEnabled]);

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

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-m3-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Gauge className="w-3.5 h-3.5" />
            <span>Pengaturan Kecepatan Beranda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kelola Speed Hero Slider
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90">
            Sesuaikan seberapa cepat slide banner berputar secara otomatis dan kehalusan animasi transisinya.
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

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        
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
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Simulasi Pratinjau Kecepatan Saat Ini:</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#071526] text-white flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              <img 
                src={initialHeroSlides[previewActiveIndex].image} 
                alt="Preview" 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono">
                Slide {previewActiveIndex + 1}/{initialHeroSlides.length}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
                {initialHeroSlides[previewActiveIndex].badge}
              </div>
              <h5 className="font-extrabold text-sm sm:text-base text-white">
                {initialHeroSlides[previewActiveIndex].title}
              </h5>
              <p className="text-xs text-slate-300 line-clamp-2">
                {initialHeroSlides[previewActiveIndex].desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kembalikan ke Standar (5.5s)</span>
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
              <span>Simpan Pengaturan Slider</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
