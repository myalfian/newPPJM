import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Cpu,
  Trophy,
  Palette,
  Images,
  ArrowUpRight,
  CalendarDays
} from 'lucide-react';
import { OsisIcon } from '../data/navigationData';

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
      cardTheme: 'bg-gradient-to-br from-[#f8faff] via-[#eff6ff] to-[#dbeafe]/95 border-2 border-blue-300/90 hover:border-blue-500 shadow-xs dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 dark:border-blue-600/60 dark:hover:border-blue-400/80',
      pillTheme: 'bg-gradient-to-br from-blue-100 to-blue-200/80 border border-blue-300/70 dark:from-blue-950 dark:to-blue-900/60 dark:border-blue-600/60',
      iconColor: 'text-blue-700 dark:text-blue-300',
      glowTheme: 'group-hover:bg-blue-400/20',
      hoverShadow: 'hover:shadow-blue-500/20',
      route: '/jm-center'
    },
    {
      id: 'program-unggulan',
      label: 'Program',
      icon: GraduationCap,
      cardTheme: 'bg-gradient-to-br from-[#faf7ff] via-[#f5f3ff] to-[#ede9fe]/95 border-2 border-violet-300/90 hover:border-violet-500 shadow-xs dark:from-slate-900 dark:via-violet-950/40 dark:to-slate-900 dark:border-violet-600/60 dark:hover:border-violet-400/80',
      pillTheme: 'bg-gradient-to-br from-violet-100 to-violet-200/80 border border-violet-300/70 dark:from-violet-950 dark:to-violet-900/60 dark:border-violet-600/60',
      iconColor: 'text-violet-700 dark:text-violet-300',
      glowTheme: 'group-hover:bg-violet-400/20',
      hoverShadow: 'hover:shadow-violet-500/20',
      route: '/program-unggulan'
    },
    {
      id: 'smart-jm',
      label: 'SMART JM',
      icon: Cpu,
      cardTheme: 'bg-gradient-to-br from-[#f2fcf7] via-[#ecfdf5] to-[#d1fae5]/95 border-2 border-emerald-300/90 hover:border-emerald-500 shadow-xs dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 dark:border-emerald-600/60 dark:hover:border-emerald-400/80',
      pillTheme: 'bg-gradient-to-br from-emerald-100 to-emerald-200/80 border border-emerald-300/70 dark:from-emerald-950 dark:to-emerald-900/60 dark:border-emerald-600/60',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
      glowTheme: 'group-hover:bg-emerald-400/20',
      hoverShadow: 'hover:shadow-emerald-500/20',
      route: '/smart-jm/hafidz/read'
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      icon: Trophy,
      cardTheme: 'bg-gradient-to-br from-[#fefef0] via-[#fefce8] to-[#fef9c3]/95 border-2 border-amber-300/90 hover:border-amber-500 shadow-xs dark:from-slate-900 dark:via-amber-950/40 dark:to-slate-900 dark:border-amber-600/60 dark:hover:border-amber-400/80',
      pillTheme: 'bg-gradient-to-br from-amber-100 to-amber-200/80 border border-amber-300/70 dark:from-amber-950 dark:to-amber-900/60 dark:border-amber-600/60',
      iconColor: 'text-amber-700 dark:text-amber-300',
      glowTheme: 'group-hover:bg-amber-400/20',
      hoverShadow: 'hover:shadow-amber-500/20',
      route: '/prestasi'
    },
    {
      id: 'ekskul',
      label: 'Ekstrakurikuler',
      icon: Palette,
      cardTheme: 'bg-gradient-to-br from-[#fffaf5] via-[#fff7ed] to-[#ffedd5]/95 border-2 border-orange-300/90 hover:border-orange-500 shadow-xs dark:from-slate-900 dark:via-orange-950/40 dark:to-slate-900 dark:border-orange-600/60 dark:hover:border-orange-400/80',
      pillTheme: 'bg-gradient-to-br from-orange-100 to-orange-200/80 border border-orange-300/70 dark:from-orange-950 dark:to-orange-900/60 dark:border-orange-600/60',
      iconColor: 'text-orange-700 dark:text-orange-300',
      glowTheme: 'group-hover:bg-orange-400/20',
      hoverShadow: 'hover:shadow-orange-500/20',
      route: '/ekskul'
    },
    {
      id: 'osis',
      label: 'OSIS',
      icon: OsisIcon,
      cardTheme: 'bg-gradient-to-br from-[#f8faff] via-[#eef2ff] to-[#e0e7ff]/95 border-2 border-indigo-300/90 hover:border-indigo-500 shadow-xs dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 dark:border-indigo-600/60 dark:hover:border-indigo-400/80',
      pillTheme: 'bg-white/95 dark:bg-slate-800/90 border border-indigo-200/80 dark:border-indigo-700/60 shadow-2xs',
      iconColor: 'text-indigo-700 dark:text-indigo-300',
      glowTheme: 'group-hover:bg-indigo-400/20',
      hoverShadow: 'hover:shadow-indigo-500/20',
      route: '/osis'
    },
    {
      id: 'agenda-pesantren',
      label: 'Agenda',
      icon: CalendarDays,
      cardTheme: 'bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5]/95 border-2 border-emerald-300/90 hover:border-emerald-500 shadow-xs dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 dark:border-emerald-600/60 dark:hover:border-emerald-400/80',
      pillTheme: 'bg-gradient-to-br from-emerald-100 to-emerald-200/80 border border-emerald-300/70 dark:from-emerald-950 dark:to-emerald-900/60 dark:border-emerald-600/60',
      iconColor: 'text-[#0d4a28] dark:text-emerald-300',
      glowTheme: 'group-hover:bg-emerald-400/20',
      hoverShadow: 'hover:shadow-emerald-500/20',
      route: '/agenda'
    },
    {
      id: 'galeri-sekolah',
      label: 'Galeri',
      icon: Images,
      cardTheme: 'bg-gradient-to-br from-[#fff5f6] via-[#fff1f2] to-[#ffe4e6]/95 border-2 border-rose-300/90 hover:border-rose-500 shadow-xs dark:from-slate-900 dark:via-rose-950/40 dark:to-slate-900 dark:border-rose-600/60 dark:hover:border-rose-400/80',
      pillTheme: 'bg-gradient-to-br from-rose-100 to-rose-200/80 border border-rose-300/70 dark:from-rose-950 dark:to-rose-900/60 dark:border-rose-600/60',
      iconColor: 'text-rose-700 dark:text-rose-300',
      glowTheme: 'group-hover:bg-rose-400/20',
      hoverShadow: 'hover:shadow-rose-500/20',
      route: '/galeri/foto'
    }
  ];

  return (
    <section
      aria-label="Menu Navigasi Cepat Portal"
      className="relative z-30 -mt-2 sm:-mt-3.5 bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-t-3xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-6px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_-6px_25px_rgba(0,0,0,0.3)] pt-1.5 pb-2 sm:pt-2.5 sm:pb-3 lg:hidden transition-colors duration-200 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-2.5 sm:px-4">
        {/* Layout QuickMenu: 2 Kolom x 4 Baris di Mobile Viewport */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                type="button"
                className={`group relative flex items-center text-left px-2 xs:px-2.5 sm:px-3 rounded-lg xs:rounded-xl sm:rounded-2xl border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.97] focus:outline-hidden focus-visible:ring-1.5 focus-visible:ring-[#1a6b3c] cursor-pointer overflow-hidden backdrop-blur-xs h-[34px] xs:h-[37px] sm:h-[44px] select-none ${item.cardTheme} ${item.hoverShadow}`}
                title={item.label}
              >
                {/* Subtle Glass Highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40 dark:bg-white/5 pointer-events-none rounded-t-lg xs:rounded-t-xl sm:rounded-t-2xl overflow-hidden" />

                {/* Animated Icon Badge */}
                <div
                  className={`relative shrink-0 w-6 h-6 xs:w-6.5 xs:h-6.5 sm:w-7.5 sm:h-7.5 rounded-md xs:rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-105 shadow-2xs ${item.pillTheme}`}
                >
                  <div className={`absolute -inset-1 rounded-md xs:rounded-lg transition-all duration-200 blur-xs ${item.glowTheme}`} />
                  <Icon className={`relative z-10 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 ${item.iconColor} stroke-[2.2] transition-transform duration-200 group-hover:scale-105`} />
                </div>

                {/* Card Label: Compact, Bold & Highly Readable Single Line */}
                <div className="flex-1 min-w-0 ml-1.5 xs:ml-2 sm:ml-2.5 overflow-hidden">
                  <span className="block text-[11px] xs:text-[12px] sm:text-[13.5px] md:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                    {item.label}
                  </span>
                </div>

                {/* Sub-action Indicator Pill */}
                <div className="hidden sm:flex shrink-0 items-center justify-center w-4.5 h-4.5 rounded-full bg-white/70 dark:bg-slate-800/70 text-slate-400 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shadow-2xs overflow-hidden">
                  <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
