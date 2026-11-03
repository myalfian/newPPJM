import { CRUD_SECTIONS } from './sections';

export type CanonicalRole =
  | 'super_admin'
  | 'yayasan'
  | 'kepsek'
  | 'guru'
  | 'musyrif'
  | 'santri'
  | 'ppdb'
  | 'keuangan'
  | 'humas';

export type StaffRole =
  | CanonicalRole
  | 'admin_yayasan'
  | 'kepala_sekolah'
  | 'staff_ppdb'
  | 'pengurus_konten'
  | 'guru_akademik';

export interface RoleMeta {
  value: CanonicalRole;
  label: string;
  shortLabel: string;
  badgeClass: string;
  dotClass: string;
  defaultRoute: string;
  description: string;
  permissionsSummary: string[];
}

export const NINE_ROLES: RoleMeta[] = [
  {
    value: 'super_admin',
    label: 'Super Admin',
    shortLabel: 'Super Admin',
    badgeClass: 'bg-zinc-900 text-white border-zinc-900',
    dotClass: 'bg-amber-400',
    defaultRoute: '/admin',
    description:
      'Otoritas tertinggi sistem: akses penuh ke seluruh halaman CMS, manajemen seluruh akun di /admin/users, pengaturan matriks izin /admin/roles, serta portal /guru dan /santri.',
    permissionsSummary: [
      'Bypass seluruh RLS (Full CRUD pada profiles, tugas, performance, berita, dan CMS)',
      'Manajemen User & Generate Credential (/admin/users)',
      'Konfigurasi Matriks Permission 9 Role (/admin/roles)',
      'Akses penuh ke Portal Guru (/guru/*) & Portal Santri (/santri/*)',
    ],
  },
  {
    value: 'yayasan',
    label: 'Pengurus Yayasan',
    shortLabel: 'Yayasan',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    dotClass: 'bg-amber-600',
    defaultRoute: '/admin',
    description:
      'Dewan Pembina & Pengurus Yayasan Al Jauharu Al Maknuun: memantau perkembangan akademik, profil guru & santri, capaian prestasi, serta kebijakan kelembagaan.',
    permissionsSummary: [
      'Monitoring profil seluruh Guru, Musyrif, Staf, dan Santri',
      'Akses laporan eksekutif Performance & Tahfidz Santri',
      'Kelola profil kelembagaan, sejarah, dan visi-misi pesantren',
    ],
  },
  {
    value: 'kepsek',
    label: 'Kepala Sekolah',
    shortLabel: 'Kepsek',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dotClass: 'bg-indigo-600',
    defaultRoute: '/guru',
    description:
      'Kepala SMP Plus Jauharul Maknuun: supervisi kegiatan belajar mengajar, evaluasi tugas guru, persetujuan rapor santri, serta manajemen kurikulum.',
    permissionsSummary: [
      'Supervisi penuh Portal Guru (/guru/*) dan evaluasi nilai seluruh kelas',
      'Lihat & edit profil akademik santri dan jadwal mengajar guru',
      'Publikasi pengumuman akademik dan prestasi sekolah',
    ],
  },
  {
    value: 'guru',
    label: 'Guru Pengampu',
    shortLabel: 'Guru',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-600',
    defaultRoute: '/guru',
    description:
      'Guru Mata Pelajaran SMP Plus & Diniyah: hanya mengakses /guru/*, membuat & mengupdate tugas sendiri, menilai submission santri, serta melihat profil akademik santri di kelas ampunya.',
    permissionsSummary: [
      'Akses penuh Portal Guru (/guru, /guru/tugas, /guru/performance)',
      'INSERT/UPDATE tugas milik sendiri (guru_id = auth.uid())',
      'Menilai & memberi feedback pada tugas_submission santri',
      'Lihat profil akademik santri di kelas yang diampu (/profile/santri/[id])',
    ],
  },
  {
    value: 'musyrif',
    label: 'Musyrif / Pembina Asrama',
    shortLabel: 'Musyrif',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotClass: 'bg-teal-600',
    defaultRoute: '/guru',
    description:
      'Pembina Asrama & Penyimak Halaqah Tahfidz: mencatat setoran hafalan Al-Qur\'an, mengevaluasi adab keseharian santri di kamar asrama, dan memantau perkembangan santri.',
    permissionsSummary: [
      'Input & simak setoran hafalan Al-Qur\'an santri (hafalan_setoran)',
      'Input nilai adab & catatan pembinaan asrama pada rapor santri',
      'Lihat profil asrama & wali santri binaannya',
    ],
  },
  {
    value: 'santri',
    label: 'Santri SMP Plus',
    shortLabel: 'Santri',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-600',
    defaultRoute: '/santri',
    description:
      'Pelajar Muslim SMP Plus Jauharul Maknuun: hanya bisa mengakses /santri/* dan /profile milik sendiri, memperbarui biodata, mengumpulkan tugas, serta melihat grafik hasil belajar.',
    permissionsSummary: [
      'Hanya dapat mengakses /santri/* dan /profile miliknya sendiri (id = auth.uid())',
      'Mengirimkan & memperbarui jawaban tugas sebelum dinilai (tugas_submission)',
      'Melihat grafik nilai per mapel, progres Juz Tahfidz, dan catatan musyrif',
    ],
  },
  {
    value: 'ppdb',
    label: 'Panitia SPMB / PPDB',
    shortLabel: 'PPDB',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-600',
    defaultRoute: '/admin/s/spmb_info',
    description:
      'Panitia Penerimaan Santri Baru: mengelola jadwal gelombang pendaftaran, syarat registrasi, kuota asrama, dan layanan konsultasi calon wali santri.',
    permissionsSummary: [
      'Kelola informasi & pengumuman SPMB / PPDB (/admin/s/spmb_info)',
      'Verifikasi data calon santri baru dan penempatan kelas/asrama awal',
      'Update profil staf PPDB di /profile',
    ],
  },
  {
    value: 'keuangan',
    label: 'Bendahara & Keuangan',
    shortLabel: 'Keuangan',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    dotClass: 'bg-cyan-600',
    defaultRoute: '/admin',
    description:
      'Staf Administrasi Keuangan & Syahriyah: mengelola rincian biaya pendidikan, administrasi daftar ulang santri, dan program beasiswa prestasi.',
    permissionsSummary: [
      'Kelola rincian biaya pendidikan & syahriyah pada modul SPMB',
      'Lihat data santri aktif dan informasi kontak wali santri',
      'Update profil staf keuangan di /profile',
    ],
  },
  {
    value: 'humas',
    label: 'Humas & Publikasi',
    shortLabel: 'Humas',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-600',
    defaultRoute: '/admin/s/berita',
    description:
      'Tim Humas, Media & Dokumentasi: menerbitkan berita kegiatan pondok, press release prestasi nasional, agenda bulanan, dan galeri foto/video.',
    permissionsSummary: [
      'Full CRUD & Publish pada Berita, Agenda, Galeri Foto/Video, dan Prestasi',
      'Kelola konten publikasi website utama PP Jauharul Maknuun',
      'Update profil staf Humas di /profile',
    ],
  },
];

