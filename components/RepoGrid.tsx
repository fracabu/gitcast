
import React, { useState } from 'react';
import type { DetailedRepository, RepositoryListData } from '../types';
import RepoCard from './RepoCard';

interface RepoGridProps {
  data: RepositoryListData;
  onGeneratePodcast: (repo: DetailedRepository) => Promise<void>;
  onGeneratePresentation: (repo: DetailedRepository) => Promise<void>;
  onBack: () => void;
}

const RepoGrid: React.FC<RepoGridProps> = ({
  data,
  onGeneratePodcast,
  onGeneratePresentation,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Get unique languages from repositories
  const uniqueLanguages = Array.from(
    new Set(
      data.repositories
        .map(repo => repo.language)
        .filter((lang): lang is string => lang !== null)
    )
  ).sort();

  // Filter repositories based on search and language
  const filteredRepos = data.repositories.filter(repo => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesLanguage =
      languageFilter === 'all' || repo.language === languageFilter;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">
            Repository di {data.userName}
          </h1>
          <button
            onClick={onBack}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            ← Indietro
          </button>
        </div>
        <p className="text-slate-400">
          {data.repositories.length} repository trovati
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cerca repository..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tutti i linguaggi</option>
          {uniqueLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {searchTerm || languageFilter !== 'all' ? (
        <p className="text-slate-400 text-sm mb-4">
          Mostrando {filteredRepos.length} di {data.repositories.length} repository
        </p>
      ) : null}

      {/* Repository Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <RepoCard
              key={repo.name}
              repository={repo}
              onGeneratePodcast={onGeneratePodcast}
              onGeneratePresentation={onGeneratePresentation}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            Nessun repository trovato con i filtri selezionati.
          </p>
        </div>
      )}
    </div>
  );
};

export default RepoGrid;
