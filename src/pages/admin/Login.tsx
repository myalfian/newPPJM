import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound,
  X,
  Loader2,
  Phone,
  ShieldCheck,
  Crown,
  FileText,
  GraduationCap,
  Users
} from 'lucide-react';
import { UserRole, supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { EnvAlertBanner } from '../../components/common/EnvAlertBanner';

export interface RoleCredential {
  role: UserRole;
  title: string;
  subtitle: string;
  email: string;
  password: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  cardBg: string;
  borderClass: string;
  badgeClass: string;
  highlightRing: string;
}

export const ROLE_CREDENTIALS: RoleCredential[] = [
  {
    role: 'super_admin',
    title: 'Super Admin',
    subtitle: 'KH. Jauharul Maknuun, M.Pd.',
    email: 'admin@ppjauharulmaknuun.sch.id',
    password: 'PPJM_SuperAdmin2026!',
    badge: 'Root Clearance',
    icon: Crown,
    iconColor: 'text-amber-600',
    cardBg: 'bg-amber-50/80 hover:bg-amber-100/90',
    borderClass: 'border-amber-200/90',
    badgeClass: 'bg-amber-200/80 text-amber-900',
    highlightRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-100/80'
  },
  {
    role: 'pengurus_konten',
    title: 'Pengurus Konten',
    subtitle: 'Ustadz M. Ridlwan, S.Kom.',
    email: 'konten@ppjauharulmaknuun.sch.id',
    password: 'PPJM_KontenMedia2026!',
    badge: 'Media & Warta',
    icon: FileText,
    iconColor: 'text-emerald-700',
    cardBg: 'bg-emerald-50/80 hover:bg-emerald-100/90',
    borderClass: 'border-emerald-200/90',
    badgeClass: 'bg-emerald-200/80 text-emerald-900',
    highlightRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100/80'
  },
  {
    role: 'guru_akademik',
    title: 'Guru Akademik',
    subtitle: 'Ustadz Riski, S.T.',
    email: 'akademik@ppjauharulmaknuun.sch.id',
    password: 'PPJM_GuruAkademik2026!',
    badge: 'STEM & Mandarin',
    icon: GraduationCap,
    iconColor: 'text-sky-700',
    cardBg: 'bg-sky-50/80 hover:bg-sky-100/90',
    borderClass: 'border-sky-200/90',
    badgeClass: 'bg-sky-200/80 text-sky-900',
    highlightRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-100/80'
  },
  {
    role: 'user',
    title: 'Santri / User',
    subtitle: 'Ahmad Zaki Al-Maknuuni',
    email: 'santri@ppjauharulmaknuun.sch.id',
    password: 'PPJM_SantriMaju2026!',
    badge: 'Member Portal',
    icon: Users,
    iconColor: 'text-purple-700',
    cardBg: 'bg-purple-50/80 hover:bg-purple-100/90',
    borderClass: 'border-purple-200/90',
    badgeClass: 'bg-purple-200/80 text-purple-900',
    highlightRing: 'ring-2 ring-purple-500 border-purple-500 bg-purple-100/80'
  }
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, switchMockRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal Lupa Password State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const destination = (location.state as any)?.from?.pathname || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Harap isi email dan kata sandi.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      // Cek apakah email cocok dengan kredensial mock untuk fallback offline
      const match = ROLE_CREDENTIALS.find((c) => c.email.toLowerCase() === email.toLowerCase());
      if (match && password === match.password) {
        switchMockRole(match.role);
        navigate(destination, { replace: true });
        return;
      }

      setErrorMessage(error.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
      return;
    }

    navigate(destination, { replace: true });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Silakan masukkan alamat email yang terdaftar.');
      return;
    }

    try {
      setResetLoading(true);
      setResetError(null);
      setResetSuccess(null);

      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
          redirectTo: `${window.location.origin}/profil`,
        });

        if (error) {
          setResetError(error.message || 'Gagal mengirim instruksi pemulihan kata sandi.');
          return;
        }
      }

      setResetSuccess(
        'Alhamdulillah! Instruksi pemulihan kata sandi telah dikirimkan ke email Anda. Silakan periksa kotak masuk atau folder spam.'
      );
    } catch (err: any) {
      setResetError(err.message || 'Terjadi kesalahan sistem saat memproses pemulihan kata sandi.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-950 via-[#0A2116] to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-emerald-100 dark:border-zinc-800 z-10 animate-fade-in">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-[#0E7A4C] via-[#C8A951] to-emerald-400 mx-auto shadow-md">
            <img
              src="/logo-ppjm.svg"
              alt="PPJM Logo"
              className="w-full h-full object-contain rounded-full bg-white"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
              Masuk Akun PPJM
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Email Akun: *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="nama@ppjauharulmaknuun.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Kata Sandi: *
              </label>
              {/* LUPA PASSWORD LINK */}
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsForgotPasswordOpen(true);
                }}
                className="text-xs font-semibold text-[#0E7A4C] hover:text-[#0A2116] dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* SECTION DAFTAR (PENGGANTI AUTOFILL ITEM) */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#0E7A4C] text-white flex items-center justify-center shrink-0 shadow-xs">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                  Belum memiliki akun?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  Pendaftaran Santri Baru (SPMB)
                </p>
              </div>
            </div>

            <Link
              to="/spmb"
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 text-[#0E7A4C] dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-700 shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Daftar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-1">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-[#0E7A4C] dark:text-zinc-400 dark:hover:text-emerald-400 font-semibold underline transition-colors"
          >
            &larr; Kembali ke Beranda Website
          </Link>
        </div>

      </div>

      {/* =================================================================== */}
      {/* MODAL LUPA PASSWORD                                                */}
      {/* =================================================================== */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto animate-scale-in">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#C8A951] flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Lupa Kata Sandi
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Pemulihan akses akun resmi PPJM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetSuccess(null);
                  setResetError(null);
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              {resetError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instruksi Terkirim!</span>
                    </div>
                    <p className="leading-relaxed">{resetSuccess}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(false);
                      setResetSuccess(null);
                    }}
                    className="w-full py-3 rounded-xl bg-[#0E7A4C] text-white text-xs font-bold transition-all hover:bg-[#0A2116] cursor-pointer"
                  >
                    Kembali ke Halaman Login
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Masukkan alamat email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan aman untuk mengatur ulang kata sandi Anda.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Alamat Email Terdaftar: *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="contoh@ppjauharulmaknuun.sch.id"
                        className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Bantuan Kontak Sekretariat */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0E7A4C]" />
                      <span>Butuh Bantuan Lebih Lanjut?</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Hubungi Layanan Administrasi & IT Pondok Pesantren Jauharul Maknuun via WhatsApp:{' '}
                      <a
                        href="https://wa.me/6281234567801?text=Assalamu'alaikum%20Admin%20PPJM,%20saya%20mengalami%20kendala%20lupa%20password%20akun."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#0E7A4C] hover:underline"
                      >
                        +62 812-3456-7801
                      </a>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading || !resetEmail}
                      className="px-5 py-2.5 rounded-xl bg-[#0E7A4C] hover:bg-[#0A2116] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirimkan...</span>
                        </>
                      ) : (
                        <span>Kirim Link Reset</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Supabase Dataset Warning Banner */}
      <EnvAlertBanner />
    </div>
  );
};

export default Login;
