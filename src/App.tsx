import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AuthProvider } from './context/AuthContext';
import { RoleGuard } from './components/auth/RoleGuard';

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
    className="min-h-[65vh] xs:min-h-[75vh] w-full flex flex-col items-center justify-center py-12 px-4 select-none relative overflow-hidden"
    aria-label="Memuat portal santri"
  >
    {/* 1. Ambient Background Glow Aura (Dual Tones: Emerald & Celestial Gold) */}
    <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-[#d4af37]/15 blur-3xl pointer-events-none -z-10 animate-pulse" />

    {/* 2. Central Fusion Container: Airgram 4-Blade Morphing Pinwheel + AI Tech Gyroscope */}
    <div className="relative w-44 h-44 xs:w-48 xs:h-48 sm:w-52 sm:h-52 flex items-center justify-center mb-6">
      
      {/* AI Tech Layer 1: Concentric Expanding Sonar Energy Waves (afroman style) */}
      <div className="absolute inset-4 rounded-full border border-emerald-500/35 animate-neural-ring pointer-events-none" />
      <div className="absolute inset-1 rounded-full border border-[#d4af37]/25 animate-neural-ring [animation-delay:1.3s] pointer-events-none" />

      {/* AI Tech Layer 2: 3D Outer Gyroscopic Orbital Ring with Laser Satellite Bead */}
      <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40 animate-ai-gyro-1 pointer-events-none">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_14px_#10b981] border-2 border-white" />
      </div>

      {/* AI Tech Layer 3: Secondary Counter-Rotating Tilted Ring */}
      <div className="absolute inset-2.5 rounded-full border-2 border-transparent border-t-[#d4af37] border-b-teal-400 animate-ai-gyro-2 pointer-events-none">
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#d4af37] shadow-[0_0_12px_#d4af37] border-2 border-white" />
      </div>

      {/* Airgram Core Layer: Iconic 4-Blade Morphing Pinwheel (Mind Cruiser / Croissanttuna signature) */}
      <div className="relative w-28 h-28 xs:w-32 xs:h-32 flex items-center justify-center animate-airgram-pinwheel">
        
        {/* Blade 1 (North): Emerald to Teal Capsule */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 origin-bottom animate-[airgram-blade-n_2.2s_ease-in-out_infinite]">
          <div className="w-4 h-9 xs:w-4.5 xs:h-10 rounded-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 shadow-md border border-white/60" />
        </div>

        {/* Blade 2 (East): Celestial Gold to Amber Capsule */}
        <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 origin-left animate-[airgram-blade-e_2.2s_ease-in-out_0.55s_infinite]">
          <div className="h-4 w-9 xs:h-4.5 xs:w-10 rounded-full bg-gradient-to-r from-amber-600 via-[#d4af37] to-yellow-300 shadow-md border border-white/60" />
        </div>

        {/* Blade 3 (South): Teal to Deep Forest Emerald Capsule */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 origin-top animate-[airgram-blade-s_2.2s_ease-in-out_1.1s_infinite]">
          <div className="w-4 h-9 xs:w-4.5 xs:h-10 rounded-full bg-gradient-to-b from-emerald-600 via-teal-600 to-emerald-800 shadow-md border border-white/60" />
        </div>

        {/* Blade 4 (West): Cyan to Emerald Capsule */}
        <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 origin-right animate-[airgram-blade-w_2.2s_ease-in-out_1.65s_infinite]">
          <div className="h-4 w-9 xs:h-4.5 xs:w-10 rounded-full bg-gradient-to-l from-teal-500 via-cyan-400 to-emerald-400 shadow-md border border-white/60" />
        </div>

        {/* Floating Satellite Constellation Droplets (Orbiting the Pinwheel) */}
        <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-ping" />
        <div className="absolute -bottom-1 left-2 w-2 h-2 rounded-full bg-[#d4af37] shadow-sm animate-ping [animation-delay:0.8s]" />

        {/* Center Neural Core (Glassmorphic Luminous Hub) */}
        <div className="relative z-20 w-12 h-12 xs:w-14 xs:h-14 rounded-2xl p-0.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/90 dark:border-slate-700/90 shadow-[0_4px_20px_rgba(15,81,50,0.25)] flex items-center justify-center">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-emerald-700 via-[#0d4a28] to-emerald-950 flex flex-col items-center justify-center text-white shadow-inner">
            <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-[#d4af37] animate-pulse drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
            <span className="text-[7.5px] font-black tracking-widest text-emerald-200 mt-0.5 leading-none">PPJM</span>
          </div>
        </div>

      </div>

    </div>

    {/* 3. Airgram Audio-Tech Equalizer Waveform Indicator */}
    <div className="flex items-center gap-1.5 h-7 mb-4" aria-hidden="true">
      <span className="w-1.5 bg-emerald-600 rounded-full animate-[airgram-bar-1_1.2s_ease-in-out_infinite]" />
      <span className="w-1.5 bg-[#d4af37] rounded-full animate-[airgram-bar-2_1.2s_ease-in-out_0.15s_infinite]" />
      <span className="w-1.5 bg-teal-500 rounded-full animate-[airgram-bar-3_1.2s_ease-in-out_0.3s_infinite]" />
      <span className="w-1.5 bg-emerald-700 rounded-full animate-[airgram-bar-4_1.2s_ease-in-out_0.45s_infinite]" />
      <span className="w-1.5 bg-[#d4af37] rounded-full animate-[airgram-bar-5_1.2s_ease-in-out_0.6s_infinite]" />
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
const Agenda = lazy(() => import('./pages/Agenda').then(m => ({ default: m.Agenda })));
const Osis = lazy(() => import('./pages/Osis').then(m => ({ default: m.Osis })));
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
const KelolaHafidz = lazy(() => import('./pages/admin/KelolaHafidz').then(m => ({ default: m.KelolaHafidz })));
const KelolaPrestasi = lazy(() => import('./pages/admin/KelolaPrestasi').then(m => ({ default: m.KelolaPrestasi })));
const KelolaEkskul = lazy(() => import('./pages/admin/KelolaEkskul').then(m => ({ default: m.KelolaEkskul })));
const KelolaProfil = lazy(() => import('./pages/admin/KelolaProfil').then(m => ({ default: m.KelolaProfil })));
const WebVisualEditor = lazy(() => import('./pages/admin/WebVisualEditor').then(m => ({ default: m.WebVisualEditor })));
const UserProfilePage = lazy(() => import('./pages/profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));

export const App: React.FC = () => {
  const navigate = useNavigate();

  // Dukung akses via hash URL (misal #admin atau #/admin)
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.hash.startsWith('#/admin')) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <AuthProvider>
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

            {/* Prestasi, Ekskul & Organisasi Santri (OSIS) */}
            <Route path="prestasi" element={<Prestasi />} />
            <Route path="ekskul" element={<Ekskul />} />
            <Route path="osis" element={<Osis />} />

            {/* Agenda Kegiatan Santri (Historical, Current, Future) */}
            <Route path="agenda" element={<Agenda />} />

            {/* Galeri Sekolah */}
            <Route path="galeri" element={<Navigate to="/galeri/foto" replace />} />
            <Route path="galeri/foto" element={<GaleriFoto />} />
            <Route path="galeri/video" element={<GaleriVideo />} />

            {/* Profile Akun Pengguna / Santri */}
            <Route path="profil" element={<UserProfilePage />} />
            <Route path="profile" element={<Navigate to="/profil" replace />} />
          </Route>

          {/* 2. Admin Login Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Dedicated In-Context Visual Web Editor (Full-screen Canvas) */}
          <Route
            path="/admin/editor"
            element={
              <RoleGuard allowedRoles={['super_admin', 'pengurus_konten', 'guru_akademik']}>
                <WebVisualEditor />
              </RoleGuard>
            }
          />
          <Route
            path="/editor"
            element={
              <RoleGuard allowedRoles={['super_admin', 'pengurus_konten', 'guru_akademik']}>
                <WebVisualEditor />
              </RoleGuard>
            }
          />

          {/* 3. Admin CMS Zero-IT-Skill Portal Protected by RoleGuard */}
          <Route
            path="/admin/*"
            element={
              <RoleGuard allowedRoles={['super_admin', 'pengurus_konten', 'guru_akademik']}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="editor" element={<WebVisualEditor />} />
            <Route path="berita" element={<KelolaBerita />} />
            <Route path="stem" element={<KelolaStem />} />
            <Route path="mandarin" element={<KelolaMandarin />} />
            <Route path="galeri" element={<KelolaGaleri />} />
            <Route path="slider" element={<KelolaSlider />} />
            <Route path="hafidz" element={<KelolaHafidz />} />
            <Route path="prestasi" element={<KelolaPrestasi />} />
            <Route path="ekskul" element={<KelolaEkskul />} />
            <Route path="profil" element={<KelolaProfil />} />
            <Route path="akun" element={<UserProfilePage />} />
            <Route path="profile" element={<Navigate to="/admin/akun" replace />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={['super_admin', 'pengurus_konten', 'guru_akademik']}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Route>

          {/* 4. 404 Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
