import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Film,
  Calendar,
  Sparkles,
  Play,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Maximize2,
  ZoomIn,
  Share2,
  Tag,
  Info
} from 'lucide-react';
import '../../components/common/NavBarTabs.css';
import { YoutubeIcon } from '../../components/common/SocialIcons';
import { supabase, GalleryItem, isSupabaseConfigured } from '../../lib/supabase';
import { useCachedQuery, invalidateCache } from '../../lib/queryCache';
import { SafeRichContent } from '../../components/common/SafeRichContent';

// Helper to reliably extract YouTube Video ID from any URL format
export const getYouTubeId = (urlOrId?: string): string => {
  if (!urlOrId) return 'dQw4w9WgXcQ';
  const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) return match[1];
  if (urlOrId.length === 11 && !urlOrId.includes('/') && !urlOrId.includes('.')) return urlOrId;
  return 'dQw4w9WgXcQ';
};

export interface PhotoItem {
  photo_url: string;
  caption?: string;
}

export interface PhotoActivity {
  id: string;
  title: string;
  categoryTag: string;
  event_date: string;
  description: string;
  photos: PhotoItem[];
}

export interface VideoActivity {
  id: string;
  title: string;
  categoryTag: string;
  event_date: string;
  duration?: string;
  flyer: string;
  youtubeUrl: string;
  description: string;
}

// -----------------------------------------------------------------------------
// CURATED MASTER DATA (FALLBACK & OFFLINE-READY)
// -----------------------------------------------------------------------------
const SAMPLE_PHOTO_ACTIVITIES: PhotoActivity[] = [
  {
    id: 'f1',
    title: 'Haflah Akhirussanah & Wisuda Khotmil Qur’an 30 Juz Bersanad',
    categoryTag: 'Tahfidz & Wisuda',
    event_date: '20 Juni 2025',
    description: 'Momen penuh berkah dan haru saat ratusan santriwan-santriwati diwisuda di hadapan para Masyayikh, Dewan Pengasuh, dan ribuan wali santri yang memadati panggung utama Pondok Pesantren Jauharul Maknuun Lasem.',
    photos: [
      {
        photo_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
        caption: 'Panggung utama megah Haflah Akhirussanah PP. Jauharul Maknuun dipenuhi ribuan wali santri',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pemberian syahadah sanad tahfidz 30 juz oleh Pengasuh Pondok kepada wisudawan terbaik',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        caption: 'Keluarga besar asatidz dan dewan pengajar foto bersama santri purna studi',
      },
    ],
  },
  {
    id: 'f2',
    title: 'Jalsah Ilmiyah & Bedah Manuskrip Ulama Salaf Nusantara',
    categoryTag: 'Kajian Turats',
    event_date: '12 Maret 2025',
    description: 'Seminar akademik bedah naskah kuno karya ulama Nusantara pesisir utara Jawa bersama filolog naskah pesantren dan jajaran pimpinan pondok.',
    photos: [
      {
        photo_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pemaparan komparasi dalil turats dan manuskrip fiqih klasik oleh narasumber utama',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Santri ulya mencatat kajian dan kaidah istinbath hukum dengan penuh khidmat',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dokumentasi manuskrip tulisan tangan ulama abad ke-19 yang dikaji santri',
      },
    ],
  },
  {
    id: 'f3',
    title: 'Ekspo Gelar Karya Riset Sains & Inovasi Robotika STEM Santri',
    categoryTag: 'Inovasi STEM',
    event_date: '18 November 2024',
    description: 'Pameran teknologi terapan hasil riset mandiri santri di laboratorium modern, meliputi alat IoT penyiram tanaman otomatis, purifier air tenaga surya, dan drone pemantau lahan.',
    photos: [
      {
        photo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        caption: 'Demonstrasi sistem mikrokontroler IoT penyiram kebun otomatis di hadapan penguji',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pengujian sensor gerak pada robot line tracer rakitan santri SMP Plus JM',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        caption: 'Santriwati mempresentasikan prototipe purifikasi air higienis berbasis filtrasi karbon',
      },
    ],
  },
  {
    id: 'f4',
    title: 'Peringatan Maulid Nabi Muhammad SAW & Gema Sholawat Al-Habsyi',
    categoryTag: 'Peringatan Hari Besar',
    event_date: '16 September 2024',
    description: 'Malam cinta Rasulullah SAW dengan pembacaan Maulid Simtudduror dan lantunan qasidah merdu dari grup hadrah santri el-Maknuun bersama ribuan jamaah asrama.',
    photos: [
      {
        photo_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gema sholawat bergema merdu di aula utama asrama pesantren',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penabuh rebana hadrah santri tampil penuh semangat dan penghayatan',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        caption: 'Suasana pembacaan doa penutup dan mahalul qiyam bersama para asatidz',
      },
    ],
  },
  {
    id: 'f5',
    title: 'Latihan Dasar Kepemimpinan Santri (LDKS) & Kemah Pramuka',
    categoryTag: 'Pengembangan Diri',
    event_date: '08 Agustus 2024',
    description: 'Pelatihan ketangkasan fisik, mental, kepemimpinan organisasi, serta outbound survival di alam terbuka guna mencetak kader santri yang tangguh, mandiri, dan berakhlak karimah.',
    photos: [
      {
        photo_url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Upacara pembukaan kemah bakti santri dengan latar alam perbukitan',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dinamika kelompok dan simulasi problem-solving kepemimpinan regu',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
        caption: 'Malam api unggun dan ikrar komitmen pengabdian santri kepada umat',
      },
    ],
  },
  {
    id: 'f6',
    title: 'Halaqah Qira’atul Kutub & Ujian Evaluasi Tahfidz Al-Qur’an Triwulan',
    categoryTag: 'Akademik Salaf',
    event_date: '14 Juli 2024',
    description: 'Ujian terbuka pembacaan dan pemaknaan kitab fathul qorib secara sorogan di hadapan dewan masyaikh dan penguji eksternal.',
    photos: [
      {
        photo_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
        caption: 'Santri membacakan matan kitab dengan kaidah nahwu sharaf di hadapan mushohih',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        caption: 'Simulasi tasmi’ hafalan 5 juz sekali duduk oleh santriwati kelas mutawassithah',
      },
      {
        photo_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dewan asatidz memberikan catatan evaluasi tajwid dan makhraj huruf',
      },
    ],
  },
];

