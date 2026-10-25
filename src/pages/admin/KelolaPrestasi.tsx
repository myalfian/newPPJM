import React, { useState } from 'react';
import {
  Trophy,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Search,
  Eye,
  Calendar,
  Award,
  Sparkles,
  X
} from 'lucide-react';

interface PrestasiItem {
  id: string;
  title: string;
  santriName: string;
  category: string;
  level: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten';
  year: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
}

const INITIAL_PRESTASI: PrestasiItem[] = [
  {
    id: 'pr-1',
    title: 'Juara 1 Lomba Robotika Sains & IoT Tingkat Jawa Timur',
    santriName: 'Ahmad Zaki & Tim Robotika Santri PPJM',
    category: 'Robotika / STEM',
    level: 'Provinsi',
    year: '2025',
    description: 'Meraih medali emas inovasi sistem irigasi cerdas berbasis ESP32 pada ajang Festival Teknologi Santri Jawa Timur.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
  },
  {
    id: 'pr-2',
    title: 'Juara 2 Musabaqah Qira’atil Kutub (MQK) Fathul Qorib',
    santriName: 'Muhammad Farhan Maulana',
    category: 'Kitab Kuning / MQK',
    level: 'Nasional',
    year: '2024',
    description: 'Keberhasilan membaca dan memaknani kitab turats gandul serta menjawab musyawarah bahtsul masail nasional.',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
  },
  {
    id: 'pr-3',
    title: 'Wisudawan Terbaik Tahfidz 30 Juz Bersanad Muttashil',
    santriName: 'Hilmi Abdullah Al-Hafidz',
    category: 'Tahfidz 30 Juz',
    level: 'Nasional',
    year: '2024',
    description: 'Menyelesaikan setoran hafalan 30 juz sekali duduk di hadapan dewan masyaikh dengan sanad bersambung ke Rasulullah SAW.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
  },
  {
    id: 'pr-4',
    title: 'Medali Emas Kejuaraan Pencak Silat Pagar Nusa',
    santriName: 'Fajar Shodiq',
    category: 'Olahraga & Silat',
    level: 'Provinsi',
    year: '2023',
    description: 'Meraih juara 1 tanding kelas C putra pada Kejurda Pencak Silat Pagar Nusa se-Jawa Timur.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
  }
];

export const KelolaPrestasi: React.FC = () => {
  const [items, setItems] = useState<PrestasiItem[]>(INITIAL_PRESTASI);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Semua');

  // Form State
  const [title, setTitle] = useState('');
  const [santriName, setSantriName] = useState('');
  const [category, setCategory] = useState('Robotika / STEM');
  const [level, setLevel] = useState<'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten'>('Nasional');
  const [year, setYear] = useState('2025');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  const resetForm = () => {
    setTitle('');
    setSantriName('');
    setCategory('Robotika / STEM');
    setLevel('Nasional');
    setYear('2025');
    setDescription('');
    setImageUrl('');
    setEditingId(null);
  };

  const handleEdit = (item: PrestasiItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSantriName(item.santriName);
    setCategory(item.category);
    setLevel(item.level);
    setYear(item.year);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data prestasi santri ini?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleTogglePublish = (id: string) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, isPublished: !it.isPublished } : it))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !santriName) return;

    if (editingId) {
      setItems(
        items.map((it) =>
          it.id === editingId
            ? {
                ...it,
                title,
                santriName,
                category,
                level,
                year,
                description,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
              }
            : it
        )
      );
    } else {
      const newItem: PrestasiItem = {
        id: `pr-${Date.now()}`,
        title,
        santriName,
        category,
        level,
        year,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        isPublished: true,
      };
      setItems([newItem, ...items]);
    }

    setSavedAlert(true);
    resetForm();
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const filteredItems = items.filter((it) => {
    const matchSearch =
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.santriName.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCat === 'Semua' || it.category === filterCat;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-800" />
          <span>Editor & Publish Prestasi Santri</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola & Publikasikan Prestasi Santri PPJM
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kelola piagam penghargaan, pencapaian kejuaraan sains, tahfidz Al-Qur’an, qira’atil kutub, dan olahraga yang tampil pada halaman publik <code>/prestasi</code>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, data prestasi santri berhasil disimpan dan disinkronkan ke website publik!</span>
        </div>
      )}

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>{editingId ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Kejuaraan / Prestasi: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Juara 1 Robotika Line Follower Santri Jatim"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Santri / Tim Peraih: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Ahmad Zaki & Muhammad Iqbal"
              value={santriName}
              onChange={(e) => setSantriName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kategori Bidang:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Robotika / STEM">Robotika / STEM</option>
              <option value="Tahfidz 30 Juz">Tahfidz 30 Juz</option>
              <option value="Kitab Kuning / MQK">Kitab Kuning / MQK</option>
              <option value="Seni & Bahasa">Seni & Bahasa</option>
              <option value="Olahraga & Silat">Olahraga & Silat</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tingkat Kejuaraan:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Kabupaten">Kabupaten</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tahun Capaian:</label>
            <input
              type="text"
              placeholder="Contoh: 2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">URL Foto Dokumentasi / Piagam:</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/... (atau upload file)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Deskripsi / Catatan Prestasi:</label>
          <textarea
            rows={3}
            placeholder="Keterangan singkat mengenai proses pembinaan dan jalannya kompetisi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingId ? 'Simpan Perubahan Prestasi' : 'Terbitkan Prestasi'}</span>
          </button>
        </div>
      </form>

      {/* Tabel Daftar Prestasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Daftar Prestasi Santri Terpublikasi ({filteredItems.length})
            </h3>
            <p className="text-xs text-slate-500">
              Item yang aktif akan langsung muncul pada galeri prestasi website publik.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari prestasi / nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Robotika / STEM">Robotika / STEM</option>
              <option value="Tahfidz 30 Juz">Tahfidz 30 Juz</option>
              <option value="Kitab Kuning / MQK">Kitab Kuning / MQK</option>
              <option value="Olahraga & Silat">Olahraga & Silat</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Prestasi & Santri</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Tingkat</th>
                <th className="py-3 px-3">Tahun</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-emerald-800 font-semibold">{item.santriName}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{item.category}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                      {item.level}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.year}</td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.isPublished
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Edit Prestasi"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Prestasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
