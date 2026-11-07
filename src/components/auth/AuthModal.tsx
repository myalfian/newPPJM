import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Presentation,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import {
  AppRole,
  ROLE_LABEL,
  canAccessPath,
  homeForRole,
  parseAppRole,
  safeRedirectPath,
} from '../../lib/roles';
import {
  AUTH_MODAL_EVENT,
  type AuthModalDetail,
  type AuthModalTab,
  type AuthModalView,
} from '../../lib/authModal';

const INTERNAL_EMAIL_DOMAIN = 'jm.internal';
const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-60';

const TABS: { key: AuthModalTab; label: string; icon: React.ElementType }[] = [
  { key: 'guest', label: 'Guest', icon: User },
  { key: 'santri', label: 'Santri', icon: GraduationCap },
  { key: 'guru', label: 'Guru', icon: Presentation },
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
];

const INFO: Record<AuthModalTab, { title: string; points: string[] }> = {
  guest: {
    title: 'Mode Guest',
    points: [
      'Jelajahi seluruh website publik tanpa akun.',
      'Lihat berita, galeri, prestasi, program, dan info SPMB.',
      'Login kapan saja untuk membuka portal sesuai peran Anda.',
    ],
  },
  santri: {
    title: 'Portal Santri',
    points: [
      'Lihat dan kumpulkan tugas, perbarui jawaban selama belum dinilai.',
      'Pantau nilai, feedback guru, dan progres hafalan.',
      'Ubah profil dan biodata Anda sendiri.',
    ],
  },
  guru: {
    title: 'Portal Guru & Musyrif',
    points: [
      'Buat dan kelola tugas, nilai pengumpulan santri.',
      'Lihat performa per kelas dan input nilai.',
      'Tulis berita dan materi untuk website.',
    ],
  },
  admin: {
    title: 'Panel Admin',
    points: [
      'Kelola konten website, pengguna, dan hak akses.',
      'Khusus Super Admin, Yayasan, Kepsek, dan tim pengelola.',
      'Setiap aksi tercatat pada audit log.',
    ],
  },
};

const REGISTER_ROLES: { value: string; label: string }[] = [
  { value: 'santri', label: 'Santri / Calon Santri & Wali' },
];

/* ════════════════════════════════════════════════════════════════════════
 *   Login Form — clean responsive card (Figma/Behance-inspired)
 * ════════════════════════════════════════════════════════════════════════ */
interface LoginFormProps {
  expected: AuthModalTab | null;
  redirectTo: string | null;
  onToast: (t: ToastMsg) => void;
  onClose: () => void;
}

type ToastMsg = { kind: 'success' | 'error' | 'info'; text: string };

