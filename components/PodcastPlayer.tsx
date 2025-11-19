
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const PlayIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const RefreshCwIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 2v6h6"></path>
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
    <path d="M21 22v-6h-6"></path>
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
  </svg>
);

interface PodcastPlayerProps {
  script: string;
  userName: string;
  onReset: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ script, userName, onReset }) => {
  const parsedScript = script.split(/\r?\n/).filter(line => line.trim() !== '');

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">Your GitCast is Ready!</h2>
        <p className="text-sky-300">A personalized analysis for <span className="font-semibold">{userName}</span></p>
      </div>

      <div className="p-6 flex-grow overflow-y-auto max-h-[60vh] text-slate-300 leading-relaxed space-y-4">
        {parsedScript.map((line, index) => {
          if (line.match(/^\d+\./)) { // Call to action list
            return <p key={index} className="pl-4 border-l-2 border-sky-500 font-medium text-sky-200">{line}</p>;
          }
          if (line.startsWith('[') && line.endsWith(']')) { // Sound effects
            return <p key={index} className="text-slate-500 italic">{line}</p>;
          }
          if (line.toLowerCase().includes('call to action') || line.toLowerCase().includes('summary')) {
             return <h4 key={index} className="text-lg font-semibold text-white pt-4">{line}</h4>
          }
          return <p key={index}>{line}</p>;
        })}
      </div>

      <div className="p-6 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-3 bg-sky-600 rounded-full text-white shadow-lg" aria-label="Play Podcast (not available)">
            <PlayIcon className="w-6 h-6" />
          </button>
          <div className="text-sm">
            <p className="font-bold text-white">GitCast for {userName}</p>
            <p className="text-slate-400">Audio playback not available</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors"
          title="Analyze another profile"
        >
          <RefreshCwIcon className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );
};

export default PodcastPlayer;
