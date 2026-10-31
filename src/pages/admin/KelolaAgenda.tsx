import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Trash2,
  Edit3,
  Search,
  PlusCircle,
  Upload,
  Share2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  Bell,
  Check,
  AlertCircle,
  BookmarkCheck,
  Repeat
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { invalidateCache } from '../../lib/queryCache';

// Kategori warna agenda PPJM
export type AgendaCategoryType = 'Pondok' | 'Sekolah' | 'Diniyah' | 'Event Akbar' | 'Libur' | 'Tahfidz' | 'Sains & STEM';

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Pondok: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-600', border: 'border-emerald-300' },
  Sekolah: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-600', border: 'border-sky-300' },
  Diniyah: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', border: 'border-amber-300' },
  'Event Akbar': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-600', border: 'border-purple-300' },
  Libur: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-600', border: 'border-rose-300' },
  Tahfidz: { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-600', border: 'border-teal-300' },
  'Sains & STEM': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-600', border: 'border-indigo-300' }
};

interface RundownRow {
  time: string;
  activity: string;
}

interface AgendaAdminItem {
  id: string;
  title: string;
  timeline_status: 'historical' | 'current' | 'future';
  date_display: string;
  iso_date?: string; // YYYY-MM-DD for calendar & countdown
  time_display: string;
  month: string;
  year: string;
  category: AgendaCategoryType | string;
  location: string;
  target_audience: string;
  coordinator: string;
  badge?: string;
  rundown?: RundownRow[];
  image?: string;
  description: string;
}

interface RoutineItem {
  id: string;
  title: string;
  period: 'Harian' | 'Mingguan' | 'Bulanan';
  time_display: string;
  day_or_freq: string;
  target: string;
  active: boolean;
}

