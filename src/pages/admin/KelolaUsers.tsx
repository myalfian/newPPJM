import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  UserCheck,
  History,
  Lock,
  UploadCloud,
  X,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  Building,
  AlertTriangle,
  Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured, UserRole, normalizeRole, AdminProfile } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { sanitizeText } from '../../utils/sanitize';
import { compressImageToWebP } from '../../lib/imageCompressor';

export interface AdminUserItem {
  id: string;
  email: string;
  full_name: string;
  role: string;
  nip?: string;
  phone?: string;
  bio?: string;
  motto?: string;
  avatar_url?: string;
  class?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  last_login_at?: string;
}

export interface AuditLogItem {
  id: string;
  user_id: string;
  email?: string;
  role?: string;
  action: string;
  module?: string;
  section_id?: string;
  new_data?: any;
  created_at: string;
}

const WEAK_PASSWORDS = [
  '123456',
  '12345678',
  '123456789',
  'password',
  'password123',
  'admin123',
  'ppjm123',
  'santri123',
  'bismillah',
  'jauharul',
  'maknuun',
  'pesantren'
];

export const KelolaUsers: React.FC = () => {
  const { user: currentAuthUser, role: currentRole, isSuperAdmin, switchMockRole } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'role'>('newest');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPwModalOpen, setIsResetPwModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

  // Audit Logs Data
  const [userAuditLogs, setUserAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);

  // Add Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<string>('guru_akademik');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [formAutoGeneratePw, setFormAutoGeneratePw] = useState(false);
  const [formSendInviteEmail, setFormSendInviteEmail] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formClass, setFormClass] = useState('7A');
  const [formMotto, setFormMotto] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formCompressing, setFormCompressing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPw, setCopiedPw] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editClass, setEditClass] = useState('');
  const [editMotto, setEditMotto] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Reset Password State
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Delete User Confirmation State
  const [deleteEmailConfirm, setDeleteEmailConfirm] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Fetch Users List
  const fetchUsers = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        showToast('Gagal memuat daftar administrator: ' + error.message, 'error');
        return;
      }

      if (data) {
        const mapped: AdminUserItem[] = data.map((row: any) => ({
          id: row.id,
          email: row.email || `${row.role}@ppjauharulmaknuun.sch.id`,
          full_name: row.full_name || 'Tanpa Nama',
          role: row.role || 'user',
          nip: row.nip || row.nis_or_nip || '-',
          phone: row.phone || '-',
          bio: row.bio || '',
          motto: row.motto || '',
          avatar_url: row.avatar_url || '',
          class: row.class || '',
          is_active: row.is_active !== false,
          created_by: row.created_by,
          created_at: row.created_at || new Date().toISOString(),
          last_login_at: row.last_login_at
        }));
        setUsers(mapped);
      }
    } catch (err: any) {
      showToast('Kendala mengambil data: ' + (err?.message || 'Error koneksi'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Fetch User Audit Logs
  const fetchAuditLogs = async (userId: string) => {
    setLoadingAuditLogs(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .or(`user_id.eq.${userId},section_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setUserAuditLogs(data as AuditLogItem[]);
      } else {
        setUserAuditLogs([]);
      }
    } catch {
      setUserAuditLogs([]);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  // Password Generator (12 chars: uppercase, lowercase, numbers, symbols)
  const generateStrongPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(res);
    setFormConfirmPassword(res);
    setCopiedPw(false);
  };

  // Password Strength Calculation (0 - 4)
  const calculatePasswordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (WEAK_PASSWORDS.includes(pw.toLowerCase())) return 1;
    return score;
  };

  const pwStrength = useMemo(() => calculatePasswordStrength(formPassword), [formPassword]);

  // Handle Avatar Upload with WebP Auto-Compressor
  const handleAvatarFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }
    setFormCompressing(true);
    try {
      const res = await compressImageToWebP(file, 400, 400, 0.85);
      setFormAvatar(res.dataUrl);
    } catch (err: any) {
      alert('Gagal mengompresi gambar: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setFormCompressing(false);
    }
  };

  // 3. Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSuperAdmin && currentRole !== 'super_admin') {
      showToast('Akses ditolak: Hanya Super Admin yang berhak menambahkan pengguna baru.', 'error');
      return;
    }

    const cleanName = sanitizeText(formName).trim();
    const cleanEmail = formEmail.trim().toLowerCase();

    if (!cleanName) {
      showToast('Nama lengkap wajib diisi.', 'error');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Format email tidak valid.', 'error');
      return;
    }

    if (formPassword.length < 8) {
      showToast('Kata sandi minimal 8 karakter.', 'error');
      return;
    }

    if (formPassword !== formConfirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }

    if (WEAK_PASSWORDS.includes(formPassword.toLowerCase())) {
      showToast('Kata sandi terlalu umum/mudah ditebak. Gunakan kombinasi yang lebih kuat.', 'error');
      return;
    }

    // Role safety check: only super_admin can create another super_admin
    if (formRole === 'super_admin' && !isSuperAdmin && currentRole !== 'super_admin') {
      showToast('Peringatan Keamanan: Anda tidak memiliki wewenang membuat akun Super Admin!', 'error');
      return;
    }

    setActionLoading(true);

    try {
      // Check email uniqueness locally first
      const { data: existingUser } = await (supabase
        .from('admin_profiles') as any)
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser) {
        showToast(`Email ${cleanEmail} sudah terdaftar dalam sistem.`, 'error');
        setActionLoading(false);
        return;
      }

      // Call secure PostgreSQL RPC admin_create_user
      const { data, error } = await (supabase.rpc as any)('admin_create_user', {
        p_email: cleanEmail,
        p_password: formPassword,
        p_full_name: cleanName,
        p_role: formRole,
        p_nip: formNip ? sanitizeText(formNip).trim() : null,
        p_phone: formPhone ? sanitizeText(formPhone).trim() : null,
        p_bio: formBio ? sanitizeText(formBio).trim() : null,
        p_motto: formMotto ? sanitizeText(formMotto).trim() : null,
        p_avatar_url: formAvatar || null,
        p_class: formRole === 'santri' || formRole === 'user' ? formClass : null
      });

      if (error) {
        // Fallback: If RPC has issue, try Edge Function if configured
        console.warn('RPC create user error:', error.message);
        showToast('Gagal membuat user: ' + error.message, 'error');
        return;
      }

      showToast(`Alhamdulillah! Akun administrator ${cleanName} berhasil dibuat.`);
      setIsAddModalOpen(false);
      resetAddForm();
      fetchUsers();
    } catch (err: any) {
      showToast('Kendala sistem: ' + (err?.message || 'Gagal membuat user'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const resetAddForm = () => {
    setFormName('');
    setFormEmail('');
    setFormNip('');
    setFormPhone('');
    setFormRole('guru_akademik');
    setFormPassword('');
    setFormConfirmPassword('');
    setFormAutoGeneratePw(false);
    setFormSendInviteEmail(false);
    setFormIsActive(true);
    setFormClass('7A');
    setFormMotto('');
    setFormBio('');
    setFormAvatar('');
  };

  // 4. Handle Edit User
  const handleOpenEdit = (userItem: AdminUserItem) => {
    setSelectedUser(userItem);
    setEditName(userItem.full_name);
    setEditRole(userItem.role);
    setEditNip(userItem.nip && userItem.nip !== '-' ? userItem.nip : '');
    setEditPhone(userItem.phone && userItem.phone !== '-' ? userItem.phone : '');
    setEditIsActive(userItem.is_active);
    setEditClass(userItem.class || '7A');
    setEditMotto(userItem.motto || '');
    setEditBio(userItem.bio || '');
    setEditAvatar(userItem.avatar_url || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!isSuperAdmin && currentRole !== 'super_admin') {
      showToast('Akses ditolak: Hanya Super Admin yang berhak mengedit data pengguna.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await (supabase.rpc as any)('admin_update_user', {
        p_user_id: selectedUser.id,
        p_full_name: sanitizeText(editName).trim(),
        p_role: editRole,
        p_nip: editNip ? sanitizeText(editNip).trim() : null,
        p_phone: editPhone ? sanitizeText(editPhone).trim() : null,
        p_bio: editBio ? sanitizeText(editBio).trim() : null,
        p_motto: editMotto ? sanitizeText(editMotto).trim() : null,
        p_avatar_url: editAvatar || null,
        p_class: editRole === 'santri' || editRole === 'user' ? editClass : null,
        p_is_active: editIsActive
      });

      if (error) {
        showToast('Gagal memperbarui pengguna: ' + error.message, 'error');
        return;
      }

      showToast(`Data administrator ${editName} berhasil diperbarui.`);
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showToast('Kendala pembaruan: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Handle Toggle Status
  const handleToggleStatus = async (userItem: AdminUserItem) => {
    if (!isSuperAdmin && currentRole !== 'super_admin') {
      showToast('Akses ditolak: Hanya Super Admin yang berhak mengubah status akun.', 'error');
      return;
    }

    if (currentAuthUser && userItem.id === currentAuthUser.id) {
      showToast('Keamanan: Anda tidak dapat menonaktifkan akun Anda sendiri.', 'error');
      return;
    }

    const nextState = !userItem.is_active;
    try {
      const { error } = await (supabase.rpc as any)('admin_toggle_user_status', {
        p_user_id: userItem.id,
        p_is_active: nextState
      });

      if (error) {
        showToast('Gagal mengubah status: ' + error.message, 'error');
        return;
      }

      showToast(`Status akun ${userItem.full_name} berhasil diubah menjadi ${nextState ? 'Aktif' : 'Nonaktif'}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userItem.id ? { ...u, is_active: nextState } : u))
      );
    } catch (err: any) {
      showToast('Kendala: ' + err.message, 'error');
    }
  };

  // 6. Handle Reset Password
  const handleOpenResetPassword = (userItem: AdminUserItem) => {
    setSelectedUser(userItem);
    setResetNewPassword('');
    setResetConfirmPassword('');
    setIsResetPwModalOpen(true);
  };

  const handleSaveResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (resetNewPassword.length < 8) {
      showToast('Kata sandi baru minimal 8 karakter.', 'error');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await (supabase.rpc as any)('admin_reset_user_password', {
        p_user_id: selectedUser.id,
        p_new_password: resetNewPassword
      });

      if (error) {
        showToast('Gagal mereset kata sandi: ' + error.message, 'error');
        return;
      }

      showToast(`Kata sandi akun ${selectedUser.full_name} berhasil direset.`);
      setIsResetPwModalOpen(false);
    } catch (err: any) {
      showToast('Kendala reset password: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Handle Delete User
  const handleOpenDelete = (userItem: AdminUserItem) => {
    setSelectedUser(userItem);
    setDeleteEmailConfirm('');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (deleteEmailConfirm.trim().toLowerCase() !== selectedUser.email.trim().toLowerCase()) {
      showToast('Email konfirmasi tidak cocok dengan email akun.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await (supabase.rpc as any)('admin_delete_user', {
        p_user_id: selectedUser.id,
        p_confirm_email: deleteEmailConfirm.trim().toLowerCase()
      });

      if (error) {
        showToast('Gagal menghapus user: ' + error.message, 'error');
        return;
      }

      showToast(`Akun ${selectedUser.full_name} (${selectedUser.email}) berhasil dihapus.`);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showToast('Kendala penghapusan: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // 8. Handle Impersonation (Debug Role Login with Audit Log)
  const handleImpersonate = async (userItem: AdminUserItem) => {
    if (!isSuperAdmin && currentRole !== 'super_admin') {
      showToast('Akses ditolak: Hanya Super Admin yang berhak menggunakan fitur impersonasi.', 'error');
      return;
    }

    const targetRole = normalizeRole(userItem.role);
    if (confirm(`Apakah Anda yakin ingin login sementara sebagai "${userItem.full_name}" (${userItem.role}) untuk pengujian sistem?`)) {
      try {
        // Record audit log
        if (currentAuthUser) {
          await supabase.from('audit_logs').insert({
            user_id: currentAuthUser.id,
            email: currentAuthUser.email,
            role: 'super_admin',
            action: 'impersonate_user',
            module: 'users',
            section_id: userItem.id,
            new_data: { impersonated_user: userItem.email, impersonated_role: targetRole }
          });
        }
        switchMockRole(targetRole);
        showToast(`Beralih peran sementara sebagai ${userItem.full_name} (${targetRole}).`);
      } catch (err: any) {
        showToast('Gagal impersonasi: ' + err.message, 'error');
      }
    }
  };

  // 9. Handle Open Audit Log Modal
  const handleOpenAuditLog = (userItem: AdminUserItem) => {
    setSelectedUser(userItem);
    setIsAuditModalOpen(true);
    fetchAuditLogs(userItem.id);
  };

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const superAdmin = users.filter((u) => u.role === 'super_admin').length;
    const konten = users.filter((u) => u.role === 'pengurus_konten').length;
    const guru = users.filter((u) => u.role === 'guru_akademik').length;
    const santri = users.filter((u) => u.role === 'santri' || u.role === 'user').length;
    const active = users.filter((u) => u.is_active).length;
    const inactive = total - active;
    return { total, superAdmin, konten, guru, santri, active, inactive };
  }, [users]);

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchSearch =
          !query ||
          item.full_name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          (item.nip && item.nip.toLowerCase().includes(query));

        const matchRole =
          roleFilter === 'all' ||
          (roleFilter === 'santri' ? item.role === 'santri' || item.role === 'user' : item.role === roleFilter);

        const matchStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' ? item.is_active : !item.is_active);

        return matchSearch && matchRole && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === 'name-asc') return a.full_name.localeCompare(b.full_name);
        if (sortBy === 'name-desc') return b.full_name.localeCompare(a.full_name);
        if (sortBy === 'role') return a.role.localeCompare(b.role);
        return 0;
      });
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  // Role Badge Styling
  const getRoleBadge = (roleStr: string) => {
    switch (roleStr) {
      case 'super_admin':
        return {
          label: 'Super Admin',
          bg: 'bg-red-50 dark:bg-red-950/60 text-[#DC2626] dark:text-red-400 border-red-200 dark:border-red-900',
          dot: 'bg-[#DC2626]'
        };
      case 'pengurus_konten':
        return {
          label: 'Pengurus Konten',
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
          dot: 'bg-[#059669]'
        };
      case 'guru_akademik':
        return {
          label: 'Guru Akademik',
          bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border-blue-200 dark:border-blue-900',
          dot: 'bg-[#2563EB]'
        };
      case 'santri':
      case 'user':
        return {
          label: 'Santri Mukim',
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 border-amber-200 dark:border-amber-900',
          dot: 'bg-[#F59E0B]'
        };
      case 'wali_santri':
        return {
          label: 'Wali Santri',
          bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
          dot: 'bg-purple-500'
        };
      case 'alumni':
        return {
          label: 'Alumni PPJM',
          bg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900',
          dot: 'bg-teal-500'
        };
      default:
        return {
          label: roleStr,
          bg: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
          dot: 'bg-zinc-400'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold animate-fade-in max-w-md ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-[#0E7A4C] text-white border-emerald-500'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          )}
          <span className="leading-relaxed">{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Hak Akses Super Admin Terproteksi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Kelola Administrator &amp; Pengguna Sistem
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manajemen identitas, hak akses role berjenjang, dan otentikasi aman terintegrasi Supabase Auth.
          </p>
        </div>

        {/* Action Button: Tambah User (Super Admin Only) */}
        {(isSuperAdmin || currentRole === 'super_admin') && (
          <button
            type="button"
            onClick={() => {
              resetAddForm();
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 border border-[#C8A951]/30 cursor-pointer active:scale-[0.98] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Administrator</span>
          </button>
        )}
      </div>

      {/* Statistics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Akun</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{stats.total}</p>
          <span className="text-[10px] text-zinc-500">Terdaftar di DB</span>
        </div>

        <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Super Admin</span>
          <p className="text-2xl font-black text-[#DC2626] dark:text-red-400">{stats.superAdmin}</p>
          <span className="text-[10px] text-red-600/70">Wewenang Penuh</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Konten &amp; Media</span>
          <p className="text-2xl font-black text-[#059669] dark:text-emerald-400">{stats.konten}</p>
          <span className="text-[10px] text-emerald-600/70">Warta &amp; Galeri</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Guru Akademik</span>
          <p className="text-2xl font-black text-[#2563EB] dark:text-blue-400">{stats.guru}</p>
          <span className="text-[10px] text-blue-600/70">STEM, Hafidz, Mandarin</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Santri &amp; User</span>
          <p className="text-2xl font-black text-[#D97706] dark:text-amber-400">{stats.santri}</p>
          <span className="text-[10px] text-amber-600/70">Mandiri Santri</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status Aktif</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.active} <span className="text-xs font-normal text-zinc-400">/ {stats.inactive} off</span>
          </p>
          <span className="text-[10px] text-zinc-500">Sesi Diizinkan</span>
        </div>
      </div>

      {/* Filter, Search & Sort Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0E7A4C]"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="pengurus_konten">Pengurus Konten</option>
            <option value="guru_akademik">Guru Akademik</option>
            <option value="santri">Santri Mukim</option>
            <option value="wali_santri">Wali Santri</option>
            <option value="alumni">Alumni</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif Saja</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name-asc">Nama (A-Z)</option>
            <option value="name-desc">Nama (Z-A)</option>
            <option value="role">Role</option>
          </select>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 text-zinc-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Pengguna / Administrator</th>
                <th className="py-3.5 px-4">Role &amp; Otoritas</th>
                <th className="py-3.5 px-4">NIP / Identitas</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4">Terdaftar</th>
                <th className="py-3.5 px-4 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0E7A4C]" />
                    <span>Memuat data administrator dari Supabase...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const roleBadge = getRoleBadge(item.role);
                  const isCurrent = currentAuthUser?.id === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Avatar & Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.avatar_url ? (
                            <img
                              src={item.avatar_url}
                              alt={item.full_name}
                              className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-300 dark:border-emerald-800 shrink-0">
                              {item.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-zinc-900 dark:text-white truncate">
                                {item.full_name}
                              </p>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Anda
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-500 font-mono truncate">{item.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`} />
                          <span>{roleBadge.label}</span>
                        </span>
                      </td>

                      {/* NIP / NIS */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                        {item.nip || '-'}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={actionLoading || isCurrent}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer border ${
                            item.is_active
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200'
                          } ${isCurrent ? 'opacity-60 cursor-not-allowed' : ''}`}
                          title={isCurrent ? 'Tidak bisa mengubah status akun sendiri' : 'Klik untuk ganti status'}
                        >
                          {item.is_active ? '● Aktif' : '○ Nonaktif'}
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate */}
                          <button
                            type="button"
                            onClick={() => handleImpersonate(item)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            title="Impersonate (Uji Peran Akun Ini)"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          {/* Audit Log */}
                          <button
                            type="button"
                            onClick={() => handleOpenAuditLog(item)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Lihat Log Audit Aktivitas"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => handleOpenResetPassword(item)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                            title="Reset Password Akun"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            title="Edit Data Administrator"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
                              isCurrent ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title={isCurrent ? 'Tidak bisa menghapus akun sendiri' : 'Hapus Akun'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH ADMINISTRATOR (2 KOLOM RESMI PPJM) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0E7A4C]/10 text-[#0E7A4C] flex items-center justify-center border border-[#0E7A4C]/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Tambah Administrator Baru
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Otorisasi akun resmi Pondok Pesantren Jauharul Maknuun
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KOLOM KIRI: Identitas & Avatar */}
                <div className="space-y-4">
                  {/* Foto Avatar with WebP Compressor */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                      Foto Avatar (Otomatis WebP 400x400):
                    </label>

                    <div className="flex items-center gap-4">
                      {formAvatar ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-zinc-100">
                          <img src={formAvatar} alt="Pratinjau" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-2xl flex items-center justify-center border-2 border-dashed border-emerald-300 dark:border-emerald-800 shrink-0">
                          {formName ? formName.charAt(0).toUpperCase() : 'JM'}
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleAvatarFile(e.target.files[0]);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={formCompressing}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-[#0E7A4C] dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-emerald-300 dark:border-emerald-800"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{formCompressing ? 'Mengompres...' : 'Pilih Foto dari Komputer'}</span>
                        </button>
                        <p className="text-[10px] text-zinc-400">
                          JPG atau PNG, dikompresi otomatis ke format WebP hemat kuota.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ust. Ahmad Fauzi, M.Pd."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0E7A4C]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Alamat Email Resmi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@ppjauharulmaknuun.sch.id"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0E7A4C]"
                    />
                  </div>

                  {/* NIP / NIS & No HP */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        NIP / NIS (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: NIP-2026-088"
                        value={formNip}
                        onChange={(e) => setFormNip(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0E7A4C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        No WhatsApp / HP
                      </label>
                      <input
                        type="tel"
                        placeholder="081234567890"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0E7A4C]"
                      />
                    </div>
                  </div>

                  {/* Motto Khidmah */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Motto Khidmah (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Motto pengabdian di pesantren..."
                      value={formMotto}
                      onChange={(e) => setFormMotto(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0E7A4C]"
                    />
                  </div>
                </div>

                {/* KOLOM KANAN: Otoritas Role & Kredensial */}
                <div className="space-y-4">
                  {/* Role Selection with Protection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span>Pilih Role &amp; Wewenang Akun <span className="text-rose-500">*</span></span>
                      {(!isSuperAdmin && currentRole !== 'super_admin') && (
                        <span className="text-[10px] text-amber-600 font-normal">
                          Super Admin diproteksi
                        </span>
                      )}
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold focus:outline-none focus:border-[#0E7A4C] cursor-pointer"
                    >
                      <option
                        value="super_admin"
                        disabled={!isSuperAdmin && currentRole !== 'super_admin'}
                      >
                        Super Admin (Semua Akses Root - Proteksi Penuh)
                      </option>
                      <option value="pengurus_konten">
                        Pengurus Konten &amp; Media (Warta, Galeri, Prestasi, Ekskul)
                      </option>
                      <option value="guru_akademik">
                        Guru Akademik (STEM, Hafidz Qur'an, Mandarin Class)
                      </option>
                      <option value="santri">
                        Santri Mukim (Portal Mandiri, Hafalan &amp; Riset)
                      </option>
                      <option value="wali_santri">Wali Santri (Akses Raport &amp; Tagihan)</option>
                      <option value="alumni">Alumni Santri</option>
                    </select>
                  </div>

                  {/* Jika role Santri, tampilkan pilihan Kelas */}
                  {(formRole === 'santri' || formRole === 'user') && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Kelas Santri (SMP Plus JM):
                      </label>
                      <select
                        value={formClass}
                        onChange={(e) => setFormClass(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      >
                        <option value="7A">Kelas 7A (Putra)</option>
                        <option value="7B">Kelas 7B (Putri)</option>
                        <option value="8A">Kelas 8A (Putra)</option>
                        <option value="8B">Kelas 8B (Putri)</option>
                        <option value="9A">Kelas 9A (Putra)</option>
                        <option value="9B">Kelas 9B (Putri)</option>
                      </select>
                    </div>
                  )}

                  {/* Password Input with Generator & Strength Meter */}
                  <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#0E7A4C]" />
                        <span>Kata Sandi Baru <span className="text-rose-500">*</span></span>
                      </label>
                      <button
                        type="button"
                        onClick={generateStrongPassword}
                        className="text-[11px] font-bold text-[#0E7A4C] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#C8A951]" />
                        <span>Generate Otomatis</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimal 8 karakter aman..."
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono focus:outline-none focus:border-[#0E7A4C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength Indicator Bar */}
                    {formPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                pwStrength >= step
                                  ? pwStrength === 4
                                    ? 'bg-emerald-500'
                                    : pwStrength === 3
                                    ? 'bg-blue-500'
                                    : pwStrength === 2
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                  : 'bg-zinc-200 dark:bg-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          Kekuatan Sandi:{' '}
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">
                            {pwStrength === 4
                              ? 'Sangat Kuat (Kombinasi Sempurna)'
                              : pwStrength === 3
                              ? 'Kuat (Huruf + Angka + Simbol)'
                              : pwStrength === 2
                              ? 'Cukup (Tambahkan karakter khusus)'
                              : 'Lemah (Minimal 8 karakter unik)'}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Konfirmasi Password */}
                    <div className="space-y-1 pt-2">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Ulangi kata sandi..."
                        value={formConfirmPassword}
                        onChange={(e) => setFormConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono focus:outline-none focus:border-[#0E7A4C]"
                      />
                      {formConfirmPassword && formPassword !== formConfirmPassword && (
                        <p className="text-[10px] text-rose-500 font-bold">
                          Kata sandi tidak cocok!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Aktif Switch */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Status Akun Langsung Aktif
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Pengguna dapat langsung login ke portal admin setelah dibuat
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#0E7A4C] rounded border-zinc-300 focus:ring-[#0E7A4C]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Membuat akun di Supabase...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Simpan Administrator</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT ADMINISTRATOR */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-5 h-5 text-[#0E7A4C]" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Edit Data Administrator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Role Akses:
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold cursor-pointer"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="pengurus_konten">Pengurus Konten</option>
                  <option value="guru_akademik">Guru Akademik</option>
                  <option value="santri">Santri Mukim</option>
                  <option value="wali_santri">Wali Santri</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">NIP / NIS:</label>
                  <input
                    type="text"
                    value={editNip}
                    onChange={(e) => setEditNip(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No HP:</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Motto Khidmah:</label>
                <input
                  type="text"
                  value={editMotto}
                  onChange={(e) => setEditMotto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Status Akun Aktif</span>
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#0E7A4C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] text-xs font-bold cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RESET PASSWORD */}
      {/* ========================================================================= */}
      {isResetPwModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-200">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Reset Kata Sandi Akun
                </h3>
                <p className="text-xs text-zinc-500">{selectedUser.full_name} ({selectedUser.email})</p>
              </div>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Kata Sandi Baru:
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter..."
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Ulangi Kata Sandi Baru:
                </label>
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  required
                  placeholder="Ulangi kata sandi..."
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsResetPwModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-zinc-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  {actionLoading ? 'Mereset...' : 'Simpan Kata Sandi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HAPUS USER DENGAN KONFIRMASI KETIK EMAIL */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-rose-300 dark:border-rose-900 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900 dark:text-rose-300">
                  Konfirmasi Hapus Akun Administrator
                </h3>
                <p className="text-xs text-zinc-500">Tindakan ini tidak dapat dibatalkan!</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Anda akan menghapus seluruh data kredensial akun <strong>{selectedUser.full_name}</strong>.
              Untuk konfirmasi, silakan ketik ulang alamat email pengguna di bawah ini:
            </p>

            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-mono text-xs text-center font-bold text-zinc-800 dark:text-zinc-200 select-all">
              {selectedUser.email}
            </div>

            <form onSubmit={handleConfirmDelete} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Ketik email untuk konfirmasi..."
                value={deleteEmailConfirm}
                onChange={(e) => setDeleteEmailConfirm(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-zinc-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    actionLoading ||
                    deleteEmailConfirm.trim().toLowerCase() !== selectedUser.email.trim().toLowerCase()
                  }
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  {actionLoading ? 'Menghapus...' : 'Hapus Akun Permanen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: AUDIT LOG RIWAYAT AKTIVITAS PENGGUNA */}
      {/* ========================================================================= */}
      {isAuditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-[#0E7A4C]" />
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Audit Log Pengguna: {selectedUser.full_name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {loadingAuditLogs ? (
                <div className="py-8 text-center text-zinc-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0E7A4C]" />
                  <span className="text-xs">Memuat riwayat audit log...</span>
                </div>
              ) : userAuditLogs.length === 0 ? (
                <p className="text-xs text-center py-8 text-zinc-400">
                  Belum ada catatan aktivitas keamanan yang terekam untuk pengguna ini.
                </p>
              ) : (
                userAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </span>
                    </div>
                    {log.module && (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        Modul: {log.module}
                      </span>
                    )}
                    {log.new_data && (
                      <pre className="text-[10px] bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-600 dark:text-zinc-300 font-mono overflow-x-auto">
                        {JSON.stringify(log.new_data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaUsers;

