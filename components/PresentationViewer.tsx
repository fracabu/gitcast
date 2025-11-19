
import React, { useState, useEffect } from 'react';
import type { DetailedRepository } from '../types';

interface PresentationViewerProps {
  slidesHTML: string;
  repository: DetailedRepository;
  onClose: () => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({ slidesHTML, repository, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    // Parse the HTML to extract individual slides
    const parser = new DOMParser();
    const doc = parser.parseFromString(slidesHTML, 'text/html');
    const sections = doc.querySelectorAll('section');

    const slideContents = Array.from(sections).map(section => section.innerHTML);
    setSlides(slideContents);
  }, [slidesHTML]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-lg p-8">
          <p className="text-white">Caricamento presentazione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header Controls */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-semibold">
            📊 {repository.name}
          </h2>
          <span className="text-slate-400 text-sm">
            Slide {currentSlide + 1} di {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Slide Navigation Dots */}
          <div className="hidden md:flex items-center gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-blue-500 w-8'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl px-3 py-1 rounded hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="bg-slate-900 text-white p-12 min-h-full flex flex-col justify-center"
          dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
        />

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800 bg-opacity-50 hover:bg-opacity-75 disabled:opacity-0 text-white text-3xl p-4 rounded-full transition-all"
        >
          ←
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800 bg-opacity-50 hover:bg-opacity-75 disabled:opacity-0 text-white text-3xl p-4 rounded-full transition-all"
        >
          →
        </button>
      </div>

      {/* Footer Controls */}
      <div className="bg-slate-900 border-t border-slate-700 p-3 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-2 rounded transition-colors"
        >
          ← Indietro
        </button>

        <span className="text-slate-400 text-sm md:hidden">
          {currentSlide + 1} / {slides.length}
        </span>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-2 rounded transition-colors"
        >
          Avanti →
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-20 right-4 bg-slate-800 bg-opacity-90 text-slate-300 text-xs px-3 py-2 rounded">
        💡 Usa ← → per navigare, ESC per uscire
      </div>
    </div>
  );
};

export default PresentationViewer;
