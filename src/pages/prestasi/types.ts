export type PrestasiCategory =
  | 'Semua'
  | 'Olimpiade'
  | 'Olahraga'
  | 'Seni'
  | 'Keagamaan'
  | 'Umum';

export type PrestasiTingkat =
  | 'Semua Tingkat'
  | 'Internasional'
  | 'Nasional'
  | 'Provinsi'
  | 'Kabupaten';

export interface PrestasiItem {
  id: string;
  title: string;
  category: PrestasiCategory;
  tingkat: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten';
  year: number;
  winner_name: string;
  winner_class?: string;
  medal_type: string; // e.g., 'Emas / Juara 1', 'Perak / Juara 2', 'Perunggu / Juara 3', 'Juara Harapan 1'
  event_name: string;
  organizer?: string;
  certificate_url: string;
  photo_url?: string;
  description: string;
  tags?: string[];
}

