/**
 * bukuTamuService.ts
 * Layanan Buku Tamu Digital (Guest Book Service)
 * Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
 * 
 * Memfasilitasi role "Guest" (Tamu/Pengunjung Umum) untuk mengisi buku tamu,
 * menyampaikan kesan, pesan, serta doa silaturahmi untuk pondok dan para santri.
 */

export interface GuestBookEntry {
  id: string;
  name: string;
  origin: string; // Asal Kota / Lembaga / Keluarga
  phoneOrEmail?: string;
  purpose: 'Silaturahmi' | 'Kunjungan PPDB' | 'Konsultasi Santri' | 'Kajian & Ziarah' | 'Studi Banding' | 'Umum';
  message: string;
  rating?: number; // 1-5 bintang
  createdAt: string; // ISO String
  isPublic: boolean;
}

const STORAGE_KEY = 'ppjm_guest_book_entries';

export const INITIAL_GUEST_BOOK_ENTRIES: GuestBookEntry[] = [
  {
    id: 'gb-001',
    name: 'H. Bambang Sugiarto',
    origin: 'Surabaya, Jawa Timur',
    phoneOrEmail: '0812-3344-xxxx',
    purpose: 'Kunjungan PPDB',
    message: 'Alhamdulillah, berkunjung ke PP. Jauharul Maknuun sungguh menyejukkan hati. Program Tahfidz bersanad dan integrasi lab STEM robotikanya sangat visioner untuk masa depan anak-anak santri.',
    rating: 5,
    createdAt: '2026-10-24T14:30:00.000Z',
    isPublic: true,
  },
  {
    id: 'gb-002',
    name: 'Ustadzah Nurul Hidayati, M.Pd.',
    origin: 'SMP Islam Terpadu Sidoarjo',
    phoneOrEmail: 'nurul.h@gmail.com',
    purpose: 'Studi Banding',
    message: 'Kagum dengan adab dan kedisiplinan para santri. Manajemen kurikulum salafiyah yang berpadu dengan bahasa Mandarin dan AI Murojaah patut menjadi percontohan nasional.',
    rating: 5,
    createdAt: '2026-10-22T09:15:00.000Z',
    isPublic: true,
  },
  {
    id: 'gb-003',
    name: 'Ir. Hendra Wicaksono',
    origin: 'Gresik Kota',
    phoneOrEmail: '0857-1122-xxxx',
    purpose: 'Silaturahmi',
    message: 'Semoga Pondok Pesantren Jauharul Maknuun semakin barokah, terus melahirkan generasi hafidz Qur an yang menguasai sains dan teknologi masa depan. Aamiin ya Robbal Alamin.',
    rating: 5,
    createdAt: '2026-10-20T16:45:00.000Z',
    isPublic: true,
  },
  {
    id: 'gb-004',
    name: 'Siti Rahmawati (Wali Santri)',
    origin: 'Lamongan',
    phoneOrEmail: '0878-9988-xxxx',
    purpose: 'Konsultasi Santri',
    message: 'Pelayanan pengurus asrama dan ketertiban lingkungan pondok sangat rapi. Anak kami merasa nyaman dan hafalan juznya bertambah lancar. Matur nuwun sanget poro ustadz.',
    rating: 5,
    createdAt: '2026-10-18T11:20:00.000Z',
    isPublic: true,
  }
];

export const getGuestBookEntries = (): GuestBookEntry[] => {
  if (typeof window === 'undefined') return INITIAL_GUEST_BOOK_ENTRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUEST_BOOK_ENTRIES));
      return INITIAL_GUEST_BOOK_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_GUEST_BOOK_ENTRIES;
  } catch (err) {
    console.error('Error loading guest book entries:', err);
    return INITIAL_GUEST_BOOK_ENTRIES;
  }
};

export const addGuestBookEntry = (
  entry: Omit<GuestBookEntry, 'id' | 'createdAt'>
): GuestBookEntry => {
  const current = getGuestBookEntries();
  const newEntry: GuestBookEntry = {
    ...entry,
    id: `gb-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isPublic: entry.isPublic ?? true,
    rating: entry.rating || 5,
  };
  const updated = [newEntry, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newEntry;
};

export const deleteGuestBookEntry = (id: string): boolean => {
  const current = getGuestBookEntries();
  const updated = current.filter((item) => item.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return true;
};

export const resetGuestBookEntries = (): GuestBookEntry[] => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUEST_BOOK_ENTRIES));
  }
  return INITIAL_GUEST_BOOK_ENTRIES;
};
