import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { KeyRound, Copy, X } from 'lucide-react';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import { ADMIN_SECTIONS, PERM_ACTIONS, STAFF_ROLES, colOf, type PermAction, type PermRow } from './permissions';
import { INTERNAL_EMAIL_DOMAIN } from './AdminLogin';

const randomPassword = (len = 14) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join('');
};

const slugName = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 2).join('.');
  const n = new Uint32Array(1);
  crypto.getRandomValues(n);
  return `${base || 'staf'}${String(n[0] % 900 + 100)}`;
};

const CredentialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('guru');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<{ username: string; password: string } | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const username = slugName(name);
    const password = randomPassword();
    const { data, error } = await db.functions.invoke('create-user', {
      body: { email: `${username}@${INTERNAL_EMAIL_DOMAIN}`, password, full_name: name, role, phone: phone || undefined },
    });
    setBusy(false);
    if (error || (data && (data as { error?: string }).error)) {
      setErr((data as { error?: string } | null)?.error ?? 'Gagal membuat akun. Hanya Super Admin yang dapat membagikan credential.');
      return;
    }
    setResult({ username, password });
  };

  const copy = () => result && navigator.clipboard.writeText(`Username: ${result.username}\nKata sandi: ${result.password}`);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-teal-950">Bagi Credential</h2>
          <button onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        </div>
        {result ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-teal-900/10 bg-[#FAF7F0] p-4 text-sm space-y-1 font-mono">
              <p>Username: <b>{result.username}</b></p>
              <p>Kata sandi: <b>{result.password}</b></p>
            </div>
            <p className="text-xs text-amber-800">Kata sandi hanya ditampilkan sekali. Salin dan sampaikan langsung ke yang bersangkutan.</p>
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white">
              <Copy size={15} /> Salin
            </button>
          </div>
        ) : (
          <form onSubmit={create} className="space-y-3">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm">
              {STAFF_ROLES.filter((r) => r.value !== 'super_admin').map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No. WhatsApp (opsional)"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm" />
            {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-[#115E59] py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {busy ? 'Membuat…' : 'Buat akun'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const RolesPage: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const canEdit = admin.can('roles', 'edit');
  const isSuper = admin.profile?.role === 'super_admin';
  const [modal, setModal] = useState(false);
  const [err, setErr] = useState('');

  const toggle = async (role: string, section: string, action: PermAction, value: boolean) => {
    setErr('');
    const cur = admin.perms.find((p) => p.role === role && p.section === section);
    const row: PermRow = {
      role, section,
      can_view: cur?.can_view ?? false, can_create: cur?.can_create ?? false, can_edit: cur?.can_edit ?? false,
      can_delete: cur?.can_delete ?? false, can_publish: cur?.can_publish ?? false,
      [colOf(action)]: value,
    };
    const { error } = await db.from('role_permissions').upsert({ ...row, updated_at: new Date().toISOString() });
    if (error) setErr('Gagal menyimpan perubahan izin.');
    await admin.reloadPerms();
  };

  const roles = STAFF_ROLES.filter((r) => r.value !== 'super_admin');

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-teal-950">Role & Credential</h1>
          <p className="text-sm text-zinc-600">Super Admin selalu punya akses penuh.</p>
        </div>
        {isSuper && (
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white">
            <KeyRound size={16} /> Bagi Credential
          </button>
        )}
      </div>
      {err && <p role="alert" className="text-xs text-red-600">{err}</p>}

      {ADMIN_SECTIONS.map((s) => (
        <div key={s.key} className="overflow-x-auto rounded-2xl border border-teal-900/10 bg-white shadow-sm">
          <p className="border-b border-teal-900/10 px-4 py-3 text-sm font-semibold text-teal-950">{s.label}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Role</th>
                {PERM_ACTIONS.map((a) => <th key={a.key} className="px-2 py-2 text-center font-medium">{a.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => {
                const row = admin.perms.find((p) => p.role === r.value && p.section === s.key);
                return (
                  <tr key={r.value} className="border-t border-zinc-100">
                    <td className="px-4 py-2">{r.label}</td>
                    {PERM_ACTIONS.map((a) => (
                      <td key={a.key} className="px-2 py-2 text-center">
                        <input type="checkbox" className="h-4 w-4 accent-[#115E59]" disabled={!canEdit}
                          checked={Boolean(row?.[colOf(a.key)])}
                          onChange={(e) => toggle(r.value, s.key, a.key, e.target.checked)}
                          aria-label={`${r.label} ${a.label} ${s.label}`} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {modal && <CredentialModal onClose={() => setModal(false)} />}
    </div>
  );
};

