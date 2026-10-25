export interface HafalanReport {
  id: string;
  santriId: string;
  surah: string;
  juz: number;
  ayatRange: string;
  setoranType: 'ziyadah' | 'murojaah' | 'simakan';
  fluencyStatus: 'mutqin' | 'jayyid' | 'dhoif';
  date: string;
  ustadzNotes: string;
  created_at: string;
}

export interface StemSubmission {
  id: string;
  santriId: string;
  title: string;
  category: 'iot' | 'robotika' | 'coding' | 'hidroponik' | 'sains';
  progressNotes: string;
  projectLink: string;
  submissionDate: string;
  status: 'draft' | 'diserahkan' | 'revisi' | 'selesai';
  created_at: string;
}

export interface TestRecord {
  id: string;
  santriId: string;
  testTitle: string;
  category: 'mandarin' | 'tahfidz' | 'diniyah' | 'stem';
  score: number;
  testDate: string;
  status: 'lulus' | 'remidi';
  reflection: string;
  created_at: string;
}

const DEFAULT_HAFALAN_REPORTS: HafalanReport[] = [
  {
    id: 'haf-001',
    santriId: 'SAN-2024-089',
    surah: 'Al-Baqarah',
    juz: 1,
    ayatRange: 'Ayat 1 - 25',
    setoranType: 'ziyadah',
    fluencyStatus: 'mutqin',
    date: '2026-10-24',
    ustadzNotes: 'Tajwid dan makhraj sangat baik, pertahankan kelancaran ghunnah.',
    created_at: '2026-10-24T08:30:00Z',
  },
  {
    id: 'haf-002',
    santriId: 'SAN-2024-089',
    surah: 'Al-Kahfi',
    juz: 15,
    ayatRange: 'Ayat 1 - 50',
    setoranType: 'murojaah',
    fluencyStatus: 'mutqin',
    date: '2026-10-22',
    ustadzNotes: 'Hafalan sangat mutqin, ritme bacaan tartil dan stabil.',
    created_at: '2026-10-22T09:00:00Z',
  },
  {
    id: 'haf-003',
    santriId: 'SAN-2024-089',
    surah: 'Yasin',
    juz: 22,
    ayatRange: 'Ayat 1 - 83 (Lengkap)',
    setoranType: 'simakan',
    fluencyStatus: 'jayyid',
    date: '2026-10-18',
    ustadzNotes: 'Alhamdulillah lancar, perhatikan waqaf di ayat 60-65.',
    created_at: '2026-10-18T14:15:00Z',
  },
];

const DEFAULT_STEM_SUBMISSIONS: StemSubmission[] = [
  {
    id: 'stem-001',
    santriId: 'SAN-2024-089',
    title: 'Sistem Penyiram Otomatis Hidroponik Sayur Asrama berbasis ESP32',
    category: 'iot',
    progressNotes: 'Implementasi sensor kelembaban tanah kapasitif dan relay modul solenoid valve terkalibrasi sukses.',
    projectLink: 'https://github.com/ppjm-santri/smart-hydroponics-esp32',
    submissionDate: '2026-10-20',
    status: 'selesai',
    created_at: '2026-10-20T10:00:00Z',
  },
  {
    id: 'stem-002',
    santriId: 'SAN-2024-089',
    title: 'Prototipe Nanofiltrasi Air Bersih Sumur Pesantren Lasem',
    category: 'hidroponik',
    progressNotes: 'Uji coba filtrasi karbon aktif tempurung kelapa dan pasir silika, menurunkan TDS dari 450 ke 85 ppm.',
    projectLink: 'https://drive.google.com/drive/folders/ppjm-nanofiltration-demo',
    submissionDate: '2026-10-23',
    status: 'diserahkan',
    created_at: '2026-10-23T11:30:00Z',
  },
  {
    id: 'stem-003',
    santriId: 'SAN-2024-089',
    title: 'Line Follower Robot Pengantar Kitab Kuning Asrama',
    category: 'robotika',
    progressNotes: 'Penyempurnaan algoritma PID kontrol motor DC 12V untuk lintasan tikungan tajam asrama santri.',
    projectLink: 'https://github.com/ppjm-santri/line-follower-kitab-robot',
    submissionDate: '2026-10-25',
    status: 'revisi',
    created_at: '2026-10-25T13:45:00Z',
  },
];

