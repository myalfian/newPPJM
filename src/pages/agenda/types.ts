export type AgendaCategory = 'Pondok' | 'Sekolah' | 'Diniyah' | 'Libur' | 'Event Akbar';

export interface AgendaEventItem {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  time: string;
  category: AgendaCategory;
  location: string;
  description: string;
  coordinator?: string;
  isHighlight?: boolean;
}

export interface UpcomingEventItem {
  id: string;
  title: string;
  targetDate: string; // ISO date format for countdown: YYYY-MM-DDTHH:mm:ss
  dateDisplay: string;
  time: string;
  category: 'Pondok' | 'Sekolah' | 'Event Akbar';
  location: string;
  description: string;
  coordinator: string;
  badgeType: 'sapphire' | 'emerald' | 'gold';
  rundown?: { time: string; activity: string }[];
}

export interface RoutineAgendaItem {
  id: string;
  title: string;
  period: 'harian' | 'mingguan' | 'bulanan';
  scheduleTime: string;
  category: 'ibadah' | 'akademik' | 'sosial' | 'kebersihan';
  targetAudience: string;
  description: string;
  keyActivities: string[];
}

export type AgendaTab = 'kalender' | 'upcoming' | 'rutin';

