import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  Sparkles,
  Maximize2,
  Download,
  Share2,
  X,
  Check,
  BookmarkCheck,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  MadinFlyerItem,
  FlyerCategory,
  FlyerLevel
} from './types';

export const MadinFlyerSection: React.FC = () => {
  const [flyers, setFlyers] = useState<MadinFlyerItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<FlyerCategory>('kitab');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [activeFlyer, setActiveFlyer] = useState<MadinFlyerItem | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchFlyers = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('madin_flyers')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: MadinFlyerItem[] = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            category: (row.category as FlyerCategory) || 'kitab',
            level: (row.level as FlyerLevel) || 'Umum',
            subject: row.subject || '-',
            description: row.description || '-',
            imageUrl: row.image_url || null,
            tags: Array.isArray(row.tags) ? row.tags : []
          }));
          setFlyers(mapped);
        }
      } catch (err) {
        console.warn('Failed to load madin_flyers:', err);
      }
    };
    fetchFlyers();
  }, []);

  const filteredFlyers = flyers.filter((item) => {
    if (item.category !== categoryFilter) return false;
    if (levelFilter !== 'all') {
      if (item.level !== levelFilter) return false;
    }
    return true;
  });

  const openFlyerModal = (flyer: MadinFlyerItem) => {
    setActiveFlyer(flyer);
    setOpenModal(true);
  };

  const closeFlyerModal = () => {
    setOpenModal(false);
    setActiveFlyer(null);
  };

  const handleShare = async (flyer: MadinFlyerItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/program-unggulan/program-madin?flyer=${flyer.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: flyer.title,
          text: `${flyer.title} - ${flyer.subject} di PP Jauharul Maknuun`,
          url: shareUrl
        });
      } catch {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadFlyer = (flyer: MadinFlyerItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = flyer.imageUrl;
    link.download = `Flyer-${flyer.title.replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-slate-200/70 dark:border-zinc-800/70 pb-1.5 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold uppercase tracking-wider mb-0.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Khazanah Turats &amp; Ubudiyah Santri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Galeri Poster Kitab &amp; Panduan Ubudiyah
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Kumpulan flyer kurikulum kitab kuning berjenjang dan poster edukasi ibadah harian santri yang dapat dipelajari, diperbesar, dan diunduh.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlyers.map((flyer) => (
          <div
            key={flyer.id}
            onClick={() => openFlyerModal(flyer)}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={flyer.imageUrl} alt={flyer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-900/90 text-emerald-100 uppercase shadow-sm`}>
                  {flyer.level}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 z-10 flex gap-1">
                <button onClick={(e) => handleDownloadFlyer(flyer, e)} className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-lg backdrop-blur text-slate-600 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" title="Unduh">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={(e) => handleShare(flyer, e)} className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-lg backdrop-blur text-slate-600 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" title="Bagikan">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-2">{flyer.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3 line-clamp-2">{flyer.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {flyer.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>{flyer.category}</span>
                <span>{flyer.subject}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openModal && activeFlyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeFlyerModal}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl max-w-4xl w-full mx-4 sm:mx-6 md:mx-8 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activeFlyer.title}</h2>
              <button onClick={closeFlyerModal} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 transition-colors" title="Tutup">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-6 overflow-y-auto max-h-[70vh]">
              <div className="shrink-0 relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 shadow-lg">
                <img src={activeFlyer.imageUrl} alt={activeFlyer.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-900/90 text-emerald-100 uppercase shadow-sm`}>
                    {activeFlyer.level}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {activeFlyer.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">{activeFlyer.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50 dark:border-zinc-800/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kategori</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{activeFlyer.category}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mata Pelajaran</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{activeFlyer.subject}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 flex justify-end gap-2">
              <button
                onClick={(e) => handleDownloadFlyer(activeFlyer, e)}
                className="px-4 py-2 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Unduh Poster
              </button>
              <button
                onClick={(e) => handleShare(activeFlyer, e)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/50 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Bagikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}