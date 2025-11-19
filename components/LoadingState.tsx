
import React from 'react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-sky-500/30 rounded-full"></div>
        <div 
          className="absolute inset-0 border-4 border-t-sky-500 border-l-sky-500 border-b-sky-500/0 border-r-sky-500/0 rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
        <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Generating Your GitCast...</h2>
      <p className="text-slate-400 transition-all duration-300">{message}</p>
    </div>
  );
};

export default LoadingState;