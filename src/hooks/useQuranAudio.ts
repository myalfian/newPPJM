import { useState, useEffect, useRef, useCallback } from 'react';

export type AudioPlaybackStatus = 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'ERROR';
export type AudioRepeatMode = '1x' | '3x' | 'loop' | 'continuous';

interface UseQuranAudioProps {
  onAutoNext?: () => void;
  onAutoPrev?: () => void;
}

interface TrackInfo {
  surahNumber: number;
  ayahNumber: number;
  urls: string[];
}

export function useQuranAudio({ onAutoNext, onAutoPrev }: UseQuranAudioProps = {}) {
  const [status, setStatus] = useState<AudioPlaybackStatus>('IDLE');
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number | null>(null);
  const [currentAyahNumber, setCurrentAyahNumber] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState<AudioRepeatMode>('continuous');
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackInfoRef = useRef<TrackInfo | null>(null);
  const activeUrlIndexRef = useRef<number>(0);
  const isFailingOverRef = useRef<boolean>(false);

  // Auto failover runner: tries playing candidate at `index`
  const tryPlayCandidate = useCallback((index: number) => {
    const track = trackInfoRef.current;
    const audio = audioRef.current;
    if (!track || !audio) return;

    if (index >= track.urls.length) {
      setStatus('ERROR');
      setErrorMessage('Audio terhambat koneksi. Klik Coba Lagi untuk memutar.');
      return;
    }

    activeUrlIndexRef.current = index;
    const targetUrl = track.urls[index];
    setStatus('LOADING');

    try {
      audio.pause();
    } catch {
      // Ignored
    }

    audio.src = targetUrl;
    try {
      audio.load();
    } catch {
      // Ignored
    }

    // Direct play invocation returns Promise
    audio
      .play()
      .then(() => {
        isFailingOverRef.current = false;
        setStatus('PLAYING');
        setErrorMessage(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          // Playback intentionally superseded
          return;
        }

        if (err.name === 'NotAllowedError') {
          setStatus('PAUSED');
          setErrorMessage('Autoplay dicegah peramban. Klik tombol Play untuk memulai.');
          return;
        }

        console.warn(`Situs CDN #${index + 1} (${targetUrl}) gagal dimuat:`, err.message);

        // Failover if not already in progress
        if (!isFailingOverRef.current) {
          isFailingOverRef.current = true;
          if (index + 1 < track.urls.length) {
            setTimeout(() => {
              isFailingOverRef.current = false;
              tryPlayCandidate(index + 1);
            }, 60);
          } else {
            isFailingOverRef.current = false;
            setStatus('ERROR');
            setErrorMessage('Audio terhambat koneksi. Klik Coba Lagi untuk memutar.');
          }
        }
      });
  }, []);

  // Initialize and cleanup single audio element instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleWaiting = () => {
      if (!audio.paused) {
        setStatus('LOADING');
      }
    };

    const handlePlaying = () => {
      setStatus('PLAYING');
      setErrorMessage(null);
    };

    const handlePause = () => {
      setStatus((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev));
    };

    const handleError = () => {
      const track = trackInfoRef.current;
      if (!track || isFailingOverRef.current) return;
      const nextIndex = activeUrlIndexRef.current + 1;
      if (nextIndex < track.urls.length) {
        isFailingOverRef.current = true;
        console.warn('Audio onerror dipicu, mencoba CDN alternatif #' + (nextIndex + 1));
        setTimeout(() => {
          isFailingOverRef.current = false;
          tryPlayCandidate(nextIndex);
        }, 60);
        return;
      }

      setStatus('ERROR');
      setErrorMessage('Audio terhambat koneksi. Klik Coba Lagi untuk memutar.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.src = '';
      audioRef.current = null;
    };
  }, [tryPlayCandidate]);

  // Handle end of audio track with repeat logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'loop') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      if (repeatMode === '3x') {
        if (repeatCount < 2) {
          setRepeatCount((prev) => prev + 1);
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return;
        }
        setRepeatCount(0);
        if (onAutoNext) {
          onAutoNext();
        } else {
          setStatus('IDLE');
        }
        return;
      }

      if (repeatMode === 'continuous') {
        if (onAutoNext) {
          onAutoNext();
        } else {
          setStatus('IDLE');
        }
        return;
      }

      // '1x' mode: stops after 1 playback
      setStatus('IDLE');
      setCurrentTime(0);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, repeatCount, onAutoNext]);

  // Main play function with safety wrapper & multi-CDN fallback
  const playAyah = useCallback(
    (
      surahNumber: number,
      ayahNumber: number,
      primaryUrl: string,
      fallbackUrl?: string,
      tertiaryUrl?: string,
      quaternaryUrl?: string
    ) => {
      const rawUrls = [primaryUrl, fallbackUrl, tertiaryUrl, quaternaryUrl];
      const urls = rawUrls.filter(
        (url): url is string => typeof url === 'string' && url.trim().length > 0
      );

      trackInfoRef.current = { surahNumber, ayahNumber, urls };
      setCurrentSurahNumber(surahNumber);
      setCurrentAyahNumber(ayahNumber);
      setCurrentTime(0);

      // Start from first candidate
      tryPlayCandidate(0);
    },
    [tryPlayCandidate]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === 'PLAYING') {
      audio.pause();
      setStatus('PAUSED');
      return;
    }

    if (status === 'PAUSED' && audio.src) {
      audio
        .play()
        .then(() => {
          setStatus('PLAYING');
          setErrorMessage(null);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // Re-attempt candidate sequence from beginning
            if (trackInfoRef.current) {
              tryPlayCandidate(0);
            } else {
              setStatus('ERROR');
              setErrorMessage('Gagal melanjutkan pemutaran. Klik Coba Lagi.');
            }
          }
        });
      return;
    }

    // If IDLE or ERROR, attempt full replay with user gesture
    if (trackInfoRef.current) {
      tryPlayCandidate(0);
    }
  }, [status, tryPlayCandidate]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setStatus('PAUSED');
    }
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio
        .play()
        .then(() => {
          setStatus('PLAYING');
          setErrorMessage(null);
        })
        .catch(() => setStatus('ERROR'));
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setStatus('IDLE');
      setCurrentTime(0);
      setCurrentAyahNumber(null);
      setErrorMessage(null);
    }
  }, []);

  const seek = useCallback((targetSeconds: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(targetSeconds)) {
      audio.currentTime = Math.max(0, Math.min(targetSeconds, audio.duration || 0));
      setCurrentTime(audio.currentTime);
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    status,
    currentSurahNumber,
    currentAyahNumber,
    currentTime,
    duration,
    progress,
    repeatMode,
    repeatCount,
    errorMessage,
    playAyah,
    togglePlay,
    pause,
    resume,
    stop,
    seek,
    setRepeatMode,
    nextAyah: onAutoNext,
    prevAyah: onAutoPrev,
  };
}
