import React from 'react';
import { Activity, Music, Shield, Cpu, Globe, Camera, Flag } from 'lucide-react';
import { FolderBreadcrumbTabs } from '../components/common/FolderBreadcrumbTabs';

export const Ekskul: React.FC = () => {
  const ekskuls = [
    {
      name: 'Hadrah Al-Banjari PPJM',
      icon: Music,
      schedule: 'Malam Rabu & Malam Ahad (20.00 WIB)',
      mentor: 'Ust. M. Ridlwan',
      desc: 'Pelatihan seni tabuh terbang banjari, teknik vokal sholawat, dan penguasaan qasidah puji-pujian kepada Rasulullah SAW.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      badge: 'Seni Musik Islami'
    },
    {
      name: 'Pencak Silat Pagar Nusa',
      icon: Shield,
      schedule: 'Jumat Pagi & Selasa Sore',
      mentor: 'Pendekar Syamsul Hadi',
      desc: 'Penggemblengan fisik, teknik bela diri tradisional pencak silat nahdlatul ulama, dan penanaman budi pekerti luhur santri.',
      image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80',
      badge: 'Bela Diri Tradisi'
    },
    {
      name: 'Klub Robotika & IoT Pesantren',
      icon: Cpu,
      schedule: 'Sabtu Siang (13.30 - 16.00 WIB)',
      mentor: 'Ustadz Riski, S.T.',
      desc: 'Praktik mikrokontroler Arduino/ESP32, perakitan line follower, otomatisasi green-house, dan persiapan kompetisi sains.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      badge: 'Teknologi & Sains'
    },
    {
      name: 'Klub Bahasa Asing (Arab & Mandarin)',
      icon: Globe,
      schedule: 'Senin & Kamis Malam',
      mentor: 'Lao Shi Chen & Ust. Fauzan',
      desc: 'Pelatihan muhadharah (pidato tiga bahasa), percakapan tematik, tata bahasa Pinyin, dan seni kaligrafi khat.',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
      badge: 'Bahasa Internasional'
    },
    {
      name: 'Kreatif Multimedia & Jurnalistik',
      icon: Camera,
      schedule: 'Ahad Pagi (08.00 WIB)',
      mentor: 'Tim Media PPJM',
      desc: 'Pelatihan fotografi dakwah, videografi dokumenter, pengelolaan web santri, dan penulisan artikel buletin pesantren.',
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
      badge: 'Media Dakwah'
    },
    {
      name: 'Gerakan Pramuka Gudep Santri',
      icon: Flag,
      schedule: 'Sabtu Sore (15.30 WIB)',
      mentor: 'Kak Ahmad Yani',
      desc: 'Pengembangan karakter kemandirian, survival alam terbuka, tali temali, kedisiplinan baris-berbaris, dan jiwa kepemimpinan.',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      badge: 'Kepanduan'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <FolderBreadcrumbTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Kreativitas & Minat Bakat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Direktori Ekstrakurikuler Santri
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl">
            Wadah pengembangan potensi jasmani, kesenian islami, sains teknologi, dan keterampilan dakwah santri PP Jauharul Maknuun.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ekskuls.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md text-gold-300 text-xs font-bold">
                    {item.badge}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                    <div><strong>Jadwal:</strong> {item.schedule}</div>
                    <div><strong>Pembina:</strong> {item.mentor}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
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
