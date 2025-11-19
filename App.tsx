
import React, { useState, useCallback } from 'react';
import { AppState, DetailedRepository, RepositoryListData } from './types';
import { getRepositoryList, getRepositoryDetails } from './services/githubService';
import { generateRepositoryPodcastScript, generateRepositoryPresentation } from './services/geminiService';
import TokenInput from './components/TokenInput';
import LoadingState from './components/LoadingState';
import RepoGrid from './components/RepoGrid';
import PodcastAudioPlayer from './components/PodcastAudioPlayer';
import PresentationViewer from './components/PresentationViewer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [repoData, setRepoData] = useState<RepositoryListData | null>(null);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');

  // Store tokens for later use
  const [githubToken, setGithubToken] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');

  // Podcast and Presentation state
  const [currentPodcastScript, setCurrentPodcastScript] = useState<string>('');
  const [currentPresentationHTML, setCurrentPresentationHTML] = useState<string>('');
  const [currentRepository, setCurrentRepository] = useState<DetailedRepository | null>(null);
  const [showPodcastPlayer, setShowPodcastPlayer] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);

  const handleAnalyze = useCallback(async (githubToken: string, geminiKey: string) => {
    if (!githubToken.trim() || !geminiKey.trim()) {
      setError('Both GitHub Token and Gemini API Key are required.');
      setAppState(AppState.ERROR);
      return;
    }

    setAppState(AppState.LOADING);
    setError('');
    setGithubToken(githubToken);
    setGeminiKey(geminiKey);

    try {
      setLoadingMessage('Autenticazione e recupero profilo utente...');
      await new Promise(res => setTimeout(res, 500));

      setLoadingMessage('Caricamento repository e analisi dettagliata...');
      const data = await getRepositoryList(githubToken);
      setRepoData(data);

      setAppState(AppState.REPO_LIST);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(`Failed to load repositories. ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleGeneratePodcast = useCallback(async (repo: DetailedRepository) => {
    try {
      console.log('🎙️ Starting podcast generation for:', repo.name);
      setLoadingMessage(`Caricamento dettagli per ${repo.name}...`);

      // Fetch detailed info if not already loaded - use userLogin (GitHub username) not userName (display name)
      const username = repoData?.userLogin || '';
      console.log('📝 Username:', username);

      const details = await getRepositoryDetails(username, repo.name, githubToken);
      console.log('✅ Details loaded:', details);

      // Merge details with basic repo info
      const fullRepo: DetailedRepository = {
        ...repo,
        ...details,
      };

      setLoadingMessage(`Generazione podcast per ${repo.name}...`);
      console.log('🤖 Calling Gemini API...');
      const script = await generateRepositoryPodcastScript(fullRepo, geminiKey);
      console.log('✅ Script generated:', script.substring(0, 100) + '...');

      setCurrentPodcastScript(script);
      setCurrentRepository(fullRepo);
      setShowPodcastPlayer(true);
      console.log('✅ Podcast player opened');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('❌ Error generating podcast:', err);
      alert(`Errore nella generazione del podcast: ${errorMessage}`);
    }
  }, [geminiKey, githubToken, repoData]);

  const handleGeneratePresentation = useCallback(async (repo: DetailedRepository) => {
    try {
      setLoadingMessage(`Caricamento dettagli per ${repo.name}...`);

      // Fetch detailed info if not already loaded - use userLogin (GitHub username) not userName (display name)
      const username = repoData?.userLogin || '';
      const details = await getRepositoryDetails(username, repo.name, githubToken);

      // Merge details with basic repo info
      const fullRepo: DetailedRepository = {
        ...repo,
        ...details,
      };

      setLoadingMessage(`Generazione presentazione per ${repo.name}...`);
      const html = await generateRepositoryPresentation(fullRepo, geminiKey);
      setCurrentPresentationHTML(html);
      setCurrentRepository(fullRepo);
      setShowPresentation(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      alert(`Errore nella generazione della presentazione: ${errorMessage}`);
    }
  }, [geminiKey, githubToken, repoData]);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setRepoData(null);
    setError('');
    setGithubToken('');
    setGeminiKey('');
    setCurrentPodcastScript('');
    setCurrentPresentationHTML('');
    setCurrentRepository(null);
    setShowPodcastPlayer(false);
    setShowPresentation(false);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingState message={loadingMessage} />;
      case AppState.REPO_LIST:
        return repoData ? (
          <RepoGrid
            data={repoData}
            onGeneratePodcast={handleGeneratePodcast}
            onGeneratePresentation={handleGeneratePresentation}
            onBack={handleReset}
          />
        ) : null;
      case AppState.ERROR:
        return <TokenInput onAnalyze={handleAnalyze} initialError={error} />;
      case AppState.IDLE:
      default:
        return <TokenInput onAnalyze={handleAnalyze} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <main className={appState === AppState.REPO_LIST ? "w-full" : "w-full max-w-2xl mx-auto flex-grow flex items-center justify-center min-h-screen"}>
        {renderContent()}
      </main>

      {/* Podcast Player Modal */}
      {showPodcastPlayer && currentRepository && (
        <PodcastAudioPlayer
          script={currentPodcastScript}
          repository={currentRepository}
          onClose={() => setShowPodcastPlayer(false)}
        />
      )}

      {/* Presentation Viewer Modal */}
      {showPresentation && currentRepository && (
        <PresentationViewer
          slidesHTML={currentPresentationHTML}
          repository={currentRepository}
          onClose={() => setShowPresentation(false)}
        />
      )}
    </div>
  );
};

export default App;
