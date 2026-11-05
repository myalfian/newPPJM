import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import '../../../components/common/BottomNavBarTabs.css';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { StemProject } from '../stemProjects';

interface ProjectSummaryGridProps {
  projects: StemProject[];
  onSelect: (project: StemProject) => void;
}

export const ProjectSummaryGrid: React.FC<ProjectSummaryGridProps> = ({ projects, onSelect }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const uniqueId = React.useId().replace(/:/g, '');

  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      return filterCategory === 'all' || p.category === filterCategory;
    });
  }, [projects, filterCategory]);

  return (
    <div className="space-y-4">
      {/* Kategori Filter — BottomNavBarTabs (curved-navbar-bar, bottom notch, gold jewel) */}
      <div className="bottom-curved-navbar-bar w-full">
        <div className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-start h-full overflow-x-auto relative w-full px-2">
          <ul className="bottom-curved-tab-list flex items-center gap-2">
            {categories.map((cat) => (
              <li key={cat} className="bottom-curved-tab-col flex-none h-full flex items-center justify-center snap-start shrink-0">
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  aria-pressed={filterCategory === cat}
                  className={`bottom-curved-tab-btn ${filterCategory === cat ? 'active' : ''}`}
                >
                  {filterCategory === cat && (
                    <motion.div
                      layoutId={`${uniqueId}-pill-${cat}`}
                      layout="position"
                      className="bottom-curved-pointer"
                      transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.58 }}
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
                          <radialGradient id={`bottomNotchDotGrad-${uniqueId}-${cat}`} cx="35%" cy="35%" r="65%">
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
                        <circle
                          cx="37"
                          cy="16"
                          r="4.8"
                          fill={`url(#bottomNotchDotGrad-${uniqueId}-${cat})`}
                          className="bottom-curved-notch-dot"
                          stroke="none"
                        />
                        <circle cx="35.5" cy="14.5" r="1.4" fill="#ffffff" opacity="0.85" stroke="none" />
                      </svg>
                    </motion.div>
                  )}
                  <span className="bottom-curved-tab-text font-extrabold tracking-tight">
                    <span className={`text-white/85 ${filterCategory === cat ? 'text-[#facc15]' : ''}`}>
                      {cat}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-white/70 font-medium">
        {filteredProjects.length} dari {projects.length} proyek
      </p>

      {/* Card Grid — luxury emerald/gold aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectSummaryCard key={project.id} project={project} onSelect={onSelect} />
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-600 font-medium">Tidak ada proyek yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};
