export type OsisTab = 'struktur' | 'program' | 'event';

export type OsisHierarchyLevel = 'pimpinan' | 'inti' | 'sekbid';

export interface OsisMember {
  id: string;
  name: string;
  role: string;
  hierarchy: OsisHierarchyLevel;
  department: string;
  classGrade: string;
  photoUrl: string;
  motto: string;
  badgeLabel: string;
  badgeColor?: 'gold' | 'sapphire' | 'emerald' | 'purple';
}

export interface OsisWorkProgram {
  id: string;
  title: string;
  target: string;
  frequency: 'Rutin Harian' | 'Mingguan' | 'Insidental' | 'Tahunan';
  description: string;
  expectedOutput: string;
}

export interface OsisDepartment {
  id: string;
  name: string;
  shortName: string;
  arabicName: string;
  iconName: string;
  coordinator: string;
  description: string;
  programs: OsisWorkProgram[];
}

export interface OsisArticleEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  bannerUrl: string;
  summary: string;
  author: string;
  category: string;
  content: string;
  tags: string[];
}

