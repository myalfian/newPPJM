import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SantriProfile {
  id: string;
  full_name: string;
  email: string | null;
  nis: string | null;
  kelas: string | null;
  angkatan: string | null;
  kamar_asrama: string | null;
  wali_santri: string | null;
  no_wa_wali?: string | null;
  hafalan_juz: number;
  foto_url: string | null;
  bio: any;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface TugasItem {
  id: string;
  judul: string;
  deskripsi: any;
  mapel: string;
  guru_id: string | null;
  guru_nama?: string | null;
  kelas_target: string;
  deadline: string;
  attachment_url: string[];
  tipe: 'harian' | 'pekanan' | 'project' | 'tahfidz';
  created_at: string;
}

export interface TugasSubmission {
  id: string;
  tugas_id: string;
  santri_id: string;
  jawaban_text: any;
  file_url: string[];
  status: 'draft' | 'dikumpulkan' | 'dinilai' | 'revisi';
  nilai: number | null;
  feedback: string | null;
  submitted_at: string | null;
  updated_at: string;
}

export interface PerformanceItem {
  id: string;
  santri_id: string;
  mapel: string;
  jenis: 'harian' | 'uts' | 'uas' | 'tahfidz' | 'adab';
  nilai: number;
  predikat: string;
  semester: string;
  catatan_musyrif: string | null;
  created_by: string | null;
  created_at: string;
}

export interface HafalanSetoranItem {
  id: string;
  santri_id: string;
  surah: string;
  ayat_dari: number;
  ayat_sampai: number;
  juz: number;
  status: 'lancar' | 'kurang' | 'ulang';
  penyimak: string | null;
  penyimak_nama?: string | null;
  catatan?: string | null;
  tanggal: string;
}

export interface ToastNotice {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface SantriContextValue {
  userId: string | null;
  isAuthenticatedSantri: boolean;
  loading: boolean;
  profile: SantriProfile;
  tugasList: TugasItem[];
  submissionsMap: Record<string, TugasSubmission>;
  performanceList: PerformanceItem[];
  hafalanList: HafalanSetoranItem[];
  toasts: ToastNotice[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  loginAsSantri: (email?: string, password?: string) => Promise<{ ok: boolean; error?: string }>;
  logoutSantri: () => Promise<void>;
  refreshAll: () => Promise<void>;
  updateSantriProfile: (patch: Partial<SantriProfile>) => Promise<{ ok: boolean; error?: string }>;
  saveTugasSubmission: (
    tugasId: string,
    payload: {
      jawaban_text: any;
      file_url: string[];
      status: 'draft' | 'dikumpulkan';
    }
  ) => Promise<{ ok: boolean; error?: string; submission?: TugasSubmission }>;
  addHafalanSetoran: (payload: {
    surah: string;
    ayat_dari: number;
    ayat_sampai: number;
    juz: number;
    status: 'lancar' | 'kurang' | 'ulang';
    penyimak_nama?: string;
    catatan?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  uploadSantriFile: (file: File, folder?: 'avatars' | 'tugas') => Promise<{ url: string | null; error?: string }>;
}

const DEFAULT_SANTRI_ID = 'd4444444-4444-4444-a444-444444444444';

const FALLBACK_PROFILE: SantriProfile = {
  id: DEFAULT_SANTRI_ID,
  full_name: 'Ahmad Zaki Al-Maknuuni',
  email: 'santri@ppjauharulmaknuun.sch.id',
  nis: '70045189-089',
  kelas: 'VIII-A Tahfidz',
  angkatan: '2025',
  kamar_asrama: 'Al-Ghazali 03',
  wali_santri: "H. Muhammad Syafi'i",
  no_wa_wali: '0821-3160-6535',
  hafalan_juz: 6,
  foto_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  bio: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "Santriwan Program Takhassus Tahfidzul Qur'an & Tim Riset Robotika STEM SMP Plus Jauharul Maknuun Islamic Boarding School (Lasem - Sidayu - Gresik). Bertekad menjadi generasi muslim yang Sholeh, Cerdas, Terampil, dan Unggul.",
          },
        ],
      },
    ],
  },
  role: 'santri',
};

