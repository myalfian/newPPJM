import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { InstitutionItem } from './types';
import { SafeRichContent } from '../../components/common/SafeRichContent';

export interface InstitutionsSectionProps {
  initialFilter?: 'all' | 'pesantren' | 'formal' | 'madin';
}

export const InstitutionsSection: React.FC<InstitutionsSectionProps> = ({ initialFilter = 'all' }) => {
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pesantren' | 'formal' | 'madin'>(initialFilter);

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    let isMounted = true;
    const fetchInstitutions = async () => {
      if (!isSupabaseConfigured()) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: InstitutionItem[] = data.map((row: any) => {
            const isMadin = row.type === 'diniyah' || row.type === 'madin' || row.name?.toLowerCase().includes('mdt') || row.name?.toLowerCase().includes('diniyah');
            const isFormal = row.type === 'formal' || row.name?.toLowerCase().includes('smp');

            const shortName = isMadin
              ? 'MDT Wustho Jauharul Maknuun'
              : isFormal
              ? 'SMP Plus JM'
              : 'Pondok Pesantren (PPJM)';

            const categoryTag = isMadin
              ? 'Pendidikan Keagamaan Formal/Salaf'
              : isFormal
              ? 'Pendidikan Formal dan Pesantren'
              : 'Lembaga Kepesantrenan';

            const tagline = isMadin
              ? 'Pembelajaran Agama & Bahasa Arab Pengantar Turats Berizin Kemenag RI'
              : isFormal
              ? 'SMP Plus Jauharul Maknuun “Islamic Boarding School” (Terakreditasi "A" BAN-PDM)'
              : 'Kawah Candradimuka Santri Mukim, Tahfidz 30 Juz Bersanad & Karakter Salaf';

            const curriculumList = Array.isArray(row.curriculum)
              ? row.curriculum
              : typeof row.curriculum === 'string'
              ? JSON.parse(row.curriculum)
              : [];

            const features = isMadin
              ? [
                  'Pembelajaran agama dan tata bahasa Arab pengantar Al-Qur’an & Hadis',
                  'Kurikulum pesantren salaf dengan sistem klasik maknani Jawa',
                  'Mata pelajaran: Fikih, Nahwu, Shorof, Hadits, Akhlak, Tauhid, Faraidh, Tarikh',
                  'Lembaga terdaftar resmi di Kantor Kementerian Agama RI',
                  'Di bawah naungan resmi Yayasan Al Jauharu Al Maknuun Lasem',
                  'Alamat: Jl. Raya Dukun – Lasem RT 01 RW 01 Lasem, Sidayu, Gresik',
                ]
              : isFormal
              ? [
                  '4 Sintesa Kurikulum: Gontor, Yanbu’ul Qur’an, Mambaus Sholihin, & SD IRADA',
                  'Satu manajemen mutu terpadu dengan SD IRADA “Full Day Education” Gresik',
                  'Kepala Sekolah: Ferany Ardiana, S.S., M.Pd. (085850868616)',
                  'Program Unggulan: Tahfidz, JM Camp, Student Exchange, Bilingual Class, & SQ',
                  'Ekstrakurikuler: Robotik STEM, Perisai Diri, Mandarin, Kaligrafi, Panahan, Futsal',
                  'Alamat: Jl. Raya Dukun – Lasem RT 01 RW 01 Ds. Lasem, Kec. Sidayu, Kab. Gresik',
                ]
              : [
                  'Bimbingan talaqqi dan sanad keilmuan muttashil 30 Juz',
                  'Pengasuhan asrama penuh disiplin, asri, dan berbasis kekeluargaan',
                  'Pembiasaan bahasa Arab & bahasa Inggris percakapan harian',
                  'Evaluasi tasmi’ hafalan terbuka dan wisuda haflah berkala',
                ];

            const stats = isMadin
              ? [
                  { label: 'Tingkat', value: 'Wustho' },
                  { label: 'No. Statistik (NSDT)', value: '322235251146' },
                  { label: 'Tahun Berdiri', value: '21 – 08 – 2022' },
                  { label: 'Nama Yayasan', value: 'Al Jauharu Al Maknuun' },
                  { label: 'Legalitas', value: 'Terdaftar Kemenag RI' },
                ]
              : isFormal
              ? [
                  { label: 'Status Akreditasi', value: 'A (Unggul)' },
                  { label: 'NPSN', value: '70045189' },
                  { label: 'Tahun Berdiri', value: '2023' },
                  { label: 'Jumlah Santri', value: '128 Siswa' },
                  { label: 'Tenaga Pendidik', value: '27 Guru' },
                  { label: 'Status Sekolah', value: 'Swasta / Yayasan' },
                  { label: 'Kontak / Telp', value: '082131606535' },
                  { label: 'Email Resmi', value: 'smpplusjauharulmaknuun@gmail.com' },
                ]
              : [
                  { label: 'Sistem Pembelajaran', value: 'Terpadu 24 Jam' },
                  { label: 'Sanad Keilmuan', value: 'Muttashil' },
                  { label: 'Predikat Lembaga', value: 'Unggul & Mutqin' },
                ];

            return {
              id: row.id,
              name: row.name,
              shortName,
              categoryTag,
              tagline,
              description: row.description,
              image: row.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
              curriculumHighlight: curriculumList.join(', ') || 'Kurikulum Terpadu Pesantren & Riset',
              features,
              stats,
            };
          });
          setInstitutions(mapped);
        }
      } catch (err) {
        console.warn('Failed to load institutions from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInstitutions();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredInstitutions = institutions.filter((inst) => {
    if (filter === 'all') return true;
    if (filter === 'pesantren') {
      return (
        inst.categoryTag.toLowerCase().includes('pesantren') ||
        inst.shortName.toLowerCase().includes('pondok') ||
        inst.name.toLowerCase().includes('pondok')
      );
    }
    if (filter === 'formal') {
      return (
        inst.categoryTag.toLowerCase().includes('formal') ||
        inst.shortName.toLowerCase().includes('smp') ||
        inst.name.toLowerCase().includes('smp')
      );
    }
    if (filter === 'madin') {
      return (
        inst.categoryTag.toLowerCase().includes('turats') ||
        inst.shortName.toLowerCase().includes('madin') ||
        inst.name.toLowerCase().includes('madin') ||
        inst.name.toLowerCase().includes('madrasah')
      );
    }
    return true;
  });

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* Header Description & Filter Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Tritunggal Lembaga Terpadu</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Tiga Unit Entitas Pendidikan Terintegrasi
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Sinergi harmonis antara Pesantren Salafiyah, Sekolah Menengah Pertama Formal, dan Madrasah Diniyah untuk mewujudkan insan kamil.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/60 text-xs overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-xs whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Semua Unit
          </button>
          <button
            type="button"
            onClick={() => setFilter('pesantren')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-xs whitespace-nowrap cursor-pointer ${
              filter === 'pesantren'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Pondok Pesantren
          </button>
          <button
            type="button"
            onClick={() => setFilter('formal')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-xs whitespace-nowrap cursor-pointer ${
              filter === 'formal'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            SMP Plus (Sekolah)
          </button>
          <button
            type="button"
            onClick={() => setFilter('madin')}
            className={`px-2.5 py-1 rounded-lg font-bold transition text-xs whitespace-nowrap cursor-pointer ${
              filter === 'madin'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Madrasah Diniyah
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/60 dark:border-zinc-700/60"
            />
          ))}
        </div>
      )}

      {/* Split Card Display Adaptif */}
      {!loading && (
        <div className="space-y-2 sm:space-y-2.5">
          {filteredInstitutions.map((inst, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <article
                key={inst.id}
                className="bg-white/95 dark:bg-zinc-900/90 rounded-xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 sm:p-4 lg:p-4.5 shadow-xs hover:shadow-md card-hover-smooth"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-4 items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Media Image Column */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200/70 dark:border-zinc-700/60 shadow-md group">
                      <img
                        src={inst.image}
                        alt={inst.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                          {inst.shortName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-7 space-y-2 sm:space-y-2.5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="space-y-0.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/50">
                        {inst.categoryTag}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight pt-0.5">
                        {inst.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 italic">
                        {inst.tagline}
                      </p>
                    </div>

                    <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
                      <SafeRichContent content={inst.description} />
                    </div>

                    {/* Curriculum Highlight Box */}
                    <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 text-xs">
                      <strong className="text-zinc-800 dark:text-zinc-200 block text-[10.5px] uppercase tracking-wider mb-0.5">
                        Fokus Kurikulum:
                      </strong>
                      <span className="text-emerald-800 dark:text-emerald-400 font-medium">
                        {inst.curriculumHighlight}
                      </span>
                    </div>

                    {/* Bullet Points */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 pt-0.5">
                      {inst.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Stats Pill Badges */}
                    {inst.stats && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {inst.stats.map((stat, sIdx) => (
                          <div
                            key={sIdx}
                            className="px-2.5 py-0.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs"
                          >
                            <span className="text-zinc-500 dark:text-zinc-400 text-[9.5px] block">
                              {stat.label}
                            </span>
                            <span className="font-extrabold text-emerald-900 dark:text-emerald-300">
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
