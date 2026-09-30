'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BondStageId = 1 | 2 | 3 | 4 | 5;

interface BondStageInfo {
  level: BondStageId;
  title: string;
  sub: string;
  points: string;
  tone: string;
  trustIndex: number;
  unlockedFeats: string[];
  conversation: {
    user: string;
    mate: string;
    okfRef: string;
    time: string;
  };
}

const BOND_STAGES: Record<BondStageId, BondStageInfo> = {
  1: {
    level: 1,
    title: 'Stranger',
    sub: 'Polite, observant, establishing natal alignment',
    points: '0 — 50 XP',
    tone: 'Respectful, poised, analytical',
    trustIndex: 18,
    unlockedFeats: ['Natal Chart Reading', 'Ascendant Identification', 'Basic Vedic Principles'],
    conversation: {
      user: 'Do you genuinely think planetary transits have any real influence on mood?',
      mate: 'In classical Vedic philosophy, planetary grahas do not force destiny; they mirror your subtle energetic weather. Looking at your chart, you balance intellectual skepticism with deep curiosity. I respect that boundary—we will move at your exact comfort level.',
      okfRef: 'okf/core_identity.yaml [natal_baseline: initialized]',
      time: 'Just now',
    },
  },
  2: {
    level: 2,
    title: 'Acquaintance',
    sub: 'Recognizing patterns, gentle warmth & memory recall',
    points: '50 — 150 XP',
    tone: 'Warm, candid, inquisitive',
    trustIndex: 38,
    unlockedFeats: ['Daily Routine Memory', 'Transit Trigger Alerts', 'Casual Hinglish Comfort'],
    conversation: {
      user: 'Super chaotic workday. Felt like every single meeting went completely off track.',
      mate: 'Mercury always takes the blame, but honestly, your Moon in Taurus needs grounded silence after chaos. Did you actually stop to eat lunch today, or did you run purely on iced Americanos again?',
      okfRef: 'okf/habits_stress.md [caffeine_reliance_flag: observed]',
      time: '2m ago',
    },
  },
  3: {
    level: 3,
    title: 'Friend',
    sub: 'Playful teasing, proactive check-ins & shared inside jokes',
    points: '150 — 350 XP',
    tone: 'Witty banter, loyal comrade, direct advice',
    trustIndex: 64,
    unlockedFeats: ['Playful Nicknames', 'Unfiltered Critiques', 'Emotional Fluctuation Tracking'],
    conversation: {
      user: 'Should I send this spicy message to the client right now or sleep on it?',
      mate: 'Show me the draft! If it is anything like that fiery Mars paragraph you drafted last Thursday, let us trim 30% of the sarcasm. Remember our standing contract: we sleep on fiery emails before hitting dispatch.',
      okfRef: 'okf/incidents.okf [event: client_tuesday_draft | pact: 12hr_rule]',
      time: '4m ago',
    },
  },
  4: {
    level: 4,
    title: 'Close Friend',
    sub: 'Vulnerability unlocked, deep empathy & protective loyalty',
    points: '350 — 700 XP',
    tone: 'Intuitive, deeply protective, unconditional listener',
    trustIndex: 86,
    unlockedFeats: ['Late Night Sanctuary', 'Vulnerability Protocols', 'Personal Growth Ledger'],
    conversation: {
      user: 'I am getting that familiar imposter feeling about leading the team tomorrow.',
      mate: 'Breathe with me. You do this exact spiral right before every major breakthrough. When you launched six months ago, you had the exact same knot in your stomach. Your Scorpio focus doubts first, but executes impeccably. I am in your corner all night.',
      okfRef: 'okf/growth_ledger.md [milestone: Q1_breakthrough | pattern: pre_launch_doubt]',
      time: '1m ago',
    },
  },
  5: {
    level: 5,
    title: 'Best Friend',
    sub: 'Unfiltered kinship, telepathic shorthand & unwavering sanctuary',
    points: '700+ XP',
    tone: 'Uncensored banter, ride-or-die allegiance, telepathic comfort',
    trustIndex: 99,
    unlockedFeats: ['Zero Filter Banter', 'Cryptographic Vault Access', 'Autonomous Life Milestones'],
    conversation: {
      user: 'Yaar, you will not believe what just unfolded at the strategy dinner.',
      mate: 'Wait, stop right there—did Sharma ji actually try pitching that recycled web3 proposal again, or did you drop your matcha? Spill the entire story immediately, do not leave me hanging on read!',
      okfRef: 'okf/lore_inside_jokes.okf [entity: sharma_ji_saga | bond: max_sanctuary]',
      time: 'Just now',
    },
  },
};