const FALLBACK_TUGAS: TugasItem[] = [
  {
    id: 'a1111111-1111-4111-8111-111111111101',
    judul: 'Setoran & Murojaah Tahfidz Juz 29 (Surah Al-Mulk Ayat 1–30)',
    deskripsi: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Silakan menyetorkan hafalan Surah Al-Mulk ayat 1 sampai 30 secara bil-ghoib dengan memperhatikan makharijul huruf dan hukum tajwid (ikhfa, idgham, dan mad wajib muttashil).',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Lampirkan rekaman audio (.mp3/.m4a) atau foto lembar paraf buku mutabaah musyrif.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Tuliskan refleksi ayat favorit beserta kandungan maknanya pada kolom jawaban WYSIWYG di bawah.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    mapel: "Tahfidzul Qur'an",
    guru_id: null,
    guru_nama: 'Ustadz Fadly, S.Pd.',
    kelas_target: 'Semua Kelas',
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    attachment_url: [],
    tipe: 'tahfidz',
    created_at: new Date().toISOString(),
  },
  {
    id: 'a1111111-1111-4111-8111-111111111102',
    judul: 'Proyek LKPD STEM: Desain & Uji Beban Hydrolift Hukum Pascal',
    deskripsi: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Kerjakan laporan hasil eksperimen Hydrolift berbasis spuit hidrolik sesuai tahapan Engineering Design Process (Ask, Imagine, Plan, Create, Test, Improve).',
            },
          ],
        },
      ],
    },
    mapel: 'IPA & Robotika STEM',
    guru_id: null,
    guru_nama: 'Ustadzah Ria & Ustadzah Anggun',
    kelas_target: 'VIII-A Tahfidz',
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
    attachment_url: ['/docs/stem/LKPD_STEM_Hydrolift_Hukum_Pascal_Kelas_8.docx'],
    tipe: 'project',
    created_at: new Date().toISOString(),
  },
  {
    id: 'a1111111-1111-4111-8111-111111111103',
    judul: 'Latihan Dialog & Kosakata Bahasa Mandarin: 自我介绍 (Perkenalan Diri)',
    deskripsi: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Buatlah teks perkenalan diri lengkap dalam Bahasa Mandarin menggunakan Hanzi, Pinyin, dan terjemahan Bahasa Indonesia (minimal 6 kalimat).',
            },
          ],
        },
      ],
    },
    mapel: 'Bahasa Mandarin',
    guru_id: null,
    guru_nama: 'Ustadzah Nuriyah & Ustadzah Rizza',
    kelas_target: 'Semua Kelas',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    attachment_url: ['/docs/mandarin/2_Materi_Perkenalan_Diri_Mandarin.docx'],
    tipe: 'pekanan',
    created_at: new Date().toISOString(),
  },
];

const SantriContext = createContext<SantriContextValue | undefined>(undefined);

