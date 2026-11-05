import React from 'react';
import { BarChart3 } from 'lucide-react';
import { StemRubrikRow } from '../stemProjects';

interface RubrikTabProps {
  rubrik: StemRubrikRow[];
}

export const RubrikTab: React.FC<RubrikTabProps> = ({ rubrik }) => {
  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Rubrik Penilaian Proyek</h4>
          <p className="text-xs text-slate-500">
            Penilaian dilakukan pada 4 aspek utama dengan skala 1–4.
          </p>
        </div>
      </div>

      {rubrik.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          Belum ada rubrik penilaian yang tersedia.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Aspek Penilaian</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kriteria</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Skor 1</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Skor 2</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Skor 3</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Skor 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rubrik.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.aspek}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">{row.kriteria}</td>
                  <td className="px-4 py-3 text-xs text-center text-slate-500 font-mono">{row.skor1}</td>
                  <td className="px-4 py-3 text-xs text-center text-slate-500 font-mono">{row.skor2}</td>
                  <td className="px-4 py-3 text-xs text-center text-slate-500 font-mono">{row.skor3}</td>
                  <td className="px-4 py-3 text-xs text-center font-bold text-emerald-700 font-mono">{row.skor4}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t border-slate-200">
                <td className="px-4 py-3 text-xs font-bold text-slate-600" colSpan={2}>
                  Total Skor Maksimal
                </td>
                <td className="px-4 py-3 text-xs text-slate-700 text-right" colSpan={5}>
                  <span className="text-sm font-black text-emerald-900">100</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
        <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BarChart3 className="w-3 h-3 text-emerald-700" />
          Panduan Penilaian
        </h5>
        <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
          <li>
            <strong>Skor 4:</strong> Sangat baik, memenuhi semua indikator
          </li>
          <li>
            <strong>Skor 3:</strong> Baik, hampir semua indikator terpenuhi
          </li>
          <li>
            <strong>Skor 2:</strong> Cukup, beberapa indikator terpenuhi
          </li>
          <li>
            <strong>Skor 1:</strong> Belum memenuhi indikator
          </li>
        </ul>
      </div>
    </div>
  );
};
