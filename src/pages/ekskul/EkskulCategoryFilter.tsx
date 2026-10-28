import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Palette,
  Shield,
  Compass,
  Layers
} from 'lucide-react';
import { EkskulCategory } from './types';

interface EkskulCategoryFilterProps {
  selectedCategory: EkskulCategory;
  onSelectCategory: (category: EkskulCategory) => void;
  categoryCounts: Record<EkskulCategory, number>;
}

export const CATEGORIES_CONFIG: {
  id: EkskulCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'Semua Kategori', label: 'Semua Kategori', icon: Layers },
  { id: 'Sains & Teknologi', label: 'Sains & Teknologi', icon: Cpu },
  { id: 'Seni & Bahasa', label: 'Seni & Bahasa', icon: Palette },
  { id: 'Olahraga & Bela Diri', label: 'Olahraga & Bela Diri', icon: Shield },
  { id: 'Kepanduan & Keagamaan', label: 'Kepanduan & Agama', icon: Compass }
];

export const EkskulCategoryFilter: React.FC<EkskulCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  return (
    <div className="sticky top-14 sm:top-18 z-30 -mx-3 px-3 sm:mx-0 sm:px-0 py-2.5 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-y sm:border sm:rounded-2xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x touch-pan-x p-1 select-none">
        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 active:scale-[0.98] snap-start select-none ${
                isSelected
                  ? 'text-emerald-950 dark:text-emerald-100 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Active Indicator Sliding Pill */}
              {isSelected && (
                <motion.div
                  layoutId="ekskul-category-active"
                  className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300/80 dark:border-emerald-700/60 rounded-xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200'
                      : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

