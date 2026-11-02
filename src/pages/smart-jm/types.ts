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

export interface StemEdpStep {
  step: string;
  title: string;
  desc: string;
}

export interface StemVideoRef {
  title: string;
  url: string;
  durationOrLabel?: string;
}

export interface StemPhotoDoc {
  url: string;
  caption: string;
}

export interface StemWorksheetItem {
  id: string;
  title: string;
  category: string;
  targetLevel: string;
  teacherMentor?: string;
  learningModel?: string;
  objective: string;
  context: string;
  safetyRules?: string[];
  setupPhoto: string;
  toolsAndMaterials: string[];
  edpSteps?: StemEdpStep[];
  lkpdPages?: StemPhotoDoc[];
  documentationPhotos?: StemPhotoDoc[];
  videoRefs?: StemVideoRef[];
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
  teacherMentor?: string;
  photoUrl: string;
  galleryPhotos?: StemPhotoDoc[];
  videoRefs?: StemVideoRef[];
  downloadDocUrl?: string;
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

