import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

// Lightweight Skeleton & Suspense Fallback Loader
const SkeletonLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 px-4" aria-label="Memuat konten">
    <div className="w-10 h-10 border-3 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
    <div className="mt-4 flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-emerald-800/80 tracking-wider uppercase animate-pulse">
        Memuat...
      </span>
      <div className="w-32 h-2 bg-emerald-100/60 rounded-full overflow-hidden">
        <div className="w-full h-full bg-emerald-600/40 rounded-full animate-pulse" />
      </div>
    </div>
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
          <Route path="program-unggulan" element={<Navigate to="/program-unggulan/program-sekolah" replace />} />
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
