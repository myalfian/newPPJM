import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Upload,
  Image as ImageIcon,
  Share2,
  CheckCircle2,
  Sparkles,
  Bold,
  Italic,
  AlignLeft,
  ArrowRight,
  Send,
  Eye,
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  Filter,
  Calendar,
  X
} from 'lucide-react';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { generateWhatsAppBroadcastUrl } from '../../lib/waFormatter';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { invalidateCache } from '../../lib/queryCache';
import { NewsItem, INITIAL_NEWS } from '../../data/newsData';

export const KelolaBerita: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Warta Pondok');
  const [ringkasan, setRingkasan] = useState('');
  const [isiBerita, setIsiBerita] = useState('');
  const [customThumbnail, setCustomThumbnail] = useState('');
  const [author, setAuthor] = useState('Humas & Media PPJM');
  const [isHeadline, setIsHeadline] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Auto WebP Compression State
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [published, setPublished] = useState(false);
  const [waLink, setWaLink] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load from Supabase on mount
  const loadNews = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setNewsList(
          data.map((row) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            category: row.category,
            summary: row.summary || '',
            content: row.content,
            thumbnail: row.thumbnail || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
            is_pinned: row.is_pinned ?? false,
            is_published: row.is_published ?? true,
            author: row.author || 'Tim Media PPJM',
            created_at: row.created_at,
            date_display: row.created_at
              ? new Date(row.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Terbaru'
          }))
        );
      }
    } catch (err) {
      console.warn('Fallback to local news:', err);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Auto generate friendly slug from title
  const autoSlug = judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, dll).');
      return;
    }

    setCompressing(true);
    try {
      const res = await compressImageToWebP(file);
      setCompressionResult(res);
      setCustomThumbnail(res.dataUrl);
    } catch (e: any) {
      alert('Gagal mengompres gambar: ' + e.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const insertFormat = (tag: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = isiBerita.substring(start, end);

    let replacement = '';
    if (tag === 'bold') replacement = `*${selected || 'Teks Tebal'}*`;
    if (tag === 'italic') replacement = `_${selected || 'Teks Miring'}_`;
    if (tag === 'bullet') replacement = `\n• ${selected || 'Poin Catatan'}`;

    const newText = isiBerita.substring(0, start) + replacement + isiBerita.substring(end);
    setIsiBerita(newText);
  };

  const resetForm = () => {
    setJudul('');
    setKategori('Warta Pondok');
    setRingkasan('');
    setIsiBerita('');
    setCustomThumbnail('');
    setAuthor('Humas & Media PPJM');
    setIsHeadline(false);
    setIsPublished(true);
    setCompressionResult(null);
    setEditingId(null);
    setPublished(false);
    setWaLink(null);
  };

  const handleStartEdit = (news: NewsItem) => {
    setEditingId(news.id);
    setJudul(news.title);
    setKategori(news.category);
    setRingkasan(news.summary);
    setIsiBerita(news.content);
    setCustomThumbnail(news.thumbnail);
    setAuthor(news.author || 'Humas & Media PPJM');
    setIsHeadline(!!news.is_pinned);
    setIsPublished(news.is_published ?? true);
    setCompressionResult(null);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus warta berita ini?')) return;

    setNewsList((prev) => prev.filter((item) => item.id !== id));
    invalidateCache('public-news-list');
    invalidateCache('home-news-items');
    invalidateCache('admin_dashboard_metrics');
    invalidateCache('admin_dashboard_feed');

    if (isSupabaseConfigured() && !id.startsWith('news-')) {
      try {
        await supabase.from('news').delete().eq('id', id);
        setStatusMessage('Berita berhasil dihapus dari sistem.');
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err) {
        console.warn('Failed to delete news from Supabase:', err);
      }
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !isiBerita) {
      alert('Mohon lengkapi judul dan isi berita terlebih dahulu.');
      return;
    }

    const baseSlug = autoSlug || `berita-${Date.now()}`;
    const generatedUniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const finalThumbnail =
      customThumbnail ||
      compressionResult?.dataUrl ||
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

    let effectiveSlug = generatedUniqueSlug;

    if (editingId) {
      const existing = newsList.find((n) => n.id === editingId);
      effectiveSlug = existing?.slug || baseSlug;

      // Update existing
      setNewsList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: judul,
                slug: effectiveSlug,
                category: kategori,
                summary: ringkasan || isiBerita.substring(0, 160) + '...',
                content: isiBerita,
                thumbnail: finalThumbnail,
                author,
                is_pinned: isHeadline,
                is_published: isPublished
              }
            : item
        )
      );

      if (isSupabaseConfigured() && !editingId.startsWith('news-')) {
        try {
          await supabase
            .from('news')
            .update({
              title: judul,
              category: kategori,
              summary: ringkasan || isiBerita.substring(0, 160) + '...',
              content: isiBerita,
              thumbnail: finalThumbnail,
              author,
              is_pinned: isHeadline,
              is_published: isPublished,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingId);
        } catch (err) {
          console.warn('Failed to update news on Supabase:', err);
        }
      }
    } else {
      // Create new
      let createdId = `news-${Date.now()}`;

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('news')
            .insert({
              title: judul,
              slug: generatedUniqueSlug,
              category: kategori,
              summary: ringkasan || isiBerita.substring(0, 160) + '...',
              content: isiBerita,
              thumbnail: finalThumbnail,
              author,
              is_pinned: isHeadline,
              is_published: isPublished
            })
            .select()
            .single();

          if (!error && data?.id) {
            createdId = data.id;
            if (data.slug) {
              effectiveSlug = data.slug;
            }
          }
        } catch (err) {
          console.warn('Failed to insert news to Supabase:', err);
        }
      }

      const newItem: NewsItem = {
        id: createdId,
        title: judul,
        slug: effectiveSlug,
        category: kategori,
        summary: ringkasan || isiBerita.substring(0, 160) + '...',
        content: isiBerita,
        thumbnail: finalThumbnail,
        author,
        is_pinned: isHeadline,
        is_published: isPublished,
        created_at: new Date().toISOString(),
        date_display: 'Hari ini'
      };

      setNewsList([newItem, ...newsList]);
    }

    invalidateCache('public-news-list');
    invalidateCache('home-news-items');
    invalidateCache('admin_dashboard_metrics');
    invalidateCache('admin_dashboard_feed');
    setPublished(true);

    // Generate Instant WhatsApp Broadcast Link with matching slug
    const broadcastUrl = generateWhatsAppBroadcastUrl({
      title: judul,
      category: kategori,
      excerpt: ringkasan || isiBerita.substring(0, 160) + '...',
      targetUrl: `${window.location.origin}/berita/${effectiveSlug}`
    });

    setWaLink(broadcastUrl);
  };

  const filteredNews = newsList.filter(
    (item) =>
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5 text-emerald-800" />
          <span>Manajemen Warta & Berita Terpadu</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Warta & Pengumuman Santri
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Buat, ubah, dan terbitkan warta pesantren langsung ke Supabase dengan kompresi WebP otomatis dan broadcast WhatsApp 1-klik.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('list'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'list'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Daftar Warta ({newsList.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('editor'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'editor'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingId ? 'Edit Warta' : 'Tulis Warta Baru'}</span>
        </button>
      </div>

      {activeTab === 'list' ? (
        /* List View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari judul atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              Total: {filteredNews.length} Berita
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-m3-1 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={news.thumbnail}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-900/90 text-gold-300 text-[11px] font-bold">
                      {news.category}
                    </span>
                    {news.is_pinned && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-[10px] font-black">
                        Utama
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{news.date_display || 'Terbaru'}</span>
                  </div>

                  <h3 className="font-bold text-sm text-emerald-950 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {news.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/berita/${news.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Pratinjau Halaman Publik"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(news)}
                      className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Edit Berita"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(news.id)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : published ? (
        /* Success Screen with WhatsApp Broadcast */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-m3-2 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-emerald-950">
              Alhamdulillah! Warta Berhasil Diterbitkan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Berita berjudul <strong>"{judul}"</strong> telah tersimpan di Supabase dan aktif di portal berita publik.
            </p>
          </div>

          {waLink && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Kirim Pengumuman ke Grup WhatsApp:
              </span>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Buka WhatsApp & Kirim ke Wali Santri</span>
              </a>
              <p className="text-[11px] text-slate-500">
                Pesan sudah terformat rapi dengan tulisan tebal, salam pembuka, dan tautan resmi portal.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setActiveTab('list');
                resetForm();
              }}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Lihat Semua Warta
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 transition-colors"
            >
              Tulis Berita Lainnya
            </button>
          </div>
        </div>
      ) : (
        /* Form Inputs */
        <form onSubmit={handlePublish} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-base text-emerald-950">
              {editingId ? 'Edit Formulir Warta' : 'Formulir Warta Baru'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          {/* Judul Berita */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Judul Berita / Kegiatan: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Haflah Khotmil Qur'an 30 Juz & Wisuda Santri PPJM 2025"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            {autoSlug && (
              <p className="text-[11px] text-slate-400 font-mono">
                Alamat link otomatis: <span className="text-emerald-700 font-semibold">/berita/{autoSlug}</span>
              </p>
            )}
          </div>

          {/* Kategori, Author & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kategori Kabar:</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
              >
                <option value="Warta Pondok">Warta Pondok</option>
                <option value="Agenda Akbar">Agenda Akbar</option>
                <option value="Prestasi Santri">Prestasi Santri</option>
                <option value="Inovasi STEM">Inovasi STEM</option>
                <option value="Pengumuman PSB">Pengumuman PSB</option>
                <option value="Kegiatan Diniyah">Kegiatan Diniyah</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Penulis / Sumber:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Humas & Media PPJM"
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHeadline}
                  onChange={(e) => setIsHeadline(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-700"
                />
                <span className="text-xs font-bold text-slate-700">Headline</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-700"
                />
                <span className="text-xs font-bold text-slate-700">Terbitkan</span>
              </label>
            </div>
          </div>

          {/* Ringkasan Singkat */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Ringkasan / Sinopsis (Tampil di kartu & pesan WhatsApp):
            </label>
            <textarea
              rows={2}
              placeholder="Ringkasan 1-2 kalimat untuk preview pesan WhatsApp..."
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Drag & Drop Photo Uploader with Auto WebP Compressor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Foto Utama (Otomatis WebP Super Ringan):
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40 hover:bg-emerald-50 transition-colors cursor-pointer space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />

              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-950">
                  {compressing ? 'Mengompres foto ke format WebP super ringan...' : 'Pilih atau Seret Foto Dari Perangkat'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Foto otomatis dikonversi ke WebP untuk loading instan santri.
                </p>
              </div>
            </div>

            {/* Auto Compression Feedback Badge */}
            {compressionResult && (
              <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={compressionResult.dataUrl}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-xl border border-emerald-300 flex-shrink-0"
                  />
                  <div>
                    <div className="font-extrabold text-emerald-950">
                      Foto Otomatis Terkompresi Sukses!
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      Ukuran Asli: <span className="line-through">{compressionResult.originalSizeKB} KB</span> ➔ 
                      <strong className="text-emerald-900 ml-1">{compressionResult.compressedSizeKB} KB</strong>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-black text-xs self-start sm:self-center">
                  Hemat {compressionResult.savedPercent}% Kuota
                </span>
              </div>
            )}
          </div>

          {/* Simple Word/WhatsApp Style Editor Toolbar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Isi Lengkap Berita / Narasi: <span className="text-rose-500">*</span>
              </label>

              {/* Formatting Toolbar Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => insertFormat('bold')}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs font-bold"
                  title="Tebalkan Teks (*tebal*)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('italic')}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs font-italic"
                  title="Miringkan Teks (_miring_)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('bullet')}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs"
                  title="Tambah Poin (•)"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              rows={8}
              required
              placeholder="Ketik narasi berita di sini. Anda dapat menggunakan format mirip WhatsApp seperti *kata tebal* atau _kata miring_..."
              value={isiBerita}
              onChange={(e) => setIsiBerita(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed font-sans"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Setelah disimpan, link WhatsApp untuk wali santri akan langsung siap dibagikan.
            </span>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all min-h-[48px]"
            >
              <Send className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
