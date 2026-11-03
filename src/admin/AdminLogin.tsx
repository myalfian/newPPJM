import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { db, useAdminSession } from './useAdminSession';

export const INTERNAL_EMAIL_DOMAIN = 'jm.internal';

export const AdminLogin: React.FC = () => {
  const admin = useAdminSession();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!admin.loading && admin.session && admin.isStaff) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const email = id.includes('@') ? id.trim() : `${id.trim().toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;
    const { error } = await db.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) setErr('Username atau kata sandi salah.');
    else nav('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#FAF7F0] p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-teal-900/10 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#115E59] text-sm font-black text-white">JM</div>
          <h1 className="pt-2 text-lg font-bold text-teal-950">Masuk Admin</h1>
          <p className="text-xs text-zinc-500">PP Jauharul Maknuun</p>
        </div>
        <label className="block space-y-1 text-xs font-semibold text-zinc-700">
          Username atau email
          <input value={id} onChange={(e) => setId(e.target.value)} required autoComplete="username"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#115E59] focus:ring-2 focus:ring-[#115E59]/15" />
        </label>
        <label className="block space-y-1 text-xs font-semibold text-zinc-700">
          Kata sandi
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#115E59] focus:ring-2 focus:ring-[#115E59]/15" />
        </label>
        {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-[#115E59] py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {busy ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </div>
  );
};

