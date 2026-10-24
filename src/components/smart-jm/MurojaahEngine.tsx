import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Radio,
  BookOpen
} from 'lucide-react';

interface TargetVerse {
  surah: string;
  ayahNum: number;
  arabicText: string;
  latinText: string;
  audioUrl: string;
}

const PRESET_VERSES: TargetVerse[] = [
  {
    surah: 'Al-Fatihah',
    ayahNum: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    latinText: 'Bismillāhir-raḥmānir-raḥīm',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3'
  },
  {
    surah: 'Al-Fatihah',
    ayahNum: 2,
    arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    latinText: 'Al-ḥamdu lillāhi rabbil-‘ālamīn',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3'
  },
  {
    surah: 'Al-Ikhlas',
    ayahNum: 1,
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    latinText: 'Qul huwallāhu aḥad',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3'
  },
  {
    surah: 'Al-Ikhlas',
    ayahNum: 2,
    arabicText: 'اللَّهُ الصَّمَدُ',
    latinText: 'Allāhuṣ-ṣamad',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112002.mp3'
  },
  {
    surah: 'Al-Falaq',
    ayahNum: 1,
    arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    latinText: 'Qul a‘ūżu birabbil-falaq',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3'
  },
  {
    surah: 'An-Nas',
    ayahNum: 1,
    arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    latinText: 'Qul a‘ūżu birabbin-nās',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114001.mp3'
  }
];