const SAMPLE_VIDEO_ACTIVITIES: VideoActivity[] = [
  {
    id: 'v1',
    title: 'Profil Resmi Pondok Pesantren Jauharul Maknuun Lasem Sidayu',
    categoryTag: 'Dokumenter Resmi',
    event_date: '15 Januari 2025',
    duration: '08:45',
    flyer: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    description: 'Dokumenter sinematik yang menyajikan kilas harmoni kehidupan santri: lantunan qiyamul lail, pengajian kitab salaf, integrasi teknologi sains STEM, hingga kurikulum formal terakreditasi "A" BAN-PDM.',
  },
  {
    id: 'v2',
    title: 'Dokumentasi Haflah Khotmil Qur’an 30 Juz & Wisuda Purna Studi',
    categoryTag: 'Wisuda & Haflah',
    event_date: '20 Juni 2024',
    duration: '14:20',
    flyer: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    description: 'Momen puncak wisuda khotmil Qur’an bil ghoib, prosesi pengalungan syahadah sanad, serta tausiyah mauidzah hasanah dewan pengasuh bersama ribuan jamaah.',
  },
  {
    id: 'v3',
    title: 'Unjuk Karya Robotika Santri & Demo IoT Irigasi Otomatis STEM',
    categoryTag: 'Inovasi STEM',
    event_date: '18 November 2024',
    duration: '06:15',
    flyer: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    description: 'Liputan unjuk inovasi santri dalam merancang perangkat cerdas berbasis sensor Arduino dan ESP32 untuk otomasi pertanian ramah lingkungan.',
  },
  {
    id: 'v4',
    title: 'Gema Sholawat Maulid Simtudduror Santri & Hadrah el-Maknuun',
    categoryTag: 'Seni Islami',
    event_date: '16 September 2024',
    duration: '11:30',
    flyer: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    description: 'Lantunan kasidah puji-pujian kepada Baginda Nabi Muhammad SAW yang dibawakan secara khidmat dan syahdu oleh grup hadrah santri PPJM.',
  },
  {
    id: 'v5',
    title: 'Peringatan Hari Santri Nasional: Napak Tilas Resolusi Jihad',
    categoryTag: 'Hari Santri',
    event_date: '22 Oktober 2024',
    duration: '09:10',
    flyer: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    description: 'Kompilasi upacara apel akbar Hari Santri Nasional, parade santri berkain sarung, dan teatrikal perjuangan ulama mempertahankan kedaulatan NKRI.',
  },
  {
    id: 'v6',
    title: 'Halaqah Subuh & Rutinitas Zikir Wirid Santri Jauharul Maknuun',
    categoryTag: 'Amaliyah Harian',
    event_date: '05 Agustus 2024',
    duration: '07:45',
    flyer: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
    description: 'Suasana tenang dan menyejukkan hati saat fajar menyingsing di asrama santri Lasem, melantunkan ayat suci Al-Qur’an dan wirid masyayikh.',
  },
];

