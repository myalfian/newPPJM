import React from 'react';
import { Compass, Milestone, Calendar, MapPin, Flag } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const Sejarah: React.FC = () => {
  const milestones = [
    {
      year: '1998',
      title: 'Perintisan Majelis Pengajian Al-Qur’an di Desa Lasem',
      desc: 'Bermula dari halaqah pengajian sederhana di kediaman perintis di Desa Lasem Sidayu, mengajarkan bacaan Al-Qur’an bertajwid dan akhlakul karimah kepada anak-anak desa.',
      tag: 'Awal Mula'
    },
    {
      year: '2004',
      title: 'Peletakan Batu Pertama Asrama Santri & Pendirian Madrasah Salaf',
      desc: 'Merespon kepercayaan masyarakat sekitar Sidayu dan pesisir utara Gresik, dibangun asrama mukim pertama dan perintisan kurikulum Madrasah Diniyah Salafiyah berjenjang.',
      tag: 'Pengembangan'
    },
    {
      year: '2012',
      title: 'Peresmian Markaz Tahfidzul Qur’an 30 Juz Bersanad',
      desc: 'Membuka program khusus tahfidz al-qur’an 30 juz mukim dengan sanad muttashil, didampingi pembina huffadz berpengalaman dari berbagai zawiyah tahfidz terkemuka.',
      tag: 'Pilar Tahfidz'
    },
    {
      year: '2019',
      title: 'Integrasi Kurikulum Formal & Pendirian Lab STEM Santri',
      desc: 'Pondok Pesantren Jauharul Maknuun meluncurkan terobosan modern: laboratorium robotika, sains terapan, dan otomasi IoT santri yang dipadukan dengan kurikulum sekolah resmi.',
      tag: 'Inovasi Modern'
    },
    {
      year: '2023 - Sekarang',
      title: 'Pusat Bahasa Asing (Arab & Mandarin) & Portal Digital PPJM',
      desc: 'Menjalin kolaborasi kebahasaan internasional dan meresmikan portal web platform ultra-modern Cloudflare & Supabase untuk pelayanan informasi wali santri dan publik.',
      tag: 'Era Keemasan'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Milestone className="w-3.5 h-3.5" />
            <span>Napak Tilas Perjuangan</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Sejarah Berdirinya PP Jauharul Maknuun
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Perjalanan dakwah Islam Ahlussunnah wal Jama’ah di bumi Lasem, Kecamatan Sidayu, Kabupaten Gresik.
          </p>
        </div>
      </div>

      {/* Narrative Intro Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-m3-1 border border-slate-200 space-y-3 text-slate-800 leading-relaxed sm:leading-loose text-base sm:text-lg font-medium">
        <h2 className="text-lg sm:text-xl font-black text-emerald-950">
          Kilas Balik: Dari Langgar Sederhana Menuju Sentra Keilmuan
        </h2>
        <p>
          Kecamatan Sidayu di pesisir utara Kabupaten Gresik dikenal sebagai salah satu wilayah yang sarat akan warisan sejarah keislaman dan perjuangan para ulama. Di sinilah, tepatnya di Desa Lasem, benih dakwah <strong className="text-emerald-950 font-black">Pondok Pesantren Jauharul Maknuun</strong> disemaikan dengan penuh keikhlasan.
        </p>
        <p>
          Filosofi nama <em className="text-emerald-950 font-bold">“Jauharul Maknuun”</em> diambil dari permata ilmu balaghah, dengan harapan bahwa setiap santri yang menimba ilmu di tempat ini akan ditempa menjadi permata yang tersimpan indah, memancarkan kearifan, adab budi pekerti, dan kemaslahatan nyata bagi umat manusia.
        </p>
      </div>

      {/* Interactive Milestone Timeline (Android M3 Style) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-m3-1 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base sm:text-lg font-black text-emerald-950">
            Garis Waktu Milestone Perjalanan PPJM
          </h3>
        </div>

        <div className="relative border-l-2 border-emerald-200 ml-3 sm:ml-5 space-y-3 pb-2">
          {milestones.map((item, index) => (
            <div key={item.year} className="relative pl-5 sm:pl-7 group">
              {/* Timeline Pin */}
              <div className="absolute -left-[15px] top-1.5 w-7 h-7 rounded-full bg-emerald-100 border-2 border-white text-emerald-900 flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-gold-500 group-hover:text-emerald-950 transition-colors">
                {index + 1}
              </div>

              {/* Timeline Content Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm sm:text-base font-black text-emerald-900">
                    {item.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
