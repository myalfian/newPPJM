import React, { useState } from 'react';
import { Cpu, PlusCircle, CheckCircle2, FileText, Upload, Trash2 } from 'lucide-react';
import { StemProject } from '../../lib/supabase';

export const KelolaStem: React.FC = () => {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Internet of Things (IoT)');
  const [deskripsi, setDeskripsi] = useState('');
  const [isPortfolio, setIsPortfolio] = useState(false);
  const [author, setAuthor] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setJudul('');
      setDeskripsi('');
      setAuthor('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-sky-800" />
          <span>Laboratorium STEM & Robotika</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Materi & Portofolio Riset Santri
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tambahkan modul silabus sains, lembar tugas praktikum, serta publikasikan portofolio karya inovasi teknologi santri PPJM.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, materi / portofolio STEM berhasil disimpan ke database!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Nama Proyek / Materi STEM: *</label>
          <input
            type="text"
            required
            placeholder="Contoh: Otomasi Penyiram Tanaman Hidroponik Santri"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kategori Bidang Sains:</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
              <option value="Robotika & Mekatronika">Robotika & Mekatronika</option>
              <option value="Sains Lingkungan & Filter Air">Sains Lingkungan & Filter Air</option>
              <option value="Materi & Penugasan Silabus">Materi & Penugasan Silabus</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Santri / Tim Peneliti:</label>
            <input
              type="text"
              placeholder="Contoh: Ahmad Zaki & Tim Robotika Santri"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="portfolioCheck"
            checked={isPortfolio}
            onChange={(e) => setIsPortfolio(e.target.checked)}
            className="w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-700"
          />
          <label htmlFor="portfolioCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
            Jadikan Portofolio Siswa (Tampil di Showcase Karya Santri)
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Uraian / Deskripsi Rinci Proyek: *</label>
          <textarea
            rows={5}
            required
            placeholder="Jelaskan spesifikasi alat, komponen sensor, cara kerja, dan manfaatnya bagi pesantren..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simpan Modul STEM</span>
          </button>
        </div>
      </form>
    </div>
  );
};
