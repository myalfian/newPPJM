import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit3,
  KeyRound,
  Power,
  CheckCircle2,
  X,
  Copy,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { db } from './useAdminSession';
import {
  TEN_ROLES,
  ADMIN_SECTIONS,
  PERM_ACTIONS,
  getRoleMeta,
  normalizeCanonicalRole,
  colOf,
  type CanonicalRole,
  type PermAction,
  type UserPermissionOverride,
} from './permissions';

export interface DynamicProfileRecord {
  id: string;
  full_name: string;
  email: string | null;
  username: string | null;
  role: string;
  nis: string | null;
  nip: string | null;
  kelas: string | null;
  angkatan: string | null;
  asrama_kamar: string | null;
  kamar_asrama: string | null;
  mapel_ampu: string[] | null;
  mapel_diampu: string[] | null;
  kelas_ampu: string[] | null;
  jabatan: string | null;
  status_aktif: boolean | null;
  foto_url: string | null;
  bio: any;
  alamat_lengkap: string | null;
  wa_number: string | null;
  phone: string | null;
  wali_info: {
    nama_ayah?: string;
    nama_ibu?: string;
    kontak_wali?: string;
    pekerjaan?: string;
    hubungan?: string;
  } | null;
  hafalan_juz: number | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

const KELAS_CHOICES = [
  'VII-A Tahfidz',
  'VII-B Sains STEM',
  'VIII-A Tahfidz',
  'VIII-B Sains STEM',
  'IX-A Tahfidz',
  'IX-B Sains STEM',
];

const MAPEL_CHOICES = [
  "Tahfidzul Qur'an",
  'IPA & Robotika STEM',
  'Matematika Olimpiade',
  'Fiqih Madrasah Diniyah',
  'Bahasa Arab (Muhadasah)',
  'Bahasa Inggris',
  'Adab & Akhlak Pesantren',
];

function generateRandomPassword(len = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  return 'PPJM_' + Array.from(buf, (n) => chars[n % chars.length]).join('').slice(0, len - 5);
}

function generateUsername(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join('.') || 'user.ppjm'
  );
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<DynamicProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | CanonicalRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Toast
  const [toast, setToast] = useState<{ title: string; detail?: string } | null>(null);
  const triggerToast = (title: string, detail?: string) => {
    setToast({ title, detail });
    setTimeout(() => setToast(null), 3500);
  };

