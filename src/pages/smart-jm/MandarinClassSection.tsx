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
  Users
} from 'lucide-react';
import { LiquidMercuryControl } from '../../components/common/LiquidMercuryControl';
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
    level: 'Materi Dasar 1 • SMP Plus JM',
    teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
    downloadDocUrl: '/docs/mandarin/1_Materi_Salam_dan_Sapaan_Mandarin.docx',
    posterFlyer: '/images/mandarin/flyer_salam_dan_sapaan.png',
    summary:
      'Mengenal 20 kosakata utama salam dan sapaan harian dalam bahasa Mandarin (Hanzi, Pinyin, dan arti Bahasa Indonesia), kaidah kesopanan menyapa guru, serta latihan percakapan berpasangan.',
    narrative:
      'Materi Salam dan Sapaan (问候语 — Wènhòuyǔ) membekali siswa SMP Plus Jauharul Maknuun dengan kosakata komunikasi dasar sehari-hari, mulai dari sapaan waktu (pagi, menjelang siang, siang, sore, malam), ucapan terima kasih, permintaan maaf, hingga sapaan hormat kepada guru dan orang yang lebih tua.',
    culturalNote:
      '你好 (Nǐ hǎo) digunakan untuk menyapa teman atau orang yang dikenal, sedangkan 您好 (Nín hǎo) merupakan bentuk sapaan yang lebih sopan kepada guru atau orang yang lebih tua.',
    importantNotes: [
      '你好 (Nǐ hǎo) digunakan untuk menyapa teman sebaya atau orang yang sudah dikenal.',
      '您好 (Nín hǎo) merupakan bentuk sapaan yang lebih sopan, misalnya kepada guru (老师您好 — Lǎoshī nín hǎo) atau orang yang lebih tua.',
      '晚安 (Wǎn\'ān) biasanya digunakan ketika akan tidur atau berpisah pada malam hari, bukan sebagai salam umum ketika baru bertemu pada malam hari.',
      'Kata 吗 (ma) diletakkan di akhir kalimat berita untuk membentuk kalimat pertanyaan, misalnya 你好吗？ (Nǐ hǎo ma? — Apa kabar?).'
    ],
    vocabularies: [
      { hanzi: '你好', pinyin: 'Nǐ hǎo', indonesian: 'Halo / Hai', exampleSentence: 'Sapaan umum kepada teman atau kenalan' },
      { hanzi: '您好', pinyin: 'Nín hǎo', indonesian: 'Halo (sopan)', exampleSentence: '老师您好！(Lǎoshī nín hǎo! — Halo Guru!)' },
      { hanzi: '早上好', pinyin: 'Zǎoshang hǎo', indonesian: 'Selamat pagi', exampleSentence: 'Digunakan saat bertemu di pagi hari' },
      { hanzi: '上午好', pinyin: 'Shàngwǔ hǎo', indonesian: 'Selamat pagi (menjelang siang)', exampleSentence: 'Digunakan sekitar pukul 09.00–11.00' },
      { hanzi: '中午好', pinyin: 'Zhōngwǔ hǎo', indonesian: 'Selamat siang', exampleSentence: 'Digunakan sekitar pukul 11.00–13.00' },
      { hanzi: '下午好', pinyin: 'Xiàwǔ hǎo', indonesian: 'Selamat sore', exampleSentence: 'Digunakan pada siang menjelang sore hari' },
      { hanzi: '晚上好', pinyin: 'Wǎnshang hǎo', indonesian: 'Selamat malam', exampleSentence: 'Salam sapaan saat bertemu di malam hari' },
      { hanzi: '晚安', pinyin: 'Wǎn\'ān', indonesian: 'Selamat tidur', exampleSentence: 'Diucapkan sebelum tidur malam' },
      { hanzi: '再见', pinyin: 'Zàijiàn', indonesian: 'Sampai jumpa', exampleSentence: 'Ungkapan saat berpamitan / berpisah' },
      { hanzi: '明天见', pinyin: 'Míngtiān jiàn', indonesian: 'Sampai jumpa besok', exampleSentence: 'Diucapkan saat berpisah untuk bertemu besok' },
      { hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', indonesian: 'Apa kabar?', exampleSentence: 'Menanyakan kabar lawan bicara' },
      { hanzi: '我很好', pinyin: 'Wǒ hěn hǎo', indonesian: 'Saya baik-baik saja', exampleSentence: '我很好，谢谢！(Saya baik, terima kasih!)' },
      { hanzi: '谢谢', pinyin: 'Xièxie', indonesian: 'Terima kasih', exampleSentence: 'Ungkapan rasa syukur dan apresiasi' },
      { hanzi: '不客气', pinyin: 'Bú kèqi', indonesian: 'Sama-sama', exampleSentence: 'Balasan sopan saat seseorang mengucapkan 谢谢' },
      { hanzi: '对不起', pinyin: 'Duìbuqǐ', indonesian: 'Maaf', exampleSentence: 'Ungkapan memohon maaf' },
      { hanzi: '没关系', pinyin: 'Méi guānxi', indonesian: 'Tidak apa-apa', exampleSentence: 'Balasan untuk kalimat permintaan maaf 对不起' },
      { hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', indonesian: 'Siapa namamu?', exampleSentence: 'Kalimat tanya untuk menanyakan nama' },
      { hanzi: '我叫……', pinyin: 'Wǒ jiào…', indonesian: 'Nama saya…', exampleSentence: '我叫小明 (Wǒ jiào Xiǎo Míng)' },
      { hanzi: '很高兴认识你', pinyin: 'Hěn gāoxìng rènshi nǐ', indonesian: 'Senang berkenalan denganmu', exampleSentence: 'Ungkapan ramah di akhir perkenalan' },
      { hanzi: '请问', pinyin: 'Qǐngwèn', indonesian: 'Permisi / boleh bertanya', exampleSentence: 'Kata pembuka sopan sebelum bertanya sesuatu' }
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
    chineseName: '自我介绍 — Zìwǒ jièshào (句型 — Jùxíng)',
    level: 'Materi Dasar 2 • SMP Plus JM',
    teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
    downloadDocUrl: '/docs/mandarin/2_Materi_Perkenalan_Diri_Mandarin.docx',
    posterFlyer: '/images/mandarin/flyer_perkenalan_diri.jpeg',
    summary:
      'Pola kalimat (句型 — Jùxíng) dan dialog perkenalan diri dalam bahasa Mandarin: menyebutkan nama, menanyakan asal negara (kewarganegaraan Indonesia), menyebutkan usia, serta kosakata kata ganti orang dan status.',
    narrative:
      'Pada topik Perkenalan Diri (自我介绍 — Zìwǒ jièshào), siswa mempelajari struktur kalimat tanya-jawab esensial ketika pertama kali berkenalan dengan teman baru maupun guru, termasuk penggunaan kata ganti orang (我, 你, 他, 她) dan partikel balik "你呢？ (Nǐ ne? — Kalau kamu?)".',
    culturalNote:
      'Dalam bahasa Mandarin, kata "叫 (jiào)" berarti dipanggil/bernama, sedangkan satuan "岁 (suì)" digunakan khusus untuk menyatakan tahun usia seseorang.',
    importantNotes: [
      'Gunakan pola "我叫 + Nama" (Wǒ jiào...) untuk memperkenalkan nama panggilan atau nama lengkap.',
      'Untuk menanyakan kewarganegaraan gunakan "你是哪国人？ (Nǐ shì nǎ guó rén?)" dan dijawab "我是印度尼西亚人 (Wǒ shì Yìndùníxīyà rén — Saya orang Indonesia)".',
      'Kata "他 (tā)" berarti dia laki-laki, sedangkan "她 (tā)" memiliki pelafalan sama namun digunakan untuk dia perempuan.',
      'Kata "也 (yě)" berarti "juga" dan selalu diletakkan sebelum kata kerja atau kata sifat, contoh: 我也很高兴认识你！(Wǒ yě hěn gāoxìng rènshi nǐ!).'
    ],
    vocabularies: [
      { hanzi: '你好！', pinyin: 'Nǐ hǎo!', indonesian: 'Halo!', exampleSentence: 'Salam pembuka perkenalan' },
      { hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', indonesian: 'Siapa namamu?', exampleSentence: 'Menanyakan nama lawan bicara' },
      { hanzi: '我叫……', pinyin: 'Wǒ jiào…', indonesian: 'Nama saya…', exampleSentence: '我叫小美。(Wǒ jiào Xiǎo Měi. — Nama saya Xiao Mei.)' },
      { hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', indonesian: 'Kamu berasal dari negara mana?', exampleSentence: 'Menanyakan kebangsaan / kewarganegaraan' },
      { hanzi: '我是印度尼西亚人。', pinyin: 'Wǒ shì Yìndùníxīyà rén.', indonesian: 'Saya orang Indonesia.', exampleSentence: '我也是印度尼西亚人。(Saya juga orang Indonesia.)' },
      { hanzi: '你几岁？', pinyin: 'Nǐ jǐ suì?', indonesian: 'Berapa usiamu?', exampleSentence: 'Menanyakan umur teman sebaya / anak-anak' },
      { hanzi: '我……岁。', pinyin: 'Wǒ… suì.', indonesian: 'Umur saya… tahun.', exampleSentence: '我十三岁。(Wǒ shí sān suì. — Saya berusia 13 tahun.)' },
      { hanzi: '很高兴认识你！', pinyin: 'Hěn gāoxìng rènshi nǐ!', indonesian: 'Senang berkenalan denganmu!', exampleSentence: '我也很高兴认识你！(Saya juga senang berkenalan denganmu!)' },
      { hanzi: '你呢？', pinyin: 'Nǐ ne?', indonesian: 'Kalau kamu? / Bagaimana denganmu?', exampleSentence: '我叫小美。你呢？(Nama saya Xiao Mei. Kalau kamu?)' },
      { hanzi: '我 / 你', pinyin: 'Wǒ / Nǐ', indonesian: 'Saya / Kamu', exampleSentence: 'Kata ganti orang pertama dan kedua tunggal' },
      { hanzi: '他 / 她', pinyin: 'Tā / Tā', indonesian: 'Dia (laki-laki) / Dia (perempuan)', exampleSentence: 'Pronomina orang ketiga tunggal' },
      { hanzi: '老师', pinyin: 'Lǎoshī', indonesian: 'Guru', exampleSentence: '我是老师。(Wǒ shì lǎoshī. — Saya adalah guru.)' },
      { hanzi: '学生', pinyin: 'Xuésheng', indonesian: 'Murid / Siswa', exampleSentence: '我是学生。(Wǒ shì xuésheng. — Saya adalah siswa.)' },
      { hanzi: '朋友', pinyin: 'Péngyou', indonesian: 'Teman / Sahabat', exampleSentence: '好朋友 (Hǎo péngyou — Teman baik)' },
      { hanzi: '名字', pinyin: 'Míngzi', indonesian: 'Nama', exampleSentence: '你的名字 (Nǐ de míngzi — Namamu)' },
      { hanzi: '认识', pinyin: 'Rènshi', indonesian: 'Kenal / Mengenal', exampleSentence: '认识你很高兴 (Senang mengenalmu)' }
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
    chineseName: '数字 — Shùzì (Angka 0–100)',
    level: 'Materi Dasar 3 • SMP Plus JM',
    teacherMentor: 'Ustadzah Nuriyah & Ustadzah Rizza',
    downloadDocUrl: '/docs/mandarin/3_Materi_Angka_Shuzi_Mandarin.docx',
    posterFlyer: '/images/mandarin/flyer_angka_mandarin.jpeg',
    summary:
      'Mengenal angka 0–100 dalam bahasa Mandarin, cara membaca Pinyin, cara menulis karakter Hanzi untuk angka belasan (11–19), puluhan (20–90), angka gabungan, serta penggunaannya dalam percakapan usia.',
    narrative:
      'Materi ini dirancang khusus untuk siswa SMP Plus Jauharul Maknuun agar mampu menyebutkan angka 0–100, memahami rumus pembentukan bilangan belasan dan puluhan secara logis, menuliskan karakter Mandarinnya, serta menggunakannya dalam percakapan menanyakan umur (你几岁？).',
    culturalNote:
      'Target Pembelajaran: Setelah materi selesai, siswa mampu menyebutkan angka 0–100, membaca Pinyin, menuliskan angka dalam karakter Mandarin, dan menggunakan angka dalam percakapan sederhana.',
    importantNotes: [
      'Rumus Angka Belasan (11–19) = 十 (sepuluh) + angka satuan. Contoh: 十五 (shí wǔ) = 十 (10) + 五 (5) = 15.',
      'Rumus Angka Puluhan (20–90) = angka satuan + 十 (sepuluh). Contoh: 二十 (èr shí) = 20, 三十 (sān shí) = 30.',
      'Rumus Angka Gabungan (21–99) = angka puluhan + 十 + angka satuan. Contoh: 36 = 三十六 (sān shí liù), 48 = 四十八 (sì shí bā), 99 = 九十九 (jiǔ shí jiǔ).',
      'Kosakata Penting Usia: 你 (nǐ = kamu), 我 (wǒ = saya), 几 (jǐ = berapa), 岁 (suì = tahun usia). Contoh: 你几岁？(Nǐ jǐ suì?) → 我十二岁。(Wǒ shí èr suì. — Saya berumur 12 tahun).'
    ],
    vocabularies: [
      { hanzi: '零', pinyin: 'líng', indonesian: '0 (Nol)', exampleSentence: 'Angka dasar 0' },
      { hanzi: '一', pinyin: 'yī', indonesian: '1 (Satu)', exampleSentence: '十一 (shí yī — 11 Sebelas)' },
      { hanzi: '二', pinyin: 'èr', indonesian: '2 (Dua)', exampleSentence: '十二 (shí èr — 12) | 二十 (èr shí — 20)' },
      { hanzi: '三', pinyin: 'sān', indonesian: '3 (Tiga)', exampleSentence: '十三 (shí sān — 13) | 三十 (sān shí — 30)' },
      { hanzi: '四', pinyin: 'sì', indonesian: '4 (Empat)', exampleSentence: '十四 (shí sì — 14) | 四十 (sì shí — 40)' },
      { hanzi: '五', pinyin: 'wǔ', indonesian: '5 (Lima)', exampleSentence: '十五 (shí wǔ — 15) | 五十 (wǔ shí — 50)' },
      { hanzi: '六', pinyin: 'liù', indonesian: '6 (Enam)', exampleSentence: '十六 (shí liù — 16) | 六十 (liù shí — 60)' },
      { hanzi: '七', pinyin: 'qī', indonesian: '7 (Tujuh)', exampleSentence: '十七 (shí qī — 17) | 七十 (qī shí — 70)' },
      { hanzi: '八', pinyin: 'bā', indonesian: '8 (Delapan)', exampleSentence: '十八 (shí bā — 18) | 八十 (bā shí — 80)' },
      { hanzi: '九', pinyin: 'jiǔ', indonesian: '9 (Sembilan)', exampleSentence: '十九 (shí jiǔ — 19) | 九十 (jiǔ shí — 90)' },
      { hanzi: '十', pinyin: 'shí', indonesian: '10 (Sepuluh)', exampleSentence: 'Dasar pembentukan belasan dan puluhan' },
      { hanzi: '二十一', pinyin: 'èr shí yī', indonesian: '21 (Dua puluh satu)', exampleSentence: '二 (2) + 十 (10) + 一 (1)' },
      { hanzi: '二十五', pinyin: 'èr shí wǔ', indonesian: '25 (Dua puluh lima)', exampleSentence: '二 (2) + 十 (10) + 五 (5)' },
      { hanzi: '三十六', pinyin: 'sān shí liù', indonesian: '36 (Tiga puluh enam)', exampleSentence: '三 (3) + 十 (10) + 六 (6)' },
      { hanzi: '三十九', pinyin: 'sān shí jiǔ', indonesian: '39 (Tiga puluh sembilan)', exampleSentence: '三 (3) + 十 (10) + 九 (9)' },
      { hanzi: '四十八', pinyin: 'sì shí bā', indonesian: '48 (Empat puluh delapan)', exampleSentence: '四 (4) + 十 (10) + 八 (8)' },
      { hanzi: '五十七', pinyin: 'wǔ shí qī', indonesian: '57 (Lima puluh tujuh)', exampleSentence: '五 (5) + 十 (10) + 七 (7)' },
      { hanzi: '九十九', pinyin: 'jiǔ shí jiǔ', indonesian: '99 (Sembilan puluh sembilan)', exampleSentence: '九 (9) + 十 (10) + 九 (9)' },
      { hanzi: '一百', pinyin: 'yì bǎi', indonesian: '100 (Seratus)', exampleSentence: 'Bilangan seratus' },
      { hanzi: '你几岁？', pinyin: 'Nǐ jǐ suì?', indonesian: 'Kamu berumur berapa tahun?', exampleSentence: '我十三岁。(Wǒ shí sān suì. — Saya berumur 13 tahun.)' }
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
    classActivities: [
      {
        title: '1. Tebak Angka',
        desc: 'Guru menyebutkan angka dalam bahasa Indonesia, siswa menjawab cepat dengan bahasa Mandarin.'
      },
      {
        title: '2. Angkat Kartu (1–100)',
        desc: 'Guru menunjukkan kartu angka 1–100, siswa menyebutkan karakter Mandarin dan Pinyinnya.'
      },
      {
        title: '3. Tanya Teman (Berpasangan)',
        desc: 'Siswa berpasangan dan bertanya “你几岁？ (Nǐ jǐ suì?)” lalu menjawab menggunakan usia masing-masing.'
      },
      {
        title: '4. Tantangan Angka Cepat',
        desc: 'Guru menuliskan angka seperti 27, 45, atau 68 di papan tulis, lalu siswa berlomba menuliskan karakter Mandarinnya.'
      }
    ]
  }
];

// ============================================================================
// BANK SOAL LATIHAN & KUIS INTERAKTIF MANDARIN
// Sesuai dokumen latihan Ustadzah Nuriyah & Ustadzah Rizza
// ============================================================================
export const MANDARIN_QUIZZES: MandarinQuizTopic[] = [
  {
    id: 'quiz-salam-sapaan',
    title: '1. Kuis Salam & Sapaan (20 Soal)',
    chineseTitle: '问候语选择题 — Latihan Pilihan Ganda Salam & Sapaan',
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
    chineseTitle: '自我介绍选择题 — Latihan Pilihan Ganda Perkenalan Diri',
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
    chineseTitle: '数字 0–100 练习 — Latihan Soal Bahasa Mandarin Materi Angka',
    level: 'Topik 3',
    description: '20 soal latihan resmi materi Angka Mandarin (数字 Shùzì) 0–100 beserta soal percakapan usia.',
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
        question: '16. [Isian Singkat] Bagaimanakah penulisan angka 8 dalam karakter Mandarin dan Pinyin?',
        options: ['七 (qī)', '八 (bā)', '六 (liù)', '九 (jiǔ)'],
        correctIndex: 1,
        explanation: 'Angka 8 ditulis 八 dengan Pinyin “bā”.'
      },
      {
        id: 'q-num-17',
        topicId: 'quiz-number-shuzi',
        hanzi: '十九',
        pinyin: 'shí jiǔ',
        question: '17. [Isian Singkat] Angka 十九 (shí jiǔ) jika ditulis dalam angka biasa adalah ....',
        options: ['90', '91', '19', '18'],
        correctIndex: 2,
        explanation: '十九 = 十 (10) + 九 (9) = 19.'
      },
      {
        id: 'q-num-18',
        topicId: 'quiz-number-shuzi',
        hanzi: '四十二',
        pinyin: 'sì shí èr',
        question: '18. [Isian Singkat] Bagaimanakah penulisan angka 42 dalam karakter Mandarin?',
        options: ['二十四', '四十二', '四十二个', '十四二'],
        correctIndex: 1,
        explanation: 'Angka 42 = 四 (4) + 十 (10) + 二 (2) = 四十二 (sì shí èr).'
      },
      {
        id: 'q-num-19',
        topicId: 'quiz-number-shuzi',
        hanzi: '七十',
        pinyin: 'qī shí',
        question: '19. [Isian Singkat] Apa arti dari 七十 (qī shí)?',
        options: ['Tujuh belas (17)', 'Tujuh puluh (70)', 'Tujuh (7)', 'Delapan puluh (80)'],
        correctIndex: 1,
        explanation: '七十 (qī shí) = 七 (7) + 十 (10) = Tujuh puluh (70).'
      },
      {
        id: 'q-num-20',
        topicId: 'quiz-number-shuzi',
        hanzi: '我十五岁。',
        pinyin: 'Wǒ shí wǔ suì.',
        question: '20. [Isian Singkat] 小明：你几岁？ — 小丽：我________岁。(Xiaoli berusia 15 tahun.)',
        options: ['五十 (wǔ shí)', '十五 (shí wǔ)', '五 (wǔ)', '二十五 (èr shí wǔ)'],
        correctIndex: 1,
        explanation: 'Usia 15 tahun ditulis “十五” (shí wǔ), sehingga menjadi “我十五岁。”'
      }
    ]
  }
];

export const MandarinClassSection: React.FC = () => {
  const location = useLocation();
  const [topics] = useState<MandarinTopicItem[]>(MANDARIN_TOPICS);
  const [activeSubTab, setActiveSubTab] = useState<'materi' | 'quiz'>(() =>
    location.pathname.includes('/quiz') ? 'quiz' : 'materi'
  );
  const [selectedTopic, setSelectedTopic] = useState<MandarinTopicItem>(MANDARIN_TOPICS[0]);
  const [flyerLightbox, setFlyerLightbox] = useState<{ url: string; title: string } | null>(null);

  // Quiz State
  const [activeQuizTopic, setActiveQuizTopic] = useState<MandarinQuizTopic>(MANDARIN_QUIZZES[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [answeredState, setAnsweredState] = useState<boolean>(false);

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
    const found = MANDARIN_QUIZZES.find((q) => q.id === quizId);
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
            Mandarin Class SMP Plus JM
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pengampu: <strong className="text-zinc-700 dark:text-zinc-300">Ustadzah Nuriyah &amp; Ustadzah Rizza</strong> • Kosakata Hanzi, Pelafalan Pinyin, Percakapan &amp; Kuis Interaktif
          </p>
        </div>

        {/* Liquid Mercury Sub-Navigation Switcher */}
        <div className="shrink-0">
          <LiquidMercuryControl<'materi' | 'quiz'>
            size="md"
            options={[
              { id: 'materi', label: 'Materi & Flyer Belajar', icon: BookOpen },
              { id: 'quiz', label: 'Latihan & Quiz (60 Soal)', icon: HelpCircle }
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
                      • Pembina: <strong className="text-zinc-700 dark:text-zinc-300">{selectedTopic.teacherMentor}</strong>
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
                  <span>Kerjakan Latihan Soal</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Flyer Visual Resmi & Konten Pembelajaran */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
              {/* Kolom Kiri: Poster Flyer Visual + Catatan Penting */}
              <div className="lg:col-span-4 space-y-2.5">
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
                      <span>Catatan Penting &amp; Kaidah:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-950/90 dark:text-amber-200/90 list-disc list-inside leading-relaxed">
                      {selectedTopic.importantNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Tabel Kosakata, Dialog Percakapan & Aktivitas Kelas */}
              <div className="lg:col-span-8 space-y-3">
                {/* Pengantar Konteks */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Pengantar Materi Pembelajaran:
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedTopic.narrative}
                  </p>
                </div>

                {/* Daftar Kosakata Inti (Cards Grid) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <Languages className="w-4 h-4 text-emerald-600" />
                      <span>Tabel Kosakata &amp; Pola Kalimat ({selectedTopic.vocabularies.length} Kosakata)</span>
                    </h4>
                    <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      🔊 Klik speaker untuk audio Hanzi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-[460px] overflow-y-auto pr-0.5">
                    {selectedTopic.vocabularies.map((vocab, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-800/70 shadow-2xs hover:border-emerald-500/50 transition-all flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-zinc-400">
                              #{idx + 1}
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 font-serif">
                              {vocab.hanzi}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                              {vocab.pinyin}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {vocab.indonesian}
                          </div>
                          {vocab.exampleSentence && (
                            <div className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-snug">
                              {vocab.exampleSentence}
                            </div>
                          )}
                        </div>

                        {/* Speaker Button */}
                        <button
                          type="button"
                          onClick={() => speakChinese(vocab.hanzi)}
                          className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer border border-emerald-200/60 dark:border-emerald-800"
                          title={`Dengarkan pelafalan: ${vocab.hanzi} (${vocab.pinyin})`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dialog Percakapan (对话 — Duìhuà) */}
                {selectedTopic.dialogues && selectedTopic.dialogues.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>Teks Percakapan (对话 — Duìhuà)</span>
                      </h4>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        Klik tombol suara untuk mendengar kalimat
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
                  </div>
                )}

                {/* Aktivitas Interaktif di Kelas (Khusus Materi Angka) */}
                {selectedTopic.classActivities && selectedTopic.classActivities.length > 0 && (
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Aktivitas Interaktif di Kelas</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTopic.classActivities.map((act, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 space-y-0.5"
                        >
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            {act.title}
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
                options={MANDARIN_QUIZZES.map((qz) => ({
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
