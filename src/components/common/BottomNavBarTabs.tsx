import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar } from 'lucide-react';
import './BottomNavBarTabs.css';

export interface BottomNavBarTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  years?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
  categoryLabel?: string;
  yearLabel?: string;
  className?: string;
}

/**
 * BottomNavBarTabs - Category Navigation matching NavBarTabs style & spring dynamics,
 * with the curved cutout notch & floating dot inverted and positioned at the BOTTOM.
 */
export const BottomNavBarTabs: React.FC<BottomNavBarTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  years,
  selectedYear,
  onSelectYear,
  categoryLabel = 'Kategori',
  yearLabel = 'Tahun',
  className = '',
}) => {
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Auto-center active category tab on viewport
  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const container = tabListRef.current;
      const activeEl = activeTabRef.current;
      const scrollLeft =
        activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [selectedCategory]);

  return (
    <nav
      aria-label="Filter Kategori dan Tahun"
      className={`bottom-curved-navbar-wrapper w-full ${className}`}
    >
      <div className="bottom-curved-navbar-bar w-full">
        {/* Left: Kategori Badge */}
        <div className="bottom-curved-label">
          <Filter className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="hidden sm:inline">{categoryLabel}:</span>
        </div>

        {/* Center: Scrollable Track of Categories with Bottom Notch */}
        <div
          ref={tabListRef}
          className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full mx-1 sm:mx-2"
        >
          <ul className="bottom-curved-tab-list flex items-center justify-start">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <li
                  key={cat}
                  className="bottom-curved-tab-col flex-none h-full flex items-center justify-center snap-start shrink-0"
                >
                  <button
                    ref={isActive ? activeTabRef : null}
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={isActive}
                    className={`bottom-curved-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    {/* Animated Sliding Notch Pointer & Floating Dot at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="bottomCurvedCutoutPointer"
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

                    {/* Tab Text */}
                    <span className="bottom-curved-tab-text">{cat}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Year Filter (if provided) */}
        {years && years.length > 0 && onSelectYear && (
          <div className="flex items-center shrink-0">
            <div className="hidden sm:block w-px h-6 bg-white/20 mr-2" />
            <div className="bottom-curved-year">
              <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="hidden md:inline uppercase text-white/80">{yearLabel}:</span>
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                aria-label="Filter Tahun"
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
