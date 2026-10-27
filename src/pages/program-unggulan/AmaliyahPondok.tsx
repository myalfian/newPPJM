import { BookOpen, Clock, Moon, Sun, Heart } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { useCachedQuery } from '../../lib/queryCache';
import { fetchProgram } from '../../lib/profileQueries';

export const AmaliyahPondok: React.FC = () => {
  const { data: progData } = useCachedQuery(
    'program-amaliyah',
    () => fetchProgram('amaliyah-pondok')
  );

  const customDesc = progData?.description;
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
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Sub Menu Navigation Tabs */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Tarbiyah Ruhaniyah Santri</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Amaliyah & Wirid Rutin Santri PPJM
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Rangkaian wirid, ratib, qiyamul lail, dan kedisiplinan ibadah harian santri Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik.
          </p>
        </div>
      </div>

      {customDesc && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-m3-1 border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <p className="whitespace-pre-line">{customDesc}</p>
        </div>
      )}

      {/* Jadwal Harian Rutin */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-m3-1 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-emerald-950">
              Jadwal Amaliyah 24 Jam Santri
            </h2>
            <p className="text-xs text-slate-500">
              Membiasakan hidup teratur, suci lahir batin, dan istiqamah dalam ketaatan.
            </p>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Rutin Setiap Hari
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2">
          {dailySchedules.map((sched) => {
            const Icon = sched.icon;
            return (
              <div
                key={sched.activity}
                className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {sched.time}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-gold-600" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950">
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
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-2.5 sm:p-3.5 shadow-m3-1 border border-emerald-200 space-y-1.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-800" />
          <h3 className="text-sm sm:text-base font-bold text-emerald-950">
            Amaliyah Khusus Malam Jum’at
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Setiap malam Jum’at, seluruh santri berkumpul di masjid utama untuk pembacaan Maulid Simtudduror, Burdah, tahlil akbar untuk para muassis pesantren dan masyayikh Lasem Sidayu, serta mau’izhah hasanah oleh Pengasuh KH. M. Jauharul Maknuun.
        </p>
      </div>
    </div>
  );
};