// Supabase fetching with fallback caching
const fetchPhotoActivitiesFromDb = async (): Promise<PhotoActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('galeri_foto')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_PHOTO_ACTIVITIES;
    }

    const activeRows = data.filter((item: any) => item.is_active !== false);
    if (activeRows.length === 0) {
      return SAMPLE_PHOTO_ACTIVITIES;
    }

    return activeRows.map((item: any, idx: number) => {
      const primaryUrl = item.image_url || SAMPLE_PHOTO_ACTIVITIES[0].photos[0].photo_url;
      let photos: PhotoItem[] = [];

      if (Array.isArray(item.photos) && item.photos.length > 0) {
        photos = item.photos
          .filter((p: any) => p && typeof p.photo_url === 'string' && p.photo_url.trim())
          .map((p: any) => ({
            photo_url: p.photo_url,
            caption: p.caption || item.description || item.title,
          }));
      }

      if (photos.length === 0) {
        photos.push({ photo_url: primaryUrl, caption: item.description || item.title });
      }

      // Pad with fallback aesthetic photos so 3-photo slider layout always has 3 slides
      while (photos.length < 3) {
        const fallback = SAMPLE_PHOTO_ACTIVITIES[idx % SAMPLE_PHOTO_ACTIVITIES.length].photos[photos.length];
        photos.push(fallback || { photo_url: primaryUrl, caption: item.title });
      }

      const formattedDate =
        item.event_date ||
        (item.created_at
          ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
          : 'Terbaru');

      return {
        id: item.id || `f-${idx}`,
        title: item.title,
        categoryTag: item.category || 'Kegiatan Pondok',
        event_date: formattedDate,
        description: item.description || '',
        photos: photos.slice(0, 3),
      };
    });
  } catch {
    return SAMPLE_PHOTO_ACTIVITIES;
  }
};

const fetchVideoActivitiesFromDb = async (): Promise<VideoActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('galeri_videos')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_VIDEO_ACTIVITIES;
    }

    const activeRows = data.filter((item: any) => item.is_active !== false);
    if (activeRows.length === 0) {
      return SAMPLE_VIDEO_ACTIVITIES;
    }

    return activeRows.map((item: any, idx: number) => {
      const formattedDate = item.created_at
        ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Terbaru';

      return {
        id: item.id || `v-${idx}`,
        title: item.title,
        categoryTag: item.category || 'Video Resmi',
        event_date: formattedDate,
        duration: '07:30',
        flyer: item.thumbnail_url || SAMPLE_VIDEO_ACTIVITIES[idx % SAMPLE_VIDEO_ACTIVITIES.length].flyer,
        youtubeUrl: item.youtube_url || 'https://youtube.com/@ppjauharulmaknuunlasem?si=OHYeRczBA-kLl3Kl',
        description: item.description || '',
      };
    });
  } catch {
    return SAMPLE_VIDEO_ACTIVITIES;
  }
};

