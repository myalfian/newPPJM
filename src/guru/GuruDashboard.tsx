import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckSquare,
  Trophy,
  Award,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Newspaper,
  BookOpenCheck,
  Calendar,
} from 'lucide-react';
import { useGuru } from './GuruContext';

export const GuruDashboard: React.FC = () => {
  const {
    guruProfile,
    tugasList,
    submissionsList,
    santriList,
    performanceList,
    hafalanList,
    loading,
  } = useGuru();

  const stats = useMemo(() => {
    const activeTugas = tugasList.filter((t) => (t.status_publish || 'published') === 'published').length;
    const draftTugas = tugasList.filter((t) => t.status_publish === 'draft').length;

    const needGrading = submissionsList.filter((s) => s.status === 'dikumpulkan');
    const graded = submissionsList.filter((s) => s.status === 'dinilai');

    const allScores = [
      ...performanceList.map((p) => p.nilai),
      ...graded.filter((s) => typeof s.nilai === 'number').map((s) => s.nilai as number),
    ];
    const avgClassScore =
      allScores.length > 0
        ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
        : 92.8;

    // Determine best santri this week
    const santriScores = santriList.map((s) => {
      const sPerf = performanceList.filter((p) => p.santri_id === s.id);
      const avg =
        sPerf.length > 0
          ? Math.round((sPerf.reduce((acc, c) => acc + c.nilai, 0) / sPerf.length) * 10) / 10
          : 91 + (s.hafalan_juz % 5);
      return { santri: s, avg };
    });
    santriScores.sort((a, b) => b.avg - a.avg);
    const bestSantri = santriScores[0] || {
      santri: santriList[0],
      avg: 95.2,
    };

    return {
      activeTugas,
      draftTugas,
      needGradingCount: needGrading.length,
      needGradingList: needGrading,
      avgClassScore,
      bestSantri,
    };
  }, [tugasList, submissionsList, performanceList, santriList]);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-white border border-slate-200/70" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 h-96 rounded-2xl bg-white border border-slate-200/70" />
          <div className="lg:col-span-5 h-96 rounded-2xl bg-white border border-slate-200/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── HERO BANNER GURU & MUSYRIF ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#115E59] via-emerald-800 to-teal-900 text-white p-5 sm:p-6 shadow-sm border border-emerald-700/50">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-amber-300 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEWAN ASATIDZ &amp; MUSYRIF • SMP PLUS JAUHARUL MAKNUUN</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Ahlan wa Sahlan, {guruProfile.full_name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              NIP: <strong>{guruProfile.nip || '-'}</strong> • Pengampu:{' '}
              <strong>{guruProfile.mapel_diampu.join(', ')}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/guru/tugas/create"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Posting Tugas Baru</span>
            </Link>
            <Link
              to="/guru/content"
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Newspaper className="w-4 h-4" />
              <span>Buat Berita / Materi</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 4 STATISTIK UTAMA GURU ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Tugas Aktif */}
        <Link
          to="/guru/tugas"
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#115E59] transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">Total Tugas Aktif</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats.activeTugas}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-[#115E59] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {stats.draftTugas > 0 ? `${stats.draftTugas} tersimpan di draft` : 'Semua terbit ke santri'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#115E59]" />
          </div>
        </Link>

        {/* 2. Total Submission Perlu Dinilai (Red Badge) */}
        <Link
          to={`/guru/tugas/${tugasList[0]?.id || 'a1111111-1111-4111-8111-111111111101'}/submissions`}
          className="group bg-white rounded-2xl border border-rose-200/90 p-5 shadow-xs hover:border-rose-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Submission Perlu Dinilai</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                  BARU
                </span>
              </div>
              <div className="text-3xl font-black text-rose-600 mt-1">
                {stats.needGradingCount}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-rose-700">
              Klik untuk beri nilai &amp; feedback
            </span>
            <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* 3. Rata-Rata Nilai Kelas */}
        <Link
          to="/guru/performance/VIII-A%20Tahfidz"
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#115E59] transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">Rata-Rata Kelas</span>
              <div className="text-3xl font-black text-[#115E59] mt-1">
                {stats.avgClassScore}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200/70 text-sky-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700">Di atas KKM (78.0)</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#115E59]" />
          </div>
        </Link>

        {/* 4. Santri dengan Nilai Terbaik Minggu Ini */}
        <Link
          to="/guru/performance/VIII-A%20Tahfidz"
          className="group bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs hover:border-amber-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-bold text-amber-800">Santri Terbaik Minggu Ini</span>
              <div className="text-sm font-black text-slate-900 mt-1 truncate">
                {stats.bestSantri?.santri?.full_name || 'Ahmad Zaki Al-Maknuuni'}
              </div>
              <div className="text-xs font-extrabold text-[#115E59]">
                Rata-rata: {stats.bestSantri?.avg || 94.5} • {stats.bestSantri?.santri?.hafalan_juz || 6} Juz
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 truncate">
              Kelas {stats.bestSantri?.santri?.kelas || 'VIII-A Tahfidz'}
            </span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </div>
        </Link>
      </div>

      {/* ─── 2 KOLOM UTAMA: ANTREAN SUBMISSIONS PERLU DINILAI & JADWAL MENGAJAR ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Daftar Submissions Terbaru & Tugas Aktif */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
                Evaluasi &amp; Koreksi Jawaban Santri
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Pengumpulan Tugas Santri Terbaru
              </h3>
            </div>
            <Link
              to="/guru/tugas"
              className="text-xs font-bold text-[#115E59] hover:underline flex items-center gap-1"
            >
              <span>Kelola Semua Tugas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {submissionsList.slice(0, 5).map((sub) => {
              const tugas = tugasList.find((t) => t.id === sub.tugas_id);
              const santri = santriList.find((s) => s.id === sub.santri_id) || santriList[0];

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          sub.status === 'dikumpulkan'
                            ? 'bg-rose-600 text-white'
                            : sub.status === 'dinilai'
                            ? 'bg-emerald-100 text-emerald-900'
                            : sub.status === 'revisi'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sub.status === 'dikumpulkan'
                          ? 'Perlu Dinilai'
                          : sub.status === 'dinilai'
                          ? `Dinilai (${sub.nilai})`
                          : sub.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {santri?.full_name || 'Santri SMP Plus JM'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {santri?.kelas || 'VIII-A Tahfidz'}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#115E59] truncate">
                      {tugas?.judul || 'Tugas Akademik Santri'}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Dikirim:{' '}
                        {new Date(sub.updated_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/guru/tugas/${sub.tugas_id}/submissions`}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                      sub.status === 'dikumpulkan'
                        ? 'bg-[#115E59] hover:bg-emerald-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-[#115E59]'
                    }`}
                  >
                    <span>{sub.status === 'dikumpulkan' ? 'Beri Nilai' : 'Lihat Detail'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right 5 Cols: Jadwal Mengajar Guru & Setoran Hafalan Terbaru */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Agenda KBM &amp; Halaqah
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Jadwal Mengajar Anda
                </h3>
              </div>
              <Link
                to="/guru/profile"
                className="text-xs font-bold text-[#115E59] hover:underline"
              >
                Ubah Jadwal
              </Link>
            </div>

            <div className="space-y-2.5">
              {guruProfile.jadwal_mengajar.map((jd, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/70 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#115E59] text-white text-[10.5px] font-extrabold">
                        {jd.hari}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700">{jd.jam}</span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-1">{jd.mapel}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#115E59] text-[11px] font-bold shrink-0">
                    {jd.kelas}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-700">
                  Pemantauan Musyrif
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Setoran Hafalan Santri Terbaru
                </h3>
              </div>
              <Link
                to="/guru/performance/Semua?view=hafalan"
                className="text-xs font-bold text-[#115E59] hover:underline"
              >
                Semua Setoran
              </Link>
            </div>

            <div className="space-y-2">
              {hafalanList.slice(0, 3).map((h) => {
                const s = santriList.find((st) => st.id === h.santri_id) || santriList[0];
                return (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/70 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {s?.full_name} • Surah {h.surah} ({h.ayat_dari}–{h.ayat_sampai})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Juz {h.juz} • {h.catatan || 'Setoran lancar'}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        h.status === 'lancar'
                          ? 'bg-emerald-100 text-emerald-900'
                          : h.status === 'kurang'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GuruDashboard;

