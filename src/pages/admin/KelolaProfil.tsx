import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  Layers,
  Clock,
  Download,
  Share2,
  Maximize2,
  X,
  Plus,
  Trash2,
  Check,
  Eye,
  FileText,
  Calendar
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

interface FacilityItem {
  id: string;
  name: string;
  category: 'Asrama' | 'Ibadah' | 'Akademik' | 'Lab STEM' | 'Olahraga';
  description: string;
  imageUrl: string;
}

interface MadinFlyer {
  id: string;
  title: string;
  kitab: string;
  author: string;
  level: string;
  imageUrl: string;
  description: string;
}

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 'f-1',
    name: 'Masjid Jami\' Jauharul Maknuun',
    category: 'Ibadah',
    description: 'Pusat spiritual pesantren berkapasitas ribuan jamaah, tempat halaqah tahfidz dan ratibul haddad.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f-2',
    name: 'Gedung Asrama Putra & Putri Terpisah',
    category: 'Asrama',
    description: 'Kamar mukim santri higienis dengan sistem sirkulasi udara optimal dan pengawasan pengasuh 24 jam.',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f-3',
    name: 'Ruang Kelas Multimedia SMP Plus',
    category: 'Akademik',
    description: 'Ruang belajar ber-AC dengan proyektor interaktif dan koneksi intranet untuk CBT.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f-4',
    name: 'Laboratorium Rekayasa Robotika & STEM',
    category: 'Lab STEM',
    description: 'Pusat riset mikrokontroler ESP32, sensor array IoT hidroponik, dan nanofiltrasi air.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f-5',
    name: 'Lapangan Olahraga & Arena Pencak Silat',
    category: 'Olahraga',
    description: 'Sarana kebugaran santri untuk latihan Pencak Silat Pagar Nusa, futsal, dan bulu tangkis.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  }
];

const DEFAULT_MADIN_FLYERS: MadinFlyer[] = [
  {
    id: 'mf-1',
    title: 'Matan Al-Ajurumiyah',
    kitab: 'Ilmu Nahwu Dasar',
    author: 'Syaikh Ash-Shanhaji',
    level: 'Kelas Ula (Tingkat Dasar)',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    description: 'Kaidah dasar tata bahasa Arab, i\'rab, dan struktur kalimat untuk santri pemula.'
  },
  {
    id: 'mf-2',
    title: 'Safinatun Najah',
    kitab: 'Fiqih Ibadah Dasar',
    author: 'Syaikh Salim bin Samir Al-Hadhrami',
    level: 'Kelas Ula (Tingkat Dasar)',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    description: 'Tuntunan rukun iman, rukun Islam, thaharah, dan tata cara shalat fardhu serta sunnah.'
  },
  {
    id: 'mf-3',
    title: 'Nadham Al-Imrithi',
    kitab: 'Kaidah Nahwu Menengah',
    author: 'Syaikh Syarafuddin Yahya Al-Imrithi',
    level: 'Kelas Wustho (Menengah)',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'Bait-bait nadham sastrawi untuk menghafal kaidah tata bahasa Arab tingkat lanjut.'
  },
  {
    id: 'mf-4',
    title: 'Fathul Qorib Al-Mujib',
    kitab: 'Fiqih Madzhab Syafi\'i',
    author: 'Syaikh Muhammad bin Qasim Al-Ghazi',
    level: 'Kelas Wustho & Ulya',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    description: 'Kajian komprehensif muamalah, munakahat, jinayat, dan ibadah thariqah salaf.'
  },
  {
    id: 'mf-5',
    title: 'Nadham Alfiyah Ibnu Malik',
    kitab: 'Gramatika 1.000 Bait',
    author: 'Imam Ibnu Malik Al-Andalusi',
    level: 'Kelas Ulya (Tingkat Tinggi)',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description: 'Puncak penguasaan gramatika bahasa Arab 1.000 bait dengan hafalan dan pemaknaan gandul.'
  },
  {
    id: 'mf-6',
    title: 'Fathul Mu\'in Syarah Qurratul \'Ain',
    kitab: 'Fiqih Fathul Mu\'in',
    author: 'Syaikh Zainuddin Al-Malibari',
    level: 'Kelas Takhassus Bahtsul Masail',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Kitab rujukan bahtsul masail santri senior untuk membedah fatwa hukum Islam kontemporer.'
  }
];