export const STAFF_ROLES: { value: StaffRole; label: string }[] = NINE_ROLES.map((r) => ({
  value: r.value,
  label: r.label,
}));

export function normalizeCanonicalRole(raw?: string | null): CanonicalRole {
  const r = (raw || '').toLowerCase().trim();
  if (r === 'super_admin' || r === 'superadmin') return 'super_admin';
  if (r === 'yayasan' || r === 'admin_yayasan') return 'yayasan';
  if (r === 'kepsek' || r === 'kepala_sekolah') return 'kepsek';
  if (r === 'guru' || r === 'guru_akademik') return 'guru';
  if (r === 'musyrif' || r === 'musyrifah') return 'musyrif';
  if (r === 'ppdb' || r === 'staff_ppdb') return 'ppdb';
  if (r === 'keuangan') return 'keuangan';
  if (r === 'humas' || r === 'pengurus_konten') return 'humas';
  return 'santri';
}

export function getRoleMeta(raw?: string | null): RoleMeta {
  const canonical = normalizeCanonicalRole(raw);
  return NINE_ROLES.find((r) => r.value === canonical) || NINE_ROLES[5]; // default santri
}

export type PermAction = 'view' | 'create' | 'edit' | 'delete' | 'publish';
export const PERM_ACTIONS: { key: PermAction; label: string }[] = [
  { key: 'view', label: 'Lihat' },
  { key: 'create', label: 'Tambah' },
  { key: 'edit', label: 'Ubah' },
  { key: 'delete', label: 'Hapus' },
  { key: 'publish', label: 'Terbitkan' },
];

/** Daftar modul / halaman yang diatur pada matriks permission /admin/roles */
export const ADMIN_SECTIONS: { key: string; label: string; category?: string }[] = [
  // Modul Baru: Portal Santri, Portal Guru, Performance & Dynamic Profile
  { key: 'santri_tugas', label: 'Portal Santri: Tugas & Pengumpulan (/santri/tugas)', category: 'Portal & Akademik' },
  { key: 'guru_tugas', label: 'Portal Guru: Buat Tugas & Penilaian (/guru/tugas)', category: 'Portal & Akademik' },
  { key: 'performance', label: 'Evaluasi: Performance & Rapor Hasil Belajar (/performance)', category: 'Portal & Akademik' },
  { key: 'profile', label: 'Sistem: Dynamic Profile Semua Role (/profile)', category: 'Portal & Akademik' },
  { key: 'users', label: 'Manajemen: Kelola Seluruh User (/admin/users)', category: 'Pengaturan & Keamanan' },
  { key: 'roles', label: 'Pengaturan: Matriks Role & Permission (/admin/roles)', category: 'Pengaturan & Keamanan' },
  // Modul CMS Website
  { key: 'visi_misi', label: 'Profil: Visi, Misi & Tujuan', category: 'CMS Website' },
  { key: 'sejarah', label: 'Profil: Sejarah Pesantren', category: 'CMS Website' },
  { key: 'fasilitas', label: 'JM Center: Fasilitas Pondok & Sekolah', category: 'CMS Website' },
  ...CRUD_SECTIONS.map((s) => ({
    key: s.key,
    label: `${s.group}: ${s.label}`,
    category: 'CMS Website',
  })),
];

export type PermRow = {
  role: string;
  section: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_publish: boolean;
};

export const colOf = (a: PermAction) => `can_${a}` as const;

export function can(
  perms: PermRow[],
  role: string | null | undefined,
  section: string,
  action: PermAction,
): boolean {
  if (!role) return false;
  const canonical = normalizeCanonicalRole(role);
  if (canonical === 'super_admin') return true;
  const row = perms.find(
    (p) => (p.role === role || normalizeCanonicalRole(p.role) === canonical) && p.section === section
  );
  return Boolean(row && row[colOf(action)]);
}
