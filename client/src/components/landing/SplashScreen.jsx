import React, { useEffect, useState } from 'react';
import GenLancerLogo from '../auth/GenLancerLogo';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth loading bar progression over 2.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    const timeout = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-8 select-none overflow-hidden animate-fade-in">
      {/* Subtle radial ambient orange glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer / tag */}
      <div className="pt-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">
        <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
        <span>The AI Creator Marketplace</span>
      </div>

      {/* Centered Logo matching Reference Image */}
      <div className="flex flex-col items-center justify-center my-auto relative z-10 scale-105 sm:scale-125 transition-transform">
        <div className="relative animate-pulse-slow">
          <GenLancerLogo 
            className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-xl" 
            layout="stacked"
            textSize="text-4xl sm:text-5xl"
            textColor="text-[#FF6B00]"
          />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-4 tracking-wide">
          Connecting Verified AI Creators with Global Brands
        </p>
      </div>

      {/* Bottom Loading Progress Bar & Skip action */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 relative z-10 pb-4">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
          <div 
            className="bg-gradient-to-r from-orange-500 to-[#FF6B00] h-full rounded-full transition-all duration-75 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium">
          <span>Initializing AI Network...</span>
          <button 
            onClick={onFinish}
            className="text-slate-600 hover:text-[#FF6B00] font-bold cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
