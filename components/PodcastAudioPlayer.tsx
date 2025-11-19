
import React, { useState, useEffect } from 'react';
import { ttsService } from '../services/ttsService';
import type { DetailedRepository } from '../types';

interface PodcastAudioPlayerProps {
  script: string;
  repository: DetailedRepository;
  onClose: () => void;
}

const PodcastAudioPlayer: React.FC<PodcastAudioPlayerProps> = ({ script, repository, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(script.length);

  useEffect(() => {
    setTotalLength(script.length);
    return () => {
      ttsService.stop();
    };
  }, [script]);

  const handlePlay = () => {
    if (isPaused) {
      ttsService.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      ttsService.speak(script, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentPosition(0);
        },
        onError: (error) => {
          console.error('TTS Error:', error);
          setIsPlaying(false);
          setIsPaused(false);
        },
        onBoundary: (event) => {
          setCurrentPosition(event.charIndex);
        }
      });
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    ttsService.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    ttsService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
  };

  const progress = totalLength > 0 ? (currentPosition / totalLength) * 100 : 0;

  // Estimate duration (assuming ~150 words per minute, average 5 chars per word)
  const estimatedMinutes = Math.ceil((script.length / 5) / 150);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              🎙️ Podcast: {repository.name}
            </h2>
            <p className="text-slate-400 text-sm">
              Durata stimata: ~{estimatedMinutes} minuti
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Audio Player Controls */}
        <div className="p-6 border-b border-slate-700">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{Math.floor(progress)}%</span>
              <span>{isPlaying ? 'Riproduzione...' : isPaused ? 'In pausa' : 'Pronto'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-full transition-colors"
            >
              ⏹️
            </button>

            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full text-2xl transition-colors"
              >
                ▶️
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full text-2xl transition-colors"
              >
                ⏸️
              </button>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            Utilizza Web Speech API del browser
          </p>
        </div>

        {/* Script Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Script del Podcast</h3>
          <div className="bg-slate-900 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
            {script.split('').map((char, index) => (
              <span
                key={index}
                className={index < currentPosition ? 'text-blue-400' : ''}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            💡 Suggerimento: Puoi copiare lo script e utilizzare servizi esterni come ElevenLabs o Google Cloud TTS per una qualità audio superiore e per scaricare l'audio.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastAudioPlayer;
