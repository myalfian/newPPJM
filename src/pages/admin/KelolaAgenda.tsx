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
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { compressImageToWebP, CompressionResult } from '../../lib/imageCompressor';
import { generateWhatsAppBroadcastUrl } from '../../lib/waFormatter';
import { invalidateCache } from '../../lib/queryCache';

interface RundownRow {
  time: string;
  activity: string;
}

interface AgendaAdminItem {
  id: string;
  title: string;
  timeline_status: 'historical' | 'current' | 'future';
  date_display: string;
  time_display: string;
  month: string;
  year: string;
  category: string;
  location: string;
  target_audience: string;
  description: string;
  coordinator: string;
  badge?: string;
  rundown?: RundownRow[];
  image?: string;
}

const INITIAL_AGENDAS: AgendaAdminItem[] = [
  {
    id: 'cur-1',
    title: "Karantina Ziyadah Murojaah Hafalan Al-Qur'an Juz 1 - 30",
    timeline_status: 'current',
    date_display: '24 - 30 Oktober 2026',
    time_display: '04:30 - 21:00 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Tahfidz',
    location: 'Masjid Utama Pondok Pesantren Jauharul Maknuun',
    target_audience: 'Seluruh Santri Program Takhassus Tahfidz',
    coordinator: 'Ustadz Muhammad Syukron, M.Pd.',
    badge: 'Sedang Berlangsung',
    description: 'Program penguatan mutqin hafalan dengan pembagian halaqoh intensif 5 juz per hari.',
    rundown: [
      { time: '04:30 - 06:00', activity: 'Ziyadah setor hafalan baru ba\'da Shubuh' },
      { time: '08:30 - 11:00', activity: 'Murojaah mandiri audio lab santri' }
    ],
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur-2',
    title: 'Praktikum STEM: Otomasi Penyiram Hidroponik Mikrokontroler ESP32',
    timeline_status: 'current',
    date_display: '28 Oktober 2026',
    time_display: '08:00 - 11:30 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Sains & STEM',
    location: 'Laboratorium Robotika & Rekayasa Sains PPJM',
    target_audience: 'Santri Wustho (Kelas VIII & IX)',
    coordinator: 'Ir. Ahmad Zulkarnain & Tim Lab STEM PPJM',
    badge: 'Pekan Ini',
    description: 'Sesi perakitan sensor capacitive soil moisture dan integrasi modul relay 4-channel.',
    rundown: [
      { time: '08:00 - 08:45', activity: 'Pemaparan teori sirkuit elektronika' },
      { time: '08:45 - 11:30', activity: 'Perakitan hardware & kalibrasi sensor' }
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  }
];

const CATEGORIES = [
  'Tahfidz',
  'Salafiyah & Turats',
  'Sains & STEM',
  'Bahasa Asing',
  'Ujian & PSB',
  'Sosial & Dakwah'
];

export const KelolaAgenda: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [agendas, setAgendas] = useState<AgendaAdminItem[]>(INITIAL_AGENDAS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'current' | 'future' | 'historical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [timelineStatus, setTimelineStatus] = useState<'historical' | 'current' | 'future'>('current');
  const [dateDisplay, setDateDisplay] = useState('');
  const [timeDisplay, setTimeDisplay] = useState('');
  const [month, setMonth] = useState('Oktober');
  const [year, setYear] = useState('2026');
  const [category, setCategory] = useState('Tahfidz');
  const [location, setLocation] = useState('Pondok Pesantren Jauharul Maknuun');
  const [targetAudience, setTargetAudience] = useState('Seluruh Santri');
  const [coordinator, setCoordinator] = useState('Pengurus PPJM');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [rundown, setRundown] = useState<RundownRow[]>([
    { time: '08:00 - 09:00', activity: 'Pembukaan & Tilawah' }
  ]);

  // Image compressor state
  const [compressing, setCompressing] = useState(false);
  const [compResult, setCompResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  // Load from Supabase on mount
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
            time_display: row.time_display || '',
            month: row.month || 'Oktober',
            year: row.year || '2026',
            category: row.category || 'Tahfidz',
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

  useEffect(() => {
    loadAgendas();
  }, []);

  const resetForm = () => {
    setTitle('');
    setTimelineStatus('current');
    setDateDisplay('');
    setTimeDisplay('');
    setMonth('Oktober');
    setYear('2026');
    setCategory('Tahfidz');
    setLocation('Pondok Pesantren Jauharul Maknuun');
    setTargetAudience('Seluruh Santri');
    setCoordinator('Pengurus PPJM');
    setBadge('');
    setDescription('');
    setImage('');
    setRundown([{ time: '08:00 - 09:00', activity: 'Pembukaan & Tilawah' }]);
    setCompResult(null);
    setEditingId(null);
  };

  const handleStartEdit = (item: AgendaAdminItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setTimelineStatus(item.timeline_status);
    setDateDisplay(item.date_display);
    setTimeDisplay(item.time_display);
    setMonth(item.month);
    setYear(item.year);
    setCategory(item.category);
    setLocation(item.location);
    setTargetAudience(item.target_audience);
    setCoordinator(item.coordinator);
    setBadge(item.badge || '');
    setDescription(item.description);
    setImage(item.image || '');
    setRundown(item.rundown && item.rundown.length > 0 ? item.rundown : [{ time: '08:00 - 09:00', activity: 'Pembukaan' }]);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus agenda kegiatan santri ini?')) return;
    setAgendas((prev) => prev.filter((a) => a.id !== id));
    invalidateCache('agendas_live_list');

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
    setRundown(
      rundown.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
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
    resetForm();
    setActiveTab('list');
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <CalendarDays className="w-3.5 h-3.5 text-emerald-800" />
          <span>Agenda Santri & Kalender Kegiatan</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
          Kelola Agenda & Jadwal Kegiatan PPJM
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Atur agenda yang sedang berlangsung, agenda mendatang, dan arsip kegiatan dengan rundown terstruktur yang terintegrasi langsung ke halaman <code>/agenda</code>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{savedAlert}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('list'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'list'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daftar Agenda ({agendas.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('editor'); resetForm(); }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'editor'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingId ? 'Edit Agenda' : 'Tambah Agenda Baru'}</span>
        </button>
      </div>

      {activeTab === 'list' ? (
        /* List View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari agenda atau lokasi..."
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
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all'
                    ? 'Semua'
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
            {filteredAgendas.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-m3-1 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  {item.image && (
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-900/90 text-gold-300 text-[11px] font-bold">
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
                    <Calendar className="w-3.5 h-3.5" />
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

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.rundown?.length || 0} agenda rundown
                  </span>
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
            ))}
          </div>
        </div>
      ) : (
        /* Form Inputs */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-base text-emerald-950">
              {editingId ? 'Edit Agenda Kegiatan' : 'Formulir Agenda Baru'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Agenda: *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Karantina Ziyadah Murojaah Hafalan Al-Qur'an Juz 1 - 30"
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
                <option value="current">Bulan Ini / Sedang Berlangsung</option>
                <option value="future">Mendatang (Future)</option>
                <option value="historical">Selesai Terlaksana (Arsip)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kategori Kegiatan: *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Badge Label (Opsional):</label>
              <input
                type="text"
                placeholder="Contoh: Sedang Berlangsung / Pekan Ini"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Tampilan Tanggal: *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 24 - 30 Oktober 2026"
                value={dateDisplay}
                onChange={(e) => setDateDisplay(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Tampilan Waktu: *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 08:00 - 15:30 WIB"
                value={timeDisplay}
                onChange={(e) => setTimeDisplay(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Lokasi Kegiatan: *</label>
              <input
                type="text"
                required
                placeholder="Masjid Utama PP Jauharul Maknuun"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Koordinator Penanggung Jawab: *</label>
              <input
                type="text"
                required
                placeholder="Ustadz Pembina / Dewan Asatidz"
                value={coordinator}
                onChange={(e) => setCoordinator(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Deskripsi & Narasi Acara: *</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan detail tujuan agenda, rangkaian acara, dan arahan santri..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200"
            />
          </div>

          {/* Foto Sampul */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Foto Sampul Kegiatan:</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40 hover:bg-emerald-50 transition-colors cursor-pointer space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
              <Upload className="w-6 h-6 text-emerald-800 mx-auto" />
              <p className="text-xs font-bold text-emerald-950">
                {compressing ? 'Mengompres foto ke WebP...' : 'Pilih Foto Dari Perangkat (Otomatis WebP)'}
              </p>
            </div>

            {compResult && (
              <div className="p-3 bg-emerald-100 rounded-xl text-xs text-emerald-950 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Foto dioptimalkan ke WebP ({compResult.compressedSizeKB} KB, Hemat {compResult.savedPercent}%)</span>
              </div>
            )}
          </div>

          {/* Rundown Rows */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Rundown Jadwal Kegiatan:</label>
              <button
                type="button"
                onClick={addRundownRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
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
                    placeholder="Contoh: 08:00 - 09:30"
                    value={row.time}
                    onChange={(e) => updateRundownRow(idx, 'time', e.target.value)}
                    className="w-1/3 px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Nama kegiatan / sesi"
                    value={row.activity}
                    onChange={(e) => updateRundownRow(idx, 'activity', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                  {rundown.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRundownRow(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Agenda'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
