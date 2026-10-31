import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/supabase';
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Lock,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  ExternalLink,
  Crown,
  KeyRound,
  UserCheck,
  FileText,
  GraduationCap,
  Users
} from 'lucide-react';

// ==============================================================================
// 1. SPEC PPJM: MODULE ACCESS MATRIX
// ==============================================================================

export type ModuleKey =
  | 'dashboard'
  | 'webVisualEditor'
  | 'slider'
  | 'profil'
  | 'stem'
  | 'mandarin'
  | 'hafidz'
  | 'berita'
  | 'galeri'
  | 'prestasi'
  | 'ekskul'
  | 'osis'
  | 'agenda'
  | 'kontak'
  | 'akunRbac'
  | 'integrationTest'
  | 'goLiveCheck'
  | 'dataAudit';

export const MODULE_ACCESS: Record<ModuleKey, UserRole[]> = {
  dashboard: ['super_admin', 'pengurus_konten', 'guru_akademik'],
  webVisualEditor: ['super_admin', 'pengurus_konten'],
  slider: ['super_admin', 'pengurus_konten'],
  profil: ['super_admin', 'pengurus_konten'],
  stem: ['super_admin', 'guru_akademik'],
  mandarin: ['super_admin', 'guru_akademik'],
  hafidz: ['super_admin', 'guru_akademik'],
  berita: ['super_admin', 'pengurus_konten'],
  galeri: ['super_admin', 'pengurus_konten'],
  prestasi: ['super_admin', 'pengurus_konten', 'guru_akademik'],
  ekskul: ['super_admin', 'pengurus_konten'],
  osis: ['super_admin', 'pengurus_konten'],
  agenda: ['super_admin', 'pengurus_konten'],
  kontak: ['super_admin', 'pengurus_konten'],
  akunRbac: ['super_admin'],
  integrationTest: ['super_admin', 'pengurus_konten', 'guru_akademik'],
  goLiveCheck: ['super_admin', 'pengurus_konten'],
  dataAudit: ['super_admin', 'pengurus_konten', 'guru_akademik'],
};

// URL Path to Module Mapping
export const PATH_TO_MODULE: Record<string, ModuleKey> = {
  '/admin': 'dashboard',
  '/admin/dashboard': 'dashboard',
  '/admin/editor': 'webVisualEditor',
  '/editor': 'webVisualEditor',
  '/admin/slider': 'slider',
  '/admin/profil': 'profil',
  '/admin/program': 'profil',
  '/admin/stem': 'stem',
  '/admin/mandarin': 'mandarin',
  '/admin/hafidz': 'hafidz',
  '/admin/berita': 'berita',
  '/admin/galeri': 'galeri',
  '/admin/prestasi': 'prestasi',
  '/admin/ekskul': 'ekskul',
  '/admin/osis': 'osis',
  '/admin/agenda': 'agenda',
  '/admin/kontak': 'kontak',
  '/admin/integration-test': 'integrationTest',
  '/admin/go-live-check': 'goLiveCheck',
  '/admin/data-audit': 'dataAudit',
  '/admin/audit': 'integrationTest',
  '/admin/akun': 'akunRbac',
  '/admin/rbac': 'akunRbac',
};

// ==============================================================================
// 2. ROLE BADGE COMPONENT (WARNA PER ROLE RESMI PPJM)
// ==============================================================================

export interface RoleBadgeProps {
  role: UserRole;
  className?: string;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  className = '',
  showIcon = true
}) => {
  switch (role) {
    case 'super_admin':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs ${className}`}
        >
          {showIcon && <Crown className="w-3 h-3 text-amber-700" />}
          <span>Super Admin</span>
        </span>
      );
    case 'pengurus_konten':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs ${className}`}
        >
          {showIcon && <FileText className="w-3 h-3 text-emerald-700" />}
          <span>Pengurus Konten</span>
        </span>
      );
    case 'guru_akademik':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300 shadow-2xs ${className}`}
        >
          {showIcon && <GraduationCap className="w-3 h-3 text-sky-700" />}
          <span>Guru Akademik</span>
        </span>
      );
    case 'user':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs ${className}`}
        >
          {showIcon && <Users className="w-3 h-3 text-purple-700" />}
          <span>Santri / Member</span>
        </span>
      );
  }
};

// ==============================================================================
// 3. ROLEGUARD CORE COMPONENT
// ==============================================================================

