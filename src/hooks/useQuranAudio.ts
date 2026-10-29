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
  const isSwitchingTrackRef = useRef<boolean>(false);

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
      if (!audio.paused && !isSwitchingTrackRef.current) {
        setStatus('LOADING');
      }
    };

    const handlePlaying = () => {
      setStatus('PLAYING');
      setErrorMessage(null);
      isSwitchingTrackRef.current = false;
    };

    const handlePause = () => {
      if (!isSwitchingTrackRef.current) {
        setStatus((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev));
      }
    };

    const handleError = () => {
      if (isSwitchingTrackRef.current) return;

      const track = trackInfoRef.current;
      if (track && activeUrlIndexRef.current + 1 < track.urls.length) {
        const nextIdx = activeUrlIndexRef.current + 1;
        activeUrlIndexRef.current = nextIdx;
        const nextUrl = track.urls[nextIdx];
        console.warn(`CDN audio gagal, beralih ke CDN alternatif #${nextIdx + 1}: ${nextUrl}`);

        audio.src = nextUrl;
        audio.load();
        audio.play().catch((err) => {
          if (err.name !== 'AbortError') {
            if (nextIdx + 1 >= track.urls.length) {
              setStatus('ERROR');
              setErrorMessage('Audio terhambat koneksi. Klik Coba Lagi untuk memutar.');
            }
          }
        });
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
  }, []);

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
      tertiaryUrl?: string
    ) => {
      const audio = audioRef.current;
      if (!audio) return;

      const rawUrls = [primaryUrl, fallbackUrl, tertiaryUrl];
      const urls = rawUrls.filter(
        (url): url is string => typeof url === 'string' && url.trim().length > 0
      );

      trackInfoRef.current = { surahNumber, ayahNumber, urls };
      activeUrlIndexRef.current = 0;
      isSwitchingTrackRef.current = true;

      setCurrentSurahNumber(surahNumber);
      setCurrentAyahNumber(ayahNumber);
      setStatus('LOADING');
      setErrorMessage(null);
      setCurrentTime(0);

      try {
        audio.pause();
      } catch {
        // Ignored
      }

      const activeUrl = urls[0];
      if (!activeUrl) {
        setStatus('ERROR');
        setErrorMessage('URL audio tidak ditemukan.');
        return;
      }

      audio.src = activeUrl;
      audio.load();

      // Trigger playback with user gesture activation context
      audio
        .play()
        .then(() => {
          setStatus('PLAYING');
          setErrorMessage(null);
          isSwitchingTrackRef.current = false;
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            return;
          }

          // If blocked or initial CDN offline, try next candidate immediately
          if (urls.length > 1) {
            activeUrlIndexRef.current = 1;
            audio.src = urls[1];
            audio.load();
            audio
              .play()
              .then(() => {
                setStatus('PLAYING');
                setErrorMessage(null);
                isSwitchingTrackRef.current = false;
              })
              .catch((fallbackErr) => {
                if (fallbackErr.name !== 'AbortError') {
                  setStatus('ERROR');
                  setErrorMessage('Audio terhambat koneksi. Klik Coba Lagi untuk memutar.');
                }
              });
            return;
          }

          console.warn('Audio play prevented:', err);
          setStatus('ERROR');
          setErrorMessage('Klik tombol Coba Lagi untuk mengaktifkan izin audio browser.');
        });
    },
    []
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
            // Re-attempt track playback
            if (trackInfoRef.current) {
              const { surahNumber, ayahNumber, urls } = trackInfoRef.current;
              playAyah(surahNumber, ayahNumber, urls[0], urls[1], urls[2]);
            } else {
              setStatus('ERROR');
              setErrorMessage('Gagal melanjutkan pemutaran audio. Klik Coba Lagi.');
            }
          }
        });
      return;
    }

    // If IDLE or ERROR, attempt full replay with user gesture
    if (trackInfoRef.current) {
      const { surahNumber, ayahNumber, urls } = trackInfoRef.current;
      playAyah(surahNumber, ayahNumber, urls[0], urls[1], urls[2]);
    }
  }, [status, playAyah]);

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
