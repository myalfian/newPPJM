/**
 * DataFlowAuditPage.tsx
 * Deep Audit & Diagnostic Center for Supabase Data Flow, RLS & Realtime
 * Pondok Pesantren Jauharul Maknuun - https://ppjauharulmaknuun.sch.id
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Copy,
  Database,
  Layers,
  Lock,
  Zap,
  HelpCircle,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';
import { deepAuditDataFlow, DeepAuditReport, AuditCheckItem } from '../../utils/deepAuditDataFlow';

export const DataFlowAuditPage: React.FC = () => {
  const [report, setReport] = useState<DeepAuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await deepAuditDataFlow();
      setReport(res);
    } catch (err) {
      console.error('Audit error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const handleCopySqlFix = () => {
    const sql = `-- FIX RLS POLICIES FOR PUBLIC READ & ADMIN WRITE
CREATE POLICY "Public can read visible cms_sections" ON public.cms_sections FOR SELECT USING (visible = true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read active sliders" ON public.sliders FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active quick_menus" ON public.quick_menus FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published berita" ON public.berita FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active facilities" ON public.facilities FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read prestasi" ON public.prestasi FOR SELECT USING (true);
CREATE POLICY "Public can read active ekskul" ON public.ekskul FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read osis_structure" ON public.osis_structure FOR SELECT USING (true);
CREATE POLICY "Public can read agendas" ON public.agendas FOR SELECT USING (true);
CREATE POLICY "Public can read galeri_foto" ON public.galeri_foto FOR SELECT USING (true);
CREATE POLICY "Public can read kontak_medsos" ON public.kontak_medsos FOR SELECT USING (is_active = true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PPJM_DataFlow_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredChecks = report?.checks.filter((item: AuditCheckItem) => {
    const matchCat = filterCategory === 'ALL' || item.category === filterCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2116] via-[#0E7A4C] to-[#0A2116] p-6 sm:p-8 text-white shadow-xl border border-[#C8A951]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A951]/20 border border-[#C8A951]/40 text-[#C8A951] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Data Flow &amp; RLS Diagnostic Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Audit Alur Data &amp; Sinkronisasi Supabase
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Memeriksa secara otomatis apakah pembaruan konten dari editor admin berhasil tersimpan ke Supabase Cloud, tidak terblokir oleh Row Level Security (RLS), dan tersinkronisasi instan ke website publik tanpa kembali ke data seed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runAudit}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition flex items-center gap-2 cursor-pointer text-white shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Memeriksa...' : 'Uji Ulang Alur Data'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopySqlFix}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition flex items-center gap-2 cursor-pointer text-white shadow-xs"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin SQL Fix RLS'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              disabled={!report}
              className="px-4 py-2.5 rounded-xl bg-[#C8A951] hover:bg-[#e0be5e] text-[#0A2116] text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scorecard Overview */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Skor Kesehatan Alur Data</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-[#0E7A4C] dark:text-emerald-400 font-mono">
                  {report.summary.score}
                </span>
                <span className="text-xs font-bold text-zinc-400">/ 100</span>
              </div>
              <p className="text-[11px] font-bold text-emerald-600 mt-1">
                {report.summary.fail === 0 ? '✓ Sinkronisasi Cloud Optimal' : '⚠️ Terdeteksi Kendala'}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#0E7A4C]">
              <Database className="w-7 h-7" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pemeriksaan Lulus</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-emerald-600 font-mono">{report.summary.pass}</span>
              <span className="text-xs font-bold text-zinc-400">/ {report.summary.total}</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">RLS publik &amp; koneksi aktif normal</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Perhatian / Peringatan</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-amber-500 font-mono">{report.summary.warnings}</span>
              <span className="text-xs font-bold text-zinc-400">Item</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Tabel kosong atau mode fallback aktif</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gagal / Terblokir RLS</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-rose-600 font-mono">{report.summary.fail}</span>
              <span className="text-xs font-bold text-zinc-400">Item</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              {report.summary.fail === 0 ? 'Nol insiden pemblokiran RLS' : 'Membutuhkan perbaikan policy'}
            </p>
          </div>
        </div>
      )}

      {/* 3. Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari item pengujian alur data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
          {['ALL', 'CONNECTION', 'RLS_READ', 'WRITE_TEST', 'HARDCODE', 'REALTIME'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Detailed Checklist Table */}
      <div className="space-y-3">
        {filteredChecks?.map((item: AuditCheckItem) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 transition"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="pt-0.5 shrink-0">
                {item.status === 'PASS' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {item.status === 'WARN' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {item.status === 'FAIL' && <XCircle className="w-5 h-5 text-rose-600" />}
                {item.status === 'SKIP' && <HelpCircle className="w-5 h-5 text-zinc-400" />}
                {item.status === 'MANUAL' && <Layers className="w-5 h-5 text-blue-500" />}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      item.status === 'PASS'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : item.status === 'WARN'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : item.status === 'FAIL'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">{item.name}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.details}</p>

                {item.hint && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold pt-1">
                    💡 Petunjuk Solusi: {item.hint}
                  </p>
                )}

                {item.dataSnippet && (
                  <div className="pt-2">
                    <pre className="text-[10px] font-mono p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 overflow-x-auto max-w-2xl">
                      {JSON.stringify(item.dataSnippet, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {item.durationMs !== undefined && (
              <span className="text-[10px] font-mono text-zinc-400 self-end sm:self-center shrink-0">
                {item.durationMs}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataFlowAuditPage;
