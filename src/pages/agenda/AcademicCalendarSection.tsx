import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Filter,
  CheckCircle2,
  Info,
  CalendarCheck
} from 'lucide-react';
import { AgendaEventItem, AgendaCategory } from './types';

export const CALENDAR_EVENTS: AgendaEventItem[] = [
  {
    id: 'ev-1',
    title: 'Penilaian Tengah Semester (PTS) Ganjil SMP Plus JM',
    startDate: '2026-10-12',
    endDate: '2026-10-19',
    time: '07.30 - 12.30 WIB',
    category: 'Sekolah',
    location: 'Ruang Kelas Multimedia SMP Plus JM',
    description: 'Evaluasi capaian kurikulum nasional mata pelajaran umum, sains STEM, dan bahasa asing secara terstruktur.',
    coordinator: 'Waka Kurikulum SMP Plus JM',
    isHighlight: true
  },
  {
    id: 'ev-2',
    title: 'Peringatan Hari Santri Nasional & Apel Akbar Santri',
    startDate: '2026-10-22',
    endDate: '2026-10-22',
    time: '07.00 - 11.00 WIB',
    category: 'Event Akbar',
    location: 'Halaman Utama Pondok Pesantren Jauharul Maknuun',
    description: 'Apel bendera khidmat bersarung putih, istighotsah kebangsaan, dan defile seni pencak silat Pagar Nusa santri.',
    coordinator: 'Pengurus OSIS & BPH Santri',
    isHighlight: true
  },
  {
    id: 'ev-3',
    title: 'Karantina Ziyadah Murojaah Hafalan Al-Qur\'an Juz 1 - 30',
    startDate: '2026-10-24',
    endDate: '2026-10-30',
    time: '04.30 - 21.00 WIB',
    category: 'Pondok',
    location: 'Masjid Jami’ Raudhatul Ulum PPJM',
    description: 'Program akselerasi hafalan mutqin santri takhassus dengan setoran talaqqi 5 juz per hari didampingi musyrif bersanad.',
    coordinator: 'Koordinator Tahfidz PPJM',
    isHighlight: true
  },
  {
    id: 'ev-4',
    title: 'Praktikum STEM: Otomasi Penyiram Hidroponik ESP32',
    startDate: '2026-10-28',
    endDate: '2026-10-28',
    time: '08.00 - 11.30 WIB',
    category: 'Sekolah',
    location: 'Laboratorium Komputer & STEM',
    description: 'Perakitan modul sensor kapasitif dan pemrograman mikrokontroler oleh tim riset santri kelas IX.',
    coordinator: 'Guru Pembina STEM',
    isHighlight: false
  },
  {
    id: 'ev-5',
    title: 'Haul Akbar Masyaikh PPJM & Temu Alumni Nasional',
    startDate: '2026-11-05',
    endDate: '2026-11-05',
    time: '19.30 - 23.00 WIB',
    category: 'Event Akbar',
    location: 'Aula Ma’had Ali & Masjid Utama',
    description: 'Tahlil akbar, mauidzah hasanah masyaikh sepuh Jawa Timur, dan temu silaturahmi alumni lintas angkatan.',
    coordinator: 'Pengurus Yayasan & Alumni PPJM',
    isHighlight: true
  },
  {
    id: 'ev-6',
    title: 'Penilaian Akhir Semester (PAS) Ganjil TP 2026/2027',
    startDate: '2026-11-23',
    endDate: '2026-11-30',
    time: '07.30 - 12.30 WIB',
    category: 'Sekolah',
    location: 'Gedung Sekolah SMP Plus JM',
    description: 'Ujian semester berbasis Computer Based Test (CBT) di laboratorium komputer mandiri.',
    coordinator: 'Panitia PAS SMP Plus JM',
    isHighlight: false
  },
  {
    id: 'ev-7',
    title: 'Imtihan Nihai & Sorogan Akbar Madrasah Diniyah',
    startDate: '2026-12-02',
    endDate: '2026-12-08',
    time: '15.30 - 17.30 WIB',
    category: 'Diniyah',
    location: 'Zawiyah Madrasah Diniyah Salafiyah',
    description: 'Ujian lisan sorogan kitab kuning (Jurumiyah, Imrithi, Alfiyah, Fathul Qorib) di hadapan majelis asatidz.',
    coordinator: 'Dewan Asatidz Madin',
    isHighlight: true
  },
  {
    id: 'ev-8',
    title: 'Wisuda Tahfidz Qur’an & Penyerahan Rapor Semester',
    startDate: '2026-12-15',
    endDate: '2026-12-15',
    time: '08.00 - 13.00 WIB',
    category: 'Event Akbar',
    location: 'Gedung Serbaguna PPJM',
    description: 'Pentas penghargaan santri berprestasi, wisuda hafizh-hafizhah 30 juz, serta penyerahan buku laporan hasil belajar wali santri.',
    coordinator: 'Pimpinan Pesantren & Kepala Sekolah',
    isHighlight: true
  },
  {
    id: 'ev-9',
    title: 'Libur Semester Ganjil Santri & Kepulangan Asrama',
    startDate: '2026-12-18',
    endDate: '2027-01-02',
    time: 'Sesuai Jadwal Bus Rombongan',
    category: 'Libur',
    location: 'Kawasan Asrama Pondok',
    description: 'Masa libur semester ganjil santri berkumpul bersama keluarga setelah menyelesaikan seluruh evaluasi.',
    coordinator: 'Keamanan & Ketertiban Pondok',
    isHighlight: false
  }
];

