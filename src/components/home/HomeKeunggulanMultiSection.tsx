import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Cpu,
  Languages,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface KeunggulanItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  order_index?: number;
  data?: any;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Cpu,
  Languages,
  ShieldCheck,
  Sparkles
};

export const HomeKeunggulanMultiSection: React.FC = () => {
  const [items, setItems] = useState<KeunggulanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await (supabase.from('sub_items' as any) as any)
        .select('*')
        .eq('parent_module', 'keunggulan_items')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setItems((data as any) || []);
    } catch (err) {
      console.error('Error fetching keunggulan_items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel('realtime_keunggulan_home')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sub_items', filter: 'parent_module=eq.keunggulan_items' },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/4 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 space-y-2 sm:space-y-2.5">
      <div className="text-center max-w-2xl mx-auto space-y-1">
        <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 inline-block">
          Karakteristik & Keistimewaan
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 tracking-tight">
          Pilar Keunggulan Pendidikan PPJM
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Integrasi harmonis antara kurikulum keagamaan tradisional, kompetensi teknologi modern, dan penguasaan bahasa internasional.
        </p>
      </div>

      <div
        className={`grid gap-2 sm:gap-2.5 ${
          items.length === 1
            ? 'grid-cols-1 max-w-md mx-auto'
            : items.length === 2
            ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
            : items.length === 3
            ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {items.map((item) => {
          const IconComponent = (item.icon && ICON_MAP[item.icon]) || Sparkles;
          const statsBadge = item.data?.stats;
          const tagBadge = item.data?.badge;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200 card-hover-smooth flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {tagBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {tagBadge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {statsBadge && (
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Highlight:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {statsBadge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