const DEFAULT_TEST_RECORDS: TestRecord[] = [
  {
    id: 'test-001',
    santriId: 'SAN-2024-089',
    testTitle: 'Kuis Mandarin Class Bab 1: Nada, Pinyin & Sapaan Dasar (问候)',
    category: 'mandarin',
    score: 100,
    testDate: '2026-10-23',
    status: 'lulus',
    reflection: 'Semua nada 1 hingga 4 dikuasai dengan benar. Kosakata Nǐ hǎo dan Zàijiàn mutqin.',
    created_at: '2026-10-23T15:00:00Z',
  },
  {
    id: 'test-002',
    santriId: 'SAN-2024-089',
    testTitle: 'Evaluasi Tajwid & Makharijul Huruf Juz 1 (Surah Al-Fatihah & Al-Baqarah)',
    category: 'tahfidz',
    score: 95,
    testDate: '2026-10-21',
    status: 'lulus',
    reflection: 'Makhraj huruf dhad (ض) dan tsa (ث) sudah fasih sesuai kaidah Jazariyyah.',
    created_at: '2026-10-21T08:00:00Z',
  },
  {
    id: 'test-003',
    santriId: 'SAN-2024-089',
    testTitle: 'Ujian Diniyah Salafiyah: Matan Al-Jurumiyah Bab Al-Kalam & I’rab',
    category: 'diniyah',
    score: 92,
    testDate: '2026-10-19',
    status: 'lulus',
    reflection: 'I’rab lafazh isim mufrad dan jamak mudzakkar salim berhasil diuraikan dengan dalil nadhom.',
    created_at: '2026-10-19T09:30:00Z',
  },
  {
    id: 'test-004',
    santriId: 'SAN-2024-089',
    testTitle: 'Pre-Test Lab STEM: Logika Pemrograman C++ Arduino & Sensor ADC',
    category: 'stem',
    score: 88,
    testDate: '2026-10-15',
    status: 'lulus',
    reflection: 'Perlu latihan lebih lanjut pada rumus konversi tegangan analog ke satuan milivolt.',
    created_at: '2026-10-15T10:15:00Z',
  },
];

const getKey = (prefix: string, santriId: string) => `ppjm_${prefix}_${santriId || 'SAN-2024-089'}`;

