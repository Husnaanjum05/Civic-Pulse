/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommunityStudio } from './components/CommunityStudio';
import { ArchitectureView } from './components/ArchitectureView';
import { PitchDeckView } from './components/PitchDeckView';
import { SubmissionKit } from './components/SubmissionKit';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'architecture' | 'pitch' | 'checklist'>('studio');
  const [latency, setLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Ping backend on mount to verify Cloud Run & Gemini 3.8 Flash readiness
  const handlePing = async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setLatency(Date.now() - start);
      }
    } catch (err) {
      console.warn('Backend ping warning:', err);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    handlePing();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        latency={latency}
        isPinging={isPinging}
        onPing={handlePing}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'studio' && <CommunityStudio />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'pitch' && <PitchDeckView />}
        {activeTab === 'checklist' && <SubmissionKit />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CivicPulse AI</span>
            <span>·</span>
            <span>Code for Communities Hackathon</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Google AI Studio Prototype</span>
            <span>·</span>
            <span>Google Cloud Run Microservice</span>
            <span>·</span>
            <span>All 4 Tracks Validated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
