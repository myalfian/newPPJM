import React, { useState } from 'react';
import {
  Cpu,
  PlusCircle,
  CheckCircle2,
  FileText,
  Upload,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  Download,
  Eye,
  Layers,
  X
} from 'lucide-react';
import { StemProject } from '../../lib/supabase';

const INITIAL_PROJECTS: StemProject[] = [
  {
    id: 'p1',
    slug: 'iot-smart-irrigation',
    title: 'Sistem Otomasi Penyiram Tanaman Hidroponik Berbasis ESP32',
    category: 'Internet of Things (IoT)',
    description: 'Proyek rekayasa sains santri yang memadukan sensor kelembaban kapasitif, modul mikrokontroler ESP32, dan protokol MQTT untuk otomatisasi irigasi kebun hidroponik pesantren secara presisi.',
    specs: {
      'Mikrokontroler': 'ESP32 NodeMCU 38-Pin',
      'Sensor': 'Capacitive Soil Moisture V2.0',
      'Sumber Daya': 'Solar Panel 20W + Baterai Li-Ion 18650',
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    is_portfolio: true,
    author_santri: 'Ahmad Zaki & Tim Robotika Santri PPJM'
  },
  {
    id: 'p2',
    slug: 'smart-water-filtration',
    title: 'Purifier Air Minum Nanofiltrasi Karbon Aktif Kelapa Sawit',
    category: 'Sains Lingkungan & Kimia Terapan',
    description: 'Penelitian santri dalam memurnikan sumber air sumur payau kawasan pesisir Sidayu menjadi air layak konsumsi dengan multi-stage filter zeolit, silika, dan karbon aktif bersanad ramah lingkungan.',
    specs: {
      'Kapasitas Aliran': '50 Liter / Jam',
      'Tingkat Kejernihan': 'TDS < 30 ppm',
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    is_portfolio: true,
    author_santri: 'Farhan Maulana & Muhammad Iqbal'
  },
  {
    id: 'p3',
    slug: 'line-follower-robotics',
    title: 'Modul Silabus & Penugasan Robotika Line Follower Santri',
    category: 'Robotika & Mekatronika',
    description: 'Silabus terstruktur kurikulum semester gasal untuk santri jenjang wustho: pengenalan logika pemrograman C++, pembacaan array sensor fotodioda, dan tuning algoritma kendali PID.',
    specs: {
      'Platform': 'Arduino Nano / Uno R3',
      'Sensor': '8-Channel IR Sensor Array',
    },
    syllabus_url: '#unduh-silabus',
    assignment_doc_url: '#unduh-tugas',
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    is_portfolio: false,
    author_santri: 'Laboratorium STEM Jauharul Maknuun'
  }
];

export const KelolaStem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materi' | 'portofolio'>('materi');
  const [projects, setProjects] = useState<StemProject[]>(INITIAL_PROJECTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Internet of Things (IoT)');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [specsText, setSpecsText] = useState('Mikrokontroler: ESP32\nSensor: Digital Sensor\nEfisiensi: Tinggi');
  const [savedAlert, setSavedAlert] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('Internet of Things (IoT)');
    setDescription('');
    setAuthor('');
    setCoverImage('');
    setSpecsText('Mikrokontroler: ESP32\nSensor: Digital Sensor\nEfisiensi: Tinggi');
    setEditingId(null);
  };

  const handleEdit = (p: StemProject) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setAuthor(p.author_santri || '');
    setCoverImage(p.cover_image || '');
    if (p.specs) {
      setSpecsText(Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus proyek STEM ini?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Parse specs from lines
    const specsObj: Record<string, string> = {};
    specsText.split('\n').forEach((line) => {
      const [k, ...v] = line.split(':');
      if (k && v.length) {
        specsObj[k.trim()] = v.join(':').trim();
      }
    });

    if (editingId) {
      setProjects(
        projects.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title,
                category,
                description,
                author_santri: author || (activeTab === 'materi' ? 'Laboratorium STEM PPJM' : 'Santri Riset PPJM'),
                cover_image: coverImage || p.cover_image,
                specs: specsObj,
                is_portfolio: activeTab === 'portofolio',
              }
            : p
        )
      );
    } else {
      const newProj: StemProject = {
        id: `p-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        category,
        description,
        author_santri: author || (activeTab === 'materi' ? 'Laboratorium STEM PPJM' : 'Santri Riset PPJM'),
        cover_image: coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        syllabus_url: '#unduh-silabus',
        assignment_doc_url: '#unduh-tugas',
        specs: specsObj,
        is_portfolio: activeTab === 'portofolio',
      };
      setProjects([newProj, ...projects]);
    }

    setSavedAlert(true);
    resetForm();
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const displayList = projects.filter((p) => {
    const matchTab = activeTab === 'portofolio' ? p.is_portfolio : !p.is_portfolio;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-teal-800" />
          <span>Editor & Publish Laboratorium STEM</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Materi, Penugasan & Portofolio Siswa STEM
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Sinkronkan modul materi praktikum, silabus, formulir tugas santri, serta etalase portofolio karya inovasi siswa di halaman publik <code>/smart-jm/stem/*</code>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, modul proyek STEM berhasil disimpan dan diterbitkan ke website publik!</span>
        </div>
      )}

      {/* Tab Switcher: Materi dan Penugasan vs Portofolio Siswa */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setActiveTab('materi'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'materi'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Section: Materi dan Penugasan</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('portofolio'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'portofolio'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Section: Portofolio Siswa</span>
        </button>
      </div>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-700" />
            <span>
              {editingId ? 'Edit Proyek' : 'Tambah Proyek Baru'}:{' '}
              {activeTab === 'materi' ? 'Materi & Penugasan' : 'Portofolio Siswa'}
            </span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Nama Project / Modul STEM: *</label>
          <input
            type="text"
            required
            placeholder="Contoh: Otomasi Penyiram Tanaman Hidroponik Berbasis ESP32"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kategori Bidang:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
              <option value="Robotika & Mekatronika">Robotika & Mekatronika</option>
              <option value="Sains Lingkungan & Kimia Terapan">Sains Lingkungan & Kimia Terapan</option>
              <option value="Energi Terbarukan">Energi Terbarukan</option>
              <option value="Agrikultur Digital">Agrikultur Digital</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {activeTab === 'materi' ? 'Penyusun Modul / Guru:' : 'Inovator / Tim Santri:'}
            </label>
            <input
              type="text"
              placeholder={activeTab === 'materi' ? 'Contoh: Laboratorium STEM PPJM' : 'Contoh: Ahmad Zaki & Tim Santri'}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">URL Gambar Cover Proyek:</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/... (atau upload foto)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Uraian / Deskripsi Rinci Proyek: *</label>
          <textarea
            rows={4}
            required
            placeholder="Jelaskan tujuan praktikum, alat yang digunakan, dan manfaatnya bagi pesantren..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Spesifikasi Teknis Alat (Format: Kunci: Nilai, 1 per baris):</label>
          <textarea
            rows={3}
            placeholder="Mikrokontroler: ESP32 NodeMCU&#10;Sensor: Sensor Tanah Kapasitif&#10;Daya: Solar Panel 20W"
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingId ? 'Simpan Perubahan Proyek' : 'Terbitkan ke Website'}</span>
          </button>
        </div>
      </form>

      {/* Grid Card Proyek yang Terbit */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Daftar {activeTab === 'materi' ? 'Materi & Penugasan' : 'Portofolio Siswa'} Aktif ({displayList.length})
            </h3>
            <p className="text-xs text-slate-500">
              Setiap card di bawah ini tampil 1:1 di section publik STEM Area.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari proyek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="h-32 rounded-xl overflow-hidden bg-slate-200 mb-2.5">
                  <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                  {item.category}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 mt-1">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.description}</p>
                {item.author_santri && (
                  <p className="text-[11px] text-emerald-800 font-bold mt-1.5">
                    Karya/Penyusun: {item.author_santri}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Edit Proyek"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
