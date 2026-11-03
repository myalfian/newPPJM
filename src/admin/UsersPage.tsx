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
  NINE_ROLES,
  getRoleMeta,
  normalizeCanonicalRole,
  type CanonicalRole,
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
            {NINE_ROLES.map((r) => {
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

      {/* Users Table */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/80 bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Foto & Nama Lengkap</th>
                  <th className="py-3.5 px-4">Username</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Kelas / Jabatan & Nomor Induk</th>
                  <th className="py-3.5 px-4 text-center">Status Aktif</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {paginatedUsers.map((u) => {
                  const canonical = normalizeCanonicalRole(u.role);
                  const meta = getRoleMeta(canonical);
                  const isActive = u.status_aktif !== false;
                  const uname = u.username || generateUsername(u.full_name || '');

                  return (
                    <tr key={u.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.foto_url ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={u.full_name}
                            className="h-10 w-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate">{u.full_name}</p>
                            <p className="text-xs text-stone-400 truncate">
                              {u.email || `${uname}@ppjauharulmaknuun.sch.id`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <code className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-mono font-semibold text-stone-700">
                          @{uname}
                        </code>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${meta.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                          {meta.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {canonical === 'santri' ? (
                          <div>
                            <p className="text-xs font-bold text-stone-800">
                              Kelas {u.kelas || 'VIII-A Tahfidz'} • {u.asrama_kamar || u.kamar_asrama || 'Asrama Putra'}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              NIS: {u.nis || '-'} • Tahfidz: {u.hafalan_juz ?? 0} Juz
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-bold text-stone-800">
                              {u.jabatan || meta.label}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              NIP: {u.nip || '-'}
                              {u.mapel_ampu && u.mapel_ampu.length > 0
                                ? ` • ${u.mapel_ampu.slice(0, 2).join(', ')}`
                                : ''}
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setConfirmToggleUser(u)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isActive ? 'bg-emerald-600' : 'bg-stone-400'
                            }`}
                          />
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/profile/${canonical}/${u.id}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 px-2.5 py-1.5 text-xs font-bold text-stone-700 transition"
                            title="Lihat Profile"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#115E59]" />
                            Lihat
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700 transition"
                            title="Edit Profile"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openCredentialModal(u)}
                            className="inline-flex items-center gap-1 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 px-2.5 py-1.5 text-xs font-bold text-[#115E59] transition"
                            title="Bagi Credential / Generate Password"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            Credential
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmToggleUser(u)}
                            className="p-1.5 rounded-xl border border-stone-200 hover:bg-rose-50 hover:text-rose-700 text-stone-500 transition"
                            title={isActive ? 'Nonaktifkan User' : 'Aktifkan User'}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-200 bg-[#FAF8F5] px-6 py-4">
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
                className="rounded-xl border border-stone-200 bg-white p-1.5 text-stone-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Step 1: Pilih Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  1. Pilih Role Pengguna (9 Role)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NINE_ROLES.map((r) => {
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50"
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

