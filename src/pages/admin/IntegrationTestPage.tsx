import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Database,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  FileText,
  Search,
  Filter,
  Activity,
  Layers,
  Sparkles,
  Server,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import {
  runFullSupabaseIntegrationTest,
  FullIntegrationTestReport,
  TableTestResult,
  BucketTestResult
} from '../../utils/supabaseIntegrationTest';

export const IntegrationTestPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [report, setReport] = useState<FullIntegrationTestReport | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUCCESS' | 'EMPTY' | 'ERROR'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Trigger test on mount if not yet run
  useEffect(() => {
    handleRunTest();
  }, []);

  const handleRunTest = async () => {
    setIsRunning(true);
    setProgressPercent(0);
    setProgressMsg('Menginisialisasi koneksi Supabase...');

    try {
      const res = await runFullSupabaseIntegrationTest((curr, total, msg) => {
        setProgressPercent(Math.round((curr / total) * 100));
        setProgressMsg(msg);
      });
      setReport(res);
    } catch (err: any) {
      console.error('Integration test failed:', err);
    } finally {
      setIsRunning(false);
      setProgressPercent(100);
      setProgressMsg('Pengujian integrasi selesai.');
    }
  };

  // Categories
  const categories = useMemo(() => {
    if (!report) return ['ALL'];
    const cats = new Set<string>();
    report.tables.forEach((t) => cats.add(t.category));
    return ['ALL', ...Array.from(cats)];
  }, [report]);

  // Filtered Tables
  const filteredTables = useMemo(() => {
    if (!report) return [];
    return report.tables.filter((t) => {
      const matchesSearch =
        t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
      const matchesCat = activeCategory === 'ALL' || t.category === activeCategory;
      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [report, searchQuery, filterStatus, activeCategory]);

  // Download JSON Report
  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppjm-supabase-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Markdown Report
  const handleExportMarkdown = () => {
    if (!report) return;
    let md = `# Laporan Hasil Uji Integrasi Supabase PPJM\n\n`;
    md += `- Tanggal Pengujian: ${report.timestamp}\n`;
    md += `- Supabase Endpoint: ${report.supabaseUrl}\n`;
    md += `- Status Koneksi: ${report.connectionSuccess ? 'ONLINE (SUCCESS)' : 'OFFLINE (ERROR)'}\n`;
    md += `- Health Score: ${report.summary.healthScorePercent}%\n`;
    md += `- Total Tabel: ${report.summary.totalTables} (Aktif: ${report.summary.tablesPassed}, Kosong: ${report.summary.tablesEmpty}, Gagal: ${report.summary.tablesFailed})\n`;
    md += `- Total Buckets: ${report.summary.totalBuckets} (Aktif: ${report.summary.bucketsPassed})\n\n`;

    md += `## Tabel Database (34 Tabel Wajib)\n\n`;
    md += `| Nama Tabel | Kategori | Status | Baris Data | Latency |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    report.tables.forEach((t) => {
      md += `| \`${t.tableName}\` | ${t.category} | **${t.status}** | ${t.rowCount} | ${t.latencyMs}ms |\n`;
    });

    md += `\n## Storage Buckets (9 Buckets)\n\n`;
    md += `| Nama Bucket | Status | File Count | Latency |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    report.buckets.forEach((b) => {
      md += `| \`${b.bucketId}\` | **${b.status}** | ${b.fileCount} | ${b.latencyMs}ms |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SUPABASE_INTEGRATION_AUDIT_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,81,0.2),transparent_70%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-[#C8A951]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>QA Engineer & System Architect Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Audit & Uji Integrasi Supabase 100%
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              Memverifikasi koneksi riil, skema 34 tabel wajib, 9 bucket storage, kebijakan RLS, serta menghilangkan mock data untuk kesiapan produksi Pondok Pesantren Jauharul Maknuun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-5 py-3 rounded-2xl bg-[#C8A951] hover:bg-amber-500 text-[#0A2116] font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Menguji Sistem...' : 'Jalankan Pengujian Ulang'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              disabled={!report || isRunning}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Ekspor Laporan JSON"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              disabled={!report || isRunning}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Ekspor Laporan Markdown"
            >
              <FileText className="w-4 h-4" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* Progress bar during testing */}
        {isRunning && (
          <div className="mt-6 space-y-2 relative z-10">
            <div className="flex justify-between text-xs text-emerald-200">
              <span className="font-mono">{progressMsg}</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-[#C8A951] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Stat Cards Summary */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Health Score */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>Health Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                {report.summary.healthScorePercent}%
              </span>
              <span className="text-xs font-bold text-emerald-600">Production Ready</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {report.summary.tablesPassed + report.summary.tablesEmpty} tabel & {report.summary.bucketsPassed} bucket operasional
            </p>
          </div>

          {/* Database Tables */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>34 Tabel Wajib</span>
              <Database className="w-4 h-4 text-[#0E7A4C]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">
                {report.summary.totalTables}
              </span>
              <span className="text-xs font-bold text-zinc-500">Tabel PostgreSQL</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              <span className="text-emerald-600 font-bold">{report.summary.tablesPassed} Ada Data</span> •{' '}
              <span className="text-amber-600 font-bold">{report.summary.tablesEmpty} Kosong/Siap</span>
            </p>
          </div>

          {/* Storage Buckets */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>9 Storage Buckets</span>
              <HardDrive className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-sky-600">
                {report.summary.bucketsPassed} / {report.summary.totalBuckets}
              </span>
              <span className="text-xs font-bold text-sky-600">Aktif</span>
            </div>
            <p className="text-[11px] text-zinc-400">Avatars, CMS, Foto, Sertifikat, Audio</p>
          </div>

          {/* Latency */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>Total Latency</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">
                {report.summary.totalLatencyMs}
              </span>
              <span className="text-xs font-bold text-zinc-400">ms</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Koneksi Awal: {report.connectionLatencyMs}ms (ap-south-1)
            </p>
          </div>
        </div>
      )}

      {/* 3. Storage Buckets Grid */}
      {report && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#0E7A4C]" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Status 9 Storage Buckets Supabase
              </h3>
            </div>
            <span className="text-xs text-zinc-500">RLS Public Read + Auth Write</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.buckets.map((b) => (
              <div
                key={b.bucketId}
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {b.bucketId}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {b.fileCount} file terdata • {b.latencyMs}ms
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari nama tabel (contoh: sliders, berita, hafidz, stem)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E7A4C]"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['ALL', 'SUCCESS', 'EMPTY', 'ERROR'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#0E7A4C] text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {st === 'ALL' && 'Semua Tabel'}
                {st === 'SUCCESS' && 'Ada Data'}
                {st === 'EMPTY' && 'Kosong/Siap'}
                {st === 'ERROR' && 'Gagal'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C8A951] text-[#0A2116]'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Database Tables List */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0E7A4C]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
              Daftar Tabel Database ({filteredTables.length} / {report?.summary.totalTables || 34})
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">PostgreSQL 17 • ap-south-1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Nama Tabel</th>
                <th className="py-3 px-4">Kategori Modul</th>
                <th className="py-3 px-4">Status Integrasi</th>
                <th className="py-3 px-4 text-center">Baris Data</th>
                <th className="py-3 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-sans">
              {filteredTables.map((tbl) => (
                <tr key={tbl.tableName} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {tbl.tableName}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium">
                      {tbl.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {tbl.status === 'SUCCESS' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>TERHUBUNG (DATA OK)</span>
                      </span>
                    )}
                    {tbl.status === 'EMPTY' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>TABEL SIAP (0 ROW)</span>
                      </span>
                    )}
                    {tbl.status === 'ERROR' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[11px] font-bold" title={tbl.errorMessage}>
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>ERROR ({tbl.errorMessage?.substring(0, 25)}...)</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-zinc-800 dark:text-zinc-200">
                    {tbl.rowCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-zinc-500">
                    {tbl.latencyMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestPage;

