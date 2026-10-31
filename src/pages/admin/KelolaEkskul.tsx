import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Eye,
  Calendar,
  Layers,
  Save,
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';

export interface EkskulItem {
  id: string;
  name: string;
  category: 'Sains' | 'Olahraga' | 'Seni' | 'Agama' | 'Pramuka';
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
    category: 'Sains',
    coach: 'Ust. Hilman M.T. & Tim Mentor Lab STEM',
    schedule: 'Sabtu, 14:00 - 17:00 WIB',
    location: 'Laboratorium STEM Jauharul Maknuun',
    description: 'Pelatihan algoritma pemrograman C++, perakitan mikrokontroler Arduino/ESP32, sensor array, dan persiapan olimpiade robotik santri.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-2',
    name: 'Pencak Silat Pagar Nusa Nahdlatul Ulama',
    category: 'Olahraga',
    coach: 'Pendekar M. Syamsul Huda',
    schedule: 'Ahad & Rabu, 15:30 - 17:30 WIB',
    location: 'Halaman Utama Asrama Putra',
    description: 'Olah raga beladiri tradisional warisan para ulama untuk menempah kebugaran jasmani, ketangkasan, dan jiwa korsa santri.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-3',
    name: 'Seni Hadrah Al-Banjari & Shalawat',
    category: 'Seni',
    coach: 'Ust. Zaki M. & Tim Syauqul Habib',
    schedule: 'Malam Jumat, 20:00 - 22:00 WIB',
    location: 'Serambi Masjid Jauharul Maknuun',
    description: 'Pelatihan vokal qasidah maulid simtudduror, tabuhan terbang banjari khas Jawa Timuran, serta adab mahabbah rasul.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-4',
    name: 'Kajian Khath & Kaligrafi Islam (Rasm Usmani)',
    category: 'Agama',
    coach: 'Ust. Hasan Basri (Khattat)',
    schedule: 'Senin & Kamis, 16:00 - 17:30 WIB',
    location: 'Gedung Perpustakaan Turats Salaf',
    description: 'Pendalaman kaidah tulisan Arab rasm Usmani, khath Tsuluts, Naskhi, Diwani, dan Riq’ah bersertifikat.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'ek-5',
    name: 'Praja Muda Karana (Pramuka Gugus Depan PPJM)',
    category: 'Pramuka',
    coach: 'Kak Ahmad Ridwan (Pembina Gudep)',
    schedule: 'Jumat Pagi, 06:30 - 09:00 WIB',
    location: 'Bumi Perkemahan & Lapangan Hijau PPJM',
    description: 'Pendidikan kepanduan berbasis karakter santri: semaphore, morse, tali temali, penjelajahan alam, dan kepemimpinan bela negara.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  }
];

