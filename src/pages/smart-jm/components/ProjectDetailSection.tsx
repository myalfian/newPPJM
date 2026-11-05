import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, PlayCircle, BarChart3, CloudUpload } from 'lucide-react';
import { StemProject } from '../stemProjects';
import { MateriTab } from './MateriTab';
import { LKPDTab } from './LKPDTab';
import { RubrikTab } from './RubrikTab';
import { UnggahProyekTab } from './UnggahProyekTab';

type DetailTab = 'materi' | 'lkpd' | 'rubrik' | 'unggah';

const TAB_CONFIG: Record<DetailTab, { label: string; icon: React.ElementType }> = {
  materi: { label: 'Materi', icon: PlayCircle },
  lkpd: { label: 'LKPD', icon: FileText },
  rubrik: { label: 'Rubrik Penilaian', icon: BarChart3 },
  unggah: { label: 'Unggah Proyek', icon: CloudUpload },
};

interface ProjectDetailSectionProps {
  project: StemProject;
  onBack: () => void;
}

export const ProjectDetailSection: React.FC<ProjectDetailSectionProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('materi');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="detail-view"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        {/* Tombol Kembali */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Proyek</span>
          </button>
        </div>

        {/* Header Detail */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-2xl p-5 sm:p-7 overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-700/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0 w-40 sm:w-48 h-28 sm:h-32 rounded-xl overflow-hidden border border-emerald-700/30 shadow-lg">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 text-[10px] font-bold border border-gold-400/30 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase">
                  {project.level}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600/20 text-emerald-100 text-[10px] font-bold border border-emerald-500/30 uppercase">
                  {project.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                {project.title}
              </h2>
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-4">
                {project.summary}
              </p>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-emerald-200/80 font-medium border-t border-emerald-500/30 pt-4">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gold-400" />
                  <span>{project.totalMateri} Materi Pembelajaran</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>{project.totalLKPD} Lembar Kerja</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="flex border-b border-slate-200 rounded-t-2xl overflow-hidden bg-white shadow-sm">
          {Object.entries(TAB_CONFIG).map(([key, config]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as DetailTab)}
                className={`flex-1 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <config.icon className={`w-4 h-4 mr-2 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 min-h-[400px]">
          {activeTab === 'materi' && <MateriTab materi={project.materi} />}
          {activeTab === 'lkpd' && <LKPDTab lkpd={project.lkpd} />}
          {activeTab === 'rubrik' && <RubrikTab rubrik={project.rubrik} />}
          {activeTab === 'unggah' && <UnggahProyekTab _projectId={project.id} uploads={project.uploads} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
