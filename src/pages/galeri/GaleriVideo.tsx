import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ExternalLink, X, Film, ChevronRight } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from '../../components/common/SocialIcons';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { supabase } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

interface VideoItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  desc: string;
  reelsUrl?: string;
  tiktokUrl?: string;
}

const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'Profil Resmi Pondok Pesantren Jauharul Maknuun Lasem Sidayu',
    date: '10 Januari 2025',
    duration: '07:45',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder ID yang dapat diganti live
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    desc: 'Dokumenter sinematik kehidupan harian santri, lantunan qiyamul lail, kajian kitab kuning, hingga praktikum riset di laboratorium sains STEM.',
    reelsUrl: 'https://instagram.com/ppjauharulmaknuun',
    tiktokUrl: 'https://tiktok.com/@ppjauharulmaknuun'
  },
  {
    id: 'v2',
    title: 'Dokumentasi Haflah Khotmil Qur’an 30 Juz & Maulid Nabi SAW',
    date: '15 November 2024',
    duration: '14:20',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    desc: 'Lantunan syahdu tilawah santri tahfidz dan pembacaan kasidah Maulid Simtudduror bersama dewan pengasuh dan jamaah.',
    reelsUrl: 'https://instagram.com/ppjauharulmaknuun',
    tiktokUrl: 'https://tiktok.com/@ppjauharulmaknuun'
  },
  {
    id: 'v3',
    title: 'Unjuk Karya Robotika Santri & Demo IoT Penyiram Tanaman',
    date: '05 September 2024',
    duration: '05:12',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    desc: 'Liputan demonstrasi alat otomasi irigasi pertanian hidroponik karya santri laboratorium STEM PPJM Lasem.',
    reelsUrl: 'https://instagram.com/ppjauharulmaknuun',
    tiktokUrl: 'https://tiktok.com/@ppjauharulmaknuun'
  }
];

const fetchVideos = async (): Promise<VideoItem[]> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('category', 'video')
      .order('event_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_VIDEOS;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.event_date,
      duration: '07:30',
      youtubeId: item.video_url || 'dQw4w9WgXcQ',
      thumbnail: item.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      desc: item.description || '',
      reelsUrl: 'https://instagram.com/ppjauharulmaknuun',
      tiktokUrl: 'https://tiktok.com/@ppjauharulmaknuun'
    }));
  } catch {
    return SAMPLE_VIDEOS;
  }
};

export const GaleriVideo: React.FC = () => {
  const { data: videos } = useCachedQuery<VideoItem[]>(
    'galleries_video_list',
    fetchVideos,
    SAMPLE_VIDEOS
  );
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Dokumenter & Video Profil</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Galeri Video Resmi PPJM
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Saksikan siaran resmi dakwah, profil pesantren, dan video reels kegiatan santri di kanal resmi YouTube, Instagram, dan TikTok PPJM.
          </p>
        </div>

        <Link
          to="/galeri/foto"
          className="px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50 transition-colors whitespace-nowrap self-start sm:self-center shadow-xs"
        >
          Lihat Galeri Foto Agenda
        </Link>
      </div>

      {/* Grid of Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail with Play Overlay */}
              <div
                onClick={() => setActiveVideo(video)}
                className="relative h-32 sm:h-40 overflow-hidden bg-slate-900 cursor-pointer"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all duration-500"
                />
                
                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-emerald-950 transition-all">
                    <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-bold">
                  {video.duration}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 space-y-1">
                <span className="text-xs text-slate-400 font-semibold">
                  {video.date}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {video.desc}
                </p>
              </div>
            </div>

            {/* Social Links Bar */}
            <div className="p-2.5 sm:p-3 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 mt-1.5">
              <button
                onClick={() => setActiveVideo(video)}
                className="text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-bold"
              >
                <span>Putar Video</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600 transition-colors"
                  title="Buka di YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a
                  href={video.reelsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full hover:bg-pink-50 text-pink-600 transition-colors"
                  title="Buka di Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 space-y-4 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase">
                  Video Player PPJM
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-950 mt-1">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeVideo.desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Kanal Resmi: Pondok Pesantren Jauharul Maknuun Lasem
              </span>
              <a
                href={`https://youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>Buka di Aplikasi YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