export interface GaleriProps {
  defaultTab?: 'foto' | 'video';
}

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? '42%' : '-42%',
    opacity: 0,
    scale: 1.04,
  }),
  center: {
    x: '0%',
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-42%' : '42%',
    opacity: 0,
    scale: 0.96,
  }),
};

interface PhotoCardSliderProps {
  item: PhotoActivity;
  cardIndex: number;
  onOpenLightbox: (item: PhotoActivity, photoIndex: number) => void;
}

const PhotoCardSlider: React.FC<PhotoCardSliderProps> = ({ item, cardIndex, onOpenLightbox }) => {
  const photos = item.photos;
  const total = photos.length;
  const [[activeIndex, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const paginate = useCallback(
    (newDirection: number) => {
      if (total <= 1) return;
      setSlide(([prevIdx]) => [((prevIdx + newDirection) % total + total) % total, newDirection]);
    },
    [total],
  );

  const jumpTo = (targetIdx: number) => {
    setSlide(([prevIdx]) => {
      if (targetIdx === prevIdx) return [prevIdx, 1];
      return [targetIdx, targetIdx > prevIdx ? 1 : -1];
    });
  };

  // Smooth staggered auto-play across the 3 photos, pausing on hover/touch
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const intervalMs = 4200 + (cardIndex % 3) * 550;
    const timer = window.setInterval(() => paginate(1), intervalMs);
    return () => window.clearInterval(timer);
  }, [isPaused, total, cardIndex, paginate]);

  const activePhoto = photos[activeIndex] || photos[0];

  return (
    <div
      className="flex flex-col justify-between h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div>
        {/* SMOOTH 3-PHOTO ANIMATED SLIDER CAROUSEL + THUMBNAIL STRIP */}
        <div className="p-2 sm:p-2.5 pb-0 space-y-1.5">
          {/* Primary Animated Viewport (Aspect 16/10) */}
          <div
            onClick={() => onOpenLightbox(item, activeIndex)}
            onTouchStart={(e) => {
              setIsPaused(true);
              setTouchStart(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              if (touchStart !== null) {
                const diff = touchStart - e.changedTouches[0].clientX;
                if (diff > 40) paginate(1);
                else if (diff < -40) paginate(-1);
              }
              setTouchStart(null);
              setIsPaused(false);
            }}
            className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer select-none group/slider shadow-inner"
            title={`Klik untuk membuka Lightbox (Foto ${activeIndex + 1} dari ${total})`}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={`${item.id}-${activeIndex}`}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 310, damping: 32, mass: 0.75 },
                  opacity: { duration: 0.28, ease: 'easeOut' },
                  scale: { duration: 0.38, ease: 'easeOut' },
                }}
                src={activePhoto.photo_url}
                alt={activePhoto.caption || `${item.title} - Foto ${activeIndex + 1}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Bottom Gradient & Live Caption Preview */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-8 pb-2 px-2.5 pointer-events-none">
              <div className="flex items-end justify-between gap-2">
                <p className="text-[11px] font-medium text-white/95 line-clamp-1 drop-shadow-xs">
                  {activePhoto.caption || item.title}
                </p>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[10px] font-extrabold text-amber-300">
                  {activeIndex + 1} / {total}
                </span>
              </div>
            </div>

            {/* Hover Zoom Indicator Top-Right */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-80 group-hover/slider:opacity-100 group-hover/slider:scale-105 transition-all pointer-events-none">
              <ZoomIn className="w-3.5 h-3.5" />
            </div>

            {/* Prev / Next Navigation Buttons */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Slide Foto Sebelumnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-emerald-700/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Slide Foto Selanjutnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-emerald-700/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer z-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Tags & Metadata */}
        <div className="p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50">
              <Tag className="w-3 h-3" />
              <span>{item.categoryTag}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>{item.event_date}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenLightbox(item, activeIndex)}
            className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {item.title}
          </h3>

          {/* Description (Clamped 2-3 lines) */}
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onOpenLightbox(item, activeIndex)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Buka Lightbox (3 Foto)</span>
        </button>

        {/* Animated 3-dot indicator */}
        <div className="flex items-center gap-1">
          {photos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Pilih foto ${idx + 1}`}
              onClick={() => jumpTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? 'w-5 bg-emerald-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const GALLERY_TABS: {
  id: 'foto' | 'video';
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'foto', label: 'Foto Kegiatan', shortLabel: 'Foto', icon: Camera },
  { id: 'video', label: 'Video Dokumentasi', shortLabel: 'Video', icon: Film },
];

