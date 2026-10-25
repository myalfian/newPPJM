import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { BottomNav } from '../components/common/BottomNav';
import { MobileDrawer } from '../components/common/MobileDrawer';
import { Footer } from '../components/common/Footer';
export const RootLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col bg-surface text-onyx selection:bg-emerald-800 selection:text-white">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-6">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};
