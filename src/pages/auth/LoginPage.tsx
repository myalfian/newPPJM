import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, GraduationCap, Loader2, LogIn, LogOut, Presentation, ShieldCheck, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import {
  AppRole,
  LOGIN_SECTION_ID,
  ROLE_LABEL,
  canAccessPath,
  homeForRole,
  parseAppRole,
  safeRedirectPath,
} from '../../lib/roles';

type TabKey = 'guest' | 'santri' | 'guru' | 'admin';

const INTERNAL_EMAIL_DOMAIN = 'jm.internal';
const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'guest', label: 'Guest', icon: User },
  { key: 'santri', label: 'Santri', icon: GraduationCap },
  { key: 'guru', label: 'Guru', icon: Presentation },
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
];

const INFO: Record<TabKey, { title: string; points: string[] }> = {
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

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-60';

interface LoginFormProps {
  expected: TabKey | null;
  redirectTo: string | null;
  onToast: (t: { kind: 'success' | 'error' | 'info'; text: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ expected, redirectTo, onToast }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || cooldown > 0) return;
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
      setError('Username/email atau kata sandi salah.');
      onToast({ kind: 'error', text: 'Login gagal. Anda tetap sebagai Guest.' });
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
      setError('Akun ini dinonaktifkan. Hubungi admin.');
      onToast({ kind: 'error', text: 'Akun dinonaktifkan. Anda tetap sebagai Guest.' });
      setBusy(false);
      return;
    }

    const role: AppRole = parseAppRole(prof?.role) ?? 'santri';
    const wantedTab = expected;
    const roleTab: TabKey | null = role === 'santri' ? 'santri' : role === 'guru' || role === 'musyrif' ? 'guru' : role === 'guest' ? null : 'admin';
    if (wantedTab && wantedTab !== 'guest' && roleTab && wantedTab !== roleTab) {
      onToast({ kind: 'info', text: `Akun Anda terdaftar sebagai ${ROLE_LABEL[role]}.` });
    } else {
      onToast({ kind: 'success', text: `Selamat datang, ${prof?.full_name ?? ROLE_LABEL[role]}!` });
    }

    const target = redirectTo && canAccessPath(role, redirectTo) ? redirectTo : homeForRole(role);
    setBusy(false);
    navigate(target, { replace: true });
  };

  const locked = cooldown > 0;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block space-y-1.5 text-xs font-bold text-slate-700">
        Username atau email
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          disabled={busy || locked}
          className={inputCls}
          placeholder="mis. ahmad.zaki"
        />
      </label>
      <label className="block space-y-1.5 text-xs font-bold text-slate-700">
        Kata sandi
        <span className="relative block">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={busy || locked}
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-slate-700"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
      </label>

      <div aria-live="polite" className="min-h-[1.25rem] text-xs font-semibold text-rose-600">
        {locked ? `Terlalu banyak percobaan. Coba lagi dalam ${cooldown} detik.` : error}
      </div>

      <button
        type="submit"
        disabled={busy || locked || !identifier.trim() || !password}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4a28] py-3 text-sm font-bold text-white transition hover:bg-[#0a3a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
        {busy ? 'Memproses…' : 'Masuk'}
      </button>
    </form>
  );
};

export const LoginPage: React.FC = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuest, loading, displayName, roleLabel, homePath, signOut } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);

  const asParam = params.get('as');
  const from = params.get('from');
  const redirectTo = useMemo(() => safeRedirectPath(params.get('redirect')), [params]);

  const initialTab: TabKey = asParam === 'santri' || asParam === 'guru' || asParam === 'admin' ? asParam : 'guest';
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [highlight, setHighlight] = useState(from === 'guest');
  const [toast, setToast] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => setTab(initialTab), [initialTab]);

  // Smooth-scroll to #login-section + pulse the Guest tab when arriving from the Guest button.
  useEffect(() => {
    const wantsScroll = location.hash === `#${LOGIN_SECTION_ID}` || from === 'guest' || from === 'guard';
    if (!wantsScroll) return;
    const t = window.setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    return () => window.clearTimeout(t);
  }, [location.hash, from]);

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

  const continueAsGuest = useCallback(() => navigate(redirectTo && canAccessPath('guest', redirectTo) ? redirectTo : '/'), [navigate, redirectTo]);

  const info = INFO[tab];
  const showForm = tab !== 'guest' || showAccountForm;

  return (
    <section
      id={LOGIN_SECTION_ID}
      ref={sectionRef}
      aria-labelledby="login-heading"
      className="scroll-mt-24 bg-gradient-to-b from-emerald-50/60 to-white px-4 py-8 sm:py-12"
    >
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 top-4 z-[80] flex max-w-[92vw] -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-lg ${
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

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-2">
        {/* LEFT: form */}
        <div className="p-5 sm:p-8">
          <h1 id="login-heading" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Masuk ke Jauharul Maknuun
          </h1>
          <p className="mt-1 text-sm text-slate-500">Pilih peran Anda, atau lanjutkan menjelajah sebagai Guest.</p>

          {from === 'guard' && redirectTo && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Halaman <code className="rounded bg-white/70 px-1">{redirectTo}</code> membutuhkan login.
            </p>
          )}

          {/* Tabs */}
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
                  aria-controls="login-panel"
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

          <div id="login-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-5">
            {!loading && !isGuest ? (
              <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="text-sm font-semibold text-emerald-900">
                  Anda sudah masuk sebagai <strong>{displayName ?? 'Akun Saya'}</strong> ({roleLabel}).
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => navigate(homePath)} className="flex-1 rounded-xl bg-[#0d4a28] px-4 py-2.5 text-sm font-bold text-white">
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
              <LoginForm expected={tab === 'guest' ? null : tab} redirectTo={redirectTo} onToast={setToast} />
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
        </div>

        {/* RIGHT: role info */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0a4825] via-[#0f5132] to-[#126b3c] p-8 text-white lg:block" aria-live="polite">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#d4af37]/20 blur-3xl" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#ffdd6b]">Peran aktif</p>
          <h2 className="mt-1 text-2xl font-black">{info.title}</h2>
          <ul className="mt-5 space-y-3">
            {info.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-emerald-50">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffdd6b]" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-white/15 pt-4 text-xs text-emerald-100/80">
            Lupa kata sandi? Hubungi admin pondok untuk reset kredensial.
          </p>
        </aside>
      </div>
    </section>
  );
};

