import { useState, useEffect, useRef, useCallback } from 'react';

export type AudioPlaybackStatus = 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'ERROR';
export type AudioRepeatMode = '1x' | '3x' | 'loop' | 'continuous';

interface UseQuranAudioProps {
  onAutoNext?: () => void;
  onAutoPrev?: () => void;
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
  const currentFallbackUrlRef = useRef<string | null>(null);
  const hasTriedFallbackRef = useRef<boolean>(false);
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
      // Automatic fallback mechanism to secondary CDN
      if (!hasTriedFallbackRef.current && currentFallbackUrlRef.current) {
        hasTriedFallbackRef.current = true;
        console.warn('CDN audio utama terkendala, beralih ke CDN cadangan (EveryAyah)...');
        audio.src = currentFallbackUrlRef.current;
        audio.load();
        audio.play().catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Playback error pada CDN cadangan:', err);
            setStatus('ERROR');
            setErrorMessage('Gagal memutar audio dari semua server CDN.');
          }
        });
        return;
      }

      setStatus('ERROR');
      setErrorMessage('Audio tidak dapat dimuat. Periksa koneksi internet Anda.');
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
        // Completed 3x, reset and proceed to next
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

  // Main play function with safety wrapper
  const playAyah = useCallback(
    (
      surahNumber: number,
      ayahNumber: number,
      primaryUrl: string,
      fallbackUrl?: string
    ) => {
      const audio = audioRef.current;
      if (!audio) return;

      isSwitchingTrackRef.current = true;
      hasTriedFallbackRef.current = false;
      currentFallbackUrlRef.current = fallbackUrl || null;

      setCurrentSurahNumber(surahNumber);
      setCurrentAyahNumber(ayahNumber);
      setStatus('LOADING');
      setErrorMessage(null);
      setCurrentTime(0);

      // Safe pause before new source assignment
      try {
        audio.pause();
      } catch {
        // Ignored
      }

      audio.src = primaryUrl;
      audio.load();

      // Trigger playback with user gesture activation context
      audio
        .play()
        .then(() => {
          setStatus('PLAYING');
          isSwitchingTrackRef.current = false;
        })
        .catch((err) => {
          // If aborted by user rapidly clicking next, do not trigger error state
          if (err.name === 'AbortError') {
            return;
          }

          // If NotAllowedError or network error, attempt fallback or report
          if (!hasTriedFallbackRef.current && fallbackUrl) {
            hasTriedFallbackRef.current = true;
            audio.src = fallbackUrl;
            audio.load();
            audio
              .play()
              .then(() => {
                setStatus('PLAYING');
                isSwitchingTrackRef.current = false;
              })
              .catch((fallbackErr) => {
                if (fallbackErr.name !== 'AbortError') {
                  setStatus('ERROR');
                  setErrorMessage('Audio terblokir kebijakan browser atau CDN offline.');
                }
              });
            return;
          }

          console.warn('Audio play prevented:', err);
          setStatus('ERROR');
          setErrorMessage('Klik tombol play untuk mengaktifkan izin audio browser.');
        });
    },
    []
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (status === 'PLAYING') {
      audio.pause();
      setStatus('PAUSED');
    } else {
      audio
        .play()
        .then(() => setStatus('PLAYING'))
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setStatus('ERROR');
            setErrorMessage('Gagal melanjutkan pemutaran audio.');
          }
        });
    }
  }, [status]);

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
        .then(() => setStatus('PLAYING'))
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

