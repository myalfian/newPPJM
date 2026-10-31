import React, { useState, useEffect } from 'react';
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
  X,
  User,
  Filter,
  Layers,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

export interface PrestasiItem {
  id: string;
  title: string;
  santriName: string;
  category: string;
  level: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten';
  year: string;
  pembina: string;
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
    pembina: 'Ust. Hilman, M.T. (Lab STEM PPJM)',
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
    pembina: 'KH. Muhammad Jauharul Maknuun',
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
    pembina: 'Ustadz Muhammad Syukron, M.Pd.',
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
    pembina: 'Pendekar M. Syamsul Huda',
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
  const [filterYear, setFilterYear] = useState('Semua');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedDetail, setSelectedDetail] = useState<PrestasiItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [santriName, setSantriName] = useState('');
  const [category, setCategory] = useState('Robotika / STEM');
  const [level, setLevel] = useState<'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten'>('Nasional');
  const [year, setYear] = useState('2026');
  const [pembina, setPembina] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('year', { ascending: false });

        if (!error && data && data.length > 0) {
          setItems(
            data.map((row: any) => ({
              id: row.id,
              title: row.title,
              santriName: row.winner_name || row.student_name || 'Santri PPJM',
              category: row.category || 'Prestasi',
              level: (row.medal_type || row.level || 'Nasional') as any,
              year: String(row.year || '2025'),
              pembina: row.coach || 'Dewan Pembina PPJM',
              description: row.description || '',
              imageUrl: row.certificate_url || row.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
              isPublished: true,
            }))
          );
        }
      } catch (err) {
        console.warn('Fallback to local achievements:', err);
      }
    };
    loadFromSupabase();
  }, []);

  const resetForm = () => {
    setTitle('');
    setSantriName('');
    setCategory('Robotika / STEM');
    setLevel('Nasional');
    setYear('2026');
    setPembina('');
    setDescription('');
    setImageUrl('');
    setEditingId(null);
  };

  const handleEdit = (p: PrestasiItem) => {
    setEditingId(p.id);
    setTitle(p.title);
    setSantriName(p.santriName);
    setCategory(p.category);
    setLevel(p.level);
    setYear(p.year);
    setPembina(p.pembina || '');
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
      setItems(items.filter((item) => item.id !== id));
      if (isSupabaseConfigured() && !id.startsWith('pr-')) {
        try {
          await supabase.from('achievements').delete().eq('id', id);
        } catch (err) {
          console.warn('Failed to delete on Supabase:', err);
        }
      }
      invalidateCache('achievements_list');
      invalidateCache('admin_dashboard_metrics_v2');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !santriName) return;

    const finalImage =
      imageUrl ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
    const finalPembina = pembina || 'Dewan Asatidz & Pembina Prestasi PPJM';

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                santriName,
                category,
                level,
                year,
                pembina: finalPembina,
                description,
                imageUrl: finalImage,
              }
            : item
        )
      );

      if (isSupabaseConfigured() && !editingId.startsWith('pr-')) {
        try {
          await supabase
            .from('achievements')
            .update({
              title,
              winner_name: santriName,
              category,
              medal_type: level,
              year: parseInt(year, 10) || 2026,
              description,
              certificate_url: finalImage,
            } as any)
            .eq('id', editingId);
        } catch (err) {
          console.warn('Failed to update achievement:', err);
        }
      }
    } else {
      let createdId = `pr-${Date.now()}`;
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from('achievements')
            .insert({
              title,
              winner_name: santriName,
              category,
              medal_type: level,
              year: parseInt(year, 10) || 2026,
              description,
              certificate_url: finalImage,
            } as any)
            .select()
            .single();

          if (data?.id) {
            createdId = data.id;
          }
        } catch (err) {
          console.warn('Failed to insert achievement:', err);
        }
      }

      const newItem: PrestasiItem = {
        id: createdId,
        title,
        santriName,
        category,
        level,
        year,
        pembina: finalPembina,
        description,
        imageUrl: finalImage,
        isPublished: true,
      };

      setItems([newItem, ...items]);
    }

    invalidateCache('achievements_list');
    invalidateCache('admin_dashboard_metrics_v2');
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
    resetForm();
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.santriName.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Semua' || item.category === filterCat;
    const matchYear = filterYear === 'Semua' || item.year === filterYear;
    return matchSearch && matchCat && matchYear;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40">
            <Trophy className="w-3.5 h-3.5" />
            <span>Katalog Piagam &amp; Kejuaraan Santri PPJM</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Kelola Prestasi Santri &amp; Piagam Penghargaan
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Pusat arsip piagam kejuaraan sains, tahfidz 30 juz, MQK kitab kuning, dan olahraga silat santri dengan visual PrestasiCard Lux.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-[#0E7A4C]/15 border border-[#0E7A4C] text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#0E7A4C] dark:text-emerald-400" />
          <span>Alhamdulillah, data prestasi santri berhasil disimpan dan disinkronkan ke website publik!</span>
        </div>
      )}

      {/* Form Input Prestasi */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C8A951]" />
            <span>{editingId ? 'Edit Data Prestasi Santri' : 'Input Piagam Kejuaraan Baru'}</span>
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
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Kejuaraan / Prestasi: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Juara 1 Robotika Line Follower Santri Jatim"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Santri / Tim Peraih: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Ahmad Zaki & Muhammad Iqbal"
              value={santriName}
              onChange={(e) => setSantriName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Kategori Bidang:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <option value="Robotika / STEM">Robotika / STEM</option>
              <option value="Tahfidz 30 Juz">Tahfidz 30 Juz</option>
              <option value="Kitab Kuning / MQK">Kitab Kuning / MQK</option>
              <option value="Seni & Bahasa">Seni &amp; Bahasa</option>
              <option value="Olahraga & Silat">Olahraga &amp; Silat</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Tingkat Kejuaraan:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <option value="Kabupaten">Kabupaten</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Tahun Capaian:</label>
            <input
              type="text"
              placeholder="2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Guru Pembina / Mentor:</label>
            <input
              type="text"
              placeholder="Ust. Hilman M.T."
              value={pembina}
              onChange={(e) => setPembina(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">URL Foto Dokumentasi / Piagam:</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Deskripsi Ringkas:</label>
          <textarea
            rows={2}
            placeholder="Keterangan jalannya perlombaan atau medali yang diraih..."
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
            <span>{editingId ? 'Simpan Perubahan Prestasi' : 'Terbitkan Prestasi Santri'}</span>
          </button>
        </div>
      </form>

      {/* Filter & View Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari prestasi / nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Robotika / STEM">Robotika / STEM</option>
            <option value="Tahfidz 30 Juz">Tahfidz 30 Juz</option>
            <option value="Kitab Kuning / MQK">Kitab Kuning / MQK</option>
            <option value="Olahraga & Silat">Olahraga &amp; Silat</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-xl text-xs font-bold cursor-pointer ${
              viewMode === 'card' ? 'bg-[#0E7A4C] text-[#C8A951]' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="PrestasiCard Lux Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl text-xs font-bold cursor-pointer ${
              viewMode === 'table' ? 'bg-[#0E7A4C] text-[#C8A951]' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Tabel View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRESTASICARD LUX GRID VIEW */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((pres) => (
            <div
              key={pres.id}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-[#C8A951]/30 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-zinc-100">
                  <img src={pres.imageUrl} alt={pres.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#0A2116] text-[#C8A951] border border-[#C8A951]/40">
                      Tingkat {pres.level}
                    </span>
                  </div>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 text-white">
                    {pres.year}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E7A4C] dark:text-emerald-400">
                    {pres.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug line-clamp-2">
                    {pres.title}
                  </h4>
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Peraih: <span className="text-[#C8A951]">{pres.santriName}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Pembimbing: {pres.pembina}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                    {pres.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDetail(pres)}
                  className="text-xs font-bold text-[#0E7A4C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Piagam</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(pres)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pres.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-3">Kejuaraan</th>
                <th className="p-3">Santri Peraih</th>
                <th className="p-3">Tingkat</th>
                <th className="p-3">Tahun</th>
                <th className="p-3">Pembina</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-3 font-bold text-zinc-900 dark:text-white">{item.title}</td>
                  <td className="p-3 text-zinc-700 dark:text-zinc-300">{item.santriName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C8A951]/20 text-[#C8A951]">
                      {item.level}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">{item.year}</td>
                  <td className="p-3 text-zinc-500">{item.pembina}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-zinc-500 hover:text-white">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL PIAGAM MODAL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-2xl bg-[#0A2116] border border-[#C8A951]/40 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#C8A951]">Tingkat {selectedDetail.level} ({selectedDetail.year})</span>
                <h3 className="font-extrabold text-sm text-white">{selectedDetail.title}</h3>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-1 rounded-md text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10">
              <img src={selectedDetail.imageUrl} alt={selectedDetail.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1 text-xs">
              <p><span className="text-zinc-400">Santri Peraih:</span> <strong className="text-[#C8A951]">{selectedDetail.santriName}</strong></p>
              <p><span className="text-zinc-400">Pembina / Mentor:</span> <strong>{selectedDetail.pembina}</strong></p>
              <p className="text-zinc-300 pt-2 leading-relaxed">{selectedDetail.description}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
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
export default KelolaPrestasi;
