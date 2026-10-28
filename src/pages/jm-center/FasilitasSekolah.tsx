import React from 'react';
import { School, Cpu, BookOpen, Laptop, Trophy, Users, CheckCircle2 } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { useCachedQuery } from '../../lib/queryCache';
import { fetchJmPage } from '../../lib/profileQueries';

export const FasilitasSekolah: React.FC = () => {
  const { data: pageData } = useCachedQuery(
    'jm-center-fasilitas-sekolah',
    () => fetchJmPage('fasilitas-sekolah')
  );

  const fasilitasSekolahList = [
    {
      title: "Ruang Kelas Multimedia Ber-AC",
      desc: "Ruang belajar modern berfasilitas proyektor interaktif, audio classroom, kursi ergonomis, dan pendingin ruangan untuk kenyamanan pembelajaran santri.",
      icon: School,
      specs: ["Interactive Projector", "Full AC & Sirkulasi", "Papan Tulis Kaca", "Kapasitas 28 Santri/Kelas"],
      img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Laboratorium Riset & Robotika STEM",
      desc: "Fasilitas riset sains dan rekayasa teknologi santri, dilengkapi microcontroller Arduino, modul IoT, workstation komputer, dan 3D printer untuk eksperimen aplikatif.",
      icon: Cpu,
      specs: ["Kit Robotika & Sensor", "PC Workstation Riset", "Modul IoT Smart School", "Ruang Perakitan Inovasi"],
      img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Laboratorium Komputer & Jaringan",
      desc: "Pusat literasi digital santri dengan puluhan unit PC high-spec terhubung internet serat optik dedicated untuk ujian berbasis komputer (CBT) dan kelas coding.",
      icon: Laptop,
      specs: ["40+ Unit PC Modern", "Koneksi Fiber Optic Dedicated", "Server Ujian Mandiri CBT", "LAN Gigabit Terisolasi"],
      img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Perpustakaan Sekolah & E-Library",
      desc: "Menyediakan ribuan judul buku teks pelajaran formal, ensiklopedia sains, novel sastra Islami, serta terminal akses jurnal akademik online terakreditasi.",
      icon: BookOpen,
      specs: ["5.000+ Judul Buku", "Katalog E-Library Terpadu", "Area Membaca Nyaman", "Akses Komputer Penelusuran"],
      img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Lapangan Olahraga & Arena Atletik",
      desc: "Sarana pembinaan kebugaran jasmani santri yang mencakup lapangan futsal outdoor, lapangan voli, basket, dan area bela diri pencak silat.",
      icon: Trophy,
      specs: ["Lapangan Futsal Cor Halus", "Lapangan Voli & Bulutangkis", "Arena Bela Diri Santri", "Pencahayaan Malam LED"],
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Aula Serbaguna & Gedung Pertemuan",
      desc: "Gedung pertemuan representatif dengan panggung akustik untuk penyelenggaraan wisuda, olimpiade sains, seminar pendidikan, dan pameran karya santri.",
      icon: Users,
      specs: ["Kapasitas 600 Orang", "Panggung Teatrikal & Mimbar", "Sistem Tata Suara Canggih", "Full Lighting Panggung"],
      img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
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
            <span>Fasilitas Pendidikan Formal</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {pageData?.title || 'Fasilitas Sekolah Terpadu'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            {pageData?.subtitle || 'Infrastruktur pembelajaran formal modern berstandar nasional yang dirancang menumbuhkan kecakapan literasi digital, sains, dan daya pikir kritis santri.'}
          </p>
        </div>
      </div>

      {pageData?.content && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-m3-1 border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <p className="whitespace-pre-line">{pageData.content}</p>
        </div>
      )}

      {/* Fasilitas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4">
        {fasilitasSekolahList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative bg-slate-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-emerald-900/85 backdrop-blur-md text-white flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-emerald-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 mt-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {item.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

