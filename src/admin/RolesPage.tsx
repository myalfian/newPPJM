import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Info,
  Lock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import {
  ADMIN_SECTIONS,
  PERM_ACTIONS,
  NINE_ROLES,
  colOf,
  type PermAction,
  type PermRow,
} from './permissions';

export const RolesPage: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const canEdit = admin.can('roles', 'edit') || admin.profile?.role === 'super_admin';
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [savingCell, setSavingCell] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggle = async (role: string, section: string, action: PermAction, value: boolean) => {
    if (role === 'super_admin') return; // Super admin always has full access
    setErr('');
    const cellKey = `${role}:${section}:${action}`;
    setSavingCell(cellKey);

    const cur = admin.perms.find((p) => p.role === role && p.section === section);
    const row: PermRow = {
      role,
      section,
      can_view: cur?.can_view ?? false,
      can_create: cur?.can_create ?? false,
      can_edit: cur?.can_edit ?? false,
      can_delete: cur?.can_delete ?? false,
      can_publish: cur?.can_publish ?? false,
      [colOf(action)]: value,
    };

    const { error } = await db
      .from('role_permissions')
      .upsert({ ...row, updated_at: new Date().toISOString() });

    setSavingCell(null);
    if (error) {
      setErr('Gagal menyimpan perubahan izin: ' + error.message);
      return;
    }
    await admin.reloadPerms();
    showToast(`Izin "${action.toUpperCase()}" untuk role "${role}" pada modul "${section}" diperbarui.`);
  };

  const filteredSections = useMemo(() => {
    if (selectedCategory === 'all') return ADMIN_SECTIONS;
    return ADMIN_SECTIONS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const displayedRoles = useMemo(() => {
    if (selectedRoleFilter === 'all') return NINE_ROLES;
    return NINE_ROLES.filter((r) => r.value === selectedRoleFilter);
  }, [selectedRoleFilter]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#115E59] px-4 py-3 text-xs font-bold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-200" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#115E59] border border-teal-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Role-Based Access Control (9 Roles)
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl font-bold text-stone-900">
            Manajemen 9 Role & Matriks Permission
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-500">
            Atur hak akses spesifik untuk 9 role resmi SMP Plus Jauharul Maknuun (termasuk modul <code>santri_tugas</code>, <code>guru_tugas</code>, <code>performance</code>, dan <code>profile</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
          >
            <Users className="h-4 w-4" />
            Kelola Semua User (/admin/users)
          </Link>
        </div>
      </div>

      {err && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {err}
        </div>
      )}

      {/* 9 Role Cards Overview with Descriptions & Route Scope */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#115E59]" />
            Daftar 9 Role Resmi & Cakupan Otoritas
          </h2>
          {selectedRoleFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('all')}
              className="text-xs font-bold text-[#115E59] hover:underline"
            >
              Tampilkan Semua 9 Role
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NINE_ROLES.map((r) => {
            const isSelected = selectedRoleFilter === r.value;
            return (
              <div
                key={r.value}
                onClick={() => setSelectedRoleFilter(isSelected ? 'all' : r.value)}
                className={`cursor-pointer rounded-2xl border p-4 transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#115E59] bg-teal-50/40 ring-2 ring-[#115E59]/20'
                    : 'border-stone-200/80 bg-white hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${r.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${r.dotClass}`} />
                      {r.label}
                    </span>
                    <code className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-mono text-stone-600">
                      {r.value}
                    </code>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{r.description}</p>

                  <ul className="mt-3 space-y-1 border-t border-stone-100 pt-2.5">
                    {r.permissionsSummary.slice(0, 3).map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#115E59] shrink-0 mt-0.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">
                    Rute Utama: <strong className="text-stone-700">{r.defaultRoute}</strong>
                  </span>
                  <Link
                    to={r.defaultRoute}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 font-bold text-[#115E59] hover:underline"
                  >
                    Buka Rute <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter for Matrix */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 mr-1">Filter Modul:</span>
          {[
            { key: 'all', label: `Semua Modul (${ADMIN_SECTIONS.length})` },
            { key: 'Portal & Akademik', label: 'Portal Santri, Guru, Performance & Profile' },
            { key: 'Pengaturan & Keamanan', label: 'Users & Role Management' },
            { key: 'CMS Website', label: 'Konten Website Publik' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === cat.key
                  ? 'bg-[#115E59] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <Info className="h-3.5 w-3.5 text-[#115E59]" />
          <span>Klik kotak centang untuk mengubah izin secara langsung di Supabase</span>
        </div>
      </div>

      {/* Permission Matrix Tables per Section */}
      <div className="space-y-4">
        {filteredSections.map((s) => {
          const isNewCoreModule = ['santri_tugas', 'guru_tugas', 'performance', 'profile', 'users', 'roles'].includes(
            s.key
          );
          return (
            <div
              key={s.key}
              className={`overflow-x-auto rounded-2xl border bg-white shadow-xs ${
                isNewCoreModule ? 'border-teal-600/30 ring-1 ring-teal-500/10' : 'border-stone-200/80'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 bg-[#FAF8F5] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-stone-900">{s.label}</span>
                  <code className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-mono font-bold text-[#115E59] border border-teal-200">
                    {s.key}
                  </code>
                </div>
                {s.category && (
                  <span className="text-[11px] font-semibold text-stone-500">{s.category}</span>
                )}
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs text-stone-500">
                    <th className="px-5 py-2.5 font-bold">Role Pengguna</th>
                    <th className="px-3 py-2.5 font-bold">Kode Role</th>
                    {PERM_ACTIONS.map((a) => (
                      <th key={a.key} className="px-3 py-2.5 text-center font-bold">
                        {a.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayedRoles.map((r) => {
                    const isSuperRole = r.value === 'super_admin';
                    const row = admin.perms.find((p) => p.role === r.value && p.section === s.key);
                    return (
                      <tr key={r.value} className="hover:bg-stone-50/70 transition">
                        <td className="px-5 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${r.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${r.dotClass}`} />
                            {r.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-stone-400">{r.value}</td>
                        {PERM_ACTIONS.map((a) => {
                          const checked = isSuperRole ? true : Boolean(row?.[colOf(a.key)]);
                          const isBusy = savingCell === `${r.value}:${s.key}:${a.key}`;
                          return (
                            <td key={a.key} className="px-3 py-2.5 text-center">
                              {isSuperRole ? (
                                <span
                                  className="inline-flex items-center justify-center text-zinc-900"
                                  title="Super Admin selalu memiliki akses penuh"
                                >
                                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                                </span>
                              ) : (
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 cursor-pointer rounded accent-[#115E59] disabled:opacity-50"
                                  disabled={!canEdit || isBusy}
                                  checked={checked}
                                  onChange={(e) => toggle(r.value, s.key, a.key, e.target.checked)}
                                  aria-label={`${r.label} ${a.label} ${s.label}`}
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};
