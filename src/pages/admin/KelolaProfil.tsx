import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Compass,
  HeartHandshake,
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  Save
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

export const KelolaProfil: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sambutan' | 'sejarah' | 'visi-misi' | 'program' | 'lembaga' | 'sekolah'>('sambutan');

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

  // State Lembaga (slug: 'lembaga')
  const [lembagaTitle, setLembagaTitle] = useState('Badan Otonom & Unit Lembaga PPJM');
  const [lembagaSubtitle, setLembagaSubtitle] = useState(
    'Sinergi unit pelaksana pendidikan, riset, dan dakwah di bawah naungan Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.'
  );
  const [lembagaContent, setLembagaContent] = useState(
    'Lembaga-lembaga di lingkungan PPJM beroperasi di bawah koordinasi Majelis Pengasuh untuk melayani kebutuhan tarbiyah, keilmuan, dan kemandirian santri.'
  );

  // State Program Sekolah (slug: 'program-sekolah')
  const [sekolahTitle, setSekolahTitle] = useState('Pendidikan Sekolah Berkarakter Islami');
  const [sekolahDesc, setSekolahDesc] = useState(
    'Di Pondok Pesantren Jauharul Maknuun Lasem, pendidikan formal tidak diposisikan sebagai hal yang terpisah dari ketarbiyahan santri. Kami mendesain jadwal dan materi belajar agar para santri dapat berprestasi tinggi dalam mata pelajaran sains, matematika, dan literasi nasional tanpa mengorbankan waktu nderes al-Qur’an dan kajian kitab kuning.'
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
            } else if (p.slug === 'lembaga') {
              if (p.title) setLembagaTitle(p.title);
              if (p.subtitle) setLembagaSubtitle(p.subtitle);
              if (p.content) setLembagaContent(p.content);
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
            } else if (pr.slug === 'program-sekolah') {
              if (pr.title) setSekolahTitle(pr.title);
              if (pr.description) setSekolahDesc(pr.description);
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
            .upsert(
              {
                slug: 'sambutan',
                title: 'Sambutan Pengasuh',
                content: teksSambutan,
                quotes: namaPimpinan,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-sambutan');
        } else if (activeTab === 'sejarah') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'sejarah',
                title: 'Sejarah Pesantren',
                content: sejarahTeks,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-sejarah');
        } else if (activeTab === 'visi-misi') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'visi-misi',
                title: 'Visi & Misi',
                content: visiTeks,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-visi-misi');
        } else if (activeTab === 'program') {
          await Promise.all([
            supabase.from('programs').upsert(
              {
                slug: 'amaliyah-pondok',
                category: 'amaliyah',
                title: 'Amaliyah Rutin Pesantren',
                description: amaliyahTeks,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            ),
            supabase.from('programs').upsert(
              {
                slug: 'program-madin',
                category: 'madin',
                title: 'Madrasah Diniyah Salafiyah',
                description: madinTeks,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            ),
          ]);
          invalidateCache('program-amaliyah');
          invalidateCache('program-madin');
        } else if (activeTab === 'lembaga') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'lembaga',
                title: lembagaTitle,
                subtitle: lembagaSubtitle,
                content: lembagaContent,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-lembaga');
        } else if (activeTab === 'sekolah') {
          await supabase
            .from('programs')
            .upsert(
              {
                slug: 'program-sekolah',
                category: 'sekolah',
                title: sekolahTitle,
                description: sekolahDesc,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('program-sekolah');
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
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
          <span>Editor Profil Lembaga &amp; Program</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
          Kelola Informasi JM Center &amp; Program Unggulan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Perbarui teks sambutan pimpinan, sejarah napak tilas, visi-misi, struktur badan otonom lembaga, serta kurikulum sekolah formal terpadu.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Alhamdulillah, pembaruan profil lembaga berhasil disimpan dan disinkronkan ke website publik!</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('sambutan')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sambutan'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>1. Sambutan Pengasuh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sejarah')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sejarah'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>2. Sejarah Pondok</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visi-misi')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'visi-misi'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>3. Visi &amp; Misi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lembaga')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'lembaga'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>4. Struktur Lembaga</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('program')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'program'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>5. Amaliyah &amp; Madin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sekolah')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sekolah'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>6. Program Sekolah</span>
        </button>
      </div>

      {/* Tab Form: Sambutan Pengasuh */}
      {activeTab === 'sambutan' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Nama Lengkap Pengasuh: *</label>
              <input
                type="text"
                required
                value={namaPimpinan}
                onChange={(e) => setNamaPimpinan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Gelar / Jabatan Kepengasuhan: *</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Naskah Sambutan Resmi Pimpinan: *</label>
            <textarea
              rows={8}
              required
              value={teksSambutan}
              onChange={(e) => setTeksSambutan(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Naskah Sambutan</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Sejarah */}
      {activeTab === 'sejarah' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Uraian Sejarah &amp; Napak Tilas Pondok: *</label>
            <textarea
              rows={8}
              required
              value={sejarahTeks}
              onChange={(e) => setSejarahTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Dokumen Sejarah</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Visi Misi */}
      {activeTab === 'visi-misi' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Rumusan Visi &amp; Misi Lembaga: *</label>
            <textarea
              rows={6}
              required
              value={visiTeks}
              onChange={(e) => setVisiTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Visi &amp; Misi</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Lembaga (slug='lembaga') */}
      {activeTab === 'lembaga' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Judul Halaman Lembaga: *</label>
            <input
              type="text"
              required
              value={lembagaTitle}
              onChange={(e) => setLembagaTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Subjudul / Deskripsi Singkat Header: *</label>
            <input
              type="text"
              required
              value={lembagaSubtitle}
              onChange={(e) => setLembagaSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Deskripsi / Kebijakan Lembaga: *</label>
            <textarea
              rows={5}
              required
              value={lembagaContent}
              onChange={(e) => setLembagaContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Lembaga</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Program Unggulan (Amaliyah & Madin) */}
      {activeTab === 'program' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">1. Amaliyah Pondok (Wirid, Sholat Jamaah &amp; Ratib): *</label>
            <textarea
              rows={4}
              required
              value={amaliyahTeks}
              onChange={(e) => setAmaliyahTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">2. Program Madrasah Diniyah (Kurikulum Turats Salaf): *</label>
            <textarea
              rows={4}
              required
              value={madinTeks}
              onChange={(e) => setMadinTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rincian Amaliyah &amp; Madin</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Program Sekolah (slug='program-sekolah') */}
      {activeTab === 'sekolah' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Judul Program Sekolah: *</label>
            <input
              type="text"
              required
              value={sekolahTitle}
              onChange={(e) => setSekolahTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Deskripsi Kurikulum Formal Sekolah PPJM: *</label>
            <textarea
              rows={7}
              required
              value={sekolahDesc}
              onChange={(e) => setSekolahDesc(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Program Sekolah Formal</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
