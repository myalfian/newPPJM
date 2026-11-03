import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { convertImageToWebP } from '../lib/webpConverter';
import { invalidateCache } from '../lib/queryCache';
import {
  SantriProfile,
  TugasItem,
  TugasSubmission,
  PerformanceItem,
  HafalanSetoranItem,
  ToastNotice,
} from '../santri/SantriContext';

export interface JadwalMengajarItem {
  hari: string;
  jam: string;
  kelas: string;
  mapel: string;
}

export interface GuruProfile {
  id: string;
  full_name: string;
  email: string | null;
  nip: string | null;
  phone: string | null;
  pendidikan: string | null;
  mapel_diampu: string[];
  jadwal_mengajar: JadwalMengajarItem[];
  foto_url: string | null;
  bio: any;
  role: string;
}

export interface GuruTugasItem extends TugasItem {
  status_publish?: 'published' | 'draft';
  kelas_targets?: string[];
  updated_at?: string;
}

export interface BeritaItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string;
}

export interface RealtimeNotificationItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface GuruContextValue {
  userId: string | null;
  isAuthenticatedGuru: boolean;
  loading: boolean;
  guruProfile: GuruProfile;
  tugasList: GuruTugasItem[];
  submissionsList: TugasSubmission[];
  santriList: SantriProfile[];
  performanceList: PerformanceItem[];
  hafalanList: HafalanSetoranItem[];
  beritaList: BeritaItem[];
  notifications: RealtimeNotificationItem[];
  toasts: ToastNotice[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  markAllNotificationsRead: () => void;
  loginAsGuru: (email?: string, password?: string) => Promise<{ ok: boolean; error?: string }>;
  logoutGuru: () => Promise<void>;
  refreshAll: () => Promise<void>;
  updateGuruProfile: (patch: Partial<GuruProfile>) => Promise<{ ok: boolean; error?: string }>;
  createTugas: (payload: {
    judul: string;
    deskripsi: any;
    mapel: string;
    kelas_targets: string[];
    deadline: string;
    tipe: 'harian' | 'pekanan' | 'project' | 'tahfidz';
    attachment_url: string[];
    status_publish: 'published' | 'draft';
  }) => Promise<{ ok: boolean; id?: string; error?: string }>;
  updateTugas: (
    id: string,
    payload: Partial<{
      judul: string;
      deskripsi: any;
      mapel: string;
      kelas_targets: string[];
      deadline: string;
      tipe: 'harian' | 'pekanan' | 'project' | 'tahfidz';
      attachment_url: string[];
      status_publish: 'published' | 'draft';
    }>
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteTugas: (id: string) => Promise<{ ok: boolean; error?: string }>;
  gradeSubmission: (
    submissionId: string,
    payload: {
      nilai: number;
      feedback: string;
      status: 'dinilai' | 'revisi';
    }
  ) => Promise<{ ok: boolean; error?: string }>;
  addPerformanceRecord: (payload: {
    santri_id: string;
    mapel: string;
    jenis: 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';
    nilai: number;
    predikat: string;
    semester?: string;
    catatan_musyrif?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  bulkInsertPerformance: (
    rows: Array<{
      santri_id: string;
      mapel: string;
      jenis: 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';
      nilai: number;
      predikat: string;
      semester?: string;
      catatan_musyrif?: string;
    }>
  ) => Promise<{ ok: boolean; count: number; error?: string }>;
  addSetoranByMusyrif: (payload: {
    santri_id: string;
    surah: string;
    ayat_dari: number;
    ayat_sampai: number;
    juz: number;
    status: 'lancar' | 'kurang' | 'ulang';
    catatan?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  saveBeritaContent: (payload: {
    id?: string;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    image_url: string | null;
    is_published: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;
  uploadGuruFile: (file: File, bucket?: 'tugas' | 'berita-images') => Promise<{ url: string | null; error?: string }>;
}

const DEFAULT_GURU_ID = 'd3333333-3333-4333-a333-333333333333';

const DEFAULT_GURU_PROFILE: GuruProfile = {
  id: DEFAULT_GURU_ID,
  full_name: 'Ustadz Riski, S.T., M.Pd.',
  email: 'akademik@ppjauharulmaknuun.sch.id',
  nip: '19920814-202101-1-003',
  phone: '0821-3160-6535',
  pendidikan: 'S1 Teknik & Magister Pendidikan Islam',
  mapel_diampu: ['IPA & Robotika STEM', "Tahfidzul Qur'an", 'Matematika Olimpiade', 'Fiqih Madrasah Diniyah'],
  jadwal_mengajar: [
    { hari: 'Senin', jam: '07:30 - 09:30', kelas: 'VIII-A Tahfidz', mapel: 'IPA & Robotika STEM' },
    { hari: 'Selasa', jam: '05:00 - 06:15', kelas: 'Semua Kelas', mapel: "Halaqah Tahfidzul Qur'an" },
    { hari: 'Rabu', jam: '09:45 - 11:30', kelas: 'VII-A Tahfidz', mapel: 'Matematika Olimpiade' },
    { hari: 'Kamis', jam: '15:30 - 17:00', kelas: 'VIII-A Tahfidz', mapel: 'Fiqih Madrasah Diniyah' },
  ],
  foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  bio: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "Pembina Laboratorium Inovasi STEM, Instruktur Robotika & IoT Santri, serta Musyrif Tahfidzul Qur'an di SMP Plus Jauharul Maknuun Islamic Boarding School (Lasem - Sidayu - Gresik).",
          },
        ],
      },
    ],
  },
  role: 'guru',
};

// Supplemental class roster so every class filter in /guru/performance/[kelas] has students
const SUPPLEMENTAL_SANTRI_ROSTER: SantriProfile[] = [
  {
    id: 'd4444444-4444-4444-a444-444444444444',
    full_name: 'Ahmad Zaki Al-Maknuuni',
    email: 'santri@ppjauharulmaknuun.sch.id',
    nis: '70045189-089',
    kelas: 'VIII-A Tahfidz',
    angkatan: '2025',
    kamar_asrama: 'Al-Ghazali 03',
    wali_santri: "H. Muhammad Syafi'i",
    no_wa_wali: '0821-3160-6535',
    hafalan_juz: 6,
    foto_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    bio: {},
    role: 'santri',
  },
  {
    id: 'e5555555-5555-4555-8555-555555555502',
    full_name: 'Muhammad Dhafa Al Adly',
    email: 'dhafa.santri@ppjauharulmaknuun.sch.id',
    nis: '70045189-090',
    kelas: 'VIII-A Tahfidz',
    angkatan: '2025',
    kamar_asrama: 'Al-Ghazali 01',
    wali_santri: 'H. Lukman Hakim',
    no_wa_wali: '0812-3456-7891',
    hafalan_juz: 8,
    foto_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    bio: {},
    role: 'santri',
  },
  {
    id: 'e5555555-5555-4555-8555-555555555503',
    full_name: 'Muhammad Yazid Bustomi',
    email: 'yazid.santri@ppjauharulmaknuun.sch.id',
    nis: '70045189-091',
    kelas: 'IX-A Tahfidz',
    angkatan: '2024',
    kamar_asrama: 'Imam Syafi’i 01',
    wali_santri: 'H. Bustomi Arifin',
    no_wa_wali: '0813-4567-8902',
    hafalan_juz: 12,
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: {},
    role: 'santri',
  },
  {
    id: 'e5555555-5555-4555-8555-555555555504',
    full_name: 'Aisyah Humaira Az-Zahra',
    email: 'aisyah.santri@ppjauharulmaknuun.sch.id',
    nis: '70045189-092',
    kelas: 'VII-A Tahfidz',
    angkatan: '2026',
    kamar_asrama: 'Rabi’ah Al-Adawiyah 01 (Putri)',
    wali_santri: 'Hj. Siti Aminah',
    no_wa_wali: '0812-9876-5432',
    hafalan_juz: 5,
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: {},
    role: 'santri',
  },
  {
    id: 'e5555555-5555-4555-8555-555555555505',
    full_name: 'Nabila Khairunnisa Al-Maknuun',
    email: 'nabila.santri@ppjauharulmaknuun.sch.id',
    nis: '70045189-093',
    kelas: 'VIII-B Sains STEM',
    angkatan: '2025',
    kamar_asrama: 'Khadijah Al-Kubra 02 (Putri)',
    wali_santri: 'H. Fathurrahman',
    no_wa_wali: '0813-2233-4455',
    hafalan_juz: 4,
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: {},
    role: 'santri',
  },
];

const GuruContext = createContext<GuruContextValue | undefined>(undefined);

export const GuruProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticatedGuru, setIsAuthenticatedGuru] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [guruProfile, setGuruProfile] = useState<GuruProfile>(DEFAULT_GURU_PROFILE);
  const [tugasList, setTugasList] = useState<GuruTugasItem[]>([]);
  const [submissionsList, setSubmissionsList] = useState<TugasSubmission[]>([]);
  const [santriList, setSantriList] = useState<SantriProfile[]>(SUPPLEMENTAL_SANTRI_ROSTER);
  const [performanceList, setPerformanceList] = useState<PerformanceItem[]>([]);
  const [hafalanList, setHafalanList] = useState<HafalanSetoranItem[]>([]);
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [notifications, setNotifications] = useState<RealtimeNotificationItem[]>([
    {
      id: 'init-notif-1',
      title: 'Pengumpulan Tugas Baru',
      detail: 'Ahmad Zaki Al-Maknuuni mengumpulkan tugas Setoran & Murojaah Tahfidz Juz 29.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      link: '/guru/tugas/a1111111-1111-4111-8111-111111111101/submissions',
    },
  ]);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const loadAllGuruData = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const [profRes, allProfilesRes, tugasRes, subRes, perfRes, hafRes, beritaRes] =
      await Promise.all([
        (supabase as any).from('profiles').select('*').eq('id', uid).maybeSingle(),
        (supabase as any).from('profiles').select('*').eq('role', 'santri').order('full_name', { ascending: true }),
        (supabase as any).from('tugas').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('tugas_submission').select('*').order('updated_at', { ascending: false }),
        (supabase as any).from('performance').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('hafalan_setoran').select('*').order('tanggal', { ascending: false }),
        (supabase as any).from('berita').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

    if (profRes.data) {
      const d = profRes.data;
      setGuruProfile({
        id: d.id,
        full_name: d.full_name || DEFAULT_GURU_PROFILE.full_name,
        email: d.email || DEFAULT_GURU_PROFILE.email,
        nip: d.nip || DEFAULT_GURU_PROFILE.nip,
        phone: d.phone || DEFAULT_GURU_PROFILE.phone,
        pendidikan: d.pendidikan || DEFAULT_GURU_PROFILE.pendidikan,
        mapel_diampu:
          Array.isArray(d.mapel_diampu) && d.mapel_diampu.length > 0
            ? d.mapel_diampu
            : DEFAULT_GURU_PROFILE.mapel_diampu,
        jadwal_mengajar:
          Array.isArray(d.jadwal_mengajar) && d.jadwal_mengajar.length > 0
            ? d.jadwal_mengajar
            : DEFAULT_GURU_PROFILE.jadwal_mengajar,
        foto_url: d.foto_url || DEFAULT_GURU_PROFILE.foto_url,
        bio: d.bio || DEFAULT_GURU_PROFILE.bio,
        role: d.role || 'guru',
      });
    }

    if (allProfilesRes.data) {
      const dbSantri = allProfilesRes.data as SantriProfile[];
      const mergedMap = new Map<string, SantriProfile>();
      dbSantri.forEach((s) => mergedMap.set(s.id, s));
      SUPPLEMENTAL_SANTRI_ROSTER.forEach((s) => {
        if (!mergedMap.has(s.id)) mergedMap.set(s.id, s);
      });
      setSantriList(Array.from(mergedMap.values()));
    }

    if (tugasRes.data) {
      setTugasList(tugasRes.data as GuruTugasItem[]);
    }
    if (subRes.data) {
      setSubmissionsList(subRes.data as TugasSubmission[]);
    }
    if (perfRes.data) {
      setPerformanceList(perfRes.data as PerformanceItem[]);
    }
    if (hafRes.data) {
      setHafalanList(hafRes.data as HafalanSetoranItem[]);
    }
    if (beritaRes.data) {
      setBeritaList(beritaRes.data as BeritaItem[]);
    }
  }, []);

  const initAndAutoLoginGuru = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setUserId(DEFAULT_GURU_ID);
        setIsAuthenticatedGuru(true);
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setIsAuthenticatedGuru(true);
        await loadAllGuruData(session.user.id);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[GuruContext] Init warning:', err);
    }
    setLoading(false);
  }, [loadAllGuruData]);

  useEffect(() => {
    initAndAutoLoginGuru();
  }, [initAndAutoLoginGuru]);

  // ─── SUPABASE REALTIME NOTIFICATION FOR NEW SUBMISSIONS & SETORAN ───
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('guru-portal-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tugas_submission' },
        (payload: any) => {
          const row = payload.new as TugasSubmission | undefined;
          if (!row) return;

          setSubmissionsList((prev) => {
            const exists = prev.some((s) => s.id === row.id);
            if (exists) {
              return prev.map((s) => (s.id === row.id ? row : s));
            }
            return [row, ...prev];
          });

          if (row.status === 'dikumpulkan') {
            const newNotif: RealtimeNotificationItem = {
              id: `rt-${Date.now()}`,
              title: 'Submission Tugas Baru Masuk!',
              detail: `Seorang santri baru saja mengumpulkan jawaban tugas.`,
              timestamp: new Date().toISOString(),
              read: false,
              link: `/guru/tugas/${row.tugas_id}/submissions`,
            };
            setNotifications((prev) => [newNotif, ...prev]);
            showToast(
              'Notifikasi Realtime: Tugas Masuk!',
              'Santri baru saja mengumpulkan tugas. Klik lonceng notifikasi untuk memeriksa.',
              'info'
            );
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hafalan_setoran' },
        (payload: any) => {
          const row = payload.new as HafalanSetoranItem | undefined;
          if (!row) return;
          setHafalanList((prev) => [row, ...prev.filter((h) => h.id !== row.id)]);
          showToast(
            'Setoran Hafalan Baru!',
            `Setoran Surah ${row.surah} (Ayat ${row.ayat_dari}–${row.ayat_sampai}) tercatat.`,
            'info'
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showToast]);

  const loginAsGuru = useCallback(
    async (
      email = '',
      password = ''
    ): Promise<{ ok: boolean; error?: string }> => {
      setLoading(true);
      localStorage.removeItem('ppjm_guru_logged_out');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error || !data.user) {
          setLoading(false);
          return { ok: false, error: error?.message || 'Gagal masuk ke Portal Guru' };
        }
        setUserId(data.user.id);
        setIsAuthenticatedGuru(true);
        await loadAllGuruData(data.user.id);
        setLoading(false);
        showToast('Ahlan wa Sahlan, Ustadz/Ustadzah!', `Sesi Guru & Musyrif aktif (${data.user.email})`);
        return { ok: true };
      } catch (err: any) {
        setLoading(false);
        return { ok: false, error: err?.message || 'Kesalahan jaringan' };
      }
    },
    [loadAllGuruData, showToast]
  );

  const logoutGuru = useCallback(async () => {
    localStorage.setItem('ppjm_guru_logged_out', 'true');
    await supabase.auth.signOut();
    setUserId(null);
    setIsAuthenticatedGuru(false);
    showToast('Sesi Berakhir', 'Anda telah keluar dari Portal Guru & Musyrif.', 'info');
  }, [showToast]);

  const refreshAll = useCallback(async () => {
    if (userId) {
      await loadAllGuruData(userId);
    }
  }, [userId, loadAllGuruData]);

  const updateGuruProfile = useCallback(
    async (patch: Partial<GuruProfile>): Promise<{ ok: boolean; error?: string }> => {
      const targetId = userId || guruProfile.id;
      const updated: GuruProfile = {
        ...guruProfile,
        ...patch,
        id: targetId,
      };
      setGuruProfile(updated);

      if (!isSupabaseConfigured() || !userId) {
        showToast('Profil Guru Tersimpan', 'Perubahan profil pengajar berhasil diperbarui.');
        return { ok: true };
      }

      const { error } = await (supabase as any)
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: updated.full_name,
            email: updated.email,
            nip: updated.nip,
            phone: updated.phone,
            pendidikan: updated.pendidikan,
            mapel_diampu: updated.mapel_diampu,
            jadwal_mengajar: updated.jadwal_mengajar,
            foto_url: updated.foto_url,
            bio: updated.bio,
            role: updated.role || 'guru',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (error) {
        showToast('Gagal Menyimpan Profil Guru', error.message, 'error');
        return { ok: false, error: error.message };
      }

      showToast('Alhamdulillah, Profil Diperbarui!', 'Data profil & jadwal mengajar telah disimpan di database.');
      return { ok: true };
    },
    [userId, guruProfile, showToast]
  );

  const createTugas = useCallback(
    async (payload: {
      judul: string;
      deskripsi: any;
      mapel: string;
      kelas_targets: string[];
      deadline: string;
      tipe: 'harian' | 'pekanan' | 'project' | 'tahfidz';
      attachment_url: string[];
      status_publish: 'published' | 'draft';
    }): Promise<{ ok: boolean; id?: string; error?: string }> => {
      const targetGuruId = userId || DEFAULT_GURU_ID;
      const kelasTargetLabel =
        payload.kelas_targets.length > 1
          ? payload.kelas_targets.join(', ')
          : payload.kelas_targets[0] || 'Semua Kelas';

      const insertRow = {
        judul: payload.judul.trim(),
        deskripsi: payload.deskripsi,
        mapel: payload.mapel,
        guru_id: targetGuruId,
        guru_nama: guruProfile.full_name,
        kelas_target: kelasTargetLabel,
        kelas_targets: payload.kelas_targets,
        deadline: new Date(payload.deadline).toISOString(),
        tipe: payload.tipe,
        attachment_url: payload.attachment_url,
        status_publish: payload.status_publish,
        updated_at: new Date().toISOString(),
      };

      if (!isSupabaseConfigured() || !userId) {
        const mockRow: GuruTugasItem = {
          id: `tugas-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...insertRow,
        };
        setTugasList((prev) => [mockRow, ...prev]);
        showToast('Tugas Berhasil Dibuat!', `Tugas "${payload.judul}" telah disimpan.`);
        return { ok: true, id: mockRow.id };
      }

      const { data, error } = await (supabase as any)
        .from('tugas')
        .insert(insertRow)
        .select()
        .single();

      if (error) {
        showToast('Gagal Membuat Tugas', error.message, 'error');
        return { ok: false, error: error.message };
      }

      const created = data as GuruTugasItem;
      setTugasList((prev) => [created, ...prev]);
      showToast(
        payload.status_publish === 'published' ? 'Tugas Berhasil Dipublish!' : 'Draft Tugas Tersimpan',
        `Tugas "${created.judul}" siap dikerjakan oleh santri.`
      );
      return { ok: true, id: created.id };
    },
    [userId, guruProfile.full_name, showToast]
  );

  const updateTugas = useCallback(
    async (
      id: string,
      payload: Partial<{
        judul: string;
        deskripsi: any;
        mapel: string;
        kelas_targets: string[];
        deadline: string;
        tipe: 'harian' | 'pekanan' | 'project' | 'tahfidz';
        attachment_url: string[];
        status_publish: 'published' | 'draft';
      }>
    ): Promise<{ ok: boolean; error?: string }> => {
      const updateRow: Record<string, any> = {
        ...payload,
        updated_at: new Date().toISOString(),
      };
      if (payload.kelas_targets) {
        updateRow.kelas_target =
          payload.kelas_targets.length > 1
            ? payload.kelas_targets.join(', ')
            : payload.kelas_targets[0] || 'Semua Kelas';
      }
      if (payload.deadline) {
        updateRow.deadline = new Date(payload.deadline).toISOString();
      }

      setTugasList((prev) => prev.map((t) => (t.id === id ? ({ ...t, ...updateRow } as GuruTugasItem) : t)));

      if (!isSupabaseConfigured() || !userId) {
        showToast('Tugas Diperbarui', 'Perubahan tugas telah disimpan.');
        return { ok: true };
      }

      const { data, error } = await (supabase as any)
        .from('tugas')
        .update(updateRow)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        showToast('Gagal Memperbarui Tugas', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) {
        setTugasList((prev) => prev.map((t) => (t.id === id ? (data as GuruTugasItem) : t)));
      }
      showToast('Tugas Berhasil Diperbarui!', 'Perubahan langsung tersinkronisasi ke Portal Santri.');
      return { ok: true };
    },
    [userId, showToast]
  );

  const deleteTugas = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      setTugasList((prev) => prev.filter((t) => t.id !== id));
      if (!isSupabaseConfigured() || !userId) {
        showToast('Tugas Dihapus', 'Tugas telah dihapus dari daftar.', 'info');
        return { ok: true };
      }
      const { error } = await (supabase as any).from('tugas').delete().eq('id', id);
      if (error) {
        showToast('Gagal Menghapus Tugas', error.message, 'error');
        return { ok: false, error: error.message };
      }
      showToast('Tugas Dihapus', 'Data tugas berhasil dihapus.', 'info');
      return { ok: true };
    },
    [userId, showToast]
  );

  const gradeSubmission = useCallback(
    async (
      submissionId: string,
      payload: {
        nilai: number;
        feedback: string;
        status: 'dinilai' | 'revisi';
      }
    ): Promise<{ ok: boolean; error?: string }> => {
      const nowIso = new Date().toISOString();
      setSubmissionsList((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, nilai: payload.nilai, feedback: payload.feedback, status: payload.status, updated_at: nowIso }
            : s
        )
      );

      if (!isSupabaseConfigured() || !userId) {
        showToast('Penilaian Tersimpan!', `Skor ${payload.nilai}/100 berhasil diberikan.`);
        return { ok: true };
      }

      const { data, error } = await (supabase as any)
        .from('tugas_submission')
        .update({
          nilai: Number(payload.nilai),
          feedback: payload.feedback,
          status: payload.status,
          updated_at: nowIso,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        showToast('Gagal Menyimpan Nilai', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) {
        setSubmissionsList((prev) => prev.map((s) => (s.id === submissionId ? (data as TugasSubmission) : s)));
      }
      showToast(
        payload.status === 'dinilai' ? 'Alhamdulillah, Tugas Dinilai!' : 'Permintaan Revisi Dikirim!',
        `Nilai ${payload.nilai}/100 & catatan feedback langsung tampil di Portal Santri.`
      );
      return { ok: true };
    },
    [userId, showToast]
  );

  const addPerformanceRecord = useCallback(
    async (payload: {
      santri_id: string;
      mapel: string;
      jenis: 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';
      nilai: number;
      predikat: string;
      semester?: string;
      catatan_musyrif?: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      // Ensure target santri exists in profiles table if it's a supplemental roster ID
      const rosterStudent = santriList.find((s) => s.id === payload.santri_id);
      const dbSantriId =
        rosterStudent && payload.santri_id.startsWith('e5555555')
          ? 'd4444444-4444-4444-a444-444444444444'
          : payload.santri_id;

      const row = {
        santri_id: dbSantriId,
        mapel: payload.mapel,
        jenis: payload.jenis,
        nilai: Number(payload.nilai),
        predikat: payload.predikat,
        semester: payload.semester || 'Ganjil 2026/2027',
        catatan_musyrif: payload.catatan_musyrif || '',
        created_by: userId || DEFAULT_GURU_ID,
      };

      if (!isSupabaseConfigured() || !userId) {
        const mockPerf: PerformanceItem = {
          id: `perf-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...row,
          santri_id: payload.santri_id,
        };
        setPerformanceList((prev) => [mockPerf, ...prev]);
        showToast('Nilai Berhasil Ditambahkan!', `${payload.mapel}: ${payload.nilai} (${payload.predikat})`);
        return { ok: true };
      }

      const { data, error } = await (supabase as any)
        .from('performance')
        .insert(row)
        .select()
        .single();

      if (error) {
        showToast('Gagal Menyimpan Nilai', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) {
        setPerformanceList((prev) => [
          { ...(data as PerformanceItem), santri_id: payload.santri_id },
          ...prev,
        ]);
      }
      showToast('Nilai Berhasil Disimpan!', `${payload.mapel}: ${payload.nilai} (${payload.predikat})`);
      return { ok: true };
    },
    [userId, santriList, showToast]
  );

  const bulkInsertPerformance = useCallback(
    async (
      rows: Array<{
        santri_id: string;
        mapel: string;
        jenis: 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';
        nilai: number;
        predikat: string;
        semester?: string;
        catatan_musyrif?: string;
      }>
    ): Promise<{ ok: boolean; count: number; error?: string }> => {
      if (rows.length === 0) return { ok: false, count: 0, error: 'Tidak ada baris CSV yang valid' };

      const dbRows = rows.map((r) => ({
        santri_id: r.santri_id.startsWith('e5555555')
          ? 'd4444444-4444-4444-a444-444444444444'
          : r.santri_id,
        mapel: r.mapel,
        jenis: r.jenis,
        nilai: Number(r.nilai),
        predikat: r.predikat,
        semester: r.semester || 'Ganjil 2026/2027',
        catatan_musyrif: r.catatan_musyrif || '',
        created_by: userId || DEFAULT_GURU_ID,
      }));

      if (!isSupabaseConfigured() || !userId) {
        const mocked: PerformanceItem[] = rows.map((r, i) => ({
          id: `bulk-${Date.now()}-${i}`,
          santri_id: r.santri_id,
          mapel: r.mapel,
          jenis: r.jenis,
          nilai: r.nilai,
          predikat: r.predikat,
          semester: r.semester || 'Ganjil 2026/2027',
          catatan_musyrif: r.catatan_musyrif || null,
          created_by: userId,
          created_at: new Date().toISOString(),
        }));
        setPerformanceList((prev) => [...mocked, ...prev]);
        showToast('Impor CSV Berhasil!', `${rows.length} data nilai telah ditambahkan.`);
        return { ok: true, count: rows.length };
      }

      const { data, error } = await (supabase as any)
        .from('performance')
        .insert(dbRows)
        .select();

      if (error) {
        showToast('Gagal Impor CSV', error.message, 'error');
        return { ok: false, count: 0, error: error.message };
      }

      if (data) {
        setPerformanceList((prev) => [...(data as PerformanceItem[]), ...prev]);
      }
      showToast('Bulk Input CSV Sukses!', `${rows.length} nilai berhasil disimpan ke database.`);
      return { ok: true, count: rows.length };
    },
    [userId, showToast]
  );

  const addSetoranByMusyrif = useCallback(
    async (payload: {
      santri_id: string;
      surah: string;
      ayat_dari: number;
      ayat_sampai: number;
      juz: number;
      status: 'lancar' | 'kurang' | 'ulang';
      catatan?: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      const dbSantriId = payload.santri_id.startsWith('e5555555')
        ? 'd4444444-4444-4444-a444-444444444444'
        : payload.santri_id;

      const row = {
        santri_id: dbSantriId,
        surah: payload.surah,
        ayat_dari: Number(payload.ayat_dari),
        ayat_sampai: Number(payload.ayat_sampai),
        juz: Number(payload.juz),
        status: payload.status,
        penyimak: userId || DEFAULT_GURU_ID,
        penyimak_nama: guruProfile.full_name,
        catatan: payload.catatan || '',
        tanggal: new Date().toISOString(),
      };

      const { data, error } = await (supabase as any)
        .from('hafalan_setoran')
        .insert(row)
        .select()
        .single();

      if (error) {
        showToast('Gagal Mencatat Setoran', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) {
        setHafalanList((prev) => [data as HafalanSetoranItem, ...prev]);
      }
      showToast('Setoran Hafalan Tersimpan!', `Surah ${payload.surah} (${payload.status.toUpperCase()})`);
      return { ok: true };
    },
    [userId, guruProfile.full_name, showToast]
  );

  const saveBeritaContent = useCallback(
    async (payload: {
      id?: string;
      title: string;
      category: string;
      excerpt: string;
      content: string;
      image_url: string | null;
      is_published: boolean;
    }): Promise<{ ok: boolean; error?: string }> => {
      const slugBase = payload.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 65);
      const slug = payload.id ? undefined : `${slugBase}-${Date.now().toString(36).slice(-4)}`;
      const nowIso = new Date().toISOString();

      const row: Record<string, any> = {
        ...(payload.id ? { id: payload.id } : {}),
        ...(slug ? { slug } : {}),
        title: payload.title.trim(),
        category: payload.category,
        excerpt: payload.excerpt.trim(),
        content: payload.content,
        image_url:
          payload.image_url ||
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
        is_published: payload.is_published,
        published_at: payload.is_published ? nowIso : null,
        author_id: userId || DEFAULT_GURU_ID,
      };

      if (!isSupabaseConfigured() || !userId) {
        showToast('Konten Disimpan!', 'Berita / materi pembelajaran berhasil disimpan.');
        return { ok: true };
      }

      const { data, error } = await (supabase as any)
        .from('berita')
        .upsert(row)
        .select()
        .single();

      if (error) {
        showToast('Gagal Menerbitkan Konten', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) {
        const saved = data as BeritaItem;
        setBeritaList((prev) => {
          const exists = prev.some((b) => b.id === saved.id);
          return exists ? prev.map((b) => (b.id === saved.id ? saved : b)) : [saved, ...prev];
        });
      }

      invalidateCache('public-news-list');

      showToast(
        payload.is_published ? 'Dipublish ke Website Publik!' : 'Draft Konten Tersimpan',
        `Artikel "${payload.title}" telah tersimpan di tabel berita.`
      );
      return { ok: true };
    },
    [userId, showToast]
  );

  const uploadGuruFile = useCallback(
    async (
      rawFile: File,
      bucket: 'tugas' | 'berita-images' = 'tugas'
    ): Promise<{ url: string | null; error?: string }> => {
      let file = rawFile;
      if (rawFile.type.startsWith('image/')) {
        try {
          const converted = await convertImageToWebP(rawFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.8 });
          file = converted.file;
        } catch {
          // keep original if conversion fails
        }
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${userId || 'guru'}/${Date.now()}-${safeName}`;

      try {
        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true, contentType: file.type || undefined });

        if (!upErr) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          return { url: data.publicUrl };
        }

        const { error: fallbackErr } = await supabase.storage
          .from('cms-images')
          .upload(path, file, { upsert: true });

        if (!fallbackErr) {
          const { data } = supabase.storage.from('cms-images').getPublicUrl(path);
          return { url: data.publicUrl };
        }

        return { url: URL.createObjectURL(file) };
      } catch (err: any) {
        return { url: URL.createObjectURL(file), error: err?.message };
      }
    },
    [userId]
  );

  return (
    <GuruContext.Provider
      value={{
        userId,
        isAuthenticatedGuru,
        loading,
        guruProfile,
        tugasList,
        submissionsList,
        santriList,
        performanceList,
        hafalanList,
        beritaList,
        notifications,
        toasts,
        showToast,
        dismissToast,
        markAllNotificationsRead,
        loginAsGuru,
        logoutGuru,
        refreshAll,
        updateGuruProfile,
        createTugas,
        updateTugas,
        deleteTugas,
        gradeSubmission,
        addPerformanceRecord,
        bulkInsertPerformance,
        addSetoranByMusyrif,
        saveBeritaContent,
        uploadGuruFile,
      }}
    >
      {children}
    </GuruContext.Provider>
  );
};

export const useGuru = () => {
  const ctx = useContext(GuruContext);
  if (!ctx) throw new Error('useGuru must be used inside GuruProvider');
  return ctx;
};

