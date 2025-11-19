
import React, { useState } from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const GitHubLogo: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
    </svg>
);

const WarningIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);


interface TokenInputProps {
  onAnalyze: (githubToken: string, geminiKey: string) => void;
  initialError?: string;
}

const TokenInput: React.FC<TokenInputProps> = ({ onAnalyze, initialError }) => {
  // Load from environment variables if available
  const [githubToken, setGithubToken] = useState<string>(process.env.GITHUB_TOKEN || '');
  const [geminiKey, setGeminiKey] = useState<string>(process.env.GEMINI_API_KEY || '');
  const [error, setError] = useState<string | undefined>(initialError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubToken.trim() || !geminiKey.trim()) {
      setError('Please provide both a GitHub Token and a Gemini API Key.');
      return;
    }
    setError(undefined);
    onAnalyze(githubToken, geminiKey);
  };

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 bg-slate-800 border border-slate-700 rounded-lg shadow-xl animate-fade-in">
      <div className="flex items-center justify-center mb-4 space-x-3">
        <GitHubLogo className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white">GitCast</h1>
      </div>

      <p className="text-center text-slate-400 mb-6">
        Provide your API keys to load your repositories and generate podcasts/presentations.
      </p>

      {(process.env.GITHUB_TOKEN && process.env.GEMINI_API_KEY) && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg relative mb-6 flex items-start space-x-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <strong className="font-bold">Keys Loaded! </strong>
            <span className="block sm:inline">API keys loaded from environment variables.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-start space-x-3" role="alert">
          <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* GitHub Token Input */}
          <div>
            <label htmlFor="github-token" className="block text-sm font-medium text-slate-300 mb-2">GitHub Personal Access Token</label>
            <input
              id="github-token"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-mono"
              placeholder="ghp_..."
              aria-label="GitHub Personal Access Token"
            />
          </div>
          {/* Gemini API Key Input */}
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-300 mb-2">Gemini API Key</label>
            <input
              id="gemini-key"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-mono"
              placeholder="AIzaSy..."
              aria-label="Gemini API Key"
            />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6 space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-2">GitHub Token Instructions:</h3>
            <ol className="list-decimal list-inside text-slate-400 text-sm space-y-1">
              <li>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">GitHub Tokens page</a>.</li>
              <li>Select scopes: <code className="bg-slate-700 text-sky-300 px-1.5 py-0.5 rounded text-xs font-mono">repo</code> and <code className="bg-slate-700 text-sky-300 px-1.5 py-0.5 rounded text-xs font-mono">read:user</code>.</li>
            </ol>
          </div>
          <div className="border-t border-slate-700 my-3"></div>
          <div>
            <h3 className="font-semibold text-white mb-2">Gemini Key Instructions:</h3>
            <ol className="list-decimal list-inside text-slate-400 text-sm space-y-1">
              <li>Go to <a href="https://ai.google.dev/makersuite" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Google AI Studio</a>.</li>
              <li>Click "Get API key" to create and copy your key.</li>
            </ol>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-500/50 shadow-lg"
        >
          Load My Repositories
        </button>
      </form>
    </div>
  );
};

export default TokenInput;
