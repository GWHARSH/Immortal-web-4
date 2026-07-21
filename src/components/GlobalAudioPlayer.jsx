import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function GlobalAudioPlayer() {
  const { settings } = useSettings();
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const bgMusic = settings?.bg_music_url || '/bg-music.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().then(() => {
        setIsMuted(false);
      }).catch((err) => {
        console.warn('Audio playback error:', err);
      });
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <div className="music-toggle" style={{ zIndex: 9999 }}>
      <audio ref={audioRef} src={bgMusic} loop />
      <div className="music-toggle__controls">
        <button className="music-toggle__btn" onClick={toggleMusic} aria-label="Toggle Music">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
