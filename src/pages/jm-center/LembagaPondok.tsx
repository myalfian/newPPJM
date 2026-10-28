import React from 'react';
import { Layers, BookOpen, Sparkles, HeartHandshake, ShieldCheck, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { useCachedQuery } from '../../lib/queryCache';
import { fetchJmPage } from '../../lib/profileQueries';

export const LembagaPondok: React.FC = () => {
  const { data: pageData } = useCachedQuery(
    'jm-center-lembaga-pondok',
    () => fetchJmPage('lembaga-pondok')
  );

  const unitPondokList = [
    {
      title: "Majelis Pengasuh & Dewan Kiai",
      icon: Users,
      role: "Pimpinan Tertinggi & Rujukan Fatwa",
      desc: "Memegang otoritas spiritual tertinggi, memelihara kemurnian sanad keilmuan Ahlussunnah wal Jama'ah An-Nahdliyyah, serta memberikan bimbingan ruhani kepada seluruh asatidz dan santri.",
      link: "/jm-center/sambutan",
      linkLabel: "Lihat Kalam Pengasuh"
    },
    {
      title: "Madrasah Diniyah Salafiyah (Madin)",
      icon: BookOpen,
      role: "Pusat Kajian Kitab Kuning Turats",
      desc: "Mengelola pendidikan keagamaan formal pesantren berjenjang (Ula, Wustho, Ulya) dengan metode sorogan, bandongan, wetonan, dan mudzakarah bahtsul masail.",
      link: "/program-unggulan/program-madin",
      linkLabel: "Detail Kurikulum Madin"
    },
    {
      title: "Markaz Tahfidzul Qur'an 30 Juz",
      icon: Sparkles,
      role: "Pembinaan Penghafal Al-Qur'an Bersanad",
      desc: "Menyelenggarakan halaqah tahfidz intensif mukim dengan target hafalan 30 juz mutqin, sertifikasi sanad qira'ah, serta tasmi' akbar setiap semester.",
      link: "/smart-jm/hafidz/read",
      linkLabel: "Buka Hafidz Center"
    },
    {
      title: "Badan Pengasuhan & Keamanan Santri",
      icon: ShieldCheck,
      role: "Kedisiplinan, Adab & Tata Tertib 24 Jam",
      desc: "Mengawal kedisiplinan peribadatan sholat berjamaah, manajemen ketertiban asrama santri, pembiasaan akhlaqul karimah, serta proteksi keamanan lingkungan pondok.",
      link: "/program-unggulan/amaliyah-pondok",
      linkLabel: "Tata Tertib & Amaliyah"
    },
    {
      title: "Biro Dakwah & Majelis Ta'lim Masyarakat",
      icon: HeartHandshake,
      role: "Pengabdian Sosial & Silaturahmi Umat",
      desc: "Mengkoordinir pengajian umum ahad kliwon, safari maulid santri di wilayah Sidayu dan pesisir Gresik, serta bakti sosial kemasyarakatan berkala.",
      link: "/berita",
      linkLabel: "Warta Aktivitas Dakwah"
    },
    {
      title: "Koperasi & Kemandirian Santri (Kopontren)",
      icon: Layers,
      role: "Ekonomi Pesantren & Laboratorium Kewirausahaan",
      desc: "Menyediakan kebutuhan harian santri, kantin bersih, percetakan kitab, serta sarana pelatihan kewirausahaan dan etika bisnis syariah santri.",
      link: "/agenda",
      linkLabel: "Agenda Kegiatan Santri"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-2 sm:space-y-3">
      {/* Tab Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-3 sm:p-4 lg:p-5 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37] text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Badan Otonom & Struktur Pesantren</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {pageData?.title || 'Lembaga Pondok Pesantren'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            {pageData?.subtitle || 'Struktur kelembagaan internal Pondok Pesantren Jauharul Maknuun yang mengemban amanah tarbiyah salaf, pengasuhan karakter, dan dakwah keumatan.'}
          </p>
        </div>
      </div>

      {pageData?.content && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-m3-1 border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <p className="whitespace-pre-line">{pageData.content}</p>
        </div>
      )}

      {/* Grid Unit Lembaga Pondok */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4">
        {unitPondokList.map((unit) => {
          const Icon = unit.icon;
          return (
            <div
              key={unit.title}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    Unit Pesantren
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-emerald-900 transition-colors">
                    {unit.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#d4af37]">
                    {unit.role}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {unit.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3">
                <Link
                  to={unit.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{unit.linkLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

