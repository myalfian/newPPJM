import React from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, ChevronRight } from 'lucide-react';
import { StemProject } from '../stemProjects';

interface ProjectSummaryCardProps {
  project: StemProject;
  onSelect: (project: StemProject) => void;
}

const LEVEL_STYLE: Record<string, string> = {
  SD: 'bg-blue-100 text-blue-800',
  SMP: 'bg-emerald-100 text-emerald-800',
  SMA: 'bg-indigo-100 text-indigo-800',
};

const STATUS_STYLE: Record<string, string> = {
  Aktif: 'bg-emerald-100 text-emerald-800',
  Selesai: 'bg-blue-100 text-blue-800',
  Draft: 'bg-amber-100 text-amber-800',
};

export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({ project, onSelect }) => {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onClick={() => onSelect(project)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Thumbnail — luxury emerald gradient overlay */}
      <div className="relative h-40 md:h-48 overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/0 via-emerald-900/20 to-emerald-900/60" />
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${LEVEL_STYLE[project.level]} uppercase shadow-sm`}>
            {project.level}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${STATUS_STYLE[project.status]} uppercase shadow-sm`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
            <FileText className="w-3 h-3" />
            {project.category}
          </span>
        </div>
        <h3 className="font-black text-slate-900 text-sm md:text-base line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {project.summary}
        </p>
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
            <Play className="w-3 h-3 text-emerald-600" />
            <span>{project.totalMateri} Materi</span>
            <span className="w-px h-3 bg-slate-300"></span>
            <FileText className="w-3 h-3 text-amber-600" />
            <span>{project.totalLKPD} LKPD</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors group-hover:translate-x-1" />
        </div>
      </div>
    </motion.article>
  );
};
