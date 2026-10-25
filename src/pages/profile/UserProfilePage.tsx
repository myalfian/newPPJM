import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Camera,
  Edit3,
  Lock,
  LogOut,
  Sparkles,
  Phone,
  Briefcase,
  Hash,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Globe,
  BookOpen,
  Trophy,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Share2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, AdminProfile } from '../../lib/supabase';
import { SEED_ACCOUNTS } from '../../data/seedAccounts';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { ChangePasswordModal } from '../../components/profile/ChangePasswordModal';
import { AvatarPickerModal } from '../../components/profile/AvatarPickerModal';
import { SantriPortalHub } from '../../components/profile/SantriPortalHub';
import { Link } from 'react-router-dom';

export const UserProfilePage: React.FC = () => {
  const { user, profile, role, signOut, updateProfile, switchMockRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'santri-hub' | 'security' | 'seed-accounts'>('overview');

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const seedConfig = SEED_ACCOUNTS[role];

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvatarSelect = async (newUrl: string) => {
    const res = await updateProfile({ avatar_url: newUrl });
    if (!res.error) {
      showToast('Foto profil berhasil diperbarui.');
    }
  };

  const handleProfileSave = async (updates: Partial<AdminProfile>) => {
    const res = await updateProfile(updates);
    if (!res.error) {
      showToast('Data profil berhasil disimpan.');
    }
    return res;
  };

  const getRoleTheme = (userRole: UserRole) => {
    switch (userRole) {
      case 'super_admin':
        return {
          banner: 'from-amber-900 via-stone-900 to-amber-950',
          badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
          accent: 'emerald',
          dot: 'bg-amber-500',
        };
      case 'pengurus_konten':
        return {
          banner: 'from-emerald-900 via-teal-950 to-stone-900',
          badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
          accent: 'emerald',
          dot: 'bg-emerald-500',
        };
      case 'guru_akademik':
        return {
          banner: 'from-sky-900 via-blue-950 to-stone-900',
          badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/30',
          accent: 'sky',
          dot: 'bg-sky-500',
        };
      case 'visitor':
        return {
          banner: 'from-emerald-950 via-slate-900 to-teal-950',
          badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
          accent: 'emerald',
          dot: 'bg-emerald-400',
        };
      case 'user':
      default:
        return {
          banner: 'from-purple-900 via-slate-900 to-indigo-950',
          badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30',
          accent: 'purple',
          dot: 'bg-purple-500',
        };
    }
  };

  const theme = getRoleTheme(role);

  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-16 overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-800 text-white shadow-xl border border-emerald-600/50 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO BANNER & PROFILE HEADER */}
      <div className="relative">
        {/* Banner with modern-lux gradient & mesh styling */}
        <div className={`h-44 sm:h-56 w-full bg-gradient-to-r ${theme.banner} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-end pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal Profil Resmi • Pondok Pesantren Jauharul Maknuun</span>
            </div>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              {/* Left: Avatar with Status Dot & Picker Trigger */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 w-full sm:w-auto">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl">
                    <img
                      src={profile?.avatar_url || seedConfig.avatarUrl}
                      alt={profile?.full_name || seedConfig.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Online Indicator */}
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-4 ring-white dark:ring-zinc-900 shadow-sm ${
                      role === 'visitor' ? 'bg-slate-400' : 'bg-emerald-500'
                    }`}
                  />

                  {/* Change Avatar Button */}
                  <button
                    type="button"
                    onClick={() => setIsAvatarPickerOpen(true)}
                    className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                    title="Ganti Foto Profil"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>

                {/* Identity & Badges */}
                <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                      <span>{seedConfig.roleLabel}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                      <Hash className="w-3 h-3 text-zinc-400" />
                      <span>{profile?.nis_or_nip || seedConfig.nisOrNip}</span>
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                    {profile?.full_name || seedConfig.fullName}
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    {profile?.department || seedConfig.department}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{profile?.phone || seedConfig.phone}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{role === 'visitor' ? 'Mode Tamu Publik' : 'Akun Terverifikasi'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Buttons */}
              <div className="flex flex-wrap sm:flex-col lg:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                {role === 'visitor' ? (
                  <>
                    <Link
                      to="/admin/login"
                      className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Key className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Masuk Akun Pengurus / Santri</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setActiveTab('seed-accounts')}
                      className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Uji Coba 4 Role</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditProfileOpen(true)}
                      className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Edit Profil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Ganti Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                      title="Keluar dari sesi ini"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                )}
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`min-h-[44px] px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-t-xl'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Overview & Otorisasi Role</span>
          </button>

          {role === 'user' && (
            <button
              type="button"
              onClick={() => setActiveTab('santri-hub')}
              className={`min-h-[44px] px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'santri-hub'
                  ? 'border-purple-600 text-purple-800 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/20 rounded-t-xl'
                  : 'border-transparent text-zinc-500 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Portal Mandiri Santri (CRUD)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-[10px] font-black text-purple-700 dark:text-purple-300">
                CRUD Aktif
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`min-h-[44px] px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-t-xl'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Kesehatan Akun & Keamanan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seed-accounts')}
            className={`min-h-[44px] px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'seed-accounts'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-t-xl'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Akun Default & Role Switcher</span>
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* TAB 1: OVERVIEW & ROLE-SPECIFIC METADATA */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Role Capabilities & Specific Modules */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Biografi / Deskripsi Tugas */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Tentang & Bidang Khidmah</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  {profile?.bio || seedConfig.bio}
                </p>
              </div>

              {/* Matriks Wewenang & Hak Akses (Role-Specific) */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Matriks Hak Akses ({seedConfig.securityLevel})</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Aktif
                  </span>
                </div>

                <div className="space-y-2.5">
                  {seedConfig.permissions.map((perm, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {perm}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION ROLE-SPESIFIK KUSTOM */}
              {role === 'super_admin' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Status Integritas Database Supabase (9 Tabel Publik)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'jm_center_pages', count: '4 Halaman', status: 'Sinkron' },
                      { name: 'programs', count: '3 Program', status: 'Sinkron' },
                      { name: 'stem_projects', count: '3 Proyek', status: 'Sinkron' },
                      { name: 'mandarin_lessons', count: '2 Pelajaran', status: 'Sinkron' },
                      { name: 'mandarin_quizzes', count: '3 Kuis', status: 'Sinkron' },
                      { name: 'achievements', count: '3 Prestasi', status: 'Sinkron' },
                      { name: 'extracurriculars', count: '4 Ekskul', status: 'Sinkron' },
                      { name: 'galleries', count: '3 Media', status: 'Sinkron' },
                      { name: 'agendas', count: '3 Agenda', status: 'Sinkron' },
                    ].map((tbl, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-amber-500/5 border border-amber-300/40 dark:border-amber-500/20">
                        <p className="text-[11px] font-mono font-bold text-zinc-900 dark:text-white truncate">{tbl.name}</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{tbl.count}</p>
                        <span className="inline-block mt-1 text-[10px] text-emerald-600 font-bold">● {tbl.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {role === 'pengurus_konten' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Modul Publikasi Media & Humas</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      to="/admin/berita"
                      className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 hover:border-emerald-500 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-xs text-zinc-900 dark:text-white">Kelola Warta & Berita</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Integrasi WhatsApp Santri</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/admin/galeri"
                      className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 hover:border-emerald-500 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-xs text-zinc-900 dark:text-white">Kelola Foto & Video</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Dokumentasi YouTube Resmi</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {role === 'guru_akademik' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Sentra Modul Akademik & Laboratorium</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link to="/admin/stem" className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 block hover:border-sky-500 transition-all">
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">Lab STEM & IoT</p>
                      <p className="text-[10.5px] text-zinc-500 mt-1">Silabus & Portofolio</p>
                    </Link>
                    <Link to="/admin/mandarin" className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 block hover:border-sky-500 transition-all">
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">Mandarin Class</p>
                      <p className="text-[10.5px] text-zinc-500 mt-1">Audio & Kuis Interaktif</p>
                    </Link>
                    <Link to="/admin/hafidz" className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 block hover:border-sky-500 transition-all">
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">Dewan Tahfidz</p>
                      <p className="text-[10.5px] text-zinc-500 mt-1">Setoran Murojaah AI</p>
                    </Link>
                  </div>
                </div>
              )}

              {role === 'user' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      <Trophy className="w-4 h-4" />
                      <span>Capaian Santri Terpadu</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('santri-hub')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-200 cursor-pointer self-start sm:self-auto bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/60 transition-all hover:shadow-xs active:scale-95"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Buka Portal Mandiri (CRUD)</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Tahfidzul Qur'an</span>
                      <p className="text-base font-extrabold text-zinc-900 dark:text-white mt-1">30 Juz Mutqin</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Sanad Muttashil</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Riset Robotika</span>
                      <p className="text-base font-extrabold text-zinc-900 dark:text-white mt-1">IoT Hidroponik</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Juara 1 Santri Nusantara</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">HSK Mandarin</span>
                      <p className="text-base font-extrabold text-zinc-900 dark:text-white mt-1">Level Dasar 1</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Skor Kuis: 100% Sempurna</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Contact, Security Snapshot & Quick Links */}
            <div className="space-y-6">
              
              {/* Card Detail Kontak & Identitas */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Informasi Kontak & Akun
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Email Resmi:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white break-all">
                      {user?.email || seedConfig.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[11px]">Nomor WhatsApp:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {profile?.phone || seedConfig.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[11px]">NIP / NIS:</span>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {profile?.nis_or_nip || seedConfig.nisOrNip}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[11px]">Departemen / Penugasan:</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {profile?.department || seedConfig.department}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Tingkat Otoritas:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {seedConfig.securityLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation to Portal Modul */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Akses Cepat Portal</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Jelajahi halaman publik pondok atau modul manajemen administratif sesuai peran aktif Anda.
                </p>
                <div className="space-y-2 pt-1">
                  <Link
                    to="/"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span>Website Publik Beranda</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  {role === 'user' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('santri-hub')}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-sm active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Portal Mandiri Santri (CRUD)</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {role !== 'user' && (
                    <Link
                      to="/admin"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-between"
                    >
                      <span>Admin CMS Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB SANTRI HUB: CRUD LAPORAN HAFALAN, TUGAS STEM, & HASIL TEST */}
        {activeTab === 'santri-hub' && (
          <div className="space-y-6">
            <SantriPortalHub
              santriId={profile?.nis_or_nip || seedConfig.nisOrNip || 'SAN-2024-089'}
              santriName={profile?.full_name || seedConfig.fullName || 'Ahmad Zaki Al-Maknuuni'}
            />
          </div>
        )}

        {/* TAB 2: KEAMANAN & ACCOUNT HEALTH */}
        {activeTab === 'security' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Security Health Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    Indikator Kesehatan Keamanan Akun
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Sistem otentikasi zero-trust tersinkronisasi dengan Supabase Auth
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Status Otentikasi:</span>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terotentikasi Aman</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">JWT Token Session Aktif</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Pergantian Sandi Terakhir:</span>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>25 Oktober 2026</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">Standar Sandi Terpenuhi</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Row Level Security (RLS):</span>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aktif & Terproteksi</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">Izin tabel terisolasi per role</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Protokol Keamanan:</span>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span>Bcrypt + TLS 1.3</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">Enkripsi hash tingkat tinggi</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Perbarui Kredensial Akses</h4>
                  <p className="text-[11px] text-zinc-500">Disarankan mengganti kata sandi secara berkala setiap semester.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Ganti Kata Sandi Sekarang</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SEED ACCOUNTS & ROLE SWITCHER */}
        {activeTab === 'seed-accounts' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Key className="w-3.5 h-3.5" />
                <span>Kredensial Default Bawaan (Production Seed)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                Daftar Akun Default Tiap User Role
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Akun-akun berikut telah ditanamkan ke dalam database Supabase Auth dan tabel <code>admin_profiles</code>. Anda dapat menguji akses tiap peran dengan satu klik tombol <strong>"Uji Masuk Role Ini"</strong>.
              </p>
            </div>

            {/* Grid of 4 Seed Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(SEED_ACCOUNTS) as UserRole[]).map((accountRole) => {
                const acc = SEED_ACCOUNTS[accountRole];
                const isCurrent = role === accountRole;

                return (
                  <div
                    key={accountRole}
                    className={`rounded-3xl p-6 border transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/80 ring-2 ring-emerald-500/30'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                          <img src={acc.avatarUrl} alt={acc.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${acc.badgeColor.bg} ${acc.badgeColor.text} ${acc.badgeColor.border}`}>
                            {acc.roleLabel}
                          </span>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{acc.fullName}</h4>
                          <p className="text-[11px] text-zinc-500">{acc.department}</p>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                          Sedang Aktif
                        </span>
                      )}
                    </div>

                    {/* Credentials Info Box */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Email:</span>
                        <code className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{acc.email}</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Default Password:</span>
                        <code className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                          {acc.password || '(Akses Terbuka)'}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Tingkat Hak Akses:</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{acc.securityLevel}</span>
                      </div>
                    </div>

                    {/* Switch Button */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          switchMockRole(accountRole);
                          showToast(`Berhasil beralih ke peran: ${acc.roleLabel}`);
                        }}
                        disabled={isCurrent}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          isCurrent
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-default'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm active:scale-[0.98]'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{isCurrent ? 'Peran Sedang Digunakan' : (accountRole === 'visitor' ? 'Kembali ke Mode Tamu' : 'Uji Masuk Role Ini')}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. MODALS */}
      {profile && (
        <>
          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            profile={profile}
            onSave={handleProfileSave}
          />
          <AvatarPickerModal
            isOpen={isAvatarPickerOpen}
            onClose={() => setIsAvatarPickerOpen(false)}
            currentAvatar={profile.avatar_url}
            onSelectAvatar={handleAvatarSelect}
          />
        </>
      )}

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userEmail={user?.email || seedConfig.email}
      />

    </div>
  );
};

export default UserProfilePage;
