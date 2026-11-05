import React from 'react';
import { PlayCircle, FileText, ExternalLink } from 'lucide-react';
import { StemMateriItem } from '../stemProjects';

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  video: { color: 'text-red-600', bg: 'bg-red-50' },
  pdf: { color: 'text-blue-600', bg: 'bg-blue-50' },
  link: { color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

interface MateriTabProps {
  materi: StemMateriItem[];
}

export const MateriTab: React.FC<MateriTabProps> = ({ materi }) => {
  return (
    <div className="space-y-3 p-1">
      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
        <PlayCircle className="w-4 h-4 text-emerald-600" />
        Daftar Materi Pembelajaran
      </div>

      {materi.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          Belum ada materi yang tersedia untuk proyek ini.
        </div>
      ) : (
        <div className="space-y-2">
          {materi.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.link;
            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
              >
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 ${config.color}`}>
                  {item.type === 'video' ? (
                    <PlayCircle className="w-4 h-4" />
                  ) : item.type === 'pdf' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-slate-400 bg-slate-100">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    Durasi: {item.duration} • Klik untuk membuka
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
