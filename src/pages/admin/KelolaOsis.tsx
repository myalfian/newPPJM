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
  UserCheck
} from 'lucide-react';
import { SimpleFormCard } from '../../components/admin/SimpleFormCard';
import { SmartImageDropzone } from '../../components/admin/SmartImageDropzone';

interface OsisMember {
  id: string;
  role: string;
  name: string;
  classGrade: string;
  motto: string;
  photoUrl: string;
}

interface OsisProgram {
  id: string;
  title: string;
  department: string;
  description: string;
  timeline: string;
}

interface OsisEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  photoUrl: string;
}

const DEFAULT_MEMBERS: OsisMember[] = [
  {
    id: 'ketua',
    role: 'Ketua OSIS',
    name: 'Ahmad Faiz Al-Habsyi',
    classGrade: 'Kelas 9 SMP Plus JM',
    motto: 'Memimpin dengan teladan akhlaqul karimah dan dedikasi tholabul ilmi.',
    photoUrl: '/images/osis/ketua-osis.webp'
  },
  {
    id: 'wakil',
    role: 'Wakil Ketua OSIS',
    name: 'Muhammad Farhan',
    classGrade: 'Kelas 8 SMP Plus JM',
    motto: 'Menjadi wadah aspirasi santri kreatif, tangguh, dan mandiri.',
    photoUrl: '/images/osis/wakil-osis.webp'
  }
];

const DEFAULT_PROGRAMS: OsisProgram[] = [
  {
    id: 'prog-1',
    title: 'Festival Muharram & Bulan Bahasa Santri',
    department: 'Departemen Bahasa & Kebudayaan',
    description: 'Lomba pidato 3 bahasa (Arab, Inggris, Mandarin), kaligrafi, dan cerdas cermat kitab turats.',
    timeline: 'Bulan Muharram (Awal Tahun Ajaran)'
  },
  {
    id: 'prog-2',
    title: 'Gerakan Santri Peduli Lingkungan (Green Pesantren)',
    department: 'Departemen Kebersihan & Kesehatan',
    description: 'Program kerja bakti roan terpadu, pemilihan kamar asrama terbersih, dan edukasi pilah sampah.',
    timeline: 'Setiap Pekan (Jumat Pagi)'
  }
];

