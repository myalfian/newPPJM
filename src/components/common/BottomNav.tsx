import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Newspaper, Share2, Laptop, GraduationCap } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMedsosModal, setShowMedsosModal] = useState(false);

  const isHome = location.pathname === '/';
  const isNews = location.pathname.startsWith('/galeri');
  const isElearning = location.pathname.startsWith('/smart-jm');

  const handleShareWebsite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik',
        text: 'Portal Resmi Pondok Pesantren Jauharul Maknuun: Tahfidz 30 Juz Bersanad, Kurikulum Terakreditasi "A" BAN-PDM, dan Inovasi STEM.',
        url: window.location.origin
      }).catch(() => {});
    } else {
      setShowMedsosModal(true);
    }
  };

  return (
    <>
      <nav 
        aria-label="Navigasi Bawah Mobile"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden transition-all duration-300"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.35rem)' }}
      >
        <div className="grid grid-cols-5 items-center justify-around px-2 pt-1 max-w-lg mx-auto relative">
          
          {/* 1. Home */}
          <button
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className="flex flex-col items-center justify-center py-1 transition-all duration-200 touch-press group cursor-pointer"
            aria-label="Home"
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              isHome 
                ? 'bg-[#e8f5e9] text-[#1a6b3c]' 
                : 'text-slate-500 group-hover:text-slate-700'
            }`}>
              <Home className="w-5 h-5 stroke-[2.1]" />
            </div>
            <span className={`text-[11px] tracking-tight mt-0.5 leading-none transition-colors ${
              isHome 
                ? 'text-[#1a6b3c] font-semibold' 
                : 'text-slate-600 font-medium'
            }`}>
              Home
            </span>
            <span className={`w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-1 transition-opacity ${
              isHome ? 'opacity-100' : 'opacity-0'
            }`} />
          </button>

          {/* 2. JM News */}
          <button
            onClick={() => navigate('/galeri/foto')}
            className="flex flex-col items-center justify-center py-1 transition-all duration-200 touch-press group cursor-pointer"
            aria-label="JM News"
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              isNews 
                ? 'bg-[#e8f5e9] text-[#1a6b3c]' 
                : 'text-slate-500 group-hover:text-slate-700'
            }`}>
              <Newspaper className="w-5 h-5 stroke-[2.1]" />
            </div>
            <span className={`text-[11px] tracking-tight mt-0.5 leading-none transition-colors ${
              isNews 
                ? 'text-[#1a6b3c] font-semibold' 
                : 'text-slate-600 font-medium'
            }`}>
              JM News
            </span>
            <span className={`w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-1 transition-opacity ${
              isNews ? 'opacity-100' : 'opacity-0'
            }`} />
          </button>

          {/* 3. Center Elevated FAB: Medsos */}
          <div className="flex flex-col items-center justify-center -mt-6">
            <button
              onClick={handleShareWebsite}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0d4a28] border-[3px] border-white ring-2 ring-[#d4af37] shadow-[0_6px_16px_rgba(13,74,40,0.35)] flex items-center justify-center text-emerald-400 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
              aria-label="Media Sosial Resmi"
            >
              <Share2 className="w-6 h-6 stroke-[2.3] text-emerald-300" />
            </button>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[10px] font-bold text-[#0d4a28] tracking-tight whitespace-nowrap shadow-xs">
              Medsos
            </span>
          </div>

          {/* 4. E-Learning */}
          <button
            onClick={() => navigate('/smart-jm/hafidz/read')}
            className="flex flex-col items-center justify-center py-1 transition-all duration-200 touch-press group cursor-pointer"
            aria-label="E-Learning"
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              isElearning 
                ? 'bg-[#e8f5e9] text-[#1a6b3c]' 
                : 'text-slate-500 group-hover:text-slate-700'
            }`}>
              <Laptop className="w-5 h-5 stroke-[2.1]" />
            </div>
            <span className={`text-[11px] tracking-tight mt-0.5 leading-none transition-colors ${
              isElearning 
                ? 'text-[#1a6b3c] font-semibold' 
                : 'text-slate-600 font-medium'
            }`}>
              E-Learning
            </span>
            <span className={`w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-1 transition-opacity ${
              isElearning ? 'opacity-100' : 'opacity-0'
            }`} />
          </button>

          {/* 5. PPDB */}
          <button
            onClick={() => {
              const el = document.getElementById('kontak-ppdb');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/jm-center/sambutan');
              }
            }}
            className="flex flex-col items-center justify-center py-1 transition-all duration-200 touch-press group cursor-pointer"
            aria-label="PPDB"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full transition-colors text-slate-500 group-hover:text-slate-700">
              <GraduationCap className="w-5 h-5 stroke-[2.1]" />
            </div>
            <span className="text-[11px] tracking-tight mt-0.5 leading-none transition-colors text-slate-600 font-medium">
              PPDB
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-1 opacity-0" />
          </button>

        </div>
      </nav>

      {/* Medsos Popup Modal */}
      {showMedsosModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowMedsosModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-gray-900 text-base">Media Sosial & Narahubung PPJM</h4>
            <p className="text-xs text-gray-500">Ikuti informasi resmi kegiatan santri dan asrama:</p>
            <div className="space-y-2 text-left">
              <a 
                href="https://facebook.com/ppjauharulmaknuun" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
              >
                <span>📘 Facebook: PP Jauharul Maknuun</span>
              </a>
              <a 
                href="https://instagram.com/ppjauharulmaknuun" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-semibold"
              >
                <span>📷 Instagram: @ppjauharulmaknuun</span>
              </a>
              <a 
                href="https://youtube.com/@ppjauharulmaknuun" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
              >
                <span>📺 YouTube: @ppjauharulmaknuun</span>
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold"
              >
                <span>💬 WhatsApp Sekretariat: 0812-3456-7890</span>
              </a>
            </div>
            <button
              onClick={() => setShowMedsosModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
