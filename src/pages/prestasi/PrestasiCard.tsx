import React from 'react';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  User,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PrestasiItem } from './types';

interface PrestasiCardProps {
  item: PrestasiItem;
  onOpenModal: (item: PrestasiItem) => void;
}

export const PrestasiCard: React.FC<PrestasiCardProps> = ({ item, onOpenModal }) => {
  // Medal Tone determination
  const isGold = item.medal_type.toLowerCase().includes('emas') || item.medal_type.toLowerCase().includes('juara 1');
  const isSilver = item.medal_type.toLowerCase().includes('perak') || item.medal_type.toLowerCase().includes('juara 2');
  const isBronze = item.medal_type.toLowerCase().includes('perunggu') || item.medal_type.toLowerCase().includes('juara 3');

  const getTingkatBadgeClass = (tingkat: string) => {
    switch (tingkat) {
      case 'Internasional':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200/80';
      case 'Nasional':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200/80';
      case 'Provinsi':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200/80';
      case 'Kabupaten':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200/80';
    }
  };

  const getMedalBadgeClass = () => {
    if (isGold) {
      return 'bg-gradient-to-r from-amber-500 via-[#d4af37] to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/20';
    }
    if (isSilver) {
      return 'bg-gradient-to-r from-slate-300 via-slate-200 to-zinc-300 text-zinc-900 shadow-md shadow-slate-400/20';
    }
    if (isBronze) {
      return 'bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-700 text-white shadow-md shadow-amber-800/20';
    }
    return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20';
  };

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300/80 dark:hover:border-emerald-600/60 transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.985] select-none"
    >
      {/* Top Banner Image with Aspect Ratio */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={item.photo_url || item.certificate_url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Ambient Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges: Category & Tingkat */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10.5px] font-black text-white border border-white/20 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            {item.category}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-black border shadow-xs ${getTingkatBadgeClass(
              item.tingkat
            )}`}
          >
            Tingkat {item.tingkat}
          </span>
        </div>

        {/* Bottom Floating Ribbon: Medal / Trophy Type */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div
            className={`px-3 py-1 rounded-xl text-xs font-black tracking-tight flex items-center gap-1.5 ${getMedalBadgeClass()}`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span>{item.medal_type}</span>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 text-xs font-black border border-white/40 shadow-xs flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-600" />
            {item.year}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-2">
          {/* Winner Profile Pill */}
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <span className="truncate">{item.winner_name}</span>
            {item.winner_class && (
              <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 truncate">
                • {item.winner_class}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Event & Organizer */}
          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium">
            Ajang: {item.event_name}
          </p>

          {/* Description Excerpt */}
          <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed pt-0.5">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Interactive CTA */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800">
          <span className="inline-flex items-center gap-1">
            Lihat Sertifikat & Penghargaan
          </span>
          <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-200">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

