export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  thumbnail: string;
  is_pinned?: boolean;
  is_published?: boolean;
  author?: string;
  created_at?: string;
  date_display?: string;
}

export const INITIAL_NEWS: NewsItem[] = [];