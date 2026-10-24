import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ScrollText, 
  Compass, 
  BellRing, 
  MonitorCheck, 
  Sparkles, 
  Trophy,
  ArrowUpRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  cardTheme: string;
  pillTheme: string;
  iconColor: string;
  glowTheme: string;
  hoverShadow: string;
  route: string;
}

export const QuickMenu: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: 'sambutan',
      label: 'Sambutan',
      subtitle: 'Pesan & Arahan Pimpinan',
      icon: ScrollText,
      cardTheme: 'bg-gradient-to-br from-[#fffdf5] via-[#fffbeb] to-[#fef3c7]/90 border-amber-200/90 hover:border-amber-400',
      pillTheme: 'bg-gradient-to-br from-amber-100 to-amber-200/80 border border-amber-300/70',
      iconColor: 'text-amber-800',
      glowTheme: 'group-hover:bg-amber-400/20',
      hoverShadow: 'hover:shadow-amber-500/20',
      route: '/jm-center/sambutan'
    },
    {
      id: 'visi-misi',
      label: 'Visi & Misi',
      subtitle: 'Arah & Nilai Luhur Lembaga',
      icon: Compass,
      cardTheme: 'bg-gradient-to-br from-[#f8faff] via-[#eff6ff] to-[#dbeafe]/90 border-blue-200/90 hover:border-blue-400',
      pillTheme: 'bg-gradient-to-br from-blue-100 to-blue-200/80 border border-blue-300/70',
      iconColor: 'text-blue-800',
      glowTheme: 'group-hover:bg-blue-400/20',
      hoverShadow: 'hover:shadow-blue-500/20',
      route: '/jm-center/visi-misi'
    },
    {
      id: 'pengumuman',
      label: 'Pengumuman',
      subtitle: 'Informasi & Warta Terkini',
      icon: BellRing,
      cardTheme: 'bg-gradient-to-br from-[#fff5f6] via-[#fff1f2] to-[#ffe4e6]/90 border-rose-200/90 hover:border-rose-400',
      pillTheme: 'bg-gradient-to-br from-rose-100 to-rose-200/80 border border-rose-300/70',
      iconColor: 'text-rose-800',
      glowTheme: 'group-hover:bg-rose-400/20',
      hoverShadow: 'hover:shadow-rose-500/20',
      route: '/galeri/foto'
    },
    {
      id: 'elearning',
      label: 'E-Learning',
      subtitle: 'Portal Digital Santri',
      icon: MonitorCheck,
      cardTheme: 'bg-gradient-to-br from-[#f2fcf7] via-[#ecfdf5] to-[#d1fae5]/90 border-emerald-200/90 hover:border-emerald-400',
      pillTheme: 'bg-gradient-to-br from-emerald-100 to-emerald-200/80 border border-emerald-300/70',
      iconColor: 'text-emerald-800',
      glowTheme: 'group-hover:bg-emerald-400/20',
      hoverShadow: 'hover:shadow-emerald-500/20',
      route: '/smart-jm/hafidz/read'
    },
    {
      id: 'ekskul',
      label: 'Ekstrakurikuler',
      subtitle: 'Minat, Bakat & Seni Islami',
      icon: Sparkles,
      cardTheme: 'bg-gradient-to-br from-[#fffaf5] via-[#fff7ed] to-[#ffedd5]/90 border-orange-200/90 hover:border-orange-400',
      pillTheme: 'bg-gradient-to-br from-orange-100 to-orange-200/80 border border-orange-300/70',
      iconColor: 'text-orange-800',
      glowTheme: 'group-hover:bg-orange-400/20',
      hoverShadow: 'hover:shadow-orange-500/20',
      route: '/ekskul'
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      subtitle: 'Capaian & Kejuaraan Santri',
      icon: Trophy,
      cardTheme: 'bg-gradient-to-br from-[#fefef0] via-[#fefce8] to-[#fef9c3]/90 border-yellow-200/90 hover:border-yellow-400',
      pillTheme: 'bg-gradient-to-br from-yellow-100 to-yellow-200/80 border border-yellow-300/70',
      iconColor: 'text-yellow-800',
      glowTheme: 'group-hover:bg-yellow-400/20',
      hoverShadow: 'hover:shadow-yellow-500/20',
      route: '/prestasi'
    }
  ];

  return (
    <section 
      aria-label="Menu Navigasi Cepat Portal" 
      className="relative z-30 -mt-3 sm:-mt-4 bg-white rounded-t-3xl sm:rounded-t-4xl border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pt-5 pb-6 sm:pt-8 sm:pb-9 lg:hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        {/* Layout Menu: 2 Baris x 3 Kolom */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                type="button"
                className={`group relative flex flex-col md:flex-row items-center md:items-center text-center md:text-left p-3.5 sm:p-5 lg:p-5.5 rounded-2xl lg:rounded-3xl border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a6b3c] cursor-pointer overflow-hidden backdrop-blur-xs min-h-[96px] sm:min-h-[110px] md:min-h-[98px] ${item.cardTheme} ${item.hoverShadow}`}
                title={`${item.label} - ${item.subtitle}`}
              >
                {/* Subtle Glass Highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/50 pointer-events-none rounded-t-2xl lg:rounded-t-3xl" />

                {/* Animated Icon Badge */}
                <div 
                  className={`relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-2 shadow-xs ${item.pillTheme}`}
                >
                  <div className={`absolute -inset-1 rounded-2xl transition-all duration-300 blur-xs ${item.glowTheme}`} />
                  <Icon className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${item.iconColor} stroke-[2.2] transition-transform duration-300 group-hover:scale-105`} />
                </div>

                {/* Card Text Details */}
                <div className="flex-1 min-w-0 mt-2 md:mt-0 md:ml-3.5 lg:ml-4 w-full">
                  <div className="flex items-center justify-center md:justify-between gap-1">
                    <span className="text-xs sm:text-sm md:text-base lg:text-[17px] font-black text-gray-900 tracking-tight leading-snug group-hover:text-black transition-colors truncate">
                      {item.label}
                    </span>
                    <div className="hidden md:flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/80 text-gray-400 group-hover:text-gray-900 group-hover:bg-white group-hover:translate-x-0.5 transition-all shadow-2xs">
                      <ArrowUpRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[2.4]" />
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium truncate mt-0.5 hidden sm:block">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
