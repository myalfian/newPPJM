import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  BookOpenCheck,
  Trophy,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Languages,
  Moon,
  Sun,
  BookOpen,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { useSantri } from './SantriContext';

interface DailyScheduleItem {
  id: string;
  time: string;
  title: string;
  category: 'Ibadah' | 'Tahfidz' | 'Bahasa' | 'Akademik' | 'Madin';
  detail: string;
  icon: React.ElementType;
}

const DAILY_SCHEDULES: DailyScheduleItem[] = [
  {
    id: 'sch-1',
    time: '03:45 – 05:00',
    title: 'Qiyamul Lail (Tahajjud, Hajat, Taubat, Witir) & Jamaah Subuh',
    category: 'Ibadah',
    detail: 'Shalat sunnah malam berjamaah, dzikir fajar, dan shalat Subuh tepat waktu di Musholla.',
    icon: Moon,
  },
  {
    id: 'sch-2',
    time: '05:00 – 06:00',
    title: 'Murojaah & Setoran Hafalan Al-Qur’an (Tahfidzul Qur’an)',
    category: 'Tahfidz',
    detail: 'Setoran ziyadah & murojaah bil-ghoib di hadapan Ustadz/Musyrif halaqah.',
    icon: BookOpenCheck,
  },
  {
    id: 'sch-3',
    time: '06:00 – 06:40',
    title: 'Password 4 Bahasa & Muhadasah Pagi',
    category: 'Bahasa',
    detail: 'Praktik percakapan Bahasa Arab, Inggris, Mandarin, dan Indonesia di serambi asrama.',
    icon: Languages,
  },
  {
    id: 'sch-4',
    time: '07:00 – 13:30',
    title: 'Shalat Dhuha Berjamaah & KBM Formal SMP Plus JM',
    category: 'Akademik',
    detail: 'Pembelajaran PAKEM, Kelas Olimpiade, Laboratorium STEM, dan Kelas Bahasa Mandarin.',
    icon: Sun,
  },
  {
    id: 'sch-5',
    time: '15:15 – 17:00',
    title: 'Jamaah Ashar & Madrasah Diniyah (Kajian Kitab Turats)',
    category: 'Madin',
    detail: 'Sorogan dan bandongan kitab Fathul Qorib, Nahwu Sharaf, Aqidatul Awam, dan Tajwid.',
    icon: BookOpen,
  },
  {
    id: 'sch-6',
    time: '18:00 – 20:45',
    title: 'Jamaah Maghrib-Isya, Doa Bersama & Deresan Mandiri',
    category: 'Ibadah',
    detail: 'Tadarus bersama, shalat sunnah Ba’diyah, belajar mandiri terbimbing, dan persiapan istirahat.',
    icon: Sparkles,
  },
];

export function formatDeadlineCountdown(deadlineIso: string): {
  label: string;
  urgent: boolean;
  expired: boolean;
} {
  const diffMs = new Date(deadlineIso).getTime() - Date.now();
  if (diffMs <= 0) {
    const pastDays = Math.abs(Math.floor(diffMs / 86400000));
    return {
      label: pastDays === 0 ? 'Batas waktu hari ini' : `Lewat ${pastDays} hari`,
      urgent: true,
      expired: true,
    };
  }
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  if (days === 0) {
    return { label: `${hours} jam lagi`, urgent: true, expired: false };
  }
  if (days <= 2) {
    return { label: `${days} hari ${hours} jam lagi`, urgent: true, expired: false };
  }
  return { label: `${days} hari lagi`, urgent: false, expired: false };
}

