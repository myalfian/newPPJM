import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

import { Sparkles } from 'lucide-react';

/**
 * Holographic AI-Tech x Airgram Suspense Fallback Loader
 * Fusion of:
 * 1. Airgram (Dribbble shot 16189380):
 *    - Organic harmonic wave petals with breathing fluid scale
 *    - Waveform audio-tech pulse bars
 *    - Floating satellite constellation particles
 * 2. AI Technology Product (Dribbble shot 5831856):
 *    - 3D gyroscopic dual-axis orbital rotation rings
 *    - Pulsing neural core with Google Gemini chromatic beam flare
 *    - Laser scan shimmer progress bar & real-time telemetry badge
 */
const SkeletonLoader: React.FC = () => (
  <div
    className="min-h-[60vh] xs:min-h-[70vh] w-full flex flex-col items-center justify-center py-12 px-4 select-none relative overflow-hidden"
    aria-label="Memuat portal santri"
  >
    {/* 1. Ambient Background Glow Aura (Dual Tones: Emerald & Celestial Gold) */}
    <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-[#d4af37]/15 blur-3xl pointer-events-none -z-10 animate-pulse" />

    {/* 2. Central Holographic Orbital Gyroscope & Wave Petals System */}
    <div className="relative w-40 h-40 xs:w-44 xs:h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
      
      {/* Dynamic Neural Expanding Wave Rings (AI Energy Pulse) */}
      <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-neural-ring pointer-events-none" />
      <div className="absolute inset-0 rounded-full border border-[#d4af37]/25 animate-neural-ring [animation-delay:1.2s] pointer-events-none" />

      {/* Outer 3D Gyroscopic Orbital Ring (AI Tech Ring 1) */}
      <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40 animate-ai-gyro-1 pointer-events-none">
        {/* Orbital Satellite Node Dot */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] border border-white" />
      </div>

      {/* Secondary Counter-Rotating Gyroscopic Ring (AI Tech Ring 2) */}
      <div className="absolute inset-2 rounded-full border border-emerald-400/30 border-t-[#d4af37] border-b-teal-400 animate-ai-gyro-2 pointer-events-none">
        {/* Counter Satellite Node Dot */}
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37] border border-white" />
      </div>

      {/* 2D Flat Radial Orbit with 4-Point Airgram Petals */}
      <div className="absolute inset-4 rounded-full border border-slate-200/60 dark:border-slate-700/60 animate-ai-orbit-cw pointer-events-none">
        {/* Airgram North Petal Node */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md animate-airgram-petal border border-white" />
        {/* Airgram South Petal Node */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-md animate-airgram-petal [animation-delay:0.55s] border border-white" />
        {/* Airgram East Petal Node */}
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-500 shadow-md animate-airgram-petal [animation-delay:1.1s] border border-white" />
        {/* Airgram West Petal Node */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-[#d4af37] shadow-md animate-airgram-petal [animation-delay:1.65s] border border-white" />
      </div>

      {/* Center Neural Core (Glassmorphic Luminous Orb) */}
      <div className="relative z-10 w-18 h-18 xs:w-20 xs:h-20 rounded-3xl p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_10px_30px_rgba(15,81,50,0.18)] flex items-center justify-center group overflow-hidden">
        {/* Conic Beam Sweep Flare */}
        <div className="gemini-ambient-aura rounded-3xl">
          <div className="gemini-beam-sweep" />
        </div>
        <div className="gemini-border-glow-frame rounded-3xl">
          <div className="gemini-beam-sweep" />
        </div>

        {/* Inner Emblem Badge */}
        <div className="relative z-10 w-full h-full rounded-[20px] bg-gradient-to-br from-emerald-700 via-[#0d4a28] to-emerald-950 flex flex-col items-center justify-center text-white shadow-inner">
          <Sparkles className="w-6 h-6 xs:w-7 xs:h-7 text-[#d4af37] animate-pulse drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
          <span className="text-[9px] font-black tracking-widest text-emerald-200/90 mt-0.5">PPJM</span>
        </div>
      </div>

    </div>

    {/* 3. Airgram Audio-Tech Equalizer Waveform Indicator */}
    <div className="flex items-center gap-1.5 h-6 mb-4" aria-hidden="true">
      <span className="w-1 bg-emerald-600 rounded-full animate-[airgram-bar-bounce_1.2s_ease-in-out_infinite]" />
      <span className="w-1 bg-[#d4af37] rounded-full animate-[airgram-bar-bounce_1.2s_ease-in-out_0.2s_infinite]" />
      <span className="w-1 bg-teal-500 rounded-full animate-[airgram-bar-bounce_1.2s_ease-in-out_0.4s_infinite]" />
      <span className="w-1 bg-emerald-700 rounded-full animate-[airgram-bar-bounce_1.2s_ease-in-out_0.6s_infinite]" />
      <span className="w-1 bg-[#d4af37] rounded-full animate-[airgram-bar-bounce_1.2s_ease-in-out_0.8s_infinite]" />
    </div>

    {/* 4. AI Telemetry Status Badge */}
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs mb-2.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
      </span>
      <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0d4a28] dark:text-emerald-300 tracking-wider uppercase">
        SISTEM TERPADU SANTRI • AI ENGINE
      </span>
    </div>

    {/* 5. Typography Status Header */}
    <h3 className="text-sm xs:text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight mb-2 text-center">
      Memuat Portal Jauharul Maknuun
    </h3>

    {/* 6. High-Tech Shimmer Laser Progress Track */}
    <div className="w-48 xs:w-56 sm:w-64 h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner mb-2">
      <div className="w-full h-full bg-gradient-to-r from-emerald-600 via-[#d4af37] to-teal-500 rounded-full relative overflow-hidden">
        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-75 animate-laser-shimmer" />
      </div>
    </div>

    {/* 7. Subtitle Info */}
    <p className="text-[11px] xs:text-xs text-slate-400 dark:text-slate-500 font-medium tracking-tight text-center max-w-xs">
      Menginisialisasi modul kurikulum, tahfidz & teknologi santri...
    </p>

  </div>
);

// Admin Layout (Lazy loaded to isolate heavy CMS bundle from public visitors)
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));

// Public Pages (Route-level code splitting with React.lazy)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Sambutan = lazy(() => import('./pages/jm-center/Sambutan').then(m => ({ default: m.Sambutan })));
const Sejarah = lazy(() => import('./pages/jm-center/Sejarah').then(m => ({ default: m.Sejarah })));
const VisiMisi = lazy(() => import('./pages/jm-center/VisiMisi').then(m => ({ default: m.VisiMisi })));
const Lembaga = lazy(() => import('./pages/jm-center/Lembaga').then(m => ({ default: m.Lembaga })));
const AmaliyahPondok = lazy(() => import('./pages/program-unggulan/AmaliyahPondok').then(m => ({ default: m.AmaliyahPondok })));
const ProgramSekolah = lazy(() => import('./pages/program-unggulan/ProgramSekolah').then(m => ({ default: m.ProgramSekolah })));
const ProgramMadin = lazy(() => import('./pages/program-unggulan/ProgramMadin').then(m => ({ default: m.ProgramMadin })));
const QuranReadPage = lazy(() => import('./pages/smart-jm/hafidz/QuranReadPage').then(m => ({ default: m.QuranReadPage })));
const MurojaahPage = lazy(() => import('./pages/smart-jm/hafidz/MurojaahPage').then(m => ({ default: m.MurojaahPage })));
const StemMateri = lazy(() => import('./pages/smart-jm/stem/StemMateri').then(m => ({ default: m.StemMateri })));
const StemPortofolio = lazy(() => import('./pages/smart-jm/stem/StemPortofolio').then(m => ({ default: m.StemPortofolio })));
const MandarinMateri = lazy(() => import('./pages/smart-jm/mandarin/MandarinMateri').then(m => ({ default: m.MandarinMateri })));
const MandarinQuizPage = lazy(() => import('./pages/smart-jm/mandarin/MandarinQuizPage').then(m => ({ default: m.MandarinQuizPage })));
const Prestasi = lazy(() => import('./pages/Prestasi').then(m => ({ default: m.Prestasi })));
const Ekskul = lazy(() => import('./pages/Ekskul').then(m => ({ default: m.Ekskul })));
const GaleriFoto = lazy(() => import('./pages/galeri/GaleriFoto').then(m => ({ default: m.GaleriFoto })));
const GaleriVideo = lazy(() => import('./pages/galeri/GaleriVideo').then(m => ({ default: m.GaleriVideo })));

// Admin CMS Pages (Route-level code splitting with React.lazy)
const Login = lazy(() => import('./pages/admin/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const KelolaBerita = lazy(() => import('./pages/admin/KelolaBerita').then(m => ({ default: m.KelolaBerita })));
const KelolaStem = lazy(() => import('./pages/admin/KelolaStem').then(m => ({ default: m.KelolaStem })));
const KelolaMandarin = lazy(() => import('./pages/admin/KelolaMandarin').then(m => ({ default: m.KelolaMandarin })));
const KelolaGaleri = lazy(() => import('./pages/admin/KelolaGaleri').then(m => ({ default: m.KelolaGaleri })));
const KelolaSlider = lazy(() => import('./pages/admin/KelolaSlider').then(m => ({ default: m.KelolaSlider })));

export const App: React.FC = () => {
  const navigate = useNavigate();

  // Dukung akses via hash URL (misal #admin atau #/admin)
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.hash.startsWith('#/admin')) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        {/* 1. Public Pages with Root Layout */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />

          {/* JM Center Hub */}
          <Route path="jm-center" element={<Navigate to="/jm-center/sambutan" replace />} />
          <Route path="jm-center/sambutan" element={<Sambutan />} />
          <Route path="jm-center/sejarah" element={<Sejarah />} />
          <Route path="jm-center/visi-misi" element={<VisiMisi />} />
          <Route path="jm-center/lembaga" element={<Lembaga />} />

          {/* Program Unggulan */}
          <Route path="program-unggulan" element={<Navigate to="/program-unggulan/amaliyah-pondok" replace />} />
          <Route path="program-unggulan/amaliyah-pondok" element={<AmaliyahPondok />} />
          <Route path="program-unggulan/program-sekolah" element={<ProgramSekolah />} />
          <Route path="program-unggulan/program-madin" element={<ProgramMadin />} />

          {/* Smart JM & STEM Modules */}
          <Route path="stem" element={<Navigate to="/smart-jm/stem/materi" replace />} />
          <Route path="smart-jm" element={<Navigate to="/smart-jm/stem/materi" replace />} />
          <Route path="smart-jm/hafidz/read" element={<QuranReadPage />} />
          <Route path="smart-jm/hafidz/murojaah" element={<MurojaahPage />} />
          <Route path="smart-jm/stem/materi" element={<StemMateri />} />
          <Route path="smart-jm/stem/portofolio" element={<StemPortofolio />} />
          <Route path="smart-jm/mandarin/materi" element={<MandarinMateri />} />
          <Route path="smart-jm/mandarin/quiz" element={<MandarinQuizPage />} />

          {/* Prestasi & Ekskul */}
          <Route path="prestasi" element={<Prestasi />} />
          <Route path="ekskul" element={<Ekskul />} />

          {/* Galeri Sekolah */}
          <Route path="galeri" element={<Navigate to="/galeri/foto" replace />} />
          <Route path="galeri/foto" element={<GaleriFoto />} />
          <Route path="galeri/video" element={<GaleriVideo />} />
        </Route>

        {/* 2. Admin Login Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* 3. Admin CMS Zero-IT-Skill Portal */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="berita" element={<KelolaBerita />} />
          <Route path="stem" element={<KelolaStem />} />
          <Route path="mandarin" element={<KelolaMandarin />} />
          <Route path="galeri" element={<KelolaGaleri />} />
          <Route path="slider" element={<KelolaSlider />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Route>

        {/* 4. 404 Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
