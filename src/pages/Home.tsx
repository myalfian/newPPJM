import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Globe,
  Award,
  ChevronRight,
  Share2,
  Calendar,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { QuickMenu } from '../components/QuickMenu';
import { generateWhatsAppBroadcastUrl } from '../lib/waFormatter';

export const Home: React.FC = () => {
  const newsItems = [
    {
      id: 'news-1',
      title: 'Haflah Khotmil Qur’an 30 Juz & Wisuda Purna Studi PPJM 2025',
      date: '20 Juni 2025',
      category: 'Agenda Akbar',
      excerpt: 'Momen khidmat pelepasan santri purna studi dan wisuda khotmil qur’an 30 juz dihadiri para masyayikh dan ribuan wali santri di halaman utama pesantren.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      link: '/galeri/foto'
    },
    {
      id: 'news-2',
      title: 'Santri PPJM Juara 1 Musabaqah Qira’atil Kutub Tingkat Provinsi',
      date: '12 Maret 2025',
      category: 'Prestasi',
      excerpt: 'Prestasi membanggakan diraih santri PPJM dalam membaca dan memahami kitab kuning Fathul Qorib pada ajang MQK se-Jawa Timur.',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      link: '/prestasi'
    },
    {
      id: 'news-3',
      title: 'Peluncuran Laboratorium Robotika & Otomasi IoT Santri Lasem',
      date: '10 Januari 2025',
      category: 'Inovasi STEM',
      excerpt: 'Pesantren meresmikan pusat riset teknologi aplikatif guna melatih santri menciptakan solusi otomasi hidroponik dan sistem tenaga surya.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      link: '/smart-jm/stem/portofolio'
    }
  ];

  const handleShareWA = (news: typeof newsItems[0]) => {
    const url = generateWhatsAppBroadcastUrl({
      title: news.title,
      category: news.category,
      excerpt: news.excerpt,
      targetUrl: window.location.origin + news.link,
      tanggal: news.date
    });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-2 sm:space-y-3 pb-4">
      
      {/* 1. HERO SLIDER (3D Coverflow Carousel) */}
      <HeroSlider />

      {/* 2. QUICK MENU (Hanya tampil di Mobile & Tablet, tersembunyi di Desktop) */}
      <QuickMenu />

      {/* Divider Spacing Halus untuk Desktop */}
      <div className="hidden lg:block h-1" />


      {/* 2. SAMBUTAN SINGKAT PENGASUH KH. M. JAUHARUL MAKNUUN */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-0.5">
        <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 lg:p-4 shadow-m3-1 border border-slate-200/90 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3.5 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="w-40 h-48 sm:w-52 sm:h-60 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-50 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="Pengasuh PP Jauharul Maknuun"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-emerald-900 text-gold-300 px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md whitespace-nowrap">
                  Pengasuh Pondok Pesantren
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-2.5 text-center lg:text-left">
              <span className="text-xs sm:text-sm font-bold text-gold-700 tracking-wider uppercase bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                Kalam Hikmah & Ma'had Barokah
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-950">
                KH. M. Jauharul Maknuun
              </h2>
              <p className="text-sm sm:text-base font-bold text-emerald-800">
                Mudir & Pengasuh Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
              </p>
              <blockquote className="text-sm sm:text-base lg:text-lg text-slate-800 font-medium italic leading-relaxed sm:leading-loose border-l-0 lg:border-l-4 lg:border-emerald-700 lg:pl-4">
                “Pesantren bukan hanya tempat menuntut ilmu fiqih dan nahwu, melainkan kawah candradimuka pembentukan akhlaqul karimah, ketajaman spiritual, serta ketangguhan menjawab kemajuan zaman. Santri kami bekali dengan kemurnian turats, hafalan al-Qur'an, dan sains teknologi aplikatif agar senantiasa menjadi suluh penerang di tengah umat.”
              </blockquote>
              <div className="pt-2">
                <Link
                  to="/jm-center/sambutan"
                  className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
                >
                  <span>Baca Selengkapnya Sambutan Pengasuh</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 4 PILAR KEUNGGULAN PESANTREN */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 space-y-2 sm:space-y-3">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs sm:text-sm font-bold text-gold-700 uppercase tracking-widest">
            Karakteristik & Keistimewaan
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950">
            Empat Pilar Pendidikan PPJM
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Integrasi harmonis antara pendidikan keagamaan tradisional dan kompetensi sains modern berstandar internasional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* Pilar 1 */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all group flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base sm:text-lg text-emerald-950">Turats & Kitab Salaf</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Kajian kitab kuning berjenjang (Jurumiyah, Imrithi, Alfiyah, Fathul Qorib) bersanad muttashil hingga musonnif.
              </p>
            </div>
            <Link to="/program-unggulan/program-madin" className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950">
              <span>Rincian Jenjang</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pilar 2 */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all group flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-emerald-950 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base sm:text-lg text-emerald-950">Tahfidz 30 Juz & AI</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Bimbingan ziyadah hafalan Al-Qur'an intensif didukung asisten evaluasi suara Murojaah AI mandiri.
              </p>
            </div>
            <Link to="/smart-jm/hafidz/read" className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950">
              <span>Buka Mushaf 30 Juz</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pilar 3 */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all group flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base sm:text-lg text-emerald-950">Laboratorium STEM</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Riset teknologi mikrokontroler, robotika, IoT pertanian hidroponik, dan rekayasa filtrasi air santri.
              </p>
            </div>
            <Link to="/smart-jm/stem/portofolio" className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950">
              <span>Lihat Portofolio</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pilar 4 */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-m3-2 border border-slate-200 hover:border-emerald-300 transition-all group flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-emerald-950 transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base sm:text-lg text-emerald-950">Mandarin & Arab</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Pusat bahasa penutur asli untuk pembekalan dakwah internasional santri ke universitas terkemuka dunia.
              </p>
            </div>
            <Link to="/smart-jm/mandarin/materi" className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950">
              <span>Kelas Mandarin</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WARTA & BERITA TERKINI DENGAN 1-KLIK WHATSAPP WALI SANTRI */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-slate-200 pb-2">
          <div>
            <span className="text-xs sm:text-sm font-bold text-gold-700 uppercase tracking-widest">
              Kabar Pesantren
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950">
              Warta & Agenda Terkini
            </h2>
          </div>
          <Link
            to="/galeri/foto"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950"
          >
            <span>Semua Agenda Galeri</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-m3-2 border border-slate-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-100">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-900/90 backdrop-blur-md text-gold-300 text-xs font-bold shadow">
                    {news.category}
                  </span>
                </div>

                <div className="p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-semibold">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>{news.date}</span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    <Link to={news.link}>{news.title}</Link>
                  </h3>

                  <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed font-normal">
                    {news.excerpt}
                  </p>
                </div>
              </div>

              {/* 1-Click WhatsApp Broadcast Button */}
              <div className="p-3 sm:p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <Link
                  to={news.link}
                  className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                >
                  <span>Baca Rincian</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleShareWA(news)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  title="Bagikan Teks Pengumuman ke WhatsApp Wali Santri"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA PENERIMAAN SANTRI BARU */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-2xl p-4 sm:p-6 lg:p-7 text-white shadow-m3-3 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs sm:text-sm font-bold text-gold-400 uppercase tracking-widest">
              Penerimaan Santri Baru (PSB)
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Mari Bergabung Menjadi Bagian Dari Keluarga Santri PPJM
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
              Membuka pendaftaran santri baru program Tahfidz, Madrasah Diniyah Salafiyah, dan Pendidikan Formal Terpadu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Panitia%20PSB%20PP%20Jauharul%20Maknuun"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full text-sm sm:text-base font-extrabold text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-glow-gold transition-all text-center"
            >
              Hubungi Sekretariat PSB (WhatsApp)
            </a>
            <Link
              to="/jm-center/lembaga"
              className="px-5 py-3 rounded-full text-sm sm:text-base font-extrabold text-white bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600 transition-all text-center"
            >
              Profil Lembaga Pondok
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
