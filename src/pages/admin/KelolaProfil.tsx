import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Compass,
  HeartHandshake,
  GraduationCap,
  CheckCircle2,
  Save
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

export const KelolaProfil: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sambutan' | 'sejarah' | 'visi-misi' | 'program'>('sambutan');

  // State Sambutan
  const [namaPimpinan, setNamaPimpinan] = useState('KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I.');
  const [jabatan, setJabatan] = useState('Pengasuh & Pendiri Pondok Pesantren Jauharul Maknuun');
  const [teksSambutan, setTeksSambutan] = useState(
    'Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di gerbang digital Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik. Lembaga ini berikhtiar memadukan kemurnian sanad keilmuan kitab kuning turats salaf dengan penguasaan sains teknologi modern serta adab budi pekerti luhur.\n\nSemoga ikhtiar ini melahirkan generasi santri yang faqih fiddin, mutafannin, dan siap mengabdi bagi agama, nusa, dan bangsa.'
  );

  // State Sejarah & Visi Misi
  const [sejarahTeks, setSejarahTeks] = useState(
    'Pondok Pesantren Jauharul Maknuun didirikan berlandaskan semangat dakwah para auliya dan ulama pesisir utara Jawa, tepatnya di kawasan Lasem Sidayu Gresik. Berawal dari majelis taklim kajian kitab balaghah dan tahfidzul qur’an, pesantren kini berkembang mengasuh ratusan santri mukim dengan sarana modern.'
  );
  const [visiTeks, setVisiTeks] = useState(
    'Terwujudnya insan santri yang bertauhid lurus, berakhlak mulia, mutafaqqih fiddin, menguasai sains teknologi, serta berdaya saing global berlandaskan Ahlussunnah wal Jama’ah An-Nahdliyyah.'
  );

  // State Program Unggulan
  const [amaliyahTeks, setAmaliyahTeks] = useState(
    'Rutinitas sholat fardhu berjamaah diimami masyaikh, pembacaan Ratib Al-Haddad, wirid Asmaul Husna, qiyamul lail, serta ziarah maqbarah masyayikh setiap malam Jumat.'
  );
  const [madinTeks, setMadinTeks] = useState(
    'Pendidikan Madrasah Diniyah berjenjang (Ula, Wustho, Ulya) mengkaji kitab kuning standar pondok pesantren salaf: Jurumiyah, Imrithi, Alfiyah Ibnu Malik, Fathul Qorib, Fathul Mu’in, dan Tafsir Jalalain.'
  );

  const [savedAlert, setSavedAlert] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data: pages } = await supabase.from('jm_center_pages').select('*');
        if (pages && pages.length > 0) {
          pages.forEach((p) => {
            if (p.slug === 'sambutan') {
              if (p.content) setTeksSambutan(p.content);
              if (p.quotes) setNamaPimpinan(p.quotes);
            } else if (p.slug === 'sejarah' && p.content) {
              setSejarahTeks(p.content);
            } else if (p.slug === 'visi-misi' && p.content) {
              setVisiTeks(p.content);
            }
          });
        }

        const { data: progs } = await supabase.from('programs').select('*');
        if (progs && progs.length > 0) {
          progs.forEach((pr) => {
            if (pr.slug === 'amaliyah-pondok' && pr.description) {
              setAmaliyahTeks(pr.description);
            } else if (pr.slug === 'program-madin' && pr.description) {
              setMadinTeks(pr.description);
            }
          });
        }
      } catch (err) {
        console.warn('Fallback to local profile data:', err);
      }
    };
    loadFromSupabase();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSupabaseConfigured()) {
      try {
        if (activeTab === 'sambutan') {
          await supabase
            .from('jm_center_pages')
            .update({ content: teksSambutan, quotes: namaPimpinan, updated_at: new Date().toISOString() })
            .eq('slug', 'sambutan');
          invalidateCache('jm-center-sambutan');
        } else if (activeTab === 'sejarah') {
          await supabase
            .from('jm_center_pages')
            .update({ content: sejarahTeks, updated_at: new Date().toISOString() })
            .eq('slug', 'sejarah');
          invalidateCache('jm-center-sejarah');
        } else if (activeTab === 'visi-misi') {
          await supabase
            .from('jm_center_pages')
            .update({ content: visiTeks, updated_at: new Date().toISOString() })
            .eq('slug', 'visi-misi');
          invalidateCache('jm-center-visi-misi');
        } else if (activeTab === 'program') {
          await Promise.all([
            supabase.from('programs').update({ description: amaliyahTeks, updated_at: new Date().toISOString() }).eq('slug', 'amaliyah-pondok'),
            supabase.from('programs').update({ description: madinTeks, updated_at: new Date().toISOString() }).eq('slug', 'program-madin'),
          ]);
          invalidateCache('program-amaliyah');
          invalidateCache('program-madin');
        }
      } catch (err) {
        console.warn('Failed to save to Supabase:', err);
      }
    }

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5 text-emerald-800" />
          <span>Editor Profil Lembaga & Program</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Informasi JM Center & Program Unggulan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Perbarui teks sambutan pimpinan, sejarah napak tilas, visi-misi, serta kurikulum amaliyah pondok yang tampil pada menu publik <code>JM Center</code> dan <code>Program</code>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, pembaruan profil lembaga berhasil disimpan dan disinkronkan ke website publik!</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('sambutan')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sambutan'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>1. Sambutan Pengasuh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sejarah')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sejarah'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>2. Sejarah Pondok</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visi-misi')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'visi-misi'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>3. Visi & Misi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('program')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'program'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>4. Program Unggulan</span>
        </button>
      </div>

      {/* Tab Form: Sambutan Pengasuh */}
      {activeTab === 'sambutan' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Pengasuh: *</label>
              <input
                type="text"
                required
                value={namaPimpinan}
                onChange={(e) => setNamaPimpinan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Gelar / Jabatan Kepengasuhan: *</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Naskah Sambutan Resmi Pimpinan: *</label>
            <textarea
              rows={8}
              required
              value={teksSambutan}
              onChange={(e) => setTeksSambutan(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Naskah Sambutan</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Sejarah */}
      {activeTab === 'sejarah' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Uraian Sejarah & Napak Tilas Pondok: *</label>
            <textarea
              rows={8}
              required
              value={sejarahTeks}
              onChange={(e) => setSejarahTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Dokumen Sejarah</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Visi Misi */}
      {activeTab === 'visi-misi' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Rumusan Visi Lembaga: *</label>
            <textarea
              rows={4}
              required
              value={visiTeks}
              onChange={(e) => setVisiTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Visi & Misi</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Program Unggulan */}
      {activeTab === 'program' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">1. Amaliyah Pondok (Wirid, Sholat Jamaah & Ratib): *</label>
            <textarea
              rows={4}
              required
              value={amaliyahTeks}
              onChange={(e) => setAmaliyahTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">2. Program Madrasah Diniyah (Kurikulum Turats Salaf): *</label>
            <textarea
              rows={4}
              required
              value={madinTeks}
              onChange={(e) => setMadinTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rincian Program</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
