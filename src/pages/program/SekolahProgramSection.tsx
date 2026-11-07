import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Cpu,
  Trophy,
  Compass,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  SekolahProgramItem,
  SekolahStoryActivity
} from './types';
import { CardImageSlider } from '../../components/common/CardImageSlider';

export const SekolahProgramSection: React.FC = () => {
  const [programs, setPrograms] = useState<SekolahProgramItem[]>([]);
  const [schoolStories, setSchoolStories] = useState<SekolahStoryActivity[]>([]);
  const [selectedStoryImage, setSelectedStoryImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const [programsRes, photosRes] = await Promise.all([
          (supabase as any)
            .from('programs_sekolah')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true }),
          (supabase as any)
            .from('program_activity_photos')
            .select('*')
            .eq('program_type', 'sekolah')
            .eq('is_active', true)
            .order('order_index', { ascending: true })
        ]);

        if (!programsRes.error && programsRes.data && programsRes.data.length > 0) {
          const mapped: SekolahProgramItem[] = programsRes.data.map((row: any, idx: number) => {
            const visual = row.visual_story || row.schedule?.visual_story || {};
            const points = Array.isArray(row.highlights) && row.highlights.length > 0
              ? row.highlights
              : Array.isArray(visual.points) ? visual.points : [];

            const rawImages = row.images;
            const imagesList: string[] = [];
            if (row.image_url) imagesList.push(row.image_url);
            if (Array.isArray(rawImages)) {
              rawImages.forEach((img: any) => {
                const u = typeof img === 'string' ? img : img?.image_url || img?.url;
                if (u && !imagesList.includes(u)) imagesList.push(u);
              });
            }

            return {
              id: row.id,
              title: row.title,
              category: row.category || 'Kurikulum Akademik',
              badge: row.badge || visual.headline || 'Akreditasi A',
              description: row.description || row.curriculum || '-',
              iconName: row.icon_name || (idx === 0 ? 'GraduationCap' : 'Cpu'),
              imageUrl: imagesList[0] || row.image_url,
              images: imagesList,
              highlights: points.length > 0 ? points : [],
              stories: []
            };
          });
          setPrograms(mapped);
        }

        if (!photosRes.error && photosRes.data && photosRes.data.length > 0) {
          const stories: SekolahStoryActivity[] = photosRes.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            categoryTag: row.time_tag || 'Dokumentasi Sekolah',
            subtitle: row.location || 'SMP Plus Jauharul Maknuun',
            description: row.description || '',
            imageUrl: row.image_url,
            achievements: [],
            dateOrPeriod: row.time_tag || 'Terbaru'
          }));
          setSchoolStories(stories);
        }
      } catch (err) {
        console.warn('Failed to load programs_sekolah:', err);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ========================================================= */}
      {/* SEKSI 1: PILAR PROGRAM SEKOLAH (Cards Grid) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>SMP Plus Jauharul Maknuun</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Program Akademik &amp; Keunggulan Sekolah
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Harmoni kurikulum nasional berakreditasi A dengan pembinaan karakter kesantrian, sains STEM, dan prestasi olimpiade.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
          {programs.map((prog) => {
            const Icon =
              prog.iconName === 'GraduationCap'
                ? GraduationCap
                : prog.iconName === 'Cpu'
                ? Cpu
                : prog.iconName === 'Compass'
                ? Compass
                : Trophy;

            return (
              <div
                key={prog.id}
                className="group relative bg-white/90 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {((prog.images && prog.images.length > 0) || prog.imageUrl) && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
                    <CardImageSlider
                      images={prog.images && prog.images.length > 0 ? prog.images : [prog.imageUrl!]}
                      alt={prog.title}
                      aspectRatio="aspect-[16/9]"
                      containerClassName="w-full h-full"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-800 dark:text-blue-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                      {prog.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      {prog.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Standar Capaian:
                  </div>
                  <ul className="space-y-1.5">
                    {prog.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
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
      {/* SEKSI 2: FOTO KEGIATAN & NARASI (Visual Story Cards) */}
      {/* Alternating split view: Desktop alternating, Stacked mobile */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Aktivitas Kontekstual Santri</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Cerita &amp; Dokumentasi Kegiatan Siswa
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Kombinasi pembelajaran praktis, kepemimpinan lapangan, dan penguatan bakat santri.
          </p>
        </div>

        {/* Visual Story Cards (Alternating Layout) */}
        {schoolStories.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {schoolStories.map((story, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={story.id}
                  className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-0 items-center ${
                      !isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Photo Column */}
                    <div
                      className={`lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer ${
                        !isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                      onClick={() => setSelectedStoryImage(story.imageUrl)}
                      title="Klik untuk perbesar foto kegiatan"
                    >
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[220px] sm:min-h-[260px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white text-[11px] font-bold backdrop-blur-md shadow-xs">
                          {story.dateOrPeriod}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                          {story.categoryTag}
                        </span>
                        <span className="text-xs font-bold">
                          SMP Plus Jauharul Maknuun
                        </span>
                      </div>
                    </div>

                    {/* Story Narrative Column */}
                    <div
                      className={`lg:col-span-7 p-3.5 sm:p-5 lg:p-6 space-y-2.5 ${
                        !isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                            {story.categoryTag}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                          {story.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-1">
                          {story.subtitle}
                        </p>
                      </div>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {story.description}
                      </p>

                      {/* Achievements List */}
                      {story.achievements.length > 0 && (
                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                            Poin &amp; Capaian Kegiatan:
                          </div>
                          <ul className="space-y-1.5">
                            {story.achievements.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-500 text-xs">
            Belum ada dokumentasi kegiatan sekolah yang dipublikasikan.
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL: FULLSCREEN STORY PHOTO PREVIEW */}
      {/* ========================================================= */}
      {selectedStoryImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedStoryImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStoryImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img
                src={selectedStoryImage}
                alt="Story Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