export const SantriProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticatedSantri, setIsAuthenticatedSantri] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<SantriProfile>(FALLBACK_PROFILE);
  const [tugasList, setTugasList] = useState<TugasItem[]>(FALLBACK_TUGAS);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, TugasSubmission>>({});
  const [performanceList, setPerformanceList] = useState<PerformanceItem[]>([]);
  const [hafalanList, setHafalanList] = useState<HafalanSetoranItem[]>([]);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadSantriDataForUser = useCallback(async (uid: string, userEmail?: string | null) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      // Ensure profile & initial records exist via SECURITY DEFINER RPC
      await (supabase as any).rpc('ensure_santri_profile', {
        p_full_name: 'Ahmad Zaki Al-Maknuuni',
        p_email: userEmail || 'santri@ppjauharulmaknuun.sch.id',
      });
    } catch {
      // ignore if RPC already ran
    }

    const [profileRes, tugasRes, subRes, perfRes, hafalanRes] = await Promise.all([
      (supabase as any).from('profiles').select('*').eq('id', uid).maybeSingle(),
      (supabase as any).from('tugas').select('*').order('deadline', { ascending: true }),
      (supabase as any).from('tugas_submission').select('*').eq('santri_id', uid),
      (supabase as any)
        .from('performance')
        .select('*')
        .eq('santri_id', uid)
        .order('created_at', { ascending: false }),
      (supabase as any)
        .from('hafalan_setoran')
        .select('*')
        .eq('santri_id', uid)
        .order('tanggal', { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as SantriProfile);
    }
    if (tugasRes.data && tugasRes.data.length > 0) {
      setTugasList(tugasRes.data as TugasItem[]);
    }
    if (subRes.data) {
      const map: Record<string, TugasSubmission> = {};
      (subRes.data as TugasSubmission[]).forEach((row) => {
        map[row.tugas_id] = row;
      });
      setSubmissionsMap(map);
    }
    if (perfRes.data) {
      setPerformanceList(perfRes.data as PerformanceItem[]);
    }
    if (hafalanRes.data) {
      setHafalanList(hafalanRes.data as HafalanSetoranItem[]);
    }
  }, []);

  const initAndAutoLoginSantri = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setUserId(DEFAULT_SANTRI_ID);
        setIsAuthenticatedSantri(true);
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        setIsAuthenticatedSantri(true);
        await loadSantriDataForUser(session.user.id, session.user.email);
        setLoading(false);
        return;
      }

      // Auto-sign-in default santri session unless user explicitly logged out of /santri
      if (localStorage.getItem('ppjm_santri_logged_out') !== 'true') {
        const { data: signData, error: signErr } = await supabase.auth.signInWithPassword({
          email: 'santri@ppjauharulmaknuun.sch.id',
          password: 'PPJM_SantriMaju2026!',
        });
        if (!signErr && signData?.user) {
          setUserId(signData.user.id);
          setIsAuthenticatedSantri(true);
          await loadSantriDataForUser(signData.user.id, signData.user.email);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[SantriContext] Session init warning:', err);
    }
    setLoading(false);
  }, [loadSantriDataForUser]);

  useEffect(() => {
    initAndAutoLoginSantri();
  }, [initAndAutoLoginSantri]);

  const loginAsSantri = useCallback(
    async (
      email = 'santri@ppjauharulmaknuun.sch.id',
      password = 'PPJM_SantriMaju2026!'
    ): Promise<{ ok: boolean; error?: string }> => {
      setLoading(true);
      localStorage.removeItem('ppjm_santri_logged_out');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error || !data.user) {
          setLoading(false);
          return { ok: false, error: error?.message || 'Gagal masuk ke Portal Santri' };
        }
        setUserId(data.user.id);
        setIsAuthenticatedSantri(true);
        await loadSantriDataForUser(data.user.id, data.user.email);
        setLoading(false);
        showToast('Assalamu’alaikum!', `Selamat datang kembali, ${data.user.email}`);
        return { ok: true };
      } catch (err: any) {
        setLoading(false);
        return { ok: false, error: err?.message || 'Terjadi kesalahan jaringan' };
      }
    },
    [loadSantriDataForUser, showToast]
  );

  const logoutSantri = useCallback(async () => {
    localStorage.setItem('ppjm_santri_logged_out', 'true');
    await supabase.auth.signOut();
    setUserId(null);
    setIsAuthenticatedSantri(false);
    showToast('Berhasil Keluar', 'Sesi Portal Santri telah diakhiri.', 'info');
  }, [showToast]);

  const refreshAll = useCallback(async () => {
    if (userId) {
      await loadSantriDataForUser(userId, profile.email);
    }
  }, [userId, profile.email, loadSantriDataForUser]);

  const updateSantriProfile = useCallback(
    async (patch: Partial<SantriProfile>): Promise<{ ok: boolean; error?: string }> => {
      const targetId = userId || profile.id;
      const updated = {
        ...profile,
        ...patch,
        id: targetId,
        role: 'santri',
        updated_at: new Date().toISOString(),
      };

      setProfile(updated);

      if (!isSupabaseConfigured() || !userId) {
        showToast('Profil Tersimpan', 'Data profil santri berhasil diperbarui.');
        return { ok: true };
      }

      const { data, error } = await (supabase as any)
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: updated.full_name,
            email: updated.email,
            nis: updated.nis,
            kelas: updated.kelas,
            angkatan: updated.angkatan,
            kamar_asrama: updated.kamar_asrama,
            wali_santri: updated.wali_santri,
            no_wa_wali: updated.no_wa_wali || '',
            hafalan_juz: Number(updated.hafalan_juz) || 0,
            foto_url: updated.foto_url,
            bio: updated.bio,
            role: 'santri',
            updated_at: updated.updated_at,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        showToast('Gagal Menyimpan Profil', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) setProfile(data as SantriProfile);
      showToast('Alhamdulillah, Profil Diperbarui!', 'Perubahan profil santri telah tersimpan di database.');
      return { ok: true };
    },
    [userId, profile, showToast]
  );

  const saveTugasSubmission = useCallback(
    async (
      tugasId: string,
      payload: {
        jawaban_text: any;
        file_url: string[];
        status: 'draft' | 'dikumpulkan';
      }
    ): Promise<{ ok: boolean; error?: string; submission?: TugasSubmission }> => {
      const targetSantriId = userId || profile.id;
      const existing = submissionsMap[tugasId];

      if (existing && existing.status === 'dinilai') {
        showToast('Tugas Sudah Dinilai', 'Tugas yang sudah dinilai guru tidak dapat diubah kembali.', 'error');
        return { ok: false, error: 'Tugas sudah dinilai' };
      }

      const nowIso = new Date().toISOString();
      const rowPayload = {
        ...(existing?.id ? { id: existing.id } : {}),
        tugas_id: tugasId,
        santri_id: targetSantriId,
        jawaban_text: payload.jawaban_text,
        file_url: payload.file_url,
        status: payload.status,
        submitted_at: payload.status === 'dikumpulkan' ? nowIso : existing?.submitted_at || nowIso,
        updated_at: nowIso,
      };

      if (!isSupabaseConfigured() || !userId) {
        const mockSub: TugasSubmission = {
          id: existing?.id || `local-${Date.now()}`,
          tugas_id: tugasId,
          santri_id: targetSantriId,
          jawaban_text: payload.jawaban_text,
          file_url: payload.file_url,
          status: payload.status,
          nilai: existing?.nilai ?? null,
          feedback: existing?.feedback ?? null,
          submitted_at: rowPayload.submitted_at,
          updated_at: nowIso,
        };
        setSubmissionsMap((prev) => ({ ...prev, [tugasId]: mockSub }));
        showToast(
          payload.status === 'dikumpulkan' ? 'Tugas Berhasil Dikumpulkan!' : 'Draft Jawaban Tersimpan',
          payload.status === 'dikumpulkan'
            ? 'Jawaban tugas Anda telah dikirim kepada Ustadz/Ustadzah pengampu.'
            : 'Anda masih dapat melanjutkan dan memperbarui jawaban sebelum batas waktu.'
        );
        return { ok: true, submission: mockSub };
      }

      const { data, error } = await (supabase as any)
        .from('tugas_submission')
        .upsert(rowPayload, { onConflict: 'tugas_id,santri_id' })
        .select()
        .single();

      if (error) {
        showToast('Gagal Menyimpan Tugas', error.message, 'error');
        return { ok: false, error: error.message };
      }

      const saved = data as TugasSubmission;
      setSubmissionsMap((prev) => ({ ...prev, [tugasId]: saved }));
      showToast(
        payload.status === 'dikumpulkan' ? 'Alhamdulillah, Tugas Dikumpulkan!' : 'Draft Jawaban Tersimpan',
        payload.status === 'dikumpulkan'
          ? 'Jawaban tugas berhasil dikirim dan tercatat di sistem.'
          : 'Draft berhasil disimpan. Anda dapat memperbaruinya kapan saja sebelum dinilai.'
      );
      return { ok: true, submission: saved };
    },
    [userId, profile.id, submissionsMap, showToast]
  );

  const addHafalanSetoran = useCallback(
    async (payload: {
      surah: string;
      ayat_dari: number;
      ayat_sampai: number;
      juz: number;
      status: 'lancar' | 'kurang' | 'ulang';
      penyimak_nama?: string;
      catatan?: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      const targetSantriId = userId || profile.id;
      const newRow = {
        santri_id: targetSantriId,
        surah: payload.surah,
        ayat_dari: Number(payload.ayat_dari) || 1,
        ayat_sampai: Number(payload.ayat_sampai) || 10,
        juz: Number(payload.juz) || 30,
        status: payload.status,
        penyimak_nama: payload.penyimak_nama || 'Ustadz Fadly, S.Pd.',
        catatan: payload.catatan || '',
        tanggal: new Date().toISOString(),
      };

      if (!isSupabaseConfigured() || !userId) {
        const mockRow: HafalanSetoranItem = {
          id: `haf-${Date.now()}`,
          penyimak: null,
          ...newRow,
        };
        setHafalanList((prev) => [mockRow, ...prev]);
        showToast('Setoran Hafalan Tercatat!', `Surah ${payload.surah} ayat ${payload.ayat_dari}–${payload.ayat_sampai}`);
        return { ok: true };
      }

      const { data, error } = await (supabase as any)
        .from('hafalan_setoran')
        .insert(newRow)
        .select()
        .single();

      if (error) {
        showToast('Gagal Mencatat Setoran', error.message, 'error');
        return { ok: false, error: error.message };
      }

      if (data) {
        setHafalanList((prev) => [data as HafalanSetoranItem, ...prev]);
      }
      showToast('Setoran Hafalan Tercatat!', `Surah ${payload.surah} ayat ${payload.ayat_dari}–${payload.ayat_sampai}`);
      return { ok: true };
    },
    [userId, profile.id, showToast]
  );

  const uploadSantriFile = useCallback(
    async (
      file: File,
      folder: 'avatars' | 'tugas' = 'tugas'
    ): Promise<{ url: string | null; error?: string }> => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${userId || 'santri'}/${folder}/${Date.now()}-${safeName}`;

      try {
        const { error: uploadErr } = await supabase.storage
          .from('santri-uploads')
          .upload(path, file, { upsert: true });

        if (!uploadErr) {
          const { data } = supabase.storage.from('santri-uploads').getPublicUrl(path);
          return { url: data.publicUrl };
        }

        // Fallback to cms-images bucket if needed
        const { error: fallbackErr } = await supabase.storage
          .from('cms-images')
          .upload(path, file, { upsert: true });

        if (!fallbackErr) {
          const { data } = supabase.storage.from('cms-images').getPublicUrl(path);
          return { url: data.publicUrl };
        }

        // Fallback object URL for instant local preview if storage policy blocks unauthenticated demo
        const localUrl = URL.createObjectURL(file);
        return { url: localUrl };
      } catch (err: any) {
        const localUrl = URL.createObjectURL(file);
        return { url: localUrl, error: err?.message };
      }
    },
    [userId]
  );

  return (
    <SantriContext.Provider
      value={{
        userId,
        isAuthenticatedSantri,
        loading,
        profile,
        tugasList,
        submissionsMap,
        performanceList,
        hafalanList,
        toasts,
        showToast,
        dismissToast,
        loginAsSantri,
        logoutSantri,
        refreshAll,
        updateSantriProfile,
        saveTugasSubmission,
        addHafalanSetoran,
        uploadSantriFile,
      }}
    >
      {children}
    </SantriContext.Provider>
  );
};

export const useSantri = () => {
  const ctx = useContext(SantriContext);
  if (!ctx) throw new Error('useSantri must be used inside SantriProvider');
  return ctx;
};

