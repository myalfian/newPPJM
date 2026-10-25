import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  Info,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { MandarinLesson } from '../../../lib/supabase';
import { NavBarTabs } from '../../../components/common/NavBarTabs';
import { SmartJmSubNav } from '../../../components/smart-jm/SmartJmSubNav';

interface EnrichedLesson extends MandarinLesson {
  narrative?: string;
}

const DEFAULT_LESSONS: EnrichedLesson[] = [
  {
    id: 'l1',
    order_index: 1,
    level: 'Dasar 1',
    topic: 'Salam & Sapaan Santri (问候 - Wènhòu)',
    hanzi: '你好！很高兴认识你。',
    pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ.',
    meaning_id: 'Halo! Sangat senang bisa mengenalmu.',
    narrative: 'Dalam tradisi pesantren modern, santri dibekali keterampilan diplomasi bahasa internasional dengan tetap menjunjung tinggi akhlaqul karimah. Topik ini mengajarkan bagaimana mengawali percakapan dengan nada sopan, menyapa asatidz dan tamu kehormatan dari mancanegara saat berkunjung ke Pondok Pesantren Jauharul Maknuun.',
    dialog_script: [
      { speaker: 'Santri A', hanzi: '你好！请问你叫什么名字？', pinyin: 'Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzì?', arti: 'Halo! Boleh tanya siapa namamu?' },
      { speaker: 'Santri B', hanzi: '我叫扎基。我是这个伊斯兰寄宿学校的学生。', pinyin: 'Wǒ jiào Zhājī. Wǒ shì zhège yīsīlán jìsù xuéxiào de xuéshēng.', arti: 'Nama saya Zaki. Saya santri di pondok pesantren ini.' },
      { speaker: 'Santri A', hanzi: '太好了！认识你很高兴。', pinyin: 'Tài hǎo le! Rènshí nǐ hěn gāoxìng.', arti: 'Bagus sekali! Senang berkenalan denganmu.' }
    ],
    cover_image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'l2',
    order_index: 2,
    level: 'Kosakata Harian',
    topic: 'Belajar & Mengaji di Pondok (学习 - Xuéxí)',
    hanzi: '我们在伊斯兰寄宿学校读古兰经',
    pinyin: 'Wǒmen zài yīsīlán jìsù xuéxiào dú gǔlánjīng',
    meaning_id: 'Kami membaca Al-Qur’an di pondok pesantren',
    narrative: 'Kehidupan harian santri dipenuhi dengan kegiatan mengaji Al-Qur’an, muraja’ah hafalan, dan kajian kitab kuning. Modul ini mengajarkan kosakata seputar aktivitas literasi keislaman dalam bahasa Mandarin, sehingga santri mampu menjelaskan identitas kepesantrenan kepada komunitas global.',
    dialog_script: [
      { speaker: 'Ustadz', hanzi: '你们今天学什么？', pinyin: 'Nǐmen jīntiān xué shénme?', arti: 'Kalian belajar apa hari ini?' },
      { speaker: 'Santri', hanzi: '我们今天学阿拉伯语和汉语。', pinyin: 'Wǒmen jīntiān xué ālābóyǔ hé hànyǔ.', arti: 'Hari ini kami belajar Bahasa Arab dan Bahasa Mandarin.' },
      { speaker: 'Ustadz', hanzi: '很好，努力学习！', pinyin: 'Hěn hǎo, nǔlì xuéxí!', arti: 'Bagus sekali, belajarlah dengan sungguh-sungguh!' }
    ],
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'l3',
    order_index: 3,
    level: 'Percakapan Santri',
    topic: 'Adab Berterima Kasih & Minta Izin (礼貌 - Lǐmào)',
    hanzi: '非常感谢您的指导，老师！',
    pinyin: 'Fēicháng gǎnxiè nín de zhǐdǎo, lǎoshī!',
    meaning_id: 'Terima kasih banyak atas bimbingannya, Guru/Ustadz!',
    narrative: 'Ta’dzim kepada guru merupakan ruh pendidikan di Pondok Pesantren Jauharul Maknuun. Pada modul ini, santri melatih pelafalan ungkapan rasa syukur (Xièxiè), memohon maaf dengan tulus (Duìbuqǐ), dan meminta izin dengan tutur kata santun (Qǐngwèn).',
    dialog_script: [
      { speaker: 'Santri', hanzi: '老师，谢谢您的帮助。', pinyin: 'Lǎoshī, xièxiè nín de bāngzhù.', arti: 'Ustadz, terima kasih banyak atas bantuannya.' },
      { speaker: 'Ustadz', hanzi: '不客气，这是我的职责。', pinyin: 'Bù kèqì, zhè shì wǒ de zhízé.', arti: 'Sama-sama, ini sudah menjadi kewajiban saya.' }
    ],
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  }
];

