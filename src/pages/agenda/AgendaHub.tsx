import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CalendarCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { AcademicCalendarSection } from './AcademicCalendarSection';
import { UpcomingEventsSection } from './UpcomingEventsSection';
import { RoutineAgendaSection } from './RoutineAgendaSection';
import { AgendaTab } from './types';

export interface AgendaHubProps {
  defaultTab?: AgendaTab;
}

export const AgendaHub: React.FC<AgendaHubProps> = ({ defaultTab = 'kalender' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State determination from URL or props
  const [activeTab, setActiveTab] = useState<AgendaTab>(() => {
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'upcoming') return 'upcoming';
    if (tabParam === 'rutin') return 'rutin';
    if (tabParam === 'kalender') return 'kalender';
    return defaultTab;
  });

  // Keep state synced with search param
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'upcoming') {
      setActiveTab('upcoming');
    } else if (tabParam === 'rutin') {
      setActiveTab('rutin');
    } else if (tabParam === 'kalender') {
      setActiveTab('kalender');
    }
  }, [location.search]);

  const handleTabChange = (tab: AgendaTab) => {
    setActiveTab(tab);
    if (tab === 'kalender') {
      navigate('/agenda', { replace: true });
    } else {
      navigate(`/agenda?tab=${tab}`, { replace: true });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 space-y-2.5 sm:space-y-3.5 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs
        activeTabId={activeTab}
        onChangeTab={(tab) => handleTabChange(tab.id as AgendaTab)}
      />

      {/* ========================================================= */}
      {/* HEADER BANNER: MODERN LUXURY AGENDA PPJM */}
      {/* ========================================================= */}
      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-3.5 sm:p-5 lg:p-6 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 sm:space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Kalender Akademik & Agenda Terpadu Santri</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Agenda & Kegiatan Pesantren
            </h1>
            <p className="mt-2.5 text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Pusat informasi jadwal kegiatan akademik SMP Plus Jauharul Maknuun, agenda pengajian madrasah diniyah, evaluasi semester santri, serta kalender rutinitas ibadah pesantren.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Calendar className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Kalender Akademik 2026/2027</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Sinkronisasi Google Calendar</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Layers className="w-4 h-4 text-blue-300 shrink-0" />
              <span>3 Kategori Agenda Terpadu</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TAB CONTENT SECTIONS (Animated Switcher) */}
      {/* ========================================================= */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'kalender' && (
            <motion.div
              key="tab-agenda-kalender"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <AcademicCalendarSection />
            </motion.div>
          )}

          {activeTab === 'upcoming' && (
            <motion.div
              key="tab-agenda-upcoming"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <UpcomingEventsSection />
            </motion.div>
          )}

          {activeTab === 'rutin' && (
            <motion.div
              key="tab-agenda-rutin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <RoutineAgendaSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

