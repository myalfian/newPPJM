import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  CheckSquare,
  Edit3,
  Trash2,
  Clock,
  Paperclip,
  Users,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useGuru } from './GuruContext';
import { extractPlainText } from '../santri/SantriTipTap';

export const GuruTugasListPage: React.FC = () => {
  const { tugasList, submissionsList, santriList, updateTugas, deleteTugas, loading } = useGuru();
  const location = useLocation();
  const isBankMode = location.search.includes('mode=bank');

  const [statusFilter, setStatusFilter] = useState<'semua' | 'published' | 'draft'>('semua');
  const [tipeFilter, setTipeFilter] = useState<'semua' | 'harian' | 'pekanan' | 'project' | 'tahfidz'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTugas = useMemo(() => {
    return tugasList.filter((t) => {
      const pub = t.status_publish || 'published';
      if (statusFilter !== 'semua' && pub !== statusFilter) return false;
      if (tipeFilter !== 'semua' && t.tipe !== tipeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.judul.toLowerCase().includes(q) ||
          t.mapel.toLowerCase().includes(q) ||
          extractPlainText(t.deskripsi).toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [tugasList, statusFilter, tipeFilter, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 rounded-2xl bg-white border border-slate-200/70" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-52 rounded-2xl bg-white border border-slate-200/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isBankMode ? 'Bank Soal, Modul & LKPD Guru' : 'Manajemen Tugas Pengajar'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {isBankMode
                ? 'Arsip Bank Soal, LKPD STEM & Tugas Terpadu'
                : 'Daftar Tugas Saya & Progress Pengumpulan Santri'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 self-start">
            <div className="inline-flex p-1 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              {(
                [
                  { id: 'semua', label: 'Semua' },
                  { id: 'published', label: 'Published' },
                  { id: 'draft', label: 'Draft' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-[#115E59] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <Link
              to="/guru/tugas/create"
              className="px-4 py-2.5 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Posting Tugas Baru</span>
            </Link>
          </div>
        </div>

        {/* Filter Tipe & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'semua', label: 'Semua Tipe' },
                { id: 'harian', label: 'Harian' },
                { id: 'pekanan', label: 'Pekanan' },
                { id: 'project', label: 'Project STEM' },
                { id: 'tahfidz', label: 'Tahfidz' },
              ] as const
            ).map((tp) => (
              <button
                key={tp.id}
                type="button"
                onClick={() => setTipeFilter(tp.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                  tipeFilter === tp.id
                    ? 'bg-emerald-50 border-[#115E59] text-[#115E59]'
                    : 'bg-white border-slate-200 text-slate-600'
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
              placeholder="Cari judul tugas atau mata pelajaran…"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#115E59]"
            />
          </div>
        </div>
      </div>

      {/* Tugas Grid */}
      {filteredTugas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-[#115E59] mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900">Belum ada tugas yang cocok</h3>
          <p className="text-xs text-slate-500">
            Klik tombol &ldquo;Posting Tugas Baru&rdquo; di kanan atas untuk membuat penugasan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTugas.map((t) => {
            const subs = submissionsList.filter((s) => s.tugas_id === t.id);
            const needGrading = subs.filter((s) => s.status === 'dikumpulkan').length;
            const totalTargetSantri = Math.max(santriList.length, 5);
            const submittedCount = subs.filter((s) => s.status !== 'draft').length;
            const progressPct = Math.min(
              100,
              Math.round((submittedCount / totalTargetSantri) * 100)
            );
            const isPub = (t.status_publish || 'published') === 'published';

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#115E59] text-[10.5px] font-extrabold uppercase">
                        {t.mapel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold uppercase">
                        {t.tipe}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {needGrading > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10.5px] font-black">
                          {needGrading} Perlu Dinilai
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          updateTugas(t.id, {
                            status_publish: isPub ? 'draft' : 'published',
                          })
                        }
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border cursor-pointer ${
                          isPub
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                        title="Klik untuk ganti status Published / Draft"
                      >
                        {isPub ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {t.judul}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {extractPlainText(t.deskripsi)}
                  </p>

                  {/* Submission Progress Bar */}
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#115E59]" />
                        <span>Kelas: {t.kelas_target}</span>
                      </span>
                      <span className="text-[#115E59]">
                        {submittedCount}/{totalTargetSantri} Mengumpulkan ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-[#115E59] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(12, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(t.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                    {t.attachment_url?.length > 0 && (
                      <span className="flex items-center gap-1 text-[#115E59] font-bold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{t.attachment_url.length} Lampiran</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/guru/tugas/${t.id}/edit`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#115E59] text-slate-700 font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </Link>
                    <Link
                      to={`/guru/tugas/${t.id}/submissions`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
                      <span>Submissions ({subs.length})</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteTugas(t.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                      title="Hapus tugas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuruTugasListPage;

