import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Building2, BookOpen, Sparkles, Cpu, Globe, Users, ChevronRight } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const Lembaga: React.FC = () => {
  const lembagaList = [
    {
      title: 'Madrasah Diniyah Salafiyah (Madin)',
      icon: BookOpen,
      desc: 'Pusat kajian kitab turats berjenjang dari tingkat Ula, Wustho, hingga Ulya. Mengkaji Matan Jurumiyah, Imrithi, Alfiyah Ibnu Malik, Fathul Qorib, dan Ushul Fiqih.',
      tag: 'Kajian Turats',
      link: '/program-unggulan/program-madin'
    },
    {
      title: 'Markaz Tahfidzul Qur’an 30 Juz',
      icon: Sparkles,
      desc: 'Unit khusus pembinaan hafalan Al-Qur’an 30 juz mukim dengan sanad muttashil, metode ziyadah mutqin, tasmi’ berkala, dan evaluasi berbasis Murojaah AI.',
      tag: 'Tahfidz Mutqin',
      link: '/smart-jm/hafidz/read'
    },
    {
      title: 'Pendidikan Formal Sekolah Terpadu',
      icon: Building2,
      desc: 'Lembaga pendidikan formal kurikulum nasional berkarakter islami. Mengembangkan kemampuan akademik tinggi, kepemimpinan, dan sains aplikatif.',
      tag: 'Formal Terakreditasi',
      link: '/program-unggulan/program-sekolah'
    },
    {
      title: 'Laboratorium Riset & Inovasi STEM',
      icon: Cpu,
      desc: 'Wadah eksplorasi sains, robotika, sensorik, dan otomasi IoT santri untuk menghasilkan karya teknologi nyata yang bermanfaat bagi pesantren dan lingkungan.',
      tag: 'Teknologi Santri',
      link: '/smart-jm/stem/portofolio'
    },
    {
      title: 'Pusat Bahasa Asing (Arab & Mandarin)',
      icon: Globe,
      desc: 'Lembaga intensif kemahiran percakapan aktif bahasa Arab dan Mandarin dengan audio penutur asli untuk mempersiapkan santri menembus kampus global.',
      tag: 'Bahasa Global',
      link: '/smart-jm/mandarin/materi'
    },
    {
      title: 'Lembaga Kesejahteraan & Asrama Santri',
      icon: Users,
      desc: 'Mengelola manajemen kenyamanan asrama putra-putri, gizi santri, ketertiban qana’ah, dan unit koperasi kewirausahaan mandiri pesantren.',
      tag: 'Kemandirian Santri',
      link: '/program-unggulan/amaliyah-pondok'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Struktur Badan Otonom</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Badan Otonom & Unit Lembaga PPJM
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl">
            Sinergi unit pelaksana pendidikan, riset, dan dakwah di bawah naungan Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </div>

      {/* Lembaga Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lembagaList.map((unit) => {
          const Icon = unit.icon;
          return (
            <div
              key={unit.title}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    {unit.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {unit.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={unit.link}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
