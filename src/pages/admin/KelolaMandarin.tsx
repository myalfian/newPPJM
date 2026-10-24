import React, { useState } from 'react';
import { Globe, PlusCircle, CheckCircle2, HelpCircle } from 'lucide-react';

export const KelolaMandarin: React.FC = () => {
  const [tab, setTab] = useState<'materi' | 'kuis'>('materi');

  // State Materi
  const [topik, setTopik] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [arti, setArti] = useState('');

  // State Kuis
  const [soal, setSoal] = useState('');
  const [opsiA, setOpsiA] = useState('');
  const [opsiB, setOpsiB] = useState('');
  const [opsiC, setOpsiC] = useState('');
  const [opsiD, setOpsiD] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState(0);
  const [pembahasan, setPembahasan] = useState('');

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setTopik('');
      setHanzi('');
      setPinyin('');
      setArti('');
      setSoal('');
      setOpsiA('');
      setOpsiB('');
      setOpsiC('');
      setOpsiD('');
      setPembahasan('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-gold-800" />
          <span>Manajemen Bahasa Mandarin</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Materi Kosakata & Soal Kuis Mandarin
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Formulir sederhana untuk memasukkan naskah percakapan santri, pelafalan Pinyin, dan butir kuis interaktif.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, data berhasil disimpan ke modul Mandarin!</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('materi')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            tab === 'materi'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          1. Tambah Materi Kosakata / Dialog
        </button>
        <button
          onClick={() => setTab('kuis')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            tab === 'kuis'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          2. Tambah Butir Soal Kuis
        </button>
      </div>

      {/* Form Tab 1: Materi */}
      {tab === 'materi' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Topik Pembelajaran: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Sapaan Santri di Pondok (问候)"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Karakter Hanzi (Aksara Mandarin):</label>
              <input
                type="text"
                placeholder="Contoh: 你好"
                value={hanzi}
                onChange={(e) => setHanzi(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pelafalan Pinyin & Nada: *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Nǐ hǎo"
                value={pinyin}
                onChange={(e) => setPinyin(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Arti dalam Bahasa Indonesia: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Halo / Selamat Sejahtera"
              value={arti}
              onChange={(e) => setArti(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Materi Mandarin</span>
            </button>
          </div>
        </form>
      )}

      {/* Form Tab 2: Kuis */}
      {tab === 'kuis' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Pertanyaan Kuis: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Apa arti dari kalimat 'Wǒmen dú gǔlánjīng'?"
              value={soal}
              onChange={(e) => setSoal(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan A: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan A..."
                value={opsiA}
                onChange={(e) => setOpsiA(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan B: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan B..."
                value={opsiB}
                onChange={(e) => setOpsiB(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan C: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan C..."
                value={opsiC}
                onChange={(e) => setOpsiC(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilihan D: *</label>
              <input
                type="text"
                required
                placeholder="Pilihan D..."
                value={opsiD}
                onChange={(e) => setOpsiD(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kunci Jawaban yang Benar: *</label>
            <select
              value={jawabanBenar}
              onChange={(e) => setJawabanBenar(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
            >
              <option value={0}>Pilihan A</option>
              <option value={1}>Pilihan B</option>
              <option value={2}>Pilihan C</option>
              <option value={3}>Pilihan D</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Penjelasan / Pembahasan Soal: *</label>
            <textarea
              rows={3}
              required
              placeholder="Berikan penjelasan singkat mengapa jawaban tersebut benar untuk edukasi santri..."
              value={pembahasan}
              onChange={(e) => setPembahasan(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Soal Kuis</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
