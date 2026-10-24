import React from 'react';
import { BookOpen, Layers, CheckCircle2, Bookmark, Award } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const ProgramMadin: React.FC = () => {
  const levels = [
    {
      level: 'Tingkat Ula (Dasar / Matan Al-Ajurumiyah)',
      target: 'Santri Tahun Pertama',
      kitab: [
        'Matan Al-Ajurumiyah (Ilmu Nahwu Dasar)',
        'Al-Amtsilah At-Tashrifiyyah (Ilmu Sharaf / Morfologi Arab)',
        'Safinatun Najah & Sullamut Taufiq (Fiqih Dasar)',
        'Aqidatul Awam & Tijanud Darori (Ilmu Tauhid)',
        'Akhlaq lil Banin / Banat (Adab Kesantrian)'
      ],
      desc: 'Membangun pondasi gramatika bahasa Arab dasar agar santri mampu membaca lafadz tanpa harakat dengan kaidah i’rob yang lurus.'
    },
    {
      level: 'Tingkat Wustho (Menengah / Nazham Al-Imrithi)',
      target: 'Santri Tahun Kedua & Ketiga',
      kitab: [
        'Ad-Durrah Al-Bahiyyah Nazham Al-Imrithi (Nahwu Lanjutan)',
        'Fathul Qorib Al-Mujib Syarah Taqrib (Fiqih Madzhab Syafi’i)',
        'Kailani & Qowa’idul I’lal (Sharaf Mendalam)',
        'Ta’limul Muta’allim Thariqat Ta’allum (Adab Pencari Ilmu)',
        'Matan Al-Waraqat (Pengantar Ushul Fiqih)'
      ],
      desc: 'Mengasah kemampuan santri dalam mengurai ibarat kitab kuning, memahami dalil furu’iyyah fiqih, dan mengkaji matan nazham bait.'
    },
    {
      level: 'Tingkat Ulya (Tinggi / Alfiyah Ibnu Malik & Fathul Mu’in)',
      target: 'Santri Tingkat Mahir & Takhassus',
      kitab: [
        'Alfiyah Ibnu Malik (1.000 Bait Nahwu & Sharaf)',
        'Fathul Mu’in bi Syarhi Qurratil ‘Ain (Fiqih Klasik Mendalam)',
        'Al-Jauharul Maknuun (Ilmu Balaghah: Ma’ani, Bayan, Badi’)',
        'Lathaiful Isyarat & Jam’ul Jawami’ (Ushul Fiqih Tingkat Tinggi)',
        'Ihya Ulumiddin & Hikam Ibnu Athaillah (Tasawuf & Akhlak)'
      ],
      desc: 'Kaderisasi faqih dan mutafaqqih fiddin yang piawai melakukan istinbath hukum, menguasai keindahan sastra Balaghah Jauharul Maknuun, dan berakhlaq shufi.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kajian Turats Bersanad</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Madrasah Diniyah Salafiyah (Madin)
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl">
            Jenjang keilmuan kitab kuning berjenjang: Matan Jurumiyah, Al-Imrithi, Alfiyah Ibnu Malik, hingga Fathul Mu’in dan Al-Jauharul Maknuun.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-m3-1 border border-slate-200 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-950">
          Metode Sorogan, Bandongan & Musyawarah Bahsul Masail
        </h2>
        <p>
          Madrasah Diniyah Salafiyah di PP Jauharul Maknuun Lasem memelihara metode pembelajaran klasik yang telah teruji ratusan tahun melahirkan ulama-ulama besar. Setiap santri diwajibkan menyetorkan bacaan kitab gundul (sorogan) langsung di hadapan asatidz untuk memastikan ketepatan harakat dan kedalaman pemahaman ibarat kitab.
        </p>
      </div>

      {/* Levels Showcase */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          <h3 className="text-xl font-extrabold text-emerald-950">
            Tingkatan Kurikulum Diniyah PPJM
          </h3>
        </div>

        <div className="space-y-6">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="text-lg font-black text-emerald-950">
                  {lvl.level}
                </h4>
                <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold">
                  {lvl.target}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {lvl.desc}
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Kitab Mu’tabarah Yang Dikaji:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
                  {lvl.kitab.map((ktb, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-100">
                      <Bookmark className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                      <span>{ktb}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
