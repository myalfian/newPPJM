import React from 'react';
import { Activity, Music, Shield, Cpu, Globe, Camera, Flag } from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';
import { supabase } from '../lib/supabase';
import { useCachedQuery } from '../lib/queryCache';

export interface EkskulItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  schedule: string;
  mentor: string;
  desc: string;
  image: string;
  badge: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Music,
  Shield,
  Cpu,
  Globe,
  Camera,
  Flag,
  Activity,
};

const DEFAULT_EKSKULS: EkskulItem[] = [
  {
    id: 'e1',
    name: 'Hadrah Al-Banjari PPJM',
    icon: Music,
    schedule: 'Malam Rabu & Malam Ahad (20.00 WIB)',
    mentor: 'Ust. M. Ridlwan',
    desc: 'Pelatihan seni tabuh terbang banjari, teknik vokal sholawat, dan penguasaan qasidah puji-pujian kepada Rasulullah SAW.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    badge: 'Seni Musik Islami'
  },
  {
    id: 'e2',
    name: 'Pencak Silat Pagar Nusa',
    icon: Shield,
    schedule: 'Jumat Pagi & Selasa Sore',
    mentor: 'Pendekar Syamsul Hadi',
    desc: 'Penggemblengan fisik, teknik bela diri tradisional pencak silat nahdlatul ulama, dan penanaman budi pekerti luhur santri.',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80',
    badge: 'Bela Diri Tradisi'
  },
  {
    id: 'e3',
    name: 'Klub Robotika & IoT Pesantren',
    icon: Cpu,
    schedule: 'Sabtu Siang (13.30 - 16.00 WIB)',
    mentor: 'Ustadz Riski, S.T.',
    desc: 'Praktik mikrokontroler Arduino/ESP32, perakitan line follower, otomatisasi green-house, dan persiapan kompetisi sains.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    badge: 'Teknologi & Sains'
  },
  {
    id: 'e4',
    name: 'Klub Bahasa Asing (Arab & Mandarin)',
    icon: Globe,
    schedule: 'Senin & Kamis Malam',
    mentor: 'Lao Shi Chen & Ust. Fauzan',
    desc: 'Pelatihan muhadharah (pidato tiga bahasa), percakapan tematik, tata bahasa Pinyin, dan seni kaligrafi khat.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    badge: 'Bahasa Internasional'
  },
  {
    id: 'e5',
    name: 'Kreatif Multimedia & Jurnalistik',
    icon: Camera,
    schedule: 'Ahad Pagi (08.00 WIB)',
    mentor: 'Tim Media PPJM',
    desc: 'Pelatihan fotografi dakwah, videografi dokumenter, pengelolaan web santri, dan penulisan artikel buletin pesantren.',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    badge: 'Media Dakwah'
  },
  {
    id: 'e6',
    name: 'Gerakan Pramuka Gudep Santri',
    icon: Flag,
    schedule: 'Sabtu Sore (15.30 WIB)',
    mentor: 'Kak Ahmad Yani',
    desc: 'Pengembangan karakter kemandirian, survival alam terbuka, tali temali, kedisiplinan baris-berbaris, dan jiwa kepemimpinan.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    badge: 'Kepanduan'
  }
];

const fetchEkskuls = async (): Promise<EkskulItem[]> => {
  try {
    const { data, error } = await supabase
      .from('extracurriculars')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_EKSKULS;
    }

    return data.map((item) => {
      const IconComp = ICON_MAP[item.icon_name || 'Activity'] || Activity;
      return {
        id: item.id,
        name: item.name,
        icon: IconComp,
        schedule: item.schedule,
        mentor: item.mentor_name || 'Pembina PPJM',
        desc: item.description,
        image: item.cover_image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        badge: item.icon_name || 'Ekstrakurikuler'
      };
    });
  } catch {
    return DEFAULT_EKSKULS;
  }
};

export const Ekskul: React.FC = () => {
  const { data: ekskuls } = useCachedQuery<EkskulItem[]>(
    'ekskul_list',
    fetchEkskuls,
    DEFAULT_EKSKULS
  );

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Kreativitas & Minat Bakat</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Direktori Ekstrakurikuler Santri
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Wadah pengembangan potensi jasmani, kesenian islami, sains teknologi, dan keterampilan dakwah santri PP Jauharul Maknuun.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-3">
        {ekskuls.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-32 sm:h-38 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-900/80 backdrop-blur-md text-gold-300 text-xs font-bold">
                    {item.badge}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-3 h-3" />
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-emerald-950 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 space-y-0.5 text-xs text-slate-500">
                    <div><strong>Jadwal:</strong> {item.schedule}</div>
                    <div><strong>Pembina:</strong> {item.mentor}</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 pt-0">
                <span className="inline-block text-xs font-bold text-emerald-800">
                  Terbuka untuk Santri Mukim
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
