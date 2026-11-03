import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGuru, BeritaItem } from './GuruContext';
import { GuruTipTapEditor } from './GuruTipTap';
import {
  Newspaper,
  BookOpen,
  Image as ImageIcon,
  Globe,
  Save,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

const KATEGORI_LIST = [
  'Berita Pesantren',
  'Materi Pembelajaran',
  'Prestasi Santri',
  'Kajian Jauhar',
  'Pengumuman Akademik',
];

export const GuruContentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');

  const { beritaList, saveBeritaContent, uploadGuruFile, showToast } = useGuru();

  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(
    initialTab === 'materi' ? 'Materi Pembelajaran' : 'Berita Pesantren'
  );
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
  );
  const [editorJson, setEditorJson] = useState<any>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Tuliskan isi berita pesantren, artikel kajian, atau modul materi pembelajaran lengkap di sini...',
          },
        ],
      },
    ],
  });
  const [htmlContent, setHtmlContent] = useState<string>(
    '<p>Tuliskan isi berita pesantren, artikel kajian, atau modul materi pembelajaran lengkap di sini...</p>'
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialTab === 'materi' && !editingId) {
      setCategory('Materi Pembelajaran');
    }
  }, [initialTab, editingId]);

  const handleResetForm = () => {
    setEditingId(undefined);
    setTitle('');
    setCategory(initialTab === 'materi' ? 'Materi Pembelajaran' : 'Berita Pesantren');
    setExcerpt('');
    setImageUrl(
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
    );
    setEditorJson({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ],
    });
    setHtmlContent('');
  };

  const handleLoadBerita = (item: BeritaItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || 'Berita Pesantren');
    setExcerpt(item.excerpt || '');
    setImageUrl(
      item.image_url ||
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
    );
    setHtmlContent(item.content || '');
    setEditorJson(item.content || '<p></p>');
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const { url } = await uploadGuruFile(file, 'berita-images');
    if (url) {
      setImageUrl(url);
      showToast('Cover Berhasil Diunggah', 'Gambar sampul siap digunakan.', 'success');
    }
    setUploadingCover(false);
  };

  const handleSubmit = async (publishNow: boolean) => {
    if (!title.trim()) {
      showToast('Judul Wajib Diisi', 'Masukkan judul berita atau materi pembelajaran.', 'error');
      return;
    }
    setSaving(true);
    const res = await saveBeritaContent({
      id: editingId,
      title: title.trim(),
      category,
      excerpt:
        excerpt.trim() ||
        title.trim() + ' — Publikasi Resmi SMP Plus Jauharul Maknuun Islamic Boarding School.',
      content: htmlContent || `<p>${title.trim()}</p>`,
      image_url: imageUrl.trim() || null,
      is_published: publishNow,
    });
    setSaving(false);
    if (res.ok && !editingId) {
      handleResetForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#115E59] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            Schudio Quick Content Studio
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            Buat Berita & Materi Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Tulis artikel kegiatan santri, modul materi kelas, atau pengumuman dan publikasikan langsung ke website utama PP Jauharul Maknuun.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {editingId && (
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-xs font-bold text-stone-700 transition"
            >
              <Plus className="w-4 h-4 text-[#115E59]" />
              Buat Artikel Baru
            </button>
          )}
          <Link
            to="/berita"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#115E59]" />
            Lihat Halaman Berita Publik
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Power Editor Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              {category === 'Materi Pembelajaran' ? (
                <BookOpen className="w-5 h-5 text-[#115E59]" />
              ) : (
                <Newspaper className="w-5 h-5 text-[#115E59]" />
              )}
              <h2 className="text-base font-bold text-stone-900">
                {editingId ? 'Edit Konten / Artikel' : 'Editor Konten Baru'}
              </h2>
            </div>
            {editingId && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Mode Edit
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Judul Berita / Materi Pembelajaran *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Modul Praktikum Robotika STEM & Hikmah Ayat Kauniyah..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#115E59] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Kategori Publikasi</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-sm font-semibold text-stone-800 focus:outline-none focus:border-[#115E59]"
              >
                {KATEGORI_LIST.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ringkasan / Excerpt */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Ringkasan Singkat (Excerpt)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat yang akan tampil pada kartu berita di beranda website..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF8F5] text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#115E59] focus:bg-white"
            />
          </div>

          {/* Upload Cover Image */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#115E59]" />
                Foto Sampul (Cover Image)
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-[#115E59] text-xs font-bold text-[#115E59] cursor-pointer transition">
                <ImageIcon className="w-3.5 h-3.5" />
                {uploadingCover ? 'Mengunggah...' : 'Upload Foto Sampul'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Atau tempel URL gambar sampul..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-700"
                />
              </div>
              <div className="sm:col-span-4">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Cover Preview"
                    className="w-full h-20 object-cover rounded-xl border border-stone-200"
                  />
                )}
              </div>
            </div>
          </div>

          {/* TipTap WYSIWYG Editor */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Isi Berita / Materi Pembelajaran (TipTap WYSIWYG + Embed Gambar & Video)
            </label>
            <GuruTipTapEditor
              value={editorJson}
              onChange={(json, html) => {
                setEditorJson(json);
                setHtmlContent(html);
              }}
              onUploadImage={(file) => uploadGuruFile(file, 'berita-images')}
              placeholder="Ketik isi berita atau materi pembelajaran, sisipkan foto kegiatan atau video YouTube..."
              minHeight="280px"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 text-xs font-bold transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Simpan sebagai Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              {saving ? 'Mempublikasikan...' : 'Publish ke Website Publik'}
            </button>
          </div>
        </div>

        {/* Right: Daftar Berita & Materi Terpublikasi */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF8F5] border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Riwayat Berita & Materi ({beritaList.length})
            </h3>
            <span className="text-[11px] text-stone-400">Klik untuk edit</span>
          </div>

          <div className="divide-y divide-stone-100 max-h-[680px] overflow-y-auto">
            {beritaList.map((item) => {
              const isSelected = editingId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleLoadBerita(item)}
                  className={`p-4 cursor-pointer transition flex gap-3 ${
                    isSelected
                      ? 'bg-teal-50/70 border-l-4 border-l-[#115E59]'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#115E59]">
                        {item.category}
                      </span>
                      {item.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-2.5 h-2.5" />
                          Draft
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
