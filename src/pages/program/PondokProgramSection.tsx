import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Moon,
  Sun,
  Heart,
  Calendar,
  X,
  Maximize2,
  Languages,
  Users2,
  GraduationCap
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  PondokProgramItem,
  PondokActivityPhoto,
  DailyScheduleItem
} from './types';

// ========================
// PONDOK PROGRAM & PHOTOS FROM SUPABASE
// ========================

/**
 * Ekstrak URL gambar dari field images JSON yang dapat berupa berbagai struktur:
 * - Array of objects: [{image_url: "..."}], [{url: "..."}], [{src: "..."}]
 * - Array of strings: ["url1", "url2"]
 * - Object: {images: [...]}, {image_url: "..."}
 * - Null / undefined
 */
function extractImageUrl(images: any): string | null {
  if (!images) return null;
  if (typeof images === 'string' && images.trim()) return images.trim();

  // Jika array of strings
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.trim()) return first.trim();
    if (first && typeof first === 'object') {
      return (
        first.image_url ||
        first.url ||
        first.src ||
        first.image ||
        first.thumbnail ||
        null
      );
    }
  }

  // Jika object tunggal
  if (typeof images === 'object' && !Array.isArray(images)) {
    return (
      images.image_url ||
      images.url ||
      images.src ||
      images.image ||
      images.thumbnail ||
      (Array.isArray(images.images) && images.images[0]
        ? extractImageUrl(images.images[0])
        : null)
    );
  }

  return null;
}
export const PondokProgramSection: React.FC = () => {
  const [programs, setPrograms] = useState<PondokProgramItem[]>([]);
  const [pondokPhotos, setPondokPhotos] = useState<PondokActivityPhoto[]>([]);
  const [dailySchedules, setDailySchedules] = useState<DailyScheduleItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PondokActivityPhoto | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<string>('semua');
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const [programsResult, photosResult, schedulesResult] = await Promise.all([
          supabase
            .from('programs_pondok')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true }),
          (supabase as any)
            .from('program_activity_photos')
            .select('*')
            .eq('program_type', 'pondok')
            .eq('is_active', true)
            .order('order_index', { ascending: true }),
          supabase
            .from('agendas')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true })
            .order('time_display', { ascending: true })
        ]);

        // Map programs
        if (!programsResult.error && programsResult.data && programsResult.data.length > 0) {
          const mapped: PondokProgramItem[] = programsResult.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            category: row.category || 'Program Pesantren',
            badge: row.badge || row.schedule?.target || row.schedule?.tingkat || row.schedule?.rutinitas || 'Unggulan',
            description: row.description || '-',
            iconName: row.icon_name || 'BookOpen',
            imageUrl: row.image_url || extractImageUrl(row.images),
            keyFeatures: Array.isArray(row.key_features) && row.key_features.length > 0
              ? row.key_features
              : [
                  'Target & Jadwal: ' + (row.schedule?.harian || row.schedule?.waktu || 'Terstruktur'),
                  'Talaqqi musyafahah dengan asatidz bersanad',
                  'Evaluasi dan ujian berkala mutqin'
                ]
          }));
          setPrograms(mapped);
        }

        // Fetch activity photos from program_activity_photos table
        if (!photosResult.error && photosResult.data && photosResult.data.length > 0) {
          const photos: PondokActivityPhoto[] = photosResult.data.map((row: any) => ({
            id: row.id,
            title: row.title || 'Dokumentasi Santri',
            description: row.description || '',
            imageUrl: row.image_url,
            timeTag: row.time_tag || '',
            location: row.location || ''
          }));
          setPondokPhotos(photos);
        }

        // Map schedules from agendas
        if (!schedulesResult.error && schedulesResult.data) {
          const schedules: DailyScheduleItem[] = (schedulesResult.data as any[]).map((row: any) => {
            const iconMap: Record<string, string> = {
              ibadah: 'Moon',
              akademik: 'GraduationCap',
              diniyah: 'BookOpen',
              istirahat: 'Heart',
              umum: 'Clock'
            };
            return {
              id: row.id,
              time: row.time_display || '-',
              title: row.title,
              description: row.description || '',
              category: row.category || 'umum',
              iconName: iconMap[row.category] || 'Clock'
            };
          });
          setDailySchedules(schedules);
        }
      } catch (err) {
        console.warn('Failed to load pondok data:', err);
      }
    };
    fetchData();
  }, []);

  const filteredSchedules = dailySchedules.filter((item) => {
    if (scheduleFilter === 'semua') return true;
    return item.category === scheduleFilter;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ========================================================= */}
      {/* SEKSI 1: PROGRAM UNGGULAN PONDOK (Minimalist Grid Cards) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pilar Kepesantrenan Salafiyah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Program Unggulan Pesantren
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Mencetak santri berakhlak mulia, mutafaqqih fiddin, hafizhul Qur’an, serta memiliki daya saing berwawasan global.
          </p>
        </div>

        {/* 4 Cards Grid with subtle icon, hairline border & hover lift */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
          {programs.map((prog) => {
            const Icon =
              prog.iconName === 'Award'
                ? Award
                : prog.iconName === 'BookOpen'
                ? BookOpen
                : prog.iconName === 'Users2'
                ? Users2
                : Languages;

            return (
              <div
                key={prog.id}
                className="group relative bg-white/90 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Program Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
                  {prog.imageUrl ? (
                    <img
                      src={prog.imageUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
                      <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      {prog.badge}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {prog.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {prog.description}
                  </p>
                </div>

                {/* Key features checklist */}
                <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Fokus Pembinaan:
                  </div>
                  <ul className="space-y-1.5">
                    {prog.keyFeatures.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SEKSI 2: FOTO KEGIATAN HARIAN SANTRI (aspect-[4/3] + Lightbox) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Dokumentasi Dinamis Santri</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Foto Kegiatan Santri
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Klik foto untuk memperbesar tampilan dan melihat detail kegiatan harian.
          </p>
        </div>

        {/* 6 Photo Grid: aspect-[4/3], rounded-xl, zoom on hover */}
        {pondokPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {pondokPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group cursor-pointer bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Ambient Overlay & Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {photo.timeTag}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-medium text-emerald-300 block">
                      {photo.location}
                    </span>
                    <h4 className="text-sm font-bold leading-tight drop-shadow-sm">
                      {photo.title}
                    </h4>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 bg-white dark:bg-zinc-900">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-500 text-xs">
            Belum ada dokumentasi foto kegiatan yang dipublikasikan.
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SEKSI 3: JADWAL AMALIYAH 24 JAM (Timetable & Interactive Card) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Rutinitas Harian & Disiplin Ibadah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Jadwal Amaliyah 24 Jam Santri
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {[
              { id: 'semua', label: 'Semua Rutinitas' },
              { id: 'ibadah', label: 'Ibadah & Wirid' },
              { id: 'akademik', label: 'Sekolah' },
              { id: 'diniyah', label: 'Kajian Diniyah' },
              { id: 'istirahat', label: 'Kemandirian' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setScheduleFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[32px] active:scale-[0.98] ${
                  scheduleFilter === f.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Interactive Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredSchedules.map((item) => {
            const Icon =
              item.iconName === 'Moon'
                ? Moon
                : item.iconName === 'Sun'
                ? Sun
                : item.iconName === 'GraduationCap'
                ? GraduationCap
                : item.iconName === 'BookOpen'
                ? BookOpen
                : item.iconName === 'Heart'
                ? Heart
                : item.iconName === 'Sparkles'
                ? Sparkles
                : Clock;

            const categoryBg =
              item.category === 'ibadah'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : item.category === 'akademik'
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : item.category === 'diniyah'
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';

            return (
              <div
                key={item.id}
                className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-tight text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {item.time}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryBg}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Kedisiplinan 24 Jam
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL: FULLSCREEN PHOTO PREVIEW */}
      {/* ========================================================= */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Caption & Metadata */}
            <div className="p-5 sm:p-6 bg-zinc-900 border-t border-zinc-800 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                  {selectedPhoto.timeTag}
                </span>
                <span className="text-xs text-zinc-400">• {selectedPhoto.location}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

