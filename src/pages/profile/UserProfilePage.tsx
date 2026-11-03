import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Edit3,
  Save,
  BookOpen,
  GraduationCap,
  Home,
  Users,
  Calendar,
  Award,
  Phone,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Briefcase,
  Camera,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { convertImageToWebP, formatBytes } from '../../lib/webpConverter';
import {
  NINE_ROLES,
  getRoleMeta,
  normalizeCanonicalRole,
  type CanonicalRole,
} from '../../admin/permissions';
import { SantriTipTapEditor } from '../../santri/SantriTipTap';
import type { DynamicProfileRecord } from '../../admin/UsersPage';

const db = supabase as any;

const MAPEL_OPTIONS = [
  "Tahfidzul Qur'an",
  'IPA & Robotika STEM',
  'Matematika Olimpiade',
  'Fiqih Madrasah Diniyah',
  'Bahasa Arab (Muhadasah)',
  'Bahasa Inggris',
  'Adab & Akhlak Pesantren',
];

const KELAS_OPTIONS = [
  'VII-A Tahfidz',
  'VII-B Sains STEM',
  'VIII-A Tahfidz',
  'VIII-B Sains STEM',
  'IX-A Tahfidz',
  'IX-B Sains STEM',
];

export const UserProfilePage: React.FC = () => {
  const [allProfiles, setAllProfiles] = useState<DynamicProfileRecord[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Role-specific tabs
  const [santriTab, setSantriTab] = useState<'biodata' | 'akademik' | 'asrama' | 'wali'>('biodata');
  const [guruTab, setGuruTab] = useState<'mengajar' | 'karya' | 'jadwal'>('mengajar');

  // Related academic / karya data
  const [performanceRows, setPerformanceRows] = useState<any[]>([]);
  const [hafalanRows, setHafalanRows] = useState<any[]>([]);
  const [tugasRows, setTugasRows] = useState<any[]>([]);
  const [beritaRows, setBeritaRows] = useState<any[]>([]);

  // Editable form state
  const [fullName, setFullName] = useState('');
  const [nis, setNis] = useState('');
  const [nip, setNip] = useState('');
  const [kelas, setKelas] = useState('VIII-A Tahfidz');
  const [angkatan, setAngkatan] = useState('2025/2026');
  const [asramaKamar, setAsramaKamar] = useState('Al-Ghazali 04');
  const [hafalanJuz, setHafalanJuz] = useState(9);
  const [jabatan, setJabatan] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [bioJson, setBioJson] = useState<any>(null);
  const [mapelAmpu, setMapelAmpu] = useState<string[]>([]);
  const [kelasAmpu, setKelasAmpu] = useState<string[]>([]);
  const [jadwalMengajar, setJadwalMengajar] = useState<
    Array<{ hari: string; jam: string; kelas: string; mapel: string }>
  >([]);
  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [kontakWali, setKontakWali] = useState('');
  const [pekerjaanWali, setPekerjaanWali] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [
      { data: profs },
      { data: sessData },
      { data: perfData },
      { data: hafData },
      { data: tugData },
      { data: berData },
    ] = await Promise.all([
      db.from('profiles').select('*').order('created_at', { ascending: true }),
      db.auth.getSession(),
      db.from('performance').select('*').order('created_at', { ascending: false }),
      db.from('hafalan_setoran').select('*').order('tanggal', { ascending: false }),
      db.from('tugas').select('*').order('created_at', { ascending: false }),
      db.from('berita').select('id, title, slug, category, created_at, is_published').order('created_at', { ascending: false }).limit(8),
    ]);

    const list = (profs || []) as DynamicProfileRecord[];
    setAllProfiles(list);
    setPerformanceRows(perfData || []);
    setHafalanRows(hafData || []);
    setTugasRows(tugData || []);
    setBeritaRows(berData || []);

    const sessionUid = sessData?.session?.user?.id;
    setActiveProfileId((prev) => {
      if (prev && list.some((p) => p.id === prev)) return prev;
      if (sessionUid && list.some((p) => p.id === sessionUid)) return sessionUid;
      const santriDefault = list.find((p) => normalizeCanonicalRole(p.role) === 'santri');
      return santriDefault?.id || list[0]?.id || '';
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const currentProfile = useMemo(() => {
    return allProfiles.find((p) => p.id === activeProfileId) || allProfiles[0] || null;
  }, [allProfiles, activeProfileId]);

  const currentRole: CanonicalRole = useMemo(() => {
    return normalizeCanonicalRole(currentProfile?.role);
  }, [currentProfile?.role]);

  const roleMeta = useMemo(() => getRoleMeta(currentRole), [currentRole]);

  // Sync form state when currentProfile changes
  useEffect(() => {
    if (!currentProfile) return;
    setFullName(currentProfile.full_name || '');
    setNis(currentProfile.nis || '202608001');
    setNip(currentProfile.nip || '19920814-202101-1-003');
    setKelas(currentProfile.kelas || 'VIII-A Tahfidz');
    setAngkatan(currentProfile.angkatan || '2025/2026');
    setAsramaKamar(currentProfile.asrama_kamar || currentProfile.kamar_asrama || 'Al-Ghazali 04');
    setHafalanJuz(currentProfile.hafalan_juz ?? 9);
    setJabatan(currentProfile.jabatan || roleMeta.label);
    setWaNumber(currentProfile.wa_number || currentProfile.phone || '0821-3160-6535');
    setAlamatLengkap(
      currentProfile.alamat_lengkap ||
        'Jl. Raya Dukun-Lasem RT 01 RW 01 Kec. Sidayu Kab. Gresik'
    );
    setFotoUrl(
      currentProfile.foto_url ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    );
    setBioJson(
      currentProfile.bio || {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: `${currentProfile.full_name} — SMP Plus Jauharul Maknuun.` }],
          },
        ],
      }
    );
    setMapelAmpu(
      currentProfile.mapel_ampu?.length
        ? currentProfile.mapel_ampu
        : currentProfile.mapel_diampu?.length
        ? currentProfile.mapel_diampu
        : ["Tahfidzul Qur'an", 'IPA & Robotika STEM']
    );
    setKelasAmpu(
      currentProfile.kelas_ampu?.length
        ? currentProfile.kelas_ampu
        : ['VII-A Tahfidz', 'VIII-A Tahfidz']
    );
    const rawJadwal = (currentProfile as any).jadwal_mengajar;
    setJadwalMengajar(
      Array.isArray(rawJadwal) && rawJadwal.length > 0
        ? rawJadwal
        : [
            { hari: 'Senin', jam: '07:30 - 09:30', kelas: 'VIII-A Tahfidz', mapel: 'IPA & Robotika STEM' },
            { hari: 'Selasa', jam: '05:00 - 06:15', kelas: 'Semua Kelas', mapel: "Halaqah Tahfidzul Qur'an" },
            { hari: 'Rabu', jam: '09:45 - 11:30', kelas: 'VII-A Tahfidz', mapel: 'Matematika Olimpiade' },
          ]
    );
    setNamaAyah(currentProfile.wali_info?.nama_ayah || (currentProfile as any).wali_santri || 'H. Abdullah Al-Maknuun');
    setNamaIbu(currentProfile.wali_info?.nama_ibu || 'Hj. Siti Aminah');
    setKontakWali(currentProfile.wali_info?.kontak_wali || (currentProfile as any).no_wa_wali || '0812-3456-7890');
    setPekerjaanWali(currentProfile.wali_info?.pekerjaan || 'Wiraswasta');
  }, [currentProfile, roleMeta.label]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentProfile) return;
    setSaving(true);

    const payload: Record<string, any> = {
      full_name: fullName.trim(),
      nis: currentRole === 'santri' ? nis.trim() : currentProfile.nis,
      nip: currentRole !== 'santri' ? nip.trim() : currentProfile.nip,
      kelas: currentRole === 'santri' ? kelas : currentProfile.kelas,
      angkatan: currentRole === 'santri' ? angkatan : currentProfile.angkatan,
      asrama_kamar: asramaKamar.trim(),
      kamar_asrama: asramaKamar.trim(),
      hafalan_juz: Number(hafalanJuz) || 0,
      jabatan: jabatan.trim(),
      wa_number: waNumber.trim(),
      phone: waNumber.trim(),
      alamat_lengkap: alamatLengkap.trim(),
      foto_url: fotoUrl.trim(),
      bio: bioJson,
      mapel_ampu: mapelAmpu,
      mapel_diampu: mapelAmpu,
      kelas_ampu: kelasAmpu,
      jadwal_mengajar: jadwalMengajar,
      wali_info: {
        nama_ayah: namaAyah.trim(),
        nama_ibu: namaIbu.trim(),
        kontak_wali: kontakWali.trim(),
        pekerjaan: pekerjaanWali.trim(),
        hubungan: 'Orang Tua Kandung',
      },
      wali_santri: namaAyah.trim(),
      no_wa_wali: kontakWali.trim(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await db
      .from('profiles')
      .update(payload)
      .eq('id', currentProfile.id);

    setSaving(false);
    if (error) {
      showToast('Gagal menyimpan profil: ' + error.message);
      return;
    }

    setAllProfiles((prev) =>
      prev.map((p) => (p.id === currentProfile.id ? ({ ...p, ...payload } as DynamicProfileRecord) : p))
    );
    setIsEditing(false);
    showToast('Profil berhasil diperbarui dan disimpan ke Supabase!');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !currentProfile) return;
    let fileToUpload = rawFile;
    let savedInfo = '';
    if (rawFile.type.startsWith('image/')) {
      try {
        const converted = await convertImageToWebP(rawFile, { maxWidth: 800, maxHeight: 800, quality: 0.82 });
        fileToUpload = converted.file;
        savedInfo = ` (WebP ${formatBytes(converted.compressedSize)}, hemat ${converted.savedPercent}%)`;
      } catch {
        // fallback to rawFile
      }
    }
    const ext = fileToUpload.name.split('.').pop() || 'webp';
    const path = `avatars/${currentProfile.id}-${Date.now()}.${ext}`;
    const { error } = await db.storage.from('berita-images').upload(path, fileToUpload, {
      upsert: true,
      contentType: fileToUpload.type || 'image/webp',
    });
    if (!error) {
      const { data } = db.storage.from('berita-images').getPublicUrl(path);
      if (data?.publicUrl) {
        setFotoUrl(data.publicUrl);
        showToast(`Foto profil berhasil diunggah${savedInfo}. Klik Simpan untuk menerapkan.`);
        return;
      }
    }
    const localUrl = URL.createObjectURL(fileToUpload);
    setFotoUrl(localUrl);
    showToast(`Pratinjau foto profil diterapkan${savedInfo}. Klik Simpan untuk menerapkan.`);
  };

  // Filtered academic data for Santri
  const santriPerf = useMemo(
    () => performanceRows.filter((r) => r.santri_id === currentProfile?.id),
    [performanceRows, currentProfile?.id]
  );
  const santriHafalan = useMemo(
    () => hafalanRows.filter((h) => h.santri_id === currentProfile?.id),
    [hafalanRows, currentProfile?.id]
  );
  const santriAvg = useMemo(() => {
    if (santriPerf.length === 0) return 91;
    return Math.round(santriPerf.reduce((a, b) => a + Number(b.nilai || 0), 0) / santriPerf.length);
  }, [santriPerf]);

  // Filtered students in Guru's kelasAmpu
  const santriInGuruClasses = useMemo(() => {
    return allProfiles.filter(
      (p) =>
        normalizeCanonicalRole(p.role) === 'santri' &&
        (kelasAmpu.includes('Semua Kelas') || kelasAmpu.includes(p.kelas || ''))
    );
  }, [allProfiles, kelasAmpu]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <div className="h-20 rounded-2xl bg-stone-100 animate-pulse" />
        <div className="h-80 rounded-2xl bg-stone-100 animate-pulse" />
      </div>
    );
  }

  if (!currentProfile) return null;

  const juzProgressPct = Math.min(100, Math.round(((Number(hafalanJuz) || 0) / 30) * 100));

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8 text-stone-900">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#115E59] px-4 py-3 text-xs font-bold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-teal-200 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Role Switcher Bar for Testing All 9 Roles in Antigravity IDE */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#115E59] shrink-0" />
            <span className="text-xs font-bold text-stone-700">
              Mode Preview Profil Dinamis (Pilih Role / Akun):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {NINE_ROLES.map((r) => {
              const profForRole = allProfiles.find((p) => normalizeCanonicalRole(p.role) === r.value);
              const isSelected = currentRole === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => {
                    if (profForRole) {
                      setActiveProfileId(profForRole.id);
                      setIsEditing(false);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isSelected
                      ? 'bg-[#115E59] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : r.dotClass}`} />
                  {r.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            HERO PROFILE CARD (ADAPTS TO SANTRI / GURU / ADMIN-YAYASAN-KEPSEK)
           ===================================================================== */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Avatar + Primary Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={fotoUrl}
                  alt={fullName}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border-2 border-teal-800/20 shadow-md"
                />
                <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-[#115E59] text-white shadow-md hover:bg-[#0F766E] transition">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold ${roleMeta.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${roleMeta.dotClass}`} />
                    {roleMeta.label}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Status Aktif
                  </span>

                  {currentRole === 'santri' && (
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                      NIS: {nis}
                    </span>
                  )}
                  {currentRole !== 'santri' && (
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                      NIP: {nip}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-teal-600 bg-[#FAF8F5] px-3.5 py-1.5 text-xl font-bold text-stone-900"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">{fullName}</h1>
                )}

                {currentRole === 'santri' ? (
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#115E59]">
                      <GraduationCap className="h-4 w-4" />
                      Kelas {kelas} (Angkatan {angkatan})
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Home className="h-4 w-4 text-stone-400" />
                      Kamar: <strong>{asramaKamar}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-stone-400" />
                      Wali: <strong>{namaAyah} & {namaIbu}</strong>
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#115E59]">
                      <Briefcase className="h-4 w-4" />
                      {jabatan}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-stone-400" />
                      {waNumber}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-stone-400" />
                      {alamatLengkap}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Santri Juz Progress OR Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
              {currentRole === 'santri' && (
                <div className="w-full sm:w-64 rounded-2xl border border-teal-900/10 bg-[#FAF8F5] p-3.5">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-stone-600 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-[#115E59]" />
                      Capaian Tahfidz Al-Qur'an
                    </span>
                    <span className="text-[#115E59]">{hafalanJuz} / 30 Juz ({juzProgressPct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#115E59] to-teal-500 transition-all"
                      style={{ width: `${juzProgressPct}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/profile/${currentRole}/${currentProfile.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 px-3.5 py-2.5 text-xs font-bold text-stone-700 transition"
                >
                  <Eye className="h-3.5 w-3.5 text-[#115E59]" />
                  Lihat Public Card
                </Link>

                {isEditing ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveProfile()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Menyimpan...' : 'Simpan Profil'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profil (WYSIWYG)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            1. VIEW KHUSUS ROLE SANTRI (Tabs: Biodata, Akademik, Asrama, Wali)
           ===================================================================== */}
        {currentRole === 'santri' && (
          <div className="space-y-6">
            {/* Santri Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { key: 'biodata', label: 'Biodata & Tentang Saya', icon: User },
                  { key: 'akademik', label: 'Akademik & Nilai', icon: GraduationCap },
                  { key: 'asrama', label: 'Asrama & Setoran Hafalan', icon: Home },
                  { key: 'wali', label: 'Informasi Ayah / Ibu (Wali)', icon: Users },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = santriTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSantriTab(t.key as any)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                        active
                          ? 'bg-[#115E59] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <Link
                to="/santri"
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-bold text-[#115E59] hover:bg-teal-100 transition"
              >
                Buka Dashboard Santri (/santri)
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            {santriTab === 'biodata' && (
              <form
                onSubmit={handleSaveProfile}
                className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="text-base font-bold text-stone-900">Biodata Lengkap Santri</h2>
                  <span className="text-xs text-stone-400">Dapat diedit langsung oleh Santri</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Induk Santri (NIS)</label>
                    <input
                      type="text"
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Kelas</label>
                    <select
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                    >
                      {KELAS_OPTIONS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Angkatan</label>
                    <input
                      type="text"
                      value={angkatan}
                      onChange={(e) => setAngkatan(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">No. WhatsApp</label>
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Rumah Lengkap</label>
                    <input
                      type="text"
                      value={alamatLengkap}
                      onChange={(e) => setAlamatLengkap(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Bio, Cita-cita & Portofolio Santri (WYSIWYG Editor)
                  </label>
                  <SantriTipTapEditor value={bioJson} onChange={setBioJson} />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Menyimpan...' : 'Simpan Biodata Santri'}
                  </button>
                </div>
              </form>
            )}

            {santriTab === 'akademik' && (
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-stone-900">
                      Ringkasan Akademik & Tugas ({fullName})
                    </h2>
                    <p className="text-xs text-stone-500">
                      Rata-rata Nilai Akademik: <strong className="text-[#115E59]">{santriAvg}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/santri/tugas"
                      className="rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-stone-700"
                    >
                      Lihat Tugas Saya
                    </Link>
                    <Link
                      to="/santri/performance"
                      className="rounded-xl bg-[#115E59] px-3.5 py-2 text-xs font-bold text-white"
                    >
                      Grafik Performance Lengkap
                    </Link>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-stone-500 font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4">Mata Pelajaran</th>
                        <th className="py-3 px-4">Jenis</th>
                        <th className="py-3 px-4">Nilai</th>
                        <th className="py-3 px-4">Predikat</th>
                        <th className="py-3 px-4">Catatan Guru / Musyrif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {santriPerf.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 px-4 font-bold text-stone-800">{p.mapel}</td>
                          <td className="py-3 px-4 uppercase text-stone-500">{p.jenis}</td>
                          <td className="py-3 px-4 font-extrabold text-[#115E59]">{p.nilai}</td>
                          <td className="py-3 px-4">{p.predikat}</td>
                          <td className="py-3 px-4 text-stone-600">{p.catatan_musyrif}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {santriTab === 'asrama' && (
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-4">
                    <label className="block text-xs font-bold text-stone-600 mb-1">Kamar Asrama Santri</label>
                    <input
                      type="text"
                      value={asramaKamar}
                      onChange={(e) => setAsramaKamar(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-bold text-stone-900"
                    />
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-4">
                    <label className="block text-xs font-bold text-stone-600 mb-1">Capaian Juz Hafalan Mutqin</label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={hafalanJuz}
                      onChange={(e) => setHafalanJuz(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-bold text-[#115E59]"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                    Riwayat Setoran Hafalan Terakhir ({santriHafalan.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {santriHafalan.slice(0, 4).map((h) => (
                      <div key={h.id} className="rounded-xl border border-stone-200 p-3.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-stone-900">
                            Surah {h.surah} (Ayat {h.ayat_dari}–{h.ayat_sampai})
                          </p>
                          <p className="text-xs text-stone-500">Juz {h.juz}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 uppercase">
                          {h.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveProfile()}
                    className="rounded-xl bg-[#115E59] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Simpan Data Asrama & Tahfidz
                  </button>
                </div>
              </div>
            )}

            {santriTab === 'wali' && (
              <form
                onSubmit={handleSaveProfile}
                className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4"
              >
                <h2 className="text-base font-bold text-stone-900">Data Ayah, Ibu & Kontak Wali Santri</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nama Ayah Kandung</label>
                    <input
                      type="text"
                      value={namaAyah}
                      onChange={(e) => setNamaAyah(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nama Ibu Kandung</label>
                    <input
                      type="text"
                      value={namaIbu}
                      onChange={(e) => setNamaIbu(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Wali Aktif</label>
                    <input
                      type="text"
                      value={kontakWali}
                      onChange={(e) => setKontakWali(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pekerjaan Orang Tua / Wali</label>
                    <input
                      type="text"
                      value={pekerjaanWali}
                      onChange={(e) => setPekerjaanWali(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    <Save className="h-4 w-4" />
                    Simpan Informasi Wali
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* =====================================================================
            2. VIEW KHUSUS ROLE GURU & MUSYRIF (Tabs: Mengajar, Karya, Jadwal)
           ===================================================================== */}
        {(currentRole === 'guru' || currentRole === 'musyrif') && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { key: 'mengajar', label: 'Mengajar & Kelas Binaan', icon: BookOpen },
                  { key: 'karya', label: 'Karya, Tugas & Materi', icon: Award },
                  { key: 'jadwal', label: 'Jadwal Mengajar', icon: Calendar },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = guruTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setGuruTab(t.key as any)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                        active
                          ? 'bg-[#115E59] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <Link
                to="/guru"
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-bold text-[#115E59] hover:bg-teal-100 transition"
              >
                Buka Dashboard Guru (/guru)
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            {guruTab === 'mengajar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
                  <h2 className="text-base font-bold text-stone-900">
                    Profil Pengampu, Mapel & Bio WYSIWYG
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">NIP / NIY</label>
                      <input
                        type="text"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan Akademik</label>
                      <input
                        type="text"
                        value={jabatan}
                        onChange={(e) => setJabatan(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Mata Pelajaran yang Diampu (`mapel_ampu`)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {MAPEL_OPTIONS.map((m) => {
                        const selected = mapelAmpu.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() =>
                              setMapelAmpu((prev) =>
                                prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
                              )
                            }
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                              selected
                                ? 'bg-[#115E59] text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      Bio & Riwayat Pendidikan Guru (WYSIWYG)
                    </label>
                    <SantriTipTapEditor value={bioJson} onChange={setBioJson} />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveProfile()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-5 py-2.5 text-xs font-bold text-white"
                    >
                      <Save className="h-4 w-4" />
                      Simpan Profil Guru
                    </button>
                  </div>
                </div>

                {/* Santri di Kelas Ampu (Guru bisa klik untuk lihat profil akademik santri) */}
                <div className="lg:col-span-5 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Daftar Santri di Kelas Ampu ({santriInGuruClasses.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Klik santri untuk melihat profil akademik mereka (`/profile/santri/[id]`).
                    </p>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {santriInGuruClasses.map((s) => (
                      <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              s.foto_url ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={s.full_name}
                            className="h-10 w-10 rounded-xl object-cover border border-stone-200"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">{s.full_name}</p>
                            <p className="text-[11px] text-stone-500">
                              {s.kelas} • NIS {s.nis} • {s.hafalan_juz ?? 0} Juz
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/profile/santri/${s.id}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-teal-50 hover:bg-teal-100 px-3 py-1.5 text-xs font-bold text-[#115E59] shrink-0"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Profil Santri
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {guruTab === 'karya' && (
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-stone-900">
                    Karya, Modul Tugas & Artikel Publikasi Guru
                  </h2>
                  <div className="flex gap-2">
                    <Link
                      to="/guru/tugas/create"
                      className="rounded-xl bg-[#115E59] px-3.5 py-2 text-xs font-bold text-white"
                    >
                      + Buat Tugas Baru
                    </Link>
                    <Link
                      to="/guru/content"
                      className="rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-stone-700"
                    >
                      + Tulis Berita / Materi
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Tugas yang Diterbitkan ({tugasRows.length})
                    </h3>
                    {tugasRows.slice(0, 4).map((t) => (
                      <div key={t.id} className="rounded-xl border border-stone-200 p-3.5 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-stone-900">{t.judul}</p>
                          <p className="text-[11px] text-stone-500">{t.mapel} • {t.kelas_target}</p>
                        </div>
                        <Link
                          to={`/guru/tugas/${t.id}/submissions`}
                          className="text-xs font-bold text-[#115E59] hover:underline"
                        >
                          Lihat Submissions
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Artikel & Materi Pembelajaran ({beritaRows.length})
                    </h3>
                    {beritaRows.slice(0, 4).map((b) => (
                      <div key={b.id} className="rounded-xl border border-stone-200 p-3.5 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-stone-900 line-clamp-1">{b.title}</p>
                          <p className="text-[11px] text-stone-500">{b.category}</p>
                        </div>
                        <Link
                          to={`/berita/${b.slug}`}
                          className="text-xs font-bold text-[#115E59] hover:underline"
                        >
                          Baca
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {guruTab === 'jadwal' && (
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-stone-900">Jadwal Mengajar & Halaqah</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setJadwalMengajar((prev) => [
                        ...prev,
                        { hari: 'Kamis', jam: '10:00 - 11:30', kelas: 'VIII-A Tahfidz', mapel: mapelAmpu[0] || "Tahfidzul Qur'an" },
                      ])
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-[#115E59]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Sesi Jadwal
                  </button>
                </div>

                <div className="space-y-2.5">
                  {jadwalMengajar.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center rounded-xl border border-stone-200 bg-[#FAF8F5] p-3">
                      <input
                        type="text"
                        value={item.hari}
                        onChange={(e) =>
                          setJadwalMengajar((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, hari: e.target.value } : row))
                          )
                        }
                        className="sm:col-span-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={item.jam}
                        onChange={(e) =>
                          setJadwalMengajar((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, jam: e.target.value } : row))
                          )
                        }
                        className="sm:col-span-3 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        value={item.kelas}
                        onChange={(e) =>
                          setJadwalMengajar((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, kelas: e.target.value } : row))
                          )
                        }
                        className="sm:col-span-3 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={item.mapel}
                        onChange={(e) =>
                          setJadwalMengajar((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, mapel: e.target.value } : row))
                          )
                        }
                        className="sm:col-span-3 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#115E59]"
                      />
                      <button
                        type="button"
                        onClick={() => setJadwalMengajar((prev) => prev.filter((_, i) => i !== idx))}
                        className="sm:col-span-1 p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 justify-self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveProfile()}
                    className="rounded-xl bg-[#115E59] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Simpan Jadwal Mengajar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            3. VIEW KHUSUS SUPER ADMIN / YAYASAN / KEPSEK / PPDB / KEUANGAN / HUMAS
               (Kartu Admin dengan Permission List & Inline WYSIWYG Profile)
           ===================================================================== */}
        {currentRole !== 'santri' && currentRole !== 'guru' && currentRole !== 'musyrif' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Form Edit Profil Eksekutif / Admin */}
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-7 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Profil Pejabat / Administrator ({roleMeta.label})
                </h2>
                <span className="text-xs text-stone-400">Inline WYSIWYG</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">NIP / NIY Yayasan</label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan Struktural</label>
                  <input
                    type="text"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Resmi</label>
                  <input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Profil Singkat & Amanah Kelembagaan (WYSIWYG)
                </label>
                <SantriTipTapEditor value={bioJson} onChange={setBioJson} />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>

            {/* Right: Kartu Permission List & Pintasan Kendali */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <ShieldCheck className="h-5 w-5 text-[#115E59]" />
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Daftar Hak Akses & Permission ({roleMeta.label})
                  </h3>
                  <p className="text-xs text-stone-500">Ditegakkan melalui kebijakan RLS Supabase</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{roleMeta.description}</p>

              <div className="space-y-2.5">
                {roleMeta.permissionsSummary.map((perm, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-teal-900/10 bg-[#FAF8F5] p-3 text-xs text-stone-800"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#115E59] shrink-0 mt-0.5" />
                    <span className="font-medium">{perm}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-100">
                <Link
                  to="/admin/users"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-4 py-2.5 text-xs font-bold text-white transition"
                >
                  <Users className="h-4 w-4" />
                  Manajemen User
                </Link>
                <Link
                  to="/admin/roles"
                  className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 px-4 py-2.5 text-xs font-bold text-stone-800 transition"
                >
                  <ShieldCheck className="h-4 w-4 text-[#115E59]" />
                  Matriks 9 Role
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
