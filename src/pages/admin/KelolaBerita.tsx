import React, { useState, useRef } from 'react';
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
  Eye
} from 'lucide-react';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { generateWhatsAppBroadcastUrl } from '../../lib/waFormatter';

export const KelolaBerita: React.FC = () => {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Warta Pondok');
  const [ringkasan, setRingkasan] = useState('');
  const [isiBerita, setIsiBerita] = useState('');
  const [isHeadline, setIsHeadline] = useState(false);

  // Auto WebP Compression State
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [published, setPublished] = useState(false);
  const [waLink, setWaLink] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  // Simple WhatsApp/Word style format tools
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

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !isiBerita) {
      alert('Mohon lengkapi judul dan isi berita terlebih dahulu.');
      return;
    }

    setPublished(true);

    // Generate Instant WhatsApp Broadcast Link
    const broadcastUrl = generateWhatsAppBroadcastUrl({
      title: judul,
      category: kategori,
      excerpt: ringkasan || isiBerita.substring(0, 160) + '...',
      targetUrl: `https://ppjauharulmaknuun.sch.id/berita/${autoSlug || 'warta'}`
    });

    setWaLink(broadcastUrl);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5 text-emerald-800" />
          <span>Editor Warta Santri Ramah Gaptek</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Formulir Tulis Berita & Pengumuman Pondok
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Semua gambar otomatis dioptimalkan ke format WebP super ringan, dan Anda dapat menyebarkannya ke WhatsApp wali santri dalam 1 kali klik.
        </p>
      </div>

      {published ? (
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
              Berita berjudul <strong>"{judul}"</strong> telah aktif di portal dan siap dibaca oleh wali santri dan masyarakat luas.
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

          <div className="pt-4">
            <button
              onClick={() => {
                setPublished(false);
                setJudul('');
                setRingkasan('');
                setIsiBerita('');
                setCompressionResult(null);
              }}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Tulis Berita Lainnya
            </button>
          </div>
        </div>
      ) : (
        /* Form Inputs */
        <form onSubmit={handlePublish} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
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

          {/* Kategori & Opsi Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="Pengumuman PSB">Pengumuman PSB</option>
                <option value="Kegiatan Diniyah">Kegiatan Diniyah</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="headlineCheck"
                checked={isHeadline}
                onChange={(e) => setIsHeadline(e.target.checked)}
                className="w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-700"
              />
              <label htmlFor="headlineCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                Jadikan Berita Utama di Beranda Depan
              </label>
            </div>
          </div>

          {/* Drag & Drop Photo Uploader with Auto WebP Compressor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Foto Utama (Seret & Lepas Foto di Sini):
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
                    src={compressionResult.previewUrl}
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
              Setelah terbit, tombol WhatsApp akan otomatis muncul.
            </span>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all min-h-[48px]"
            >
              <Send className="w-4 h-4" />
              <span>Terbitkan Sekarang</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
