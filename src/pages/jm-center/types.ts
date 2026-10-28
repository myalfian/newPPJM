export interface LeaderGreeting {
  name: string;
  title: string;
  role: string;
  image: string;
  quote: string;
  fullMessage: string[];
}

export interface HistoryMilestone {
  year: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

export interface ProfileData {
  greeting: LeaderGreeting;
  history: HistoryMilestone[];
  vision: string;
  missions: string[];
  values: { title: string; desc: string; iconName?: string }[];
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'Pendidikan' | 'Ibadah' | 'Hunian' | 'Penunjang' | 'Olahraga';
  description: string;
  capacity?: string;
  image: string;
  features?: string[];
}

export interface InstitutionItem {
  id: string;
  name: string;
  shortName: string;
  categoryTag: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
  stats?: { label: string; value: string }[];
  curriculumHighlight: string;
}

