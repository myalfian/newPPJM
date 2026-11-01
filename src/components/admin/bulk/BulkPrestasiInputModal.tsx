import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Trash2,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ClipboardPaste,
  HelpCircle,
  Table as TableIcon,
  ShieldAlert
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { invalidateCache } from '../../../lib/queryCache';
import { useAuth } from '../../../context/AuthContext';

export interface BulkPrestasiRow {
  id: string;
  title: string;
  winner_name: string;
  category: string;
  tingkat: 'Kabupaten' | 'Karesidenan' | 'Provinsi' | 'Nasional' | 'Internasional';
  medal_type: string;
  year: number;
  coach: string;
  description: string;
  certificate_url?: string;
}

interface BulkPrestasiInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_ROW = (): BulkPrestasiRow => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
  title: '',
  winner_name: '',
  category: 'Robotika / STEM',
  tingkat: 'Nasional',
  medal_type: 'Emas / Juara 1',
  year: new Date().getFullYear(),
  coach: 'Dewan Pembina PPJM',
  description: '',
  certificate_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80'
});

export const BulkPrestasiInputModal: React.FC<BulkPrestasiInputModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'table' | 'paste'>('table');
  const [rows, setRows] = useState<BulkPrestasiRow[]>([DEFAULT_ROW(), DEFAULT_ROW()]);
  const [pasteText, setPasteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!isSuperAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-800 text-center space-y-3 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">Akses Ditolak: Khusus Super Admin</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Fungsi bulk input prestasi hanya dapat diakses oleh Super Admin demi keabsahan sertifikat dan pencatatan santri.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddRow = () => {
    setRows((prev) => [...prev, DEFAULT_ROW()]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) {
      alert('Minimal 1 baris input prestasi.');
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, updates: Partial<BulkPrestasiRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Parse TSV (Tab Separated Values) from Excel / Google Sheets
  const handleParsePaste = () => {
    if (!pasteText.trim()) {
      alert('Mohon tempelkan (paste) teks dari spreadsheet terlebih dahulu.');
      return;
    }

    const lines = pasteText.trim().split(/\r?\n/);
    const parsedRows: BulkPrestasiRow[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by tab (default Excel copy) or comma/semicolon fallback
      const cols = line.includes('\t')
        ? line.split('\t')
        : line.includes(';')
        ? line.split(';')
        : line.split(',');

      const cleanCols = cols.map((c) => c.trim().replace(/^["']|["']$/g, ''));

      // Expected columns order:
      // 0: Judul Lomba, 1: Nama Santri, 2: Kategori, 3: Tingkat, 4: Tahun, 5: Medali, 6: Pembina, 7: Deskripsi
      const title = cleanCols[0] || 'Prestasi Santri PPJM';
      const winner_name = cleanCols[1] || 'Santri PPJM';
      const category = cleanCols[2] || 'Sains & Robotik';
      const tingkatRaw = (cleanCols[3] || 'Nasional').toLowerCase();
      let tingkat: BulkPrestasiRow['tingkat'] = 'Nasional';
      if (tingkatRaw.includes('internasional')) tingkat = 'Internasional';
      else if (tingkatRaw.includes('provinsi')) tingkat = 'Provinsi';
      else if (tingkatRaw.includes('kabupaten')) tingkat = 'Kabupaten';
      else if (tingkatRaw.includes('karesidenan')) tingkat = 'Karesidenan';

      const yearNum = parseInt(cleanCols[4] || '') || new Date().getFullYear();
      const medal_type = cleanCols[5] || 'Emas / Juara 1';
      const coach = cleanCols[6] || 'Dewan Pembina PPJM';
      const description = cleanCols[7] || `Meraih prestasi ${title} oleh ${winner_name}`;

      parsedRows.push({
        id: 'parsed-' + Date.now() + '-' + i,
        title,
        winner_name,
        category,
        tingkat,
        medal_type,
        year: yearNum,
        coach,
        description,
        certificate_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80'
      });
    }

    if (parsedRows.length > 0) {
      setRows(parsedRows);
      setActiveTab('table');
      setPasteText('');
    } else {
      alert('Gagal mendeteksi kolom dari teks yang ditempelkan.');
    }
  };

  const handleBulkSubmit = async () => {
    const validRows = rows.filter((r) => r.title.trim() && r.winner_name.trim());
    if (validRows.length === 0) {
      alert('Mohon isi minimal satu judul lomba dan nama santri.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const payloadAchievements = validRows.map((r) => ({
          title: r.title.trim(),
          winner_name: r.winner_name.trim(),
          category: r.category,
          medal_type: r.medal_type,
          level: r.tingkat,
          year: r.year,
          coach: r.coach,
          description: r.description || `Meraih prestasi ${r.title} oleh ${r.winner_name}`,
          certificate_url: r.certificate_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
          is_active: true,
          updated_at: new Date().toISOString()
        }));

        const { error: err1 } = await supabase.from('achievements').insert(payloadAchievements);
        if (err1) {
          console.warn('Gagal batch insert achievements:', err1);
        }

        // Parallel insert into 'prestasi' table for dual compatibility
        const payloadPrestasi = validRows.map((r) => ({
          title: r.title.trim(),
          student_name: r.winner_name.trim(),
          category: r.category,
          rank: r.medal_type,
          level: r.tingkat,
          year: r.year,
          description: r.description || `Meraih prestasi ${r.title} oleh ${r.winner_name}`,
          image_url: r.certificate_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
          is_published: true,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('prestasi').insert(payloadPrestasi);
      }

      invalidateCache('achievements_list');
      invalidateCache('prestasi_list');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ppjm-content-updated', { detail: { type: 'prestasi' } }));
      }

      setSuccessMsg(`Alhamdulillah, berhasil menyimpan ${validRows.length} data prestasi ke Supabase!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      alert(`Gagal menyimpan data: ${err?.message || 'Koneksi error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-[#0E7A4C] to-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/40 text-[#C8A951] flex items-center justify-center shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#C8A951] bg-black/40 px-2 py-0.5 rounded-full border border-[#C8A951]/30">
                  Bulk Input Mode
                </span>
                <span className="text-xs text-emerald-200">• Prestasi Santri</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Input Massal Piagam Kejuaraan &amp; Prestasi Santri
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls: Table Multi-Baris vs Paste Excel */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>1. Tabel Multi-Baris ({rows.length} Baris)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>2. Copy-Paste dari Excel / Spreadsheet</span>
            </button>
          </div>

          {activeTab === 'table' && (
            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Baris</span>
            </button>
          )}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="m-3 p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 border border-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Multi-Row Table Editor */}
        {activeTab === 'table' && (
          <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-3">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-2.5 w-8 text-center">#</th>
                    <th className="p-2.5 min-w-[200px]">Nama Kejuaraan / Prestasi *</th>
                    <th className="p-2.5 min-w-[170px]">Nama Santri / Tim *</th>
                    <th className="p-2.5 w-36">Kategori</th>
                    <th className="p-2.5 w-32">Tingkat</th>
                    <th className="p-2.5 w-32">Medali / Juara</th>
                    <th className="p-2.5 w-24">Tahun</th>
                    <th className="p-2.5 w-36">Pembina</th>
                    <th className="p-2.5 w-10 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                      <td className="p-2 text-center font-bold text-zinc-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Juara 1 Robotika"
                          value={row.title}
                          onChange={(e) => handleUpdateRow(row.id, { title: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          placeholder="Nama Santri Peraih"
                          value={row.winner_name}
                          onChange={(e) => handleUpdateRow(row.id, { winner_name: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.category}
                          onChange={(e) => handleUpdateRow(row.id, { category: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-medium"
                        >
                          <option value="Robotika / STEM">Robotika</option>
                          <option value="Tahfidz 30 Juz">Tahfidz</option>
                          <option value="Kitab Kuning / MQK">Kitab Kuning</option>
                          <option value="Olahraga & Silat">Olahraga / Silat</option>
                          <option value="Bahasa Arab & Mandarin">Bahasa</option>
                          <option value="Sains & Matematika">Sains</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={row.tingkat}
                          onChange={(e) => handleUpdateRow(row.id, { tingkat: e.target.value as any })}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-medium"
                        >
                          <option value="Kabupaten">Kabupaten</option>
                          <option value="Karesidenan">Karesidenan</option>
                          <option value="Provinsi">Provinsi</option>
                          <option value="Nasional">Nasional</option>
                          <option value="Internasional">Internasional</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={row.medal_type}
                          onChange={(e) => handleUpdateRow(row.id, { medal_type: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold"
                        >
                          <option value="Emas / Juara 1">Emas (Juara 1)</option>
                          <option value="Perak / Juara 2">Perak (Juara 2)</option>
                          <option value="Perunggu / Juara 3">Perunggu (Juara 3)</option>
                          <option value="Juara Harapan 1">Harapan 1</option>
                          <option value="Juara Umum">Juara Umum</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.year}
                          onChange={(e) => handleUpdateRow(row.id, { year: parseInt(e.target.value) || 2026 })}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Pembina"
                          value={row.coach}
                          onChange={(e) => handleUpdateRow(row.id, { coach: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Copy-Paste dari Spreadsheet */}
        {activeTab === 'paste' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Format Kolom Spreadsheet (Excel / Google Sheets):</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono text-[11px] bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                Kolom 1: Judul Lomba [TAB] Kolom 2: Nama Santri [TAB] Kolom 3: Kategori [TAB] Kolom 4: Tingkat [TAB] Kolom 5: Tahun [TAB] Kolom 6: Medali [TAB] Kolom 7: Pembina
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                Tip: Cukup salin (*copy*) beberapa baris dari file Excel Anda lalu tempelkan (*paste*) di kotak teks di bawah ini.
              </p>
            </div>

            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Tempelkan baris dari Excel di sini..."
              className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-xs focus:ring-2 focus:ring-[#0E7A4C] outline-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleParsePaste}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2 transition cursor-pointer"
              >
                <ClipboardPaste className="w-4 h-4" />
                <span>Proses &amp; Masukkan ke Tabel Editor</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Total {rows.filter((r) => r.title.trim()).length} prestasi siap diterbitkan ke Supabase.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBulkSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Semua Prestasi ({rows.filter((r) => r.title.trim()).length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BulkPrestasiInputModal;