export const Galeri: React.FC<GaleriProps> = ({ defaultTab = 'foto' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Segmented Tab State ('foto' | 'video')
  const [activeTab, setActiveTab] = useState<'foto' | 'video'>(() => {
    if (location.pathname.includes('/video')) return 'video';
    if (location.pathname.includes('/foto')) return 'foto';
    return defaultTab;
  });

  // Keep state synced with route changes
  useEffect(() => {
    if (location.pathname.includes('/video')) {
      setActiveTab('video');
    } else if (location.pathname.includes('/foto')) {
      setActiveTab('foto');
    }
  }, [location.pathname]);

  // Tab switcher handler with smooth URL push
  const handleTabChange = (tab: 'foto' | 'video') => {
    setActiveTab(tab);
    navigate(`/galeri/${tab}`, { replace: true });
  };

  // Queries for Foto and Video with cache
  const { data: photoActivities, refetch: refetchPhotos } = useCachedQuery<PhotoActivity[]>(
    'gallery_photo_activities_v2',
    fetchPhotoActivitiesFromDb,
    SAMPLE_PHOTO_ACTIVITIES
  );

  const { data: videoActivities, refetch: refetchVideos } = useCachedQuery<VideoActivity[]>(
    'gallery_video_activities_v2',
    fetchVideoActivitiesFromDb,
    SAMPLE_VIDEO_ACTIVITIES
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const channel = supabase
      .channel('public-galeri-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'galeri_foto' }, () => {
        invalidateCache('gallery_photo_activities_v2');
        refetchPhotos();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'galeri_videos' }, () => {
        invalidateCache('gallery_video_activities_v2');
        refetchVideos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchPhotos, refetchVideos]);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Auto-center active tab on mobile viewport
  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const container = tabListRef.current;
      const activeEl = activeTabRef.current;
      const scrollLeft =
        activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  // ---------------------------------------------------------------------------
  // LIGHTBOX VIEWER STATE (FOR PHOTOS)
  // ---------------------------------------------------------------------------
  const [lightboxData, setLightboxData] = useState<{
    activity: PhotoActivity;
    currentIndex: number;
    direction: number;
  } | null>(null);
  const [lightboxAutoPlay, setLightboxAutoPlay] = useState<boolean>(true);

  const openLightbox = (activity: PhotoActivity, photoIndex = 0) => {
    setLightboxData({ activity, currentIndex: photoIndex, direction: 1 });
    setLightboxAutoPlay(true);
  };

  const closeLightbox = () => {
    setLightboxData(null);
  };

  const nextLightboxPhoto = useCallback(() => {
    setLightboxData((prev) => {
      if (!prev) return null;
      const len = prev.activity.photos.length;
      return { ...prev, currentIndex: (prev.currentIndex + 1) % len, direction: 1 };
    });
  }, []);

  const prevLightboxPhoto = useCallback(() => {
    setLightboxData((prev) => {
      if (!prev) return null;
      const len = prev.activity.photos.length;
      return { ...prev, currentIndex: (prev.currentIndex - 1 + len) % len, direction: -1 };
    });
  }, []);

  const jumpLightboxPhoto = useCallback((targetIdx: number) => {
    setLightboxData((prev) => {
      if (!prev || targetIdx === prev.currentIndex) return prev;
      return {
        ...prev,
        currentIndex: targetIdx,
        direction: targetIdx > prev.currentIndex ? 1 : -1,
      };
    });
  }, []);

  // Auto-play inside Lightbox when enabled
  useEffect(() => {
    if (!lightboxData || !lightboxAutoPlay || lightboxData.activity.photos.length <= 1) return;
    const timer = window.setInterval(() => {
      nextLightboxPhoto();
    }, 3800);
    return () => window.clearInterval(timer);
  }, [lightboxData, lightboxAutoPlay, nextLightboxPhoto]);

  // Touch Swipe Gesture for Lightbox on Mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextLightboxPhoto(); // Swiped left -> next
    } else if (diff < -45) {
      prevLightboxPhoto(); // Swiped right -> prev
    }
    setTouchStartX(null);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxData) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextLightboxPhoto();
      if (e.key === 'ArrowLeft') prevLightboxPhoto();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData, nextLightboxPhoto, prevLightboxPhoto]);

  // ---------------------------------------------------------------------------
  // VIDEO PLAYER MODAL STATE
  // ---------------------------------------------------------------------------
  const [selectedVideo, setSelectedVideo] = useState<VideoActivity | null>(null);

  // Body Scroll Lock when any modal is open
  useEffect(() => {
    const isModalOpen = Boolean(lightboxData || selectedVideo);
    const originalOverflow = document.body.style.overflow;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxData, selectedVideo]);

  // Filtered lists
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photoActivities;
    const q = searchQuery.toLowerCase();
    return photoActivities.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryTag.toLowerCase().includes(q)
    );
  }, [photoActivities, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videoActivities;
    const q = searchQuery.toLowerCase();
    return videoActivities.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryTag.toLowerCase().includes(q)
    );
  }, [videoActivities, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen pb-4">
      {/* 1. HERO HEADER SECTION - COMPACT VERTICAL SPACING (SEARCH REMOVED) */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-3.5 sm:py-5 px-3 sm:px-4 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#C8A951]" />
            <span>Arsip Dokumentasi &amp; Multimedia PPJM</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xs">
            Galeri Kegiatan &amp; Media Resmi
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Jejak visual dinamika santri, lantunan kalam suci, majelis ilmu salafiyah, hingga kreasi teknologi STEM yang dirangkum dalam dokumentasi foto dan video resmi Pondok Pesantren Jauharul Maknuun Lasem.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY CHIP TABS - 25% OVERLAP WITH HERO CONTAINER ABOVE */}
      <section className="max-w-6xl mx-auto px-2.5 sm:px-4 -mt-[11px] sm:-mt-[11.5px] relative z-20 select-none">
        <nav aria-label="Kategori Galeri" className="curved-navbar-wrapper w-full">
          <div className="curved-navbar-bar w-full">
            <div
              ref={tabListRef}
              className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-1 sm:px-2"
            >
              <ul className="curved-tab-list flex items-center justify-between w-full gap-1 sm:gap-1.5">
                {GALLERY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <li
                      key={tab.id}
                      className="curved-tab-col flex-1 h-full flex items-center justify-center min-w-[125px] sm:min-w-0 snap-start"
                    >
                      <button
                        ref={isActive ? activeTabRef : null}
                        type="button"
                        onClick={() => handleTabChange(tab.id as 'foto' | 'video')}
                        className={`curved-tab-link w-full bg-transparent border-0 relative flex items-center justify-center cursor-pointer px-1.5 sm:px-2 ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        {/* Animated Sliding Notch Pointer with Pristine White Cutout Notch & Radiant Gold Jewel */}
                        {isActive && (
                          <motion.div
                            layoutId="galeriCurvedPointer"
                            className="curved-pointer"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 28,
                              mass: 0.58,
                            }}
                          >
                            <svg
                              viewBox="0 0 74 22"
                              className="curved-notch-svg"
                              width="74"
                              height="22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <defs>
                                <radialGradient id="galeriNotchDotGrad" cx="35%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#fffbeb" />
                                  <stop offset="35%" stopColor="#fde047" />
                                  <stop offset="75%" stopColor="#d97706" />
                                  <stop offset="100%" stopColor="#92400e" />
                                </radialGradient>
                              </defs>
                              {/* Pristine White Cutout Notch Surface matching page background tone */}
                              <path
                                d="M 0 0 C 16 0, 22 18, 37 18 C 52 18, 58 0, 74 0 Z"
                                className="curved-notch-surface"
                                style={{ fill: '#ffffff' }}
                                stroke="none"
                              />
                              {/* Radiant Jewel Gold Floating Indicator */}
                              <circle
                                cx="37"
                                cy="6"
                                r="4.8"
                                fill="url(#galeriNotchDotGrad)"
                                className="curved-notch-dot"
                                stroke="none"
                              />
                              {/* Specular Gem Reflection */}
                              <circle
                                cx="35.5"
                                cy="4.5"
                                r="1.4"
                                fill="#ffffff"
                                opacity="0.85"
                                stroke="none"
                              />
                            </svg>
                          </motion.div>
                        )}

                        <span className="curved-tab-text !flex-row items-center gap-1.5 whitespace-nowrap font-bold tracking-tight">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isActive ? 'text-[#facc15]' : 'text-emerald-200/80'
                            }`}
                          />
                          <span className="sm:hidden font-extrabold">{tab.shortLabel || tab.label}</span>
                          <span className="hidden sm:inline font-bold">{tab.label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </section>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 pt-2.5 sm:pt-3">
        <AnimatePresence mode="wait">
        {/* ================================================================= */}
        {/* TAB 1: FOTO KEGIATAN (Grid Mini 3-Foto per Kartu)                */}
        {/* ================================================================= */}
        {activeTab === 'foto' ? (
          <motion.div
            key="tab-foto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
            className="space-y-4"
          >
            {filteredPhotos.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-xl border border-slate-200 space-y-2">
                <Camera className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Tidak ada foto ditemukan</h4>
                <p className="text-xs text-zinc-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                {filteredPhotos.map((item, cardIdx) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between group"
                  >
                    <PhotoCardSlider item={item} cardIndex={cardIdx} onOpenLightbox={openLightbox} />
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ================================================================= */
          /* TAB 2: VIDEO KEGIATAN (Flyer Card + Ambient Play Overlay)       */
          /* ================================================================= */
          <motion.div
            key="tab-video"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
            className="space-y-4"
          >
            {filteredVideos.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-xl border border-slate-200 space-y-2">
                <Film className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Tidak ada video ditemukan</h4>
                <p className="text-xs text-zinc-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                {filteredVideos.map((video) => (
                  <article
                    key={video.id}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between group"
                  >
                    <div>
                      {/* FLYER IMAGE WITH AMBIENT PLAY BADGE (Aspect 16/9) */}
                      <div
                        onClick={() => setSelectedVideo(video)}
                        className="relative aspect-video overflow-hidden bg-zinc-900 cursor-pointer select-none"
                      >
                        <img
                          src={video.flyer}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        />

                        {/* Ambient Radial Gradient Shade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Central Luxury Ambient Play Badge */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            {/* Pulsing Ripple Aura */}
                            <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping opacity-60" />
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-700 via-teal-600 to-amber-400 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                              <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Category & Duration Badges */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-bold text-white bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                            {video.categoryTag}
                          </span>
                        </div>

                        {video.duration && (
                          <div className="absolute bottom-2.5 right-2.5">
                            <span className="text-[10px] font-extrabold text-white bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md">
                              {video.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Video Title & Description */}
                      <div className="p-3.5 sm:p-4 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          <span>{video.event_date}</span>
                        </div>

                        <h3
                          onClick={() => setSelectedVideo(video)}
                          className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
                        >
                          {video.title}
                        </h3>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="px-3.5 sm:px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedVideo(video)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Tonton Video</span>
                      </button>

                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                        title="Buka langsung di YouTube"
                      >
                        <YoutubeIcon className="w-3.5 h-3.5" />
                        <span>YouTube Resmi</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </main>

      {/* ===================================================================== */}
      {/* 5. INTERACTIVE FULLSCREEN LIGHTBOX (FOR PHOTOS)                      */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {lightboxData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
            />

            {/* Lightbox Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative w-full sm:max-w-4xl max-h-[100dvh] sm:max-h-[92vh] bg-zinc-950 sm:rounded-3xl overflow-hidden flex flex-col z-10 text-white shadow-2xl border border-zinc-800"
            >
              {/* Lightbox Header Bar */}
              <div className="p-3.5 sm:p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-4 shrink-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    {lightboxData.activity.categoryTag} • {lightboxData.activity.event_date}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base truncate text-white">
                    {lightboxData.activity.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLightboxAutoPlay((v) => !v)}
                    aria-label={lightboxAutoPlay ? 'Jeda Slideshow Otomatis' : 'Putar Slideshow Otomatis'}
                    title={lightboxAutoPlay ? 'Jeda Slideshow' : 'Putar Slideshow'}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      lightboxAutoPlay
                        ? 'bg-emerald-900/70 text-emerald-200 border-emerald-600/60'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    {lightboxAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span className="hidden xs:inline">{lightboxAutoPlay ? 'Auto Slide' : 'Dijeda'}</span>
                  </button>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                    {lightboxData.currentIndex + 1} / {lightboxData.activity.photos.length}
                  </span>
                  <button
                    type="button"
                    onClick={closeLightbox}
                    aria-label="Tutup Lightbox"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Photo Area (Smooth Directional Spring Slider + Touch Swipeable) */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative flex-1 bg-black min-h-[280px] sm:min-h-[460px] flex items-center justify-center overflow-hidden select-none"
              >
                <AnimatePresence initial={false} custom={lightboxData.direction} mode="popLayout">
                  <motion.img
                    key={`${lightboxData.activity.id}-lb-${lightboxData.currentIndex}`}
                    custom={lightboxData.direction}
                    variants={SLIDE_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 320, damping: 32, mass: 0.78 },
                      opacity: { duration: 0.28, ease: 'easeOut' },
                      scale: { duration: 0.36, ease: 'easeOut' },
                    }}
                    src={lightboxData.activity.photos[lightboxData.currentIndex].photo_url}
                    alt={lightboxData.activity.photos[lightboxData.currentIndex].caption || lightboxData.activity.title}
                    className="max-h-[65vh] sm:max-h-[70vh] w-full object-contain"
                  />
                </AnimatePresence>

                {/* Left & Right Controls */}
                {lightboxData.activity.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevLightboxPhoto}
                      aria-label="Foto Sebelumnya"
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-emerald-700/90 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={nextLightboxPhoto}
                      aria-label="Foto Selanjutnya"
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-emerald-700/90 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip & Caption */}
              <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-3 shrink-0">
                {/* Animated Caption */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`caption-${lightboxData.currentIndex}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs sm:text-sm font-semibold text-emerald-300"
                  >
                    {lightboxData.activity.photos[lightboxData.currentIndex].caption || lightboxData.activity.title}
                  </motion.p>
                </AnimatePresence>

                {/* Slide Progress Dots */}
                <div className="flex items-center gap-1.5">
                  {lightboxData.activity.photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Pilih slide foto ${idx + 1}`}
                      onClick={() => jumpLightboxPhoto(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === lightboxData.currentIndex
                          ? 'w-7 bg-amber-400'
                          : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Description */}
                <SafeRichContent
                  content={lightboxData.activity.description}
                  className="text-xs text-zinc-400 leading-relaxed line-clamp-3"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 6. RESPONSIVE VIDEO PLAYER MODAL                                     */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Video Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-3xl max-h-[92vh] bg-zinc-950 text-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-zinc-800"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-start justify-between gap-4 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      {selectedVideo.categoryTag}
                    </span>
                    <span className="text-xs text-zinc-400">{selectedVideo.event_date}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-lg text-white mt-1 line-clamp-1">
                    {selectedVideo.title}
                  </h3>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  aria-label="Tutup Video Player"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer -mr-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive 16:9 Video Frame */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(selectedVideo.youtubeUrl)}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Description & Actions */}
              <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-zinc-800 space-y-3 shrink-0">
                <SafeRichContent
                  content={selectedVideo.description}
                  className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                />

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <span className="text-xs text-zinc-400">
                    Kanal Resmi: Pondok Pesantren Jauharul Maknuun Lasem
                  </span>

                  <a
                    href={selectedVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                    <span>Buka di Aplikasi YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Galeri;

