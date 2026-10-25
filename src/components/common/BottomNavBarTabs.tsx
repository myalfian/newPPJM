import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import './BottomNavBarTabs.css';

export interface BottomNavBarTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  years?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
  yearLabel?: string;
  className?: string;
  categoryLabel?: string; // Optional legacy prop (label Kategori intentionally removed)
}

/**
 * Formats 2-line wrapped text on mobile screens to prevent any clipping or truncation
 */
function renderCategoryMobileLabel(cat: string) {
  if (cat === 'Kitab Kuning / MQK') {
    return (
      <>
        <span className="block font-bold leading-tight">Kitab Kuning</span>
        <span className="block text-[9.5px] opacity-90 font-medium">(MQK)</span>
      </>
    );
  }
  if (cat === 'Tahfidz 30 Juz') {
    return (
      <>
        <span className="block font-bold leading-tight">Tahfidz</span>
        <span className="block text-[9.5px] opacity-90 font-medium">30 Juz</span>
      </>
    );
  }
  if (cat === 'Robotika / STEM') {
    return (
      <>
        <span className="block font-bold leading-tight">Robotika</span>
        <span className="block text-[9.5px] opacity-90 font-medium">(STEM)</span>
      </>
    );
  }
  if (cat === 'Olahraga & Silat') {
    return (
      <>
        <span className="block font-bold leading-tight">Olahraga</span>
        <span className="block text-[9.5px] opacity-90 font-medium">&amp; Silat</span>
      </>
    );
  }
  if (cat.includes('/')) {
    const [p1, ...rest] = cat.split('/');
    return (
      <>
        <span className="block font-bold leading-tight">{p1.trim()}</span>
        <span className="block text-[9.5px] opacity-90 font-medium">{rest.join('/').trim()}</span>
      </>
    );
  }
  return <span className="block font-bold leading-tight">{cat}</span>;
}

/**
 * BottomNavBarTabs - Single Unified Category Navigation with Bottom Floating Animation.
 * Clean, DRY architecture: Single category loop prevents any duplicate tab rendering.
 * - Label "KATEGORI" removed.
 * - Year filter: top-right on mobile, in-bar on desktop.
 * - Mobile: 2-line wrapped text, 100% full-width, zero horizontal sliding, zero truncation.
 * - Desktop: Unified single emerald bar with full 1-line text and integrated Year filter.
 */
export const BottomNavBarTabs: React.FC<BottomNavBarTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  years,
  selectedYear,
  onSelectYear,
  yearLabel = 'Tahun',
  className = '',
}) => {
  const hasYears = Boolean(years && years.length > 0 && onSelectYear);

  return (
    <nav
      aria-label="Filter Kategori dan Tahun"
      className={`bottom-curved-navbar-wrapper w-full ${className}`}
    >
      {/* 1. Mobile-Only Year Filter Pill: Positioned at Top Right (Separate from Category Bar) */}
      {hasYears && (
        <div className="flex items-center justify-end w-full mb-1.5 px-0.5 md:hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border-0 outline-none ring-0 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-gold-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">{yearLabel}:</span>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear!(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-0 cursor-pointer border-0 outline-none ring-0"
              aria-label="Filter Tahun Mobile"
            >
              {years!.map((y) => (
                <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {y === 'Semua' ? 'Semua Tahun' : y}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 2. Single Unified Emerald Bar: Rendered Exactly ONCE for both Mobile & Desktop */}
      <div className="bottom-curved-navbar-bar w-full">
        {/* Category Tabs Track */}
        <div className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-start h-full">
          <ul className="bottom-curved-tab-list flex items-center">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <li
                  key={cat}
                  className="bottom-curved-tab-col flex-1 md:flex-none h-full flex items-center justify-center min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={isActive}
                    className={`bottom-curved-tab-btn w-full md:w-auto ${isActive ? 'active' : ''}`}
                  >
                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="bottomCurvedCutoutPointer"
                        layout="position"
                        className="bottom-curved-pointer"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 28,
                          mass: 0.58,
                        }}
                      >
                        <svg
                          viewBox="0 0 74 22"
                          className="bottom-curved-notch-svg"
                          width="74"
                          height="22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <defs>
                            <radialGradient id="bottomNotchDotGrad" cx="35%" cy="35%" r="65%">
                              <stop offset="0%" stopColor="#fffbeb" />
                              <stop offset="35%" stopColor="#fde047" />
                              <stop offset="75%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#92400e" />
                            </radialGradient>
                          </defs>
                          <path
                            d="M 0 22 C 16 22, 22 4, 37 4 C 52 4, 58 22, 74 22 Z"
                            className="bottom-curved-notch-surface"
                            stroke="none"
                          />
                          {/* Radiant Jewel Gold Floating Indicator */}
                          <circle
                            cx="37"
                            cy="16"
                            r="4.8"
                            fill="url(#bottomNotchDotGrad)"
                            className="bottom-curved-notch-dot"
                            stroke="none"
                          />
                          {/* Specular Gem Reflection */}
                          <circle
                            cx="35.5"
                            cy="14.5"
                            r="1.4"
                            fill="#ffffff"
                            opacity="0.85"
                            stroke="none"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Responsive Text: 2-line wrapped on mobile, 1-line on desktop */}
                    <span className="bottom-curved-tab-text w-full">
                      <span className="md:hidden">
                        {renderCategoryMobileLabel(cat)}
                      </span>
                      <span className="hidden md:inline">
                        {cat}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3. Desktop-Only Year Filter Pill: Integrated inside the emerald bar on the right */}
        {hasYears && (
          <div className="hidden md:flex items-center shrink-0 ml-2">
            <div className="bottom-curved-year">
              <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="uppercase text-white/80">{yearLabel}:</span>
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear!(e.target.value)}
                aria-label="Filter Tahun Desktop"
              >
                {years!.map((y) => (
                  <option key={y} value={y}>
                    {y === 'Semua' ? 'Semua Tahun' : y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Aliases for versatility
export const CategoryNavBarTabs = BottomNavBarTabs;
export const CategoryFilterTabs = BottomNavBarTabs;
