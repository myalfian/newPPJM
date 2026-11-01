import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Radio, 
  Download, 
  Copy, 
  FileText,
  Search,
  Server
} from 'lucide-react';
import {
  runComprehensiveDiagnostic,
  generateFixRlsSql,
  ComprehensiveDiagnosticReport,
  ConnectionTestResult,
  BucketDiagnosticResult
} from '../../utils/componentTableConnectionTest';

export const ComponentTableCheckPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>('');
  const [report, setReport] = useState<ComprehensiveDiagnosticReport | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'CONNECTED' | 'PARTIAL' | 'BROKEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const runTest = async () => {
    setLoading(true);
    setProgress(0);
    setProgressText('Memulai inisialisasi koneksi...');
    try {
      const res = await runComprehensiveDiagnostic((pct, text) => {
        setProgress(pct);
        setProgressText(text);
      });
      setReport(res);
    } catch (err) {
      console.error('Error running diagnostic test:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const filteredComponents = report
    ? report.components.filter((c) => {
        const matchesFilter =
          filter === 'ALL' ||
          (filter === 'CONNECTED' && c.overallStatus === 'CONNECTED') ||
          (filter === 'PARTIAL' && c.overallStatus === 'PARTIAL') ||
          (filter === 'BROKEN' && c.overallStatus === 'BROKEN');

        const matchesSearch =
          c.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
      })
    : [];

  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppjm-component-connection-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    let md = `# Laporan Diagnostik Koneksi Komponen & Tabel Supabase PPJM\n`;
    md += `*Waktu Pengujian:* ${new Date(report.timestamp).toLocaleString('id-ID')}\n`;
    md += `*Skor Integritas Koneksi:* **${report.connectionScorePercent}%**\n\n`;
    md += `## Ringkasan Eksekutif\n`;
    md += `- Total Komponen Terdaftar: ${report.totalComponents}\n`;
    md += `- Terkoneksi Penuh: ${report.connectedCount}\n`;
    md += `- Parsial (Data Kosong): ${report.partialCount}\n`;
    md += `- Terputus / Gagal: ${report.brokenCount}\n`;
    md += `- Storage Buckets Online: ${report.summary.bucketsOnline} / ${report.summary.totalBuckets}\n`;
    md += `- Rata-rata Latensi: ${report.summary.avgLatencyMs} ms\n\n`;
    md += `## Detail Komponen & Tabel\n\n`;
    md += `| Komponen | Tabel | Baris | Latensi | RLS Publik | Status |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const c of report.components) {
      md += `| ${c.componentName} | \`${c.tableName}\` | ${c.rowCount} | ${c.readLatencyMs}ms | ${c.rlsReadPass ? 'PASS' : 'BLOCKED'} | **${c.overallStatus}** |\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppjm-component-connection-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatedSql = report ? generateFixRlsSql(report.components.filter(c => c.overallStatus === 'BROKEN').map(c => c.tableName)) : '';

  const handleCopySql = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Pemeriksaan Koneksi Komponen & Tabel Supabase
              </h1>
              <p className="text-sm text-slate-500">
                Audit real-time keterhubungan 34 tabel & 9 storage bucket tanpa mock data
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runTest}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Menguji...' : 'Jalankan Tes Diagnostik'}
          </button>
          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition"
          >
            <FileText className="w-4 h-4" />
            Script Perbaikan RLS
          </button>
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              onClick={handleExportJson}
              disabled={!report}
              className="px-3 py-1.5 hover:bg-white text-slate-600 rounded-lg text-xs font-semibold transition"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportMarkdown}
              disabled={!report}
              className="px-3 py-1.5 hover:bg-white text-slate-600 rounded-lg text-xs font-semibold transition"
            >
              Export MD
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar (Visible while testing) */}
      {loading && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between text-sm font-medium text-emerald-900">
            <span>{progressText}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-emerald-200/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {report.connectionScorePercent}%
              </div>
              <div className="text-xs font-medium text-slate-500">Skor Integritas Koneksi</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {report.connectedCount} / {report.totalComponents}
              </div>
              <div className="text-xs font-medium text-slate-500">Komponen Terhubung Aktif</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {report.summary.bucketsOnline} / {report.summary.totalBuckets}
              </div>
              <div className="text-xs font-medium text-slate-500">Storage Buckets Siap</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {report.summary.avgLatencyMs} ms
              </div>
              <div className="text-xs font-medium text-slate-500">Rata-rata Respon Supabase</div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Buckets Probe Overview */}
      {report && report.buckets.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-600" />
              Status 9 Storage Buckets Supabase PPJM
            </h2>
            <span className="text-xs text-slate-500 font-medium">Public RLS Verified</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {report.buckets.map((b) => (
              <div
                key={b.bucketId}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-700 truncate" title={b.bucketId}>
                    {b.bucketId}
                  </span>
                  {b.status === 'PASS' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{b.itemCount} files</span>
                  <span>{b.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Controls & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'ALL'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Semua ({report ? report.totalComponents : 0})
            </button>
            <button
              onClick={() => setFilter('CONNECTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'CONNECTED'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Terkoneksi ({report ? report.connectedCount : 0})
            </button>
            <button
              onClick={() => setFilter('PARTIAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'PARTIAL'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Parsial ({report ? report.partialCount : 0})
            </button>
            <button
              onClick={() => setFilter('BROKEN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'BROKEN'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Terputus ({report ? report.brokenCount : 0})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari komponen atau tabel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Diagnostic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Komponen & Modul</th>
                <th className="px-4 py-3.5">Tabel Database</th>
                <th className="px-4 py-3.5">Total Baris</th>
                <th className="px-4 py-3.5">Public Read (RLS)</th>
                <th className="px-4 py-3.5">Storage Bucket</th>
                <th className="px-4 py-3.5">Realtime Channel</th>
                <th className="px-4 py-3.5">Latensi</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComponents.length > 0 ? (
                filteredComponents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div>{item.componentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs" title={item.filePath}>
                        {item.filePath}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 font-mono text-[11px] bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {item.tableName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">
                      {item.rowCount} baris
                    </td>
                    <td className="px-4 py-3.5">
                      {item.rlsReadPass ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Anon Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Blocked (42501)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {item.storageBucket ? (
                        <span className="px-2 py-0.5 font-mono text-[10px] bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                          {item.storageBucket}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {item.realtimeConfigured ? (
                        <span className="inline-flex items-center gap-1 text-indigo-600">
                          <Radio className="w-3.5 h-3.5 animate-pulse" /> Terdaftar
                        </span>
                      ) : (
                        <span className="text-slate-400">Manual</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">
                      {item.readLatencyMs}ms
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {item.overallStatus === 'CONNECTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> CONNECTED
                        </span>
                      )}
                      {item.overallStatus === 'PARTIAL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> PARTIAL
                        </span>
                      )}
                      {item.overallStatus === 'BROKEN' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" /> BROKEN
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Tidak ada komponen yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Script Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Script SQL Pemulihan Hak Akses RLS Supabase
              </h3>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Jalankan script ini di Supabase SQL Editor jika terjadi error 42501 (Permission Denied) pada akses anonim.
            </p>
            <div className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-xl max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
              <pre>{generatedSql}</pre>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
              >
                <Copy className="w-4 h-4" />
                {copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Script SQL'}
              </button>
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

