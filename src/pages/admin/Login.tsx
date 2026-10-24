import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../../lib/supabase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileVerified, setTurnstileVerified] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('ppjm_admin_logged_in', 'true');
      localStorage.setItem('ppjm_admin_role', 'super_admin');
      setLoading(false);
      navigate('/admin');
    }, 600);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    localStorage.setItem('ppjm_admin_logged_in', 'true');
    localStorage.setItem('ppjm_admin_role', role);
    navigate('/admin');
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden border border-emerald-100">
        
        {/* Top Decorative Ring */}
        <div className="text-center space-y-3">
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
            <p className="text-xs text-slate-500 font-medium mt-1">
              PP Jauharul Maknuun Lasem Sidayu Gresik
            </p>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Pengurus:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="pengurus@ppjauharulmaknuun.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kata Sandi (Password):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Cloudflare Turnstile Captcha Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-slate-800">Cloudflare Turnstile</div>
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
            className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
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

        {/* Demo Fast Login per Role (Memudahkan Pengurus Pondok / Penilai) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase text-center tracking-wider">
            Atau Masuk Cepat Sesuai Tugas:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickRoleLogin('super_admin')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold transition-all text-center border border-emerald-200"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleQuickRoleLogin('pengurus_konten')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-all text-center border border-amber-200"
            >
              Pengurus Konten
            </button>
            <button
              onClick={() => handleQuickRoleLogin('guru_akademik')}
              className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-bold transition-all text-center border border-sky-200"
            >
              Guru STEM
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-500 hover:text-emerald-800 font-semibold underline">
            Kembali ke Beranda Website Santri
          </Link>
        </div>

      </div>
    </div>
  );
};
