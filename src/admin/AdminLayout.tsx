import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Landmark, History, Building2, ShieldCheck, Users, UserCircle2, ChevronsLeft, ChevronsRight,
  ExternalLink, LogOut, Menu, X, ChevronRight, Layers,
} from 'lucide-react';
import { useAdminSession, type AdminSession } from './useAdminSession';
import { STAFF_ROLES } from './permissions';
import { CRUD_SECTIONS, type NavGroupKey } from './sections';

type NavItem = { to: string; label: string; icon: React.ElementType; section?: string };
type NavGroup = { title: string; items: NavItem[] };

const crudGroup = (group: NavGroupKey): NavItem[] =>
  CRUD_SECTIONS.filter((s) => s.group === group).map((s) => ({
    to: `/admin/s/${s.key}`,
    label: s.label,
    icon: s.icon,
    section: s.key,
  }));

const GROUPS: NavGroup[] = [
  {
    title: 'Content',
    items: [
      { to: '/admin', label: 'Ringkasan', icon: LayoutDashboard },
      { to: '/admin/bulk', label: 'Bulk Upload & Konten', icon: Layers, section: 'galeri_foto' },
      { to: '/admin/visi-misi', label: 'Visi, Misi & Tujuan', icon: Landmark, section: 'visi_misi' },
      { to: '/admin/sejarah', label: 'Sejarah', icon: History, section: 'sejarah' },
      { to: '/admin/fasilitas', label: 'Fasilitas', icon: Building2, section: 'fasilitas' },
      ...crudGroup('Content'),
    ],
  },
  {
    title: 'Akademik',
    items: crudGroup('Akademik'),
  },
  {
    title: 'Publikasi',
    items: crudGroup('Publikasi'),
  },
  {
    title: 'Manajemen',
    items: crudGroup('Manajemen'),
  },
  {
    title: 'Pengaturan',
    items: [
      { to: '/admin/users', label: 'Manajemen User', icon: Users, section: 'users' },
      { to: '/admin/roles', label: 'Role & Permission', icon: ShieldCheck, section: 'roles' },
      { to: '/profile', label: 'Profil Saya', icon: UserCircle2 },
    ],
  },
];

const CRUMBS: Record<string, string> = {
  '/admin': 'Ringkasan',
  '/admin/bulk': 'Super Admin / Bulk Upload & Konten',
  '/admin/visi-misi': 'Content / Visi, Misi & Tujuan',
  '/admin/sejarah': 'Content / Sejarah',
  '/admin/fasilitas': 'Content / Fasilitas',
  '/admin/users': 'Pengaturan / Manajemen User',
  '/admin/roles': 'Pengaturan / Role & Permission',
  ...Object.fromEntries(CRUD_SECTIONS.map((s) => [`/admin/s/${s.key}`, `${s.group} / ${s.label}`])),
};

export type AdminOutletContext = AdminSession;

export const AdminLayout: React.FC = () => {
  const admin = useAdminSession();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  if (admin.loading) {
    return <div className="min-h-screen grid place-items-center bg-[#FAF7F0] text-sm text-teal-900">Memuat…</div>;
  }
  if (!admin.session) return <Navigate to="/login?as=admin&from=guard&redirect=%2Fadmin#login-section" replace />;
  if (!admin.isStaff) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FAF7F0] p-6">
        <div className="max-w-sm rounded-2xl border border-teal-900/10 bg-white p-6 text-center shadow-sm space-y-3">
          <h1 className="text-lg font-bold text-teal-900">Akses ditolak</h1>
          <p className="text-sm text-zinc-600">Akun ini tidak terdaftar sebagai pengelola website.</p>
          <button onClick={admin.signOut} className="rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white">
            Keluar
          </button>
        </div>
      </div>
    );
  }

  const roleLabel = STAFF_ROLES.find((r) => r.value === admin.profile?.role)?.label ?? admin.profile?.role;
  const visible = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.section || admin.can(i.section, 'view')),
  })).filter((g) => g.items.length > 0);

  const Nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {visible.map((g) => (
        <div key={g.title}>
          {!collapsed && (
            <p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-teal-900/50">{g.title}</p>
          )}
          <div className="space-y-1">
            {g.items.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.to === '/admin'}
                onClick={() => setDrawer(false)}
                title={i.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#115E59] text-white shadow-sm' : 'text-teal-950/80 hover:bg-teal-900/5'
                  }`
                }
              >
                <i.icon className="h-4.5 w-4.5 shrink-0" size={18} />
                {!collapsed && <span className="truncate">{i.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const Brand = (
    <div className="flex h-16 items-center gap-2.5 px-5 border-b border-teal-900/10">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#115E59] text-xs font-black text-white">JM</div>
      {!collapsed && <span className="text-sm font-bold text-teal-950">Admin PP Jauharul Maknuun</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-zinc-900">
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-teal-900/10 bg-white ${
          collapsed ? 'w-[76px]' : 'w-[280px]'
        } transition-[width]`}
      >
        {Brand}
        {Nav}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="m-3 flex items-center justify-center gap-2 rounded-xl border border-teal-900/10 py-2 text-xs text-teal-900 hover:bg-teal-900/5"
          aria-label="Ciutkan sidebar"
        >
          {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Ciutkan</>}
        </button>
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-xl">
            <button className="absolute right-3 top-4 p-1" onClick={() => setDrawer(false)} aria-label="Tutup menu">
              <X size={18} />
            </button>
            {Brand}
            {Nav}
          </aside>
        </div>
      )}

      <div className={`${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]'} transition-[padding]`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-teal-900/10 bg-white/90 px-4 backdrop-blur">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setDrawer(true)} aria-label="Buka menu">
            <Menu size={20} />
          </button>
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-teal-900/70">
            <span className="hidden sm:inline">Admin</span>
            <ChevronRight size={14} className="hidden sm:block" />
            <span className="truncate font-semibold text-teal-950">{CRUMBS[pathname] ?? 'Admin'}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-900/15 px-3 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-900/5"
            >
              <ExternalLink size={14} /> <span className="hidden sm:inline">Lihat Website</span>
            </Link>
            <div className="hidden md:block text-right leading-tight">
              <p className="text-xs font-semibold">{admin.profile?.full_name}</p>
              <p className="text-[11px] text-zinc-500">{roleLabel}</p>
            </div>
            <button onClick={admin.signOut} className="p-2 rounded-xl hover:bg-teal-900/5" aria-label="Keluar">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 pb-28 lg:pb-8">
          <Outlet context={admin satisfies AdminOutletContext} />
        </main>
      </div>

      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 flex border-t border-teal-900/10 bg-white pb-[env(safe-area-inset-bottom)]">
        {visible.flatMap((g) => g.items).slice(0, 4).map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.to === '/admin'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium ${
                isActive ? 'text-[#115E59]' : 'text-zinc-500'
              }`
            }
          >
            <i.icon size={20} />
            <span className="truncate max-w-[72px]">{i.label.split(' ')[0]}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setDrawer(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium text-zinc-500"
        >
          <Menu size={20} />
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
};

