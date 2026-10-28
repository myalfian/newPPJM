import React from 'react';
import { School, Award, BookCheck, Cpu, Globe, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { useCachedQuery } from '../../lib/queryCache';
import { fetchJmPage } from '../../lib/profileQueries';

export const LembagaSekolah: React.FC = () => {
  const { data: pageData } = useCachedQuery(
    'jm-center-lembaga-sekolah',
    () => fetchJmPage('lembaga-sekolah')
  );

  const unitSekolahList = [
    {
      title: "Kepala Sekolah & Manajemen Akademik",
      icon: School,
      role: "Tata Kelola Satuan Pendidikan Formal",
      desc: "Memimpin perumusan strategi mutu sekolah formal terakreditasi, memastikan kepatuhan standar nasional pendidikan, dan mengawasi implementasi kurikulum merdeka.",
      link: "/program-unggulan/program-sekolah",
      linkLabel: "Profil Kurikulum Sekolah"
    },
    {
      title: "Dewan Guru & Pendidik Bersertifikasi",
      icon: Users,
      role: "Tenaga Pengajar Linier & Berdedikasi",
      desc: "Para pendidik lulusan sarjana dan magister perguruan tinggi negeri/terkemuka yang memiliki kompetensi pedagogik, keilmuan kuat, dan keteladanan adab santri.",
      link: "/program-unggulan/program-sekolah",
      linkLabel: "Standar Pembelajaran"
    },
    {
      title: "Unit Riset & Laboratorium STEM Santri",
      icon: Cpu,
      role: "Inovasi Sains, Robotika & Kecerdasan Buatan",
      desc: "Membimbing riset aplikatif, pemrograman software, perakitan mikrokontroler sensor, serta persiapan keikutsertaan santri dalam olimpiade sains nasional (OSN).",
      link: "/smart-jm/stem/materi",
      linkLabel: "Eksplorasi Modul STEM"
    },
    {
      title: "Pusat Bahasa Asing (Language Center)",
      icon: Globe,
      role: "Kemahiran Bahasa Mandarin & Arab Aktif",
      desc: "Menyelenggarakan pembelajaran bahasa asing intensif, simulasi tes HSK (Hanyu Shuiping Kaoshi), TOAFL, serta dialog interaktif penutur asli untuk beasiswa luar negeri.",
      link: "/smart-jm/mandarin/materi",
      linkLabel: "Materi & Audio Mandarin"
    },
    {
      title: "Biro Bimbingan Konseling & Karir Studi",
      icon: Award,
      role: "Pemetaan Minat Bakat & Lolos PTN/Kedinasan",
      desc: "Mendampingi santri dalam penjurusan minat bakat, konsultasi psikologis, pendampingan SNBP/SNBT, dan persiapan portofolio kampus impian dalam maupun luar negeri.",
      link: "/prestasi",
      linkLabel: "Lihat Jejak Prestasi"
    },
    {
      title: "Komite Sekolah & Hubungan Masyarakat",
      icon: BookCheck,
      role: "Kemitraan Wali Santri & Stakeholder",
      desc: "Wadah kolaborasi sinergis antara wali santri, tokoh masyarakat, dan instansi kedinasan untuk mendukung sarana prasarana serta beasiswa santri berprestasi.",
      link: "/osis",
      linkLabel: "Kemitraan & OSIS"
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
            <School className="w-3.5 h-3.5" />
            <span>Struktur Lembaga Formal</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {pageData?.title || 'Lembaga Sekolah Terpadu'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            {pageData?.subtitle || 'Satuan pelaksana pendidikan formal di lingkungan PPJM yang mengintegrasikan kurikulum nasional terakreditasi dengan riset STEM dan kemahiran bahasa global.'}
          </p>
        </div>
      </div>

      {pageData?.content && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-m3-1 border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <p className="whitespace-pre-line">{pageData.content}</p>
        </div>
      )}

      {/* Grid Unit Lembaga Sekolah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4">
        {unitSekolahList.map((unit) => {
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
                    Unit Formal
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

