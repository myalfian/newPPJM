import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Maximize2,
  X,
  Users,
  CheckCircle2,
  Tag,
  Sparkles,
  Info
} from 'lucide-react';
import { FacilityItem } from './types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { LiquidMercuryControl } from '../../components/common/LiquidMercuryControl';

export const FacilitiesSection: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxFacility, setLightboxFacility] = useState<FacilityItem | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await (supabase.from('sub_items' as any) as any)
        .select('title')
        .eq('parent_module', 'facilities_categories')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (data && !error && data.length > 0) {
        setCategories(['Semua', ...data.map((c: any) => c.title)]);
      }
    } catch (e) {}
  };

  const fetchFacilities = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (data && !error) {
        setFacilities(
          data.map((f: any) => ({
            id: f.id,
            name: f.name,
            category: (f.category as any) || 'Pendidikan',
            description: f.description || '',
            capacity: f.capacity || undefined,
            image: f.image_url || '/logo-ppjm.svg',
            features: Array.isArray(f.features) ? f.features : [],
          }))
        );
      }
    } catch (err) {
      console.warn('Error fetching facilities from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFacilities();

    const channel = supabase
      .channel('public-facilities-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'facilities' },
        () => fetchFacilities()
      )
      .subscribe();

    const catChannel = supabase
      .channel('public-fac-cats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sub_items', filter: 'parent_module=eq.facilities_categories' },
        () => fetchCategories()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(catChannel);
    };
  }, []);

  const filteredFacilities = selectedCategory === 'Semua'
    ? facilities
    : facilities.filter((f) => f.category === selectedCategory);

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ id: cat, label: cat })),
    [categories]
  );

  return (
    <div className="space-y-1.5 sm:space-y-2">
      {/* Header Info & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 sm:gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold uppercase tracking-wider mb-0.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Sarana &amp; Prasarana Representatif</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            Fasilitas Penunjang Santri &amp; Sekolah
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Dirancang secara higienis, aman, dan modern untuk mendukung kenyamanan belajar, beribadah, dan bertempat tinggal.
          </p>
        </div>

        {/* Liquid Mercury Segmented Filter */}
        <div className="shrink-0 max-w-full overflow-x-auto no-scrollbar">
          <LiquidMercuryControl
            size="sm"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            ariaLabel="Filter Kategori Fasilitas"
          />
        </div>
      </div>

      {/* Grid Kartu Fasilitas Modern Lux (aspect-[16/10], zoom-on-hover) */}
      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-400 animate-pulse">
          Memuat daftar fasilitas pesantren...
        </div>
      ) : filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
          {filteredFacilities.map((fac) => (
            <article
              key={fac.id}
              className="group bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md card-hover-smooth flex flex-col justify-between"
            >
              <div>
                {/* Visual Image dengan Zoom on Hover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Category Pill Tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-300 border border-white/20">
                    {fac.category}
                  </span>

                  {/* Quick Expand Button */}
                  <button
                    type="button"
                    onClick={() => setLightboxFacility(fac)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-700 cursor-pointer"
                    title="Perbesar Foto Fasilitas"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Deskripsi & Konten Fasilitas */}
                <div className="p-2.5 sm:p-3 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {fac.description}
                  </p>
                </div>
              </div>

              {/* Footer Fitur Unggulan */}
              {fac.features && fac.features.length > 0 && (
                <div className="p-2.5 sm:p-3 pt-0">
                  <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                    {fac.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 dark:text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-zinc-400">
          Belum ada data fasilitas pada kategori ini.
        </div>
      )}

      {/* Lightbox Modal Detail Fasilitas */}
      <AnimatePresence>
        {lightboxFacility && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs modal-smooth-backdrop"
            onClick={() => setLightboxFacility(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl overflow-hidden max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-3"
            >
              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={lightboxFacility.image}
                  alt={lightboxFacility.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setLightboxFacility(null)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 sm:p-4 pt-0 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {lightboxFacility.category}
                  </span>
                  {lightboxFacility.capacity && (
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {lightboxFacility.capacity}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  {lightboxFacility.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {lightboxFacility.description}
                </p>

                {lightboxFacility.features && lightboxFacility.features.length > 0 && (
                  <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sarana &amp; Fasilitas Pelengkap:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {lightboxFacility.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
