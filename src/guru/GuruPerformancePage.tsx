import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGuru } from './GuruContext';
import { SantriProfile } from '../santri/SantriContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  Search,
  TrendingUp,
  BookOpen,
  Plus,
  Upload,
  Printer,
  X,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';

const KELAS_OPTIONS = [
  'Semua',
  'VII-A Tahfidz',
  'VII-B Sains STEM',
  'VIII-A Tahfidz',
  'VIII-B Sains STEM',
  'IX-A Tahfidz',
  'IX-B Sains STEM',
];

const MAPEL_LIST = [
  "Tahfidzul Qur'an",
  'IPA & Robotika STEM',
  'Matematika Olimpiade',
  'Fiqih Madrasah Diniyah',
  'Bahasa Arab (Muhadasah)',
  'Bahasa Inggris',
  'Adab & Akhlak Pesantren',
];

function computePredikat(nilai: number): string {
  if (nilai >= 90) return 'A (Mumtaz)';
  if (nilai >= 80) return 'B+ (Jayyid Jiddan)';
  if (nilai >= 70) return 'B (Jayyid)';
  return 'C (Maqbul)';
}

function escapeHtml(raw?: string | number | null): string {
  return String(raw ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const GuruPerformancePage: React.FC = () => {
  const { kelas } = useParams<{ kelas: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'performance'; // 'performance' | 'santri' | 'hafalan'

  const {
    guruProfile,
    santriList,
    performanceList,
    hafalanList,
    addPerformanceRecord,
    bulkInsertPerformance,
    addSetoranByMusyrif,
    showToast,
  } = useGuru();

  const decodedKelas = decodeURIComponent(kelas || 'VIII-A Tahfidz');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSantri, setSelectedSantri] = useState<SantriProfile | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'input-nilai' | 'input-hafalan'>('overview');

  // Form Input Nilai Baru
  const [newMapel, setNewMapel] = useState(MAPEL_LIST[0]);
  const [newJenis, setNewJenis] = useState<'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab'>('harian');
  const [newNilai, setNewNilai] = useState<number>(92);
  const [newCatatan, setNewCatatan] = useState('');
  const [savingNilai, setSavingNilai] = useState(false);

  // Form Input Setoran Hafalan
  const [surah, setSurah] = useState('Al-Mulk');
  const [juz, setJuz] = useState(29);
  const [ayatDari, setAyatDari] = useState(1);
  const [ayatSampai, setAyatSampai] = useState(15);
  const [statusHafalan, setStatusHafalan] = useState<'lancar' | 'kurang' | 'ulang'>('lancar');
  const [savingHafalan, setSavingHafalan] = useState(false);

  // Bulk CSV Modal
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState(
    `202608001,IPA & Robotika STEM,harian,95,Sangat aktif dalam praktikum sensor ultrasonik\n202608002,Tahfidzul Qur'an,tahfidz,98,Mutqin Juz 29 tanpa koreksi\n202608003,Bahasa Inggris,uts,91,Story telling sangat ekspresif`
  );
  const [uploadingCsv, setUploadingCsv] = useState(false);

  // Filter santri by selected class & search query
  const filteredSantri = useMemo(() => {
    return santriList.filter((s) => {
      const matchKelas =
        decodedKelas === 'Semua' ||
        (s.kelas || '').toLowerCase() === decodedKelas.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        s.full_name.toLowerCase().includes(q) ||
        (s.nis || '').toLowerCase().includes(q) ||
        (s.kamar_asrama || '').toLowerCase().includes(q);
      return matchKelas && matchSearch;
    });
  }, [santriList, decodedKelas, searchQuery]);

  // Compute per-student performance summary
  const santriRows = useMemo(() => {
    return filteredSantri.map((s) => {
      const records = performanceList.filter((p) => p.santri_id === s.id);
      const setoran = hafalanList.filter((h) => h.santri_id === s.id);
      const avg =
        records.length > 0
          ? Math.round(records.reduce((acc, r) => acc + Number(r.nilai || 0), 0) / records.length)
          : 0;
      return {
        santri: s,
        records,
        setoran,
        avg,
        predikat: avg > 0 ? computePredikat(avg) : '-',
      };
    });
  }, [filteredSantri, performanceList, hafalanList]);

  // Selected santri detailed data
  const selectedSantriDetail = useMemo(() => {
    if (!selectedSantri) return null;
    const records = performanceList.filter((p) => p.santri_id === selectedSantri.id);
    const setoran = hafalanList.filter((h) => h.santri_id === selectedSantri.id);
    const avg =
      records.length > 0
        ? Math.round(records.reduce((acc, r) => acc + Number(r.nilai || 0), 0) / records.length)
        : 0;
    const chartData = records.slice(0, 8).map((r) => ({
      name: r.mapel.length > 16 ? r.mapel.slice(0, 14) + '…' : r.mapel,
      fullMapel: r.mapel,
      nilai: r.nilai,
      jenis: r.jenis.toUpperCase(),
    }));
    return { records, setoran, avg, chartData };
  }, [selectedSantri, performanceList, hafalanList]);

  const handleSaveNilai = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) return;
    setSavingNilai(true);
    await addPerformanceRecord({
      santri_id: selectedSantri.id,
      mapel: newMapel,
      jenis: newJenis,
      nilai: Number(newNilai),
      predikat: computePredikat(Number(newNilai)),
      semester: 'Ganjil 2026/2027',
      catatan_musyrif: newCatatan.trim() || 'Menunjukkan perkembangan akademik dan adab yang sangat baik.',
    });
    setSavingNilai(false);
    setNewCatatan('');
    setActiveModalTab('overview');
  };

  const handleSaveHafalan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) return;
    setSavingHafalan(true);
    await addSetoranByMusyrif({
      santri_id: selectedSantri.id,
      surah,
      juz: Number(juz),
      ayat_dari: Number(ayatDari),
      ayat_sampai: Number(ayatSampai),
      status: statusHafalan,
    });
    setSavingHafalan(false);
    setActiveModalTab('overview');
  };

  // Parse CSV lines for preview
  const parsedCsvRows = useMemo(() => {
    return csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        const [identifier = '', mapel = 'Tahfidzul Qur\'an', jenisRaw = 'harian', nilaiRaw = '90', catatan = ''] = parts;
        const matchedSantri =
          santriList.find(
            (s) =>
              (s.nis || '').toLowerCase() === identifier.toLowerCase() ||
              s.full_name.toLowerCase().includes(identifier.toLowerCase())
          ) || santriList[0];
        const nilai = Math.max(0, Math.min(100, Number(nilaiRaw) || 88));
        const jenis = (['harian', 'uts', 'uas', 'tahfidz', 'adab'].includes(jenisRaw.toLowerCase())
          ? jenisRaw.toLowerCase()
          : 'harian') as 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';

        return {
          santri_id: matchedSantri?.id || '',
          santri_name: matchedSantri?.full_name || identifier,
          nis: matchedSantri?.nis || '-',
          mapel,
          jenis,
          nilai,
          predikat: computePredikat(nilai),
          catatan_musyrif: catatan || 'Evaluasi berkala Guru & Musyrif',
        };
      });
  }, [csvText, santriList]);

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCsvText(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const handleCommitCsv = async () => {
    if (parsedCsvRows.length === 0) return;
    setUploadingCsv(true);
    await bulkInsertPerformance(
      parsedCsvRows.map((r) => ({
        santri_id: r.santri_id,
        mapel: r.mapel,
        jenis: r.jenis,
        nilai: r.nilai,
        predikat: r.predikat,
        semester: 'Ganjil 2026/2027',
        catatan_musyrif: r.catatan_musyrif,
      }))
    );
    setUploadingCsv(false);
    setShowCsvModal(false);
  };

  const handlePrintRaporMini = (santri: SantriProfile) => {
    const records = performanceList.filter((p) => p.santri_id === santri.id);
    const setoran = hafalanList.filter((h) => h.santri_id === santri.id);
    const avg =
      records.length > 0
        ? Math.round(records.reduce((acc, r) => acc + Number(r.nilai || 0), 0) / records.length)
        : 0;

    const win = window.open('', '_blank', 'width=860,height=920');
    if (!win) {
      showToast('Pop-up Diblokir', 'Izinkan pop-up browser untuk mencetak PDF Rapor Mini.', 'error');
      return;
    }

    const rowsHtml = records
      .map(
        (r, i) => `
        <tr>
          <td style="padding:8px 10px;border:1px solid #d6d3d1;text-align:center;">${i + 1}</td>
          <td style="padding:8px 10px;border:1px solid #d6d3d1;font-weight:600;">${escapeHtml(r.mapel)}</td>
          <td style="padding:8px 10px;border:1px solid #d6d3d1;text-transform:uppercase;text-align:center;">${escapeHtml(r.jenis)}</td>
          <td style="padding:8px 10px;border:1px solid #d6d3d1;text-align:center;font-weight:700;color:#115E59;">${escapeHtml(r.nilai)}</td>
          <td style="padding:8px 10px;border:1px solid #d6d3d1;">${escapeHtml(r.predikat)}</td>
          <td style="padding:8px 10px;border:1px solid #d6d3d1;font-size:12px;">${escapeHtml(r.catatan_musyrif || '-')}</td>
        </tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Rapor Mini Santri - ${escapeHtml(santri.full_name)}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1c1917; margin: 32px; background: #fff; }
    .kop { border-bottom: 3px double #115E59; padding-bottom: 14px; margin-bottom: 20px; text-align: center; }
    .kop h1 { margin: 0; font-size: 18px; color: #115E59; text-transform: uppercase; letter-spacing: 0.5px; }
    .kop h2 { margin: 4px 0; font-size: 14px; font-weight: 700; }
    .kop p { margin: 2px 0; font-size: 11px; color: #57534e; }
    .bio { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; background: #FAF8F5; border: 1px solid #e7e5e4; padding: 14px 18px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    th { background: #115E59; color: #fff; padding: 9px 10px; border: 1px solid #115E59; text-align: left; }
    .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="kop">
    <h1>YAYASAN AL JAUHARU AL MAKNUUN LASEM GRESIK</h1>
    <h2>SMP PLUS JAUHARUL MAKNUUN ISLAMIC BOARDING SCHOOL</h2>
    <p>NPSN: 70045189 (Terakreditasi A) • Jl. Raya Dukun-Lasem RT 01 RW 01 Kec. Sidayu Kab. Gresik</p>
  </div>
  <h3 style="text-align:center;margin:0 0 16px 0;font-size:15px;text-transform:uppercase;">LAPORAN HASIL BELAJAR & TAHFIDZ (RAPOR MINI)</h3>
  <div class="bio">
    <div><strong>Nama Santri:</strong> ${escapeHtml(santri.full_name)}</div>
    <div><strong>Kelas / Angkatan:</strong> ${escapeHtml(santri.kelas)} (${escapeHtml(santri.angkatan)})</div>
    <div><strong>Nomor Induk (NIS):</strong> ${escapeHtml(santri.nis)}</div>
    <div><strong>Asrama / Kamar:</strong> ${escapeHtml(santri.kamar_asrama)}</div>
    <div><strong>Capaian Tahfidz:</strong> ${escapeHtml(santri.hafalan_juz)} Juz (${setoran.length} Setoran Tercatat)</div>
    <div><strong>Rata-Rata Akademik:</strong> ${avg} (${escapeHtml(computePredikat(avg))})</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:36px;text-align:center;">No</th>
        <th>Mata Pelajaran / Program</th>
        <th style="width:80px;text-align:center;">Jenis</th>
        <th style="width:65px;text-align:center;">Nilai</th>
        <th style="width:140px;">Predikat</th>
        <th>Catatan Guru / Musyrif</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="6" style="padding:16px;text-align:center;">Belum ada rincian nilai</td></tr>'}
    </tbody>
  </table>
  <div class="footer">
    <div>
      <p>Mengetahui,<br/>Wali Santri</p>
      <br/><br/><br/>
      <p><strong>(${escapeHtml(santri.wali_santri || '........................')})</strong></p>
    </div>
    <div style="text-align:right;">
      <p>Gresik, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Guru Pengampu / Musyrif</p>
      <br/><br/><br/>
      <p><strong>${escapeHtml(guruProfile.full_name)}</strong><br/><span style="font-size:11px;color:#57534e;">NIP. ${escapeHtml(guruProfile.nip || '-')}</span></p>
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 250); };</script>
</body>
</html>`;

    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#115E59] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <TrendingUp className="w-3.5 h-3.5" />
            Monitoring Akademik & Kesantrian
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            Performance & Evaluasi Hasil Belajar ({decodedKelas})
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Klik nama santri untuk melihat grafik perkembangan, menginput nilai baru, menyimak setoran hafalan, atau mencetak PDF Rapor Mini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 text-xs font-bold transition"
          >
            <Upload className="w-4 h-4 text-[#115E59]" />
            Bulk Input Nilai (CSV)
          </button>
          {santriRows[0] && (
            <button
              type="button"
              onClick={() => {
                setSelectedSantri(santriRows[0].santri);
                setActiveModalTab('input-nilai');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Input Nilai Santri
            </button>
          )}
        </div>
      </div>

      {/* Class Selector & View Mode Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Class Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {KELAS_OPTIONS.map((kls) => {
              const isSelected = decodedKelas.toLowerCase() === kls.toLowerCase();
              return (
                <button
                  key={kls}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/guru/performance/${encodeURIComponent(kls)}${
                        activeView !== 'performance' ? `?view=${activeView}` : ''
                      }`
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-[#115E59] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/75'
                  }`}
                >
                  {kls}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIS, atau asrama..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF8F5] text-xs text-stone-800 focus:outline-none focus:border-[#115E59] focus:bg-white"
            />
          </div>
        </div>

        {/* Sub-view Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === 'performance'
                ? 'bg-teal-50 text-[#115E59] border border-teal-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Rekap Nilai & Grafik Kelas
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ view: 'santri' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === 'santri'
                ? 'bg-teal-50 text-[#115E59] border border-teal-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Biodata & Wali Santri
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ view: 'hafalan' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === 'hafalan'
                ? 'bg-teal-50 text-[#115E59] border border-teal-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Buku Setoran Tahfidz ({hafalanList.length})
          </button>
        </div>
      </div>

      {/* Main Santri Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/80 bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4">Santri & NIS</th>
                <th className="py-3.5 px-4">Kelas & Asrama</th>
                {activeView === 'santri' ? (
                  <>
                    <th className="py-3.5 px-4">Wali Santri</th>
                    <th className="py-3.5 px-4">Angkatan</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-4">Capaian Tahfidz</th>
                    <th className="py-3.5 px-4">Rata-Rata Nilai</th>
                  </>
                )}
                <th className="py-3.5 px-4">Predikat</th>
                <th className="py-3.5 px-4 text-right">Aksi Evaluasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {santriRows.map(({ santri, records, setoran, avg, predikat }) => (
                <tr
                  key={santri.id}
                  onClick={() => {
                    setSelectedSantri(santri);
                    setActiveModalTab('overview');
                  }}
                  className="hover:bg-teal-50/40 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          santri.foto_url ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={santri.full_name}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{santri.full_name}</p>
                        <p className="text-xs text-stone-500">NIS: {santri.nis}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                      {santri.kelas}
                    </span>
                    <p className="text-xs text-stone-500 mt-1">{santri.kamar_asrama}</p>
                  </td>

                  {activeView === 'santri' ? (
                    <>
                      <td className="py-3.5 px-4 text-xs font-semibold text-stone-700">{santri.wali_santri}</td>
                      <td className="py-3.5 px-4 text-xs text-stone-600">{santri.angkatan}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-[#115E59]">
                          <BookOpen className="w-4 h-4" />
                          {santri.hafalan_juz} Juz
                        </div>
                        <p className="text-[11px] text-stone-400">{setoran.length} kali setoran</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-stone-900">{avg || '-'}</span>
                          <span className="text-xs text-stone-400">({records.length} mapel)</span>
                        </div>
                      </td>
                    </>
                  )}

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        avg >= 90
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : avg >= 80
                          ? 'bg-teal-50 text-[#115E59] border border-teal-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {predikat}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSantri(santri);
                          setActiveModalTab('overview');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#115E59] text-xs font-bold transition"
                      >
                        Detail & Grafik
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSantri(santri);
                          setActiveModalTab('input-nilai');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold transition"
                      >
                        + Nilai
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrintRaporMini(santri)}
                        className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                        title="Export PDF Rapor Mini"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Santri, Grafik Perkembangan, Input Nilai & Rapor Mini */}
      {selectedSantri && selectedSantriDetail && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-4xl w-full shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#FAF8F5] border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    selectedSantri.foto_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={selectedSantri.full_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                />
                <div>
                  <h2 className="text-lg font-bold text-stone-900">{selectedSantri.full_name}</h2>
                  <p className="text-xs text-stone-500">
                    NIS: {selectedSantri.nis} • Kelas: {selectedSantri.kelas} • Kamar: {selectedSantri.kamar_asrama}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#115E59] border border-teal-200">
                      Rata-Rata: {selectedSantriDetail.avg}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Tahfidz: {selectedSantri.hafalan_juz} Juz
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintRaporMini(selectedSantri)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-800 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-[#115E59]" />
                  Export PDF Rapor Mini
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSantri(null)}
                  className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 border-b border-stone-100 flex items-center gap-2 bg-white">
              <button
                type="button"
                onClick={() => setActiveModalTab('overview')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                  activeModalTab === 'overview'
                    ? 'border-[#115E59] text-[#115E59]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Grafik & Riwayat Nilai ({selectedSantriDetail.records.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('input-nilai')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                  activeModalTab === 'input-nilai'
                    ? 'border-[#115E59] text-[#115E59]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                + Input Nilai Baru
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('input-hafalan')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
                  activeModalTab === 'input-hafalan'
                    ? 'border-[#115E59] text-[#115E59]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                + Catat Setoran Hafalan
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {activeModalTab === 'overview' && (
                <>
                  {/* Recharts Grafik Perkembangan */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                      Grafik Nilai Mata Pelajaran & Tahfidz
                    </h3>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedSantriDetail.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#57534e' }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#57534e' }} />
                          <Tooltip />
                          <Bar dataKey="nilai" fill="#115E59" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tabel Rincian Nilai */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Daftar Nilai Akademik & Catatan Musyrif
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveModalTab('input-nilai')}
                        className="text-xs font-bold text-[#115E59] hover:underline"
                      >
                        + Tambah Nilai Baru
                      </button>
                    </div>
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-500 font-bold uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Mata Pelajaran</th>
                            <th className="py-2.5 px-3">Jenis</th>
                            <th className="py-2.5 px-3">Nilai</th>
                            <th className="py-2.5 px-3">Predikat</th>
                            <th className="py-2.5 px-3">Catatan Guru / Musyrif</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {selectedSantriDetail.records.map((r) => (
                            <tr key={r.id}>
                              <td className="py-2.5 px-3 font-bold text-stone-800">{r.mapel}</td>
                              <td className="py-2.5 px-3 uppercase text-stone-500">{r.jenis}</td>
                              <td className="py-2.5 px-3 font-extrabold text-[#115E59]">{r.nilai}</td>
                              <td className="py-2.5 px-3">{r.predikat}</td>
                              <td className="py-2.5 px-3 text-stone-600">{r.catatan_musyrif}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {activeModalTab === 'input-nilai' && (
                <form onSubmit={handleSaveNilai} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Mata Pelajaran</label>
                      <select
                        value={newMapel}
                        onChange={(e) => setNewMapel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold text-stone-800"
                      >
                        {MAPEL_LIST.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Jenis Evaluasi</label>
                      <select
                        value={newJenis}
                        onChange={(e) => setNewJenis(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold text-stone-800"
                      >
                        <option value="harian">Penilaian Harian</option>
                        <option value="uts">UTS (Ujian Tengah Semester)</option>
                        <option value="uas">UAS (Ujian Akhir Semester)</option>
                        <option value="tahfidz">Ujian Tahfidz Al-Qur'an</option>
                        <option value="adab">Evaluasi Adab & Akhlak Asrama</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Nilai Angka (0 - 100)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={newNilai}
                        onChange={(e) => setNewNilai(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-lg font-extrabold text-[#115E59]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Predikat Otomatis</label>
                      <input
                        type="text"
                        readOnly
                        value={computePredikat(Number(newNilai))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm font-bold text-stone-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Catatan Guru / Musyrif untuk Rapor Santri
                    </label>
                    <textarea
                      rows={3}
                      value={newCatatan}
                      onChange={(e) => setNewCatatan(e.target.value)}
                      placeholder="Contoh: Sangat aktif berdiskusi di kelas dan disiplin murojaah..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm text-stone-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('overview')}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingNilai}
                      className="px-5 py-2.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold shadow-xs"
                    >
                      {savingNilai ? 'Menyimpan...' : 'Simpan Nilai ke Database'}
                    </button>
                  </div>
                </form>
              )}

              {activeModalTab === 'input-hafalan' && (
                <form onSubmit={handleSaveHafalan} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Nama Surah</label>
                      <input
                        type="text"
                        value={surah}
                        onChange={(e) => setSurah(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Juz</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={juz}
                        onChange={(e) => setJuz(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Ayat Mulai</label>
                      <input
                        type="number"
                        min={1}
                        value={ayatDari}
                        onChange={(e) => setAyatDari(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Ayat Sampai</label>
                      <input
                        type="number"
                        min={1}
                        value={ayatSampai}
                        onChange={(e) => setAyatSampai(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Kualitas Setoran (Kelancaran & Tajwid)</label>
                    <div className="flex gap-2">
                      {(['lancar', 'kurang', 'ulang'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusHafalan(st)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                            statusHafalan === st
                              ? 'bg-[#115E59] text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={savingHafalan}
                      className="px-5 py-2.5 rounded-xl bg-[#115E59] text-white text-xs font-bold"
                    >
                      {savingHafalan ? 'Menyimpan...' : 'Simpan Setoran Tahfidz'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Bulk Input via CSV */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-3xl w-full shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-[#115E59]" />
                <div>
                  <h2 className="text-base font-bold text-stone-900">Bulk Input Nilai Santri via CSV</h2>
                  <p className="text-xs text-stone-500">
                    Format baris: <code>NIS_atau_Nama, Mata Pelajaran, Jenis (harian/uts/uas/tahfidz/adab), Nilai, Catatan</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="p-1.5 rounded-xl border border-stone-200 bg-white text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">Upload File .CSV atau Paste Data di Bawah:</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCsvFileUpload}
                  className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-[#115E59]"
                />
              </div>

              <textarea
                rows={4}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-200 bg-[#FAF8F5] font-mono text-xs text-stone-800"
              />

              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="bg-stone-50 px-3.5 py-2 text-[11px] font-bold text-stone-500 uppercase">
                  Preview Data Siap Simpan ({parsedCsvRows.length} Baris)
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-100 text-stone-500">
                    <tr>
                      <th className="py-2 px-3">Santri</th>
                      <th className="py-2 px-3">Mapel</th>
                      <th className="py-2 px-3">Jenis</th>
                      <th className="py-2 px-3">Nilai</th>
                      <th className="py-2 px-3">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {parsedCsvRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-semibold text-stone-800">
                          {row.santri_name} ({row.nis})
                        </td>
                        <td className="py-2 px-3">{row.mapel}</td>
                        <td className="py-2 px-3 uppercase">{row.jenis}</td>
                        <td className="py-2 px-3 font-bold text-[#115E59]">{row.nilai}</td>
                        <td className="py-2 px-3">{row.predikat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={uploadingCsv || parsedCsvRows.length === 0}
                  onClick={handleCommitCsv}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {uploadingCsv ? 'Mengimpor...' : `Simpan ${parsedCsvRows.length} Nilai ke Supabase`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
