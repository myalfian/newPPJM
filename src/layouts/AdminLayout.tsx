import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Cpu,
  Globe,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../lib/supabase';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simpan / baca role aktif dari localStorage (default: super_admin)
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ppjm_admin_role') as UserRole) || 'super_admin';
  });

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('ppjm_admin_role', role);
  };

  const handleLogout = () => {
    localStorage.removeItem('ppjm_admin_logged_in');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Halaman Utama Admin',
      desc: 'Ringkasan aktivitas & kabar pondok',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['super_admin', 'pengurus_konten', 'guru_akademik']
    },
    {
      title: 'Kelola Berita & Warta',
      desc: 'Tulis kabar & kirim ke WhatsApp',
      href: '/admin/berita',
      icon: Newspaper,
      roles: ['super_admin', 'pengurus_konten']
    },
    {
      title: 'Kelola Laboratorium STEM',
      desc: 'Materi, tugas & portofolio sains',
      href: '/admin/stem',
      icon: Cpu,
      roles: ['super_admin', 'guru_akademik']
    },
    {
      title: 'Kelola Kelas Mandarin',
      desc: 'Input materi percakapan & soal kuis',
      href: '/admin/mandarin',
      icon: Globe,
      roles: ['super_admin', 'guru_akademik']
    },
    {
      title: 'Kelola Galeri Foto & Video',
      desc: 'Agenda foto kegiatan & link sosmed',
      href: '/admin/galeri',
      icon: ImageIcon,
      roles: ['super_admin', 'pengurus_konten']
    }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-slate-50 text-onyx selection:bg-emerald-800 selection:text-white">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <img src="/logo-ppjm.svg" alt="PPJM Logo" className="w-8 h-8 rounded-full" />
          <span className="font-extrabold text-sm text-emerald-950">Portal Admin PPJM</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar (Google Workspace Style) */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-72 bg-white border-r border-slate-200 p-5 flex flex-col justify-between flex-shrink-0 z-30`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-emerald-600 to-gold-400 shadow-sm flex-shrink-0">
              <img
                src="/logo-ppjm.svg"
                alt="PPJM Logo"
                className="w-full h-full object-contain rounded-full bg-white"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-emerald-950 leading-tight">
                Ruang Pengurus PPJM
              </h2>
              <span className="text-[11px] font-semibold text-emerald-700">
                Ramah Gaptek (Mudah Dipakai)
              </span>
            </div>
          </div>

          {/* User Role Badge & Simulator */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Status Akun:</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-800 text-gold-300">
                {activeRole.replace('_', ' ')}
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              Ganti peran pengurus:
            </div>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-white text-emerald-950 focus:outline-none"
            >
              <option value="super_admin">1. Super Admin (Lengkap)</option>
              <option value="pengurus_konten">2. Pengurus Konten (Warta/Galeri)</option>
              <option value="guru_akademik">3. Guru Akademik (STEM/Mandarin)</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems
              .filter((item) => item.roles.includes(activeRole))
              .map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                      active
                        ? 'bg-emerald-800 text-white shadow-sm font-bold'
                        : 'text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-950'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${active ? 'text-gold-400' : 'text-emerald-700'}`} />
                    <div>
                      <div className="text-xs sm:text-sm font-bold leading-tight">
                        {item.title}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${active ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-2 mt-6">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-700" />
              <span>Buka Website Santri</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Admin</span>
            </span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