const LoginForm: React.FC<LoginFormProps> = ({ expected, redirectTo, onToast, onClose }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // Inline validation states
  const [touchedId, setTouchedId] = useState(false);
  const [touchedPw, setTouchedPw] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const idValidationError = useMemo(() => {
    if (!touchedId || !identifier.trim()) return '';
    const val = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^[0-9+ -]{8,20}$/.test(val);
    const isUsername = /^[a-zA-Z0-9._-]{3,30}$/.test(val);
    if (!isEmail && !isPhone && !isUsername) {
      return 'Format nomor WhatsApp, email, atau username belum valid.';
    }
    return '';
  }, [identifier, touchedId]);

  const pwValidationError = useMemo(() => {
    if (!touchedPw || !password) return '';
    if (password.length < 6) {
      return 'Kata sandi minimal 6 karakter.';
    }
    return '';
  }, [password, touchedPw]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedId(true);
    setTouchedPw(true);

    if (busy || cooldown > 0) return;
    if (idValidationError || pwValidationError || !identifier.trim() || !password) return;

    setBusy(true);
    setError('');

    const raw = identifier.trim();
    const email = raw.includes('@') ? raw : `${raw.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr || !data.user) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setCooldown(COOLDOWN_SECONDS);
        setAttempts(0);
      }
      setError('Username, email, atau kata sandi tidak cocok.');
      onToast({ kind: 'error', text: 'Login gagal. Anda tetap berada di sesi Guest.' });
      setBusy(false);
      return;
    }

    const { data: prof } = await (supabase as any)
      .from('profiles')
      .select('role, status_aktif, full_name')
      .eq('id', data.user.id)
      .maybeSingle();

    if (prof && prof.status_aktif === false) {
      await supabase.auth.signOut();
      setError('Akun ini dinonaktifkan oleh administrator.');
      onToast({ kind: 'error', text: 'Akun dinonaktifkan. Anda tetap sebagai Guest.' });
      setBusy(false);
      return;
    }

    const role: AppRole = parseAppRole(prof?.role) ?? 'santri';
    const wantedTab = expected;
    const roleTab: AuthModalTab | null =
      role === 'santri' ? 'santri' : role === 'guru' || role === 'musyrif' ? 'guru' : role === 'guest' ? null : 'admin';
    if (wantedTab && wantedTab !== 'guest' && roleTab && wantedTab !== roleTab) {
      onToast({ kind: 'info', text: `Akun Anda terdaftar sebagai ${ROLE_LABEL[role]}.` });
    } else {
      onToast({ kind: 'success', text: `Ahlan wa Sahlan, ${prof?.full_name ?? ROLE_LABEL[role]}!` });
    }

    const target = redirectTo && canAccessPath(role, redirectTo) ? redirectTo : homeForRole(role);
    setBusy(false);
    onClose();
    navigate(target, { replace: true });
  };

  const locked = cooldown > 0;
  const isFormValid = identifier.trim().length > 0 && password.length >= 6 && !idValidationError && !pwValidationError;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="auth-identifier" className="block text-xs font-bold text-slate-700 mb-1.5">
          Nomor WhatsApp / Email / Username
        </label>
        <div className="relative">
          <input
            id="auth-identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onBlur={() => setTouchedId(true)}
            required
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            disabled={busy || locked}
            className={`${inputCls} ${idValidationError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
            placeholder="mis. 081234567890 atau nama@email.com"
          />
        </div>
        {idValidationError && (
          <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{idValidationError}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 mb-1.5">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="auth-password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouchedPw(true)}
            required
            autoComplete="current-password"
            disabled={busy || locked}
            className={`${inputCls} pr-12 ${pwValidationError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
            placeholder="Minimal 6 karakter"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            className="absolute inset-y-0 right-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {pwValidationError && (
          <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{pwValidationError}</span>
          </p>
        )}
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] text-xs font-semibold text-rose-600">
        {locked ? `Terlalu banyak percobaan. Coba lagi dalam ${cooldown} detik.` : error}
      </div>

      <button
        type="submit"
        disabled={busy || locked || !isFormValid}
        className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0d4a28] py-3 text-sm font-bold text-white transition hover:bg-[#0a3a20] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
      >
        {busy ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden /> : <LogIn className="h-4.5 w-4.5" aria-hidden />}
        {busy ? 'Memverifikasi…' : 'Masuk ke Akun'}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Lupa kata sandi?{' '}
          <button
            type="button"
            onClick={() => onToast({ kind: 'info', text: 'Silakan hubungi administrator pondok untuk reset kata sandi.' })}
            className="font-bold text-[#115E59] hover:text-emerald-900 hover:underline min-h-[44px] inline-flex items-center"
          >
            Hubungi Admin
          </button>
        </p>
      </div>
    </form>
  );
};

/* ════════════════════════════════════════════════════════════════════════
 *   Register Form — clean mobile card
 * ════════════════════════════════════════════════════════════════════════ */
interface RegisterFormProps {
  onToast: (t: ToastMsg) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToast, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestedRole] = useState('santri');
  const [alamat, setAlamat] = useState('');
  const [alasan, setAlasan] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [touchedName, setTouchedName] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);

  const nameError = useMemo(() => {
    if (!touchedName || !fullName.trim()) return '';
    if (fullName.trim().length < 3) return 'Nama lengkap minimal 3 karakter.';
    return '';
  }, [fullName, touchedName]);

  const phoneError = useMemo(() => {
    if (!touchedPhone || !phone.trim()) return '';
    if (!/^[0-9+ -]{9,18}$/.test(phone.trim())) {
      return 'Format nomor WhatsApp tidak valid (mis. 081234567890).';
    }
    return '';
  }, [phone, touchedPhone]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedName(true);
    setTouchedPhone(true);

    if (busy) return;
    if (nameError || phoneError || !fullName.trim() || !phone.trim()) return;

    setBusy(true);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await (supabase as any).from('user_registrations').insert({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          requested_role: requestedRole,
          alamat: alamat.trim() || null,
          alasan: alasan.trim() || null,
          status: 'pending',
        });

        if (error) {
          onToast({ kind: 'error', text: `Gagal mengirim pendaftaran: ${error.message}` });
          setBusy(false);
          return;
        }
      }

      setSubmitted(true);
      onToast({ kind: 'success', text: 'Pendaftaran berhasil dikirim! Menunggu persetujuan Super Admin.' });
    } catch (err: any) {
      onToast({ kind: 'error', text: `Terjadi kesalahan: ${err?.message || 'Coba lagi.'}` });
    }
    setBusy(false);
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center py-4">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Pendaftaran Berhasil Dikirim</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Data pendaftaran akun santri telah diterima. Super Admin akan memverifikasi data Anda dan mengirimkan kredensial masuk ke nomor WhatsApp yang terdaftar.
        </p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="mt-2 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <LogIn className="h-4 w-4" aria-hidden /> Kembali ke Halaman Masuk
        </button>
      </div>
    );
  }

  const isFormValid = fullName.trim().length >= 3 && phone.trim().length >= 9 && !nameError && !phoneError;

  return (
    <form onSubmit={submit} className="space-y-3.5" noValidate>
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        <div className="space-y-1">
          <p className="font-bold">Ketentuan Pendaftaran Akun</p>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Formulir publik ini dikhususkan bagi <strong>Santri / Calon Santri &amp; Wali Santri</strong>. Akun Dewan Guru (Asatidz), Musyrif, dan Administrator dibuat langsung oleh Super Admin melalui panel internal.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 mb-1">
          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-slate-500" /> Nama Lengkap <span className="text-rose-500">*</span></span>
        </label>
        <input
          id="reg-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => setTouchedName(true)}
          required
          className={`${inputCls} ${nameError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
          placeholder="Nama santri / calon santri"
        />
        {nameError && (
          <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{nameError}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 mb-1">
          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-500" /> Nomor WhatsApp Aktif <span className="text-rose-500">*</span></span>
        </label>
        <input
          id="reg-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouchedPhone(true)}
          required
          type="tel"
          className={`${inputCls} ${phoneError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
          placeholder="081234567890"
        />
        {phoneError && (
          <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{phoneError}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1">
          <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-500" /> Email (opsional)</span>
        </label>
        <input
          id="reg-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className={inputCls}
          placeholder="email@contoh.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-slate-500" /> Kategori Pendaftar</span>
        </label>
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
          <span>Santri / Calon Santri &amp; Wali</span>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Jalur Santri
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="reg-alamat" className="block text-xs font-bold text-slate-700 mb-1">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> Kota / Asal Daerah (opsional)</span>
        </label>
        <input
          id="reg-alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className={inputCls}
          placeholder="mis. Gresik, Surabaya, Lamongan"
        />
      </div>

      <div>
        <label htmlFor="reg-alasan" className="block text-xs font-bold text-slate-700 mb-1">
          Keterangan Tambahan (opsional)
        </label>
        <textarea
          id="reg-alasan"
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
          placeholder="Catatan kelas, tahun angkatan, atau info pendaftaran santri..."
        />
      </div>

      <button
        type="submit"
        disabled={busy || !isFormValid}
        className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0d4a28] py-3 text-sm font-bold text-white transition hover:bg-[#0a3a20] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
      >
        {busy ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden /> : <UserPlus className="h-4.5 w-4.5" aria-hidden />}
        {busy ? 'Mengirim Pendaftaran…' : 'Kirim Pendaftaran Santri'}
      </button>
    </form>
  );
};

/* ════════════════════════════════════════════════════════════════════════
 *   AuthModal — global login + register overlay (mobile card style)
 * ════════════════════════════════════════════════════════════════════════ */
export const AuthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthModalView>('login');
  const [tab, setTab] = useState<AuthModalTab>('guest');
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const navigate = useNavigate();
  const { isGuest, loading, displayName, roleLabel, homePath, signOut } = useAuth();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<AuthModalDetail>).detail ?? {};
      setView(detail.view ?? 'login');
      setTab((detail.tab as AuthModalTab) ?? 'guest');
      setRedirectTo(safeRedirectPath(detail.redirect ?? null));
      setShowAccountForm(false);
      setHighlight(detail.from === 'guest');
      setIsOpen(true);
    };
    window.addEventListener(AUTH_MODAL_EVENT, onOpen);
    return () => window.removeEventListener(AUTH_MODAL_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!highlight) return;
    const t = window.setTimeout(() => setHighlight(false), 2800);
    return () => window.clearTimeout(t);
  }, [highlight]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  const continueAsGuest = useCallback(() => {
    close();
    if (redirectTo && canAccessPath('guest', redirectTo)) {
      navigate(redirectTo);
    }
  }, [close, navigate, redirectTo]);

  const info = INFO[tab];
  const showForm = tab !== 'guest' || showAccountForm;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3.5 sm:p-6" role="presentation">
          {/* Backdrop with fade */}
          <motion.div
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            onClick={close}
          />

          {/* Toast */}
          {toast && (
            <div
              role="status"
              aria-live="polite"
              className={`fixed left-1/2 top-4 z-[90] flex max-w-[92vw] -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-lg ${
                toast.kind === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : toast.kind === 'error'
                    ? 'border-rose-200 bg-rose-50 text-rose-900'
                    : 'border-sky-200 bg-sky-50 text-sky-900'
              }`}
            >
              {toast.kind === 'success' ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <AlertCircle className="h-4 w-4" aria-hidden />}
              {toast.text}
            </div>
          )}

          {/* Modal Panel with subtle scale & slide-up */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-heading"
            className="relative z-10 grid w-full max-w-[56rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] lg:grid-cols-[1fr_17.5rem]"
            style={{ maxHeight: 'calc(100vh - 2.5rem)' }}
          >
            {/* Close button with >= 44x44px touch target */}
            <button
              type="button"
              onClick={close}
              aria-label="Tutup dialog masuk"
              className="absolute right-3 top-3 z-20 min-w-[44px] min-h-[44px] grid place-items-center rounded-full bg-white/85 text-slate-500 shadow-xs backdrop-blur hover:bg-white hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <X className="h-5 w-5" />
            </button>

        {/* LEFT: form area */}
        <div className="overflow-y-auto p-5 sm:p-7" style={{ maxHeight: 'calc(100vh - 3rem)' }}>
          {/* View toggle: Login / Daftar */}
          <div className="mb-4 flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setView('login')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                view === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="mr-1.5 inline-block h-4 w-4" aria-hidden />
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setView('register')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                view === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="mr-1.5 inline-block h-4 w-4" aria-hidden />
              Daftar Akun
            </button>
          </div>

          {view === 'login' ? (
            <>
              <h2 id="auth-modal-heading" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Masuk ke Jauharul Maknuun
              </h2>
              <p className="mt-1 text-sm text-slate-500">Pilih peran Anda, atau lanjutkan menjelajah sebagai Guest.</p>

              {/* Role tabs */}
              <div role="tablist" aria-label="Pilih peran login" className="mt-5 grid grid-cols-4 gap-1 rounded-2xl bg-slate-100 p-1">
                {TABS.map(({ key, label, icon: Icon }) => {
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      role="tab"
                      type="button"
                      id={`tab-${key}`}
                      aria-selected={active}
                      aria-controls="auth-panel"
                      onClick={() => {
                        setTab(key);
                        setShowAccountForm(false);
                      }}
                      className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11.5px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:flex-row sm:justify-center sm:gap-1.5 sm:text-xs ${
                        active ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      } ${key === 'guest' && highlight ? 'animate-pulse ring-4 ring-emerald-300/70' : ''}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div id="auth-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-5">
                {!loading && !isGuest ? (
                  <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                      Anda sudah masuk sebagai <strong>{displayName ?? 'Akun Saya'}</strong> ({roleLabel}).
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={() => { close(); navigate(homePath); }} className="flex-1 rounded-xl bg-[#0d4a28] px-4 py-2.5 text-sm font-bold text-white">
                        Buka dashboard
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut();
                          setToast({ kind: 'info', text: 'Anda keluar. Kembali sebagai Guest.' });
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                      >
                        <LogOut className="h-4 w-4" aria-hidden /> Keluar
                      </button>
                    </div>
                  </div>
                ) : showForm ? (
                  <LoginForm expected={tab === 'guest' ? null : tab} redirectTo={redirectTo} onToast={setToast} onClose={close} />
                ) : (
                  <div className="space-y-3">
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                      Anda menjelajah sebagai <strong className="text-slate-900">Guest</strong>. Tidak perlu akun untuk melihat website publik.
                    </p>
                    <button type="button" onClick={continueAsGuest} className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
                      Lanjutkan sebagai Guest
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAccountForm(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4a28] py-3 text-sm font-bold text-white hover:bg-[#0a3a20]"
                    >
                      <LogIn className="h-4 w-4" aria-hidden /> Login dengan Akun
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom link to register */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-500">
                  Belum punya akun?{' '}
                  <button type="button" onClick={() => setView('register')} className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline">
                    Daftar sebagai pengguna baru
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 id="auth-modal-heading" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Daftar Akun Baru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Isi data Anda. Super Admin akan memverifikasi dan mengirimkan kredensial login.
              </p>
              <div className="mt-5">
                <RegisterForm onToast={setToast} onSwitchToLogin={() => setView('login')} />
              </div>

              {/* Bottom link to login */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-500">
                  Sudah punya akun?{' '}
                  <button type="button" onClick={() => setView('login')} className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline">
                    Masuk di sini
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: role info sidebar (hidden on mobile & when registering) */}
        {view === 'login' && (
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0a4825] via-[#0f5132] to-[#126b3c] p-6 text-white lg:block" aria-live="polite">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#d4af37]/20 blur-3xl" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#ffdd6b]">Peran aktif</p>
            <h3 className="mt-1 text-xl font-black">{info.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {info.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] leading-relaxed text-emerald-50">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ffdd6b]" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/15 pt-3 text-[11px] text-emerald-100/80">
              Lupa kata sandi? Hubungi admin pondok untuk reset kredensial.
            </p>
          </aside>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
