import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Sambutan } from './pages/jm-center/Sambutan';
import { Sejarah } from './pages/jm-center/Sejarah';
import { VisiMisi } from './pages/jm-center/VisiMisi';
import { Lembaga } from './pages/jm-center/Lembaga';
import { AmaliyahPondok } from './pages/program-unggulan/AmaliyahPondok';
import { ProgramSekolah } from './pages/program-unggulan/ProgramSekolah';
import { ProgramMadin } from './pages/program-unggulan/ProgramMadin';
import { QuranReadPage } from './pages/smart-jm/hafidz/QuranReadPage';
import { MurojaahPage } from './pages/smart-jm/hafidz/MurojaahPage';
import { StemMateri } from './pages/smart-jm/stem/StemMateri';
import { StemPortofolio } from './pages/smart-jm/stem/StemPortofolio';
import { MandarinMateri } from './pages/smart-jm/mandarin/MandarinMateri';
import { MandarinQuizPage } from './pages/smart-jm/mandarin/MandarinQuizPage';
import { Prestasi } from './pages/Prestasi';
import { Ekskul } from './pages/Ekskul';
import { GaleriFoto } from './pages/galeri/GaleriFoto';
import { GaleriVideo } from './pages/galeri/GaleriVideo';

// Admin CMS Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { KelolaBerita } from './pages/admin/KelolaBerita';
import { KelolaStem } from './pages/admin/KelolaStem';
import { KelolaMandarin } from './pages/admin/KelolaMandarin';
import { KelolaGaleri } from './pages/admin/KelolaGaleri';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with Root Layout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />

        {/* JM Center Hub */}
        <Route path="jm-center/sambutan" element={<Sambutan />} />
        <Route path="jm-center/sejarah" element={<Sejarah />} />
        <Route path="jm-center/visi-misi" element={<VisiMisi />} />
        <Route path="jm-center/lembaga" element={<Lembaga />} />

        {/* Program Unggulan */}
        <Route path="program-unggulan/amaliyah-pondok" element={<AmaliyahPondok />} />
        <Route path="program-unggulan/program-sekolah" element={<ProgramSekolah />} />
        <Route path="program-unggulan/program-madin" element={<ProgramMadin />} />

        {/* Smart JM Modules */}
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
        <Route path="galeri/foto" element={<GaleriFoto />} />
        <Route path="galeri/video" element={<GaleriVideo />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin CMS Zero-IT-Skill Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="berita" element={<KelolaBerita />} />
        <Route path="stem" element={<KelolaStem />} />
        <Route path="mandarin" element={<KelolaMandarin />} />
        <Route path="galeri" element={<KelolaGaleri />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