export const MandarinMateri: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<EnrichedLesson>(DEFAULT_LESSONS[0]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Fitur Text-to-Speech tidak didukung pada browser ini.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Navigation identical to Prestasi */}
      <NavBarTabs />

      {/* 1. Navigasi Sub-Section SMART JM */}
      <SmartJmSubNav />

      {/* 2. Banner Pusat Bahasa Mandarin */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-3 sm:p-4 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Pusat Bahasa Mandarin Santri</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Modul Bahasa Mandarin & Audio Pinyin
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
            Kuasai kosakata harian, nada Pinyin, narasi budaya, dan percakapan adab kesantrian dengan audio penutur standar (Putonghua).
          </p>
        </div>

        <Link
          to="/smart-jm/mandarin/quiz"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-md transition-all whitespace-nowrap self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Uji Kuis Topik Interaktif</span>
        </Link>
      </div>

      {/* 3. Main Grid: List Topik (Kiri) & Detail Narasi + Foto (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Column: Lesson Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Daftar Topik Materi:</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {DEFAULT_LESSONS.length} Modul
            </span>
          </div>

          <div className="space-y-1.5">
            {DEFAULT_LESSONS.map((lesson, idx) => {
              const active = selectedLesson.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                    active
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                      : 'bg-white hover:bg-emerald-50/70 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                        active ? 'bg-gold-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Topik {idx + 1}
                      </span>
                      <span className={`text-[10px] font-semibold ${active ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {lesson.level}
                      </span>
                    </div>

                    <h4 className="font-black text-sm sm:text-base line-clamp-1">
                      {lesson.topic}
                    </h4>
                    <p className={`text-xs sm:text-sm font-mono line-clamp-1 font-semibold ${active ? 'text-emerald-200' : 'text-slate-600'}`}>
                      {lesson.pinyin}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${active ? 'text-gold-400' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Lesson Detail: Foto, Narasi, Audio, Dialog */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          
          {/* Header Topik */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-gold-600 uppercase tracking-wider">
                {selectedLesson.level}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 mt-0.5">
                {selectedLesson.topic}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => speakText(selectedLesson.hanzi || '')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Volume2 className="w-4.5 h-4.5 text-emerald-700" />
              <span>Dengarkan Pelafalan Asli</span>
            </button>
          </div>

          {/* Foto Topik Pembelajaran */}
          {selectedLesson.cover_image && (
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-xs bg-slate-100 group border border-slate-100">
              <img
                src={selectedLesson.cover_image}
                alt={selectedLesson.topic}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs sm:text-sm font-extrabold bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-700/50">
                  Dokumentasi Kelas Bahasa Santri PPJM
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-200">
                  {selectedLesson.topic}
                </span>
              </div>
            </div>
          )}

          {/* Narasi Penjelasan Materi Topik */}
          {selectedLesson.narrative && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4.5 h-4.5 text-emerald-700" />
                <span>Narasi Konteks & Ulasan Pembelajaran:</span>
              </h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed sm:leading-loose font-medium">
                {selectedLesson.narrative}
              </p>
            </div>
          )}

          {/* Key Sentence Card */}
          <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-gold-50/40 border border-emerald-100 space-y-2 text-center sm:text-left">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-950 tracking-wider">
              {selectedLesson.hanzi}
            </div>
            <div className="text-sm sm:text-base font-bold text-gold-700 font-mono">
              [{selectedLesson.pinyin}]
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-semibold italic">
              "{selectedLesson.meaning_id}"
            </p>
          </div>

          {/* Dialogue Section */}
          {selectedLesson.dialog_script && (
            <div className="space-y-3 pt-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4.5 h-4.5 text-emerald-700" />
                <span>Naskah Percakapan Praktik Santri:</span>
              </h3>

              <div className="space-y-2">
                {selectedLesson.dialog_script.map((dlg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-emerald-800">
                        {dlg.speaker}:
                      </div>
                      <div className="text-base font-bold text-slate-900 tracking-wide">
                        {dlg.hanzi}
                      </div>
                      <div className="text-xs font-semibold text-gold-700 font-mono">
                        {dlg.pinyin}
                      </div>
                      <div className="text-xs text-slate-500 italic">
                        "{dlg.arti}"
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakText(dlg.hanzi)}
                      className="p-2 rounded-full text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors shrink-0"
                      title="Dengarkan dialog ini"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer CTA to Quiz */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Sudah memahami materi ini?
            </span>
            <Link
              to="/smart-jm/mandarin/quiz"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
            >
              <span>Uji Pemahaman Lewat Kuis Topik</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
