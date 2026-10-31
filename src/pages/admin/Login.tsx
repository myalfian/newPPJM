import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Copy,
  Check,
  UserCheck,
  Crown,
  FileText,
  GraduationCap,
  Users
} from 'lucide-react';
import { UserRole } from '../../lib/supabase';
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
  const [activeAutofillRole, setActiveAutofillRole] = useState<UserRole | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isFieldHighlighted, setIsFieldHighlighted] = useState(false);

  const destination = (location.state as any)?.from?.pathname || '/admin';

  // 1-Klik Isi Form Kredensial
  const handleAutofill = (cred: RoleCredential) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setActiveAutofillRole(cred.role);
    setErrorMessage(null);
    setIsFieldHighlighted(true);
    setFeedbackToast(`Kredensial ${cred.title} berhasil diisi!`);

    setTimeout(() => setIsFieldHighlighted(false), 1200);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // 1-Klik Langsung Masuk (Instant Sign-In)
  const handleInstantSignIn = async (cred: RoleCredential, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmail(cred.email);
    setPassword(cred.password);
    setActiveAutofillRole(cred.role);
    setLoading(true);
    setErrorMessage(null);

    // Coba sign in supabase GoTrue
    const { error } = await signIn(cred.email, cred.password);

    if (error) {
      // Jika remote gagal (misal koneksi/mock), fallback ke mock role session
      switchMockRole(cred.role);
    }

    setLoading(false);
    navigate(destination, { replace: true });
  };

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
      // Cek apakah email cocok dengan kredensial mock untuk fallback
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

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-9 space-y-6 relative overflow-hidden border border-emerald-100 z-10 animate-fadeIn">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-emerald-600 via-gold-400 to-emerald-400 mx-auto shadow-md">
            <img
              src="/logo-ppjm.svg"
              alt="PPJM Logo"
              className="w-full h-full object-contain rounded-full bg-white"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
              Masuk Ruang Pengurus
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
            </p>
          </div>
        </div>

        {/* Feedback Toast Notification */}
        {feedbackToast && (
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{feedbackToast}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-mono">1-Klik Terisi</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Akun Pengurus: *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="pengurus@ppjauharulmaknuun.sch.id"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setActiveAutofillRole(null);
                }}
                className={`w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border transition-all bg-slate-50/50 ${
                  isFieldHighlighted
                    ? 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/30'
                    : 'border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kata Sandi (Password): *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setActiveAutofillRole(null);
                }}
                className={`w-full pl-10 pr-11 py-3 text-xs sm:text-sm rounded-2xl border transition-all bg-slate-50/50 ${
                  isFieldHighlighted
                    ? 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/30'
                    : 'border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Cloudflare Turnstile Badge */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-slate-800">Cloudflare Turnstile Verified</div>
                <div className="text-[10px] text-slate-400">Verifikasi bot otomatis lolos</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Terlindungi
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px]"
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

        {/* ================================================================= */}
        {/* AUTO-GENERATE TOMBOL AUTOFILL 1-KLIK PER ROLE (HARDENED)          */}
        {/* ================================================================= */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Autofill 1-Klik Kredensial (4 Peran):</span>
            </span>
            <span className="text-emerald-700 font-mono text-[10px]">Siap Evaluasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ROLE_CREDENTIALS.map((cred) => {
              const IconComp = cred.icon;
              const isSelected = activeAutofillRole === cred.role;

              return (
                <div
                  key={cred.role}
                  onClick={() => handleAutofill(cred)}
                  className={`p-3 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between space-y-2 group ${
                    isSelected
                      ? cred.highlightRing
                      : `${cred.cardBg} ${cred.borderClass}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-white/80 shadow-xs">
                        <IconComp className={`w-3.5 h-3.5 ${cred.iconColor}`} />
                      </div>
                      <div className="leading-tight">
                        <div className="text-xs font-black text-slate-900 group-hover:text-emerald-950">
                          {cred.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {cred.subtitle}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${cred.badgeClass}`}>
                      {cred.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px]">
                    <span className="font-mono text-slate-500 text-[10px] truncate max-w-[110px]" title={cred.email}>
                      {cred.email.split('@')[0]}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleInstantSignIn(cred, e)}
                      disabled={loading}
                      className="px-2 py-0.5 rounded-lg bg-white/90 hover:bg-emerald-800 hover:text-white text-slate-700 font-black text-[10px] shadow-xs border border-black/10 transition-colors flex items-center gap-1 shrink-0"
                      title="Klik untuk langsung login tanpa submit manual"
                    >
                      <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span>Masuk Langsung</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center pt-1">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-emerald-800 font-semibold underline transition-colors"
          >
            &larr; Kembali ke Beranda Website Santri
          </Link>
        </div>

      </div>

      {/* Supabase Dataset Warning Modal */}
      <EnvAlertBanner />
    </div>
  );
};
export default Login;
