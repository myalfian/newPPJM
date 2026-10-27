import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  PlusCircle,
  CheckCircle2,
  Upload,
  Trash2,
  Edit3,
  Calendar,
  Search,
  Video,
  X
} from 'lucide-react';
import { YoutubeIcon } from '../../components/common/SocialIcons';
import { compressImageToWebP } from '../../lib/imageCompressor';
import type { CompressionResult } from '../../lib/imageCompressor';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';

export interface GalleryAdminItem {
  id: string;
  slug: string;
  title: string;
  category: 'foto' | 'video';
  event_date: string;
  description: string;
  cover_image?: string;
  video_url?: string;
}

const INITIAL_GALLERY_ITEMS: GalleryAdminItem[] = [
  {
    id: 'g1',
    slug: 'wisuda-tahfidz-30-juz-2025',
    title: 'Haflah Akhirussanah & Wisuda Akbar Tahfidz 30 Juz 2025',
    category: 'foto',
    event_date: '2025-05-12',
    description: 'Dokumentasi momen sakral wisuda santri mutqin 30 juz disaksikan para masyaikh, habaib, dan wali santri.',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g2',
    slug: 'kajian-turats-ramadhan',
    title: 'Halaqah Pengajian Kitab Fathul Qorib & Turats Ulama Salaf',
    category: 'foto',
    event_date: '2025-03-24',
    description: 'Suasana pembacaan kitab kuning gandul ba\'da Ashar di serambi masjid utama pesantren.',
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g3',
    slug: 'pameran-stem-santri',
    title: 'Ekspo Karya Inovasi STEM & Sains Terapan Santri PPJM',
    category: 'foto',
    event_date: '2024-11-18',
    description: 'Pameran alat otomasi irigasi kebun, robot line follower, dan alat purifier air minum hasil karya riset mandiri santri.',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gv1',
    slug: 'profil-ppjm-2025',
    title: 'Profil Resmi Pondok Pesantren Jauharul Maknuun Lasem',
    category: 'video',
    event_date: '2025-01-10',
    description: 'Mengenal lebih dekat sistem pendidikan terpadu salafiyah, tahfidz mutqin, dan sains teknologi PPJM.',
    video_url: 'dQw4w9WgXcQ',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  }
];

