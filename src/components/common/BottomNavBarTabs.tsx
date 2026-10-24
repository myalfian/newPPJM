import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar } from 'lucide-react';
import './BottomNavBarTabs.css';

export interface BottomNavBarTabsProps {
  categories: string[];
  categoryShortLabels?: Record<string, string>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  years?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
  categoryLabel?: string;
  yearLabel?: string;
  className?: string;
}

const DEFAULT_CATEGORY_SHORT_LABELS: Record<string, string> = {
  'Semua': 'Semua',
  'Kitab Kuning / MQK': 'MQK',
  'Tahfidz 30 Juz': 'Tahfidz',
  'Robotika / STEM': 'STEM',
  'Olahraga & Silat': 'Silat',
};

/**
 * BottomNavBarTabs - Category Navigation matching NavBarTabs style & spring dynamics,
 * with zero horizontal sliding on mobile and bottom-positioned curved notch & floating dot.
 */
export const BottomNavBarTabs: React.FC<BottomNavBarTabsProps> = ({
  categories,
  categoryShortLabels = DEFAULT_CATEGORY_SHORT_LABELS,
  selectedCategory,
  onSelectCategory,
  years,
  selectedYear,
  onSelectYear,
  categoryLabel = 'Kategori',
  yearLabel = 'Tahun',
  className = '',
}) => {
  return (
    <nav
      aria-label="Filter Kategori dan Tahun"
      className={`bottom-curved-navbar-wrapper w-full ${className}`}
    >
      {/* 1. Mobile Phone View (< 768px): Zero-Sliding Adaptive 2-Tier Layout */}
      <div className="md:hidden flex flex-col gap-2 w-full">
        {/* Top Control Bar: Kategori Badge & Tahun Dropdown */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-900/10 dark:bg-emerald-950/60 border border-emerald-800/20 text-emerald-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-emerald-700 dark:text-gold-400 shrink-0" />
            <span>{categoryLabel}</span>
          </div>

          {years && years.length > 0 && onSelectYear && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-gold-400 shrink-0" />
              <span className="text-slate-400 font-semibold uppercase">{yearLabel}:</span>
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
          )}
        </div>

        {/* Category Tabs Bar: 100% Full-Width Fit, Equal Distribution, No Horizontal Scroll */}
        <div className="bottom-curved-navbar-bar w-full h-[50px] px-1.5">
          <ul className="w-full h-full flex items-center justify-between gap-1 p-0 m-0 list-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const shortName = categoryShortLabels[cat] || cat;

              return (
                <li key={cat} className="flex-1 min-w-0 h-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={isActive}
                    className={`bottom-curved-tab-btn w-full px-1 ${isActive ? 'active' : ''}`}
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

                    {/* Concise Label for mobile screens */}
                    <span className="bottom-curved-tab-text text-[11px] truncate w-full">
                      {shortName}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 2. Tablet & Desktop View (>= 768px): Unified Single Emerald Bar */}
      <div className="bottom-curved-navbar-bar w-full hidden md:flex items-center justify-between">
        {/* Left: Kategori Badge */}
        <div className="bottom-curved-label">
          <Filter className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>{categoryLabel}:</span>
        </div>

        {/* Center: Full-Width Tabs with Bottom Notch */}
        <div className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-start h-full mx-2">
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
