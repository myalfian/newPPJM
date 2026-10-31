import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
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
  UserCheck
} from 'lucide-react';

export interface RoleGuardProps {
  children: React.ReactNode;
  /** Daftar peran yang diizinkan mengakses modul ini */
  allowedRoles?: UserRole[];
  /** Nama modul untuk pesan error yang lebih informatif (opsional) */
  moduleName?: string;
  /** Izinkan santri/user melihat portal tertentu */
  allowSantri?: boolean;
}

// Pemetaan Hak Akses Modul Admin Default berdasarkan Jalur URL
const MODULE_ROLE_POLICIES: Record<string, UserRole[]> = {
  // Modul Akademik & STEM
  '/admin/stem': ['super_admin', 'guru_akademik'],
  '/admin/mandarin': ['super_admin', 'guru_akademik'],
  '/admin/hafidz': ['super_admin', 'guru_akademik'],
  
  // Modul Media & Publikasi
  '/admin/berita': ['super_admin', 'pengurus_konten'],
  '/admin/galeri': ['super_admin', 'pengurus_konten'],
  '/admin/slider': ['super_admin', 'pengurus_konten'],
  '/admin/kontak': ['super_admin', 'pengurus_konten'],
  '/admin/osis': ['super_admin', 'pengurus_konten'],
  '/admin/ekskul': ['super_admin', 'pengurus_konten'],

  // Modul Bersama Pengurus
  '/admin': ['super_admin', 'pengurus_konten', 'guru_akademik'],
  '/admin/dashboard': ['super_admin', 'pengurus_konten', 'guru_akademik'],
  '/admin/profil': ['super_admin', 'pengurus_konten', 'guru_akademik'],
  '/admin/agenda': ['super_admin', 'pengurus_konten', 'guru_akademik'],
  '/admin/prestasi': ['super_admin', 'pengurus_konten', 'guru_akademik'],
  '/admin/editor': ['super_admin', 'pengurus_konten', 'guru_akademik'],
  '/editor': ['super_admin', 'pengurus_konten', 'guru_akademik'],
};

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  moduleName,
  allowSantri = false,
}) => {
  const { isAuthenticated, role, profile, loading, hasRole, signOut } = useAuth();
  const location = useLocation();

  // Evaluasi aturan akses dinamis berdasarkan path URL jika allowedRoles tidak di-passing secara eksplisit
  const effectiveAllowedRoles = useMemo<UserRole[]>(() => {
    if (allowedRoles && allowedRoles.length > 0) {
      return allowSantri ? [...allowedRoles, 'user'] : allowedRoles;
    }

    // Cocokkan prefix rute di pemetaan kebijakan
    const currentPath = location.pathname.toLowerCase();
    for (const [routePrefix, policyRoles] of Object.entries(MODULE_ROLE_POLICIES)) {
      if (currentPath === routePrefix || currentPath.startsWith(`${routePrefix}/`)) {
        return allowSantri ? [...policyRoles, 'user'] : policyRoles;
      }
    }

    // Default akses pengurus umum
    return allowSantri
      ? ['super_admin', 'pengurus_konten', 'guru_akademik', 'user']
      : ['super_admin', 'pengurus_konten', 'guru_akademik'];
  }, [allowedRoles, location.pathname, allowSantri]);

  // Catat percobaan akses ilegal ke konsol (Audit Trail Sisi Klien)
  useEffect(() => {
    if (!loading && isAuthenticated && role !== 'super_admin' && !effectiveAllowedRoles.includes(role)) {
      console.warn(`[Security Alert 403] Akun ${profile?.full_name || role} (${role}) mencoba mengakses rute terproteksi: ${location.pathname}. Izin yang dibutuhkan: ${effectiveAllowedRoles.join(', ')}.`);
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
          Pondok Pesantren Jauharul Maknuun
        </span>
      </div>
    );
  }

  // 2. STATE BELUM LOGIN: REDIRECT KE /ADMIN/LOGIN
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. STATE CEK PERAN (ROLE HIERARCHY):
  // - super_admin (Level 4 Root) selalu lolos ke seluruh modul
  // - Peran lain harus terdaftar dalam effectiveAllowedRoles
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
              {moduleName ? (
                <>Modul <strong>{moduleName}</strong> memerlukan peran administratif khusus.</>
              ) : (
                <>Halaman administratif ini hanya dapat diakses oleh peran pengurus berwenang.</>
              )}
            </p>
          </div>

          {/* Info Akun yang Sedang Aktif */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Akun Anda:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30">
                {role === 'user' ? 'Santri / User' : role}
              </span>
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

  // 4. AKSES DITERIMA: RENDER KONTEN ADMIN
  return <>{children}</>;
};

export default RoleGuard;