export const santriPortalService = {
  // ================= 1. HAFALAN REPORTS =================
  getHafalanReports: (santriId = 'SAN-2024-089'): HafalanReport[] => {
    try {
      const data = localStorage.getItem(getKey('hafalan', santriId));
      if (!data) {
        localStorage.setItem(getKey('hafalan', santriId), JSON.stringify(DEFAULT_HAFALAN_REPORTS));
        return DEFAULT_HAFALAN_REPORTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_HAFALAN_REPORTS;
    }
  },

  addHafalanReport: (report: Omit<HafalanReport, 'id' | 'created_at'>, santriId = 'SAN-2024-089'): HafalanReport => {
    const list = santriPortalService.getHafalanReports(santriId);
    const newEntry: HafalanReport = {
      ...report,
      id: `haf-${Date.now()}`,
      santriId,
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...list];
    localStorage.setItem(getKey('hafalan', santriId), JSON.stringify(updated));
    return newEntry;
  },

  updateHafalanReport: (id: string, updates: Partial<HafalanReport>, santriId = 'SAN-2024-089'): HafalanReport | null => {
    const list = santriPortalService.getHafalanReports(santriId);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(getKey('hafalan', santriId), JSON.stringify(list));
    return list[idx];
  },

  deleteHafalanReport: (id: string, santriId = 'SAN-2024-089'): boolean => {
    const list = santriPortalService.getHafalanReports(santriId);
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(getKey('hafalan', santriId), JSON.stringify(filtered));
    return filtered.length < list.length;
  },

  // ================= 2. STEM SUBMISSIONS =================
  getStemSubmissions: (santriId = 'SAN-2024-089'): StemSubmission[] => {
    try {
      const data = localStorage.getItem(getKey('stem_sub', santriId));
      if (!data) {
        localStorage.setItem(getKey('stem_sub', santriId), JSON.stringify(DEFAULT_STEM_SUBMISSIONS));
        return DEFAULT_STEM_SUBMISSIONS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_STEM_SUBMISSIONS;
    }
  },

  addStemSubmission: (sub: Omit<StemSubmission, 'id' | 'created_at'>, santriId = 'SAN-2024-089'): StemSubmission => {
    const list = santriPortalService.getStemSubmissions(santriId);
    const newEntry: StemSubmission = {
      ...sub,
      id: `stem-${Date.now()}`,
      santriId,
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...list];
    localStorage.setItem(getKey('stem_sub', santriId), JSON.stringify(updated));
    return newEntry;
  },

  updateStemSubmission: (id: string, updates: Partial<StemSubmission>, santriId = 'SAN-2024-089'): StemSubmission | null => {
    const list = santriPortalService.getStemSubmissions(santriId);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(getKey('stem_sub', santriId), JSON.stringify(list));
    return list[idx];
  },

  deleteStemSubmission: (id: string, santriId = 'SAN-2024-089'): boolean => {
    const list = santriPortalService.getStemSubmissions(santriId);
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(getKey('stem_sub', santriId), JSON.stringify(filtered));
    return filtered.length < list.length;
  },

  // ================= 3. TEST RECORDS =================
  getTestRecords: (santriId = 'SAN-2024-089'): TestRecord[] => {
    try {
      const data = localStorage.getItem(getKey('test_rec', santriId));
      if (!data) {
        localStorage.setItem(getKey('test_rec', santriId), JSON.stringify(DEFAULT_TEST_RECORDS));
        return DEFAULT_TEST_RECORDS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_TEST_RECORDS;
    }
  },

  addTestRecord: (rec: Omit<TestRecord, 'id' | 'created_at'>, santriId = 'SAN-2024-089'): TestRecord => {
    const list = santriPortalService.getTestRecords(santriId);
    const newEntry: TestRecord = {
      ...rec,
      id: `test-${Date.now()}`,
      santriId,
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...list];
    localStorage.setItem(getKey('test_rec', santriId), JSON.stringify(updated));
    return newEntry;
  },

  updateTestRecord: (id: string, updates: Partial<TestRecord>, santriId = 'SAN-2024-089'): TestRecord | null => {
    const list = santriPortalService.getTestRecords(santriId);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(getKey('test_rec', santriId), JSON.stringify(list));
    return list[idx];
  },

  deleteTestRecord: (id: string, santriId = 'SAN-2024-089'): boolean => {
    const list = santriPortalService.getTestRecords(santriId);
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(getKey('test_rec', santriId), JSON.stringify(filtered));
    return filtered.length < list.length;
  },

  // Reset all to default seed
  resetSantriData: (santriId = 'SAN-2024-089') => {
    localStorage.setItem(getKey('hafalan', santriId), JSON.stringify(DEFAULT_HAFALAN_REPORTS));
    localStorage.setItem(getKey('stem_sub', santriId), JSON.stringify(DEFAULT_STEM_SUBMISSIONS));
    localStorage.setItem(getKey('test_rec', santriId), JSON.stringify(DEFAULT_TEST_RECORDS));
  },
};
