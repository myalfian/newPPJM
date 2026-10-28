import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Newspaper, Sprout, GraduationCap, Sparkles } from 'lucide-react';
import { MedsosModal } from './MedsosModal';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMedsosModal, setShowMedsosModal] = useState(false);

  // Listen for global custom event to open Medsos Modal from any component
  useEffect(() => {
    const handleOpenMedsos = () => setShowMedsosModal(true);
    window.addEventListener('open-medsos-modal', handleOpenMedsos);
    return () => window.removeEventListener('open-medsos-modal', handleOpenMedsos);
  }, []);

  // Dynamic responsive width for mathematical SVG path rendering
  const navRef = useRef<HTMLDivElement>(null);
  const [navWidth, setNavWidth] = useState(380);

  useEffect(() => {
    if (!navRef.current) return;
    const updateWidth = () => {
      if (navRef.current) {
        setNavWidth(navRef.current.offsetWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(navRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Determine active tab corresponding to the 5 positions
  let activeTab: 'home' | 'news' | 'center' | 'agenda' | 'program' = 'home';
  if (showMedsosModal) {
    activeTab = 'center';
  } else if (
    location.pathname.startsWith('/berita') ||
    location.pathname.startsWith('/galeri') ||
    location.pathname.startsWith('/prestasi') ||
    location.pathname.startsWith('/ekskul')
  ) {
    activeTab = 'news';
  } else if (location.pathname.startsWith('/agenda') || location.pathname.startsWith('/karya-siswa')) {
    activeTab = 'agenda';
  } else if (
    location.pathname.startsWith('/program-unggulan') ||
    location.pathname.startsWith('/jm-center')
  ) {
    activeTab = 'program';
  } else if (location.pathname === '/') {
    activeTab = 'home';
  }

  // Mathematical SVG path with center cradle scoop
  const H = 66;
  const R = 28;
  const notchW = 80;
  const notchD = 38;
  const cx = navWidth / 2;
  const nwHalf = notchW / 2;

  const svgPath = `M ${R} 0 L ${cx - nwHalf} 0 C ${cx - 24} 0, ${cx - 22} ${notchD}, ${cx} ${notchD} C ${cx + 22} ${notchD}, ${cx + 24} 0, ${cx + nwHalf} 0 L ${navWidth - R} 0 A ${R} ${R} 0 0 1 ${navWidth} ${R} L ${navWidth} ${H - R} A ${R} ${R} 0 0 1 ${navWidth - R} ${H} L ${R} ${H} A ${R} ${R} 0 0 1 0 ${H - R} L 0 ${R} A ${R} ${R} 0 0 1 ${R} 0 Z`;

  return (
    <>
      <div
        className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-2.5 sm:px-4 pointer-events-none md:hidden pb-safe"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav
          ref={navRef}
          aria-label="Navigasi Bawah Mobile"
          className="relative w-full max-w-md h-[66px] pointer-events-auto select-none"
        >
          {/* Continuous Curved SVG Bar Background with Center Scoop Notch */}
          <svg
            className="absolute inset-0 w-full h-full text-white dark:text-slate-900 pointer-events-none transition-colors duration-200"
            style={{
              filter:
                'drop-shadow(0 12px 28px rgba(15, 81, 50, 0.12)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.05))',
            }}
            width={navWidth}
            height={H}
            viewBox={`0 0 ${navWidth} ${H}`}
            fill="none"
          >
            <path d={svgPath} fill="currentColor" stroke="none" />
          </svg>

          {/* 5-Column Grid with Icons and Bold Menu Labels */}
          <div className="relative w-full h-full grid grid-cols-5 items-center z-10 px-1">
            {/* 1. Beranda / Home */}
            <button
              type="button"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
              className="flex flex-col items-center justify-center h-full relative cursor-pointer group py-1"
              aria-label="Beranda"
              title="Beranda"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                animate={{
                  scale: activeTab === 'home' ? 1.1 : 1,
                  y: activeTab === 'home' ? -1.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={`transition-colors duration-200 ${
                  activeTab === 'home'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              >
                <Home className="w-5 h-5 stroke-[2.3]" />
              </motion.div>
              <span
                className={`text-[11.5px] sm:text-[12px] tracking-tight mt-1 leading-none transition-colors duration-200 ${
                  activeTab === 'home'
                    ? 'font-black text-emerald-800 dark:text-emerald-300'
                    : 'font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                Beranda
              </span>
            </button>

            {/* 2. JM News */}
            <button
              type="button"
              onClick={() => navigate('/berita')}
              className="flex flex-col items-center justify-center h-full relative cursor-pointer group py-1"
              aria-label="JM News"
              title="JM News"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                animate={{
                  scale: activeTab === 'news' ? 1.1 : 1,
                  y: activeTab === 'news' ? -1.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={`transition-colors duration-200 ${
                  activeTab === 'news'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              >
                <Newspaper className="w-5 h-5 stroke-[2.3]" />
              </motion.div>
              <span
                className={`text-[11.5px] sm:text-[12px] tracking-tight mt-1 leading-none transition-colors duration-200 ${
                  activeTab === 'news'
                    ? 'font-black text-emerald-800 dark:text-emerald-300'
                    : 'font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                JM News
              </span>
            </button>

            {/* 3. Center Elevated FAB with Google Loading Animation on Border */}
            <div className="flex flex-col items-center justify-center h-full relative">
              <div className="relative flex items-center justify-center -mt-5.5">
                {/* Google 4-Color Animated Loading Border Spinner */}
                <svg
                  className="absolute pointer-events-none animate-spin"
                  style={{
                    width: '60px',
                    height: '60px',
                    animationDuration: '2.8s',
                    animationTimingFunction: 'linear',
                  }}
                  viewBox="0 0 60 60"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Google Blue Segment */}
                  <circle
                    cx="30"
                    cy="30"
                    r="27"
                    stroke="#4285F4"
                    strokeWidth="2.8"
                    strokeDasharray="37 133"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Google Red Segment */}
                  <circle
                    cx="30"
                    cy="30"
                    r="27"
                    stroke="#EA4335"
                    strokeWidth="2.8"
                    strokeDasharray="37 133"
                    strokeDashoffset="-42.5"
                    strokeLinecap="round"
                  />
                  {/* Google Yellow Segment */}
                  <circle
                    cx="30"
                    cy="30"
                    r="27"
                    stroke="#FBBC05"
                    strokeWidth="2.8"
                    strokeDasharray="37 133"
                    strokeDashoffset="-85"
                    strokeLinecap="round"
                  />
                  {/* Google Green Segment */}
                  <circle
                    cx="30"
                    cy="30"
                    r="27"
                    stroke="#34A853"
                    strokeWidth="2.8"
                    strokeDasharray="37 133"
                    strokeDashoffset="-127.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Central Action Circle Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowMedsosModal(true)}
                  className="relative z-10 w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-[#0a6847] via-[#0f5132] to-[#10b981] shadow-[0_8px_20px_-2px_rgba(15,81,50,0.45)] dark:shadow-[0_8px_24px_-2px_rgba(16,185,129,0.4)] flex items-center justify-center text-white cursor-pointer ring-3 ring-white dark:ring-slate-900 transition-transform duration-200"
                  aria-label="Media Resmi Pesantren & Kontak"
                  title="Media Resmi PPJM"
                >
                  <Sprout className="w-6 h-6 stroke-[2.3] text-white" />
                </motion.button>
              </div>

              {/* Center Menu Name */}
              <span
                className={`text-[11px] sm:text-[11.5px] tracking-tight mt-1 leading-none transition-colors duration-200 ${
                  activeTab === 'center'
                    ? 'font-black text-emerald-800 dark:text-emerald-300'
                    : 'font-extrabold text-emerald-800 dark:text-emerald-400'
                }`}
              >
                Medsos
              </span>
            </div>

            {/* 4. Karya Siswa & Portofolio Santri */}
            <button
              type="button"
              onClick={() => navigate('/karya-siswa')}
              className="flex flex-col items-center justify-center h-full relative cursor-pointer group py-1"
              aria-label="Karya Siswa"
              title="Karya & Portofolio Siswa"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                animate={{
                  scale: activeTab === 'agenda' ? 1.1 : 1,
                  y: activeTab === 'agenda' ? -1.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={`transition-colors duration-200 ${
                  activeTab === 'agenda'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-5 h-5 stroke-[2.3]" />
              </motion.div>
              <span
                className={`text-[11px] sm:text-[11.5px] tracking-tight mt-1 leading-none transition-colors duration-200 ${
                  activeTab === 'agenda'
                    ? 'font-black text-emerald-800 dark:text-emerald-300'
                    : 'font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                Karya Siswa
              </span>
            </button>

            {/* 5. Program & PPDB */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('kontak-ppdb');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/program-unggulan/program-sekolah');
                }
              }}
              className="flex flex-col items-center justify-center h-full relative cursor-pointer group py-1"
              aria-label="PPDB"
              title="PPDB"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                animate={{
                  scale: activeTab === 'program' ? 1.1 : 1,
                  y: activeTab === 'program' ? -1.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={`transition-colors duration-200 ${
                  activeTab === 'program'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              >
                <GraduationCap className="w-5 h-5 stroke-[2.3]" />
              </motion.div>
              <span
                className={`text-[11.5px] sm:text-[12px] tracking-tight mt-1 leading-none transition-colors duration-200 ${
                  activeTab === 'program'
                    ? 'font-black text-emerald-800 dark:text-emerald-300'
                    : 'font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                PPDB
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Official Media & Social Popup Modal */}
      <MedsosModal
        isOpen={showMedsosModal}
        onClose={() => setShowMedsosModal(false)}
      />
    </>
  );
};
