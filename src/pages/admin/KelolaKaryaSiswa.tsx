import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  BookOpen,
  Music,
  Heart,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Play,
  Tag,
  RefreshCw,
  FileText,
  Eye,
  PlusCircle,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { KARYA_SISWA_ITEMS, KaryaSiswaItem } from '../../data/karyaSiswaData';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { WordLikeEditor } from '../../components/editor/WordLikeEditor';

type CategoryType = 'buku' | 'batik' | 'video-lagu-batik' | 'video-lagu-ustad' | 'showroom';

const CATEGORY_OPTIONS: { id: CategoryType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'buku', label: 'Flyer Buku Santri', icon: BookOpen },
  { id: 'batik', label: 'Katalog Batik Tulis', icon: Palette },
  { id: 'video-lagu-batik', label: 'Video Lagu Batik', icon: Music },
  { id: 'video-lagu-ustad', label: 'Lagu Ustadz Shobirin', icon: Heart },
  { id: 'showroom', label: 'Show Room Santri', icon: Sparkles }
];

export const KelolaKaryaSiswa: React.FC = () => {
  const [items, setItems] = useState<KaryaSiswaItem[]>(() => {
    try {
      const cached = localStorage.getItem('ppjm_karya_siswa_cache');
      if (cached) return JSON.parse(cached);
    } catch {}
    return KARYA_SISWA_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<'all' | CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedAlert, setSavedAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Form Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form fields
  const [fTitle, setFTitle] = useState('');
  const [fCategory, setFCategory] = useState<CategoryType>('buku');
  const [fAuthor, setFAuthor] = useState('');
  const [fAuthorRole, setFAuthorRole] = useState('');
  const [fYear, setFYear] = useState(new Date().getFullYear().toString());
  const [fDescription, setFDescription] = useState('');
  const [fImageUrl, setFImageUrl] = useState('');
  const [fVideoUrl, setFVideoUrl] = useState('');
  const [fPdfUrl, setFPdfUrl] = useState('');
  const [fTags, setFTags] = useState('');
  const [fSpecs, setFSpecs] = useState<{ key: string; val: string }[]>([
    { key: 'Format', val: '' }
  ]);
  const [fOrderIndex, setFOrderIndex] = useState(1);

  // Upload state
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from Supabase site_settings on mount
  useEffect(() => {
    const fetchCloudData = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'karya_siswa')
          .maybeSingle();

        if (!error && data && data.value && Array.isArray(data.value)) {
          setItems(data.value as unknown as KaryaSiswaItem[]);
          localStorage.setItem('ppjm_karya_siswa_cache', JSON.stringify(data.value));
        }
      } catch (err) {
        console.warn('Error loading karya_siswa from site_settings:', err);
      }
    };
    fetchCloudData();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('karya-siswa-site-settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings', filter: 'key=eq.karya_siswa' },
        (payload: any) => {
          if (payload.new && payload.new.value && Array.isArray(payload.new.value)) {
            setItems(payload.new.value);
            localStorage.setItem('ppjm_karya_siswa_cache', JSON.stringify(payload.new.value));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save changes to Supabase & localStorage
  const handleSaveToCloud = async (newItemsList: KaryaSiswaItem[]) => {
    setIsSaving(true);
    setSavedAlert(null);
    setErrorAlert(null);
    try {
      // 1. Save to localStorage
      localStorage.setItem('ppjm_karya_siswa_cache', JSON.stringify(newItemsList));
      window.dispatchEvent(new CustomEvent('ppjm-karya-siswa-updated', { detail: newItemsList }));

      // 2. Upsert to Supabase site_settings
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('site_settings').upsert(
          {
            key: 'karya_siswa',
            value: newItemsList as any,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );

        if (error) {
          console.error('Supabase site_settings error:', error);
          setErrorAlert(`Gagal simpan ke Supabase (${error.message}). Data disimpan di cache lokal browser.`);
          return;
        }
      }

      setSavedAlert('Alhamdulillah! Perubahan konten Karya Siswa berhasil disimpan & tersinkronisasi langsung ke halaman publik!');
      setTimeout(() => setSavedAlert(null), 4000);
    } catch (err: any) {
      setErrorAlert(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    setEditingItemId(null);
    setFTitle('');
    setFCategory('buku');
    setFAuthor('');
    setFAuthorRole('Santri SMP Plus Jauharul Maknuun');
    setFYear(new Date().getFullYear().toString());
    setFDescription('');
    setFImageUrl('');
    setFVideoUrl('');
    setFPdfUrl('');
    setFTags('');
    setFSpecs([{ key: 'Format', val: '' }]);
    setFOrderIndex(items.length + 1);
    setCompressionResult(null);
  };

  const handleOpenAdd = () => {
    handleResetForm();
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: KaryaSiswaItem) => {
    setEditingItemId(item.id);
    setFTitle(item.title);
    setFCategory(item.category);
    setFAuthor(item.author);
    setFAuthorRole(item.authorRole || '');
    setFYear(item.year || '');
    setFDescription(item.description || '');
    setFImageUrl(item.imageUrl || '');
    setFVideoUrl(item.videoUrl || '');
    setFPdfUrl(item.pdfUrl || '');
    setFTags(item.tags ? item.tags.join(', ') : '');

    if (item.specs && Object.keys(item.specs).length > 0) {
      setFSpecs(Object.entries(item.specs).map(([key, val]) => ({ key, val })));
    } else {
      setFSpecs([{ key: 'Format', val: '' }]);
    }

    setFOrderIndex(item.orderIndex || 1);
    setShowFormModal(true);
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus karya "${title}"?`)) return;
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    await handleSaveToCloud(updated);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle.trim() || !fAuthor.trim()) {
      alert('Judul dan Nama Penulis / Kreator wajib diisi!');
      return;
    }

    // Convert specs array to object
    const specsObj: Record<string, string> = {};
    fSpecs.forEach((s) => {
      if (s.key.trim() && s.val.trim()) {
        specsObj[s.key.trim()] = s.val.trim();
      }
    });

    // Parse tags
    const tagsArr = fTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: KaryaSiswaItem = {
      id: editingItemId || `karya-${Date.now()}`,
      title: fTitle.trim(),
      category: fCategory,
      author: fAuthor.trim(),
      authorRole: fAuthorRole.trim() || 'Santri PP. Jauharul Maknuun',
      year: fYear.trim() || new Date().getFullYear().toString(),
      description: fDescription.trim(),
      imageUrl: fImageUrl.trim(),
      videoUrl: fVideoUrl.trim() || undefined,
      pdfUrl: fPdfUrl.trim() || undefined,
      specs: Object.keys(specsObj).length > 0 ? specsObj : undefined,
      tags: tagsArr.length > 0 ? tagsArr : ['Karya Santri'],
      orderIndex: fOrderIndex || 1
    };

    let updated: KaryaSiswaItem[];
    if (editingItemId) {
      updated = items.map((i) => (i.id === editingItemId ? newItem : i));
    } else {
      updated = [newItem, ...items];
    }

    setItems(updated);
    setShowFormModal(false);
    handleResetForm();
    await handleSaveToCloud(updated);
  };

  // Image Upload with WebP Compressor
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressImageToWebP(file, 1600, 1600, 0.85);
      setCompressionResult(result);

      if (isSupabaseConfigured()) {
        const fileExt = 'webp';
        const fileName = `karya_${Date.now()}.${fileExt}`;
        const filePath = `karya-siswa/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('cms-images')
          .upload(filePath, result.file, {
            contentType: 'image/webp',
            upsert: true
          });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from('cms-images')
            .getPublicUrl(filePath);
          setFImageUrl(publicUrlData.publicUrl);
        } else {
          // Fallback data URL
          setFImageUrl(result.dataUrl);
        }
      } else {
        setFImageUrl(result.dataUrl);
      }
    } catch (err: any) {
      alert(`Gagal memproses gambar: ${err.message}`);
    } finally {
      setCompressing(false);
    }
  };

  const handleResetToDefault = async () => {
    if (
      !window.confirm(
        'Peringatan: Seluruh data karya siswa akan di-reset ke data default awal (Buku, Batik Lasem, Lagu Santri, Showroom). Lanjutkan?'
      )
    )
      return;
    setItems(KARYA_SISWA_ITEMS);
    await handleSaveToCloud(KARYA_SISWA_ITEMS);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchCat = activeTab === 'all' || item.category === activeTab;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0E7A4C] via-[#095736] to-[#042818] text-white p-4 sm:p-6 shadow-md border border-[#C8A951]/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-[#C8A951]/40 text-[#C8A951] text-xs font-bold tracking-wide">
              <Palette className="w-3.5 h-3.5" />
              <span>Manajemen Konten Publik • Page Karya Siswa</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Kelola Galeri &amp; Etalase Karya Siswa
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Pusat kelola seluruh etalase literatur buku karya santri, kriya batik tulis Lasem, video klip lagu orisinal, lagu khidmat Ustadz Shobirin, serta showroom inovasi santri.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <a
              href="/karya-siswa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A951]" />
              <span>Lihat Halaman Publik</span>
            </a>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#C8A951] hover:bg-[#b0923f] text-[#042818] font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Karya Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Notification Alerts */}
      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedAlert}</span>
        </div>
      )}

      {errorAlert && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorAlert}</span>
        </div>
      )}

      {/* 3. Filter Bar & Search */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Kategori</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
              {items.length}
            </span>
          </button>

          {CATEGORY_OPTIONS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            const count = items.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Reset Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, karya batik, judul video lagu, atau nama santri..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#0E7A4C] focus:ring-1 focus:ring-[#0E7A4C] transition shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            title="Reset ke konten kurasi awal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* 4. Items List Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 space-y-2">
          <Palette className="w-10 h-10 text-zinc-400 mx-auto" />
          <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">
            Tidak ada karya siswa yang sesuai kriteria pencarian
          </h4>
          <p className="text-xs text-zinc-500">
            Klik tombol &quot;Tambah Karya Baru&quot; di atas untuk memasukkan karya santri.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredItems.map((item) => {
            const isVideo = item.category === 'video-lagu-batik' || item.category === 'video-lagu-ustad';

            return (
              <article
                key={item.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 space-y-1">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span className="text-[10px]">Tanpa Foto</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

                    {/* Category Tag */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-black/70 text-[#C8A951] border border-[#C8A951]/40 backdrop-blur-md">
                      {item.category === 'buku' && 'Flyer Buku Santri'}
                      {item.category === 'batik' && 'Katalog Batik Lasem'}
                      {item.category === 'video-lagu-batik' && 'Video Lagu Batik'}
                      {item.category === 'video-lagu-ustad' && 'Lagu Ustadz Shobirin'}
                      {item.category === 'showroom' && 'Show Room Inovasi'}
                    </span>

                    {/* Play Badge if Video */}
                    {isVideo && (
                      <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    )}

                    {/* Year pill */}
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      Tahun {item.year}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase block">
                        {item.authorRole || 'Santri PPJM'}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white line-clamp-2 mt-0.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-medium">
                        Karya: <strong className="text-zinc-700 dark:text-zinc-300">{item.author}</strong>
                      </p>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
                          >
                            <Tag className="w-2.5 h-2.5 text-emerald-600" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0E7A4C]/10 hover:bg-[#0E7A4C]/20 text-[#0E7A4C] dark:text-emerald-400 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-zinc-400 font-mono">
                    Urutan: #{item.orderIndex}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 5. ADD / EDIT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-text">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#0E7A4C] dark:text-emerald-400" />
                <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                  {editingItemId ? 'Edit Karya Siswa' : 'Tambah Karya Siswa Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Category & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Kategori Karya: *
                  </label>
                  <select
                    value={fCategory}
                    onChange={(e) => setFCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-xs"
                  >
                    <option value="buku">📖 Flyer Buku buatan Santri</option>
                    <option value="batik">🎨 Katalog Batik Tulis Lasem</option>
                    <option value="video-lagu-batik">🎵 Video Lagu Batik Santri</option>
                    <option value="video-lagu-ustad">❤️ Video Lagu Ustadz Shobirin</option>
                    <option value="showroom">✨ Show Room Inovasi Santri</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Tahun Terbit / Pembuatan:
                  </label>
                  <input
                    type="text"
                    value={fYear}
                    onChange={(e) => setFYear(e.target.value)}
                    placeholder="Contoh: 2026"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Judul Karya / Katalog / Lagu: *
                </label>
                <input
                  type="text"
                  required
                  value={fTitle}
                  onChange={(e) => setFTitle(e.target.value)}
                  placeholder="Contoh: Buku Antologi: Mengakar di Salaf, Menjulang di Sains"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-xs sm:text-sm"
                />
              </div>

              {/* Author & Author Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Nama Penulis / Kreator Santri: *
                  </label>
                  <input
                    type="text"
                    required
                    value={fAuthor}
                    onChange={(e) => setFAuthor(e.target.value)}
                    placeholder="Contoh: Ahmad Zaki & Tim Penulis Santri"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Peran / Kelas Santri:
                  </label>
                  <input
                    type="text"
                    value={fAuthorRole}
                    onChange={(e) => setFAuthorRole(e.target.value)}
                    placeholder="Contoh: Santri Kelas IX SMP Plus JM"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Deskripsi / Sinopsis Lengkap Karya:
                </label>
                <textarea
                  rows={4}
                  value={fDescription}
                  onChange={(e) => setFDescription(e.target.value)}
                  placeholder="Ceritakan latar belakang karya, makna filosofis, isi buku, proses membatik, atau sinopsis lagu..."
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs leading-relaxed"
                />
              </div>

              {/* Photo Upload (Auto WebP) */}
              <div className="space-y-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Foto Sampul / Cover / Flyer (Otomatis WebP):</span>
                  {compressing && <span className="text-xs text-amber-600 animate-pulse">Mengompres ke WebP...</span>}
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-1/2 p-3 border-2 border-dashed border-[#0E7A4C]/40 hover:border-[#0E7A4C] rounded-xl text-center cursor-pointer transition bg-white dark:bg-zinc-900"
                  >
                    <UploadCloud className="w-6 h-6 text-[#0E7A4C] mx-auto mb-1" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Pilih File Foto</span>
                    <span className="text-[10px] text-zinc-400">JPG, PNG, WebP (Maks 10MB)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="w-full sm:w-1/2 space-y-1">
                    <span className="text-[11px] text-zinc-500 font-medium">Atau masukkan URL gambar langsung:</span>
                    <input
                      type="text"
                      value={fImageUrl}
                      onChange={(e) => setFImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
                    />
                    {fImageUrl && (
                      <div className="relative aspect-[16/9] w-28 rounded-lg overflow-hidden border border-zinc-200 mt-1">
                        <img src={fImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {compressionResult && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ Terkompres WebP: {compressionResult.originalSizeKB} KB → {compressionResult.compressedSizeKB} KB (-{compressionResult.savedPercent}%)
                  </p>
                )}
              </div>

              {/* Video URL (If applicable) */}
              {(fCategory === 'video-lagu-batik' || fCategory === 'video-lagu-ustad' || fCategory === 'showroom') && (
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>URL Video YouTube / Embed:</span>
                  </label>
                  <input
                    type="text"
                    value={fVideoUrl}
                    onChange={(e) => setFVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs"
                  />
                </div>
              )}

              {/* Specs Key-Value Builder */}
              <div className="space-y-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Spesifikasi / Detail Teknis Karya:
                  </label>
                  <button
                    type="button"
                    onClick={() => setFSpecs([...fSpecs, { key: '', val: '' }])}
                    className="text-xs text-[#0E7A4C] dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Spesifikasi
                  </button>
                </div>

                <div className="space-y-1.5">
                  {fSpecs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => {
                          const updated = [...fSpecs];
                          updated[idx].key = e.target.value;
                          setFSpecs(updated);
                        }}
                        placeholder="Label (contoh: Bahan / ISBN / Ukuran)"
                        className="w-1/2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
                      />
                      <input
                        type="text"
                        value={spec.val}
                        onChange={(e) => {
                          const updated = [...fSpecs];
                          updated[idx].val = e.target.value;
                          setFSpecs(updated);
                        }}
                        placeholder="Nilai (contoh: Katun Primissima / 220 Hlm)"
                        className="w-1/2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
                      />
                      {fSpecs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFSpecs(fSpecs.filter((_, i) => i !== idx))}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Tagar / Label (Pisahkan dengan koma):
                  </label>
                  <input
                    type="text"
                    value={fTags}
                    onChange={(e) => setFTags(e.target.value)}
                    placeholder="Batik Lasem, Karya Santri, Buku"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Nomor Urutan Tampil (Order):
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={fOrderIndex}
                    onChange={(e) => setFOrderIndex(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : editingItemId ? 'Perbarui Karya' : 'Simpan Karya Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaKaryaSiswa;

