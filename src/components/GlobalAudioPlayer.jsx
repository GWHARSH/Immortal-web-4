import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function GlobalAudioPlayer() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Determine active audio URL
  const getAudioUrl = () => {
    const dbUrl = settings?.bg_music_url;
    if (dbUrl && typeof dbUrl === 'string' && dbUrl.startsWith('http') && !dbUrl.includes('idb://') && !dbUrl.includes('firestore_media://')) {
      return dbUrl;
    }
    return '/bg-music.mp3';
  };

  const audioUrl = getAudioUrl();

  const toggleMusic = async (e) => {
    if (e) {
      e.stopPropagation();
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        audio.volume = volume;
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[AudioPlayer] Play attempt failed:', err);
        try {
          audio.src = '/bg-music.mp3';
          audio.load();
          audio.volume = volume;
          await audio.play();
          setIsPlaying(true);
        } catch (err2) {
          console.error('[AudioPlayer] Fallback audio play failed:', err2);
        }
      }
    }
  };

  return (
    <div className="music-toggle" style={{ zIndex: 9999, position: 'fixed', bottom: '32px', right: '32px' }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />
      <div className="music-toggle__controls">
        <button
          type="button"
          className={`music-toggle__btn ${isPlaying ? 'music-toggle__btn--playing' : ''}`}
          onClick={toggleMusic}
          aria-label="Toggle Music"
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
          style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: '4px' }}
        >
          {isPlaying ? <Volume2 size={20} color="#00F0FF" /> : <VolumeX size={20} color="#94A3B8" />}
        </button>
        <div className="music-toggle__slider-wrap">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            className="music-toggle__slider"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
          />
        </div>
      </div>
    </div>
  );
}
