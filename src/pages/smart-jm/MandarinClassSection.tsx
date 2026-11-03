import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Globe,
  BookOpen,
  HelpCircle,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Maximize2,
  X,
  ArrowRight,
  Trophy,
  Languages,
  Download,
  MessageSquare,
  Lightbulb,
  Users,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';
import { LiquidMercuryControl } from '../../components/common/LiquidMercuryControl';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  MandarinTopicItem,
  MandarinQuizTopic
} from './types';

// ============================================================================
// KURIKULUM RESMI KELAS MANDARIN SMP PLUS JAUHARUL MAKNUUN
// Pengampu: Ustadzah Nuriyah & Ustadzah Rizza
// ============================================================================
export const MANDARIN_TOPICS: MandarinTopicItem[] = [
  {
    id: 'topic-salam-sapaan',
    topicKey: 'salam',
    topicName: '1. Salam dan Sapaan (问候语)',
    chineseName: '问候语 — Wènhòuyǔ (词汇 — Cíhuì)',
    level: 'Materi 1 • Salam & Sapaan',
    teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
    downloadDocUrl: '/docs/mandarin/1_Materi_Salam_dan_Sapaan_Mandarin.docx',
    posterFlyer: '/images/mandarin/flyer_salam_dan_sapaan.png',
    summary:
      'Kosakata Salam dan Sapaan (词汇 — Cíhuì) berjumlah 20 ungkapan harian bahasa Mandarin lengkap dengan Hanzi (汉字), Pinyin, dan arti Bahasa Indonesia, disertai catatan penting kesopanan, teks percakapan (对话 — Duìhuà), dan 20 soal latihan pilihan ganda (选择题 — Xuǎnzé tí).',
    narrative:
      'Materi Kosakata Salam dan Sapaan (词汇 — Cíhuì) membekali siswa SMP Plus Jauharul Maknuun dengan sapaan dasar sehari-hari berdasarkan waktu (pagi, menjelang siang, siang, sore, malam), sapaan sopan kepada guru (您好 — Nín hǎo), ucapan terima kasih, permintaan maaf, serta kalimat pembuka perkenalan.',
    tableTitle: 'Kosakata Salam dan Sapaan (词汇 — Cíhuì)',
    culturalNote:
      '你好 (Nǐ hǎo) digunakan untuk menyapa teman atau orang yang dikenal, sedangkan 您好 (Nín hǎo) merupakan bentuk sapaan yang lebih sopan kepada guru atau orang yang lebih tua.',
    importantNotes: [
      '你好 (Nǐ hǎo) digunakan untuk menyapa teman atau orang yang dikenal.',
      '您好 (Nín hǎo) merupakan bentuk sapaan yang lebih sopan, misalnya kepada guru atau orang yang lebih tua.',
      '晚安 (Wǎn\'ān) biasanya digunakan ketika akan tidur atau berpisah pada malam hari, bukan sebagai salam umum ketika bertemu pada malam hari.',
      'Kata 吗 (ma) digunakan untuk membentuk kalimat pertanyaan, misalnya 你好吗？ (Nǐ hǎo ma?).'
    ],
    vocabularies: [
      { numberLabel: '1', hanzi: '你好', pinyin: 'Nǐ hǎo', indonesian: 'Halo / Hai' },
      { numberLabel: '2', hanzi: '您好', pinyin: 'Nín hǎo', indonesian: 'Halo (sopan)' },
      { numberLabel: '3', hanzi: '早上好', pinyin: 'Zǎoshang hǎo', indonesian: 'Selamat pagi' },
      { numberLabel: '4', hanzi: '上午好', pinyin: 'Shàngwǔ hǎo', indonesian: 'Selamat pagi (menjelang siang)' },
      { numberLabel: '5', hanzi: '中午好', pinyin: 'Zhōngwǔ hǎo', indonesian: 'Selamat siang' },
      { numberLabel: '6', hanzi: '下午好', pinyin: 'Xiàwǔ hǎo', indonesian: 'Selamat sore' },
      { numberLabel: '7', hanzi: '晚上好', pinyin: 'Wǎnshang hǎo', indonesian: 'Selamat malam' },
      { numberLabel: '8', hanzi: '晚安', pinyin: 'Wǎn\'ān', indonesian: 'Selamat tidur' },
      { numberLabel: '9', hanzi: '再见', pinyin: 'Zàijiàn', indonesian: 'Sampai jumpa' },
      { numberLabel: '10', hanzi: '明天见', pinyin: 'Míngtiān jiàn', indonesian: 'Sampai jumpa besok' },
      { numberLabel: '11', hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', indonesian: 'Apa kabar?' },
      { numberLabel: '12', hanzi: '我很好', pinyin: 'Wǒ hěn hǎo', indonesian: 'Saya baik-baik saja' },
      { numberLabel: '13', hanzi: '谢谢', pinyin: 'Xièxie', indonesian: 'Terima kasih' },
      { numberLabel: '14', hanzi: '不客气', pinyin: 'Bú kèqi', indonesian: 'Sama-sama' },
      { numberLabel: '15', hanzi: '对不起', pinyin: 'Duìbuqǐ', indonesian: 'Maaf' },
      { numberLabel: '16', hanzi: '没关系', pinyin: 'Méi guānxi', indonesian: 'Tidak apa-apa' },
      { numberLabel: '17', hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', indonesian: 'Siapa namamu?' },
      { numberLabel: '18', hanzi: '我叫……', pinyin: 'Wǒ jiào…', indonesian: 'Nama saya…' },
      { numberLabel: '19', hanzi: '很高兴认识你', pinyin: 'Hěn gāoxìng rènshi nǐ', indonesian: 'Senang berkenalan denganmu' },
      { numberLabel: '20', hanzi: '请问', pinyin: 'Qǐngwèn', indonesian: 'Permisi / boleh bertanya' }
    ],
    dialogues: [
      {
        speaker: 'A',
        hanzi: '早上好！',
        pinyin: 'Zǎoshang hǎo!',
        meaning: 'Selamat pagi!'
      },
      {
        speaker: 'B',
        hanzi: '早上好！你好吗？',
        pinyin: 'Zǎoshang hǎo! Nǐ hǎo ma?',
        meaning: 'Selamat pagi! Apa kabar?'
      },
      {
        speaker: 'A',
        hanzi: '我很好，谢谢！你呢？',
        pinyin: 'Wǒ hěn hǎo, xièxie! Nǐ ne?',
        meaning: 'Saya baik, terima kasih! Kamu?'
      },
      {
        speaker: 'B',
        hanzi: '我也很好，谢谢！',
        pinyin: 'Wǒ yě hěn hǎo, xièxie!',
        meaning: 'Saya juga baik, terima kasih!'
      }
    ]
  },
  {
    id: 'topic-introduction',
    topicKey: 'introduction',
    topicName: '2. Perkenalan Diri (自我介绍)',
    chineseName: '主题：自我介绍 (Zìwǒ jièshào) — Perkenalan Diri',
    level: 'Materi 2 • Perkenalan Diri',
    teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
    downloadDocUrl: '/docs/mandarin/2_Materi_Perkenalan_Diri_Mandarin.docx',
    posterFlyer: '/images/mandarin/flyer_perkenalan_diri.jpeg',
    summary:
      'Pola Kalimat (句型 — Jùxíng) Perkenalan Diri dalam bahasa Mandarin: menyapa, menanyakan dan menyebutkan nama, menanyakan asal negara (kewarganegaraan Indonesia), menanyakan usia, serta dialog perkenalan diri antara Xiao Mei dan Xiao Ming.',
    narrative:
      'Pada tema 自我介绍 (Zìwǒ jièshào — Perkenalan Diri), siswa mempelajari 8 pola kalimat utama (句型 — Jùxíng) beserta kosakata kata ganti orang dan sapaan untuk memperkenalkan diri secara runtut dan percaya diri dalam bahasa Mandarin.',
    tableTitle: '句型 (Jùxíng) — Pola Kalimat Perkenalan Diri',
    culturalNote:
      'Dalam bahasa Mandarin, kata “叫 (jiào)” digunakan untuk memperkenalkan nama panggilan/lengkap, sedangkan kata “岁 (suì)” digunakan untuk menyatakan usia.',
    importantNotes: [
      'Pola memperkenalkan nama: 我叫…… (Wǒ jiào…) — Contoh: 我叫小美 (Wǒ jiào Xiǎo Měi — Nama saya Xiao Mei).',
      'Menanyakan asal negara/kebangsaan: 你是哪国人？ (Nǐ shì nǎ guó rén?) → Dijawab: 我是印度尼西亚人。 (Wǒ shì Yìndùníxīyà rén. — Saya orang Indonesia).',
      'Menanyakan usia: 你几岁？ (Nǐ jǐ suì? — Berapa usiamu?) → Dijawab: 我……岁。 (Wǒ… suì. — Contoh: 我十三岁 / Umur saya 13 tahun).',
      'Ungkapan balik “你呢？ (Nǐ ne?)” berarti “Kalau kamu?”, dan “也 (yě)” berarti “juga” (Contoh: 我也很高兴认识你！).'
    ],
    vocabularies: [
      { numberLabel: '1', hanzi: '你好！', pinyin: 'Nǐ hǎo!', indonesian: 'Halo!' },
      { numberLabel: '2', hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', indonesian: 'Siapa namamu?' },
      { numberLabel: '3', hanzi: '我叫……', pinyin: 'Wǒ jiào…', indonesian: 'Nama saya…' },
      { numberLabel: '4', hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', indonesian: 'Kamu berasal dari negara mana?' },
      { numberLabel: '5', hanzi: '我是印度尼西亚人。', pinyin: 'Wǒ shì Yìndùníxīyà rén.', indonesian: 'Saya orang Indonesia.' },
      { numberLabel: '6', hanzi: '你几岁？', pinyin: 'Nǐ jǐ suì?', indonesian: 'Berapa usiamu?' },
      { numberLabel: '7', hanzi: '我……岁。', pinyin: 'Wǒ… suì.', indonesian: 'Umur saya… tahun.' },
      { numberLabel: '8', hanzi: '很高兴认识你！', pinyin: 'Hěn gāoxìng rènshi nǐ!', indonesian: 'Senang berkenalan denganmu!' }
    ],
    subTables: [
      {
        title: 'Kosakata Penting dalam Soal Pilihan Ganda (词汇 — Cíhuì)',
        subtitle: 'Kosakata kata ganti, profesi/status, dan kata kunci yang muncul pada latihan soal Pilihan Ganda (选择题):',
        rows: [
          { numberLabel: '1', hanzi: '我', pinyin: 'Wǒ', indonesian: 'Saya' },
          { numberLabel: '2', hanzi: '你', pinyin: 'Nǐ', indonesian: 'Kamu' },
          { numberLabel: '3', hanzi: '他', pinyin: 'Tā', indonesian: 'Dia (laki-laki)' },
          { numberLabel: '4', hanzi: '她', pinyin: 'Tā', indonesian: 'Dia (perempuan)' },
          { numberLabel: '5', hanzi: '名字', pinyin: 'Míngzi', indonesian: 'Nama' },
          { numberLabel: '6', hanzi: '老师', pinyin: 'Lǎoshī', indonesian: 'Guru' },
          { numberLabel: '7', hanzi: '学生', pinyin: 'Xuésheng', indonesian: 'Siswa / Murid' },
          { numberLabel: '8', hanzi: '朋友', pinyin: 'Péngyou', indonesian: 'Teman' },
          { numberLabel: '9', hanzi: '认识', pinyin: 'Rènshi', indonesian: 'Kenal / Mengenal' },
          { numberLabel: '10', hanzi: '岁', pinyin: 'Suì', indonesian: 'Tahun usia / Umur (年龄)' },
          { numberLabel: '11', hanzi: '你呢？', pinyin: 'Nǐ ne?', indonesian: 'Kalau kamu? / Bagaimana denganmu?' },
          { numberLabel: '12', hanzi: '也', pinyin: 'Yě', indonesian: 'Juga (Contoh: 我也是印度尼西亚人)' }
        ]
      }
    ],
    dialogues: [
      {
        speaker: 'A',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        meaning: 'Halo!'
      },
      {
        speaker: 'B',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        meaning: 'Halo!'
      },
      {
        speaker: 'A',
        hanzi: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzi?',
        meaning: 'Siapa namamu?'
      },
      {
        speaker: 'B',
        hanzi: '我叫小美。你呢？',
        pinyin: 'Wǒ jiào Xiǎo Měi. Nǐ ne?',
        meaning: 'Nama saya Xiao Mei. Kalau kamu?'
      },
      {
        speaker: 'A',
        hanzi: '我叫小明。',
        pinyin: 'Wǒ jiào Xiǎo Míng.',
        meaning: 'Nama saya Xiao Ming.'
      },
      {
        speaker: 'A',
        hanzi: '很高兴认识你！',
        pinyin: 'Hěn gāoxìng rènshi nǐ!',
        meaning: 'Senang berkenalan denganmu!'
      },
      {
        speaker: 'B',
        hanzi: '我也很高兴认识你！',
        pinyin: 'Wǒ yě hěn gāoxìng rènshi nǐ!',
        meaning: 'Saya juga senang berkenalan denganmu!'
      }
    ]
  },
  {
    id: 'topic-number-shuzi',
    topicKey: 'number',
    topicName: '3. Angka Mandarin 0–100 (数字)',
    chineseName: 'Materi Kelas Mandarin: Angka (数字 Shùzì) 0–100',
    level: 'Materi 3 • Angka 0–100',
    teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
    downloadDocUrl: '/docs/mandarin/3_Materi_Angka_Shuzi_Mandarin.docx',
    posterFlyer: '/images/mandarin/flyer_angka_mandarin.jpeg',
    summary:
      'Mengenal angka 0–100 dalam bahasa Mandarin, cara membaca Pinyin, dan cara menulis karakter Hanzi. Dilengkapi rumus angka belasan (11–20), puluhan (20–100), angka gabungan, percakapan usia, kuis interaktif, dan aktivitas kelas.',
    narrative:
      'Mengenal angka 0–100 dalam bahasa Mandarin, cara membaca Pinyin, dan cara menulis karakter Hanzi. Materi ini dirancang untuk siswa SMP Plus Jauharul Maknuun.',
    tableTitle: '1. Mengenal Angka 0–10 (Klik kartu / speaker untuk mendengar pelafalan)',
    importantNotes: [
      'Rumus mudah Angka Belasan (11–19): angka belasan = 十 (sepuluh) + angka satuan. Contoh: 十五 = 十 (10) + 五 (5) = 15.',
      'Rumus mudah Angka Puluhan (20–90): angka satuan + 十 (sepuluh). Contoh: 二十 (èr shí) = 20, 三十 (sān shí) = 30.',
      'Rumus mudah Angka Gabungan (21–99): angka puluhan + 十 + angka satuan. Contoh: 三十六 = 三 (3) + 十 (10) + 六 (6) = 36.',
      'Angka 100 dalam bahasa Mandarin ditulis 一百 (yì bǎi) yang berarti seratus.'
    ],
    vocabularies: [
      { numberLabel: '0', hanzi: '零', pinyin: 'líng', indonesian: 'nol' },
      { numberLabel: '1', hanzi: '一', pinyin: 'yī', indonesian: 'satu' },
      { numberLabel: '2', hanzi: '二', pinyin: 'èr', indonesian: 'dua' },
      { numberLabel: '3', hanzi: '三', pinyin: 'sān', indonesian: 'tiga' },
      { numberLabel: '4', hanzi: '四', pinyin: 'sì', indonesian: 'empat' },
      { numberLabel: '5', hanzi: '五', pinyin: 'wǔ', indonesian: 'lima' },
      { numberLabel: '6', hanzi: '六', pinyin: 'liù', indonesian: 'enam' },
      { numberLabel: '7', hanzi: '七', pinyin: 'qī', indonesian: 'tujuh' },
      { numberLabel: '8', hanzi: '八', pinyin: 'bā', indonesian: 'delapan' },
      { numberLabel: '9', hanzi: '九', pinyin: 'jiǔ', indonesian: 'sembilan' },
      { numberLabel: '10', hanzi: '十', pinyin: 'shí', indonesian: 'sepuluh' }
    ],
    subTables: [
      {
        title: '2. Angka 11–20',
        subtitle: 'Untuk angka 11 sampai 19, cukup tambahkan angka satuan setelah 十 (shí = sepuluh).',
        formulaTitle: 'Rumus mudah:',
        formulaText: 'angka belasan = 十 (sepuluh) + angka satuan',
        formulaExample: 'Contoh: 十五 = 十 (10) + 五 (5) = 15.',
        rows: [
          { numberLabel: '11', hanzi: '十一', pinyin: 'shí yī', indonesian: 'sebelas' },
          { numberLabel: '12', hanzi: '十二', pinyin: 'shí èr', indonesian: 'dua belas' },
          { numberLabel: '13', hanzi: '十三', pinyin: 'shí sān', indonesian: 'tiga belas' },
          { numberLabel: '14', hanzi: '十四', pinyin: 'shí sì', indonesian: 'empat belas' },
          { numberLabel: '15', hanzi: '十五', pinyin: 'shí wǔ', indonesian: 'lima belas' },
          { numberLabel: '16', hanzi: '十六', pinyin: 'shí liù', indonesian: 'enam belas' },
          { numberLabel: '17', hanzi: '十七', pinyin: 'shí qī', indonesian: 'tujuh belas' },
          { numberLabel: '18', hanzi: '十八', pinyin: 'shí bā', indonesian: 'delapan belas' },
          { numberLabel: '19', hanzi: '十九', pinyin: 'shí jiǔ', indonesian: 'sembilan belas' },
          { numberLabel: '20', hanzi: '二十', pinyin: 'èr shí', indonesian: 'dua puluh' }
        ]
      },
      {
        title: '3. Angka Puluhan sampai 100',
        subtitle: 'Untuk puluhan (20, 30, 40, dan seterusnya), letakkan angka satuan di depan 十 (shí).',
        rows: [
          { numberLabel: '20', hanzi: '二十', pinyin: 'èr shí', indonesian: 'dua puluh' },
          { numberLabel: '30', hanzi: '三十', pinyin: 'sān shí', indonesian: 'tiga puluh' },
          { numberLabel: '40', hanzi: '四十', pinyin: 'sì shí', indonesian: 'empat puluh' },
          { numberLabel: '50', hanzi: '五十', pinyin: 'wǔ shí', indonesian: 'lima puluh' },
          { numberLabel: '60', hanzi: '六十', pinyin: 'liù shí', indonesian: 'enam puluh' },
          { numberLabel: '70', hanzi: '七十', pinyin: 'qī shí', indonesian: 'tujuh puluh' },
          { numberLabel: '80', hanzi: '八十', pinyin: 'bā shí', indonesian: 'delapan puluh' },
          { numberLabel: '90', hanzi: '九十', pinyin: 'jiǔ shí', indonesian: 'sembilan puluh' },
          { numberLabel: '100', hanzi: '一百', pinyin: 'yì bǎi', indonesian: 'seratus' }
        ]
      },
      {
        title: 'Bagaimana membaca angka gabungan?',
        subtitle: 'Gabungkan angka puluhan di depan 十 (shí) lalu tambahkan angka satuan di belakangnya:',
        formulaTitle: 'Rumus mudah:',
        formulaText: 'angka puluhan + 十 + angka satuan',
        formulaExample: 'Contoh: 三十六 = 三 (3) + 十 (10) + 六 (6) = 36.',
        rows: [
          { numberLabel: '21', hanzi: '二十一', pinyin: 'èr shí yī', indonesian: 'dua puluh satu' },
          { numberLabel: '25', hanzi: '二十五', pinyin: 'èr shí wǔ', indonesian: 'dua puluh lima' },
          { numberLabel: '36', hanzi: '三十六', pinyin: 'sān shí liù', indonesian: 'tiga puluh enam' },
          { numberLabel: '48', hanzi: '四十八', pinyin: 'sì shí bā', indonesian: 'empat puluh delapan' },
          { numberLabel: '57', hanzi: '五十七', pinyin: 'wǔ shí qī', indonesian: 'lima puluh tujuh' },
          { numberLabel: '99', hanzi: '九十九', pinyin: 'jiǔ shí jiǔ', indonesian: 'sembilan puluh sembilan' }
        ]
      }
    ],
    dialogues: [
      {
        speaker: '小明 (Xiǎo Míng)',
        hanzi: '你几岁？',
        pinyin: 'Nǐ jǐ suì?',
        meaning: 'Kamu berumur berapa tahun?'
      },
      {
        speaker: '小丽 (Xiǎo Lì)',
        hanzi: '我十三岁。',
        pinyin: 'Wǒ shí sān suì.',
        meaning: 'Saya berumur 13 tahun.'
      }
    ],
    dialogueVocabNote: [
      { hanzi: '你', pinyin: 'nǐ', meaning: 'kamu' },
      { hanzi: '我', pinyin: 'wǒ', meaning: 'saya' },
      { hanzi: '几', pinyin: 'jǐ', meaning: 'berapa' },
      { hanzi: '岁', pinyin: 'suì', meaning: 'tahun usia' }
    ],
    dialogueExtraExample: 'Contoh lain: 你几岁？ → 我十二岁。 (Saya berumur 12 tahun)',
    miniQuiz: [
      {
        id: 'mq-1',
        topicId: 'topic-number-shuzi',
        hanzi: '五',
        pinyin: 'wǔ',
        question: '1. Angka Mandarin untuk 5 adalah...',
        options: ['四 (sì)', '五 (wǔ)', '六 (liù)', '七 (qī)'],
        correctIndex: 1,
        explanation: 'Jawaban benar: B. 五 (wǔ) berarti 5 (lima).'
      },
      {
        id: 'mq-2',
        topicId: 'topic-number-shuzi',
        hanzi: '十八',
        pinyin: 'shí bā',
        question: '2. Apa arti dari 十八 (shí bā)?',
        options: ['8', '80', '18', '28'],
        correctIndex: 2,
        explanation: 'Jawaban benar: C. 18 — karena 十 (10) + 八 (8) = 18.'
      },
      {
        id: 'mq-3',
        topicId: 'topic-number-shuzi',
        hanzi: '二十四',
        pinyin: 'èr shí sì',
        question: '3. Bagaimana menulis 24 dalam bahasa Mandarin?',
        options: ['四十二', '二十四', '十四', '二十'],
        correctIndex: 1,
        explanation: 'Jawaban benar: B. 二十四 (èr shí sì) = 二 (2) + 十 (10) + 四 (4) = 24.'
      },
      {
        id: 'mq-4',
        topicId: 'topic-number-shuzi',
        hanzi: '一百',
        pinyin: 'yì bǎi',
        question: '4. Apa arti dari 一百 (yì bǎi)?',
        options: ['10', '50', '100', '1000'],
        correctIndex: 2,
        explanation: 'Jawaban benar: C. 100 — 一百 (yì bǎi) berarti seratus.'
      },
      {
        id: 'mq-5',
        topicId: 'topic-number-shuzi',
        hanzi: '三十九',
        pinyin: 'sān shí jiǔ',
        question: '5. Bagaimana cara membaca 三十九?',
        options: ['sān shí qī', 'sān shí jiǔ', 'sì shí jiǔ', 'jiǔ shí sān'],
        correctIndex: 1,
        explanation: 'Jawaban benar: B. sān shí jiǔ (39 = Tiga puluh sembilan).'
      }
    ],
    shortAnswerExercises: [
      {
        no: 16,
        question: 'Tulislah angka 8 dalam karakter Mandarin dan Pinyin!',
        answer: '八 (bā)'
      },
      {
        no: 17,
        question: 'Angka 十九 (shí jiǔ) jika ditulis dalam angka biasa adalah ....',
        answer: '19'
      },
      {
        no: 18,
        question: 'Tulislah angka 42 dalam karakter Mandarin!',
        answer: '四十二 (sì shí èr)'
      },
      {
        no: 19,
        question: 'Apa arti dari 七十 (qī shí)?',
        answer: '70 (Tujuh puluh)'
      },
      {
        no: 20,
        question: 'Lengkapilah percakapan berikut: 小明：你几岁？ — 小丽：我________岁。(Xiaoli berusia 15 tahun.)',
        answer: '十五 (Wǒ shí wǔ suì.)'
      }
    ],
    classActivities: [
      {
        title: 'Tebak angka',
        desc: 'Guru menyebutkan angka dalam bahasa Indonesia, siswa menjawab dengan bahasa Mandarin.'
      },
      {
        title: 'Angkat kartu',
        desc: 'Guru menunjukkan kartu angka 1–100, siswa menyebutkan karakter Mandarin dan Pinyinnya.'
      },
      {
        title: 'Tanya teman',
        desc: 'Siswa berpasangan dan bertanya “你几岁？” lalu menjawab menggunakan usia masing-masing.'
      },
      {
        title: 'Tantangan angka',
        desc: 'Guru menulis angka seperti 27, 45, atau 68 di papan tulis, lalu siswa menuliskan karakter Mandarinnya.'
      }
    ],
    learningTargets: [
      'Menyebutkan angka 0–100',
      'Membaca Pinyin',
      'Menuliskan angka dalam karakter Mandarin',
      'Menggunakan angka dalam percakapan sederhana'
    ]
  }
];

// ============================================================================
// BANK SOAL LATIHAN & KUIS INTERAKTIF MANDARIN (60 SOAL RESMI)
// Sesuai dokumen latihan Ustadzah Nuriyah & Ustadzah Rizza
// ============================================================================
export const MANDARIN_QUIZZES: MandarinQuizTopic[] = [
  {
    id: 'quiz-salam-sapaan',
    title: '1. Kuis Salam & Sapaan (20 Soal)',
    chineseTitle: '选择题 (Xuǎnzé tí) — Latihan Soal Pilihan Ganda Salam & Sapaan',
    level: 'Topik 1',
    description: '20 soal latihan pilihan ganda resmi materi Salam dan Sapaan (词汇 — Cíhuì & 对话 — Duìhuà).',
    questions: [
      {
        id: 'q-sal-1',
        topicId: 'quiz-salam-sapaan',
        hanzi: '你好',
        pinyin: 'Nǐ hǎo',
        question: '1. “你好” (Nǐ hǎo) 是什么意思？ (Apa arti dari “你好”?)',
        options: ['Sampai jumpa (再见)', 'Halo / Hai (你好)', 'Selamat tidur (晚安)', 'Terima kasih (谢谢)'],
        correctIndex: 1,
        explanation: '“你好” (Nǐ hǎo) berarti Halo atau Hai, digunakan untuk menyapa teman atau orang yang dikenal.'
      },
      {
        id: 'q-sal-2',
        topicId: 'quiz-salam-sapaan',
        hanzi: '早上好',
        pinyin: 'Zǎoshang hǎo',
        question: '2. 早上见面时，我们应该说什么？ (Saat bertemu di pagi hari, apa yang seharusnya kita ucapkan?)',
        options: ['晚上好 (Wǎnshang hǎo)', '下午好 (Xiàwǔ hǎo)', '早上好 (Zǎoshang hǎo)', '晚安 (Wǎn\'ān)'],
        correctIndex: 2,
        explanation: 'Saat bertemu di pagi hari (早上), kita mengucapkan “早上好” (Zǎoshang hǎo — Selamat pagi).'
      },
      {
        id: 'q-sal-3',
        topicId: 'quiz-salam-sapaan',
        hanzi: '晚上好',
        pinyin: 'Wǎnshang hǎo',
        question: '3. “晚上好” 的拼音是什么？ (Apa Pinyin dari “晚上好”?)',
        options: ['Zǎoshang hǎo', 'Xiàwǔ hǎo', 'Zhōngwǔ hǎo', 'Wǎnshang hǎo'],
        correctIndex: 3,
        explanation: '“晚上好” dibaca “Wǎnshang hǎo” yang berarti Selamat malam.'
      },
      {
        id: 'q-sal-4',
        topicId: 'quiz-salam-sapaan',
        hanzi: '再见',
        pinyin: 'Zàijiàn',
        question: '4. “再见” (Zàijiàn) 是什么意思？ (Apa arti dari “再见”?)',
        options: ['Halo (你好)', 'Sampai jumpa (再见)', 'Terima kasih (谢谢)', 'Maaf (对不起)'],
        correctIndex: 1,
        explanation: '“再见” (Zàijiàn) berarti Sampai jumpa.'
      },
      {
        id: 'q-sal-5',
        topicId: 'quiz-salam-sapaan',
        hanzi: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        question: '5. “你好吗？” 应该怎样回答？ (Bagaimana cara menjawab “你好吗？”?)',
        options: ['我很好 (Wǒ hěn hǎo)', '再见 (Zàijiàn)', '晚安 (Wǎn\'ān)', '你好 (Nǐ hǎo)'],
        correctIndex: 0,
        explanation: 'Pertanyaan “你好吗？” (Apa kabar?) dijawab dengan “我很好” (Wǒ hěn hǎo — Saya baik-baik saja).'
      },
      {
        id: 'q-sal-6',
        topicId: 'quiz-salam-sapaan',
        hanzi: '谢谢',
        pinyin: 'Xièxie',
        question: '6. “谢谢” 的正确回答是什么？ (Apa jawaban yang tepat untuk “谢谢”?)',
        options: ['对不起 (Duìbuqǐ)', '再见 (Zàijiàn)', '不客气 (Bú kèqi)', '晚安 (Wǎn\'ān)'],
        correctIndex: 2,
        explanation: 'Ucapan “谢谢” (Terima kasih) dijawab dengan “不客气” (Bú kèqi — Sama-sama).'
      },
      {
        id: 'q-sal-7',
        topicId: 'quiz-salam-sapaan',
        hanzi: '晚安',
        pinyin: 'Wǎn\'ān',
        question: '7. “晚安” 通常在什么时候使用？ (Kapan “晚安” biasanya digunakan?)',
        options: ['Pagi hari (早上)', 'Siang hari (中午)', 'Sore hari (下午)', 'Sebelum tidur (睡觉前)'],
        correctIndex: 3,
        explanation: '“晚安” (Wǎn\'ān) berarti Selamat tidur, digunakan sebelum tidur atau berpisah pada malam hari.'
      },
      {
        id: 'q-sal-8',
        topicId: 'quiz-salam-sapaan',
        hanzi: '下午好',
        pinyin: 'Xiàwǔ hǎo',
        question: '8. “下午好” 的拼音是什么？ (Apa Pinyin dari “下午好”?)',
        options: ['Xiàwǔ hǎo', 'Zǎoshang hǎo', 'Wǎn\'ān', 'Nǐ hǎo'],
        correctIndex: 0,
        explanation: '“下午好” dibaca “Xiàwǔ hǎo” yang berarti Selamat sore.'
      },
      {
        id: 'q-sal-9',
        topicId: 'quiz-salam-sapaan',
        hanzi: '老师您好',
        pinyin: 'Lǎoshī nín hǎo',
        question: '9. 老师来了，学生应该怎样问候？ (Saat guru datang, bagaimana siswa seharusnya menyapa?)',
        options: ['老师再见 (Lǎoshī zàijiàn)', '老师您好 (Lǎoshī nín hǎo)', '晚安老师 (Wǎn\'ān lǎoshī)', '谢谢老师 (Xièxie lǎoshī)'],
        correctIndex: 1,
        explanation: 'Kepada guru (老师), siswa menyapa dengan bentuk hormat “老师您好” (Lǎoshī nín hǎo).'
      },
      {
        id: 'q-sal-10',
        topicId: 'quiz-salam-sapaan',
        hanzi: '中午好',
        pinyin: 'Zhōngwǔ hǎo',
        question: '10. “中午好” (Zhōngwǔ hǎo) 是什么意思？ (Apa arti dari “中午好”?)',
        options: ['Selamat pagi (早上好)', 'Selamat malam (晚上好)', 'Selamat siang (中午好)', 'Selamat sore (下午好)'],
        correctIndex: 2,
        explanation: '“中午好” (Zhōngwǔ hǎo) artinya Selamat siang.'
      },
      {
        id: 'q-sal-11',
        topicId: 'quiz-salam-sapaan',
        hanzi: 'A：你好！',
        pinyin: 'Nǐ hǎo!',
        question: '11. A：你好！ — B：…… (Lengkapi balasan sapaan B!)',
        options: ['你好！(Nǐ hǎo!)', '晚安！(Wǎn\'ān!)', '对不起！(Duìbuqǐ!)', '不客气！(Bú kèqi!)'],
        correctIndex: 0,
        explanation: 'Sapaan “你好！” dibalas dengan “你好！” (Halo!).'
      },
      {
        id: 'q-sal-12',
        topicId: 'quiz-salam-sapaan',
        hanzi: 'A：你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        question: '12. A：你好吗？ — B：…… (Lengkapi jawaban B!)',
        options: ['再见 (Zàijiàn)', '我很好，谢谢 (Wǒ hěn hǎo, xièxie)', '晚上好 (Wǎnshang hǎo)', '不客气 (Bú kèqi)'],
        correctIndex: 1,
        explanation: 'Pertanyaan kabar “你好吗？” dijawab dengan “我很好，谢谢” (Saya baik-baik saja, terima kasih).'
      },
      {
        id: 'q-sal-13',
        topicId: 'quiz-salam-sapaan',
        hanzi: '对不起',
        pinyin: 'Duìbuqǐ',
        question: '13. “对不起” 的正确回答是什么？ (Apa balasan yang tepat untuk “对不起” / Maaf?)',
        options: ['你好 (Nǐ hǎo)', '谢谢 (Xièxie)', '没关系 (Méi guānxi)', '再见 (Zàijiàn)'],
        correctIndex: 2,
        explanation: 'Ucapan “对不起” (Maaf) dijawab dengan “没关系” (Méi guānxi — Tidak apa-apa).'
      },
      {
        id: 'q-sal-14',
        topicId: 'quiz-salam-sapaan',
        hanzi: '明天见',
        pinyin: 'Míngtiān jiàn',
        question: '14. “明天见” (Míngtiān jiàn) 的意思是什么？',
        options: ['Sampai jumpa hari ini', 'Sampai jumpa besok (明天见)', 'Selamat malam (晚上好)', 'Selamat pagi (早上好)'],
        correctIndex: 1,
        explanation: '“明天” (míngtiān) = besok, “见” (jiàn) = bertemu. Jadi “明天见” berarti Sampai jumpa besok.'
      },
      {
        id: 'q-sal-15',
        topicId: 'quiz-salam-sapaan',
        hanzi: 'A：晚上好！',
        pinyin: 'Wǎnshang hǎo!',
        question: '15. A：晚上好！ — B：…… (Lengkapi balasan B!)',
        options: ['下午好！(Xiàwǔ hǎo!)', '早上好！(Zǎoshang hǎo!)', '晚上好！(Wǎnshang hǎo!)', '晚安！(Wǎn\'ān!)'],
        correctIndex: 2,
        explanation: 'Sapaan malam “晚上好！” dibalas dengan “晚上好！” (Selamat malam!).'
      },
      {
        id: 'q-sal-16',
        topicId: 'quiz-salam-sapaan',
        hanzi: '您好',
        pinyin: 'Nín hǎo',
        question: '16. 哪一个是礼貌的问候语？ (Manakah yang merupakan ungkapan sapaan sopan/hormat?)',
        options: ['您好 (Nín hǎo)', '再见 (Zàijiàn)', '晚安 (Wǎn\'ān)', '对不起 (Duìbuqǐ)'],
        correctIndex: 0,
        explanation: '“您好” (Nín hǎo) adalah sapaan hormat/sopan kepada guru atau orang yang lebih tua.'
      },
      {
        id: 'q-sal-17',
        topicId: 'quiz-salam-sapaan',
        hanzi: '我很好，谢谢',
        pinyin: 'Wǒ hěn hǎo, xièxie',
        question: '17. “我很好，谢谢” 的拼音是什么？',
        options: ['Nǐ hǎo ma?', 'Wǒ hěn hǎo, xièxie.', 'Zàijiàn.', 'Wǎnshang hǎo.'],
        correctIndex: 1,
        explanation: '“我很好，谢谢” dibaca “Wǒ hěn hǎo, xièxie.” (Saya baik-baik saja, terima kasih).'
      },
      {
        id: 'q-sal-18',
        topicId: 'quiz-salam-sapaan',
        hanzi: 'A：谢谢！',
        pinyin: 'Xièxie!',
        question: '18. A：谢谢！ — B：……',
        options: ['你好 (Nǐ hǎo)', '晚安 (Wǎn\'ān)', '不客气 (Bú kèqi)', '再见 (Zàijiàn)'],
        correctIndex: 2,
        explanation: 'Balasan dari “谢谢！” (Terima kasih!) adalah “不客气” (Bú kèqi — Sama-sama).'
      },
      {
        id: 'q-sal-19',
        topicId: 'quiz-salam-sapaan',
        hanzi: '再见',
        pinyin: 'Zàijiàn',
        question: '19. 哪一个是告别时使用的表达？ (Manakah ungkapan yang digunakan saat berpamitan/berpisah?)',
        options: ['早上好 (Zǎoshang hǎo)', '你好 (Nǐ hǎo)', '您好 (Nín hǎo)', '再见 (Zàijiàn)'],
        correctIndex: 3,
        explanation: '“再见” (Zàijiàn — Sampai jumpa) digunakan ketika berpisah atau berpamitan.'
      },
      {
        id: 'q-sal-20',
        topicId: 'quiz-salam-sapaan',
        hanzi: 'A：老师您好！',
        pinyin: 'Lǎoshī nín hǎo!',
        question: '20. A：老师您好！ — B：…… (Apa balasan guru ketika disapa siswa?)',
        options: ['你好！(Nǐ hǎo!)', '对不起！(Duìbuqǐ!)', '晚安！(Wǎn\'ān!)', '不客气！(Bú kèqi!)'],
        correctIndex: 0,
        explanation: 'Ketika siswa menyapa “老师您好！”, guru membalas dengan “你好！” (Nǐ hǎo!).'
      }
    ]
  },
  {
    id: 'quiz-introduction',
    title: '2. Kuis Perkenalan Diri (20 Soal)',
    chineseTitle: '第三部分：选择题 (Xuǎnzé tí) — Soal Pilihan Ganda Perkenalan Diri',
    level: 'Topik 2',
    description: '20 soal latihan pilihan ganda resmi materi Perkenalan Diri (自我介绍 — Zìwǒ jièshào).',
    questions: [
      {
        id: 'q-int-1',
        topicId: 'quiz-introduction',
        hanzi: '我',
        pinyin: 'Wǒ',
        question: '1. “我” (Wǒ) 是什么意思？ (Apa arti dari kata “我”?)',
        options: ['Kamu (你)', 'Saya (我)', 'Dia laki-laki (他)', 'Dia perempuan (她)'],
        correctIndex: 1,
        explanation: '“我” (Wǒ) berarti Saya.'
      },
      {
        id: 'q-int-2',
        topicId: 'quiz-introduction',
        hanzi: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzi?',
        question: '2. “你叫什么名字？” 是什么意思？',
        options: ['Berapa usiamu? (你几岁？)', 'Kamu berasal dari negara mana? (你是哪国人？)', 'Siapa namamu? (你叫什么名字？)', 'Apa kabar? (你好吗？)'],
        correctIndex: 2,
        explanation: '“你叫什么名字？” (Nǐ jiào shénme míngzi?) artinya “Siapa namamu?”.'
      },
      {
        id: 'q-int-3',
        topicId: 'quiz-introduction',
        hanzi: '我叫小明。',
        pinyin: 'Wǒ jiào Xiǎo Míng.',
        question: '3. “我叫小明。” 是什么意思？',
        options: ['Nama saya Xiao Ming (我叫小明)', 'Saya adalah guru (我是老师)', 'Saya berusia 14 tahun (我十四岁)', 'Saya adalah siswa (我是学生)'],
        correctIndex: 0,
        explanation: '“我叫小明。” (Wǒ jiào Xiǎo Míng) berarti “Nama saya Xiao Ming.”'
      },
      {
        id: 'q-int-4',
        topicId: 'quiz-introduction',
        hanzi: '名字',
        pinyin: 'Míngzi',
        question: '4. “名字” 的拼音是什么？ (Apa Pinyin dari “名字” / Nama?)',
        options: ['Xuésheng', 'Lǎoshī', 'Péngyou', 'Míngzi'],
        correctIndex: 3,
        explanation: '“名字” (Nama) dibaca “Míngzi”.'
      },
      {
        id: 'q-int-5',
        topicId: 'quiz-introduction',
        hanzi: '老师',
        pinyin: 'Lǎoshī',
        question: '5. “老师” (Lǎoshī) 是什么意思？',
        options: ['Siswa / Murid (学生)', 'Guru (老师)', 'Teman (朋友)', 'Nama (名字)'],
        correctIndex: 1,
        explanation: '“老师” (Lǎoshī) berarti Guru.'
      },
      {
        id: 'q-int-6',
        topicId: 'quiz-introduction',
        hanzi: '学生',
        pinyin: 'Xuésheng',
        question: '6. “学生” 的拼音是什么？ (Apa Pinyin dari “学生” / Siswa?)',
        options: ['Péngyou', 'Gāoxìng', 'Xuésheng', 'Rènshi'],
        correctIndex: 2,
        explanation: '“学生” (Murid / Siswa) dibaca “Xuésheng”.'
      },
      {
        id: 'q-int-7',
        topicId: 'quiz-introduction',
        hanzi: '很高兴认识你！',
        pinyin: 'Hěn gāoxìng rènshi nǐ!',
        question: '7. “很高兴认识你！” 是什么意思？',
        options: ['Senang berkenalan denganmu!', 'Sampai jumpa!', 'Berapa usiamu?', 'Siapa namamu?'],
        correctIndex: 0,
        explanation: '“很高兴认识你！” (Hěn gāoxìng rènshi nǐ!) artinya “Senang berkenalan denganmu!”.'
      },
      {
        id: 'q-int-8',
        topicId: 'quiz-introduction',
        hanzi: '你呢？',
        pinyin: 'Nǐ ne?',
        question: '8. “你呢？” (Nǐ ne?) 是什么意思？',
        options: ['Siapa kamu? (你是谁？)', 'Apa kabar? (你好吗？)', 'Berapa usiamu? (你几岁？)', 'Kalau kamu? / Bagaimana denganmu? (你呢？)'],
        correctIndex: 3,
        explanation: '“你呢？” (Nǐ ne?) berarti “Kalau kamu?” untuk menanyakan balik pertanyaan sebelumnya.'
      },
      {
        id: 'q-int-9',
        topicId: 'quiz-introduction',
        hanzi: '我也是印度尼西亚人。',
        pinyin: 'Wǒ yě shì Yìndùníxīyà rén.',
        question: '9. “我也是印度尼西亚人。” 是什么意思？',
        options: ['Saya adalah guru.', 'Saya juga orang Indonesia.', 'Saya adalah siswa.', 'Nama saya Indonesia.'],
        correctIndex: 1,
        explanation: '“我也是印度尼西亚人。” berarti “Saya juga orang Indonesia.”'
      },
      {
        id: 'q-int-10',
        topicId: 'quiz-introduction',
        hanzi: '你是哪国人？',
        pinyin: 'Nǐ shì nǎ guó rén?',
        question: '10. “你是哪国人？” 是在问什么？ (Kalimat “你是哪国人？” menanyakan tentang apa?)',
        options: ['Nama lengkap (姓名)', 'Usia / Umur (年龄)', 'Kewarganegaraan / Asal Negara (国籍)', 'Pekerjaan (职业)'],
        correctIndex: 2,
        explanation: '“你是哪国人？” (Kamu orang negara mana?) digunakan untuk menanyakan kewarganegaraan (国籍).'
      },
      {
        id: 'q-int-11',
        topicId: 'quiz-introduction',
        hanzi: '我十三岁。',
        pinyin: 'Wǒ shí sān suì.',
        question: '11. “我十三岁。” 是什么意思？',
        options: ['Saya berumur 14 tahun (我十四岁)', 'Saya berumur 13 tahun (我十三岁)', 'Saya berumur 12 tahun (我十二岁)', 'Saya berumur 15 tahun (我十五岁)'],
        correctIndex: 1,
        explanation: '十三 (shí sān) adalah 13, sehingga “我十三岁” berarti “Saya berumur 13 tahun”.'
      },
      {
        id: 'q-int-12',
        topicId: 'quiz-introduction',
        hanzi: '岁',
        pinyin: 'Suì',
        question: '12. “岁” (suì) 通常用来表示什么？ (Kata “岁” biasanya digunakan untuk menyatakan apa?)',
        options: ['Usia / Umur (年龄)', 'Nama (姓名)', 'Kebangsaan (国籍)', 'Profesi (职业)'],
        correctIndex: 0,
        explanation: 'Kata satuan “岁” (suì) digunakan untuk menyatakan usia/umur (年龄).'
      },
      {
        id: 'q-int-13',
        topicId: 'quiz-introduction',
        hanzi: '朋友',
        pinyin: 'Péngyou',
        question: '13. “朋友” (Teman) 的拼音是什么？',
        options: ['Lǎoshī', 'Xuésheng', 'Míngzi', 'Péngyou'],
        correctIndex: 3,
        explanation: '“朋友” (Teman) dibaca “Péngyou”.'
      },
      {
        id: 'q-int-14',
        topicId: 'quiz-introduction',
        hanzi: '他',
        pinyin: 'Tā',
        question: '14. “他” 是什么意思？',
        options: ['Dia perempuan (她)', 'Dia laki-laki (他)', 'Saya (我)', 'Kamu (你)'],
        correctIndex: 1,
        explanation: 'Karakter “他” (dengan radikal orang 亻) berarti Dia (laki-laki).'
      },
      {
        id: 'q-int-15',
        topicId: 'quiz-introduction',
        hanzi: '她',
        pinyin: 'Tā',
        question: '15. “她” 是什么意思？',
        options: ['Saya (我)', 'Kamu (你)', 'Dia perempuan (她)', 'Dia laki-laki (他)'],
        correctIndex: 2,
        explanation: 'Karakter “她” (dengan radikal perempuan 女) berarti Dia (perempuan).'
      },
      {
        id: 'q-int-16',
        topicId: 'quiz-introduction',
        hanzi: '认识',
        pinyin: 'Rènshi',
        question: '16. “认识” (Rènshi) 的意思是什么？',
        options: ['Kenal / Mengenal (认识)', 'Senang / Gembira (高兴)', 'Berasal dari (来自)', 'Bernama (叫什么)'],
        correctIndex: 0,
        explanation: '“认识” (Rènshi) berarti kenal atau mengenal.'
      },
      {
        id: 'q-int-17',
        topicId: 'quiz-introduction',
        hanzi: '也',
        pinyin: 'Yě',
        question: '17. “我也很高兴认识你！” 中的 “也” (yě) 是什么意思？',
        options: ['Sangat (很)', 'Kenal (认识)', 'Saya (我)', 'Juga (也)'],
        correctIndex: 3,
        explanation: 'Kata “也” (yě) berarti “juga”.'
      },
      {
        id: 'q-int-18',
        topicId: 'quiz-introduction',
        hanzi: '我叫安娜。',
        pinyin: 'Wǒ jiào Ānnà.',
        question: '18. “我叫安娜。” 中的 “叫” (jiào) 是什么意思？',
        options: ['Belajar (学习)', 'Bernama / Dipanggil (叫作 / 名叫)', 'Mengenal (认识)', 'Berasal dari (来自)'],
        correctIndex: 1,
        explanation: 'Dalam kalimat perkenalan, “叫” (jiào) berarti bernama atau dipanggil.'
      },
      {
        id: 'q-int-19',
        topicId: 'quiz-introduction',
        hanzi: '再见！',
        pinyin: 'Zàijiàn!',
        question: '19. “再见！” 通常在什么时候说？ (Kapan “再见！” biasanya diucapkan?)',
        options: ['Saat memperkenalkan nama (介绍姓名时)', 'Saat menanyakan usia (询问年龄时)', 'Saat berpisah / berpamitan (告别时)', 'Saat menanyakan asal negara (询问国籍时)'],
        correctIndex: 2,
        explanation: '“再见！” diucapkan pada saat berpamitan atau berpisah (告别时).'
      },
      {
        id: 'q-int-20',
        topicId: 'quiz-introduction',
        hanzi: '我叫小丽。',
        pinyin: 'Wǒ jiào Xiǎo Lì.',
        question: '20. 下面哪一句是正确的自我介绍？ (Manakah kalimat perkenalan diri yang benar di bawah ini?)',
        options: ['我叫小丽。(Wǒ jiào Xiǎo Lì.)', '你叫小丽？(Nǐ jiào Xiǎo Lì?)', '名字我小丽。', '叫我名字小丽。'],
        correctIndex: 0,
        explanation: 'Susunan kalimat perkenalan diri yang benar adalah Subjek + 叫 + Nama: “我叫小丽。” (Nama saya Xiao Li).'
      }
    ]
  },
  {
    id: 'quiz-number-shuzi',
    title: '3. Kuis Angka 0–100 (20 Soal)',
    chineseTitle: 'SOAL LATIHAN BAHASA MANDARIN — Materi: Angka (数字 Shùzì) 0–100',
    level: 'Topik 3',
    description: '20 soal latihan resmi materi Angka Mandarin (数字 Shùzì) 0–100: A. Pilihan Ganda (1–15) & B. Isian Singkat (16–20).',
    questions: [
      {
        id: 'q-num-1',
        topicId: 'quiz-number-shuzi',
        hanzi: '一',
        pinyin: 'yī',
        question: '1. Apa arti angka 一 (yī)?',
        options: ['Dua', 'Satu', 'Tiga', 'Empat'],
        correctIndex: 1,
        explanation: '一 (yī) berarti Satu (1).'
      },
      {
        id: 'q-num-2',
        topicId: 'quiz-number-shuzi',
        hanzi: '五',
        pinyin: 'wǔ',
        question: '2. Angka Mandarin untuk lima (5) adalah ....',
        options: ['四 (sì)', '六 (liù)', '五 (wǔ)', '七 (qī)'],
        correctIndex: 2,
        explanation: 'Lima (5) dalam bahasa Mandarin adalah 五 (wǔ).'
      },
      {
        id: 'q-num-3',
        topicId: 'quiz-number-shuzi',
        hanzi: '十',
        pinyin: 'shí',
        question: '3. Arti dari 十 (shí) adalah ....',
        options: ['Delapan', 'Sembilan', 'Seratus', 'Sepuluh'],
        correctIndex: 3,
        explanation: '十 (shí) berarti Sepuluh (10).'
      },
      {
        id: 'q-num-4',
        topicId: 'quiz-number-shuzi',
        hanzi: '三',
        pinyin: 'sān',
        question: '4. Bagaimana penulisan angka 3 dalam bahasa Mandarin?',
        options: ['三', '二', '五', '六'],
        correctIndex: 0,
        explanation: 'Angka 3 ditulis dengan tiga garis horizontal: 三 (sān).'
      },
      {
        id: 'q-num-5',
        topicId: 'quiz-number-shuzi',
        hanzi: '九',
        pinyin: 'jiǔ',
        question: '5. Angka Mandarin 九 (jiǔ) berarti ....',
        options: ['Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'],
        correctIndex: 2,
        explanation: '九 (jiǔ) berarti Sembilan (9).'
      },
      {
        id: 'q-num-6',
        topicId: 'quiz-number-shuzi',
        hanzi: '十一',
        pinyin: 'shí yī',
        question: '6. Bagaimana penulisan angka 11 dalam bahasa Mandarin?',
        options: ['二十 (èr shí)', '十一 (shí yī)', '十二 (shí èr)', '十三 (shí sān)'],
        correctIndex: 1,
        explanation: 'Rumus belasan: 十 (10) + 一 (1) = 十一 (shí yī — 11).'
      },
      {
        id: 'q-num-7',
        topicId: 'quiz-number-shuzi',
        hanzi: '十五',
        pinyin: 'shí wǔ',
        question: '7. Angka 十五 (shí wǔ) berarti ....',
        options: ['Lima belas (15)', 'Lima puluh (50)', 'Sepuluh (10)', 'Dua puluh lima (25)'],
        correctIndex: 0,
        explanation: '十五 = 十 (10) + 五 (5) = Lima belas (15).'
      },
      {
        id: 'q-num-8',
        topicId: 'quiz-number-shuzi',
        hanzi: '二十',
        pinyin: 'èr shí',
        question: '8. Bagaimana penulisan angka 20 dalam bahasa Mandarin?',
        options: ['十二', '二十', '二十一', '十'],
        correctIndex: 1,
        explanation: '20 adalah dua puluhan: 二 (2) + 十 (10) = 二十 (èr shí).'
      },
      {
        id: 'q-num-9',
        topicId: 'quiz-number-shuzi',
        hanzi: '三十六',
        pinyin: 'sān shí liù',
        question: '9. Angka 三十六 (sān shí liù) berarti ....',
        options: ['Tiga puluh (30)', 'Enam puluh tiga (63)', 'Tiga puluh enam (36)', 'Tiga belas (13)'],
        correctIndex: 2,
        explanation: '三十六 = 三 (3) + 十 (10) + 六 (6) = Tiga puluh enam (36).'
      },
      {
        id: 'q-num-10',
        topicId: 'quiz-number-shuzi',
        hanzi: '四十八',
        pinyin: 'sì shí bā',
        question: '10. Bagaimana penulisan angka 48 dalam bahasa Mandarin?',
        options: ['四十八', '八十四', '四十六', '五十八'],
        correctIndex: 0,
        explanation: '48 = 四 (4) + 十 (10) + 八 (8) = 四十八 (sì shí bā).'
      },
      {
        id: 'q-num-11',
        topicId: 'quiz-number-shuzi',
        hanzi: '五十七',
        pinyin: 'wǔ shí qī',
        question: '11. Angka 五十七 (wǔ shí qī) berarti ....',
        options: ['Tujuh puluh lima (75)', 'Lima puluh tujuh (57)', 'Lima belas (15)', 'Lima puluh (50)'],
        correctIndex: 1,
        explanation: '五十七 = 五 (5) + 十 (10) + 七 (7) = Lima puluh tujuh (57).'
      },
      {
        id: 'q-num-12',
        topicId: 'quiz-number-shuzi',
        hanzi: '一百',
        pinyin: 'yì bǎi',
        question: '12. Apa arti dari 一百 (yì bǎi)?',
        options: ['Sepuluh', 'Sebelas', 'Seratus', 'Sembilan puluh'],
        correctIndex: 2,
        explanation: '一百 (yì bǎi) artinya Seratus (100).'
      },
      {
        id: 'q-num-13',
        topicId: 'quiz-number-shuzi',
        hanzi: '二十五',
        pinyin: 'èr shí wǔ',
        question: '13. Bagaimana penulisan angka 25 dalam bahasa Mandarin?',
        options: ['二十五', '五十二', '二十六', '十五'],
        correctIndex: 0,
        explanation: '25 = 二 (2) + 十 (10) + 五 (5) = 二十五 (èr shí wǔ).'
      },
      {
        id: 'q-num-14',
        topicId: 'quiz-number-shuzi',
        hanzi: '三十九',
        pinyin: 'Sān shí jiǔ',
        question: '14. Pinyin yang benar untuk angka 39 (三十九) adalah ....',
        options: ['Sì shí jiǔ', 'Sān shí qī', 'Sān shí jiǔ', 'Jiǔ shí sān'],
        correctIndex: 2,
        explanation: '三十九 (39) dibaca “Sān shí jiǔ”.'
      },
      {
        id: 'q-num-15',
        topicId: 'quiz-number-shuzi',
        hanzi: '我十三岁。',
        pinyin: 'Wǒ shí sān suì.',
        question: '15. 小明：你几岁？ — 小丽：我十三岁。 Berapakah usia Xiaoli?',
        options: ['10 tahun', '12 tahun', '13 tahun', '30 tahun'],
        correctIndex: 2,
        explanation: '十三 (shí sān) adalah 13, sehingga “我十三岁” berarti Xiaoli berusia 13 tahun.'
      },
      {
        id: 'q-num-16',
        topicId: 'quiz-number-shuzi',
        hanzi: '八',
        pinyin: 'bā',
        question: '16. [Bagian B — Isian Singkat] Tulislah angka 8 dalam karakter Mandarin dan Pinyin!',
        options: ['七 (qī)', '八 (bā)', '六 (liù)', '九 (jiǔ)'],
        correctIndex: 1,
        explanation: 'Angka 8 ditulis 八 dengan Pinyin “bā”.'
      },
      {
        id: 'q-num-17',
        topicId: 'quiz-number-shuzi',
        hanzi: '十九',
        pinyin: 'shí jiǔ',
        question: '17. [Bagian B — Isian Singkat] Angka 十九 (shí jiǔ) jika ditulis dalam angka biasa adalah ....',
        options: ['90', '91', '19', '18'],
        correctIndex: 2,
        explanation: '十九 = 十 (10) + 九 (9) = 19.'
      },
      {
        id: 'q-num-18',
        topicId: 'quiz-number-shuzi',
        hanzi: '四十二',
        pinyin: 'sì shí èr',
        question: '18. [Bagian B — Isian Singkat] Tulislah angka 42 dalam karakter Mandarin!',
        options: ['二十四', '四十二', '四十二个', '十四二'],
        correctIndex: 1,
        explanation: 'Angka 42 = 四 (4) + 十 (10) + 二 (2) = 四十二 (sì shí èr).'
      },
      {
        id: 'q-num-19',
        topicId: 'quiz-number-shuzi',
        hanzi: '七十',
        pinyin: 'qī shí',
        question: '19. [Bagian B — Isian Singkat] Apa arti dari 七十 (qī shí)?',
        options: ['Tujuh belas (17)', 'Tujuh puluh (70)', 'Tujuh (7)', 'Delapan puluh (80)'],
        correctIndex: 1,
        explanation: '七十 (qī shí) = 七 (7) + 十 (10) + Tujuh puluh (70).'
      },
      {
        id: 'q-num-20',
        topicId: 'quiz-number-shuzi',
        hanzi: '我十五岁。',
        pinyin: 'Wǒ shí wǔ suì.',
        question: '20. [Bagian B — Isian Singkat] 小明：你几岁？ — 小丽：我________岁。(Xiaoli berusia 15 tahun.)',
        options: ['五十 (wǔ shí)', '十五 (shí wǔ)', '五 (wǔ)', '二十五 (èr shí wǔ)'],
        correctIndex: 1,
        explanation: 'Usia 15 tahun ditulis “十五” (shí wǔ), sehingga menjadi “我十五岁。”'
      }
    ]
  }
];

export const MandarinClassSection: React.FC = () => {
  const location = useLocation();
  const [topics, setTopics] = useState<MandarinTopicItem[]>(MANDARIN_TOPICS);
  const [quizTopics, setQuizTopics] = useState<MandarinQuizTopic[]>(MANDARIN_QUIZZES);
  const [activeSubTab, setActiveSubTab] = useState<'materi' | 'quiz'>(() =>
    location.pathname.includes('/quiz') ? 'quiz' : 'materi'
  );
  const [selectedTopic, setSelectedTopic] = useState<MandarinTopicItem>(MANDARIN_TOPICS[0]);
  const [flyerLightbox, setFlyerLightbox] = useState<{ url: string; title: string } | null>(null);

  // Interactive Mini-Quiz State (Inside Topic 3 Material)
  const [miniQuizAnswers, setMiniQuizAnswers] = useState<Record<string, number>>({});
  const [revealedShortAnswers, setRevealedShortAnswers] = useState<Record<number, boolean>>({});

  // Full Quiz Tab State
  const [activeQuizTopic, setActiveQuizTopic] = useState<MandarinQuizTopic>(MANDARIN_QUIZZES[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [answeredState, setAnsweredState] = useState<boolean>(false);

  // Fetch custom lessons, vocabularies & quizzes from Supabase if added via Admin
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let mounted = true;

    const loadMandarinFromDb = async () => {
      try {
        const [{ data: lessonsData }, { data: vocabData }, { data: quizData }] = await Promise.all([
          supabase.from('mandarin_lessons').select('*').order('order_index', { ascending: true }),
          supabase.from('mandarin_vocabularies').select('*').order('created_at', { ascending: true }),
          supabase.from('mandarin_quizzes').select('*').order('created_at', { ascending: true }),
        ]);

        if (!mounted) return;

        if (lessonsData && lessonsData.length > 0) {
          const customTopics: MandarinTopicItem[] = lessonsData.map((l: any, idx: number) => {
            const matchingVocab = (vocabData || []).filter(
              (v: any) => !v.category || v.category.toLowerCase() === (l.topic || '').toLowerCase()
            );
            return {
              id: `db-lesson-${l.id}`,
              topicKey: 'salam',
              topicName: l.topic || `Materi Tambahan ${idx + 1}`,
              chineseName: `${l.hanzi || ''} ${l.pinyin ? `(${l.pinyin})` : ''}`.trim() || l.topic,
              level: l.level || 'Materi Tambahan',
              teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
              posterFlyer: l.cover_image || '/images/mandarin/flyer_salam_dan_sapaan.png',
              summary: l.meaning_id || `Materi Bahasa Mandarin: ${l.topic}`,
              narrative: l.meaning_id || '',
              tableTitle: `Kosakata ${l.topic}`,
              vocabularies: matchingVocab.map((v: any, vIdx: number) => ({
                numberLabel: String(vIdx + 1),
                hanzi: v.hanzi,
                pinyin: v.pinyin,
                indonesian: v.arti,
              })),
              dialogues: Array.isArray(l.dialog_script) ? l.dialog_script : [],
            };
          });
          setTopics([...MANDARIN_TOPICS, ...customTopics]);
        }

        if (quizData && quizData.length > 0) {
          const customQuestions = quizData.map((q: any, idx: number) => ({
            id: `db-quiz-${q.id}`,
            topicId: 'quiz-db-custom',
            hanzi: q.question_type || '练习',
            pinyin: '',
            question: q.question,
            options: Array.isArray(q.options) ? q.options.map(String) : ['A', 'B', 'C', 'D'],
            correctIndex: typeof q.correct_index === 'number' ? q.correct_index : 0,
            explanation: q.explanation || '',
          }));
          const customQuizTopic: MandarinQuizTopic = {
            id: 'quiz-db-custom',
            title: 'Latihan Tambahan',
            chineseTitle: '补充练习 (Bǔchōng liànxí)',
            level: `${customQuestions.length} Soal`,
            description: 'Soal latihan tambahan dari pengampu Kelas Bahasa Mandarin.',
            questions: customQuestions,
          };
          setQuizTopics([...MANDARIN_QUIZZES, customQuizTopic]);
        }
      } catch (err) {
        console.warn('[MandarinClassSection] Non-critical DB fetch notice:', err);
      }
    };

    loadMandarinFromDb();

    return () => {
      mounted = false;
    };
  }, []);

  // Sync sub-tab with URL route (/smart-jm/mandarin/materi vs /smart-jm/mandarin/quiz)
  useEffect(() => {
    if (location.pathname.includes('/quiz')) {
      setActiveSubTab('quiz');
    } else if (location.pathname.includes('/materi')) {
      setActiveSubTab('materi');
    }
  }, [location.pathname]);

  // Web Speech API Pronunciation Helper
  const speakChinese = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentQuestions = activeQuizTopic.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (answeredState) return;

    setSelectedAnswerIndex(index);
    setAnsweredState(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setAnsweredState(false);
    } else {
      setIsQuizCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAnsweredState(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleSwitchQuizTopic = (quizId: string) => {
    const found = quizTopics.find((q) => q.id === quizId);
    if (!found) return;
    setActiveQuizTopic(found);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAnsweredState(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* ========================================================= */}
      {/* SUB-SECTION TOGGLER: MATERI BELAJAR vs QUIZ INTERAKTIF */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-1.5 sm:pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold uppercase tracking-wider mb-0.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kelas Bahasa Mandarin • Belajar Bahasa Mandarin Itu Seru!</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Kelas Mandarin SMP Plus Jauharul Maknuun
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pengampu: <strong className="text-zinc-700 dark:text-zinc-300">Ustadzah Nuriyah &amp; Ustadzah Rizza</strong> • Modul Salam &amp; Sapaan, Perkenalan Diri (自我介绍), serta Angka (数字 0–100)
          </p>
        </div>

        {/* Liquid Mercury Sub-Navigation Switcher */}
        <div className="shrink-0">
          <LiquidMercuryControl<'materi' | 'quiz'>
            size="md"
            options={[
              { id: 'materi', label: 'Materi & Flyer Belajar', icon: BookOpen },
              { id: 'quiz', label: 'Latihan Soal (60 Soal)', icon: HelpCircle }
            ]}
            value={activeSubTab}
            onChange={setActiveSubTab}
            ariaLabel="Sub-Navigasi Mandarin Class"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* KONTEN 1: MATERI BELAJAR BERBASIS TOPIK */}
      {/* ========================================================= */}
      {activeSubTab === 'materi' && (
        <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
          {/* Topik Pills Horizontal Selector (Liquid Mercury) */}
          <div className="shrink-0 max-w-full overflow-x-auto no-scrollbar">
            <LiquidMercuryControl
              size="sm"
              options={topics.map((t) => ({ id: t.id, label: t.topicName, icon: Languages }))}
              value={selectedTopic.id}
              onChange={(id) => {
                const found = topics.find((t) => t.id === id);
                if (found) setSelectedTopic(found);
              }}
              ariaLabel="Filter Topik Materi Mandarin"
            />
          </div>

          {/* Kartu Detail Materi Terpilih */}
          <div className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-3 sm:p-4 lg:p-4.5 shadow-xs space-y-3 sm:space-y-3.5">
            {/* Header Topik + Tombol Unduh Materi (.docx) */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {selectedTopic.level}
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    {selectedTopic.chineseName}
                  </span>
                  {selectedTopic.teacherMentor && (
                    <span className="text-xs text-zinc-500">
                      • Pengampu: <strong className="text-zinc-700 dark:text-zinc-300">{selectedTopic.teacherMentor}</strong>
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {selectedTopic.topicName}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                  {selectedTopic.summary}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {selectedTopic.downloadDocUrl && (
                  <a
                    href={selectedTopic.downloadDocUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Modul (.docx)</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const quizMap: Record<string, string> = {
                      'topic-salam-sapaan': 'quiz-salam-sapaan',
                      'topic-introduction': 'quiz-introduction',
                      'topic-number-shuzi': 'quiz-number-shuzi'
                    };
                    const targetQuizId = quizMap[selectedTopic.id];
                    if (targetQuizId) handleSwitchQuizTopic(targetQuizId);
                    setActiveSubTab('quiz');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-800 font-bold text-xs transition-all cursor-pointer active:scale-95"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Kerjakan 20 Soal Latihan</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Flyer Visual Resmi & Konten Pembelajaran */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
              {/* Kolom Kiri: Poster Flyer Visual + Catatan Penting + Target Pembelajaran */}
              <div className="lg:col-span-4 space-y-2.5 lg:sticky lg:top-20">
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm cursor-pointer group"
                  onClick={() =>
                    setFlyerLightbox({
                      url: selectedTopic.posterFlyer,
                      title: `${selectedTopic.topicName} — ${selectedTopic.chineseName}`
                    })
                  }
                  title="Klik untuk memperbesar Flyer Kelas Mandarin"
                >
                  <img
                    src={selectedTopic.posterFlyer}
                    alt={selectedTopic.topicName}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/95 text-zinc-900 flex items-center justify-center shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[9.5px] uppercase font-bold text-amber-300 tracking-wider block">
                      Flyer Resmi Kelas Mandarin (Klik untuk Zoom)
                    </span>
                    <div className="text-xs sm:text-sm font-bold drop-shadow-sm">
                      {selectedTopic.topicName}
                    </div>
                  </div>
                </div>

                {/* Catatan Penting / Rumus Kaidah Bahasa */}
                {selectedTopic.importantNotes && selectedTopic.importantNotes.length > 0 && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Catatan Penting:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-950/90 dark:text-amber-200/90 list-disc list-inside leading-relaxed">
                      {selectedTopic.importantNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Pembelajaran (Jika Ada, Misal Materi Angka) */}
                {selectedTopic.learningTargets && selectedTopic.learningTargets.length > 0 && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                      <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Target Pembelajaran:</span>
                    </div>
                    <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80">
                      Setelah materi selesai, siswa mampu:
                    </p>
                    <ul className="space-y-1 text-[11px] text-emerald-950/90 dark:text-emerald-200/90 list-disc list-inside leading-relaxed font-medium">
                      {selectedTopic.learningTargets.map((target, idx) => (
                        <li key={idx}>{target}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Tabel Resmi Materi, Sub-Tabel, Dialog Percakapan, Kuis Interaktif & Aktivitas Kelas */}
              <div className="lg:col-span-8 space-y-3">
                {/* Tabel Utama Kosakata / Pola Kalimat / Angka 0–10 */}
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-2xs">
                  <div className="px-3 py-2 bg-emerald-900 text-white flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <Languages className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{selectedTopic.tableTitle || 'Tabel Kosakata & Pola Kalimat'}</span>
                    </h4>
                    <span className="text-[10.5px] text-emerald-200 font-medium shrink-0">
                      🔊 Klik speaker untuk audio
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border-b border-zinc-200/70 dark:border-zinc-800">
                          <th className="py-2 px-2.5 font-bold w-12 text-center">
                            {selectedTopic.topicKey === 'number' ? 'Angka' : 'No.'}
                          </th>
                          <th className="py-2 px-3 font-bold">Hanzi (汉字)</th>
                          <th className="py-2 px-3 font-bold">Pinyin</th>
                          <th className="py-2 px-3 font-bold">Arti Bahasa Indonesia</th>
                          <th className="py-2 px-2.5 font-bold text-center w-14">Audio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/70">
                        {selectedTopic.vocabularies.map((vocab, idx) => (
                          <tr
                            key={idx}
                            onClick={() => speakChinese(vocab.hanzi)}
                            className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                          >
                            <td className="py-1.5 px-2.5 text-center font-bold text-zinc-500 dark:text-zinc-400">
                              {vocab.numberLabel ?? idx + 1}
                            </td>
                            <td className="py-1.5 px-3 text-base sm:text-lg font-bold text-red-600 dark:text-red-400 font-serif">
                              {vocab.hanzi}
                            </td>
                            <td className="py-1.5 px-3 font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                              {vocab.pinyin}
                            </td>
                            <td className="py-1.5 px-3 font-medium text-zinc-800 dark:text-zinc-200">
                              {vocab.indonesian}
                            </td>
                            <td className="py-1.5 px-2.5 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakChinese(vocab.hanzi);
                                }}
                                className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 inline-flex items-center justify-center border border-emerald-200/70 dark:border-emerald-800 cursor-pointer"
                                title={`Dengarkan: ${vocab.hanzi} (${vocab.pinyin})`}
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sub-Tabel Tambahan (Angka 11–20, Angka Puluhan 20–100, Angka Gabungan, atau Kosakata Pendukung) */}
                {selectedTopic.subTables &&
                  selectedTopic.subTables.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-2xs space-y-0"
                    >
                      <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800/90 border-b border-zinc-200/70 dark:border-zinc-800">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm">
                          {sub.title}
                        </h4>
                        {sub.subtitle && (
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                            {sub.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-b border-zinc-200/70 dark:border-zinc-800">
                              <th className="py-1.5 px-2.5 font-bold w-14 text-center">
                                {selectedTopic.topicKey === 'number' ? 'Angka' : 'No.'}
                              </th>
                              <th className="py-1.5 px-3 font-bold">Karakter (汉字)</th>
                              <th className="py-1.5 px-3 font-bold">Pinyin</th>
                              <th className="py-1.5 px-3 font-bold">Arti</th>
                              <th className="py-1.5 px-2.5 font-bold text-center w-14">Audio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/70">
                            {sub.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                onClick={() => speakChinese(row.hanzi)}
                                className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                              >
                                <td className="py-1.5 px-2.5 text-center font-bold text-emerald-800 dark:text-emerald-300">
                                  {row.numberLabel ?? rIdx + 1}
                                </td>
                                <td className="py-1.5 px-3 text-base font-bold text-red-600 dark:text-red-400 font-serif">
                                  {row.hanzi}
                                </td>
                                <td className="py-1.5 px-3 font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                                  {row.pinyin}
                                </td>
                                <td className="py-1.5 px-3 font-medium text-zinc-800 dark:text-zinc-200">
                                  {row.indonesian}
                                </td>
                                <td className="py-1.5 px-2.5 text-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speakChinese(row.hanzi);
                                    }}
                                    className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 inline-flex items-center justify-center border border-emerald-200/70 dark:border-emerald-800 cursor-pointer"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {sub.formulaText && (
                        <div className="p-2.5 sm:px-3 bg-amber-50/80 dark:bg-amber-950/30 border-t border-amber-200/60 dark:border-amber-800/50 text-xs flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-amber-900 dark:text-amber-300">
                            {sub.formulaTitle || 'Rumus mudah:'}
                          </span>
                          <code className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-bold">
                            {sub.formulaText}
                          </code>
                          {sub.formulaExample && (
                            <span className="text-amber-900/90 dark:text-amber-200/90 font-medium">
                              • {sub.formulaExample}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                {/* Dialog Percakapan (对话 — Duìhuà) */}
                {selectedTopic.dialogues && selectedTopic.dialogues.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>
                          {selectedTopic.topicKey === 'number'
                            ? '4. Percakapan Sederhana tentang Angka'
                            : selectedTopic.topicKey === 'introduction'
                            ? '对话：自我介绍 (Percakapan: Perkenalan Diri)'
                            : 'Percakapan Salam dan Sapaan (对话 — Duìhuà)'}
                        </span>
                      </h4>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        Klik speaker untuk mendengar dialog
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedTopic.dialogues.map((line, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-700 text-white font-bold text-[10.5px] shrink-0 mt-0.5">
                              {line.speaker}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-baseline gap-1.5">
                                <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white font-serif">
                                  {line.hanzi}
                                </span>
                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                                  ({line.pinyin})
                                </span>
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                {line.meaning}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => speakChinese(line.hanzi)}
                            className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 cursor-pointer border border-emerald-200/60"
                            title="Putar suara kalimat dialog"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Kosakata Penting Percakapan (Khusus Topik 3 Angka) */}
                    {selectedTopic.dialogueVocabNote && (
                      <div className="pt-1.5 border-t border-emerald-200/60 dark:border-emerald-800/50 space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                          Kosakata penting:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTopic.dialogueVocabNote.map((v, i) => (
                            <span
                              key={i}
                              onClick={() => speakChinese(v.hanzi)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200/80 dark:border-zinc-700 text-xs font-medium cursor-pointer hover:border-emerald-500"
                            >
                              <strong className="text-red-600 dark:text-red-400 font-serif">{v.hanzi}</strong>{' '}
                              <span className="text-emerald-700 dark:text-emerald-400 font-mono">({v.pinyin})</span> ={' '}
                              {v.meaning}
                            </span>
                          ))}
                        </div>
                        {selectedTopic.dialogueExtraExample && (
                          <div className="text-xs text-emerald-950 dark:text-emerald-200 font-medium bg-white/80 dark:bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
                            {selectedTopic.dialogueExtraExample}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Latihan Interaktif: Kuis Angka Mandarin (5 Soal Cepat di Halaman Materi Topik 3) */}
                {selectedTopic.miniQuiz && selectedTopic.miniQuiz.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                          <span>5. Latihan Interaktif: Kuis Angka Mandarin (5 Soal)</span>
                        </h4>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                          Pilih salah satu jawaban untuk memeriksa hasil secara langsung.
                        </p>
                      </div>
                      {Object.keys(miniQuizAnswers).length > 0 && (
                        <button
                          type="button"
                          onClick={() => setMiniQuizAnswers({})}
                          className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                        >
                          Reset Pilihan
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTopic.miniQuiz.map((mq) => {
                        const chosenIdx = miniQuizAnswers[mq.id];
                        const isAnswered = chosenIdx !== undefined;
                        return (
                          <div
                            key={mq.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
                          >
                            <div className="text-xs font-bold text-zinc-900 dark:text-white">
                              {mq.question}
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {mq.options.map((opt, oIdx) => {
                                const isThisChosen = chosenIdx === oIdx;
                                const isThisCorrect = oIdx === mq.correctIndex;
                                let cls =
                                  'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400';
                                if (isAnswered) {
                                  if (isThisCorrect) {
                                    cls =
                                      'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                                  } else if (isThisChosen) {
                                    cls =
                                      'bg-red-50 dark:bg-red-950/70 border-red-500 text-red-800 dark:text-red-200';
                                  }
                                }
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() =>
                                      setMiniQuizAnswers((prev) => ({ ...prev, [mq.id]: oIdx }))
                                    }
                                    className={`px-2 py-1.5 rounded-lg border text-left text-[11px] transition-all cursor-pointer flex items-center justify-between gap-1 ${cls}`}
                                  >
                                    <span>
                                      {String.fromCharCode(65 + oIdx)}. {opt}
                                    </span>
                                    {isAnswered && isThisCorrect && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            {isAnswered && (
                              <div className="text-[10.5px] text-emerald-800 dark:text-emerald-300 font-medium pt-0.5">
                                {mq.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bagian B. Isian Singkat (Soal 16–20 Materi Angka) */}
                {selectedTopic.shortAnswerExercises && selectedTopic.shortAnswerExercises.length > 0 && (
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                        B. Latihan Isian Singkat Angka Mandarin (Nomor 16–20)
                      </h4>
                      <span className="text-[10.5px] text-zinc-500">
                        Klik &ldquo;Lihat Kunci&rdquo; untuk mencocokkan jawaban
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedTopic.shortAnswerExercises.map((item) => {
                        const isShown = !!revealedShortAnswers[item.no];
                        return (
                          <div
                            key={item.no}
                            className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">
                              <strong className="text-emerald-700 dark:text-emerald-400">{item.no}.</strong>{' '}
                              {item.question}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {isShown && (
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300/70">
                                  {item.answer}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedShortAnswers((prev) => ({
                                    ...prev,
                                    [item.no]: !prev[item.no]
                                  }))
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 cursor-pointer"
                              >
                                {isShown ? (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Tutup</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Lihat Kunci</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. Aktivitas di Kelas (Khusus Materi Angka) */}
                {selectedTopic.classActivities && selectedTopic.classActivities.length > 0 && (
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>6. Aktivitas di Kelas</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTopic.classActivities.map((act, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 space-y-0.5"
                        >
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            {idx + 1}. {act.title}
                          </div>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                            {act.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* KONTEN 2: QUIZ INTERAKTIF BERBASIS TOPIK (60 SOAL RESMI) */}
      {/* ========================================================= */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-300">
          {/* Filter Topik Kuis dengan LiquidMercuryControl */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="shrink-0 max-w-full overflow-x-auto no-scrollbar">
              <LiquidMercuryControl
                size="sm"
                options={quizTopics.map((qz) => ({
                  id: qz.id,
                  label: qz.title,
                  icon: HelpCircle
                }))}
                value={activeQuizTopic.id}
                onChange={handleSwitchQuizTopic}
                ariaLabel="Pilih Paket Soal Latihan Mandarin"
              />
            </div>
            <span className="text-[11px] text-zinc-500">
              {activeQuizTopic.description}
            </span>
          </div>

          {/* Area Kuis Interaktif */}
          {!isQuizCompleted ? (
            <div className="max-w-2xl mx-auto bg-white/95 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-4 sm:p-5 shadow-xs space-y-3.5">
              {/* Header Kuis: Indikator Nomor & Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                    {activeQuizTopic.chineseTitle}
                  </span>
                  <span className="text-[11px]">
                    Soal <strong>{currentQuestionIndex + 1}</strong> dari{' '}
                    <strong>{currentQuestions.length}</strong> • Skor Sementara: <strong>{score}</strong>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Kartu Soal */}
              <div className="text-center py-2 space-y-1.5">
                {currentQuestion.hanzi && (
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center justify-center gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400 font-serif">
                        {currentQuestion.hanzi}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakChinese(currentQuestion.hanzi!)}
                        className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center cursor-pointer border border-emerald-200/70"
                        title="Dengarkan pelafalan soal"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {currentQuestion.pinyin && (
                      <span className="text-xs font-semibold text-zinc-500 font-mono block">
                        ({currentQuestion.pinyin})
                      </span>
                    )}
                  </div>
                )}
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Pilihan Opsi Jawaban (Feedback Instan Hijau/Merah) */}
              <div className="space-y-1.5">
                {currentQuestion.options.map((option, idx) => {
                  const isChosen = selectedAnswerIndex === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let buttonStyle =
                    'bg-zinc-50 dark:bg-zinc-800/70 border-zinc-200/80 dark:border-zinc-700/80 hover:bg-emerald-50/50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200';

                  if (answeredState) {
                    if (isCorrect) {
                      buttonStyle =
                        'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs';
                    } else if (isChosen && !isCorrect) {
                      buttonStyle =
                        'bg-red-50 dark:bg-red-950/70 border-red-500 text-red-800 dark:text-red-200 shadow-xs';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answeredState}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3 sm:p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 min-h-[44px] active:scale-[0.99] cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {answeredState && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {answeredState && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Kotak Penjelasan Saat Sudah Terjawab */}
              {answeredState && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1 animate-in fade-in duration-200">
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pembahasan Kunci Jawaban:</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Tombol Lanjut Soal */}
              {answeredState && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>
                      {currentQuestionIndex < currentQuestions.length - 1
                        ? 'Soal Selanjutnya'
                        : 'Lihat Nilai Akhir'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Layar Skor Akhir Interaktif */
            <div className="max-w-md mx-auto bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 sm:p-8 text-center space-y-5 shadow-xl animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Latihan Selesai! • 很好 (Hěn hǎo!)
                </span>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                  Nilai Anda: {Math.round((score / currentQuestions.length) * 100)} / 100
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Anda berhasil menjawab benar <strong>{score}</strong> dari{' '}
                  <strong>{currentQuestions.length}</strong> soal pada paket{' '}
                  <strong>{activeQuizTopic.title}</strong>.
                </p>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Latihan Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('materi')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>Kembali ke Materi &amp; Flyer Belajar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Flyer Zoom */}
      {flyerLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setFlyerLightbox(null)}
        >
          <div
            className="relative max-w-xl w-full bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFlyerLightbox(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative max-h-[80vh] w-full bg-black flex items-center justify-center p-2">
              <img
                src={flyerLightbox.url}
                alt={flyerLightbox.title}
                className="max-h-[76vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-2.5 bg-zinc-900 text-center border-t border-white/10">
              <p className="text-xs font-semibold text-zinc-200">
                {flyerLightbox.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
