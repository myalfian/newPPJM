import React from 'react';
import { Compass, Target, Eye, Sparkles, Shield, HeartHandshake, Award } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const VisiMisi: React.FC = () => {
  const misiItems = [
    {
      number: '01',
      title: 'Aqidah & Akhlakul Karimah',
      desc: 'Menanamkan aqidah Ahlussunnah wal Jama’ah an-Nahdliyyah serta membiasakan adab kesantrian dalam setiap gerak langkah santri.'
    },
    {
      number: '02',
      title: 'Pendalaman Turats Salaf',
      desc: 'Menyelenggarakan kajian kitab kuning secara bersanad, komprehensif, dan berjenjang dari nahwu sharaf hingga ushul fiqih.'
    },
    {
      number: '03',
      title: 'Tahfidzul Qur’an 30 Juz Mutqin',
      desc: 'Membimbing santri menghafal Al-Qur’an 30 juz dengan kaidah tajwid yang fasih, pemahaman makna, serta ujian tasmi’ berkala.'
    },
    {
      number: '04',
      title: 'Riset Sains & Rekayasa STEM',
      desc: 'Mengembangkan literasi sains aplikatif melalui laboratorium robotika, mekatronika, dan IoT yang solutif bagi kemaslahatan masyarakat.'
    },
    {
      number: '05',
      title: 'Kemahiran Bahasa Internasional',
      desc: 'Membekali santri keahlian bahasa Mandarin dan Arab penutur asli untuk mempersiapkan juru dakwah yang berdaya saing global.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Falsafah & Arah Langkah</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Visi, Misi & Tujuan Pesantren
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Arah strategis kaderisasi ulama saintis masa depan di Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </div>

      {/* 3D Visi Card */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-4 sm:p-6 shadow-m3-2 border border-emerald-200/80 relative overflow-hidden space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-gold-400 flex items-center justify-center shadow-md">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-gold-700 uppercase tracking-widest">
              Visi Utama PPJM
            </span>
            <h2 className="text-lg sm:text-xl font-black text-emerald-950">
              Visi Pondok Pesantren
            </h2>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg lg:text-xl font-bold text-emerald-900 leading-relaxed sm:leading-loose italic border-l-4 border-gold-500 pl-4 py-1">
          “Menjadi pusat keunggulan pendidikan Islam salaf-modern yang melahirkan ulama amilin, cendekiawan berakhlak mulia, penghafal Al-Qur’an, dan pelopor inovasi teknologi yang berdaya saing global.”
        </blockquote>
      </div>

      {/* Misi Cards Grid */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2.5">
          <Target className="w-5 h-5 text-emerald-700" />
          <h3 className="text-lg sm:text-xl font-black text-emerald-950">
            Lima Misi Utama Pesantren
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
          {misiItems.map((misi) => (
            <div
              key={misi.number}
              className="bg-white rounded-2xl p-3.5 sm:p-4.5 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black text-gold-500">
                  {misi.number}
                </span>
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-base sm:text-lg text-emerald-950">
                  {misi.title}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {misi.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
