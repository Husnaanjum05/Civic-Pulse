import React, { useState } from 'react';
import { 
  ShieldAlert, Leaf, Users, Lightbulb, Send, CheckCircle2, 
  MapPin, AlertTriangle, Radio, Sparkles, Volume2, 
  Copy, Check, ArrowRight, Loader2, RefreshCw
} from 'lucide-react';
import { TrackType, UrgencyLevel, CommunityActionData, IncidentPreset } from '../types';
import { INCIDENT_PRESETS } from '../data/mockData';

interface CommunityStudioProps {
  onPlanGenerated?: (plan: CommunityActionData) => void;
}

export const CommunityStudio: React.FC<CommunityStudioProps> = () => {
  const [selectedTrack, setSelectedTrack] = useState<TrackType>('resilience');
  const [title, setTitle] = useState(INCIDENT_PRESETS[0].title);
  const [description, setDescription] = useState(INCIDENT_PRESETS[0].description);
  const [urgency, setUrgency] = useState<UrgencyLevel>(INCIDENT_PRESETS[0].urgency);
  const [location, setLocation] = useState(INCIDENT_PRESETS[0].location);
  const [resourceConstraints, setResourceConstraints] = useState(INCIDENT_PRESETS[0].resourceConstraints);
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['English', 'Spanish', 'Vietnamese']);
  
  const [isLoading, setIsLoading] = useState(false);
  const [actionData, setActionData] = useState<CommunityActionData | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copiedAlert, setCopiedAlert] = useState<string | null>(null);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);

  // Available language choices for multilingual inclusion
  const availableLanguages = ['English', 'Spanish', 'Vietnamese', 'Mandarin', 'Arabic', 'Haitian Creole', 'French'];

  const toggleLanguage = (lang: string) => {
    if (targetLanguages.includes(lang)) {
      if (targetLanguages.length > 1) {
        setTargetLanguages(targetLanguages.filter((l) => l !== lang));
      }
    } else {
      setTargetLanguages([...targetLanguages, lang]);
    }
  };

  const handleSelectPreset = (preset: IncidentPreset) => {
    setSelectedTrack(preset.track);
    setTitle(preset.title);
    setDescription(preset.description);
    setUrgency(preset.urgency);
    setLocation(preset.location);
    setResourceConstraints(preset.resourceConstraints);
    setTargetLanguages(preset.targetLanguages);
  };

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setActionData(null);

    try {
      const response = await fetch('/api/gemini/community-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: selectedTrack,
          title,
          description,
          urgency,
          location,
          targetLanguages,
          resourceConstraints,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setActionData(json.data);
        setLatencyMs(json.latencyMs);
      }
    } catch (err) {
      console.error('Failed to generate action plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAlert(id);
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  const simulateSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setIsSimulatingAudio(true);
      utterance.onend = () => setIsSimulatingAudio(false);
      utterance.onerror = () => setIsSimulatingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Intro Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wide uppercase mb-1">
            <span>Live Hackathon Working Demo</span>
            <span aria-hidden="true">·</span>
            <span>4 Official Tracks</span>
            <span aria-hidden="true">·</span>
            <span>Sub-Second Gemini 3.8 Flash Reasoning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Community Crisis & Impact Dispatcher
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
            Test real-world grassroots response scenarios. Gemini 3.8 Flash analyzes unstructured incident reports, calculates priority indices, assigns squad missions, and prepares multilingual citizen broadcasts without lag.
          </p>
        </div>

        {/* Track Selection Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => {
              setSelectedTrack('resilience');
              handleSelectPreset(INCIDENT_PRESETS[0]);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              selectedTrack === 'resilience'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>1. Resilience</span>
          </button>

          <button
            onClick={() => {
              setSelectedTrack('sustainability');
              handleSelectPreset(INCIDENT_PRESETS[1]);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              selectedTrack === 'sustainability'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Sustainability</span>
          </button>

          <button
            onClick={() => {
              setSelectedTrack('cooperation');
              handleSelectPreset(INCIDENT_PRESETS[2]);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              selectedTrack === 'cooperation'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>3. Cooperation</span>
          </button>

          <button
            onClick={() => {
              setSelectedTrack('innovation');
              handleSelectPreset(INCIDENT_PRESETS[3]);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              selectedTrack === 'innovation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>4. Innovation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Input Workbench & Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets Carousel */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Test Scenarios:</span>
              <span>1-Click Load</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {INCIDENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                    title === preset.title
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-200 truncate">{preset.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{preset.tagline}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGeneratePlan} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Incident or Project Title</span>
                <span className="text-[11px] text-slate-500 font-normal">Track: {selectedTrack}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Flash Flood in Sector B"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="critical">Critical (0-2 hours)</option>
                  <option value="high">High (2-6 hours)</option>
                  <option value="medium">Medium (Today)</option>
                  <option value="low">Low (Planning)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Community Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-7 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Unstructured Community Distress Report / Request
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                placeholder="Describe the situation, affected people, needs..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Known Constraints & Logistics Assets
              </label>
              <input
                type="text"
                value={resourceConstraints}
                onChange={(e) => setResourceConstraints(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Target Languages Multilingual Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Multilingual Broadcast Target</span>
                <span className="text-[11px] text-slate-500">Auto-Translated by Gemini</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableLanguages.map((lang) => {
                  const isSelected = targetLanguages.includes(lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-slate-200 text-slate-950 font-medium'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini 3.8 Flash Reasoning & Triage...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Dispatch & Analyze with Gemini 3.8 Flash</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Structured Output & Dispatch Center (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {actionData ? (
            <div className="space-y-6">
              {/* Header Stats Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Track: {actionData.classification.track}</span>
                      <span aria-hidden="true">·</span>
                      <span>Category: {actionData.classification.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Operational Action Plan
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {latencyMs && (
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Latency: {latencyMs}ms
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded border ${
                        actionData.classification.severityLevel === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                          : actionData.classification.severityLevel === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {actionData.classification.severityLevel} PRIORITY ({actionData.classification.priorityScore}/100)
                    </span>
                  </div>
                </div>

                {/* Key Impact Counter Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[11px] text-slate-400">Residents Assisted</p>
                    <p className="text-lg font-bold text-white tabular-nums">
                      {actionData.communityImpactMetrics.vulnerableResidentsAssisted.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[11px] text-slate-400">Diverted / Protected</p>
                    <p className="text-lg font-bold text-emerald-400 tabular-nums">
                      {actionData.communityImpactMetrics.co2OrWasteDivertedKg.toLocaleString()} kg
                    </p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[11px] text-slate-400">Volunteer Hours</p>
                    <p className="text-lg font-bold text-sky-400 tabular-nums">
                      {actionData.communityImpactMetrics.volunteerHoursOrganized} hrs
                    </p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[11px] text-slate-400">Mitigation Saved</p>
                    <p className="text-lg font-bold text-amber-400 tabular-nums">
                      {actionData.communityImpactMetrics.estimatedCrisisMitigationHours} hrs
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Plan Squad Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Squad Missions & Responsibilities
                  </h4>
                  <span className="text-xs text-slate-400">4 Squads Activated</span>
                </div>

                <div className="space-y-2.5">
                  {actionData.actionPlan.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{item.role}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[11px] text-amber-400 font-mono">{item.urgency}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.task}</p>
                      </div>

                      <span className="text-[11px] self-start sm:self-auto shrink-0 bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Broadcast Multilingual Citizen Alerts */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
                    <h4 className="text-sm font-semibold text-white">
                      Multilingual Community Broadcast & SMS Dispatch
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Auto-Local</span>
                </div>

                {/* Primary Alert */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-sky-300">English (Primary Feed)</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => simulateSpeech(actionData.broadcastAlerts.primary)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                        title="Simulate Community Audio Broadcast"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSimulatingAudio ? 'text-emerald-400 animate-bounce' : ''}`} />
                        <span>Listen</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(actionData.broadcastAlerts.primary, 'primary')}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedAlert === 'primary' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy SMS</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    {actionData.broadcastAlerts.primary}
                  </p>
                </div>

                {/* Multilingual translations */}
                {actionData.broadcastAlerts.multilingual && actionData.broadcastAlerts.multilingual.length > 0 && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-slate-400">Multilingual Dialect Broadcasts:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {actionData.broadcastAlerts.multilingual.map((alert, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium text-slate-300">{alert.language}</span>
                            <button
                              onClick={() => copyToClipboard(alert.text, `lang-${i}`)}
                              className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
                            >
                              {copiedAlert === `lang-${i}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 font-mono leading-relaxed">
                            {alert.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resource Allocation Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <h4 className="text-sm font-semibold text-white">
                  Mutual Aid Resource Allocation Matrix
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {actionData.resourceAllocation.map((res, i) => (
                    <div key={i} className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{res.resource}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{res.status}</span>
                      </div>
                      <p className="text-xs text-slate-400">Qty: {res.quantity}</p>
                      <p className="text-[11px] text-slate-500 truncate">At: {res.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-semibold text-white">
                  Ready for Evaluation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select any scenario from the left panel and click <strong className="text-emerald-300">Dispatch & Analyze with Gemini 3.8 Flash</strong> to watch low-latency structured reasoning generate a complete operational community plan.
                </p>
              </div>
              <button
                onClick={() => handleGeneratePlan()}
                className="inline-flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg transition-colors border border-slate-700"
              >
                <span>Run Default Flood Resilience Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
