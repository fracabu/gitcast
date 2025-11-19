
import React, { useState } from 'react';
import type { DetailedRepository } from '../types';

interface RepoCardProps {
  repository: DetailedRepository;
  onGeneratePodcast: (repo: DetailedRepository) => void;
  onGeneratePresentation: (repo: DetailedRepository) => void;
}

const RepoCard: React.FC<RepoCardProps> = ({ repository, onGeneratePodcast, onGeneratePresentation }) => {
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);

  const handlePodcastClick = async () => {
    setIsGeneratingPodcast(true);
    try {
      await onGeneratePodcast(repository);
    } finally {
      setIsGeneratingPodcast(false);
    }
  };

  const handlePresentationClick = async () => {
    setIsGeneratingPresentation(true);
    try {
      await onGeneratePresentation(repository);
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Rust: '#dea584',
      Vue: '#41b883',
      React: '#61dafb',
      HTML: '#e34c26',
      CSS: '#563d7c',
    };
    return colors[language || ''] || '#8b949e';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all duration-200 flex flex-col h-full">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-white mb-2 break-words">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            {repository.name}
          </a>
        </h3>
        {repository.description && (
          <p className="text-slate-300 text-sm line-clamp-2">{repository.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-slate-400">
        {repository.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repository.language) }}
            />
            {repository.language}
          </span>
        )}
        <span>⭐ {repository.stars}</span>
        <span>🍴 {repository.forks}</span>
        {repository.issues > 0 && <span>📋 {repository.issues}</span>}
      </div>

      {/* Topics */}
      {repository.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {repository.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="text-xs bg-slate-700 text-blue-400 px-2 py-1 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Additional Info */}
      <div className="text-xs text-slate-500 mb-4 space-y-1">
        <div>Creato: {formatDate(repository.createdAt)}</div>
        <div>Ultimo push: {formatDate(repository.pushedAt)}</div>
        {repository.license && <div>Licenza: {repository.license}</div>}
      </div>

      {/* Action Buttons */}
      <div className="mt-auto grid grid-cols-2 gap-2">
        <button
          onClick={handlePodcastClick}
          disabled={isGeneratingPodcast}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white text-sm py-2 px-3 rounded-md transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGeneratingPodcast ? (
            <>
              <span className="animate-spin">⏳</span>
              Generando...
            </>
          ) : (
            <>
              🎙️ Podcast
            </>
          )}
        </button>
        <button
          onClick={handlePresentationClick}
          disabled={isGeneratingPresentation}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white text-sm py-2 px-3 rounded-md transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGeneratingPresentation ? (
            <>
              <span className="animate-spin">⏳</span>
              Generando...
            </>
          ) : (
            <>
              📊 Presentazione
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RepoCard;
