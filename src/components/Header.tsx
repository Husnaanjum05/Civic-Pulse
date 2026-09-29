import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Cpu, Presentation, CheckSquare, Clock, Activity, Cloud } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'architecture' | 'pitch' | 'checklist';
  setActiveTab: (tab: 'studio' | 'architecture' | 'pitch' | 'checklist') => void;
  latency: number | null;
  isPinging: boolean;
  onPing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  latency,
  isPinging,
  onPing,
}) => {
  // 24-hour countdown simulation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 48,
    seconds: 32,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Hackathon Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Code for Communities Hackathon
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:inline">
              Final Countdown Evaluation Prototype
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-300 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Submission Deadline:</span>
              <span className="font-semibold bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onPing}
              disabled={isPinging}
              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-950/40"
              title="Test live Cloud Run endpoint and Gemini 3.8 Flash latency"
            >
              <Activity className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging...' : latency ? `${latency}ms` : 'Ping Cloud Run'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">CivicPulse AI</h1>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Community Triage & Resilience Coordination
            </p>
          </div>
        </div>

        {/* Tab Switcher - Clean Segmented Control */}
        <nav className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'studio'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Community AI</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'architecture'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'pitch'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Pitch Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'checklist'
                ? 'bg-purple-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Submission Kit (4/4)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