export const KelolaOsis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'struktur' | 'program' | 'event'>('struktur');
  const [members, setMembers] = useState<OsisMember[]>(() => {
    try {
      const saved = localStorage.getItem('ppjm_osis_members');
      return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
    } catch {
      return DEFAULT_MEMBERS;
    }
  });

  const [programs, setPrograms] = useState<OsisProgram[]>(() => {
    try {
      const saved = localStorage.getItem('ppjm_osis_programs');
      return saved ? JSON.parse(saved) : DEFAULT_PROGRAMS;
    } catch {
      return DEFAULT_PROGRAMS;
    }
  });

  const [events, setEvents] = useState<OsisEvent[]>(() => {
    try {
      const saved = localStorage.getItem('ppjm_osis_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Form input states
  const [editingMember, setEditingMember] = useState<OsisMember | null>(null);
  const [editingProgram, setEditingProgram] = useState<OsisProgram | null>(null);
  const [newEvent, setNewEvent] = useState<OsisEvent>({
    id: '',
    title: '',
    date: '',
    description: '',
    photoUrl: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveMembers = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ppjm_osis_members', JSON.stringify(members));
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrograms = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ppjm_osis_programs', JSON.stringify(programs));
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Banner Navigation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Portal Organisasi Santri</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Kelola OSIS (SMP Plus Jauharul Maknuun)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Atur hierarki bagan pengurus, agenda program kerja santri, serta warta dokumentasi event.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('struktur')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'struktur'
                ? 'bg-white text-blue-950 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Struktur Pengurus
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('program')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'program'
                ? 'bg-white text-blue-950 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Program Kerja
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'event'
                ? 'bg-white text-blue-950 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Warta &amp; Event
          </button>
        </div>
      </div>

      {/* Tab A: Struktur Pengurus */}
      {activeTab === 'struktur' && (
        <SimpleFormCard
          title="Bagan Struktur & Profil Pengurus OSIS"
          subtitle="Masukkan foto formal berseragam santri/jas almamater, nama lengkap pengurus, serta motto kepemimpinan."
          icon={Users}
          isPublished={true}
          onPublish={handleSaveMembers}
          onSaveDraft={handleSaveMembers}
          isSaving={isSaving}
          draftStorageKey="ppjm_osis_members"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {members.map((member, idx) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#007acc] uppercase tracking-wider">
                    {member.role}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Posisi #{idx + 1}
                  </span>
                </div>

                {/* Smart Image Dropzone untuk foto profil pengurus */}
                <SmartImageDropzone
                  value={member.photoUrl}
                  onChange={(url) => {
                    setMembers((prev) =>
                      prev.map((m) => (m.id === member.id ? { ...m, photoUrl: url } : m))
                    );
                  }}
                  aspectRatioPreset="portrait"
                  label="Foto Formal Pengurus (Rasio 4:5)"
                  helperText="Gunakan foto berjas almamater / seragam resmi"
                />

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Nama Lengkap Santri
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMembers((prev) =>
                          prev.map((m) => (m.id === member.id ? { ...m, name: val } : m))
                        );
                      }}
                      className="w-full min-h-[48px] px-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#007acc]"
                      placeholder="Contoh: Ahmad Faiz Al-Habsyi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Tingkat Kelas
                    </label>
                    <input
                      type="text"
                      value={member.classGrade}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMembers((prev) =>
                          prev.map((m) => (m.id === member.id ? { ...m, classGrade: val } : m))
                        );
                      }}
                      className="w-full min-h-[48px] px-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#007acc]"
                      placeholder="Contoh: Kelas 9 SMP Plus JM"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Motto Kepemimpinan / Visi
                    </label>
                    <textarea
                      rows={2}
                      value={member.motto}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMembers((prev) =>
                          prev.map((m) => (m.id === member.id ? { ...m, motto: val } : m))
                        );
                      }}
                      className="w-full p-3.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#007acc]"
                      placeholder="Motto singkat pengurus..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SimpleFormCard>
      )}

      {/* Tab B: Program Kerja */}
      {activeTab === 'program' && (
        <SimpleFormCard
          title="Program Kerja Kabinet Santri"
          subtitle="Daftar agenda kerja per divisi (Pendidikan, Bahasa, Kedisiplinan, Kebersihan & Olahraga)."
          icon={Sparkles}
          isPublished={true}
          onPublish={handleSavePrograms}
          onSaveDraft={handleSavePrograms}
          isSaving={isSaving}
          draftStorageKey="ppjm_osis_programs"
        >
          <div className="space-y-4">
            {programs.map((prog, idx) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                    {prog.department}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrograms((prev) => prev.filter((p) => p.id !== prog.id))}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Hapus program ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={prog.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrograms((prev) =>
                        prev.map((p) => (p.id === prog.id ? { ...p, title: val } : p))
                      );
                    }}
                    className="w-full min-h-[44px] px-3.5 rounded-xl text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                    placeholder="Nama Program Kerja"
                  />
                  <textarea
                    rows={2}
                    value={prog.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrograms((prev) =>
                        prev.map((p) => (p.id === prog.id ? { ...p, description: val } : p))
                      );
                    }}
                    className="w-full p-3 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                    placeholder="Penjelasan deskripsi tujuan dan manfaat..."
                  />
                  <input
                    type="text"
                    value={prog.timeline}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrograms((prev) =>
                        prev.map((p) => (p.id === prog.id ? { ...p, timeline: val } : p))
                      );
                    }}
                    className="w-full min-h-[40px] px-3.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                    placeholder="Waktu Pelaksanaan (misal: Setiap Jumat Pagi)"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newId = `prog-${Date.now()}`;
                setPrograms((prev) => [
                  ...prev,
                  {
                    id: newId,
                    title: 'Program Kerja Baru OSIS',
                    department: 'Departemen Keagamaan',
                    description: 'Penjelasan agenda kerja terpadu santri.',
                    timeline: 'Setiap Bulan'
                  }
                ]);
              }}
              className="w-full min-h-[48px] rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-[#007acc] text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#007acc] flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program Kerja Baru</span>
            </button>
          </div>
        </SimpleFormCard>
      )}

      {/* Tab C: Warta & Event */}
      {activeTab === 'event' && (
        <SimpleFormCard
          title="Warta Dokumentasi Event OSIS"
          subtitle="Publikasikan kegiatan pelantikan, festival santri, atau aksi sosial dengan foto resmi beresolusi tajam."
          icon={CalendarDays}
          isPublished={true}
          onPublish={async () => {
            if (!newEvent.title) return;
            setEvents((prev) => [...prev, { ...newEvent, id: `event-${Date.now()}` }]);
            setNewEvent({ id: '', title: '', date: '', description: '', photoUrl: '' });
          }}
          onSaveDraft={async () => {}}
        >
          <div className="space-y-4">
            <SmartImageDropzone
              value={newEvent.photoUrl}
              onChange={(url) => setNewEvent((prev) => ({ ...prev, photoUrl: url }))}
              aspectRatioPreset="landscape"
              label="Foto Dokumentasi Event (Rasio 4:3 / 16:9)"
              helperText="Foto kegiatan santri bersama dewan asatidz"
            />

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Nama / Judul Event
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full min-h-[48px] px-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                placeholder="Contoh: Pelantikan Kabinet OSIS Periode 2026/2027"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Tanggal Kegiatan
              </label>
              <input
                type="text"
                value={newEvent.date}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full min-h-[48px] px-4 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                placeholder="Contoh: 15 Oktober 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Narasi Singkat Liputan
              </label>
              <textarea
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full p-3.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                placeholder="Tuliskan suasana dan hasil kegiatan..."
              />
            </div>
          </div>
        </SimpleFormCard>
      )}

    </div>
  );
};