export const KelolaEkskul: React.FC = () => {
  const [items, setItems] = useState<EkskulItem[]>(INITIAL_EKSKUL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<'Semua' | 'Sains' | 'Olahraga' | 'Seni' | 'Agama' | 'Pramuka'>('Semua');
  const [selectedDetailModal, setSelectedDetailModal] = useState<EkskulItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Sains' | 'Olahraga' | 'Seni' | 'Agama' | 'Pramuka'>('Sains');
  const [coach, setCoach] = useState('');
  const [schedule, setSchedule] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }
    setCompressing(true);
    try {
      const res = await compressImageToWebP(file, 1200, 1200, 0.82);
      setCompressionResult(res);
      setImageUrl(res.dataUrl);
    } catch (err: any) {
      alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setCompressing(false);
    }
  };

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
            data.map((row: any) => ({
              id: row.id,
              name: row.name,
              category: (row.category as any) || 'Sains',
              coach: row.coach || row.mentor_name || 'Pelatih Ekstrakurikuler',
              schedule: row.schedule || 'Sabtu Sore',
              location: row.location || 'Komplek Pondok Pesantren',
              description: row.description || '',
              imageUrl: row.image_url || row.cover_image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
              isActive: row.is_active ?? true,
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
    setCategory('Sains');
    setCoach('');
    setSchedule('');
    setLocation('');
    setDescription('');
    setImageUrl('');
    setCompressionResult(null);
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
    setCompressionResult(null);
    setImageInputMode(item.imageUrl.startsWith('data:image/') ? 'upload' : 'url');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus kegiatan ekstrakurikuler ini?')) {
      setItems(items.filter((i) => i.id !== id));
      if (isSupabaseConfigured() && !id.startsWith('ek-')) {
        try {
          await supabase.from('extracurriculars').delete().eq('id', id);
        } catch (err) {
          console.warn('Failed to delete on Supabase:', err);
        }
      }
      invalidateCache('extracurriculars_list');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const finalImage =
      imageUrl ||
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';

    if (editingId) {
      setItems(
        items.map((i) =>
          i.id === editingId
            ? {
                ...i,
                name,
                category,
                coach,
                schedule,
                location,
                description,
                imageUrl: finalImage,
              }
            : i
        )
      );
    } else {
      const newItem: EkskulItem = {
        id: `ek-${Date.now()}`,
        name,
        category,
        coach,
        schedule,
        location,
        description,
        imageUrl: finalImage,
        isActive: true,
      };
      setItems([...items, newItem]);
    }

    invalidateCache('extracurriculars_list');
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
    resetForm();
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.coach.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Semua' || item.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Pembinaan Bakat &amp; Ekstrakurikuler Santri</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Kelola Ekstrakurikuler (5 Kategori Lengkap)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Pengelolaan jadwal latihan, pelatih, lokasi, dan deskripsi kegiatan santri: Sains, Olahraga, Seni, Agama, dan Pramuka.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-[#0E7A4C]/15 border border-[#0E7A4C] text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#0E7A4C] dark:text-emerald-400" />
          <span>Alhamdulillah, data kegiatan ekstrakurikuler berhasil disimpan!</span>
        </div>
      )}

      {/* Form Input Ekskul */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8A951]" />
            <span>{editingId ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Kegiatan Ekskul: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Robotika & Rekayasa IoT Santri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">5 Kategori Pilihan: *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <option value="Sains">Sains</option>
              <option value="Olahraga">Olahraga</option>
              <option value="Seni">Seni</option>
              <option value="Agama">Agama</option>
              <option value="Pramuka">Pramuka</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Pelatih / Pembina:</label>
            <input
              type="text"
              placeholder="Ust. Hilman M.T."
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Jadwal Latihan:</label>
            <input
              type="text"
              placeholder="Sabtu, 14:00 - 17:00 WIB"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Lokasi Latihan:</label>
            <input
              type="text"
              placeholder="Laboratorium STEM PPJM"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Foto Cover Ekskul dengan Auto WebP Compressor */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#0E7A4C]" />
              <span>Gambar Cover Ekskul (WebP Auto-Compressor):</span>
            </label>
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  imageInputMode === 'upload'
                    ? 'bg-[#0E7A4C] text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <UploadCloud className="w-3 h-3" />
                <span>Dari Komputer</span>
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  imageInputMode === 'url'
                    ? 'bg-[#0E7A4C] text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Tempel URL</span>
              </button>
            </div>
          </div>

          {imageInputMode === 'upload' ? (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={compressing}
                className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-6 h-6 text-[#0E7A4C]" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {compressing ? 'Sedang mengompres gambar ke WebP...' : 'Pilih Foto Cover dari Komputer (Otomatis WebP)'}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Mendukung JPG, PNG, WebP • Otomatis dikompresi agar hemat kuota santri
                </span>
              </button>

              {compressionResult && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Terkompresi: {compressionResult.compressedSizeKB} KB (Hemat {compressionResult.savedPercent}%)</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900">Format WebP</span>
                </div>
              )}
            </div>
          ) : (
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
            />
          )}

          {imageUrl && (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 shrink-0 shadow-xs">
                <img src={imageUrl} alt="Pratinjau Cover" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Pratinjau Cover Terpasang</p>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setCompressionResult(null);
                  }}
                  className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Hapus / Ganti Foto
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Deskripsi Silabus Ekskul:</label>
          <textarea
            rows={2}
            placeholder="Keterangan materi latihan dan sasaran kompetensi santri..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Ekskul'}</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs by 5 Categories */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['Semua', 'Sains', 'Olahraga', 'Seni', 'Agama', 'Pramuka'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filterCat === cat
                  ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {cat === 'Semua' ? 'Semua Ekskul' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari ekskul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          />
        </div>
      </div>

      {/* Ekskul Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-zinc-100">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A2116] text-[#C8A951] border border-[#C8A951]/40">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                  {item.name}
                </h4>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{item.coach}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{item.schedule}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-2">
              <button
                type="button"
                onClick={() => setSelectedDetailModal(item)}
                className="text-xs font-bold text-[#0E7A4C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Detail Ekskul</span>
              </button>

              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(item)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-950/40 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EKSKUL DETAIL MODAL */}
      {selectedDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-2xl bg-[#0A2116] border border-[#C8A951]/40 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#C8A951]">Kategori {selectedDetailModal.category}</span>
                <h3 className="font-extrabold text-base text-white">{selectedDetailModal.name}</h3>
              </div>
              <button onClick={() => setSelectedDetailModal(null)} className="p-1 rounded-md text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10">
              <img src={selectedDetailModal.imageUrl} alt={selectedDetailModal.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs">
              <p><span className="text-zinc-400">Pembina / Pelatih:</span> <strong className="text-[#C8A951]">{selectedDetailModal.coach}</strong></p>
              <p><span className="text-zinc-400">Waktu Latihan:</span> <strong>{selectedDetailModal.schedule}</strong></p>
              <p><span className="text-zinc-400">Lokasi:</span> <strong>{selectedDetailModal.location}</strong></p>
              <p className="text-zinc-300 pt-2 leading-relaxed">{selectedDetailModal.description}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedDetailModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0E7A4C] text-[#C8A951]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default KelolaEkskul;
