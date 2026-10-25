import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Cpu,
  Globe,
  Image as ImageIcon,
  Gauge,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  Layers,
  Sparkles,
  Command,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpRight,
  Monitor
} from 'lucide-react';
import { UserRole } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ADMIN_MODULES, PUBLIC_NAV_TABS, AdminModuleItem } from '../data/navigationData';
import { EnvAlertBanner } from '../components/common/EnvAlertBanner';

/**
 * Modern Lux Project Management Dashboard Layout
 * Inspired by Dribbble Shot 27045579
 * Features:
 * - Neutral zinc/slate modern lux base surface with hairline borders & soft multi-layer shadows
 * - Sticky topbar with integrated search, fluid horizontal tab menu, notifications & user profile
 * - Single source of truth navigation aligned 1:1 with public website hierarchy
 * - Collapsible multi-column layout for desktop/tablet & floating thumb-friendly dock for mobile (h-dvh)
 */
export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role: activeRole, profile, signOut, switchMockRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    switchMockRole(newRole);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Filter modules according to active role
  const accessibleModules = ADMIN_MODULES.filter((item) => item.roles.includes(activeRole));

  // Determine active module
  const currentModule = ADMIN_MODULES.find((m) => {
    if (m.href === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(m.href);
  }) || ADMIN_MODULES[0];

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-[#007acc] selection:text-white">
      
      {/* 1. TOPBAR (Modern Lux Sticky Navigation with Fluid Tab Bar) */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand Identity & Workspace Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Sidebar"
              aria-label="Toggle Sidebar"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/admin" className="flex items-center gap-2.5 group shrink-0 select-none">
              <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-xl p-0.5 bg-gradient-to-tr from-[#007acc] via-indigo-500 to-sky-400 shadow-sm flex items-center justify-center shrink-0 flex-none aspect-square">
                <img
                  src="/logo-ppjm.svg"
                  alt="PPJM Logo"
                  width="36"
                  height="36"
                  loading="eager"
                  className="w-full h-full min-w-full min-h-full max-w-full max-h-full object-contain rounded-[10px] bg-white p-0.5 block shrink-0 flex-none pointer-events-none"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-white">
                    PPJM Suite
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-zinc-100 dark:bg-zinc-800 text-[#007acc] border border-zinc-200 dark:border-zinc-700">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium leading-none">
                  Project Management
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Horizontal Fluid Tabs */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 bg-zinc-100/80 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50">
            {accessibleModules.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 select-none ${
                    isActive
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#007acc]' : 'text-zinc-400'}`} />
                  <span>{item.shortLabel}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Quick Search, Role Switcher, Public Preview, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search Input */}
            <div className="relative hidden xl:block w-48 2xl:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari modul / tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-8 pr-8 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 px-1 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60">
                ⌘K
              </span>
            </div>

            {/* Live Website Preview Button */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#007acc] dark:hover:text-[#007acc] bg-zinc-100 dark:bg-zinc-800/80 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-zinc-200/70 dark:border-zinc-700/60 transition-all group"
              title="Buka Website Santri (Public)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Web Publik</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#007acc] transition-colors" />
            </Link>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#007acc] ring-2 ring-white dark:ring-zinc-900" />
            </button>

            {/* Role Switcher Pill */}
            <div className="relative hidden lg:block">
              <select
                value={activeRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="text-xs font-bold pl-2.5 pr-7 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="super_admin">Super Admin</option>
                <option value="pengurus_konten">Pengurus Konten</option>
                <option value="guru_akademik">Guru Akademik</option>
                <option value="user">Santri / User</option>
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* User Profile Avatar & Logout */}
            <div className="flex items-center gap-2 pl-1 border-l border-zinc-200 dark:border-zinc-800 shrink-0 flex-none">
              <Link
                to="/admin/akun"
                className="flex items-center gap-2 group p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title={`Profil Akun: ${profile?.full_name || 'Admin PPJM'}`}
              >
                <div className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full overflow-hidden bg-gradient-to-tr from-[#007acc] to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs relative shrink-0 flex-none aspect-square border border-white/40">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile?.full_name?.substring(0, 2).toUpperCase() || 'AD'}</span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[110px]">
                    {profile?.full_name?.split(' ')[0] || 'Admin'}
                  </span>
                  <span className="text-[10px] text-zinc-400 capitalize">
                    {profile?.status_badge || activeRole.replace('_', ' ')}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Keluar dari Admin"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Snap-Tabs Bar (< 768px) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto snap-x snap-mandatory no-scrollbar px-3 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90">
          {accessibleModules.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#007acc] text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto overflow-hidden">
        
        {/* Left Sidebar (Desktop Multi-Category Navigation + Public Site Mirroring) */}
        <aside
          className={`hidden lg:flex flex-col justify-between transition-all duration-200 shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md ${
            sidebarCollapsed ? 'w-20 p-3' : 'w-64 xl:w-72 p-5'
          }`}
        >
          <div className="space-y-6 overflow-y-auto no-scrollbar">
            
            {/* Project / Workspace Status Card */}
            {!sidebarCollapsed && (
              <div className="p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Project Status
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live 100%
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
                    PP Jauharul Maknuun
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Lasem, Sidayu, Gresik
                  </p>
                </div>
              </div>
            )}

            {/* Section A: Core CMS Modules */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Manajemen Konten
                </div>
              )}
              {accessibleModules.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                    : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    title={sidebarCollapsed ? item.title : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#007acc] text-white shadow-sm shadow-[#007acc]/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">{item.shortLabel}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1.5 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Section B: Synchronized Public Website Links (Single Source of Truth) */}
            <div className="space-y-1 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
                  <span>Halaman Public (Web)</span>
                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              )}
              {PUBLIC_NAV_TABS.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={sidebarCollapsed ? tab.label : undefined}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group"
                  >
                    <TabIcon className="w-4 h-4 text-zinc-400 group-hover:text-[#007acc] transition-colors shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">{tab.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-300 dark:text-zinc-600 group-hover:text-[#007acc] transition-colors" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom: Role Badge & Help */}
          {!sidebarCollapsed && (
            <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#007acc]" />
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">Peran:</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                  {activeRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area (Dynamic Outlet) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE SLIDE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85%] bg-white dark:bg-zinc-900 h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <img src="/logo-ppjm.svg" alt="PPJM Logo" className="w-8 h-8 rounded-full" />
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                    Navigasi Admin
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-500 uppercase">Peran Aktif:</span>
                <select
                  value={activeRole}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full text-xs font-bold p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="pengurus_konten">Pengurus Konten</option>
                  <option value="guru_akademik">Guru Akademik</option>
                </select>
              </div>

              {/* Mobile CMS Links */}
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider px-2 pb-1">
                  Modul Manajemen
                </div>
                {accessibleModules.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                      : location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#007acc] text-white shadow-xs'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Public Site Links */}
              <div className="space-y-1 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider px-2 pb-1">
                  Website Public Santri
                </div>
                {PUBLIC_NAV_TABS.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <Link
                      key={tab.id}
                      to={tab.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <TabIcon className="w-4 h-4 text-zinc-400" />
                        <span>{tab.label}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE FLOATING BOTTOM DOCK (< 640px) */}
      <nav
        aria-label="Mobile Bottom Dock"
        className="md:hidden fixed bottom-3 inset-x-3 z-30 h-14 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-lg flex items-center justify-around px-2 select-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Link
          to="/admin"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl px-2.5 py-1 text-[10px] font-bold transition-all ${
            location.pathname === '/admin' || location.pathname === '/admin/dashboard'
              ? 'text-[#007acc]'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="mt-0.5">Overview</span>
        </Link>

        <Link
          to="/admin/berita"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl px-2.5 py-1 text-[10px] font-bold transition-all ${
            location.pathname.startsWith('/admin/berita')
              ? 'text-[#007acc]'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span className="mt-0.5">Warta</span>
        </Link>

        <Link
          to="/admin/stem"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl px-2.5 py-1 text-[10px] font-bold transition-all ${
            location.pathname.startsWith('/admin/stem')
              ? 'text-[#007acc]'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span className="mt-0.5">STEM</span>
        </Link>

        <Link
          to="/admin/galeri"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl px-2.5 py-1 text-[10px] font-bold transition-all ${
            location.pathname.startsWith('/admin/galeri')
              ? 'text-[#007acc]'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="mt-0.5">Media</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl px-2.5 py-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
          aria-label="Buka Menu Lengkap"
        >
          <Menu className="w-4 h-4" />
          <span className="mt-0.5">Menu</span>
        </button>
      </nav>

      {/* Supabase Dataset Warning Modal (Tampil Khusus di Window Admin) */}
      <EnvAlertBanner />
    </div>
  );
};
