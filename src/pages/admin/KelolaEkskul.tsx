import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Search,
  Clock,
  MapPin,
  User,
  Activity,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

interface EkskulItem {
  id: string;
  name: string;
  category: string;
  coach: string;
  schedule: string;
  location: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const INITIAL_EKSKUL: EkskulItem[] = [
  {
    id: 'ek-1',
    name: 'Robotika & Rekayasa IoT Santri',
    category: 'Teknologi & Sains',
    coach: 'Ust. Hilman M.T. & Tim Mentor',
    schedule: 'Sabtu, 14:00 - 17:00 WIB',
    location: 'Laboratorium STEM Jauharul Maknuun',
    description: 'Pelatihan algoritma pemrograman C++, perakitan mikrokontroler Arduino/ESP32, sensor array, dan persiapan olimpiade robotik.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-2',
    name: 'Pencak Silat Pagar Nusa Nahdlatul Ulama',
    category: 'Bela Diri & Fisik',
    coach: 'Pendekar M. Syamsul Huda',
    schedule: 'Ahad & Rabu, 15:30 - 17:30 WIB',
    location: 'Halaman Utama Asrama Putra',
    description: 'Olah raga beladiri tradisional warisan para ulama untuk menempah kebugaran jasmani, ketangkasan, dan jiwa korsa santri.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-3',
    name: 'Seni Hadrah Al-Banjari & Gambus Shalawat',
    category: 'Seni Islami',
    coach: 'Ust. Zaki M. & Tim Syauqul Habib',
    schedule: 'Malam Jumat, 20:00 - 22:00 WIB',
    location: 'Serambi Masjid Jauharul Maknuun',
    description: 'Pelatihan vokal qasidah maulid simtudduror, tabuhan terbang banjari khas Jawa Timuran, serta adab mahabbah rasul.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-4',
    name: 'Kaligrafi Islam (Khath Araby)',
    category: 'Seni Rupa & Turats',
    coach: 'Ust. Hasan Basri (Khattat)',
    schedule: 'Senin & Kamis, 16:00 - 17:30 WIB',
    location: 'Gedung Perpustakaan Turats',
    description: 'Pendalaman kaidah tulisan Arab rasm Usmani, khath Tsuluts, Naskhi, Diwani, dan Riq’ah bersertifikat.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  }
];

export const KelolaEkskul: React.FC = () => {
  const [items, setItems] = useState<EkskulItem[]>(INITIAL_EKSKUL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Teknologi & Sains');
  const [coach, setCoach] = useState('');
  const [schedule, setSchedule] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('extracurriculars')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          setItems(
            data.map((row) => ({
              id: row.id,
              name: row.name,
              category: row.icon_name || 'Ekstrakurikuler',
              coach: row.mentor_name || 'Pembina PPJM',
              schedule: row.schedule,
              location: 'Kompleks Ponpes Jauharul Maknuun',
              description: row.description,
              imageUrl: row.cover_image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
              isActive: true,
            }))
          );
        }
      } catch (err) {
        console.warn('Fallback to local ekskul:', err);
      }
    };
    loadFromSupabase();
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('Teknologi & Sains');
    setCoach('');
    setSchedule('');
    setLocation('');
    setDescription('');
    setImageUrl('');
    setEditingId(null);
  };

  const handleEdit = (item: EkskulItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setCoach(item.coach);
    setSchedule(item.schedule);
    setLocation(item.location);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ekstrakurikuler ini?')) {
      setItems(items.filter((item) => item.id !== id));
      if (isSupabaseConfigured() && !id.startsWith('ek-')) {
        try {
          await supabase.from('extracurriculars').delete().eq('id', id);
        } catch (err) {
          console.warn('Failed to delete extracurricular on Supabase:', err);
        }
      }
      invalidateCache('ekskul_list');
    }
  };

  const handleToggleActive = (id: string) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !coach) return;

    const finalImage = imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

    if (editingId) {
      setItems(
        items.map((it) =>
          it.id === editingId
            ? {
                ...it,
                name,
                category,
                coach,
                schedule,
                location,
                description,
                imageUrl: finalImage,
              }
            : it
        )
      );

      if (isSupabaseConfigured() && !editingId.startsWith('ek-')) {
        try {
          await supabase
            .from('extracurriculars')
            .update({
              name,
              schedule,
              mentor_name: coach,
              description,
              cover_image: finalImage,
              icon_name: category,
            })
            .eq('id', editingId);
        } catch (err) {
          console.warn('Failed to update extracurricular on Supabase:', err);
        }
      }
    } else {
      let createdId = `ek-${Date.now()}`;

      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from('extracurriculars')
            .insert({
              name,
              schedule,
              mentor_name: coach,
              description,
              cover_image: finalImage,
              icon_name: category,
            })
            .select()
            .single();

          if (data?.id) {
            createdId = data.id;
          }
        } catch (err) {
          console.warn('Failed to insert extracurricular on Supabase:', err);
        }
      }

      const newItem: EkskulItem = {
        id: createdId,
        name,
        category,
        coach,
        schedule,
        location,
        description,
        imageUrl: finalImage,
        isActive: true,
      };
      setItems([newItem, ...items]);
    }

    setSavedAlert(true);
    resetForm();
    invalidateCache('ekskul_list');
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const filteredItems = items.filter(
    (it) =>
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.coach.toLowerCase().includes(search.toLowerCase()) ||
      it.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-800" />
          <span>Editor & Publish Ekstrakurikuler</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola & Publikasikan Ekstrakurikuler Santri
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Atur jadwal, pelatih pembina, deskripsi materi, dan dokumentasi foto ekstrakurikuler santri yang tampil pada halaman <code>/ekskul</code>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, data ekstrakurikuler santri berhasil disimpan dan diterbitkan!</span>
        </div>
      )}

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>{editingId ? 'Edit Data Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}</span>
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
            <label className="text-xs font-bold text-slate-700">Nama Ekstrakurikuler: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Robotika & IoT Santri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kategori Ekskul:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="Teknologi & Sains">Teknologi & Sains</option>
              <option value="Bela Diri & Fisik">Bela Diri & Fisik</option>
              <option value="Seni Islami">Seni Islami</option>
              <option value="Seni Rupa & Turats">Seni Rupa & Turats</option>
              <option value="Bahasa & Diplomasi">Bahasa & Diplomasi</option>
              <option value="Kepanduan / Pramuka">Kepanduan / Pramuka</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Pembina / Pelatih: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Ust. Hilman M.T."
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Hari & Jam Latihan:</label>
            <input
              type="text"
              placeholder="Contoh: Sabtu, 14:00 - 17:00 WIB"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tempat / Lokasi Latihan:</label>
            <input
              type="text"
              placeholder="Contoh: Laboratorium STEM PPJM"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">URL Foto Dokumentasi Ekskul:</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/... (atau path gambar)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Deskripsi Program & Silabus Ekskul:</label>
          <textarea
            rows={3}
            placeholder="Jelaskan capaian pembelajaran, target kompetisi, dan materi latihan santri..."
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
            <span>{editingId ? 'Simpan Perubahan Ekskul' : 'Publikasikan Ekskul'}</span>
          </button>
        </div>
      </form>

      {/* Grid Card Daftar Ekskul */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Daftar Ekstrakurikuler Santri Aktif ({filteredItems.length})
            </h3>
            <p className="text-xs text-slate-500">
              Daftar kegiatan minat bakat santri yang tampil pada portal publik.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ekskul / pembina..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3 bg-slate-50/50"
            >
              <div className="flex items-start gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-200"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 uppercase">
                    {item.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="truncate">{item.coach}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate">{item.schedule}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.isActive
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {item.isActive ? 'Aktif di Web' : 'Non-Aktif'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                    title="Edit Ekskul"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Ekskul"
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