export const KelolaProfil: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<
    | 'sambutan'
    | 'sejarah'
    | 'visi-misi'
    | 'fasilitas'
    | 'program-pondok'
    | 'flyer-madin'
  >(() => {
    if (location.pathname.includes('program')) return 'program-pondok';
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'fasilitas') return 'fasilitas';
    if (tabParam === 'madin') return 'flyer-madin';
    return 'sambutan';
  });

  // State Sambutan Mudir KH. M. Jauharul Maknuun
  const [namaPimpinan, setNamaPimpinan] = useState('KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I.');
  const [jabatan, setJabatan] = useState('Pengasuh & Pendiri Pondok Pesantren Jauharul Maknuun');
  const [teksSambutan, setTeksSambutan] = useState(
    'Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di gerbang digital Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik. Lembaga ini berikhtiar memadukan kemurnian sanad keilmuan kitab kuning turats salaf dengan penguasaan sains teknologi modern serta adab budi pekerti luhur.\n\nSemoga ikhtiar ini melahirkan generasi santri yang faqih fiddin, mutafannin, dan siap mengabdi bagi agama, nusa, dan bangsa.'
  );

  // State Sejarah & Milestones
  const [sejarahTeks, setSejarahTeks] = useState(
    'Pondok Pesantren Jauharul Maknuun didirikan berlandaskan semangat dakwah para auliya dan ulama pesisir utara Jawa, tepatnya di kawasan Lasem Sidayu Gresik. Berawal dari majelis taklim kajian kitab balaghah dan tahfidzul qur’an, pesantren kini berkembang mengasuh ratusan santri mukim dengan sarana modern.'
  );

  // State Visi & 5 Pilar Misi
  const [visiTeks, setVisiTeks] = useState(
    'Terwujudnya insan santri yang bertauhid lurus, berakhlak mulia, mutafaqqih fiddin, menguasai sains teknologi, serta berdaya saing global berlandaskan Ahlussunnah wal Jama’ah An-Nahdliyyah.'
  );
  const [pilar1, setPilar1] = useState('Pilar 1: Tauhid, Tasawuf, dan Keluhuran Adab Santri');
  const [pilar2, setPilar2] = useState('Pilar 2: Tafaqquh Fiddin & Kemurnian Sanad Kitab Kuning Turats');
  const [pilar3, setPilar3] = useState('Pilar 3: Tahfidzul Qur\'an 30 Juz Bersanad Muttashil');
  const [pilar4, setPilar4] = useState('Pilar 4: Penguasaan Sains, Robotika, dan Riset STEM Modern');
  const [pilar5, setPilar5] = useState('Pilar 5: Diplomasi Bahasa Global (Mandarin Putonghua & Bahasa Arab)');

  // State Fasilitas & Filter Kategori
  const [facilities, setFacilities] = useState<FacilityItem[]>(DEFAULT_FACILITIES);
  const [facilityCategory, setFacilityCategory] = useState<'Semua' | 'Asrama' | 'Ibadah' | 'Akademik' | 'Lab STEM' | 'Olahraga'>('Semua');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // State Program & Jadwal 24 Jam
  const [jadwal24, setJadwal24] = useState([
    { waktu: '03:30 - 04:30', nama: 'Qiyamul Lail & Sahur Bersama', amaliyah: 'Sholat Tahajjud, Witir, & Istighfar Santri' },
    { waktu: '04:30 - 05:30', nama: 'Shubuh Berjamaah & Ziyadah Tahfidz', amaliyah: 'Sholat Shubuh, Wirid Nashr, & Setor Ayat Baru' },
    { waktu: '06:30 - 12:00', nama: 'KBM Formal SMP Plus Jauharul Maknuun', amaliyah: 'Kurikulum Nasional, Matematika, Lab STEM & Mandarin' },
    { waktu: '12:00 - 13:00', nama: 'Dhuhur Berjamaah & Qailulah', amaliyah: 'Istirahat Siang & Santap Nutrisi Pesantren' },
    { waktu: '15:15 - 17:00', nama: 'Diniyah Ashar & Ratibul Haddad', amaliyah: 'Kajian Maknani Gandul Kitab Kuning Turats' },
    { waktu: '17:45 - 20:00', nama: 'Maghrib, Deresan Qur\'an & Isya\'', amaliyah: 'Halaqah Murojaah Mandiri & Wirid Asmaul Husna' },
    { waktu: '20:00 - 21:30', nama: 'Mudzakarah Malam & Musyawarah Fiqih', amaliyah: 'Bahtsul Masail, Belajar Bersama & Istirahat Malam' }
  ]);

  // State Flyer Madin
  const [madinFlyers, setMadinFlyers] = useState<MadinFlyer[]>(DEFAULT_MADIN_FLYERS);
  const [selectedFlyer, setSelectedFlyer] = useState<MadinFlyer | null>(null);

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseConfigured()) {
      try {
        if (activeTab === 'sambutan') {
          await supabase.from('jm_center_pages').upsert(
            {
              slug: 'sambutan',
              title: 'Sambutan Pengasuh',
              content: teksSambutan,
              quotes: namaPimpinan,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'slug' }
          );
        } else if (activeTab === 'sejarah') {
          await supabase.from('jm_center_pages').upsert(
            {
              slug: 'sejarah',
              title: 'Sejarah Pesantren',
              content: sejarahTeks,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'slug' }
          );
        } else if (activeTab === 'visi-misi') {
          await supabase.from('jm_center_pages').upsert(
            {
              slug: 'visi-misi',
              title: 'Visi & 5 Pilar Misi',
              content: `${visiTeks}\n\n${pilar1}\n${pilar2}\n${pilar3}\n${pilar4}\n${pilar5}`,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'slug' }
          );
        }
      } catch (err) {
        console.warn('Failed to sync to Supabase:', err);
      }
    }
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const filteredFacilities = facilityCategory === 'Semua'
    ? facilities
    : facilities.filter((f) => f.category === facilityCategory);

  const handleShareFlyer = (flyer: MadinFlyer) => {
    const text = `Flyer Pembelajaran Kitab Turats PPJM: ${flyer.title} (${flyer.kitab}) oleh ${flyer.author}. Info lengkap: ${window.location.origin}/program`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* 1. Header Hero Panel */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40">
            <Landmark className="w-3.5 h-3.5" />
            <span>Pusat Tata Kelola Profil &amp; Program Unggulan</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Kelola Profil Pesantren &amp; Kurikulum Madin
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Pusat manajemen narasi resmi Mudir KH. M. Jauharul Maknuun, napak tilas sejarah Lasem Sidayu, 5 pilar visi-misi, sarana prasarana, jadwal 24 jam santri, serta flyer unduhan kitab kuning.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-[#0E7A4C]/15 border border-[#0E7A4C] text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#0E7A4C] dark:text-emerald-400" />
          <span>Alhamdulillah, pembaruan data berhasil disimpan dan disinkronkan ke seluruh sistem!</span>
        </div>
      )}

      {/* 2. TAB CONTROLLER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('sambutan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'sambutan'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Sambutan Mudir</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sejarah')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'sejarah'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Sejarah Lasem Sidayu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visi-misi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'visi-misi'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Visi &amp; 5 Pilar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fasilitas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'fasilitas'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Fasilitas &amp; Lightbox</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('program-pondok')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'program-pondok'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jadwal Amaliyah 24 Jam</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flyer-madin')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'flyer-madin'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Flyer Madin Kitab Turats</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: SAMBUTAN MUDIR */}
      {activeTab === 'sambutan' && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Lengkap Pengasuh:</label>
              <input
                type="text"
                required
                value={namaPimpinan}
                onChange={(e) => setNamaPimpinan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Jabatan &amp; Amanah:</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Naskah Sambutan:</label>
            <textarea
              rows={8}
              required
              value={teksSambutan}
              onChange={(e) => setTeksSambutan(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Sambutan Mudir</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB B: SEJARAH LASEM SIDAYU */}
      {activeTab === 'sejarah' && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Naskah Sejarah Berdirinya Pesantren di Lasem Sidayu Gresik:</label>
            <textarea
              rows={10}
              required
              value={sejarahTeks}
              onChange={(e) => setSejarahTeks(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Sejarah Pesantren</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB C: VISI & 5 PILAR MISI */}
      {activeTab === 'visi-misi' && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Pernyataan Visi Lembaga:</label>
            <textarea
              rows={3}
              required
              value={visiTeks}
              onChange={(e) => setVisiTeks(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C8A951] block">
              5 Pilar Misi Utama Pesantren
            </span>
            <div className="space-y-2">
              <input
                type="text"
                value={pilar1}
                onChange={(e) => setPilar1(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <input
                type="text"
                value={pilar2}
                onChange={(e) => setPilar2(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <input
                type="text"
                value={pilar3}
                onChange={(e) => setPilar3(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <input
                type="text"
                value={pilar4}
                onChange={(e) => setPilar4(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <input
                type="text"
                value={pilar5}
                onChange={(e) => setPilar5(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Visi &amp; 5 Pilar Misi</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB D: FASILITAS DENGAN FILTER KATEGORI & LIGHTBOX */}
      {activeTab === 'fasilitas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-zinc-500 mr-2">Filter Kategori:</span>
              {(['Semua', 'Asrama', 'Ibadah', 'Akademik', 'Lab STEM', 'Olahraga'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFacilityCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    facilityCategory === cat
                      ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-400 font-mono">
              Total {filteredFacilities.length} Fasilitas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setLightboxImage(fac.imageUrl)}
                    className="relative aspect-video overflow-hidden bg-zinc-100 cursor-pointer"
                    title="Klik untuk memperbesar foto fasilitas"
                  >
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A2116]/90 text-[#C8A951] border border-[#C8A951]/40">
                      {fac.category}
                    </span>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                      {fac.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(fac.imageUrl)}
                    className="text-xs font-bold text-[#0E7A4C] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Fullsize</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: JADWAL AMALIYAH 24 JAM SANTRI */}
      {activeTab === 'program-pondok' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-white">
                Jadwal Amaliyah 24 Jam Santri Mukim Lasem Sidayu
              </h3>
              <p className="text-xs text-zinc-400">
                Rutinitas terpadu tholabul ilmi, sholat berjamaah, diniyah ashar &amp; mudzakarah
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0E7A4C]/15 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30">
              Disiplin Salaf
            </span>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {jadwal24.map((j, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-[#C8A951] bg-[#0A2116] px-2.5 py-1 rounded-lg border border-[#C8A951]/30">
                    {j.waktu}
                  </span>
                  <div>
                    <h5 className="font-extrabold text-zinc-900 dark:text-white">{j.nama}</h5>
                    <p className="text-zinc-500 dark:text-zinc-400">{j.amaliyah}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Wajib Berjamaah
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB F: FLYER MADIN KITAB TURATS DENGAN PERBESAR, UNDUH, BAGIKAN */}
      {activeTab === 'flyer-madin' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                Katalog Flyer Pembelajaran Kitab Kuning Salafiyah
              </h3>
              <p className="text-xs text-zinc-400">
                Poster infografis kurikulum kitab turats siap perbesar, unduh &amp; bagikan ke wali santri
              </p>
            </div>
            <span className="text-xs font-bold text-[#C8A951] bg-[#0A2116] px-3 py-1 rounded-lg border border-[#C8A951]/40">
              6 Kitab Rujukan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {madinFlyers.map((flyer) => (
              <div
                key={flyer.id}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setSelectedFlyer(flyer)}
                    className="relative aspect-video overflow-hidden bg-zinc-100 cursor-pointer group"
                    title="Klik untuk memperbesar flyer"
                  >
                    <img
                      src={flyer.imageUrl}
                      alt={flyer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A2116] text-[#C8A951] border border-[#C8A951]/40">
                      {flyer.level}
                    </span>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                      {flyer.title}
                    </h4>
                    <p className="text-xs font-semibold text-[#0E7A4C] dark:text-emerald-400">
                      {flyer.kitab} • {flyer.author}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                      {flyer.description}
                    </p>
                  </div>
                </div>

                {/* Actions: Perbesar, Unduh, Bagikan */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFlyer(flyer)}
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-[#0E7A4C] flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </button>

                  <a
                    href={flyer.imageUrl}
                    download={`${flyer.title}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-[#0E7A4C] flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleShareFlyer(flyer)}
                    className="text-xs font-bold text-[#0E7A4C] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LIGHTBOX MODAL UNTUK GAMBAR FASILITAS */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-zinc-900 border border-white/20">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImage} alt="Preview Fasilitas" className="w-full h-auto max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

      {/* 5. MODAL PERBESAR FLYER MADIN DENGAN DETAIL LENGKAP */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full rounded-2xl bg-[#0A2116] border border-[#C8A951]/40 text-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#C8A951]">{selectedFlyer.title}</h3>
                <p className="text-xs text-emerald-200">{selectedFlyer.kitab} • {selectedFlyer.author}</p>
              </div>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10">
              <img src={selectedFlyer.imageUrl} alt={selectedFlyer.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs text-zinc-200 leading-relaxed">
              {selectedFlyer.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <a
                href={selectedFlyer.imageUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Poster</span>
              </a>
              <button
                type="button"
                onClick={() => handleShareFlyer(selectedFlyer)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] flex items-center gap-1.5 border border-[#C8A951]/30"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan ke WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default KelolaProfil;
