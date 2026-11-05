import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { BottomNav } from '../components/common/BottomNav';
import { MobileDrawer } from '../components/common/MobileDrawer';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import { GuestStickyBar } from '../components/auth/GuestStickyBar';
import { LoginRequiredModal } from '../components/auth/LoginRequiredModal';
import { AuthModal } from '../components/auth/AuthModal';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const GUEST_SESSION_STORAGE_KEY = 'jm_guest_session_id';

function getOrCreateGuestSessionId(): string {
  try {
    const existing = localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const generated = `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(GUEST_SESSION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return `guest_${Date.now().toString(36)}`;
  }
}

export const RootLayout: React.FC = () => {
  const { isGuest, loading } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (loading || !isGuest || !isSupabaseConfigured()) return;
    const sessionId = getOrCreateGuestSessionId();
    const lastPage = `${location.pathname}${location.search}`.slice(0, 200);
    void (supabase as any)
      .from('guest_sessions')
      .upsert(
        {
          session_id: sessionId,
          last_page: lastPage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' },
      );
  }, [isGuest, loading, location.pathname, location.search]);

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col bg-surface text-onyx selection:bg-emerald-800 selection:text-white">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main
        className={`flex-1 w-full max-w-full overflow-x-hidden ${
          isGuest
            ? 'pb-[calc(8.5rem+env(safe-area-inset-bottom,0px))]'
            : 'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]'
        } md:pb-3`}
      >
        <Outlet />
      </main>

      <Footer />
      <GuestStickyBar />
      <LoginRequiredModal />
      <AuthModal />
      <BottomNav />
    </div>
  );
};
