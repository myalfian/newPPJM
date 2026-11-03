export type StaffRole =
  | 'super_admin'
  | 'admin_yayasan'
  | 'kepala_sekolah'
  | 'guru'
  | 'musyrif'
  | 'staff_ppdb'
  | 'keuangan'
  | 'humas'
  | 'pengurus_konten';

export const STAFF_ROLES: { value: StaffRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin_yayasan', label: 'Admin Yayasan' },
  { value: 'kepala_sekolah', label: 'Kepala Sekolah' },
  { value: 'guru', label: 'Guru' },
  { value: 'musyrif', label: 'Musyrif/Musyrifah' },
  { value: 'staff_ppdb', label: 'Staff PPDB' },
  { value: 'keuangan', label: 'Keuangan' },
  { value: 'humas', label: 'Humas' },
  { value: 'pengurus_konten', label: 'Pengurus Konten (lama)' },
];

export type PermAction = 'view' | 'create' | 'edit' | 'delete' | 'publish';
export const PERM_ACTIONS: { key: PermAction; label: string }[] = [
  { key: 'view', label: 'Lihat' },
  { key: 'create', label: 'Tambah' },
  { key: 'edit', label: 'Ubah' },
  { key: 'delete', label: 'Hapus' },
  { key: 'publish', label: 'Terbitkan' },
];

/** Section yang sudah punya editor. Tambah entri baru di sini saat section lain dimigrasi. */
export const ADMIN_SECTIONS: { key: string; label: string }[] = [
  { key: 'visi_misi', label: 'Profil: Visi, Misi & Tujuan' },
  { key: 'roles', label: 'Pengaturan: Role & Credential' },
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
  if (role === 'super_admin') return true;
  const row = perms.find((p) => p.role === role && p.section === section);
  return Boolean(row && row[colOf(action)]);
}

/** Catatan: ini hanya untuk menyembunyikan UI. Penegakan sebenarnya ada di RLS (has_perm). */

