import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  CalendarDays,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  Image as ImageIcon,
  UserCheck,
  Shield,
  Layers,
  Clock,
  Save,
  X,
  PlusCircle,
  Eye
} from 'lucide-react';

export interface OsisMember {
  id: string;
  level: 'Presidium' | 'BPH' | 'Sekbid';
  role: string;
  name: string;
  classGrade: string;
  motto: string;
  photoUrl: string;
}

export interface OsisProgram {
  id: string;
  title: string;
  department:
    | 'Keagamaan & Ibadah'
    | 'Bahasa & Keilmuan'
    | 'Kedisiplinan & Keamanan'
    | 'Minat Bakat & Olahraga'
    | 'Kebersihan & Lingkungan';
  description: string;
  timeline: string;
  targetOutcome: string;
}

export interface OsisEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  photoUrl: string;
}

const DEFAULT_MEMBERS: OsisMember[] = [
  {
    id: 'm-1',
    level: 'Presidium',
    role: 'Ketua Umum OSIS / OPJM',
    name: 'Ahmad Faiz Al-Habsyi',
    classGrade: 'Kelas IX-A SMP Plus JM',
    motto: 'Memimpin dengan teladan akhlaqul karimah dan dedikasi tholabul ilmi.',
    photoUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-2',
    level: 'Presidium',
    role: 'Wakil Ketua OSIS',
    name: 'Muhammad Farhan',
    classGrade: 'Kelas VIII-B SMP Plus JM',
    motto: 'Menjadi wadah aspirasi santri kreatif, tangguh, dan berdaya saing.',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-3',
    level: 'BPH',
    role: 'Sekretaris Umum',
    name: 'Hilmi Abdullah',
    classGrade: 'Kelas IX-B SMP Plus JM',
    motto: 'Tertib administrasi warta kegiatan dan dokumentasi terpadu pesantren.',
    photoUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-4',
    level: 'BPH',
    role: 'Bendahara Umum',
    name: 'Fajar Shodiq',
    classGrade: 'Kelas VIII-A SMP Plus JM',
    motto: 'Amanah mengelola dana kas kemandirian santri secara transparan.',
    photoUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-5',
    level: 'Sekbid',
    role: 'Koordinator Sekbid Keagamaan',
    name: 'M. Zaki Al-Faruq',
    classGrade: 'Kelas VIII-C SMP Plus JM',
    motto: 'Menghidupkan syiar sunnah dan sholat jamaah awal waktu.',
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
];

const DEFAULT_PROGRAMS: OsisProgram[] = [
  {
    id: 'prog-1',
    title: 'Festival Muharram & Bulan Bahasa Santri 3 Bahasa',
    department: 'Bahasa & Keilmuan',
    description: 'Lomba pidato 3 bahasa (Arab, Inggris, Mandarin), kaligrafi khath usmani, dan cerdas cermat kitab turats.',
    timeline: 'Bulan Muharram (Awal Semester Gasal)',
    targetOutcome: 'Peningkatan literasi multibahasa santri'
  },
  {
    id: 'prog-2',
    title: 'Gerakan Santri Bersih (Green Pesantren & Roan Akbar)',
    department: 'Kebersihan & Lingkungan',
    description: 'Program kerja bakti roan terpadu, pemilihan kamar asrama terbersih, dan edukasi pilah sampah.',
    timeline: 'Setiap Pekan (Jumat Pagi)',
    targetOutcome: 'Lingkungan asrama sehat dan nyaman tholabul ilmi'
  },
  {
    id: 'prog-3',
    title: 'Karantina Murojaah Ziyadah Tahfidz Akbar',
    department: 'Keagamaan & Ibadah',
    description: 'Halaqah intensif setoran satu juz sekali duduk jelang ujian diniyah pesantren.',
    timeline: 'Tengah Semester',
    targetOutcome: 'Kekokohan hafalan Al-Qur\'an 30 juz'
  },
  {
    id: 'prog-4',
    title: 'Operasi Tertib Disiplin Santri (OPSDIS)',
    department: 'Kedisiplinan & Keamanan',
    description: 'Pengecekan keseragaman pakaian salaf, kepatuhan jam malam, dan adab berjamaah.',
    timeline: 'Harian (24 Jam)',
    targetOutcome: 'Karakter santri berakhlakul karimah'
  },
  {
    id: 'prog-5',
    title: 'Turnamen Liga Santri & Ekspo Inovasi STEM',
    department: 'Minat Bakat & Olahraga',
    description: 'Kompetisi futsal, pencak silat pagar nusa, dan ekspo karya robotika teknologi santri.',
    timeline: 'Akhir Semester (Haflah)',
    targetOutcome: 'Kebugaran fisik dan sportivitas santri'
  }
];

const DEFAULT_EVENTS: OsisEvent[] = [
  {
    id: 'ev-1',
    title: 'Pelantikan Serentak Kabinet OSIS & Musyawarah Kerja Santri 2026/2027',
    date: '20 Oktober 2026',
    description: 'Pengambilan sumpah jabatan di hadapan Mudir KH. M. Jauharul Maknuun disaksikan dewan asatidz dan wali santri.',
    photoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
  }
];

export const KelolaOsis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'struktur' | 'program' | 'event'>('struktur');
  const [members, setMembers] = useState<OsisMember[]>(DEFAULT_MEMBERS);
  const [programs, setPrograms] = useState<OsisProgram[]>(DEFAULT_PROGRAMS);
  const [events, setEvents] = useState<OsisEvent[]>(DEFAULT_EVENTS);
  const [filterLevel, setFilterLevel] = useState<'Semua' | 'Presidium' | 'BPH' | 'Sekbid'>('Semua');
  const [filterDept, setFilterDept] = useState('Semua');
  const [savedAlert, setSavedAlert] = useState(false);

  // Form Member State
  const [mName, setMName] = useState('');
  const [mRole, setMRole] = useState('');
  const [mLevel, setMLevel] = useState<'Presidium' | 'BPH' | 'Sekbid'>('Presidium');
  const [mGrade, setMGrade] = useState('');
  const [mMotto, setMMotto] = useState('');
  const [mPhoto, setMPhoto] = useState('');

  // Form Program State
  const [pTitle, setPTitle] = useState('');
  const [pDept, setPDept] = useState<OsisProgram['department']>('Keagamaan & Ibadah');
  const [pDesc, setPDesc] = useState('');
  const [pTimeline, setPTimeline] = useState('');
  const [pTarget, setPTarget] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mRole) return;
    const newMember: OsisMember = {
      id: `m-${Date.now()}`,
      name: mName,
      role: mRole,
      level: mLevel,
      classGrade: mGrade || 'Kelas IX SMP Plus JM',
      motto: mMotto || 'Mengabdi untuk kemaslahatan santri.',
      photoUrl: mPhoto || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    };
    setMembers([...members, newMember]);
    setMName('');
    setMRole('');
    setMGrade('');
    setMMotto('');
    setMPhoto('');
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle || !pDesc) return;
    const newProg: OsisProgram = {
      id: `prog-${Date.now()}`,
      title: pTitle,
      department: pDept,
      description: pDesc,
      timeline: pTimeline || 'Semester Gasal',
      targetOutcome: pTarget || 'Pemberdayaan Santri'
    };
    setPrograms([...programs, newProg]);
    setPTitle('');
    setPDesc('');
    setPTimeline('');
    setPTarget('');
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const filteredMembers = filterLevel === 'Semua'
    ? members
    : members.filter((m) => m.level === filterLevel);

  const filteredPrograms = filterDept === 'Semua'
    ? programs
    : programs.filter((p) => p.department === filterDept);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40">
            <Users className="w-3.5 h-3.5" />
            <span>Organisasi Santri Intra Ma'had &amp; Sekolah</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Kelola OSIS (Struktur 3 Level &amp; Proker 5 Departemen)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Pusat tata kelola kabinet santri: Struktur hierarki (Presidium, BPH, Sekbid), program kerja 5 departemen utama, serta publikasi warta press release kegiatan organisasi.
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-[#0E7A4C]/15 border border-[#0E7A4C] text-[#0E7A4C] dark:text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#0E7A4C] dark:text-emerald-400" />
          <span>Alhamdulillah, pembaruan kepengurusan OSIS berhasil disimpan!</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('struktur')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'struktur'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Struktur Kabinet (3 Level)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('program')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'program'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Proker (5 Departemen)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('event')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'event'
              ? 'bg-[#0E7A4C] text-[#C8A951] shadow-md border border-[#C8A951]/40'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>3. Warta &amp; Event Press Release</span>
        </button>
      </div>

      {/* TAB 1: STRUKTUR KABINET 3 LEVEL */}
      {activeTab === 'struktur' && (
        <div className="space-y-6">
          <form onSubmit={handleAddMember} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <PlusCircle className="w-4 h-4 text-[#C8A951]" />
              <span>Tambah Pengurus Kabinet Baru</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Level Struktur Hierarki: *</label>
                <select
                  value={mLevel}
                  onChange={(e) => setMLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                >
                  <option value="Presidium">Level 1: Presidium (Ketua / Wakil)</option>
                  <option value="BPH">Level 2: BPH (Sekretaris / Bendahara)</option>
                  <option value="Sekbid">Level 3: Sekbid (Koordinator Divisi)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Jabatan Resmi: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ketua OSIS / Sekretaris 1"
                  value={mRole}
                  onChange={(e) => setMRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Santri: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Faiz Al-Habsyi"
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Kelas / Angkatan:</label>
                <input
                  type="text"
                  placeholder="Kelas IX-A SMP Plus JM"
                  value={mGrade}
                  onChange={(e) => setMGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">URL Pas Foto Santri:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={mPhoto}
                  onChange={(e) => setMPhoto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Motto Dedikasi Santri:</label>
              <input
                type="text"
                placeholder="Kalimat motivasi pengabdian..."
                value={mMotto}
                onChange={(e) => setMMotto(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simpan Pengurus Kabinet</span>
              </button>
            </div>
          </form>

          {/* Filter Level Hierarchy */}
          <div className="flex items-center gap-2">
            {(['Semua', 'Presidium', 'BPH', 'Sekbid'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-[#0E7A4C] text-[#C8A951] shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {lvl === 'Semua' ? 'Semua Tingkatan' : `Level: ${lvl}`}
              </button>
            ))}
          </div>

          {/* Members List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-3.5 justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 shrink-0 border-2 border-[#C8A951]">
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-[#C8A951] block">
                      {member.level}
                    </span>
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">
                      {member.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#0E7A4C] dark:text-emerald-400 truncate">
                      {member.role}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{member.classGrade}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMembers(members.filter((m) => m.id !== member.id))}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROKER 5 DEPARTEMEN */}
      {activeTab === 'program' && (
        <div className="space-y-6">
          <form onSubmit={handleAddProgram} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <PlusCircle className="w-4 h-4 text-[#C8A951]" />
              <span>Input Program Kerja Departemen Baru</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Pilih 5 Departemen Utama: *</label>
                <select
                  value={pDept}
                  onChange={(e) => setPDept(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                >
                  <option value="Keagamaan & Ibadah">1. Departemen Keagamaan &amp; Ibadah</option>
                  <option value="Bahasa & Keilmuan">2. Departemen Bahasa &amp; Keilmuan</option>
                  <option value="Kedisiplinan & Keamanan">3. Departemen Kedisiplinan &amp; Keamanan</option>
                  <option value="Minat Bakat & Olahraga">4. Departemen Minat Bakat &amp; Olahraga</option>
                  <option value="Kebersihan & Lingkungan">5. Departemen Kebersihan &amp; Lingkungan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Program Kerja: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Festival Muharram & Bulan Bahasa"
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Timeline / Jadwal Pelaksanaan:</label>
                <input
                  type="text"
                  placeholder="Setiap Pekan (Jumat Pagi)"
                  value={pTimeline}
                  onChange={(e) => setPTimeline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Target Capaian Output:</label>
                <input
                  type="text"
                  placeholder="Peningkatan literasi & kesehatan santri"
                  value={pTarget}
                  onChange={(e) => setPTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Deskripsi Rencana Kegiatan:</label>
              <textarea
                rows={2}
                required
                placeholder="Rincian teknis pelaksanaan proker santri..."
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 border border-[#C8A951]/40 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simpan Program Kerja</span>
              </button>
            </div>
          </form>

          {/* Proker Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0E7A4C]/15 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30">
                    {prog.department}
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                    {prog.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>⏱️ {prog.timeline}</span>
                  <span className="font-bold text-[#C8A951]">🎯 {prog.targetOutcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WARTA & EVENT PRESS RELEASE OSIS */}
      {activeTab === 'event' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                Press Release &amp; Warta Kegiatan OSIS Santri
              </h3>
              <p className="text-xs text-zinc-400">
                Dokumentasi foto dan siaran pers resmi seluruh dinamika event kesiswaan santri
              </p>
            </div>
            <span className="text-xs font-bold text-[#C8A951] bg-[#0A2116] px-3 py-1 rounded-lg border border-[#C8A951]/40">
              {events.length} Warta Event
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-video bg-zinc-100 overflow-hidden">
                  <img src={ev.photoUrl} alt={ev.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[11px] text-[#C8A951] font-mono font-bold block">{ev.date}</span>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{ev.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
export default KelolaOsis;