  // Add / Edit User Modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<DynamicProfileRecord | null>(null);
  const [formRole, setFormRole] = useState<CanonicalRole>('santri');
  const [formFullName, setFormFullName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWa, setFormWa] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formFotoUrl, setFormFotoUrl] = useState('');
  const [formStatusAktif, setFormStatusAktif] = useState(true);

  // Santri specific fields
  const [formNis, setFormNis] = useState('');
  const [formKelas, setFormKelas] = useState('VIII-A Tahfidz');
  const [formAngkatan, setFormAngkatan] = useState('2025/2026');
  const [formAsramaKamar, setFormAsramaKamar] = useState('Al-Ghazali 04');
  const [formHafalanJuz, setFormHafalanJuz] = useState(5);
  const [formNamaAyah, setFormNamaAyah] = useState('');
  const [formNamaIbu, setFormNamaIbu] = useState('');
  const [formKontakWali, setFormKontakWali] = useState('');

  // Guru / Musyrif / Admin specific fields
  const [formNip, setFormNip] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formMapelAmpu, setFormMapelAmpu] = useState<string[]>(["Tahfidzul Qur'an"]);
  const [formKelasAmpu, setFormKelasAmpu] = useState<string[]>(['VIII-A Tahfidz']);
  const [savingUser, setSavingUser] = useState(false);

  // Bagi Credential Modal
  const [credUser, setCredUser] = useState<DynamicProfileRecord | null>(null);
  const [credPassword, setCredPassword] = useState('');
  const [credGenerating, setCredGenerating] = useState(false);
  const [credSaved, setCredSaved] = useState(false);

  // Confirm Deactivate Dialog
  const [confirmToggleUser, setConfirmToggleUser] = useState<DynamicProfileRecord | null>(null);

  // User Permission Override Modal (Level 2 Dynamic Mapping)
  const [overrideUser, setOverrideUser] = useState<DynamicProfileRecord | null>(null);
  const [userOverrides, setUserOverrides] = useState<UserPermissionOverride[]>([]);
  const [loadingOverrides, setLoadingOverrides] = useState(false);
  const [savingOverrideKey, setSavingOverrideKey] = useState<string | null>(null);

  const openOverrideModal = async (u: DynamicProfileRecord) => {
    setOverrideUser(u);
    setLoadingOverrides(true);
    const { data, error } = await db
      .from('user_permission_overrides')
      .select('*')
      .eq('user_id', u.id);

    if (!error && data) {
      setUserOverrides(data as UserPermissionOverride[]);
    } else {
      setUserOverrides([]);
    }
    setLoadingOverrides(false);
  };

  const handleToggleOverride = async (section: string, action: PermAction, currentVal: boolean | null | undefined) => {
    if (!overrideUser) return;
    const cellKey = `${section}:${action}`;
    setSavingOverrideKey(cellKey);

    // Tri-state cycle: null (Inherit Role) -> true (Allow) -> false (Deny) -> null (Inherit)
    let nextVal: boolean | null = true;
    if (currentVal === true) nextVal = false;
    else if (currentVal === false) nextVal = null;
    else nextVal = true;

    const existing = userOverrides.find((o) => o.section === section);
    const updatedRow: Record<string, any> = {
      user_id: overrideUser.id,
      section,
      can_view: existing?.can_view ?? null,
      can_create: existing?.can_create ?? null,
      can_edit: existing?.can_edit ?? null,
      can_delete: existing?.can_delete ?? null,
      can_publish: existing?.can_publish ?? null,
      [colOf(action)]: nextVal,
      updated_at: new Date().toISOString(),
    };

    const { error } = await db
      .from('user_permission_overrides')
      .upsert(updatedRow, { onConflict: 'user_id,section' });

    setSavingOverrideKey(null);

    if (error) {
      triggerToast('Gagal Menyimpan Izin Khusus', error.message);
      return;
    }

    setUserOverrides((prev) => {
      const idx = prev.findIndex((o) => o.section === section);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [colOf(action)]: nextVal };
        return copy;
      }
      return [...prev, updatedRow as UserPermissionOverride];
    });

    const statusLabel = nextVal === true ? 'Diizinkan (Force Allow)' : nextVal === false ? 'Ditolak (Force Deny)' : 'Ikuti Role (Default)';
    triggerToast('Izin Khusus Diperbarui', `${section} [${action.toUpperCase()}] disetel: ${statusLabel}`);
  };

  const handleResetUserOverrides = async () => {
    if (!overrideUser) return;
    const { error } = await db
      .from('user_permission_overrides')
      .delete()
      .eq('user_id', overrideUser.id);

    if (!error) {
      setUserOverrides([]);
      triggerToast('Izin Khusus Direset', `Seluruh izin ${overrideUser.full_name} kini mengikuti role aslinya.`);
    } else {
      triggerToast('Gagal Mereset', error.message);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data as DynamicProfileRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const canonical = normalizeCanonicalRole(u.role);
      const matchRole = roleFilter === 'all' || canonical === roleFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.nis || '').toLowerCase().includes(q) ||
        (u.nip || '').toLowerCase().includes(q) ||
        (u.kelas || '').toLowerCase().includes(q) ||
        (u.jabatan || '').toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, searchQuery]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormRole('santri');
    setFormFullName('');
    setFormUsername('');
    setFormEmail('');
    setFormWa('0821-3160-6535');
    setFormAlamat('Jl. Raya Dukun-Lasem RT 01 RW 01 Kec. Sidayu Kab. Gresik');
    setFormFotoUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80');
    setFormStatusAktif(true);
    setFormNis('2026080' + Math.floor(10 + Math.random() * 89));
    setFormKelas('VIII-A Tahfidz');
    setFormAngkatan('2025/2026');
    setFormAsramaKamar('Al-Ghazali 04');
    setFormHafalanJuz(5);
    setFormNamaAyah('');
    setFormNamaIbu('');
    setFormKontakWali('');
    setFormNip('19920101-202201-1-0' + Math.floor(10 + Math.random() * 89));
    setFormJabatan('Guru Pengampu SMP Plus');
    setFormMapelAmpu(["Tahfidzul Qur'an", 'IPA & Robotika STEM']);
    setFormKelasAmpu(['VIII-A Tahfidz']);
    setShowFormModal(true);
  };

  const openEditModal = (u: DynamicProfileRecord) => {
    const canonical = normalizeCanonicalRole(u.role);
    setEditingUser(u);
    setFormRole(canonical);
    setFormFullName(u.full_name || '');
    setFormUsername(u.username || generateUsername(u.full_name || ''));
    setFormEmail(u.email || '');
    setFormWa(u.wa_number || u.phone || '');
    setFormAlamat(u.alamat_lengkap || '');
    setFormFotoUrl(u.foto_url || '');
    setFormStatusAktif(u.status_aktif !== false);
    setFormNis(u.nis || '');
    setFormKelas(u.kelas || 'VIII-A Tahfidz');
    setFormAngkatan(u.angkatan || '2025/2026');
    setFormAsramaKamar(u.asrama_kamar || u.kamar_asrama || '');
    setFormHafalanJuz(u.hafalan_juz ?? 5);
    setFormNamaAyah(u.wali_info?.nama_ayah || '');
    setFormNamaIbu(u.wali_info?.nama_ibu || '');
    setFormKontakWali(u.wali_info?.kontak_wali || '');
    setFormNip(u.nip || '');
    setFormJabatan(u.jabatan || '');
    setFormMapelAmpu(u.mapel_ampu?.length ? u.mapel_ampu : u.mapel_diampu || []);
    setFormKelasAmpu(u.kelas_ampu?.length ? u.kelas_ampu : ['VIII-A Tahfidz']);
    setShowFormModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim()) return;
    setSavingUser(true);

    const computedUsername = formUsername.trim() || generateUsername(formFullName);
    const computedEmail = formEmail.trim() || `${computedUsername}@ppjauharulmaknuun.sch.id`;
    const isSantri = formRole === 'santri';
    const isGuruOrMusyrif = formRole === 'guru' || formRole === 'musyrif';

    const { error } = await db.rpc('admin_upsert_user_account', {
      p_id: editingUser?.id ?? null,
      p_email: computedEmail,
      p_password: editingUser ? null : generateRandomPassword(),
      p_full_name: formFullName.trim(),
      p_username: computedUsername,
      p_role: formRole,
      p_nis: isSantri ? formNis.trim() : null,
      p_nip: !isSantri ? formNip.trim() : null,
      p_kelas: isSantri ? formKelas : null,
      p_angkatan: isSantri ? formAngkatan : null,
      p_asrama_kamar: isSantri || formRole === 'musyrif' ? formAsramaKamar : null,
      p_mapel_ampu: isGuruOrMusyrif ? formMapelAmpu : [],
      p_kelas_ampu: isGuruOrMusyrif ? formKelasAmpu : [],
      p_jabatan: isSantri ? `Santri Kelas ${formKelas}` : formJabatan || getRoleMeta(formRole).label,
      p_status_aktif: formStatusAktif,
      p_foto_url: formFotoUrl.trim() || null,
      p_bio: editingUser?.bio ?? null,
      p_alamat_lengkap: formAlamat.trim() || null,
      p_wa_number: formWa.trim() || null,
      p_wali_info: isSantri
        ? {
            nama_ayah: formNamaAyah.trim() || 'Wali Santri',
            nama_ibu: formNamaIbu.trim() || '-',
            kontak_wali: formKontakWali.trim() || formWa.trim(),
            hubungan: 'Orang Tua Kandung',
          }
        : null,
      p_hafalan_juz: isSantri ? Number(formHafalanJuz) || 1 : 5,
    });

    setSavingUser(false);
    if (error) {
      triggerToast('Gagal Menyimpan User', error.message);
      return;
    }

    setShowFormModal(false);
    await fetchUsers();
    triggerToast(
      editingUser ? 'Profil User Diperbarui' : 'User Baru Berhasil Ditambahkan',
      `${formFullName} (${getRoleMeta(formRole).label}) telah tersimpan di database.`
    );
  };

  const handleConfirmToggleStatus = async () => {
    if (!confirmToggleUser) return;

    // Hardening: Protect last active Super Admin
    if (normalizeCanonicalRole(confirmToggleUser.role) === 'super_admin' && confirmToggleUser.status_aktif !== false) {
      const activeAdmins = users.filter(
        (u) => normalizeCanonicalRole(u.role) === 'super_admin' && u.status_aktif !== false
      );
      if (activeAdmins.length <= 1) {
        triggerToast('Aksi Ditolak', 'Tidak dapat menonaktifkan Super Admin terakhir!');
        setConfirmToggleUser(null);
        return;
      }
    }

    const nextStatus = confirmToggleUser.status_aktif === false ? true : false;
    const { error } = await db
      .from('profiles')
      .update({ status_aktif: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', confirmToggleUser.id);

    const targetName = confirmToggleUser.full_name;
    setConfirmToggleUser(null);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === confirmToggleUser.id ? { ...u, status_aktif: nextStatus } : u))
      );
      triggerToast(
        nextStatus ? 'Akun Diaktifkan Kembali' : 'Akun Dinonaktifkan',
        `Status aktif ${targetName} berhasil diubah.`
      );
    } else {
      triggerToast('Gagal Mengubah Status', error.message);
    }
  };

  const openCredentialModal = (u: DynamicProfileRecord) => {
    setCredUser(u);
    setCredPassword(generateRandomPassword(12));
    setCredSaved(false);
  };

  const handleSaveGeneratedCredential = async () => {
    if (!credUser) return;
    setCredGenerating(true);
    const uname = credUser.username || generateUsername(credUser.full_name);
    const email = credUser.email || `${uname}@ppjauharulmaknuun.sch.id`;

    await db.rpc('admin_upsert_user_account', {
      p_id: credUser.id,
      p_email: email,
      p_password: credPassword,
      p_full_name: credUser.full_name,
      p_username: uname,
      p_role: normalizeCanonicalRole(credUser.role),
    });

    setCredGenerating(false);
    setCredSaved(true);
    triggerToast('Credential Berhasil Di-reset', `Kata sandi baru untuk ${credUser.full_name} telah aktif.`);
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter((x) => x !== item));
    } else {
      setter([...arr, item]);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl bg-[#115E59] px-4 py-3.5 text-white shadow-xl max-w-sm">
          <CheckCircle2 className="h-5 w-5 text-teal-200 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold">{toast.title}</p>
            {toast.detail && <p className="text-[11px] text-teal-100 mt-0.5">{toast.detail}</p>}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#115E59] border border-teal-200">
            <Users className="h-3.5 w-3.5" />
            Schudio User & Role Directory
          </span>
          <h1 className="mt-2 text-xl sm:text-2xl font-bold text-stone-900">
            Manajemen Seluruh User & Sivitas ({users.length})
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-500">
            Kelola profil Santri, Guru, Musyrif, Super Admin, Yayasan, Kepsek, PPDB, Keuangan, dan Humas dalam satu pusat kendali.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/roles"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 px-3.5 py-2.5 text-xs font-bold text-stone-700 transition"
          >
            <ShieldCheck className="h-4 w-4 text-[#115E59]" />
            Matriks 9 Role
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
          >
            <UserPlus className="h-4 w-4" />
            + Tambah User Baru
          </button>
        </div>
      </div>

      {/* Role Filter Pills & Search */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                roleFilter === 'all'
                  ? 'bg-[#115E59] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/75'
              }`}
            >
              Semua ({users.length})
            </button>
            {TEN_ROLES.map((r) => {
              const count = users.filter((u) => normalizeCanonicalRole(u.role) === r.value).length;
              const isSelected = roleFilter === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRoleFilter(r.value)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isSelected
                      ? 'bg-[#115E59] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/75'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : r.dotClass}`} />
                  {r.shortLabel} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, username, NIS/NIP, kelas..."
              className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] pl-9 pr-3.5 py-2 text-xs text-stone-800 focus:border-[#115E59] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Users Table & Mobile Cards */}
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="h-10 w-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">Tidak Ada User Ditemukan</h3>
            <p className="text-xs text-stone-500">Coba ubah filter role atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet View (Table with guaranteed visibility, sticky actions, zero cutoffs) */}
            <div className="hidden md:block overflow-x-auto relative scrollbar-thin">
              <table className="min-w-[960px] w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200/80 bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <th className="py-3.5 px-3.5 min-w-[210px]">Foto &amp; Nama Lengkap</th>
                    <th className="py-3.5 px-3 min-w-[115px]">Username</th>
                    <th className="py-3.5 px-3 min-w-[125px]">Role</th>
                    <th className="py-3.5 px-3.5 min-w-[195px]">Kelas / Jabatan &amp; Nomor Induk</th>
                    <th className="py-3.5 px-3 text-center min-w-[90px]">Status Aktif</th>
                    <th className="py-3.5 px-3.5 text-right min-w-[230px] sticky right-0 bg-[#FAF8F5] z-10 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {paginatedUsers.map((u) => {
                    const canonical = normalizeCanonicalRole(u.role);
                    const meta = getRoleMeta(canonical);
                    const isActive = u.status_aktif !== false;
                    const uname = u.username || generateUsername(u.full_name || '');

                    return (
                      <tr key={u.id} className="hover:bg-stone-50/70 transition group">
                        <td className="py-3.5 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                u.foto_url ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={u.full_name}
                              className="h-9 w-9 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-stone-900 leading-snug break-words text-xs sm:text-sm" title={u.full_name}>
                                {u.full_name}
                              </p>
                              <p className="text-[11px] text-stone-400 break-all leading-tight">
                                {u.email || `${uname}@ppjauharulmaknuun.sch.id`}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <code className="rounded-lg bg-stone-100 px-2 py-0.5 text-xs font-mono font-semibold text-stone-700 whitespace-nowrap">
                            @{uname}
                          </code>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${meta.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                            {meta.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-3.5">
                          {canonical === 'santri' ? (
                            <div>
                              <p className="text-xs font-bold text-stone-800 leading-snug">
                                Kelas {u.kelas || 'VIII-A Tahfidz'} • {u.asrama_kamar || u.kamar_asrama || 'Asrama Putra'}
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                <span className="font-mono whitespace-nowrap">NIS: {u.nis || '-'}</span> • Tahfidz: {u.hafalan_juz ?? 0} Juz
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs font-bold text-stone-800 leading-snug">
                                {u.jabatan || meta.label}
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                <span className="font-mono whitespace-nowrap">NIP: {u.nip || '-'}</span>
                                {u.mapel_ampu && u.mapel_ampu.length > 0
                                  ? ` • ${u.mapel_ampu.slice(0, 2).join(', ')}`
                                  : ''}
                              </p>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setConfirmToggleUser(u)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                            }`}
                            title={isActive ? 'Klik untuk nonaktifkan user' : 'Klik untuk aktifkan user'}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isActive ? 'bg-emerald-600' : 'bg-stone-400'
                              }`}
                            />
                            {isActive ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>

                        <td className="py-3.5 px-3.5 text-right sticky right-0 bg-white group-hover:bg-stone-50/70 z-10 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                          <div className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
                            <Link
                              to={`/profile/${canonical}/${u.id}`}
                              className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 px-2.5 py-1.5 text-xs font-bold text-stone-700 transition"
                              title="Lihat Profil Publik User"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#115E59]" />
                              <span className="hidden xl:inline">Lihat</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700 transition cursor-pointer"
                              title="Edit Profil & Data User"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openCredentialModal(u)}
                              className="inline-flex items-center gap-1 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 px-2.5 py-1.5 text-xs font-bold text-[#115E59] transition cursor-pointer"
                              title="Kelola Kredensial & Password Akun"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                              <span>Akses</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openOverrideModal(u)}
                              className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition cursor-pointer"
                              title="Pengaturan Izin Khusus (Override Permissions)"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Izin</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Modern Android Card View (Zero Cutoff on Phones) */}
            <div className="md:hidden divide-y divide-stone-100 p-3 space-y-3">
              {paginatedUsers.map((u) => {
                const canonical = normalizeCanonicalRole(u.role);
                const meta = getRoleMeta(canonical);
                const isActive = u.status_aktif !== false;
                const uname = u.username || generateUsername(u.full_name || '');

                return (
                  <div key={u.id} className="rounded-2xl border border-stone-200/90 bg-white p-3.5 space-y-3 shadow-2xs">
                    {/* Header: Photo + Full Name (No cutoff) + Status */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <img
                          src={
                            u.foto_url ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={u.full_name}
                          className="h-11 w-11 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-sm text-stone-900 leading-snug break-words">
                            {u.full_name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${meta.badgeClass}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                              {meta.label}
                            </span>
                            <code className="text-[10.5px] font-mono text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                              @{uname}
                            </code>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setConfirmToggleUser(u)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </div>

                    {/* Metadata Detail Section */}
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-100 text-xs space-y-1">
                      {canonical === 'santri' ? (
                        <>
                          <div className="flex justify-between text-stone-700">
                            <span className="text-stone-400">Kelas / Kamar:</span>
                            <span className="font-bold">{u.kelas || 'VIII-A Tahfidz'} • {u.asrama_kamar || u.kamar_asrama || 'Asrama'}</span>
                          </div>
                          <div className="flex justify-between text-stone-700">
                            <span className="text-stone-400">NIS &amp; Hafalan:</span>
                            <span className="font-bold">NIS: {u.nis || '-'} | {u.hafalan_juz ?? 0} Juz</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-stone-700">
                            <span className="text-stone-400">Jabatan:</span>
                            <span className="font-bold">{u.jabatan || meta.label}</span>
                          </div>
                          <div className="flex justify-between text-stone-700">
                            <span className="text-stone-400">NIP Yayasan:</span>
                            <span className="font-bold">{u.nip || '-'}</span>
                          </div>
                          {u.mapel_ampu && u.mapel_ampu.length > 0 && (
                            <div className="text-[11px] text-stone-600 pt-0.5 border-t border-stone-200/50">
                              Mapel: <strong>{u.mapel_ampu.join(', ')}</strong>
                            </div>
                          )}
                        </>
                      )}
                      <div className="text-[11px] text-stone-500 pt-0.5 break-all">
                        Email: {u.email || `${uname}@ppjauharulmaknuun.sch.id`}
                      </div>
                    </div>

                    {/* Action Buttons Grid (Full Width, Easy Touch Target) */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <Link
                        to={`/profile/${canonical}/${u.id}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-[#FAF8F5] py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 transition"
                      >
                        <Eye size={14} className="text-[#115E59]" />
                        <span>Lihat Profil</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                      >
                        <Edit3 size={14} className="text-blue-600" />
                        <span>Edit Profil</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openCredentialModal(u)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 py-2 text-xs font-bold text-[#115E59] hover:bg-teal-100 transition cursor-pointer"
                      >
                        <KeyRound size={14} />
                        <span>Credential</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openOverrideModal(u)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <ShieldCheck size={14} />
                        <span>Izin Khusus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 bg-[#FAF8F5] px-5 py-3 text-xs text-stone-500">
          <span>
            Menampilkan <strong>{paginatedUsers.length}</strong> dari <strong>{filteredUsers.length}</strong> user
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-stone-200 bg-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-bold text-stone-700">
              Hal {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-stone-200 bg-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit User Dinamis Sesuai Role */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-stone-200 bg-[#FAF8F5] px-5 sm:px-6 py-3.5 shrink-0">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  {editingUser ? `Edit Profil: ${editingUser.full_name}` : 'Tambah User Baru (Form Dinamis per Role)'}
                </h2>
                <p className="text-xs text-stone-500">
                  Formulir otomatis menyesuaikan field berdasarkan Role yang dipilih.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="rounded-xl border border-stone-200 bg-white p-1.5 text-stone-500 cursor-pointer hover:bg-stone-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* Step 1: Pilih Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  1. Pilih Role Pengguna (10 Role Resmi)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEN_ROLES.map((r) => {
                    const active = formRole === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setFormRole(r.value)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                          active
                            ? 'border-[#115E59] bg-teal-50 text-[#115E59] ring-2 ring-[#115E59]/20'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${r.dotClass}`} />
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Identitas Umum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap *</label>
                  <input
                    required
                    type="text"
                    value={formFullName}
                    onChange={(e) => {
                      setFormFullName(e.target.value);
                      if (!editingUser) setFormUsername(generateUsername(e.target.value));
                    }}
                    placeholder="Contoh: Ahmad Zaki Al-Maknuuni"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-sm font-semibold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Username Login</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="ahmad.zaki"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-sm font-mono text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Otomatis jika dikosongkan"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-sm text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">No. WhatsApp Aktif</label>
                  <input
                    type="text"
                    value={formWa}
                    onChange={(e) => setFormWa(e.target.value)}
                    placeholder="0821-3160-6535"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-sm text-stone-800"
                  />
                </div>
              </div>

              {/* Step 3: Field Dinamis Khusus Role SANTRI */}
              {formRole === 'santri' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Data Akademik, Asrama & Wali Santri
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Induk Santri (NIS) *</label>
                      <input
                        required
                        type="text"
                        value={formNis}
                        onChange={(e) => setFormNis(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Kelas</label>
                      <select
                        value={formKelas}
                        onChange={(e) => setFormKelas(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      >
                        {KELAS_CHOICES.map((k) => (
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
                        value={formAngkatan}
                        onChange={(e) => setFormAngkatan(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Kamar Asrama</label>
                      <input
                        type="text"
                        value={formAsramaKamar}
                        onChange={(e) => setFormAsramaKamar(e.target.value)}
                        placeholder="Al-Ghazali 04"
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Capaian Hafalan (Juz)</label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={formHafalanJuz}
                        onChange={(e) => setFormHafalanJuz(Number(e.target.value))}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">No. WA Wali Santri</label>
                      <input
                        type="text"
                        value={formKontakWali}
                        onChange={(e) => setFormKontakWali(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nama Ayah Kandung</label>
                      <input
                        type="text"
                        value={formNamaAyah}
                        onChange={(e) => setFormNamaAyah(e.target.value)}
                        placeholder="H. Abdullah..."
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nama Ibu Kandung</label>
                      <input
                        type="text"
                        value={formNamaIbu}
                        onChange={(e) => setFormNamaIbu(e.target.value)}
                        placeholder="Hj. Siti Aminah..."
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3B: Field Dinamis Khusus Role GURU / MUSYRIF */}
              {(formRole === 'guru' || formRole === 'musyrif') && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Data Kepegawaian Guru / Musyrif & Kelas Ampu
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">NIP / NIY Yayasan *</label>
                      <input
                        type="text"
                        value={formNip}
                        onChange={(e) => setFormNip(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan Akademik / Asrama</label>
                      <input
                        type="text"
                        value={formJabatan}
                        onChange={(e) => setFormJabatan(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Mata Pelajaran yang Diampu (Multi-select)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {MAPEL_CHOICES.map((m) => {
                        const selected = formMapelAmpu.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => toggleArrayItem(formMapelAmpu, m, setFormMapelAmpu)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              selected
                                ? 'bg-[#115E59] text-white'
                                : 'bg-white border border-stone-200 text-stone-600'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Kelas yang Diampu (Akses Lihat Profil Santri)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {KELAS_CHOICES.map((k) => {
                        const selected = formKelasAmpu.includes(k);
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => toggleArrayItem(formKelasAmpu, k, setFormKelasAmpu)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              selected
                                ? 'bg-blue-700 text-white'
                                : 'bg-white border border-stone-200 text-stone-600'
                            }`}
                          >
                            {k}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3C: Field Dinamis Khusus Pimpinan & Staf */}
              {formRole !== 'santri' && formRole !== 'guru' && formRole !== 'musyrif' && (
                <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">NIP / NIY Pejabat</label>
                    <input
                      type="text"
                      value={formNip}
                      onChange={(e) => setFormNip(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan Struktural</label>
                    <input
                      type="text"
                      value={formJabatan}
                      onChange={(e) => setFormJabatan(e.target.value)}
                      placeholder={getRoleMeta(formRole).label}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Alamat & Foto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={formAlamat}
                    onChange={(e) => setFormAlamat(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">URL Foto Profil</label>
                  <input
                    type="url"
                    value={formFotoUrl}
                    onChange={(e) => setFormFotoUrl(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 bg-white flex items-center justify-end gap-2 pt-3 border-t border-stone-200/80 p-4 sm:p-5 shrink-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {savingUser ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Buat User Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bagi Credential (Generate Password) */}
      {credUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#115E59]" />
                <h2 className="text-base font-bold text-stone-900">Bagi Credential Login</h2>
              </div>
              <button
                type="button"
                onClick={() => setCredUser(null)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Generate kata sandi baru untuk <strong>{credUser.full_name}</strong> ({getRoleMeta(credUser.role).label}).
            </p>

            <div className="rounded-2xl border border-teal-900/15 bg-[#FAF8F5] p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Username:</span>
                <strong className="text-stone-900">
                  {credUser.username || generateUsername(credUser.full_name)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Email Login:</span>
                <strong className="text-stone-900">
                  {credUser.email || `${generateUsername(credUser.full_name)}@ppjauharulmaknuun.sch.id`}
                </strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200/70">
                <span className="text-stone-500">Password Baru:</span>
                <div className="flex items-center gap-1.5">
                  <strong className="text-[#115E59] text-sm">{credPassword}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      setCredPassword(generateRandomPassword(12));
                      setCredSaved(false);
                    }}
                    className="p-1 rounded hover:bg-stone-200 text-stone-600"
                    title="Acak ulang password"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const text = `Akun Portal PP Jauharul Maknuun\nNama: ${credUser.full_name}\nRole: ${getRoleMeta(credUser.role).label}\nEmail: ${credUser.email}\nPassword: ${credPassword}`;
                  navigator.clipboard.writeText(text);
                  triggerToast('Credential Disalin ke Clipboard');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-700"
              >
                <Copy className="h-3.5 w-3.5 text-[#115E59]" />
                Salin Teks WA
              </button>

              <button
                type="button"
                disabled={credGenerating}
                onClick={handleSaveGeneratedCredential}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {credGenerating
                  ? 'Mengaktifkan...'
                  : credSaved
                  ? 'Password Telah Aktif'
                  : 'Aktifkan Password Ini'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Izin Khusus User (User Permission Override - Level 2 Dynamic Mapping) */}
      {overrideUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="my-8 w-full max-w-4xl rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 bg-[#FAF8F5] px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={overrideUser.foto_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                  alt={overrideUser.full_name}
                  className="h-10 w-10 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">{overrideUser.full_name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[11px] font-bold ${
                        getRoleMeta(overrideUser.role).badgeClass
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${getRoleMeta(overrideUser.role).dotClass}`} />
                      Role: {getRoleMeta(overrideUser.role).label}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Konfigurasi Izin Khusus (User-Level Override). Mengesampingkan aturan izin role bawaan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOverrideUser(null)}
                className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Instruction banner */}
            <div className="bg-teal-50/70 border-b border-teal-100 px-6 py-3 shrink-0 flex items-center justify-between text-xs text-[#115E59]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#115E59]" />
                <span>
                  <strong>Panduan Override:</strong> Klik tombol izin untuk beralih status:{' '}
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Diizinkan (Allow)</span> →{' '}
                  <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">Ditolak (Deny)</span> →{' '}
                  <span className="font-bold text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">Ikuti Role (Default)</span>
                </span>
              </div>
              {userOverrides.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetUserOverrides}
                  className="rounded-lg bg-white border border-stone-200 hover:bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 transition shrink-0"
                >
                  Reset Semua Izin Khusus
                </button>
              )}
            </div>

            {/* Matrix Table */}
            <div className="p-4 sm:p-6 overflow-y-auto grow">
              {loadingOverrides ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#115E59] mb-2" />
                  Memuat data izin khusus dari database...
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="min-w-[700px] w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-[#FAF8F5] text-left text-xs text-stone-500">
                        <th className="py-2.5 px-3 font-bold min-w-[200px]">Modul / Fitur</th>
                        <th className="py-2.5 px-3 font-bold min-w-[140px]">Kategori</th>
                        {PERM_ACTIONS.slice(0, 5).map((a) => (
                          <th key={a.key} className="py-2.5 px-2 text-center font-bold min-w-[75px]">
                            {a.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {ADMIN_SECTIONS.map((sec) => {
                        const override = userOverrides.find((o) => o.section === sec.key);
                        return (
                          <tr key={sec.key} className="hover:bg-stone-50/60 transition">
                            <td className="py-2.5 px-3">
                              <p className="font-bold text-xs text-stone-800">{sec.label}</p>
                              <code className="text-[10px] font-mono text-stone-400">{sec.key}</code>
                            </td>
                            <td className="py-2.5 px-3 text-xs text-stone-500">
                              {sec.category || 'Modul Sistem'}
                            </td>
                            {PERM_ACTIONS.slice(0, 5).map((a) => {
                              const val = override ? (override as any)[colOf(a.key)] : null;
                              const isBusy = savingOverrideKey === `${sec.key}:${a.key}`;
                              return (
                                <td key={a.key} className="py-2.5 px-2 text-center">
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => handleToggleOverride(sec.key, a.key, val)}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                      val === true
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                        : val === false
                                        ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                                        : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                                    }`}
                                    title={`Status: ${val === true ? 'Force Allow' : val === false ? 'Force Deny' : 'Ikuti Role'}`}
                                  >
                                    {isBusy ? (
                                      <RefreshCw className="h-3 w-3 animate-spin mx-auto" />
                                    ) : val === true ? (
                                      'ALLOW'
                                    ) : val === false ? (
                                      'DENY'
                                    ) : (
                                      'DEFAULT'
                                    )}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-stone-200 bg-[#FAF8F5] px-6 py-3.5 shrink-0">
              <span className="text-xs text-stone-500">
                Total Override Aktif: <strong>{userOverrides.length}</strong> modul
              </span>
              <button
                type="button"
                onClick={() => setOverrideUser(null)}
                className="rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog Nonaktifkan / Aktifkan */}
      {confirmToggleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {confirmToggleUser.status_aktif === false ? 'Aktifkan Kembali User?' : 'Nonaktifkan User Ini?'}
                </h3>
                <p className="text-xs text-stone-500">{confirmToggleUser.full_name}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {confirmToggleUser.status_aktif === false
                ? 'Akun ini akan dapat kembali login dan mengakses portal sesuai rolenya.'
                : 'Akun yang dinonaktifkan tidak dapat mengakses portal internal sampai diaktifkan kembali oleh Admin.'}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmToggleUser(null)}
                className="rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-bold text-stone-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white ${
                  confirmToggleUser.status_aktif === false
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Ya, {confirmToggleUser.status_aktif === false ? 'Aktifkan' : 'Nonaktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

