import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Compass,
  HeartHandshake,
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  Save,
  School,
  Layers
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

export const KelolaProfil: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'sambutan'
    | 'sejarah'
    | 'visi-misi'
    | 'fasilitas-pondok'
    | 'fasilitas-sekolah'
    | 'lembaga-pondok'
    | 'lembaga-sekolah'
    | 'program'
    | 'sekolah'
  >('sambutan');

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

  // State Fasilitas Pondok
  const [fasPondokTitle, setFasPondokTitle] = useState('Fasilitas Pondok Pesantren');
  const [fasPondokSubtitle, setFasPondokSubtitle] = useState(
    'Sarana dan prasarana terpadu untuk menunjang kekhusyukan ibadah, ketenangan istirahat, serta kelancaran tholabul ilmi para santri mukim di Lasem Sidayu.'
  );
  const [fasPondokContent, setFasPondokContent] = useState(
    'Pondok Pesantren Jauharul Maknuun menyediakan Masjid Jami\' berkapasitas ribuan jamaah, gedung asrama terpisah putra-putri, dapur higienis bernutrisi, perpustakaan ribuan kitab turats, serta sistem sanitasi modern.'
  );

  // State Fasilitas Sekolah
  const [fasSekolahTitle, setFasSekolahTitle] = useState('Fasilitas Sekolah Terpadu');
  const [fasSekolahSubtitle, setFasSekolahSubtitle] = useState(
    'Infrastruktur pembelajaran formal modern berstandar nasional yang dirancang menumbuhkan kecakapan literasi digital, sains, dan daya pikir kritis santri.'
  );
  const [fasSekolahContent, setFasSekolahContent] = useState(
    'Gedung sekolah dilengkapi ruang kelas multimedia full AC, laboratorium riset robotika STEM, lab komputer Gigabit CBT, perpustakaan digital, sarana olahraga, dan aula serbaguna 600 orang.'
  );

  // State Lembaga Pondok
  const [lembPondokTitle, setLembPondokTitle] = useState('Lembaga Pondok Pesantren');
  const [lembPondokSubtitle, setLembPondokSubtitle] = useState(
    'Struktur kelembagaan internal Pondok Pesantren Jauharul Maknuun yang mengemban amanah tarbiyah salaf, pengasuhan karakter, dan dakwah keumatan.'
  );
  const [lembPondokContent, setLembPondokContent] = useState(
    'Menaungi Majelis Pengasuh, Madrasah Diniyah Salafiyah (Madin), Markaz Tahfidzul Qur\'an 30 Juz Bersanad, Badan Pengasuhan Asrama 24 jam, Biro Dakwah, dan Koperasi Pesantren.'
  );

  // State Lembaga Sekolah
  const [lembSekolahTitle, setLembSekolahTitle] = useState('Lembaga Sekolah Terpadu');
  const [lembSekolahSubtitle, setLembSekolahSubtitle] = useState(
    'Satuan pelaksana pendidikan formal di lingkungan PPJM yang mengintegrasikan kurikulum nasional terakreditasi dengan riset STEM dan kemahiran bahasa global.'
  );
  const [lembSekolahContent, setLembSekolahContent] = useState(
    'Menaungi Manajemen Akademik Sekolah Formal, Dewan Guru Bersertifikasi, Unit Riset STEM Santri, Pusat Bahasa Asing Mandarin & Arab, Bimbingan Karir Studi Lanjut ke PTN, dan Komite Sekolah.'
  );

  // State Program Unggulan
  const [amaliyahTeks, setAmaliyahTeks] = useState(
    'Rutinitas sholat fardhu berjamaah diimami masyaikh, pembacaan Ratib Al-Haddad, wirid Asmaul Husna, qiyamul lail, serta ziarah maqbarah masyayikh setiap malam Jumat.'
  );
  const [madinTeks, setMadinTeks] = useState(
    'Pendidikan Madrasah Diniyah berjenjang (Ula, Wustho, Ulya) mengkaji kitab kuning standar pondok pesantren salaf: Jurumiyah, Imrithi, Alfiyah Ibnu Malik, Fathul Qorib, Fathul Mu’in, dan Tafsir Jalalain.'
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
            } else if (p.slug === 'fasilitas-pondok') {
              if (p.title) setFasPondokTitle(p.title);
              if (p.subtitle) setFasPondokSubtitle(p.subtitle);
              if (p.content) setFasPondokContent(p.content);
            } else if (p.slug === 'fasilitas-sekolah') {
              if (p.title) setFasSekolahTitle(p.title);
              if (p.subtitle) setFasSekolahSubtitle(p.subtitle);
              if (p.content) setFasSekolahContent(p.content);
            } else if (p.slug === 'lembaga-pondok') {
              if (p.title) setLembPondokTitle(p.title);
              if (p.subtitle) setLembPondokSubtitle(p.subtitle);
              if (p.content) setLembPondokContent(p.content);
            } else if (p.slug === 'lembaga-sekolah') {
              if (p.title) setLembSekolahTitle(p.title);
              if (p.subtitle) setLembSekolahSubtitle(p.subtitle);
              if (p.content) setLembSekolahContent(p.content);
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
        } else if (activeTab === 'fasilitas-pondok') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'fasilitas-pondok',
                title: fasPondokTitle,
                subtitle: fasPondokSubtitle,
                content: fasPondokContent,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-fasilitas-pondok');
        } else if (activeTab === 'fasilitas-sekolah') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'fasilitas-sekolah',
                title: fasSekolahTitle,
                subtitle: fasSekolahSubtitle,
                content: fasSekolahContent,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-fasilitas-sekolah');
        } else if (activeTab === 'lembaga-pondok') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'lembaga-pondok',
                title: lembPondokTitle,
                subtitle: lembPondokSubtitle,
                content: lembPondokContent,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-lembaga-pondok');
        } else if (activeTab === 'lembaga-sekolah') {
          await supabase
            .from('jm_center_pages')
            .upsert(
              {
                slug: 'lembaga-sekolah',
                title: lembSekolahTitle,
                subtitle: lembSekolahSubtitle,
                content: lembSekolahContent,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'slug' }
            );
          invalidateCache('jm-center-lembaga-sekolah');
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
          <span>Editor Profil Lembaga &amp; JM Center</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
          Kelola Informasi JM Center &amp; Fasilitas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Sinkronisasi menyeluruh hierarki JM Center: 1. Profil (Sambutan, Sejarah, Visi Misi), 2. Fasilitas (Pondok, Sekolah), 3. Lembaga (Pondok, Sekolah), serta Program Unggulan.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Alhamdulillah, pembaruan data berhasil disimpan dan disinkronkan ke website publik!</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="space-y-2">
        {/* Grup 1: Profil */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-1">
            1. Profil:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('sambutan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sambutan'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sambutan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sejarah')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sejarah'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Sejarah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visi-misi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'visi-misi'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Visi &amp; Misi</span>
          </button>
        </div>

        {/* Grup 2: Fasilitas */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-1">
            2. Fasilitas:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('fasilitas-pondok')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fasilitas-pondok'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Fasilitas Pondok</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fasilitas-sekolah')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fasilitas-sekolah'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Fasilitas Sekolah</span>
          </button>
        </div>

        {/* Grup 3: Lembaga */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-1">
            3. Lembaga:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('lembaga-pondok')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'lembaga-pondok'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lembaga Pondok</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lembaga-sekolah')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'lembaga-sekolah'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Lembaga Sekolah</span>
          </button>
        </div>

        {/* Grup 4: Program Tambahan */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-1">
            Program:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('program')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'program'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>Amaliyah &amp; Madin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sekolah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sekolah'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Kurikulum Sekolah</span>
          </button>
        </div>
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
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Jabatan &amp; Gelar Pengasuh: *</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Naskah Sambutan Mudir / Pengasuh: *</label>
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
              <span>Simpan Sambutan Pengasuh</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Sejarah Pondok */}
      {activeTab === 'sejarah' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Naskah Sejarah &amp; Napak Tilas PP Jauharul Maknuun: *</label>
            <textarea
              rows={10}
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
              <span>Simpan Sejarah Pesantren</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Visi Misi */}
      {activeTab === 'visi-misi' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Pernyataan Visi &amp; Misi Lembaga: *</label>
            <textarea
              rows={10}
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

      {/* Tab Form: Fasilitas Pondok */}
      {activeTab === 'fasilitas-pondok' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Judul Halaman Fasilitas Pondok: *</label>
            <input
              type="text"
              required
              value={fasPondokTitle}
              onChange={(e) => setFasPondokTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Sub-judul / Pengantar: *</label>
            <input
              type="text"
              required
              value={fasPondokSubtitle}
              onChange={(e) => setFasPondokSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Deskripsi Lengkap Sarana Pondok: *</label>
            <textarea
              rows={6}
              required
              value={fasPondokContent}
              onChange={(e) => setFasPondokContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Fasilitas Pondok</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Fasilitas Sekolah */}
      {activeTab === 'fasilitas-sekolah' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Judul Halaman Fasilitas Sekolah: *</label>
            <input
              type="text"
              required
              value={fasSekolahTitle}
              onChange={(e) => setFasSekolahTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Sub-judul / Pengantar: *</label>
            <input
              type="text"
              required
              value={fasSekolahSubtitle}
              onChange={(e) => setFasSekolahSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Deskripsi Fasilitas Sekolah Formal: *</label>
            <textarea
              rows={6}
              required
              value={fasSekolahContent}
              onChange={(e) => setFasSekolahContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Fasilitas Sekolah</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Lembaga Pondok */}
      {activeTab === 'lembaga-pondok' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Judul Lembaga Pondok: *</label>
            <input
              type="text"
              required
              value={lembPondokTitle}
              onChange={(e) => setLembPondokTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Sub-judul / Pengantar: *</label>
            <input
              type="text"
              required
              value={lembPondokSubtitle}
              onChange={(e) => setLembPondokSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Keterangan Struktur Badan Otonom Pesantren: *</label>
            <textarea
              rows={6}
              required
              value={lembPondokContent}
              onChange={(e) => setLembPondokContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Lembaga Pondok</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Form: Lembaga Sekolah */}
      {activeTab === 'lembaga-sekolah' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Judul Lembaga Sekolah: *</label>
            <input
              type="text"
              required
              value={lembSekolahTitle}
              onChange={(e) => setLembSekolahTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Sub-judul / Pengantar: *</label>
            <input
              type="text"
              required
              value={lembSekolahSubtitle}
              onChange={(e) => setLembSekolahSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Keterangan Manajemen Lembaga Pendidikan Formal: *</label>
            <textarea
              rows={6}
              required
              value={lembSekolahContent}
              onChange={(e) => setLembSekolahContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Lembaga Sekolah</span>
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
