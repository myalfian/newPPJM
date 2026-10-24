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
  categoryLabel?: string; // Kept for backward compatibility, ignored as requested
}

/**
 * Renders 2-line wrapped text for category tabs on mobile without truncation
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
 * BottomNavBarTabs - Category Navigation matching NavBarTabs style & spring dynamics.
 * - Label "KATEGORI" removed.
 * - Year filter redesigned to top-right on mobile, integrated in-bar on desktop.
 * - Mobile: 2-line wrapped category text with zero truncation or horizontal sliding.
 * - Bottom-positioned curved notch & floating emerald dot.
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
  return (
    <nav
      aria-label="Filter Kategori dan Tahun"
      className={`bottom-curved-navbar-wrapper w-full ${className}`}
    >
      {/* 1. Mobile Phone View (< 768px): Redesigned Year Pill at Top Right + Full-Width 2-Line Tabs */}
      <div className="md:hidden flex flex-col w-full">
        {/* Top Right: Redesigned Year Filter Pill (Label Kategori eliminated) */}
        {years && years.length > 0 && onSelectYear && (
          <div className="flex items-center justify-end w-full mb-1.5 px-0.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold text-slate-700 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-gold-400 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{yearLabel}:</span>
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                aria-label="Filter Tahun Mobile"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {y === 'Semua' ? 'Semua Tahun' : y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Category Tabs Bar: 100% Full-Width Fit, Equal Distribution, 2-Line Text, Zero Sliding */}
        <div className="bottom-curved-navbar-bar w-full px-1">
          <ul className="w-full h-full flex items-center justify-between gap-1 p-0 m-0 list-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <li key={cat} className="bottom-curved-tab-col flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={isActive}
                    className={`bottom-curved-tab-btn w-full ${isActive ? 'active' : ''}`}
                  >
                    {/* Animated Sliding Notch Pointer & Floating Dot at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="bottomCurvedCutoutPointerMobile"
                        layout="position"
                        className="bottom-curved-pointer"
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 27,
                          mass: 0.65,
                        }}
                      >
                        <svg
                          viewBox="0 0 74 25"
                          className="bottom-curved-notch-svg"
                          width="74"
                          height="25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M 0 25 L 74 25 L 74 22 C 58 22, 52 4, 37 4 C 22 4, 16 22, 0 22 Z"
                            className="bottom-curved-notch-surface"
                          />
                          <circle cx="37" cy="16.5" r="4" className="bottom-curved-notch-dot" />
                        </svg>
                      </motion.div>
                    )}

                    {/* 2-Line Vertically Wrapped Text: Completely readable, zero truncation */}
                    <span className="bottom-curved-tab-text w-full">
                      {renderCategoryMobileLabel(cat)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 2. Tablet & Desktop View (>= 768px): Unified Single Emerald Bar (No Kategori label) */}
      <div className="bottom-curved-navbar-bar w-full hidden md:flex items-center justify-between">
        {/* Left/Center: Full-Width Tabs with Bottom Notch */}
        <div className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-start h-full mx-1">
          <ul className="bottom-curved-tab-list flex items-center justify-start">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <li
                  key={cat}
                  className="bottom-curved-tab-col flex-none h-full flex items-center justify-center"
                >
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={isActive}
                    className={`bottom-curved-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottomCurvedCutoutPointerDesktop"
                        layout="position"
                        className="bottom-curved-pointer"
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 27,
                          mass: 0.65,
                        }}
                      >
                        <svg
                          viewBox="0 0 74 25"
                          className="bottom-curved-notch-svg"
                          width="74"
                          height="25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M 0 25 L 74 25 L 74 22 C 58 22, 52 4, 37 4 C 22 4, 16 22, 0 22 Z"
                            className="bottom-curved-notch-surface"
                          />
                          <circle cx="37" cy="16.5" r="4" className="bottom-curved-notch-dot" />
                        </svg>
                      </motion.div>
                    )}

                    <span className="bottom-curved-tab-text">{cat}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Year Filter */}
        {years && years.length > 0 && onSelectYear && (
          <div className="flex items-center shrink-0">
            <div className="w-px h-6 bg-white/20 mr-2" />
            <div className="bottom-curved-year">
              <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="uppercase text-white/80">{yearLabel}:</span>
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                aria-label="Filter Tahun Desktop"
              >
                {years.map((y) => (
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
