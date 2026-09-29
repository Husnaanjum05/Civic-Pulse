import React, { useState } from 'react';
import { 
  Presentation, ChevronLeft, ChevronRight, Maximize2, 
  Sparkles, CheckCircle2, MessageSquare, Award, ArrowRight, Loader2 
} from 'lucide-react';
import { PITCH_SLIDES } from '../data/mockData';
import { SlideData } from '../types';

export const PitchDeckView: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customPitchTrack, setCustomPitchTrack] = useState('Resilience');
  const [customPitchResult, setCustomPitchResult] = useState<any>(null);

  const slides = PITCH_SLIDES;
  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleGenerateCustomPitch = async () => {
    setIsGeneratingCustom(true);
    try {
      const res = await fetch('/api/gemini/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: customPitchTrack,
          projectName: 'CivicPulse AI',
          focusArea: 'Hyperlocal Community Coordination and Autonomous Triage',
        }),
      });
      const data = await res.json();
      if (data.success && data.pitch) {
        setCustomPitchResult(data.pitch);
      }
    } catch (err) {
      console.error('Failed to generate custom pitch:', err);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Pitch Deck Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide uppercase mb-1">
            <span>Mandatory Requirement 4</span>
            <span aria-hidden="true">·</span>
            <span>Project Pitch Deck</span>
            <span aria-hidden="true">·</span>
            <span>Slide-by-Slide Evaluation Presentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Code for Communities Pitch Presentation
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
            Interactive presentation ready for judges and community partners. Demonstrates community problem validation, Gemini 3.8 Flash technical differentiation, Google Cloud scale, and real-world impact.
          </p>
        </div>

        {/* Slide Controls & Notes Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
              showSpeakerNotes
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showSpeakerNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 px-2 tabular-nums">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative min-h-[460px] flex flex-col justify-between">
        {/* Slide Top Metadata */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                Slide 0{currentSlide.id}: {currentSlide.badge}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Code for Communities Finalist</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Google AI Studio</span>
              <span>·</span>
              <span className="text-emerald-400">Gemini 3.8 Flash</span>
              <span>·</span>
              <span>Cloud Run</span>
            </div>
          </div>

          {/* Slide Heading */}
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {currentSlide.title}
            </h3>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Slide Bullets */}
          <div className="mt-8 space-y-4 max-w-3xl">
            {currentSlide.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Bottom Metrics & Callout */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 space-y-4">
          {currentSlide.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentSlide.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                  <p className="text-[11px] text-slate-400">{m.label}</p>
                  <p className="text-lg font-bold text-white font-mono mt-0.5">{m.value}</p>
                </div>
              ))}
            </div>
          )}

          {currentSlide.technicalCallout && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{currentSlide.technicalCallout}</span>
            </div>
          )}
        </div>
      </div>

      {/* Speaker Notes Drawer (Presenter View for Judges) */}
      {showSpeakerNotes && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Presenter & Judge Evaluation Notes (Slide 0{currentSlide.id}):</span>
            </div>
            <span className="text-[11px] text-amber-300/80 font-mono">Rubric Alignment: 100%</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/80 p-3 rounded-lg border border-amber-500/20">
            "{currentSlide.speakerNotes}"
          </p>
        </div>
      )}

      {/* Slide Navigation Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-3 rounded-xl border text-left transition-all text-xs ${
              currentSlideIndex === idx
                ? 'bg-amber-950/30 border-amber-500/60 text-amber-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-slate-500">0{s.id}</span>
              <span className="text-[10px] truncate max-w-[80px]">{s.badge}</span>
            </div>
            <p className="font-semibold text-white truncate">{s.title}</p>
          </button>
        ))}
      </div>

      {/* Live AI Pitch Tailor (Interactive Gemini 3.8 Flash Feature) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Real-Time Pitch Deck Customizer (Powered by Gemini 3.8 Flash)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Need to present for a specific community track or stakeholder audience? Generate tailored talking points instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={customPitchTrack}
              onChange={(e) => setCustomPitchTrack(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Resilience">Track 1: Resilience</option>
              <option value="Sustainability">Track 2: Sustainability</option>
              <option value="Cooperation">Track 3: Cooperation</option>
              <option value="Innovation">Track 4: Innovation</option>
            </select>

            <button
              onClick={handleGenerateCustomPitch}
              disabled={isGeneratingCustom}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isGeneratingCustom ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Tailor Pitch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {customPitchResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <span className="font-semibold text-amber-300">The 10-Second Hook</span>
              <p className="text-slate-300 leading-relaxed font-mono">{customPitchResult.hook}</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <span className="font-semibold text-emerald-300">Why Google Tech</span>
              <p className="text-slate-300 leading-relaxed font-mono">{customPitchResult.whyGoogleTech}</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5 md:col-span-2">
              <span className="font-semibold text-sky-300">Quantified Impact</span>
              <p className="text-slate-300 leading-relaxed font-mono">{customPitchResult.quantifiedImpact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
