import React from 'react';
import { BookOpen, Clock, Moon, Sun, Heart, CheckCircle2 } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const AmaliyahPondok: React.FC = () => {
  const dailySchedules = [
    {
      time: '03.30 - 04.30 WIB',
      activity: 'Qiyamul Lail & Mujahadah Asmaul Husna',
      desc: 'Bangun sepertiga malam, shalat tahajjud, shalat hajat, dan pembacaan wirid asmaul husna berjamaah di masjid jami’ pesantren.',
      icon: Moon
    },
    {
      time: '04.30 - 06.00 WIB',
      activity: 'Shalat Shubuh Berjamaah & Wiridul Lathif',
      desc: 'Shalat shubuh berjamaah dilanjutkan pembacaan dzikir pagi Wiridul Lathif karya Al-Imam Abdullah bin Alawi Al-Haddad dan setoran ziyadah hafalan Al-Qur’an.',
      icon: Sun
    },
    {
      time: '07.00 - 13.00 WIB',
      activity: 'Pembelajaran Formal & Riset Lab STEM',
      desc: 'Kegiatan belajar mengajar sekolah formal terpadu serta praktikum terstruktur di laboratorium komputer, robotika, dan bahasa.',
      icon: Clock
    },
    {
      time: '15.30 - 17.00 WIB',
      activity: 'Madrasah Diniyah Sore & Sorogan Kitab',
      desc: 'Kajian kitab turats dengan metode bandongan dan sorogan: Matan Jurumiyah, Tijan Darori, dan Safinatun Najah.',
      icon: BookOpen
    },
    {
      time: '18.00 - 19.30 WIB',
      activity: 'Shalat Maghrib Berjamaah & Ratib Al-Haddad',
      desc: 'Pembacaan Ratibul Haddad rutin setiap malam, disusul shalat isya dan halaqah takhasus tahfidzul qur’an santri.',
      icon: Heart
    },
    {
      time: '20.00 - 21.30 WIB',
      activity: 'Kajian Kitab Fathul Qorib & Mudzakarah Malam',
      desc: 'Pendalaman fiqih madzhab Syafi’i dan musyawarah bahsul masail antar kamar santri sebelum istirahat malam.',
      icon: BookOpen
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Sub Menu Navigation Tabs */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Tarbiyah Ruhaniyah Santri</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Amaliyah & Wirid Rutin Santri PPJM
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl">
            Rangkaian wirid, ratib, qiyamul lail, dan kedisiplinan ibadah harian santri Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </div>

      {/* Jadwal Harian Rutin */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-m3-1 border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
              Jadwal Amaliyah 24 Jam Santri
            </h2>
            <p className="text-xs text-slate-500">
              Membiasakan hidup teratur, suci lahir batin, dan istiqamah dalam ketaatan.
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Rutin Setiap Hari
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailySchedules.map((sched) => {
            const Icon = sched.icon;
            return (
              <div
                key={sched.activity}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    {sched.time}
                  </span>
                  <Icon className="w-4 h-4 text-gold-600" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                  {sched.activity}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sched.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Amaliyah Khusus Malam Jumat */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-m3-1 border border-emerald-200 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-800" />
          <h3 className="text-lg font-bold text-emerald-950">
            Amaliyah Khusus Malam Jum’at
          </h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Setiap malam Jum’at, seluruh santri berkumpul di masjid utama untuk pembacaan Maulid Simtudduror, Burdah, tahlil akbar untuk para muassis pesantren dan masyayikh Lasem Sidayu, serta mau’izhah hasanah oleh Pengasuh KH. M. Jauharul Maknuun.
        </p>
      </div>
    </div>
  );
};