export const AcademicCalendarSection: React.FC = () => {
  // Current view year & month (Default October 2026 to match data)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleCurrentMonthShortcut = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate('2026-10-24');
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter((ev) => {
      if (categoryFilter === 'all') return true;
      return ev.category === categoryFilter;
    });
  }, [categoryFilter]);

  // Calendar Day Calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Padding for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateString: '' });
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayFormatted = d < 10 ? `0${d}` : `${d}`;
      const monthFormatted = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
      const dateString = `${currentYear}-${monthFormatted}-${dayFormatted}`;

      // Check events on this date
      const eventsOnDate = filteredEvents.filter((ev) => {
        return dateString >= ev.startDate && dateString <= ev.endDate;
      });

      days.push({
        dayNumber: d,
        dateString,
        events: eventsOnDate
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredEvents]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      return selectedDate >= ev.startDate && selectedDate <= ev.endDate;
    });
  }, [selectedDate, filteredEvents]);

  const getCategoryDotColor = (category: AgendaCategory) => {
    switch (category) {
      case 'Pondok':
        return 'bg-blue-500';
      case 'Sekolah':
        return 'bg-emerald-500';
      case 'Diniyah':
        return 'bg-amber-500';
      case 'Libur':
        return 'bg-rose-500';
      case 'Event Akbar':
        return 'bg-amber-400';
      default:
        return 'bg-zinc-400';
    }
  };

  const getCategoryBadgeClass = (category: AgendaCategory) => {
    switch (category) {
      case 'Pondok':
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60';
      case 'Sekolah':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
      case 'Diniyah':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60';
      case 'Libur':
        return 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60';
      case 'Event Akbar':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300/60 dark:border-amber-700/60';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* Category Filter Pills & Month Navigator Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl sm:rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60">
        {/* Month Navigator with Prev/Next and shortcut */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs sm:text-sm font-bold text-zinc-900 dark:text-white whitespace-nowrap min-w-[140px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Bulan Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleCurrentMonthShortcut}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60 transition-colors cursor-pointer whitespace-nowrap"
          >
            Bulan Ini
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'Pondok', label: 'Pondok' },
            { id: 'Sekolah', label: 'Sekolah' },
            { id: 'Diniyah', label: 'Diniyah' },
            { id: 'Event Akbar', label: 'Event Akbar' },
            { id: 'Libur', label: 'Libur' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                categoryFilter === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TABLET & DESKTOP: MONTHLY GRID CALENDAR WITH COLOR DOTS */}
      {/* ========================================================= */}
      <div className="hidden sm:block bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 shadow-xs space-y-4">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <span className="text-rose-500">Ahad</span>
          <span>Senin</span>
          <span>Selasa</span>
          <span>Rabu</span>
          <span>Kamis</span>
          <span>Jumat</span>
          <span>Sabtu</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((item, idx) => {
            if (!item.dayNumber) {
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-[78px] p-2 rounded-xl bg-zinc-50/40 dark:bg-zinc-900/30 opacity-40"
                />
              );
            }

            const isSelected = selectedDate === item.dateString;
            const hasEvents = item.events && item.events.length > 0;

            return (
              <div
                key={item.dateString}
                onClick={() => setSelectedDate(item.dateString)}
                className={`min-h-[82px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                    : hasEvents
                    ? 'bg-white dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700/80 hover:border-emerald-300'
                    : 'bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.dayNumber}
                  </span>
                  {hasEvents && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      {item.events.length} evt
                    </span>
                  )}
                </div>

                {/* Event Dots & Mini Labels */}
                <div className="space-y-1 mt-1">
                  {item.events?.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-1.5 text-[10px] truncate rounded-sm px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${getCategoryDotColor(
                          ev.category
                        )}`}
                      />
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}
                  {item.events && item.events.length > 2 && (
                    <span className="text-[9px] text-zinc-400 block text-right font-medium">
                      +{item.events.length - 2} lainnya
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Date Summary Banner on Desktop */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Agenda Tanggal: {selectedDate}</span>
            </h4>
            <span className="text-xs text-zinc-400">
              {selectedDateEvents.length} agenda ditemukan
            </span>
          </div>

          {selectedDateEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedDateEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        ev.category
                      )}`}
                    >
                      {ev.category}
                    </span>
                    <span className="text-xs text-zinc-400">{ev.time}</span>
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {ev.title}
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {ev.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">
              Tidak ada agenda terjadwal pada tanggal ini. Klik tanggal dengan penanda titik di atas untuk melihat detail.
            </p>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE: THUMB-FRIENDLY AGENDA VIEW / LIST HARIAN BERTINGKAT */}
      {/* ========================================================= */}
      <div className="sm:hidden space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Daftar Agenda {monthNames[currentMonth]} {currentYear}
          </h3>
          <span className="text-xs text-zinc-400">
            {filteredEvents.length} Kegiatan
          </span>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <article
              key={ev.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                    ev.category
                  )}`}
                >
                  {ev.category}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 font-mono">
                  {ev.startDate}
                </span>
              </div>

              <h4 className="font-bold text-sm text-zinc-900 dark:text-white leading-snug">
                {ev.title}
              </h4>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {ev.description}
              </p>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{ev.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

