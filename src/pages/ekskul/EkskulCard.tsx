import React from 'react';
import {
  Clock,
  UserCheck,
  Images,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { DetailedEkskulItem } from './types';

interface EkskulCardProps {
  item: DetailedEkskulItem;
  onOpenDetail: (item: DetailedEkskulItem) => void;
}

export const EkskulCard: React.FC<EkskulCardProps> = ({ item, onOpenDetail }) => {
  const categoryColorClass =
    item.category === 'Sains & Teknologi'
      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60'
      : item.category === 'Seni & Bahasa'
      ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60'
      : item.category === 'Olahraga & Bela Diri'
      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60'
      : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';

  return (
    <article
      onClick={() => onOpenDetail(item)}
      className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div>
        {/* Photo Container (aspect-[16/10], rounded-2xl) */}
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={item.featuredPhoto}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Category Badge Top Left */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-md ${categoryColorClass}`}
            >
              {item.category}
            </span>
          </div>

          {/* Photo Gallery Count Badge Top Right */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-white/10 group-hover:bg-emerald-600 transition-colors">
              <Images className="w-3.5 h-3.5" />
              <span>+{item.gallery.length} Foto</span>
            </div>
          </div>

          {/* Bottom Title over photo on mobile preview */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
              Minat Bakat Santri
            </span>
            <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow-md">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Schedule & Coach Metadata */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{item.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Pembina: {item.coach}</span>
            </div>
          </div>

          {/* Key Highlights Mini Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.highlights.slice(0, 2).map((h, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]"
              >
                ✓ {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(item);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-50 hover:bg-emerald-50 dark:bg-zinc-800/80 dark:hover:bg-emerald-950/60 text-zinc-700 hover:text-emerald-800 dark:text-zinc-300 dark:hover:text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all min-h-[44px] cursor-pointer active:scale-[0.98]"
        >
          <span>Lihat Profil & Galeri Kegiatan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};