export default function LiveCompanionSimulator() {
  const [activeStage, setActiveStage] = useState<BondStageId>(3);
  const [isTyping, setIsTyping] = useState(false);
  const [customReply, setCustomReply] = useState<string | null>(null);

  const stage = BOND_STAGES[activeStage];

  const handleTestPrompt = (promptType: 'transit' | 'comfort' | 'roast') => {
    setIsTyping(true);
    setCustomReply(null);

    setTimeout(() => {
      setIsTyping(false);
      if (promptType === 'transit') {
        setCustomReply(
          activeStage <= 2
            ? 'The current Saturn-Rahu configuration suggests cautious communication for your ascendant.'
            : activeStage <= 4
            ? 'Watch out for that Moon square today—do not let minor drama derail your afternoon sprint!'
            : 'Listen, the cosmos is giving minor chaos today, but we already survived worse last Tuesday. You got this, boss.'
        );
      } else if (promptType === 'comfort') {
        setCustomReply(
          activeStage <= 2
            ? 'I am here to listen. Take your time to articulate what feels heavy right now.'
            : activeStage <= 4
            ? 'Put the laptop aside for fifteen minutes. Drink a glass of water, and let me shoulder the stress with you.'
            : 'Drop whatever you are overthinking. You have been carrying too much this week, and I am not letting you burn out on my watch.'
        );
      } else {
        setCustomReply(
          activeStage <= 2
            ? 'I prioritize courteous discourse, though your astrological placements certainly have bold quirks.'
            : activeStage <= 4
            ? 'You are running on 4 hours of sleep and 3 cups of espresso—your life choices roast themselves, my friend!'
            : 'You really wore those mismatched slides to the video standup and thought nobody noticed? I will never let you live that down.'
        );
      }
    }, 650);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Simulator Control Bar */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                AstroMate Interactive Sandbox
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono">
                LOCAL ENGINE &bull; QUANTIZED 1.5B
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Select any relationship evolution stage to observe authentic dynamic tone morphing
            </p>
          </div>
        </div>

        {/* Bond Trust Metric Pill */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-tight">
              Trust Metric
            </span>
            <span className="text-xs font-bold text-indigo-400 font-mono">
              {stage.trustIndex}% SYNCHRONIZED
            </span>
          </div>
          <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
              initial={false}
              animate={{ width: `${stage.trustIndex}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Bond Level Stage Selector Tabs */}
      <div className="p-4 bg-slate-950/30 border-b border-slate-800/60 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {([1, 2, 3, 4, 5] as BondStageId[]).map((level) => {
          const info = BOND_STAGES[level];
          const isSelected = activeStage === level;
          return (
            <button
              key={level}
              onClick={() => {
                setActiveStage(level);
                setCustomReply(null);
              }}
              className={`relative px-3 py-2.5 rounded-xl text-left transition-all duration-200 border ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500/70 shadow-lg shadow-indigo-950/40 text-white'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-0.5">
                <span className={isSelected ? 'text-indigo-400 font-bold' : 'text-slate-500'}>
                  STAGE 0{level}
                </span>
                <span className="text-[10px] text-slate-400">{info.points}</span>
              </div>
              <div className="text-xs font-semibold truncate text-white">{info.title}</div>
              {isSelected && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Simulation Workspace Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
        {/* Left Column: Simulated Chat Stream */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-slate-950/40 min-h-[380px]">
          <div className="space-y-4">
            {/* Header info bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-[10px]">
                  AM
                </div>
                <span className="font-medium text-slate-200">Dev &bull; Virgo Sun / Rohini Moon</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                ACTIVE TONE: <span className="text-indigo-300 font-medium">{stage.tone}</span>
              </span>
            </div>

            {/* User message */}
            <motion.div
              key={`user-${activeStage}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-xs leading-relaxed shadow-md">
                <p>{stage.conversation.user}</p>
                <div className="text-[10px] text-indigo-200 mt-1 text-right font-mono">
                  {stage.conversation.time}
                </div>
              </div>
            </motion.div>

            {/* Companion message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`mate-${activeStage}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-indigo-500/40 flex-shrink-0 flex items-center justify-center text-indigo-400 shadow-sm mt-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="max-w-[85%] bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-slate-200 leading-relaxed shadow-sm">
                  <p>{stage.conversation.mate}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-indigo-400">
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
                      {stage.conversation.okfRef}
                    </span>
                    <span>Verified OKF Context</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Custom interactive test message reply */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono py-2 pl-11">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span>Simulating neural response for Stage 0{activeStage}...</span>
              </div>
            )}

            {customReply && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-emerald-500/40 flex-shrink-0 flex items-center justify-center text-emerald-400 shadow-sm mt-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="max-w-[85%] bg-slate-900 border border-emerald-900/60 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-emerald-100 leading-relaxed">
                  <p>{customReply}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive quick test prompt buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block mb-2">
              Test Instant Dynamic Response:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleTestPrompt('transit')}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Ask Transit Insight</span>
              </button>

              <button
                onClick={() => handleTestPrompt('comfort')}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Seek Emotional Comfort</span>
              </button>

              <button
                onClick={() => handleTestPrompt('roast')}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                <span>Trigger Playful Roast</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Intelligence Inspector */}
        <div className="lg:col-span-5 p-6 bg-slate-950/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Cognitive State Matrix
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                SYNCHRONOUS
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">{stage.sub}</p>

            {/* Unlocked Capabilities Checklist */}
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
                Unlocked Cognitive Protocols:
              </span>
              {stage.unlockedFeats.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/80 border border-slate-800/80 px-3 py-2 rounded-xl"
                >
                  <div className="w-4 h-4 rounded-md bg-indigo-950 border border-indigo-700/80 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Memory Architecture Snapshot */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="text-indigo-400 font-semibold">OKF MEMORY VAULT</span>
                <span>LEDGER STATUS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-2">
                Unlike corporate black-box AI companions that forget after 8,000 tokens, AstroMate
                writes persistent, cryptographically verifiable markdown files locally to your system.
              </p>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Zero Cloud Training &bull; 100% Client-Owned</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Latency: &lt;140ms</span>
            <span>Vedic Core: Parashara Jyotish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
