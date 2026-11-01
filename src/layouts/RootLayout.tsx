import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { BottomNav } from '../components/common/BottomNav';
import { MobileDrawer } from '../components/common/MobileDrawer';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { Edit3, Sparkles } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Resolve current public page to corresponding visual editor page ID
  const resolveEditorPage = (path: string): { id: string; label: string } => {
    if (path.startsWith('/jm-center')) return { id: 'jm-center', label: 'JM Center' };
    if (path.startsWith('/program')) return { id: 'program', label: 'Program Unggulan' };
    if (path.startsWith('/spmb')) return { id: 'spmb', label: 'SPMB Santri' };
    if (path.startsWith('/ekstrakurikuler') || path.startsWith('/ekskul')) return { id: 'ekskul', label: 'Ekstrakurikuler' };
    if (path.startsWith('/prestasi')) return { id: 'prestasi', label: 'Prestasi' };
    if (path.startsWith('/smart-jm') || path.startsWith('/stem')) return { id: 'smart-jm', label: 'Smart JM' };
    if (path.startsWith('/agenda')) return { id: 'agenda', label: 'Agenda' };
    if (path.startsWith('/berita')) return { id: 'berita', label: 'Warta Berita' };
    if (path.startsWith('/galeri')) return { id: 'galeri', label: 'Galeri' };
    if (path.startsWith('/osis')) return { id: 'osis', label: 'OSIS' };
    return { id: 'home', label: 'Beranda' };
  };

  const isAuthorizedAdmin = isAuthenticated && (role === 'super_admin' || role === 'pengurus_konten');
  const currentPageInfo = resolveEditorPage(location.pathname);

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col bg-surface text-onyx selection:bg-emerald-800 selection:text-white">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-3">
        <Outlet />
      </main>

      {/* Floating Universal Admin Visual Editor Shortcut for All Public Pages */}
      {isAuthorizedAdmin && (
        <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Link
            to={`/admin/editor?page=${currentPageInfo.id}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0A2116]/95 border border-[#C8A951] text-[#C8A951] text-xs font-black shadow-2xl hover:bg-[#0E7A4C] hover:text-white transition-all transform hover:scale-105 active:scale-95 group backdrop-blur-md"
            title={`Buka Halaman ${currentPageInfo.label} di WebVisualEditor`}
          >
            <Edit3 className="w-4 h-4 text-[#C8A951] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Visual Editor:</span>
            <span className="text-white font-extrabold">{currentPageInfo.label}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </Link>
        </div>
      )}

      <Footer />
      <BottomNav />
    </div>
  );
};
