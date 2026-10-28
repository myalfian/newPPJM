import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  CalendarPlus,
  Share2,
  Check,
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';
import { UpcomingEventItem } from './types';

const UPCOMING_EVENTS: UpcomingEventItem[] = [
  {
    id: 'up-1',
    title: 'Karantina Ziyadah Murojaah Al-Qur\'an Juz 1 - 30',
    targetDate: '2026-10-30T04:30:00',
    dateDisplay: '24 - 30 Oktober 2026',
    time: '04.30 - 21.00 WIB',
    category: 'Pondok',
    location: 'Masjid Jami’ Raudhatul Ulum PPJM',
    coordinator: 'Ust. Muhammad Syukron, M.Pd.',
    badgeType: 'sapphire',
    description:
      'Program akselerasi hafalan mutqin santri takhassus dengan pendampingan talaqqi 5 juz per hari oleh para huffazh bersanad.',
    rundown: [
      { time: '04.30 - 06.00', activity: 'Ziyadah setor hafalan baru ba’da Shubuh' },
      { time: '08.30 - 11.00', activity: 'Murojaah mandiri di serambi masjid' },
      { time: '13.30 - 15.00', activity: 'Tasmi’ hafalan antar pasangan santri' },
      { time: '19.30 - 21.00', activity: 'Simaan akbar di hadapan Asatidz Pengasuh' }
    ]
  },
  {
    id: 'up-2',
    title: 'Haul Akbar Masyaikh PPJM & Temu Silaturahmi Alumni',
    targetDate: '2026-11-05T19:30:00',
    dateDisplay: 'Kamis Malam, 05 November 2026',
    time: '19.30 - 23.00 WIB',
    category: 'Event Akbar',
    location: 'Aula Ma’had Ali & Masjid Utama PPJM',
    coordinator: 'Dewan Pengasuh & Pengurus Alumni',
    badgeType: 'gold',
    description:
      'Peringatan wafatnya para pendiri dan muassis pesantren, pembacaan tahlil akbar, istighotsah kubro, dan penguatan jejaring alumni nasional.',
    rundown: [
      { time: '19.30 - 20.15', activity: 'Pembacaan Surat Yasin & Tahlil Fida’' },
      { time: '20.15 - 21.30', activity: 'Mauidzah Hasanah Ulama Khos Jawa Timur' },
      { time: '21.30 - 23.00', activity: 'Musyawarah & Temu Kangen Alumni' }
    ]
  },
  {
    id: 'up-3',
    title: 'Penilaian Akhir Semester (PAS) Ganjil TP 2026/2027',
    targetDate: '2026-11-23T07:30:00',
    dateDisplay: '23 - 30 November 2026',
    time: '07.30 - 12.30 WIB',
    category: 'Sekolah',
    location: 'Gedung Sekolah SMP Plus Jauharul Maknuun',
    coordinator: 'Waka Kurikulum & Panitia PAS',
    badgeType: 'emerald',
    description:
      'Ujian sumatif semester ganjil berbasis Computer Based Test (CBT) menguji kompetensi akademik umum, literasi, numerasi, dan sains STEM.'
  },
  {
    id: 'up-4',
    title: 'Imtihan Sorogan Akbar Madrasah Diniyah Salafiyah',
    targetDate: '2026-12-02T15:30:00',
    dateDisplay: '02 - 08 Desember 2026',
    time: '15.30 - 17.30 WIB',
    category: 'Pondok',
    location: 'Zawiyah Madrasah Diniyah PPJM',
    coordinator: 'Dewan Masyayikh & Asatidz Madin',
    badgeType: 'sapphire',
    description:
      'Ujian lisan sorogan kitab kuning gundul (Matan Jurumiyah, Imrithi, Alfiyah, dan Fathul Qorib) sebagai syarat kenaikan marhalah santri.'
  }
];

export const UpcomingEventsSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Time remaining calculator helper
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateCountdown = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const diff = target - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const handleShare = async (event: UpcomingEventItem) => {
    const shareUrl = `${window.location.origin}/agenda?tab=upcoming#${event.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `${event.title} (${event.dateDisplay}) di PP Jauharul Maknuun`,
          url: shareUrl
        });
      } catch {
        navigator.clipboard.writeText(shareUrl);
        setCopiedId(event.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleSaveToGoogleCalendar = (event: UpcomingEventItem) => {
    const startDateClean = event.targetDate.replace(/[-:]/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startDateClean}/${startDateClean}&details=${encodeURIComponent(
      event.description + ' - PP Jauharul Maknuun'
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Hitung Mundur Kegiatan Terdekat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Agenda Terdekat PPJM
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Agenda penting dalam kurun waktu mendatang lengkap dengan countdown timer dan integrasi kalender digital.
        </p>
      </div>

      {/* Grid 1 Col Mobile, 2 Cols Tablet & Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {UPCOMING_EVENTS.map((item) => {
          const { days, hours, minutes, seconds, isPast } = calculateCountdown(item.targetDate);

          const badgeClasses =
            item.badgeType === 'sapphire'
              ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60'
              : item.badgeType === 'emerald'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300/60 dark:border-amber-700/60';

          return (
            <article
              key={item.id}
              id={item.id}
              className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header Badge & Category */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-xs ${badgeClasses}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    {item.dateDisplay}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Countdown Timer Display */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    {isPast ? 'Kegiatan Sedang/Telah Berlangsung' : 'Menuju Waktu Kegiatan:'}
                  </span>

                  {!isPast ? (
                    <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 block">
                          {days}
                        </span>
                        <span className="text-[9px] uppercase text-zinc-400 block">Hari</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-white block">
                          {hours}
                        </span>
                        <span className="text-[9px] uppercase text-zinc-400 block">Jam</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-white block">
                          {minutes}
                        </span>
                        <span className="text-[9px] uppercase text-zinc-400 block">Menit</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 block">
                          {seconds}
                        </span>
                        <span className="text-[9px] uppercase text-zinc-400 block">Detik</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      ✓ Kegiatan Aktif di Lingkungan Pesantren
                    </div>
                  )}
                </div>

                {/* Metadata: Waktu & Lokasi */}
                <div className="space-y-1.5 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Koord: {item.coordinator}</span>
                  </div>
                </div>

                {/* Rundown Preview if available */}
                {item.rundown && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
                      Rundown Acara Inti:
                    </span>
                    <div className="space-y-1">
                      {item.rundown.slice(0, 3).map((r, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-[11px] text-zinc-600 dark:text-zinc-400"
                        >
                          <span className="font-mono text-emerald-700 dark:text-emerald-400 shrink-0">
                            {r.time}
                          </span>
                          <span>• {r.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Simpan ke Kalender & Bagikan */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveToGoogleCalendar(item)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200/60 dark:border-emerald-800/60 transition-all cursor-pointer active:scale-[0.98] min-h-[44px]"
                  title="Tambahkan pengingat ke Google Calendar"
                >
                  <CalendarPlus className="w-4 h-4 text-emerald-600" />
                  <span>Simpan ke Kalender</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(item)}
                  className="py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] min-h-[44px]"
                  title="Bagikan Agenda ke WhatsApp atau medsos"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Bagikan</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

