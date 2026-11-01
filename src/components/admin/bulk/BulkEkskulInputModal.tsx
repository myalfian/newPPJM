import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  ClipboardPaste,
  Table as TableIcon,
  ShieldAlert
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { invalidateCache } from '../../../lib/queryCache';
import { useAuth } from '../../../context/AuthContext';

export interface BulkEkskulRow {
  id: string;
  name: string;
  category: 'Sains' | 'Olahraga' | 'Seni' | 'Agama' | 'Pramuka';
  schedule: string;
  coach: string;
  location: string;
  description: string;
  imageUrl?: string;
}

interface BulkEkskulInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_ROW = (): BulkEkskulRow => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'ekskul-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
  name: '',
  category: 'Sains',
  schedule: 'Sabtu, 14:00 - 17:00 WIB',
  coach: 'Pembina Ekstrakurikuler PPJM',
  location: 'Komplek Pondok Pesantren PPJM',
  description: 'Program pembinaan minat dan bakat santri terstruktur.',
  imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
});

export const BulkEkskulInputModal: React.FC<BulkEkskulInputModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'table' | 'paste'>('table');
  const [rows, setRows] = useState<BulkEkskulRow[]>([DEFAULT_ROW(), DEFAULT_ROW()]);
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
            Fungsi bulk input ekstrakurikuler hanya dapat diakses oleh Super Admin demi standardisasi jadwal dan pelatih santri.
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
      alert('Minimal 1 baris ekskul.');
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, updates: Partial<BulkEkskulRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleParsePaste = () => {
    if (!pasteText.trim()) {
      alert('Mohon tempelkan teks dari spreadsheet terlebih dahulu.');
      return;
    }

    const lines = pasteText.trim().split(/\r?\n/);
    const parsedRows: BulkEkskulRow[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.includes('\t')
        ? line.split('\t')
        : line.includes(';')
        ? line.split(';')
        : line.split(',');

      const cleanCols = cols.map((c) => c.trim().replace(/^["']|["']$/g, ''));

      // 0: Nama Ekskul, 1: Kategori, 2: Jadwal, 3: Pembina, 4: Lokasi, 5: Deskripsi
      const name = cleanCols[0] || 'Kegiatan Santri';
      const catRaw = (cleanCols[1] || 'Sains').toLowerCase();
      let category: BulkEkskulRow['category'] = 'Sains';
      if (catRaw.includes('olahraga') || catRaw.includes('silat')) category = 'Olahraga';
      else if (catRaw.includes('seni') || catRaw.includes('hadrah') || catRaw.includes('banjari')) category = 'Seni';
      else if (catRaw.includes('agama') || catRaw.includes('quran')) category = 'Agama';
      else if (catRaw.includes('pramuka') || catRaw.includes('pmr')) category = 'Pramuka';

      const schedule = cleanCols[2] || 'Sabtu, 14:00 - 17:00 WIB';
      const coach = cleanCols[3] || 'Pembina Ekstrakurikuler PPJM';
      const location = cleanCols[4] || 'Komplek Pondok Pesantren';
      const description = cleanCols[5] || `Pelatihan terpadu pengembangan minat bakat santri dalam bidang ${name}`;

      parsedRows.push({
        id: 'parsed-ek-' + Date.now() + '-' + i,
        name,
        category,
        schedule,
        coach,
        location,
        description,
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
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
    const validRows = rows.filter((r) => r.name.trim());
    if (validRows.length === 0) {
      alert('Mohon isi minimal satu nama kegiatan ekskul.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const payloadExtra = validRows.map((r) => {
          const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');
          return {
            id: uuid,
            name: r.name.trim(),
            schedule: r.schedule || 'Sabtu Sore',
            mentor_name: r.coach || 'Pembina PPJM',
            description: r.description || `Kegiatan ${r.name}`,
            cover_image: r.imageUrl || null
          };
        });

        const { error: err1 } = await supabase.from('extracurriculars').insert(payloadExtra);
        if (err1) {
          console.warn('Gagal batch insert extracurriculars:', err1);
        }

        // Parallel insert into 'ekskul' table for dual compatibility
        const payloadEkskul = validRows.map((item) => ({
          name: item.name.trim(),
          category: item.category,
          instructor_name: item.coach || 'Pembina PPJM',
          schedule: item.schedule || 'Sabtu Sore',
          location: item.location || 'Komplek Kampus PPJM',
          description: item.description || `Kegiatan ${item.name}`,
          is_active: true,
          images: item.imageUrl ? [item.imageUrl] : null
        }));
        await supabase.from('ekskul').insert(payloadEkskul);
      }

      invalidateCache('extracurriculars_list');
      invalidateCache('ekskul_dataset_modular');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ppjm-content-updated', { detail: { type: 'ekskul' } }));
      }

      setSuccessMsg(`Alhamdulillah, berhasil menyimpan ${validRows.length} kegiatan ekskul ke Supabase!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      alert(`Gagal menyimpan data ekskul: ${err?.message || 'Koneksi error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/40 text-[#C8A951] flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#C8A951] bg-black/40 px-2 py-0.5 rounded-full border border-[#C8A951]/30">
                  Bulk Input Mode
                </span>
                <span className="text-xs text-emerald-200">• Ekstrakurikuler</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Input Massal Kegiatan Ekstrakurikuler (Ekskul)
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

        {/* Tab Controls */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
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
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>2. Copy-Paste dari Excel</span>
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
                    <th className="p-2.5 min-w-[200px]">Nama Ekstrakurikuler *</th>
                    <th className="p-2.5 w-32">Kategori</th>
                    <th className="p-2.5 min-w-[150px]">Jadwal Latihan</th>
                    <th className="p-2.5 min-w-[150px]">Pembina / Pelatih</th>
                    <th className="p-2.5 min-w-[150px]">Lokasi</th>
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
                          placeholder="Nama Ekskul"
                          value={row.name}
                          onChange={(e) => handleUpdateRow(row.id, { name: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.category}
                          onChange={(e) => handleUpdateRow(row.id, { category: e.target.value as any })}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold"
                        >
                          <option value="Sains">Sains</option>
                          <option value="Olahraga">Olahraga</option>
                          <option value="Seni">Seni</option>
                          <option value="Agama">Agama</option>
                          <option value="Pramuka">Pramuka</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.schedule}
                          onChange={(e) => handleUpdateRow(row.id, { schedule: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.coach}
                          onChange={(e) => handleUpdateRow(row.id, { coach: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.location}
                          onChange={(e) => handleUpdateRow(row.id, { location: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition cursor-pointer"
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

        {/* Tab 2: Copy-Paste */}
        {activeTab === 'paste' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Format Kolom Spreadsheet Ekskul:</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                Nama Ekskul [TAB] Kategori [TAB] Jadwal Latihan [TAB] Pembina / Pelatih [TAB] Lokasi [TAB] Deskripsi
              </p>
            </div>

            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Tempelkan baris ekskul dari Excel di sini..."
              className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-xs focus:ring-2 focus:ring-[#0E7A4C] outline-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleParsePaste}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2 transition cursor-pointer"
              >
                <ClipboardPaste className="w-4 h-4" />
                <span>Proses ke Tabel Ekskul</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Total {rows.filter((r) => r.name.trim()).length} kegiatan ekskul siap diterbitkan.
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
                  <span>Simpan Semua Ekskul ({rows.filter((r) => r.name.trim()).length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BulkEkskulInputModal;

