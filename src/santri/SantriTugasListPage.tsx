import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Clock,
  Search,
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  ArrowRight,
  Paperclip,
  User,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useSantri } from './SantriContext';
import { formatDeadlineCountdown } from './SantriDashboard';
import { extractPlainText } from './SantriTipTap';

type FilterStatus = 'semua' | 'belum' | 'dinilai';
type FilterTipe = 'semua' | 'harian' | 'pekanan' | 'project' | 'tahfidz';

export const SantriTugasListPage: React.FC = () => {
  const { tugasList, submissionsMap, loading } = useSantri();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('semua');
  const [filterTipe, setFilterTipe] = useState<FilterTipe>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = useMemo(() => {
    let belum = 0;
    let dinilai = 0;
    tugasList.forEach((t) => {
      const sub = submissionsMap[t.id];
      if (sub?.status === 'dinilai') {
        dinilai++;
      } else if (!sub || sub.status === 'draft' || sub.status === 'revisi') {
        belum++;
      }
    });
    return {
      semua: tugasList.length,
      belum,
      dinilai,
    };
  }, [tugasList, submissionsMap]);

  const filteredTugas = useMemo(() => {
    return tugasList.filter((t) => {
      const sub = submissionsMap[t.id];
      const status: string = sub?.status || 'belum';

      if (filterStatus === 'belum' && status !== 'belum' && status !== 'draft' && status !== 'revisi') {
        return false;
      }
      if (filterStatus === 'dinilai' && status !== 'dinilai') {
        return false;
      }
      if (filterTipe !== 'semua' && t.tipe !== filterTipe) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.judul.toLowerCase().includes(q);
        const matchMapel = t.mapel.toLowerCase().includes(q);
        const matchDesc = extractPlainText(t.deskripsi).toLowerCase().includes(q);
        if (!matchTitle && !matchMapel && !matchDesc) return false;
      }
      return true;
    });
  }, [tugasList, submissionsMap, filterStatus, filterTipe, searchQuery]);

  const getStatusMeta = (tugasId: string) => {
    const sub = submissionsMap[tugasId];
    const st = sub?.status || 'belum';
    switch (st) {
      case 'dinilai':
        return {
          label: `Dinilai • Skor ${sub?.nilai ?? 0}/100`,
          cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          actionText: 'Lihat Nilai & Feedback',
        };
      case 'dikumpulkan':
        return {
          label: 'Sudah Dikumpulkan',
          cls: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
          actionText: 'Lihat / Perbarui Jawaban',
        };
      case 'revisi':
        return {
          label: 'Perlu Revisi Guru',
          cls: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          actionText: 'Perbaiki & Kirim Ulang',
        };
      case 'draft':
        return {
          label: 'Draft Tersimpan',
          cls: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          actionText: 'Lanjutkan & Kumpulkan',
        };
      default:
        return {
          label: 'Belum Dikumpulkan',
          cls: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          actionText: 'Kerjakan Sekarang',
        };
    }
  };

  const tipeBadgeMap: Record<string, { label: string; cls: string }> = {
    harian: { label: 'Tugas Harian', cls: 'bg-teal-50 text-teal-800 border-teal-200' },
    pekanan: { label: 'Tugas Pekanan', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    project: { label: 'Project STEM/Karya', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
    tahfidz: { label: 'Setoran Tahfidz', cls: 'bg-amber-50 text-amber-900 border-amber-200' },
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 rounded-2xl bg-white border border-slate-200/70" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-white border border-slate-200/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Manajemen Tugas Santri SMP Plus JM</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              Daftar Tugas Akademik, Project STEM &amp; Tahfidz
            </h2>
          </div>

          {/* Segmented Status Filter (Semua, Belum, Dinilai) */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 self-start">
            {(
              [
                { id: 'semua', label: 'Semua', count: counts.semua },
                { id: 'belum', label: 'Belum', count: counts.belum },
                { id: 'dinilai', label: 'Dinilai', count: counts.dinilai },
              ] as const
            ).map((tab) => {
              const active = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#115E59] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Tipe Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'semua', label: 'Semua Tipe' },
                { id: 'harian', label: 'Harian' },
                { id: 'pekanan', label: 'Pekanan' },
                { id: 'project', label: 'Project' },
                { id: 'tahfidz', label: 'Tahfidz' },
              ] as const
            ).map((tp) => (
              <button
                key={tp.id}
                type="button"
                onClick={() => setFilterTipe(tp.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  filterTipe === tp.id
                    ? 'border-[#115E59] bg-emerald-50 text-[#115E59]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mata pelajaran atau judul tugas…"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#115E59]"
            />
          </div>
        </div>
      </div>

      {/* Grid Tugas Cards */}
      {filteredTugas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-[#115E59] mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900">
            Tidak ada tugas pada filter ini
          </h3>
          <p className="text-xs text-slate-500">
            Coba pilih tab &ldquo;Semua&rdquo; atau ubah kata kunci pencarian di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTugas.map((tugas) => {
            const sub = submissionsMap[tugas.id];
            const statusMeta = getStatusMeta(tugas.id);
            const tipeMeta = tipeBadgeMap[tugas.tipe] || tipeBadgeMap.harian;
            const countdown = formatDeadlineCountdown(tugas.deadline);
            const plainDesc = extractPlainText(tugas.deskripsi);

            return (
              <Link
                key={tugas.id}
                to={`/santri/tugas/${tugas.id}`}
                className="group bg-white rounded-2xl border border-slate-200/85 hover:border-[#115E59] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border ${tipeMeta.cls}`}
                      >
                        {tipeMeta.label}
                      </span>
                      <span className="text-xs font-extrabold text-[#115E59]">
                        • {tugas.mapel}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusMeta.cls}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                      <span>{statusMeta.label}</span>
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#115E59] transition-colors leading-snug">
                    {tugas.judul}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {plainDesc || 'Klik untuk membaca instruksi lengkap dan mengumpulkan jawaban.'}
                  </p>

                  {/* Feedback Preview if Revisi / Dinilai */}
                  {sub?.feedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs ${
                        sub.status === 'revisi'
                          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="font-extrabold flex items-center gap-1.5 mb-0.5">
                        {sub.status === 'revisi' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>Catatan Ustadz/Ustadzah:</span>
                      </div>
                      <p className="text-[11.5px] line-clamp-2">{sub.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Footer: Guru, Deadline Countdown & CTA */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tugas.guru_nama || 'Dewan Asatidz'}</span>
                    </span>
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        countdown.urgent && sub?.status !== 'dinilai'
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{countdown.label}</span>
                    </span>
                    {tugas.attachment_url?.length > 0 && (
                      <span className="flex items-center gap-1 text-[#115E59] font-semibold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{tugas.attachment_url.length} Modul</span>
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 font-extrabold text-[#115E59] group-hover:translate-x-0.5 transition-transform">
                    <span>{statusMeta.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SantriTugasListPage;