export const SantriDashboard: React.FC = () => {
  const { profile, tugasList, submissionsMap, performanceList, hafalanList, loading } = useSantri();

  // Interactive daily checklist persisted per day in localStorage
  const todayKey = useMemo(() => `ppjm_amaliyah_${new Date().toISOString().slice(0, 10)}`, []);
  const [checkedAmaliyah, setCheckedAmaliyah] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : { 'sch-1': true, 'sch-2': true, 'sch-3': true };
    } catch {
      return { 'sch-1': true, 'sch-2': true, 'sch-3': true };
    }
  });

  const toggleAmaliyah = (id: string) => {
    setCheckedAmaliyah((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(todayKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Metrics Calculation
  const stats = useMemo(() => {
    const belumDikumpulkan = tugasList.filter((t) => {
      const sub = submissionsMap[t.id];
      return !sub || sub.status === 'draft' || sub.status === 'revisi';
    }).length;

    const perluRevisi = tugasList.filter((t) => submissionsMap[t.id]?.status === 'revisi').length;

    // Hafalan minggu ini (7 hari terakhir)
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    const setoranMingguIni = hafalanList.filter(
      (h) => new Date(h.tanggal).getTime() >= sevenDaysAgo
    );
    const totalAyatMingguIni = setoranMingguIni.reduce(
      (acc, cur) => acc + Math.max(1, cur.ayat_sampai - cur.ayat_dari + 1),
      0
    );

    // Nilai rata-rata gabungan performance & tugas yang sudah dinilai
    const allScores: number[] = [
      ...performanceList.map((p) => p.nilai),
      ...Object.values(submissionsMap)
        .filter((s) => typeof s.nilai === 'number')
        .map((s) => s.nilai as number),
    ];
    const avgScore =
      allScores.length > 0
        ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
        : 92.5;

    return {
      belumDikumpulkan,
      perluRevisi,
      setoranCount: setoranMingguIni.length,
      totalAyatMingguIni,
      avgScore,
    };
  }, [tugasList, submissionsMap, performanceList, hafalanList]);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-white border border-slate-200/70 p-5" />
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
      {/* ─── HERO WELCOME CARD (Schudio Rounded-2xl Emerald Banner) ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#115E59] via-emerald-800 to-teal-900 text-white p-5 sm:p-6 shadow-sm border border-emerald-700/50">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-amber-300 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AYO, SEKOLAH SAMBIL MONDOK! • Sholeh, Cerdas, Terampil, Unggul</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Semangat Menuntut Ilmu &amp; Murojaah, {profile.full_name}!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              NIS: <strong>{profile.nis || '-'}</strong> • Kelas:{' '}
              <strong>{profile.kelas || 'VIII-A Tahfidz'}</strong> • Kamar Asrama:{' '}
              <strong>{profile.kamar_asrama || 'Al-Ghazali 03'}</strong> • Wali:{' '}
              <strong>{profile.wali_santri || '-'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/santri/tugas"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Kerjakan Tugas ({stats.belumDikumpulkan})</span>
            </Link>
            <Link
              to="/santri/profile"
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all"
            >
              Edit Profil
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 4 CARD RINGKASAN UTAMA ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tugas Belum Dikumpulkan */}
        <Link
          to="/santri/tugas"
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#115E59] transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">Tugas Belum Selesai</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {stats.belumDikumpulkan}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            {stats.perluRevisi > 0 ? (
              <span className="font-bold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stats.perluRevisi} tugas perlu revisi guru
              </span>
            ) : (
              <span className="text-slate-500">Dari total {tugasList.length} tugas aktif</span>
            )}
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#115E59] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Card 2: Hafalan Minggu Ini */}
        <Link
          to="/santri/performance?tab=hafalan"
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#115E59] transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">Hafalan Minggu Ini</span>
              <div className="text-3xl font-black text-[#115E59] mt-1">
                {stats.setoranCount} <span className="text-sm font-bold text-slate-500">Setoran</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-[#115E59] flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800">
              Total {stats.totalAyatMingguIni} ayat • Capaian {profile.hafalan_juz} Juz
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#115E59] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Card 3: Nilai Rata-Rata */}
        <Link
          to="/santri/performance"
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#115E59] transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">Nilai Rata-Rata</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {stats.avgScore}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200/70 text-sky-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700">
              Predikat Mumtaz (A) • Semester Ganjil
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#115E59] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Card 4: Amaliyah Harian Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">Disiplin Amaliyah Hari Ini</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {Object.values(checkedAmaliyah).filter(Boolean).length}/{DAILY_SCHEDULES.length}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200/70 text-purple-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Klik jadwal di bawah untuk centang</span>
            <span className="font-bold text-[#115E59]">
              {Math.round(
                (Object.values(checkedAmaliyah).filter(Boolean).length / DAILY_SCHEDULES.length) * 100
              )}
              %
            </span>
          </div>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN SECTION: JADWAL HARIAN & TUGAS TERDEKAT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Jadwal Harian Pondok & Sekolah Hari Ini */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                Rutinitas Santri SMP Plus Jauharul Maknuun
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Jadwal Kegiatan &amp; Amaliyah Hari Ini
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs font-bold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-[#115E59]" />
              <span>
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </span>
          </div>

          <div className="space-y-2.5">
            {DAILY_SCHEDULES.map((item) => {
              const Icon = item.icon;
              const done = !!checkedAmaliyah[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAmaliyah(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    done
                      ? 'bg-emerald-50/50 border-emerald-200/90'
                      : 'bg-[#FAF8F5]/60 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Tandai ${item.title}`}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                      done
                        ? 'bg-[#115E59] border-[#115E59] text-white'
                        : 'bg-white border-slate-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-extrabold text-[#115E59] bg-white px-2 py-0.5 rounded-lg border border-emerald-200/70">
                        {item.time}
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </div>
                    <h4
                      className={`text-sm font-extrabold mt-1 ${
                        done ? 'text-emerald-950 line-through decoration-emerald-500/50' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/70 flex items-center justify-center text-[#115E59] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right 5 Cols: Daftar Tugas Terdekat & Riwayat Setoran Terakhir */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tugas Prioritas */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-700">
                  Prioritas Akademik &amp; Pondok
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Tugas Perlu Dikerjakan
                </h3>
              </div>
              <Link
                to="/santri/tugas"
                className="text-xs font-bold text-[#115E59] hover:underline flex items-center gap-1"
              >
                <span>Semua Tugas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {tugasList.slice(0, 4).map((tugas) => {
                const sub = submissionsMap[tugas.id];
                const countdown = formatDeadlineCountdown(tugas.deadline);
                const status = sub?.status || 'belum';

                const badgeMap: Record<string, { label: string; cls: string }> = {
                  belum: {
                    label: 'Belum Dikerjakan',
                    cls: 'bg-slate-100 text-slate-700 border-slate-200',
                  },
                  draft: {
                    label: 'Draft Tersimpan',
                    cls: 'bg-amber-50 text-amber-800 border-amber-200',
                  },
                  revisi: {
                    label: 'Perlu Revisi',
                    cls: 'bg-rose-50 text-rose-700 border-rose-200',
                  },
                  dikumpulkan: {
                    label: 'Sudah Dikumpulkan',
                    cls: 'bg-sky-50 text-sky-800 border-sky-200',
                  },
                  dinilai: {
                    label: `Dinilai (${sub?.nilai ?? 0})`,
                    cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  },
                };

                const b = badgeMap[status] || badgeMap.belum;

                return (
                  <Link
                    key={tugas.id}
                    to={`/santri/tugas/${tugas.id}`}
                    className="block p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#115E59] bg-[#FAF8F5]/50 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#115E59] truncate">
                        {tugas.mapel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${b.cls}`}
                      >
                        {b.label}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#115E59] line-clamp-2 leading-snug">
                      {tugas.judul}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          countdown.urgent && status !== 'dinilai'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{countdown.label}</span>
                      </span>
                      <span className="font-bold text-[#115E59] flex items-center gap-1">
                        <span>{status === 'dinilai' ? 'Lihat Nilai' : 'Buka Tugas'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Setoran Hafalan Terakhir */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Tahfidzul Qur&apos;an
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Setoran Hafalan Terakhir
                </h3>
              </div>
              <Link
                to="/santri/performance?tab=hafalan"
                className="text-xs font-bold text-[#115E59] hover:underline"
              >
                Riwayat Lengkap
              </Link>
            </div>

            <div className="space-y-2">
              {hafalanList.slice(0, 3).map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/70 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900">
                      Surah {h.surah} (Ayat {h.ayat_dari}–{h.ayat_sampai})
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Juz {h.juz} • {h.penyimak_nama || 'Ustadz Penyimak'}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase ${
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
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SantriDashboard;