export const KelolaGaleri: React.FC = () => {
  const [items, setItems] = useState<GalleryAdminItem[]>(INITIAL_GALLERY_ITEMS);
  const [tab, setTab] = useState<'foto' | 'video'>('foto');
  const [filterType, setFilterType] = useState<'all' | 'foto' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [compResult, setCompResult] = useState<CompressionResult | null>(null);

  const [saved, setSaved] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    const loadGalleries = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('galleries')
          .select('*')
          .order('event_date', { ascending: false });

        if (!error && data && data.length > 0) {
          setItems(
            data.map((row) => ({
              id: row.id,
              slug: row.slug,
              title: row.title,
              category: (row.category as 'foto' | 'video') || 'foto',
              event_date: row.event_date || new Date().toISOString().split('T')[0],
              description: row.description || '',
              cover_image: row.cover_image || undefined,
              video_url: row.video_url || undefined,
            }))
          );
        }
      } catch (err) {
        console.warn('Fallback to local gallery data:', err);
      }
    };
    loadGalleries();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const res = await compressImageToWebP(e.target.files[0]);
      setCompResult(res);
      setCoverImageUrl(res.dataUrl);
    }
  };

  const resetForm = () => {
    setJudul('');
    setTanggal('');
    setDeskripsi('');
    setVideoUrl('');
    setCoverImageUrl('');
    setCompResult(null);
    setEditingId(null);
  };

  const handleStartEdit = (item: GalleryAdminItem) => {
    setEditingId(item.id);
    setTab(item.category);
    setJudul(item.title);
    setTanggal(item.event_date);
    setDeskripsi(item.description);
    setVideoUrl(item.video_url || '');
    setCoverImageUrl(item.cover_image || '');
    setCompResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus album media ini?')) return;

    setItems((prev) => prev.filter((it) => it.id !== id));

    if (isSupabaseConfigured() && !id.startsWith('g')) {
      try {
        await supabase.from('galleries').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete gallery item from Supabase:', err);
      }
    }

    // Invalidate gallery caches
    invalidateCache('galleries_foto_list');
    invalidateCache('galleries_video_list');
    invalidateCache('admin_dashboard_metrics');
    invalidateCache('admin_dashboard_feed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul) return;

    const finalDate = tanggal || new Date().toISOString().split('T')[0];
    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalCover = coverImageUrl || compResult?.dataUrl || (
      tab === 'foto'
        ? 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    );

    if (editingId) {
      // Edit existing
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? {
                ...it,
                title: judul,
                category: tab,
                event_date: finalDate,
                description: deskripsi,
                cover_image: finalCover,
                video_url: tab === 'video' ? videoUrl : undefined,
              }
            : it
        )
      );

      if (isSupabaseConfigured() && !editingId.startsWith('g')) {
        try {
          await supabase
            .from('galleries')
            .update({
              title: judul,
              category: tab,
              event_date: finalDate,
              description: deskripsi,
              cover_image: finalCover,
              video_url: tab === 'video' ? videoUrl : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', editingId);
        } catch (err) {
          console.warn('Failed to update gallery on Supabase:', err);
        }
      }
    } else {
      // Create new
      let createdId = `g-${Date.now()}`;

      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from('galleries')
            .insert({
              category: tab,
              title: judul,
              slug: `${slug}-${Date.now()}`,
              event_date: finalDate,
              description: deskripsi,
              cover_image: finalCover,
              video_url: tab === 'video' ? videoUrl : null,
            })
            .select()
            .single();

          if (data?.id) {
            createdId = data.id;
          }
        } catch (err) {
          console.warn('Failed to insert gallery to Supabase:', err);
        }
      }

      const newItem: GalleryAdminItem = {
        id: createdId,
        slug: `${slug}-${Date.now()}`,
        title: judul,
        category: tab,
        event_date: finalDate,
        description: deskripsi,
        cover_image: finalCover,
        video_url: tab === 'video' ? videoUrl : undefined,
      };

      setItems((prev) => [newItem, ...prev]);
    }

    // Invalidate caches
    invalidateCache('galleries_foto_list');
    invalidateCache('galleries_video_list');
    invalidateCache('admin_dashboard_metrics');
    invalidateCache('admin_dashboard_feed');

    setSaved(true);
    resetForm();
    setTimeout(() => setSaved(false), 3000);
  };

  const filteredItems = items.filter((it) => {
    const matchType = filterType === 'all' || it.category === filterType;
    const matchSearch =
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
          <span>Manajemen Galeri Dokumentasi</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
          Upload Foto Agenda & Tautan Video Santri
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Unggah dokumentasi foto kegiatan pesantren (otomatis WebP) atau tambahkan video YouTube, Instagram Reels, dan TikTok resmi PPJM.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Alhamdulillah, dokumentasi galeri berhasil disimpan & cache disinkronkan!</span>
          </div>
          <button onClick={() => setSaved(false)} className="text-emerald-800 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mode / Category Switcher for Form */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setTab('foto');
              if (!editingId) resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'foto'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            1. Form Agenda Foto
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('video');
              if (!editingId) resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'video'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
            }`}
          >
            2. Form Video & Reels
          </button>
        </div>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 dark:border-rose-900/60 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 transition"
          >
            Batal Edit
          </button>
        )}
      </div>

      {/* Form Foto & Video Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {editingId ? `Edit Metadata ${tab === 'foto' ? 'Foto' : 'Video'}` : `Tambah ${tab === 'foto' ? 'Agenda Foto Baru' : 'Tautan Video Baru'}`}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Kategori: {tab.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Judul {tab === 'foto' ? 'Agenda Kegiatan' : 'Video'}: *
            </label>
            <input
              type="text"
              required
              placeholder={tab === 'foto' ? "Haflah Akhirussanah & Khotmil Qur'an 2026" : "Video Profil Kehidupan Santri PPJM Lasem"}
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Tanggal Kegiatan: *
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {tab === 'video' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Tautan YouTube / Reels Video: *
            </label>
            <div className="relative">
              <YoutubeIcon className="w-4 h-4 text-rose-600 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="https://www.youtube.com/watch?v=... atau YouTube Video ID"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
            {tab === 'foto' ? 'Pilih Foto Sampul Agenda (WebP Auto-Compress):' : 'URL Cover Thumbnail (Opsional):'}
          </label>
          <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-6 text-center bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <Upload className="w-7 h-7 text-emerald-700 dark:text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-semibold">
              Pilih foto resolusi tinggi (otomatis dikompresi ke format WebP hemat kuota)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-800 file:text-white file:font-bold cursor-pointer"
            />
          </div>

          {compResult && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/70 rounded-xl text-xs text-emerald-950 dark:text-emerald-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Foto berhasil dioptimalkan menjadi {compResult.compressedSizeKB} KB (Hemat {compResult.savedPercent}%)</span>
            </div>
          )}

          {coverImageUrl && (
            <div className="flex items-center gap-3 pt-1">
              <img
                src={coverImageUrl}
                alt="Preview"
                className="w-16 h-12 object-cover rounded-lg border border-slate-200 dark:border-zinc-700"
              />
              <span className="text-[11px] text-zinc-400">Sampul aktif terpilih</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
            Deskripsi &amp; Narasi Media: *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Keterangan singkat momen dokumentasi..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white leading-relaxed focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingId ? 'Simpan Perubahan' : tab === 'foto' ? 'Simpan Agenda Foto' : 'Simpan & Tayangkan Video'}</span>
          </button>
        </div>
      </form>

      {/* LIST GRID OF EXISTING MEDIA */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
              Daftar Dokumentasi Galeri &amp; Video Pesantren
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kelola, edit narasi, atau hapus media yang telah dipublikasikan
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterType === 'all' ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-white shadow-2xs' : 'text-zinc-500'
                }`}
              >
                Semua ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('foto')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterType === 'foto' ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-white shadow-2xs' : 'text-zinc-500'
                }`}
              >
                Foto
              </button>
              <button
                type="button"
                onClick={() => setFilterType('video')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterType === 'video' ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-white shadow-2xs' : 'text-zinc-500'
                }`}
              >
                Video
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari dokumentasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isVideo = item.category === 'video';
            const imgUrl = item.cover_image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col justify-between group hover:border-emerald-500 transition-all shadow-2xs"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${isVideo ? 'bg-rose-600' : 'bg-emerald-700'}`}>
                        {isVideo ? 'Video' : 'Foto'}
                      </span>
                    </div>
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.event_date}</span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Toolbar */}
                <div className="p-3 pt-0 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
                    title="Edit Metadata"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                    title="Hapus Album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-xs text-zinc-400">
            Tidak ada dokumentasi yang cocok dengan kriteria pencarian.
          </div>
        )}
      </div>
    </div>
  );
};
