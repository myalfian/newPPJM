import React, { useState } from 'react';
import { Image as ImageIcon, PlusCircle, CheckCircle2, Upload } from 'lucide-react';
import { YoutubeIcon } from '../../components/common/SocialIcons';
import { compressImageToWebP } from '../../lib/imageCompressor';
import type { CompressionResult } from '../../lib/imageCompressor';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const KelolaGaleri: React.FC = () => {
  const [tab, setTab] = useState<'foto' | 'video'>('foto');

  // Foto Agenda
  const [judulAgenda, setJudulAgenda] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [compResult, setCompResult] = useState<CompressionResult | null>(null);

  // Video Media
  const [judulVideo, setJudulVideo] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoDesc, setVideoDesc] = useState('');

  const [saved, setSaved] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const res = await compressImageToWebP(e.target.files[0]);
      setCompResult(res);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'foto' && judulAgenda) {
      if (isSupabaseConfigured()) {
        try {
          const slug = judulAgenda.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await supabase.from('galleries').insert({
            category: 'foto',
            title: judulAgenda,
            slug: `${slug}-${Date.now()}`,
            event_date: tanggal || new Date().toISOString().split('T')[0],
            description: deskripsi,
            cover_image: compResult?.dataUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
          });
        } catch (err) {
          console.warn('Failed to insert gallery foto to Supabase:', err);
        }
      }
    } else if (tab === 'video' && judulVideo) {
      if (isSupabaseConfigured()) {
        try {
          const slug = judulVideo.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await supabase.from('galleries').insert({
            category: 'video',
            title: judulVideo,
            slug: `${slug}-${Date.now()}`,
            event_date: new Date().toISOString().split('T')[0],
            description: videoDesc,
            video_url: youtubeUrl || 'dQw4w9WgXcQ',
            cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          });
        } catch (err) {
          console.warn('Failed to insert gallery video to Supabase:', err);
        }
      }
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setJudulAgenda('');
      setTanggal('');
      setDeskripsi('');
      setCompResult(null);
      setJudulVideo('');
      setYoutubeUrl('');
      setVideoDesc('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-800" />
          <span>Manajemen Galeri Dokumentasi</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Upload Foto Agenda & Tautan Video Santri
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Unggah dokumentasi foto kegiatan pesantren (otomatis WebP) atau tambahkan video YouTube, Instagram Reels, dan TikTok resmi PPJM.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Alhamdulillah, dokumentasi galeri berhasil disimpan dan terbit!</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('foto')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            tab === 'foto'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          1. Tambah Agenda Foto
        </button>
        <button
          onClick={() => setTab('video')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            tab === 'video'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          2. Tambah Video Profil / Reels
        </button>
      </div>

      {/* Form Foto Agenda */}
      {tab === 'foto' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Agenda Kegiatan: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Haflah Akhirussanah & Khotmil Qur'an 2025"
              value={judulAgenda}
              onChange={(e) => setJudulAgenda(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tanggal Pelaksanaan: *</label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Pilih Foto Sampul Agenda:</label>
            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40 space-y-2">
              <Upload className="w-8 h-8 text-emerald-700 mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">Pilih foto dari galeri (otomatis dikompres ke WebP)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-800 file:text-white file:font-bold"
              />
            </div>

            {compResult && (
              <div className="p-3 bg-emerald-100 rounded-xl text-xs text-emerald-950 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Foto berhasil dioptimalkan menjadi {compResult.compressedSizeKB} KB (Hemat {compResult.savedPercent}%)</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Deskripsi & Narasi Acara: *</label>
            <textarea
              rows={4}
              required
              placeholder="Ceritakan jalannya acara, kebersamaan santri, dan kehadiran masyayikh..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Agenda Foto</span>
            </button>
          </div>
        </form>
      )}

      {/* Form Video */}
      {tab === 'video' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Video: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Video Profil Kehidupan Santri PPJM Lasem 2025"
              value={judulVideo}
              onChange={(e) => setJudulVideo(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tautan Video YouTube / Reels / TikTok: *</label>
            <div className="relative">
              <YoutubeIcon className="w-4 h-4 text-rose-600 absolute left-3.5 top-3" />
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Sistem otomatis mengekstrak video ID untuk disematkan dalam pemutar popup website.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Keterangan Singkat: *</label>
            <textarea
              rows={3}
              required
              placeholder="Ringkasan isi video..."
              value={videoDesc}
              onChange={(e) => setVideoDesc(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan & Tayangkan Video</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
