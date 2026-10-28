// ==========================================
// SMART JM TYPES & INTERFACES
// ==========================================

export type SmartJmPillarTab = 'stem' | 'mandarin' | 'hafidz';

// ------------------------------------------
// PILAR A: STEM AREA
// ------------------------------------------
export interface StemRubricItem {
  id: string;
  category: string;
  weight: string;
  criteria: string;
  scaleDescription: string;
}

export interface StemWorksheetItem {
  id: string;
  title: string;
  category: string;
  targetLevel: string;
  objective: string;
  context: string;
  setupPhoto: string;
  toolsAndMaterials: string[];
  rubric: StemRubricItem[];
  downloadDocUrl?: string;
  duration: string;
}

export interface StemPortfolioItem {
  id: string;
  title: string;
  category: string;
  studentName: string;
  studentClass: string;
  photoUrl: string;
  description: string;
  procedure: string[];
  results: string;
  stats: { label: string; value: string }[];
  completionDate: string;
}

// ------------------------------------------
// PILAR B: MANDARIN CLASS
// ------------------------------------------
export interface VocabularyItem {
  hanzi: string;
  pinyin: string;
  indonesian: string;
  exampleSentence?: string;
}

export interface MandarinTopicItem {
  id: string;
  topicKey: string;
  topicName: string;
  chineseName: string;
  level: string;
  posterFlyer: string;
  summary: string;
  narrative: string;
  vocabularies: VocabularyItem[];
  culturalNote?: string;
}

export interface MandarinQuizQuestion {
  id: string;
  topicId: string;
  question: string;
  hanzi?: string;
  pinyin?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MandarinQuizTopic {
  id: string;
  title: string;
  chineseTitle: string;
  level: string;
  description: string;
  questions: MandarinQuizQuestion[];
}

// ------------------------------------------
// PILAR C: HAFIDZ QURAN
// ------------------------------------------
export interface QuranAyahModel {
  numberInSurah: number;
  textArabic: string;
  textLatin: string;
  translationIndo: string;
  audioUrl: string;
  surahNumber?: number;
  surahName?: string;
}

export type RepeatMode = 1 | 3 | 5 | 'loop';

