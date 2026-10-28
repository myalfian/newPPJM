import React from 'react';
import { Building2, Sparkles, Droplets, BookOpen, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { useCachedQuery } from '../../lib/queryCache';
import { fetchJmPage } from '../../lib/profileQueries';

export const FasilitasPondok: React.FC = () => {
  const { data: pageData } = useCachedQuery(
    'jm-center-fasilitas-pondok',
    () => fetchJmPage('fasilitas-pondok')
  );

  const fasilitasPondokList = [
    {
      title: "Masjid Jami' Jauharul Maknuun",
      desc: "Sentral spiritual pesantren berdaya tampung ribuan jamaah, difasilitasi karpet tebal, sound system akustik jernih, dan area serambi untuk mudzakarah.",
      icon: Building2,
      specs: ["Kapasitas 1.500 Jamaah", "Kubah Megah Berarsitektur Islam", "Mihrab Marmer", "Sound System Digital"],
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Kompleks Asrama Santri Putra & Putri",
      desc: "Gedung asrama berlantai yang terpisah tegas antara komplek santri putra dan putri, dilengkapi dipan kayu kokoh, kasur empuk, loker personal, dan ventilasi sejuk.",
      icon: Sparkles,
      specs: ["Dipan & Kasur Standar", "Ventilasi Silang Alami", "Pengawasan 24 Jam", "Area Belajar Bersama"],
      img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Dapur Umum & Ruang Makan Higienis",
      desc: "Pengolahan bahan pangan bersanitasi terjamin dengan juru masak berpengalaman. Menyajikan konsumsi bergizi seimbang 3 kali sehari bagi seluruh santri mukim.",
      icon: Droplets,
      specs: ["Menu 3x Sehari", "Standar Higienitas Ketat", "Air Minum Reverse Osmosis", "Tempat Duduk Makan Teratur"],
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Perpustakaan Kitab Turats & Bahtsul Masail",
      desc: "Koleksi ribuan manuskrip dan cetakan kitab kuning klasik beraneka cabang fan: Fiqih madzhab Syafi'i, Ushul Fiqih, Nahwu Shorof, Hadits, hingga Balaghah.",
      icon: BookOpen,
      specs: ["2.000+ Judul Kitab Turats", "Maktabah Syamilah Komputer", "Meja Sorogan Khusus", "Ruang Diskusi Ilmiah"],
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Sanitasi Bersih & MCK Modern",
      desc: "Ratusan unit bilik kamar mandi terawat bersih dengan pasokan air sumur artesis jernih berlimpah khas pesisir Gresik yang telah difiltrasi modern.",
      icon: ShieldCheck,
      specs: ["Bilik MCK Terpisah", "Air Bersih Artesis", "Pembersihan Terjadwal", "Pengelolaan Limbah Terpadu"],
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Pos Kesehatan Pesantren (Poskestren)",
      desc: "Klinik pertolongan pertama yang bermitra dengan Puskesmas Sidayu dan RSUD Ibnu Sina Gresik, siap siaga memberikan pelayanan kesehatan bagi santri sakit.",
      icon: HeartPulse,
      specs: ["Obat-obatan Lengkap", "Tenaga Medis Siaga", "Ruang Observasi Santri", "Rujukan Cepat Rumah Sakit"],
      img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
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
            <Building2 className="w-3.5 h-3.5" />
            <span>Fasilitas Pesantren</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {pageData?.title || 'Fasilitas Pondok Pesantren'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            {pageData?.subtitle || 'Sarana dan prasarana terpadu untuk menunjang kekhusyukan ibadah, ketenangan istirahat, serta kelancaran tholabul ilmi para santri mukim di Lasem Sidayu.'}
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
        {fasilitasPondokList.map((item) => {
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