const INITIAL_AGENDAS: AgendaAdminItem[] = [
  {
    id: 'cur-1',
    title: "Karantina Ziyadah Murojaah Hafalan Al-Qur'an Juz 1 - 30",
    timeline_status: 'current',
    date_display: '28 Oktober 2026',
    iso_date: '2026-10-28',
    time_display: '04:30 - 21:00 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Tahfidz',
    location: 'Masjid Utama Pondok Pesantren Jauharul Maknuun',
    target_audience: 'Seluruh Santri Program Takhassus Tahfidz',
    coordinator: 'Ustadz Muhammad Syukron, M.Pd.',
    badge: 'Sedang Berlangsung',
    description: 'Program penguatan mutqin hafalan dengan pembagian halaqoh intensif 5 juz per hari bersama Mudir.',
    rundown: [
      { time: '04:30 - 06:00', activity: 'Ziyadah setor hafalan baru ba\'da Shubuh' },
      { time: '08:30 - 11:00', activity: 'Murojaah mandiri audio lab santri' },
      { time: '19:30 - 21:00', activity: 'Simakan akbar & tashih fashohah' }
    ],
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur-2',
    title: 'Praktikum STEM: Otomasi Penyiram Hidroponik Mikrokontroler ESP32',
    timeline_status: 'current',
    date_display: '31 Oktober 2026',
    iso_date: '2026-10-31',
    time_display: '08:00 - 11:30 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Sains & STEM',
    location: 'Laboratorium Robotika & Rekayasa Sains PPJM',
    target_audience: 'Santri Wustho (Kelas VIII & IX)',
    coordinator: 'Ir. Ahmad Zulkarnain & Tim Lab STEM PPJM',
    badge: 'Pekan Ini',
    description: 'Sesi perakitan sensor capacitive soil moisture dan integrasi modul relay 4-channel bertenaga solar.',
    rundown: [
      { time: '08:00 - 08:45', activity: 'Pemaparan teori sirkuit elektronika' },
      { time: '08:45 - 11:30', activity: 'Perakitan hardware & kalibrasi sensor hidroponik' }
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fut-1',
    title: 'Musabaqah Qira\'atil Kutub (MQK) Antar Halaqoh se-Jawa Timur',
    timeline_status: 'future',
    date_display: '15 November 2026',
    iso_date: '2026-11-15',
    time_display: '08:00 - 16:30 WIB',
    month: 'November',
    year: '2026',
    category: 'Diniyah',
    location: 'Auditorium Utama & Aula KH. M. Jauharul Maknuun',
    target_audience: 'Santri Diniyah Tingkat Ula, Wustho, Ulya',
    coordinator: 'Ustadz Ahmad Rifai, S.Ag.',
    badge: 'Event Akbar',
    description: 'Ajang seleksi dan pembuktian kecakapan bahtsul masail serta qiraatul kutub turats Al-Imrithi & Fathul Qorib.',
    rundown: [
      { time: '08:00 - 09:00', activity: 'Opening Ceremony & Sambutan Mudir' },
      { time: '09:00 - 15:30', activity: 'Babak Penyisihan dan Final MQK' },
      { time: '15:30 - 16:30', activity: 'Pengumuman Juara & Penyerahan Trofi' }
    ],
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fut-2',
    title: 'Pekan Olahraga & Seni Santri (POSS) Semester Ganjil 2026',
    timeline_status: 'future',
    date_display: '25 November 2026',
    iso_date: '2026-11-25',
    time_display: '07:30 - 17:00 WIB',
    month: 'November',
    year: '2026',
    category: 'Sekolah',
    location: 'Gelanggang Olahraga & Lapangan Hijau PPJM',
    target_audience: 'Seluruh Santri & Sivitas Akademika SMP Plus',
    coordinator: 'Pengurus OSIS & Departemen Olahraga',
    badge: 'Mendatang',
    description: 'Pekan olahraga santri: futsal sarung, panahan berkuda sunnah, kaligrafi, dan orasi dwibahasa Arab-Mandarin.',
    rundown: [
      { time: '07:30 - 08:30', activity: 'Apel Pembukaan POSS' },
      { time: '08:30 - 17:00', activity: 'Pertandingan Cabang Olahraga & Seni' }
    ],
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fut-3',
    title: 'Libur Maulid Nabi & Silaturahmi Kepulangan Terpimpin',
    timeline_status: 'future',
    date_display: '10 Desember 2026',
    iso_date: '2026-12-10',
    time_display: '07:00 - 12:00 WIB',
    month: 'Desember',
    year: '2026',
    category: 'Libur',
    location: 'Gerbang Utama & Pos Keberangkatan PPJM',
    target_audience: 'Santri & Wali Santri',
    coordinator: 'Biro Keamanan & Kepesantrenan',
    badge: 'Kalender Libur',
    description: 'Penjemputan santri terjadwal per rombongan kabupaten/kota dengan kartu izin mudik resmi.',
    rundown: [
      { time: '07:00 - 08:00', activity: 'Pemeriksaan kelengkapan hafalan & barang' },
      { time: '08:00 - 12:00', activity: 'Pemberangkatan armada bus rombongan wali santri' }
    ],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_ROUTINES: RoutineItem[] = [
  {
    id: 'rout-1',
    title: 'Pembacaan Ratibul Haddad & Doa Bersama',
    period: 'Mingguan',
    time_display: 'Ba\'da Maghrib (18:15 - 19:15 WIB)',
    day_or_freq: 'Setiap Malam Jumat',
    target: 'Seluruh Santri Asrama PPJM',
    active: true
  },
  {
    id: 'rout-2',
    title: 'Ro\'an Akbar & Bersih Lingkungan Pesantren',
    period: 'Mingguan',
    time_display: 'Pagi Hari (06:00 - 07:30 WIB)',
    day_or_freq: 'Setiap Hari Ahad',
    target: 'Seluruh Santri & Asatidz',
    active: true
  },
  {
    id: 'rout-3',
    title: 'Mudzakarah Kitab & Bahtsul Masail Halaqoh',
    period: 'Mingguan',
    time_display: 'Malam Hari (20:00 - 21:30 WIB)',
    day_or_freq: 'Setiap Malam Selasa',
    target: 'Santri Wustho & Ulya',
    active: true
  },
  {
    id: 'rout-4',
    title: 'Karantina Setoran Hafalan 1 Hari 1 Halaman',
    period: 'Harian',
    time_display: 'Ba\'da Shubuh (05:00 - 06:15 WIB)',
    day_or_freq: 'Senin s.d. Sabtu',
    target: 'Santri Program Takhassus',
    active: true
  },
  {
    id: 'rout-5',
    title: 'Khataman Al-Qur\'an Bil Ghoib & Tasyakuran Mudir',
    period: 'Bulanan',
    time_display: 'Jumat Legi (07:00 - 11:00 WIB)',
    day_or_freq: 'Setiap Jumat Legi',
    target: 'Masyayikh & Seluruh Santri',
    active: true
  }
];

const CATEGORIES = [
  'Pondok',
  'Sekolah',
  'Diniyah',
  'Event Akbar',
  'Libur',
  'Tahfidz',
  'Sains & STEM'
];

export const KelolaAgenda: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'agendas' | 'routines'>('calendar');
  const [agendas, setAgendas] = useState<AgendaAdminItem[]>(INITIAL_AGENDAS);
  const [routines, setRoutines] = useState<RoutineItem[]>(INITIAL_ROUTINES);
  const [statusFilter, setStatusFilter] = useState<'all' | 'current' | 'future' | 'historical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calendar month state
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // Oktober 2026
  const [selectedDayEvents, setSelectedDayEvents] = useState<AgendaAdminItem[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  // Countdown timer for next future event
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Modal editor state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [timelineStatus, setTimelineStatus] = useState<'historical' | 'current' | 'future'>('future');
  const [dateDisplay, setDateDisplay] = useState('');
  const [isoDate, setIsoDate] = useState('2026-11-15');
  const [timeDisplay, setTimeDisplay] = useState('08:00 - 15:00 WIB');
  const [month, setMonth] = useState('November');
  const [year, setYear] = useState('2026');
  const [category, setCategory] = useState<AgendaCategoryType>('Event Akbar');
  const [location, setLocation] = useState('Pondok Pesantren Jauharul Maknuun');
  const [targetAudience, setTargetAudience] = useState('Seluruh Santri');
  const [coordinator, setCoordinator] = useState('Pengurus PPJM');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [rundown, setRundown] = useState<RundownRow[]>([
    { time: '08:00 - 09:00', activity: 'Pembukaan & Tilawah Al-Qur\'an' }
  ]);

  // Routine Form Modal
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');
  const [routinePeriod, setRoutinePeriod] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Mingguan');
  const [routineTime, setRoutineTime] = useState('');
  const [routineDayFreq, setRoutineDayFreq] = useState('');
  const [routineTarget, setRoutineTarget] = useState('Seluruh Santri PPJM');

  // Image compressor state
  const [compressing, setCompressing] = useState(false);
  const [compResult, setCompResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  // Target event for countdown: find first future event with iso_date
  const nextTargetEvent = agendas.find((a) => a.timeline_status === 'future' && a.iso_date) || agendas[2];

  useEffect(() => {
    if (!nextTargetEvent?.iso_date) return;
    const target = new Date(`${nextTargetEvent.iso_date}T08:00:00`).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextTargetEvent]);

  // Load from Supabase on mount
  useEffect(() => {
    const loadAgendas = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('agendas')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setAgendas(
            data.map((row) => ({
              id: row.id,
              title: row.title,
              timeline_status: (row.timeline_status as 'current' | 'future' | 'historical') || 'current',
              date_display: row.date_display || '',
              iso_date: (row as any).iso_date || '2026-11-01',
              time_display: row.time_display || '',
              month: row.month || 'Oktober',
              year: row.year || '2026',
              category: row.category || 'Pondok',
              location: row.location || 'Pondok Pesantren Jauharul Maknuun',
              target_audience: row.target_audience || 'Seluruh Santri',
              coordinator: row.coordinator || 'Pengurus PPJM',
              badge: row.badge || undefined,
              description: row.description || '',
              rundown: Array.isArray(row.rundown) ? (row.rundown as unknown as RundownRow[]) : [],
              image: row.image || undefined
            }))
          );
        }
      } catch (err) {
        console.warn('Fallback to local agendas:', err);
      }
    };
    loadAgendas();
  }, []);

  const resetForm = () => {
    setTitle('');
    setTimelineStatus('future');
    setDateDisplay('');
    setIsoDate('2026-11-15');
    setTimeDisplay('08:00 - 15:00 WIB');
    setMonth('November');
    setYear('2026');
    setCategory('Event Akbar');
    setLocation('Pondok Pesantren Jauharul Maknuun');
    setTargetAudience('Seluruh Santri');
    setCoordinator('Pengurus PPJM');
    setBadge('');
    setDescription('');
    setImage('');
    setRundown([{ time: '08:00 - 09:00', activity: 'Pembukaan & Tilawah Al-Qur\'an' }]);
    setCompResult(null);
    setEditingId(null);
  };

  const handleStartEdit = (item: AgendaAdminItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setTimelineStatus(item.timeline_status);
    setDateDisplay(item.date_display);
    setIsoDate(item.iso_date || '2026-11-01');
    setTimeDisplay(item.time_display);
    setMonth(item.month);
    setYear(item.year);
    setCategory(item.category as AgendaCategoryType);
    setLocation(item.location);
    setTargetAudience(item.target_audience);
    setCoordinator(item.coordinator);
    setBadge(item.badge || '');
    setDescription(item.description);
    setImage(item.image || '');
    setRundown(item.rundown && item.rundown.length > 0 ? item.rundown : [{ time: '08:00 - 09:00', activity: 'Pembukaan' }]);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus agenda kegiatan santri ini?')) return;
    setAgendas((prev) => prev.filter((a) => a.id !== id));
    invalidateCache('agendas_live_list');
    invalidateCache('admin_dashboard_feed');

    if (isSupabaseConfigured() && !id.startsWith('cur-') && !id.startsWith('his-') && !id.startsWith('fut-')) {
      try {
        await supabase.from('agendas').delete().eq('id', id);
        setSavedAlert('Agenda berhasil dihapus.');
        setTimeout(() => setSavedAlert(null), 3000);
      } catch (err) {
        console.warn('Failed to delete agenda on Supabase:', err);
      }
    }
  };

  const handleFileChange = async (file: File) => {
    setCompressing(true);
    try {
      const res = await compressImageToWebP(file);
      setCompResult(res);
      setImage(res.dataUrl);
    } catch (e: any) {
      alert('Gagal mengompres foto: ' + e.message);
    } finally {
      setCompressing(false);
    }
  };

  const addRundownRow = () => {
    setRundown([...rundown, { time: '', activity: '' }]);
  };

  const removeRundownRow = (idx: number) => {
    setRundown(rundown.filter((_, i) => i !== idx));
  };

  const updateRundownRow = (idx: number, field: 'time' | 'activity', value: string) => {
    setRundown(rundown.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dateDisplay) {
      alert('Mohon isi judul, tanggal, dan deskripsi agenda.');
      return;
    }

    const finalImage =
      compResult?.dataUrl ||
      image ||
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

    const payload = {
      title,
      timeline_status: timelineStatus,
      date_display: dateDisplay,
      iso_date: isoDate,
      time_display: timeDisplay || 'Sesuai Jadwal',
      month,
      year,
      category,
      location,
      target_audience: targetAudience,
      coordinator,
      badge: badge || undefined,
      description,
      rundown,
      image: finalImage
    };

    if (editingId) {
      setAgendas((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...payload, id: editingId } : a))
      );

      if (isSupabaseConfigured() && !editingId.startsWith('cur-') && !editingId.startsWith('his-') && !editingId.startsWith('fut-')) {
        try {
          await supabase
            .from('agendas')
            .update({ ...payload, updated_at: new Date().toISOString() } as any)
            .eq('id', editingId);
        } catch (err) {
          console.warn('Failed to update agenda on Supabase:', err);
        }
      }
      setSavedAlert('Perubahan agenda berhasil disimpan!');
    } else {
      let createdId = `agenda-${Date.now()}`;

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('agendas')
            .insert(payload as any)
            .select()
            .single();

          if (!error && data?.id) {
            createdId = data.id;
          }
        } catch (err) {
          console.warn('Failed to insert agenda to Supabase:', err);
        }
      }

      setAgendas([{ id: createdId, ...payload }, ...agendas]);
      setSavedAlert('Agenda baru berhasil ditambahkan dan disinkronkan!');
    }

    invalidateCache('agendas_live_list');
    invalidateCache('admin_dashboard_feed');
    resetForm();
    setIsFormOpen(false);
    setTimeout(() => setSavedAlert(null), 3000);
  };

  // Google Calendar URL generator
  const createGoogleCalendarUrl = (item: AgendaAdminItem) => {
    const titleEncoded = encodeURIComponent(`PPJM: ${item.title}`);
    const detailsEncoded = encodeURIComponent(`${item.description}\n\nKoordinator: ${item.coordinator}\nTarget: ${item.target_audience}`);
    const locationEncoded = encodeURIComponent(item.location);
    
    // Default fallback dates
    const dateClean = item.iso_date ? item.iso_date.replace(/-/g, '') : '20261115';
    const datesParam = `${dateClean}T010000Z/${dateClean}T090000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&dates=${datesParam}&details=${detailsEncoded}&location=${locationEncoded}`;
  };

  // Calendar calculations
  const yearCur = calendarDate.getFullYear();
  const monthCur = calendarDate.getMonth();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const daysInMonth = new Date(yearCur, monthCur + 1, 0).getDate();
  const firstDayIndex = new Date(yearCur, monthCur, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCalendarDate(new Date(yearCur, monthCur - 1, 1));
    setSelectedDayEvents([]);
    setSelectedDayNumber(null);
  };

  const nextMonth = () => {
    setCalendarDate(new Date(yearCur, monthCur + 1, 1));
    setSelectedDayEvents([]);
    setSelectedDayNumber(null);
  };

  // Check events for a specific day
  const getEventsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = monthCur + 1 < 10 ? `0${monthCur + 1}` : `${monthCur + 1}`;
    const targetIso = `${yearCur}-${formattedMonth}-${formattedDay}`;

    return agendas.filter((item) => {
      if (item.iso_date === targetIso) return true;
      if (item.date_display.includes(`${day} `) && item.month.toLowerCase() === monthNames[monthCur].toLowerCase()) return true;
      return false;
    });
  };

  // Rutinitas Toggle
  const toggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    setSavedAlert('Status rutinitas santri diperbarui!');
    setTimeout(() => setSavedAlert(null), 2500);
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle || !routineTime || !routineDayFreq) return;
    const newR: RoutineItem = {
      id: `rout-${Date.now()}`,
      title: routineTitle,
      period: routinePeriod,
      time_display: routineTime,
      day_or_freq: routineDayFreq,
      target: routineTarget,
      active: true
    };
    setRoutines([...routines, newR]);
    setRoutineTitle('');
    setRoutineTime('');
    setRoutineDayFreq('');
    setIsRoutineModalOpen(false);
    setSavedAlert('Rutinitas baru berhasil ditambahkan!');
    setTimeout(() => setSavedAlert(null), 3000);
  };

  const filteredAgendas = agendas.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.timeline_status === statusFilter;
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-gold-300 text-xs font-bold uppercase tracking-wider">
              <CalendarDays className="w-3.5 h-3.5 text-gold-400" />
              <span>Pusat Kalender Akademik & Agenda PPJM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kalender Interaktif, Countdown &amp; Rutinitas
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Kelola kalender akademik santri dengan grid interaktif berkategori warna, hitung mundur (countdown) acara akbar dengan tautan langsung ke Google Calendar, serta pantau jadwal rutinitas amaliyah pesantren.
            </p>
          </div>

          <button
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-emerald-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Agenda Baru</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{savedAlert}</span>
        </div>
      )}

      {/* Countdown Card (Highlight Agenda Terdekat) */}
      {nextTargetEvent && (
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-emerald-700/50 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-[11px] font-black tracking-wider uppercase border border-gold-400/30">
                <Bell className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span>Hitung Mundur Acara Terdekat (H-J-M-D)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {nextTargetEvent.title}
              </h2>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  {nextTargetEvent.date_display}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  {nextTargetEvent.time_display}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  {nextTargetEvent.location}
                </span>
              </div>
            </div>

            {/* Timer Grid */}
            <div className="flex items-center gap-2 sm:gap-3 bg-black/30 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-16 sm:h-20 bg-emerald-950/80 rounded-xl border border-emerald-500/30">
                <span className="text-xl sm:text-2xl font-black text-gold-400">{timeLeft.days}</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Hari</span>
              </div>
              <span className="text-gold-400 font-black text-lg">:</span>
              <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-16 sm:h-20 bg-emerald-950/80 rounded-xl border border-emerald-500/30">
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.hours}</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Jam</span>
              </div>
              <span className="text-gold-400 font-black text-lg">:</span>
              <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-16 sm:h-20 bg-emerald-950/80 rounded-xl border border-emerald-500/30">
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.minutes}</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Menit</span>
              </div>
              <span className="text-gold-400 font-black text-lg">:</span>
              <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-16 sm:h-20 bg-emerald-950/80 rounded-xl border border-emerald-500/30">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">{timeLeft.seconds}</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Detik</span>
              </div>
            </div>

            {/* Action Save to Google Calendar */}
            <a
              href={createGoogleCalendarUrl(nextTargetEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 hover:scale-[1.02]"
              title="Simpan pengingat ke Google Calendar"
            >
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Simpan ke Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Kalender Bulanan Grid</span>
        </button>
        <button
          onClick={() => setActiveTab('agendas')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'agendas'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daftar Agenda ({agendas.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('routines')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'routines'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Rutinitas Santri ({routines.length})</span>
        </button>
      </div>

      {/* TAB 1: KALENDER AKADEMIK BULANAN GRID INTERAKTIF */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header Kalender & Bulan Nav */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                  <span>{monthNames[monthCur]} {yearCur}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Akademik &amp; Pesantren
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik pada tanggal bertitik warna untuk melihat detail agenda atau kegiatan halaqoh santri.
                </p>
              </div>

              {/* Bulan Nav Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date(2026, 9, 1))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Oktober 2026
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Bulan Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Kategori Legenda Titik Warna */}
            <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-bold text-slate-700 mr-1">Legenda Kategori:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="font-medium text-slate-600">Pondok</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-600" />
                <span className="font-medium text-slate-600">Sekolah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-600">Diniyah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="font-medium text-slate-600">Event Akbar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span className="font-medium text-slate-600">Libur</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600" />
                <span className="font-medium text-slate-600">Tahfidz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="font-medium text-slate-600">Sains &amp; STEM</span>
              </div>
            </div>

            {/* Grid Kalender */}
            <div className="grid grid-cols-7 gap-2">
              {['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((d, i) => (
                <div
                  key={d}
                  className={`text-center py-2 text-xs font-black uppercase tracking-wider ${
                    i === 0 ? 'text-rose-600' : i === 5 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {d}
                </div>
              ))}

              {/* Offset hari pertama */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] rounded-2xl bg-slate-50/40 border border-transparent" />
              ))}

              {/* Hari 1 - N */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const events = getEventsForDay(day);
                const isSelected = selectedDayNumber === day;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => {
                      setSelectedDayNumber(day);
                      setSelectedDayEvents(events);
                    }}
                    className={`min-h-[70px] sm:min-h-[90px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/30'
                        : events.length > 0
                        ? 'border-slate-300 bg-white hover:border-emerald-400 hover:shadow-xs'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-black ${
                        events.length > 0 ? 'text-emerald-950 font-black' : 'text-slate-600'
                      }`}>
                        {day}
                      </span>
                      {events.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          {events.length}
                        </span>
                      )}
                    </div>

                    {/* Titik-titik warna event */}
                    {events.length > 0 ? (
                      <div className="space-y-1 mt-1">
                        <div className="flex flex-wrap gap-1">
                          {events.map((ev) => {
                            const col = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS['Pondok'];
                            return (
                              <div
                                key={ev.id}
                                className={`w-2.5 h-2.5 rounded-full ${col.dot}`}
                                title={`${ev.category}: ${ev.title}`}
                              />
                            );
                          })}
                        </div>
                        <div className="hidden sm:block text-[10px] font-semibold text-slate-700 truncate">
                          {events[0].title}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300">-</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detail Tanggal yang Dipilih */}
            {selectedDayNumber !== null && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-emerald-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Kegiatan pada Tanggal {selectedDayNumber} {monthNames[monthCur]} {yearCur}:</span>
                  </h4>
                  <button
                    onClick={() => {
                      resetForm();
                      setDateDisplay(`${selectedDayNumber} ${monthNames[monthCur]} ${yearCur}`);
                      const formattedD = selectedDayNumber < 10 ? `0${selectedDayNumber}` : `${selectedDayNumber}`;
                      const formattedM = monthCur + 1 < 10 ? `0${monthCur + 1}` : `${monthCur + 1}`;
                      setIsoDate(`${yearCur}-${formattedM}-${formattedD}`);
                      setMonth(monthNames[monthCur]);
                      setYear(`${yearCur}`);
                      setIsFormOpen(true);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Tambah Agenda di Tanggal Ini</span>
                  </button>
                </div>

                {selectedDayEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedDayEvents.map((ev) => {
                      const col = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS['Pondok'];
                      return (
                        <div
                          key={ev.id}
                          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-2"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${col.bg} ${col.text} border ${col.border}`}>
                                {ev.category}
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold">{ev.time_display}</span>
                            </div>
                            <h5 className="font-bold text-sm text-slate-900">{ev.title}</h5>
                            <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span className="text-slate-500 text-[11px] truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              {ev.location}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStartEdit(ev)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={createGoogleCalendarUrl(ev)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                title="Google Calendar"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Belum ada agenda khusus yang dijadwalkan pada tanggal ini. Klik tombol di atas untuk menjadwalkan.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2: DAFTAR AGENDA LENGKAP & SEARCH FILTER */}
      {activeTab === 'agendas' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari agenda, kategori, lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {(['all', 'current', 'future', 'historical'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    statusFilter === status
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all'
                    ? 'Semua Status'
                    : status === 'current'
                    ? 'Bulan Ini'
                    : status === 'future'
                    ? 'Mendatang'
                    : 'Selesai'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgendas.map((item) => {
              const col = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Pondok'];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {item.image && (
                      <div className="h-40 rounded-xl overflow-hidden bg-slate-100 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${col.bg} ${col.text} border ${col.border} backdrop-blur-md`}>
                          {item.category}
                        </span>
                        <span
                          className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            item.timeline_status === 'current'
                              ? 'bg-emerald-600 text-white'
                              : item.timeline_status === 'future'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-600 text-white'
                          }`}
                        >
                          {item.timeline_status === 'current'
                            ? 'Bulan Ini'
                            : item.timeline_status === 'future'
                            ? 'Mendatang'
                            : 'Selesai'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.date_display}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time_display}</span>
                    </div>

                    <h3 className="font-bold text-sm text-emerald-950 line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={createGoogleCalendarUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                      title="Simpan ke Google Calendar"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Google Cal</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Edit Agenda"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RUTINITAS SANTRI (HARIAN, MINGGUAN, BULANAN) */}
      {activeTab === 'routines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-emerald-700" />
                  <span>Jadwal Amaliyah &amp; Rutinitas Santri PPJM</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Agenda berulang (Harian, Mingguan, Bulanan) seperti Ratibul Haddad, Ro'an akbar, dan Mudzakarah kitab kuning.
                </p>
              </div>

              <button
                onClick={() => setIsRoutineModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Rutinitas</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routines.map((r) => (
                <div
                  key={r.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    r.active
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/50 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        r.period === 'Harian'
                          ? 'bg-sky-100 text-sky-800'
                          : r.period === 'Mingguan'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {r.period}
                      </span>

                      <button
                        onClick={() => toggleRoutine(r.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          r.active
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {r.active ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>

                    <h4 className="font-black text-sm text-slate-900">{r.title}</h4>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{r.time_display}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{r.day_or_freq}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{r.target}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm('Hapus rutinitas santri ini?')) {
                          setRoutines(prev => prev.filter(item => item.id !== r.id));
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                    >
                      Hapus Rutinitas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT AGENDA */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-emerald-950 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-700" />
                <span>{editingId ? 'Edit Agenda Kegiatan' : 'Formulir Agenda Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => { setIsFormOpen(false); resetForm(); }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Agenda: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Musabaqah Qira'atil Kutub (MQK) Santri Se-Jatim"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Timeline: *</label>
                  <select
                    value={timelineStatus}
                    onChange={(e) => setTimelineStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="future">Mendatang (Future)</option>
                    <option value="current">Bulan Ini / Sedang Berlangsung</option>
                    <option value="historical">Selesai Terlaksana (Arsip)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori Titik Warna: *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AgendaCategoryType)}
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Badge Label:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Event Akbar / Pekan Ini"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Teks Display: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 15 November 2026"
                    value={dateDisplay}
                    onChange={(e) => setDateDisplay(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ISO Date (Kalender &amp; Countdown):</label>
                  <input
                    type="date"
                    value={isoDate}
                    onChange={(e) => setIsoDate(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Waktu Pelaksanaan: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08:00 - 15:30 WIB"
                    value={timeDisplay}
                    onChange={(e) => setTimeDisplay(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lokasi Acara: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Auditorium Utama PPJM"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sasaran Peserta:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Santri Wustho & Ulya"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Koordinator / Penanggung Jawab:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ustadz Ahmad Rifai, S.Ag."
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Agenda: *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsikan agenda kegiatan secara lengkap..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Upload Foto / Banner WebP */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Banner Flyer Kegiatan (WebP Auto-Compressor):</span>
                  {compressing && <span className="text-emerald-700 text-[10px]">Mengompres WebP...</span>}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700"
                  />
                  {image && (
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Foto Terpasang
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Rundown */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Rundown Acara:</label>
                  <button
                    type="button"
                    onClick={addRundownRow}
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Tambah Baris Rundown</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {rundown.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="08:00 - 09:00"
                        value={row.time}
                        onChange={(e) => updateRundownRow(idx, 'time', e.target.value)}
                        className="w-32 px-3 py-1.5 text-xs rounded-xl border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Aktivitas rundown..."
                        value={row.activity}
                        onChange={(e) => updateRundownRow(idx, 'activity', e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200"
                      />
                      {rundown.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRundownRow(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); resetForm(); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH RUTINITAS */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-emerald-950 flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-700" />
                <span>Tambah Rutinitas Santri</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRoutineModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoutine} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Rutinitas: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mudzakarah Kitab Nahwu Sharaf"
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Periode Rutinitas: *</label>
                <select
                  value={routinePeriod}
                  onChange={(e) => setRoutinePeriod(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Harian">Harian</option>
                  <option value="Mingguan">Mingguan</option>
                  <option value="Bulanan">Bulanan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Hari / Frekuensi: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Setiap Malam Selasa / Setiap Ahad Pagi"
                  value={routineDayFreq}
                  onChange={(e) => setRoutineDayFreq(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Waktu Pelaksanaan: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ba'da Isya (20:00 - 21:30 WIB)"
                  value={routineTime}
                  onChange={(e) => setRoutineTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sasaran Santri:</label>
                <input
                  type="text"
                  placeholder="Contoh: Santri Wustho & Ulya"
                  value={routineTarget}
                  onChange={(e) => setRoutineTarget(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoutineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Simpan Rutinitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
