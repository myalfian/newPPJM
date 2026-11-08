import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Cell,
} from 'recharts';
import {
  BarChart3,
  BookOpenCheck,
  Award,
  MessageSquareQuote,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { useSantri } from './SantriContext';

type JenisFilter = 'semua' | 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';

export const SantriPerformancePage: React.FC = () => {
  const { profile, performanceList, hafalanList, submissionsMap, tugasList, addHafalanSetoran, loading } =
    useSantri();
  const location = useLocation();

  const [jenisFilter, setJenisFilter] = useState<JenisFilter>('semua');
  const [activeTab, setActiveTab] = useState<'akademik' | 'hafalan'>(() =>
    location.search.includes('tab=hafalan') ? 'hafalan' : 'akademik'
  );

  // Form tambah setoran di tab hafalan
  const [surah, setSurah] = useState('Al-Haqqah');
  const [ayatDari, setAyatDari] = useState(25);
  const [ayatSampai, setAyatSampai] = useState(52);
  const [juz, setJuz] = useState(29);
  const [statusSetoran, setStatusSetoran] = useState<'lancar' | 'kurang' | 'ulang'>('lancar');
  const [penyimakNama, setPenyimakNama] = useState('Ustadz Fadly, S.Pd.');
  const [catatanSetoran, setCatatanSetoran] = useState('');
  const [savingSetoran, setSavingSetoran] = useState(false);

  useEffect(() => {
    if (location.search.includes('tab=hafalan')) {
      setActiveTab('hafalan');
    } else {
      setActiveTab('akademik');
    }
  }, [location.search]);

  // Combine performanceList + graded tugas_submission for comprehensive chart & table
  const combinedPerformance = useMemo(() => {
    const base = [...performanceList];
    tugasList.forEach((t) => {
      const sub = submissionsMap[t.id];
      if (sub && sub.status === 'dinilai' && typeof sub.nilai === 'number') {
        const alreadyExists = base.some(
          (p) => p.mapel.toLowerCase() === t.mapel.toLowerCase() && p.nilai === sub.nilai
        );
        if (!alreadyExists) {
          base.push({
            id: `sub-${sub.id}`,
            santri_id: sub.santri_id,
            mapel: `${t.mapel} (Tugas)`,
            jenis: t.tipe === 'tahfidz' ? 'tahfidz' : 'harian',
            nilai: sub.nilai,
            predikat: sub.nilai >= 90 ? 'A+' : sub.nilai >= 85 ? 'A' : 'B+',
            semester: 'Ganjil 2026/2027',
            catatan_musyrif: sub.feedback,
            created_by: null,
            created_at: sub.updated_at,
          });
        }
      }
    });
    return base;
  }, [performanceList, tugasList, submissionsMap]);

  const filteredPerformance = useMemo(() => {
    if (jenisFilter === 'semua') return combinedPerformance;
    return combinedPerformance.filter((p) => p.jenis === jenisFilter);
  }, [combinedPerformance, jenisFilter]);

  const chartData = useMemo(() => {
    return combinedPerformance.map((item) => ({
      mapel:
        item.mapel.length > 18 ? `${item.mapel.slice(0, 16)}…` : item.mapel,
      fullMapel: item.mapel,
      nilai: item.nilai,
      kkm: 78,
      jenis: item.jenis.toUpperCase(),
    }));
  }, [combinedPerformance]);

  const tahfidzPercentage = useMemo(() => {
    return Math.min(100, Math.round(((profile.hafalan_juz || 0) / 30) * 100));
  }, [profile.hafalan_juz]);

  const radialData = useMemo(
    () => [
      {
        name: 'Capaian Tahfidz',
        value: tahfidzPercentage,
        fill: '#115E59',
      },
    ],
    [tahfidzPercentage]
  );

  const hafalanSummary = useMemo(() => {
    let lancar = 0;
    let kurang = 0;
    let ulang = 0;
    let totalAyat = 0;
    hafalanList.forEach((h) => {
      if (h.status === 'lancar') lancar++;
      else if (h.status === 'kurang') kurang++;
      else ulang++;
      totalAyat += Math.max(1, h.ayat_sampai - h.ayat_dari + 1);
    });
    return { lancar, kurang, ulang, totalAyat };
  }, [hafalanList]);

  const handleAddSetoran = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSetoran(true);
    const res = await addHafalanSetoran({
      surah,
      ayat_dari: ayatDari,
      ayat_sampai: ayatSampai,
      juz,
      status: statusSetoran,
      penyimak_nama: penyimakNama,
      catatan: catatanSetoran,
    });
    setSavingSetoran(false);
    if (res.ok) {
      setCatatanSetoran('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-24 rounded-2xl bg-white border border-slate-200/70" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 h-80 rounded-2xl bg-white border border-slate-200/70" />
          <div className="lg:col-span-4 h-80 rounded-2xl bg-white border border-slate-200/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Section Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Rapor Digital &amp; Mutabaah Santri</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            Performance Hasil Belajar, Tahfidz &amp; Evaluasi Adab
          </h2>
        </div>

        <div className="inline-flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('akademik')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'akademik'
                ? 'bg-[#115E59] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik &amp; Riwayat Nilai</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hafalan')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hafalan'
                ? 'bg-[#115E59] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Setoran Hafalan ({hafalanList.length})</span>
          </button>
        </div>
      </div>

      {/* ─── ROW 1: RECHARTS BAR CHART NILAI PER MAPEL + RADIAL PROGRESS TAHFIDZ ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Cols: BarChart Nilai per Mata Pelajaran */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                Visualisasi Capaian Akademik &amp; Kepesantrenan
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Grafik Nilai per Mata Pelajaran (Semester Ganjil 2026/2027)
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[#115E59] text-xs font-extrabold">
              KKM Standar: 78
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="mapel"
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  angle={-15}
                  textAnchor="end"
                  height={48}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                  formatter={(val: any) => [`${val} / 100`, 'Nilai Santri']}
                />
                <Bar dataKey="nilai" radius={[10, 10, 0, 0]} maxBarSize={44}>
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.nilai >= 93 ? '#115E59' : entry.nilai >= 88 ? '#0d9488' : '#d97706'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Radial Progress Tahfidz 30 Juz */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
              Target Takhassus Al-Qur&apos;an
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Progress Tahfidz Radial
            </h3>
          </div>

          <div className="relative h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="95%"
                barSize={18}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: '#f1f5f9' }}
                  dataKey="value"
                  cornerRadius={12}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <Award className="w-6 h-6 text-amber-500 mb-0.5" />
              <div className="text-2xl font-black text-[#115E59]">
                {profile.hafalan_juz} <span className="text-sm font-bold text-slate-500">/ 30 Juz</span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700">
                {tahfidzPercentage}% Tercapai
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
              <div className="text-base font-black text-emerald-800">{hafalanSummary.lancar}</div>
              <div className="text-[10px] font-bold text-emerald-700">Lancar</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/70">
              <div className="text-base font-black text-amber-800">{hafalanSummary.kurang}</div>
              <div className="text-[10px] font-bold text-amber-700">Kurang</div>
            </div>
            <div className="p-2 rounded-xl bg-sky-50/80 border border-sky-200/70">
              <div className="text-base font-black text-sky-800">{hafalanSummary.totalAyat}</div>
              <div className="text-[10px] font-bold text-sky-700">Total Ayat</div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'akademik' ? (
        <>
          {/* ─── ROW 2: CATATAN PEMBINAAN DARI MUSYRIF & DEWAN ASATIDZ ─── */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Evaluasi Karakter, Adab &amp; Akademik
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Catatan Pembinaan dari Musyrif &amp; Guru Pengampu
                </h3>
              </div>
              <MessageSquareQuote className="w-5 h-5 text-[#115E59]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {combinedPerformance
                .filter((p) => p.catatan_musyrif)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#115E59] text-[10.5px] font-extrabold uppercase">
                          {item.jenis}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {item.mapel}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200 text-[#115E59] font-black text-xs">
                        Nilai: {item.nilai} ({item.predikat})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{item.catatan_musyrif}&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>Semester {item.semester}</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* ─── ROW 3: TABEL RIWAYAT NILAI LENGKAP ─── */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Transkrip Nilai Santri
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Tabel Riwayat Nilai Lengkap
                </h3>
              </div>

              {/* Filter Jenis Penilaian */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: 'semua', label: 'Semua' },
                    { id: 'harian', label: 'Harian' },
                    { id: 'uts', label: 'UTS' },
                    { id: 'uas', label: 'UAS' },
                    { id: 'tahfidz', label: 'Tahfidz' },
                    { id: 'adab', label: 'Adab' },
                  ] as const
                ).map((jf) => (
                  <button
                    key={jf.id}
                    type="button"
                    onClick={() => setJenisFilter(jf.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      jenisFilter === jf.id
                        ? 'bg-[#115E59] text-white border-[#115E59]'
                        : 'bg-[#FAF8F5] text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {jf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[720px]">
                <thead>
                  <tr className="bg-[#FAF8F5] text-slate-600 border-b border-slate-200">
                    <th className="py-3 px-3.5 font-extrabold">No.</th>
                    <th className="py-3 px-3.5 font-extrabold">Mata Pelajaran / Bidang</th>
                    <th className="py-3 px-3.5 font-extrabold">Jenis Evaluasi</th>
                    <th className="py-3 px-3.5 font-extrabold text-center">Nilai Angka</th>
                    <th className="py-3 px-3.5 font-extrabold text-center">Predikat</th>
                    <th className="py-3 px-3.5 font-extrabold">Semester</th>
                    <th className="py-3 px-3.5 font-extrabold">Catatan Musyrif / Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPerformance.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-extrabold text-slate-900">{row.mapel}</td>
                      <td className="py-3 px-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                          {row.jenis}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center font-black text-base text-[#115E59]">
                        {row.nilai}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs">
                          {row.predikat}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-xs text-slate-500 font-medium">
                        {row.semester}
                      </td>
                      <td className="py-3 px-3.5 text-xs text-slate-600 max-w-md">
                        {row.catatan_musyrif || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        /* ─── TAB 2: SETORAN HAFALAN & FORM CATAT SETORAN ─── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Form Input Setoran Hafalan */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                Input Buku Mutabaah Tahfidz
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Catat Setoran Hafalan Baru
              </h3>
            </div>

            <form onSubmit={handleAddSetoran} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Surah Al-Qur&apos;an
                  </label>
                  <input
                    type="text"
                    required
                    value={surah}
                    onChange={(e) => setSurah(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Juz (1–30)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={juz}
                    onChange={(e) => setJuz(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ayat Mulai
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={ayatDari}
                    onChange={(e) => setAyatDari(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ayat Selesai
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={ayatSampai}
                    onChange={(e) => setAyatSampai(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evaluasi Kelancaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'lancar', label: 'Lancar', cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                      { id: 'kurang', label: 'Kurang', cls: 'border-amber-500 bg-amber-50 text-amber-900' },
                      { id: 'ulang', label: 'Ulang', cls: 'border-rose-500 bg-rose-50 text-rose-900' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStatusSetoran(st.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold cursor-pointer ${
                        statusSetoran === st.id
                          ? st.cls
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ustadz / Musyrif Penyimak
                </label>
                <input
                  type="text"
                  value={penyimakNama}
                  onChange={(e) => setPenyimakNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tajwid / Murojaah
                </label>
                <textarea
                  rows={2}
                  value={catatanSetoran}
                  onChange={(e) => setCatatanSetoran(e.target.value)}
                  placeholder="Catatan makhraj, panjang pendek mad, atau ayat yang perlu diulang..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#115E59]"
                />
              </div>

              <button
                type="submit"
                disabled={savingSetoran}
                className="w-full py-2.5 px-4 rounded-xl bg-[#115E59] hover:bg-emerald-900 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>{savingSetoran ? 'Menyimpan Setoran…' : 'Simpan ke Riwayat Setoran'}</span>
              </button>
            </form>
          </div>

          {/* Right 7 Cols: Tabel Riwayat Setoran Hafalan */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#115E59]">
                  Log Setoran Tahfidz Al-Qur&apos;an
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Riwayat Setoran Hafalan Santri ({hafalanList.length} Entri)
                </h3>
              </div>
              <BookOpenCheck className="w-5 h-5 text-[#115E59]" />
            </div>

            <div className="space-y-3">
              {hafalanList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#115E59] text-white text-xs font-extrabold">
                        Juz {item.juz}
                      </span>
                      <h4 className="text-sm font-black text-slate-900">
                        Surah {item.surah} • Ayat {item.ayat_dari} s/d {item.ayat_sampai}
                      </h4>
                    </div>
                    {item.catatan && (
                      <p className="text-xs text-slate-600 leading-relaxed">{item.catatan}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#115E59]" />
                        <span>Penyimak: {item.penyimak_nama || 'Ustadz Fadly, S.Pd.'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 ${
                      item.status === 'lancar'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : item.status === 'kurang'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SantriPerformancePage;

