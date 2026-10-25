import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Cpu,
  Trophy,
  Palette,
  Images,
  ArrowUpRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
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
      id: 'jm-center',
      label: 'JM Center',
      icon: Building2,
      cardTheme: 'bg-gradient-to-br from-[#f8faff] via-[#eff6ff] to-[#dbeafe]/90 border-blue-200/90 hover:border-blue-400 dark:from-slate-800/90 dark:via-blue-950/40 dark:to-blue-900/30 dark:border-blue-900/50',
      pillTheme: 'bg-gradient-to-br from-blue-100 to-blue-200/80 border border-blue-300/70 dark:from-blue-900/60 dark:to-blue-800/60 dark:border-blue-700/60',
      iconColor: 'text-blue-700 dark:text-blue-300',
      glowTheme: 'group-hover:bg-blue-400/20',
      hoverShadow: 'hover:shadow-blue-500/20',
      route: '/jm-center'
    },
    {
      id: 'program-unggulan',
      label: 'Program Unggulan',
      icon: GraduationCap,
      cardTheme: 'bg-gradient-to-br from-[#faf7ff] via-[#f5f3ff] to-[#ede9fe]/90 border-violet-200/90 hover:border-violet-400 dark:from-slate-800/90 dark:via-violet-950/40 dark:to-violet-900/30 dark:border-violet-900/50',
      pillTheme: 'bg-gradient-to-br from-violet-100 to-violet-200/80 border border-violet-300/70 dark:from-violet-900/60 dark:to-violet-800/60 dark:border-violet-700/60',
      iconColor: 'text-violet-700 dark:text-violet-300',
      glowTheme: 'group-hover:bg-violet-400/20',
      hoverShadow: 'hover:shadow-violet-500/20',
      route: '/program-unggulan'
    },
    {
      id: 'smart-jm',
      label: 'SMART JM',
      icon: Cpu,
      cardTheme: 'bg-gradient-to-br from-[#f2fcf7] via-[#ecfdf5] to-[#d1fae5]/90 border-emerald-200/90 hover:border-emerald-400 dark:from-slate-800/90 dark:via-emerald-950/40 dark:to-emerald-900/30 dark:border-emerald-900/50',
      pillTheme: 'bg-gradient-to-br from-emerald-100 to-emerald-200/80 border border-emerald-300/70 dark:from-emerald-900/60 dark:to-emerald-800/60 dark:border-emerald-700/60',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
      glowTheme: 'group-hover:bg-emerald-400/20',
      hoverShadow: 'hover:shadow-emerald-500/20',
      route: '/smart-jm/hafidz/read'
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      icon: Trophy,
      cardTheme: 'bg-gradient-to-br from-[#fefef0] via-[#fefce8] to-[#fef9c3]/90 border-amber-200/90 hover:border-amber-400 dark:from-slate-800/90 dark:via-amber-950/40 dark:to-amber-900/30 dark:border-amber-900/50',
      pillTheme: 'bg-gradient-to-br from-amber-100 to-amber-200/80 border border-amber-300/70 dark:from-amber-900/60 dark:to-amber-800/60 dark:border-amber-700/60',
      iconColor: 'text-amber-700 dark:text-amber-300',
      glowTheme: 'group-hover:bg-amber-400/20',
      hoverShadow: 'hover:shadow-amber-500/20',
      route: '/prestasi'
    },
    {
      id: 'ekskul',
      label: 'Ekstrakurikuler',
      icon: Palette,
      cardTheme: 'bg-gradient-to-br from-[#fffaf5] via-[#fff7ed] to-[#ffedd5]/90 border-orange-200/90 hover:border-orange-400 dark:from-slate-800/90 dark:via-orange-950/40 dark:to-orange-900/30 dark:border-orange-900/50',
      pillTheme: 'bg-gradient-to-br from-orange-100 to-orange-200/80 border border-orange-300/70 dark:from-orange-900/60 dark:to-orange-800/60 dark:border-orange-700/60',
      iconColor: 'text-orange-700 dark:text-orange-300',
      glowTheme: 'group-hover:bg-orange-400/20',
      hoverShadow: 'hover:shadow-orange-500/20',
      route: '/ekskul'
    },
    {
      id: 'galeri-sekolah',
      label: 'Galeri Sekolah',
      icon: Images,
      cardTheme: 'bg-gradient-to-br from-[#fff5f6] via-[#fff1f2] to-[#ffe4e6]/90 border-rose-200/90 hover:border-rose-400 dark:from-slate-800/90 dark:via-rose-950/40 dark:to-rose-900/30 dark:border-rose-900/50',
      pillTheme: 'bg-gradient-to-br from-rose-100 to-rose-200/80 border border-rose-300/70 dark:from-rose-900/60 dark:to-rose-800/60 dark:border-rose-700/60',
      iconColor: 'text-rose-700 dark:text-rose-300',
      glowTheme: 'group-hover:bg-rose-400/20',
      hoverShadow: 'hover:shadow-rose-500/20',
      route: '/galeri/foto'
    }
  ];

  return (
    <section
      aria-label="Menu Navigasi Cepat Portal"
      className="relative z-30 -mt-2 sm:-mt-3 bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-t-4xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)] pt-2.5 pb-3 sm:pt-4 sm:pb-4.5 lg:hidden transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4">
        {/* Layout Menu: 2 Kolom di Mobile, 3 Kolom di Tablet */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                type="button"
                className={`group relative flex flex-col md:flex-row items-center md:items-center text-center md:text-left p-2 sm:p-2.5 lg:p-3 rounded-2xl lg:rounded-3xl border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a6b3c] cursor-pointer overflow-hidden backdrop-blur-xs min-h-[62px] sm:min-h-[68px] md:min-h-[64px] ${item.cardTheme} ${item.hoverShadow}`}
                title={item.label}
              >
                {/* Subtle Glass Highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40 dark:bg-white/5 pointer-events-none rounded-t-2xl lg:rounded-t-3xl" />

                {/* Animated Icon Badge */}
                <div
                  className={`relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-2 shadow-xs ${item.pillTheme}`}
                >
                  <div className={`absolute -inset-1 rounded-2xl transition-all duration-300 blur-xs ${item.glowTheme}`} />
                  <Icon className={`relative z-10 w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 ${item.iconColor} stroke-[2.3] transition-transform duration-300 group-hover:scale-105`} />
                </div>

                {/* Card Text Details */}
                <div className="flex-1 min-w-0 mt-1.5 md:mt-0 md:ml-2.5 lg:ml-3 w-full">
                  <div className="flex items-center justify-center md:justify-between gap-1">
                    <span className="text-[12.5px] sm:text-[13.5px] md:text-sm lg:text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                      {item.label}
                    </span>
                    <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:translate-x-0.5 transition-all shadow-2xs">
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4]" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
