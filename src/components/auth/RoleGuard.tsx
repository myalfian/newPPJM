import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/supabase';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles = ['super_admin', 'pengurus_konten', 'guru_akademik']
}) => {
  const { isAuthenticated, role, loading, hasRole, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-gold-400 to-emerald-400 p-0.5 animate-spin">
          <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-gold-400 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-xs font-bold text-zinc-400 tracking-wider uppercase">
          Memverifikasi Otorisasi Akses...
        </p>
      </div>
    );
  }

  // If not authenticated, redirect to login page with return url
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If user role is not permitted to access this module/area
  if (!hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Akses Ditolak (403 Forbidden)
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Akun Anda saat ini memiliki peran <strong className="text-gold-400 uppercase font-mono">{role}</strong>. Halaman ini memerlukan hak akses administratif khusus ({allowedRoles.join(', ')}).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-left text-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Info Otorisasi:</div>
            <div className="font-mono text-zinc-300 truncate">Path: {location.pathname}</div>
            <div className="font-mono text-emerald-400">Status: Authenticated (Insufficient Role)</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ke Beranda</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-xs font-bold text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Ganti Akun</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
