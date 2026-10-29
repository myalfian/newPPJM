export type EkskulCategory =
  | 'Semua Kategori'
  | 'Sains & Teknologi'
  | 'Olahraga & Bela Diri'
  | 'Seni & Bahasa'
  | 'Agama'
  | 'Pramuka'
  | 'Kepanduan & Keagamaan';

export interface EkskulPhoto {
  id: string;
  url: string;
  caption: string;
  timeTag?: string;
}

export interface DetailedEkskulItem {
  id: string;
  name: string;
  category: 'Sains & Teknologi' | 'Seni & Bahasa' | 'Olahraga & Bela Diri' | 'Kepanduan & Keagamaan' | 'Agama' | 'Pramuka';
  schedule: string;
  coach: string;
  description: string;
  featuredPhoto: string;
  gallery: EkskulPhoto[];
  highlights: string[];
  targetCapaian?: string;
  tempatLatihan?: string;
}

