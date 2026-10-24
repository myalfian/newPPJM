import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Image, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { label: 'Beranda', to: '/', icon: Home },
    { label: 'JM Center', to: '/jm-center/sambutan', icon: Compass },
    { label: 'Smart JM', to: '/smart-jm/hafidz/read', icon: Sparkles },
    { label: 'Galeri', to: '/galeri/foto', icon: Image },
    { label: 'Admin', to: '/admin', icon: ShieldCheck },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <nav className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-800 font-bold'
                    : 'text-slate-500 hover:text-emerald-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-full transition-all ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label === 'Smart JM' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
