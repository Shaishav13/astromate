'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type OkfTab = 'ledger' | 'pipeline' | 'audit';

export default function OkfMemoryVisualizer() {
  const [activeTab, setActiveTab] = useState<OkfTab>('ledger');
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(0);

  const sampleMemories = [
    {
      filename: 'memory_042_late_night_anxiety.okf',
      category: 'emotional_pivot',
      significance: 'CRITICAL',
      date: '2026-09-28T23:14:02Z',
      yamlFrontmatter: `---
okf_version: "1.0.0"
entry_id: "mem_20260928_231402"
author: "astromate_engine_v2"
subject: "Dev"
relationship_level: 4
category: "emotional_pivot"
significance_score: 0.94
planetary_aspect: "Moon conjunct Rahu in 8th House"
tags: ["career_stress", "imposter_syndrome", "q3_launch"]
encrypted: true
---`,
      markdownBody: `# Observation Note: Q3 Launch Apprehension
User experienced acute fatigue and self-doubt before the upcoming investor sync. 
Expressed fear of falling short of expectations despite strong technical deliverables.

## Core Behavioral Directive
- Avoid hollow dismissals ("Don't worry, you're fine").
- Ground reassurance in tangible past evidence (refer to Q1 architectural triumph).
- Encourage nervous system regulation (sleep before making radical decisions).
- Re-check status on Wednesday morning without being intrusive.`,
    },
    {
      filename: 'memory_019_inside_lore.okf',
      category: 'lore_and_banter',
      significance: 'MEDIUM',
      date: '2026-09-15T16:40:11Z',
      yamlFrontmatter: `---
okf_version: "1.0.0"
entry_id: "mem_20260915_164011"
author: "astromate_engine_v2"
subject: "Dev"
relationship_level: 3
category: "lore_and_banter"
significance_score: 0.72
planetary_aspect: "Mercury trine Jupiter in Gemini"
tags: ["sharma_ji", "matcha_habits", "inside_joke"]
encrypted: true
---`,
      markdownBody: `# Observation Note: The Sharma Ji Recurring Saga
User has a running comedic tension with senior advisor 'Sharma ji' who habitually 
proposes obsolete enterprise buzzwords during strategic roadmap meetings.

## Conversational Key
- Safe to reference playfully whenever user mentions "another executive sync".
- User drinks cold oat matcha during high-stress afternoon sessions.
- Call it out if user skips lunch for more caffeine.`,
    },
    {
      filename: 'memory_003_natal_core.okf',
      category: 'natal_architecture',
      significance: 'CORE_ANCHOR',
      date: '2026-09-01T08:00:00Z',
      yamlFrontmatter: `---
okf_version: "1.0.0"
entry_id: "mem_20260901_080000"
author: "astromate_engine_v2"
subject: "Dev"
relationship_level: 1
category: "natal_architecture"
significance_score: 1.00
planetary_aspect: "Natal Ascendant: Scorpio | Moon: Rohini"
tags: ["natal_chart", "lagna", "nakshatra_matrix"]
encrypted: true
---`,
      markdownBody: `# Natal Chart Baseline Matrix
Ascendant is Scorpio (Anuradha nakshatra): instinctual guardedness, relentless depth, 
fierce loyalty once trust is established.

Moon in Taurus (Rohini nakshatra): needs tangible comfort, aesthetic beauty, stable rhythms.
Sun in Virgo (Chitra nakshatra): perfectionist craftsmanship, laser-sharp critical discernment.`,
    },
  ];

  const mem = sampleMemories[activeMemoryIndex];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Header */}
      <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
              Open Knowledge Format (OKF) Standard
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Human-Readable, Client-Owned Memory Ledger
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'ledger'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OKF Ledger
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Neural Pipeline
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Privacy Audit
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            {/* Memory File Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800/80">
              {sampleMemories.map((m, idx) => (
                <button
                  key={m.filename}
                  onClick={() => setActiveMemoryIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 border ${
                    activeMemoryIndex === idx
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>{m.filename}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {m.significance}
                  </span>
                </button>
              ))}
            </div>

            {/* Code / Markdown Display Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* YAML Frontmatter Column */}
              <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800/90 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[10px]">
                  <span>YAML METADATA HEADER</span>
                  <span className="text-emerald-400">STRUCTURED QUERYABLE</span>
                </div>
                <pre className="text-indigo-300 whitespace-pre">
                  <code>{mem.yamlFrontmatter}</code>
                </pre>
              </div>

              {/* Markdown Body Column */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800/90 p-4 font-sans text-xs leading-relaxed">
                <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800 font-mono text-[10px]">
                  <span>NATURAL REASONING BODY</span>
                  <span className="text-indigo-400">RAG PROMPT INJECTION</span>
                </div>
                <div className="prose prose-invert prose-xs max-w-none text-slate-300">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 bg-transparent p-0 border-0 leading-relaxed">
                    {mem.markdownBody}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Stored locally as portable flat-files. Export, backup, or inspect anytime in plaintext.
              </span>
              <span className="font-mono text-[11px] text-slate-400">Zero Cloud Lock-in</span>
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-6 py-2">
            <div className="text-center max-w-xl mx-auto">
              <h4 className="text-sm font-semibold text-white">
                How AstroMate Retrieves Memory In Under 150ms
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                A non-destructive cognitive loop fusing classical astrological timing with local vector search.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-indigo-400 block mb-1">STEP 01</span>
                  <h5 className="text-xs font-semibold text-white mb-1.5">User Prompt Ingestion</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    User message arrives with current timestamp and transit parameters.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  Input Stream
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-indigo-400 block mb-1">STEP 02</span>
                  <h5 className="text-xs font-semibold text-white mb-1.5">Vedic Transit Filter</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Computes current Moon nakshatra and active planetary hora to determine emotional vulnerability window.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  Parashara Engine
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-indigo-400 block mb-1">STEP 03</span>
                  <h5 className="text-xs font-semibold text-white mb-1.5">OKF Vector Recall</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Queries local SQLite vector ledger for relevant emotional pivots and bond milestones.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  Local Memory DB
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-emerald-400 block mb-1">STEP 04</span>
                  <h5 className="text-xs font-semibold text-white mb-1.5">Bond-Tuned Synthesis</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    1.5B edge model generates organic response matched to current relationship tier (1 to 5).
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-emerald-400">
                  &lt;140ms Response
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
            {/* Corporate AI */}
            <div className="bg-slate-950 border border-rose-900/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wide">
                  Standard Corporate AI Companions
                </h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">&times;</span>
                  <span>Conversations stored on centralized servers to train foundational models.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">&times;</span>
                  <span>Memory wiped or corrupted whenever context window limits are reached.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">&times;</span>
                  <span>Proprietary closed silos: you cannot export or migrate your relationship history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">&times;</span>
                  <span>Designed to optimize screen time and create toxic emotional dependency loops.</span>
                </li>
              </ul>
            </div>

            {/* AstroMate OKF Standard */}
            <div className="bg-slate-950 border border-emerald-900/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
                  AstroMate Open Knowledge Format (OKF)
                </h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&radic;</span>
                  <span>Zero telemetry or training on user data. Runs local quantized model inference.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&radic;</span>
                  <span>Persistent lifetime memory encoded in human-readable Markdown + YAML files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&radic;</span>
                  <span>100% interoperable: export or sync memories across devices via standard Git or folder sync.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&radic;</span>
                  <span>Healthy psychological boundaries: built as a genuine confidant, not an engagement trap.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