// Helper to remove Arabic diacritics for phonetic comparison
function cleanArabic(str: string): string {
  return str
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

export const MurojaahEngine: React.FC = () => {
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const currentVerse = PRESET_VERSES[selectedVerseIndex];

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [supportSpeech, setSupportSpeech] = useState(true);

  // Audio Recording Fallback States
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Setup Web Speech API on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA'; // Dialek Arab fasih

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpokenTranscript(currentText);
        evaluateMatch(currentText, currentVerse.arabicText);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSupportSpeech(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentVerse]);

  // Evaluasi lafadz santri dengan teks ayat target
  const evaluateMatch = (spoken: string, target: string) => {
    const cleanSpoken = cleanArabic(spoken).split(/\s+/).filter(Boolean);
    const cleanTarget = cleanArabic(target).split(/\s+/).filter(Boolean);

    if (cleanTarget.length === 0 || cleanSpoken.length === 0) {
      setMatchScore(0);
      return;
    }

    let matches = 0;
    cleanTarget.forEach((targetWord) => {
      if (cleanSpoken.some((spkWord) => spkWord.includes(targetWord) || targetWord.includes(spkWord))) {
        matches++;
      }
    });

    const score = Math.min(100, Math.round((matches / cleanTarget.length) * 100));
    setMatchScore(score);
  };

  const startListening = () => {
    setSpokenTranscript('');
    setMatchScore(null);
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (e) {
      console.warn(e);
    }
  };

  // Fallback Audio Recording & Waveform Visualization
  const startRecordingAudio = async () => {
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // AudioContext for visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      drawWaveform();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      alert('Tidak dapat mengakses mikrofon. Mohon berikan izin mikrofon pada browser Anda.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = '#0F5132';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    render();
  };

  // Play Reference Audio
  const playReferenceAudio = () => {
    const audio = new Audio(currentVerse.audioUrl);
    audio.play();
  };

  // Tokenize Target Verse Words
  const targetWords = currentVerse.arabicText.split(/\s+/);
  const cleanTargetWords = targetWords.map(cleanArabic);
  const cleanSpokenWords = cleanArabic(spokenTranscript).split(/\s+/);

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500 text-emerald-950 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teknologi Suara AI Santri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Murojaah AI: Asisten Mandiri Hafalan Al-Qur’an
            </h2>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              Lafalkan ayat ke mikrofon santri. Sistem AI mendeteksi kecocokan pengucapan secara real-time, 
              menandai kata yang keliru atau terlewat, dan memberikan umpan balik kelancaran bacaan.
            </p>
          </div>

          {/* Quick Accuracy Badge */}
          {matchScore !== null && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
              <div className="text-xs text-emerald-200 font-bold uppercase">Skor Kelancaran</div>
              <div className="text-3xl font-extrabold text-gold-400 mt-1">{matchScore}%</div>
              <div className="text-[11px] text-emerald-300 font-medium">
                {matchScore >= 80 ? 'Mumtaz (Fasih!)' : matchScore >= 50 ? 'Jayyid (Cukup)' : 'Perlu Murojaah'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Target Verse Selector */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pilih Target Hafalan Murojaah:
          </label>
          <span className="text-xs text-emerald-800 font-semibold">
            {PRESET_VERSES.length} Pilihan Uji Hafalan
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_VERSES.map((verse, idx) => (
            <button
              key={`${verse.surah}-${verse.ayahNum}`}
              onClick={() => {
                setSelectedVerseIndex(idx);
                setSpokenTranscript('');
                setMatchScore(null);
                setRecordedAudioUrl(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedVerseIndex === idx
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              QS. {verse.surah}: {verse.ayahNum}
            </button>
          ))}
        </div>
      </div>

      {/* Target Verse Card & Real-time Evaluation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-m3-1 border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              {currentVerse.ayahNum}
            </span>
            <span className="text-sm font-bold text-slate-800">
              Target Surat {currentVerse.surah}
            </span>
          </div>

          <button
            onClick={playReferenceAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Dengarkan Sanad Murottal</span>
          </button>
        </div>

        {/* Real-time Highlighting Text */}
        <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100 text-right space-y-4">
          <div className="text-xs text-slate-400 font-sans text-left uppercase font-semibold">
            Lafadz Target (Tandai Kata yang Berhasil Diucapkan):
          </div>

          <div className="font-quran text-3xl sm:text-4xl lg:text-5xl leading-[2.2] dir-rtl flex flex-wrap gap-x-4 gap-y-2 justify-end">
            {targetWords.map((word, wIdx) => {
              const cleanW = cleanTargetWords[wIdx];
              const isMatched = cleanSpokenWords.some((spk) => spk.includes(cleanW) || cleanW.includes(spk));

              return (
                <span
                  key={wIdx}
                  className={`px-2 py-1 rounded-xl transition-all duration-300 ${
                    spokenTranscript === ''
                      ? 'text-slate-800'
                      : isMatched
                      ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500 font-bold'
                      : 'bg-amber-50 text-amber-900 border border-amber-200/60'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="text-left font-sans text-xs text-emerald-800 font-semibold pt-2 border-t border-slate-200">
            {currentVerse.latinText}
          </div>
        </div>

        {/* Transkripsi Pengenalan AI */}
        {spokenTranscript && (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-sm space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Teks Suara Yang Terdeteksi AI:
            </span>
            <p className="font-quran text-xl text-emerald-950 text-right dir-rtl leading-relaxed">
              {spokenTranscript}
            </p>
          </div>
        )}

        {/* Controls Bar: Web Speech & Fallback Audio Recorder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Main Action: Mic AI */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {supportSpeech ? (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold shadow-sm transition-all min-h-[48px] ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white hover:shadow-glow-emerald'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Hentikan AI Detektor</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-gold-400" />
                    <span>Mulai Murojaah AI</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
                Web Speech API tidak didukung pada browser ini. Gunakan mode Perekam Suara di sebelah kanan.
              </div>
            )}

            {spokenTranscript && (
              <button
                onClick={() => {
                  setSpokenTranscript('');
                  setMatchScore(null);
                }}
                className="p-3 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Reset Ujian"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Secondary Hybrid Mode: Audio Waveform Recording Fallback */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <canvas
              ref={canvasRef}
              width={80}
              height={32}
              className={`rounded-lg bg-emerald-50 ${isRecordingAudio ? 'block' : 'hidden'}`}
            />

            {!isRecordingAudio ? (
              <button
                onClick={startRecordingAudio}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px]"
              >
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Rekam Suara Mandiri</span>
              </button>
            ) : (
              <button
                onClick={stopRecordingAudio}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors min-h-[44px]"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Selesai Merekam</span>
              </button>
            )}

            {recordedAudioUrl && (
              <audio controls src={recordedAudioUrl} className="h-9 max-w-[180px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
