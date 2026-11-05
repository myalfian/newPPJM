import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { StemLKPDItem } from '../stemProjects';

interface LKPDTabProps {
  lkpd: StemLKPDItem[];
}

export const LKPDTab: React.FC<LKPDTabProps> = ({ lkpd }) => {
  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3 p-1">
      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
        <FileText className="w-4 h-4 text-amber-600" />
        Lembar Kerja Peserta Didik (LKPD)
      </div>

      {lkpd.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          Belum ada LKPD yang tersedia untuk proyek ini.
        </div>
      ) : (
        <div className="space-y-2">
          {lkpd.map((item, idx) => (
            <div key={item.id} className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-amber-700 bg-amber-50">
                    LKPD Halaman {idx + 1}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Unduh dokumen LKPD lengkap untuk dikerjakan
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownload(item.pdfUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-50 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh PDF
                </button>
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Lihat Online
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