export interface RoleGuardProps {
  children: React.ReactNode;
  /** Daftar peran spesifik yang diizinkan (opsional jika inferensi via path) */
  allowedRoles?: UserRole[];
  /** Nama modul spesifik sesuai MODULE_ACCESS (opsional) */
  module?: ModuleKey;
  /** Izinkan santri/user mengakses halaman ini (opsional) */
  allowSantri?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  module,
  allowSantri = false,
}) => {
  const { isAuthenticated, role, profile, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --------------------------------------------------------------------------
  // GOTRUE NULL-TOKEN ERROR INVARIANT AUTO-RECOVERY
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleGoTrueError = () => {
      try {
        // Cek apakah ada session/token yang corrupt di localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('sb-') || key.includes('supabase.auth.token'))) {
            const rawVal = localStorage.getItem(key);
            if (rawVal && (rawVal.includes('"recovery_token":null') || rawVal.includes('"confirmation_token":null'))) {
              console.warn('[GoTrue Security Handshake] Mendeteksi token NULL usang. Menjalankan auto-clean dan auto-signOut...');
              localStorage.removeItem(key);
              signOut();
              navigate('/admin/login', { replace: true });
              return;
            }
          }
        }
      } catch (err) {
        console.warn('GoTrue Token Check warning:', err);
      }
    };

    handleGoTrueError();
  }, [signOut, navigate]);

  // Evaluasi Hak Akses Modul Berdasarkan Spesifikasi PPJM
  const effectiveAllowedRoles = useMemo<UserRole[]>(() => {
    if (allowedRoles && allowedRoles.length > 0) {
      return allowSantri ? [...allowedRoles, 'user'] : allowedRoles;
    }

    if (module && MODULE_ACCESS[module]) {
      const roles = MODULE_ACCESS[module];
      return allowSantri ? [...roles, 'user'] : roles;
    }

    // Inferensi modul dari rute URL saat ini
    const currentPath = location.pathname.toLowerCase();
    for (const [routePrefix, modKey] of Object.entries(PATH_TO_MODULE)) {
      if (currentPath === routePrefix || currentPath.startsWith(`${routePrefix}/`)) {
        const roles = MODULE_ACCESS[modKey];
        return allowSantri ? [...roles, 'user'] : roles;
      }
    }

    // Default akses pengurus umum
    return allowSantri
      ? ['super_admin', 'pengurus_konten', 'guru_akademik', 'user']
      : ['super_admin', 'pengurus_konten', 'guru_akademik'];
  }, [allowedRoles, module, location.pathname, allowSantri]);

  // Audit Log Alert untuk Akses Tidak Sah
  useEffect(() => {
    if (!loading && isAuthenticated && role !== 'super_admin' && !effectiveAllowedRoles.includes(role)) {
      console.warn(`[Security Alert 403] Akun ${profile?.full_name || role} (${role}) mencoba mengakses: ${location.pathname}. Izin yang dibutuhkan: ${effectiveAllowedRoles.join(', ')}.`);
    }
  }, [loading, isAuthenticated, role, effectiveAllowedRoles, location.pathname, profile]);

  // 1. STATE LOADING / VERIFIKASI SESI GOTRUE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2116] via-[#05110B] to-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#0E7A4C] via-[#C8A951] to-emerald-400 p-0.5 animate-spin">
          <div className="w-full h-full bg-[#0A2116] rounded-3xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#C8A951] animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-xs font-black text-emerald-300 tracking-wider uppercase animate-pulse">
          Memverifikasi Otorisasi Sesi Pengurus...
        </p>
        <span className="text-[10px] text-emerald-100/60 font-mono mt-1">
          PP Jauharul Maknuun • Zero-IT CMS Guard
        </span>
      </div>
    );
  }

  // 2. STATE BELUM LOGIN: REDIRECT KE /ADMIN/LOGIN DENGAN SAVE LOCATION
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. STATE CEK PERAN:
  // - super_admin (Level 4 Root) selalu lolos ke seluruh modul
  // - Peran lain wajib terdaftar pada effectiveAllowedRoles
  const isAuthorized = role === 'super_admin' || effectiveAllowedRoles.includes(role);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2116] via-[#071810] to-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Top Decorative Ring */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>Akses Ditolak (403 Forbidden)</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Izin Akses Tidak Mencukupi
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Halaman administratif ini hanya dapat diakses oleh peran pengurus yang berwenang.
            </p>
          </div>

          {/* Info Akun yang Sedang Aktif */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Akun Anda:</span>
              <RoleBadge role={role} />
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-slate-300 truncate">Nama: {profile?.full_name || 'Pengguna'}</div>
              <div className="text-slate-400 truncate">Path: {location.pathname}</div>
              <div className="text-amber-400 text-[10px]">
                Izin Diperlukan: {effectiveAllowedRoles.map(r => r === 'user' ? 'Santri' : r).join(', ')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              to={role === 'user' ? '/profil' : '/admin/dashboard'}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{role === 'user' ? 'Portal Santri' : 'Dashboard Saya'}</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-xs font-black text-white shadow-md transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Ganti Akun</span>
            </button>
          </div>

          <div className="pt-1">
            <Link
              to="/login"
              className="text-[11px] text-[#C8A951] hover:underline inline-flex items-center gap-1"
            >
              <span>Uji coba masuk cepat dengan peran lain</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 4. AKSES DITERIMA: RENDER KONTEN
  return <>{children}</>;
};

export default RoleGuard;
