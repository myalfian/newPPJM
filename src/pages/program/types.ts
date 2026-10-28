import { LucideIcon } from 'lucide-react';

export type ProgramPillarTab = 'pondok' | 'sekolah' | 'madin';

// ========================
// SUB-TAB A: PONDOK
// ========================
export interface PondokProgramItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  iconName: string;
  keyFeatures: string[];
}

export interface PondokActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  timeTag: string;
  location: string;
}

export interface DailyScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'ibadah' | 'akademik' | 'diniyah' | 'istirahat';
  iconName: string;
}

// ========================
// SUB-TAB B: SEKOLAH
// ========================
export interface SekolahProgramItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  highlights: string[];
}

export interface SekolahStoryActivity {
  id: string;
  title: string;
  categoryTag: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  achievements: string[];
  dateOrPeriod: string;
}

// ========================
// SUB-TAB C: MADIN
// ========================
export type FlyerCategory = 'kitab' | 'ubudiyah';
export type FlyerLevel = 'Ula' | 'Wustho' | 'Ulya' | 'Umum';

export interface MadinFlyerItem {
  id: string;
  title: string;
  category: FlyerCategory;
  level?: FlyerLevel;
  subject: string;
  description: string;
  imageUrl: string;
  downloadUrl?: string;
  tags: string[];
}

