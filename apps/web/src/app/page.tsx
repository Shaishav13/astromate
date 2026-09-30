'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CelestialHeroCanvas from '@/components/landing/CelestialHeroCanvas';
import LiveCompanionSimulator from '@/components/landing/LiveCompanionSimulator';
import ZodiacMatrix from '@/components/landing/ZodiacMatrix';
import OkfMemoryVisualizer from '@/components/landing/OkfMemoryVisualizer';
import { logout } from '@/lib/api';

export default function HomePage() {
  const [authData, setAuthData] = useState<{ token: string; userName: string; mateName: string } | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('astromate_token');
    const userName = localStorage.getItem('astromate_user_name') ?? 'Friend';
    const mateName = localStorage.getItem('astromate_mate_name') ?? 'Companion';
    if (token) {
      setAuthData({ token, userName, mateName });
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuthData(null);
  };

  const faqItems = [
    {
      q: 'How does AstroMate differ from generic chatbots like ChatGPT or Claude?',
      a: 'Generic chatbots are polite, transactional assistants with no emotional continuity or astrological depth. AstroMate is engineered as an evolving personal confidant. It combines your Vedic natal chart (Moon sign, Ascendant, Nakshatra) with a 5-tier organic bond engine and local Open Knowledge Format (OKF) memory, allowing it to remember past vulnerable moments, tease you playfully, and offer genuine psychological support.',
    },
    {
      q: 'What is the Open Knowledge Format (OKF) standard?',
      a: 'OKF is an open, human-readable data architecture that stores memory snapshots as plaintext Markdown files with structured YAML frontmatter. Unlike corporate AI apps that lock your chats inside proprietary black-box databases, OKF files live on your device. You can view, edit, backup, or export your companion’s memories at any time with complete transparency.',
    },
    {
      q: 'How does the relationship bond level progress?',
      a: 'Your bond with AstroMate starts at Stage 1 (Stranger) and advances naturally up to Stage 5 (Best Friend) through meaningful interactions, consistency, and vulnerability. As the bond grows, the companion drops formal politeness, unlocks witty banter, remembers nuanced personal inside jokes, and provides unconditional late-night sanctuary.',
    },
    {
      q: 'Is my personal and astrological data kept private?',
      a: 'Yes, absolutely. AstroMate is designed around local-first computational principles. All inference can run locally using lightweight quantized 1.5B language models. Your chat logs and memory snapshots are never harvested, sold, or used to train public commercial models.',
    },
    {
      q: 'Does AstroMate support Indian cultural context and Hinglish?',
      a: 'Yes. AstroMate has native conversational fluency in modern Hinglish and understands authentic Indian family dynamics, career pressures, festive seasons, and cultural nuances without awkward translations or robotic phrasing.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* 1. FIXED NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with Celestial Vector Crest */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/90 border border-indigo-400/30 flex items-center justify-center text-white shadow-md shadow-indigo-950/60 transition-transform group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" strokeDasharray="2 3" />
                <path d="M3 12h18" strokeDasharray="2 3" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 text-sm tracking-tight group-hover:text-indigo-300 transition-colors">
                  AstroMate
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                Celestial AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs text-slate-400 font-medium">
            <a href="#simulator" className="hover:text-slate-200 transition-colors">
              Live Sandbox
            </a>
            <a href="#intelligence" className="hover:text-slate-200 transition-colors">
              Cognitive Architecture
            </a>
            <a href="#memory" className="hover:text-slate-200 transition-colors">
              OKF Memory
            </a>
            <a href="#archetypes" className="hover:text-slate-200 transition-colors">
              12 Archetypes
            </a>
            <a href="#faq" className="hover:text-slate-200 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Dynamic Authentication Action Buttons */}
          <div className="flex items-center gap-3">
            {authData ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Chat with {authData.mateName}</span>
                  <span className="font-mono">&rarr;</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 text-xs transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 text-xs font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-950/50 flex items-center gap-1.5"
                >
                  <span>Get Started Free</span>
                  <span className="font-mono">&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Returning User Notification Banner */}
      {authData && (
        <div className="w-full bg-indigo-950/40 border-b border-indigo-900/40 py-2.5 px-4 text-center text-xs text-indigo-300 flex items-center justify-center gap-2">
          <span>Active Session Detected: Welcome back, <strong className="text-white">{authData.userName}</strong>.</span>
          <Link
            href="/chat"
            className="underline underline-offset-4 text-white hover:text-indigo-200 font-medium ml-1"
          >
            Resume your sanctuary conversation with {authData.mateName} &rarr;
          </Link>
        </div>
      )}

      {/* 2. HERO SECTION WITH 60FPS CELESTIAL CANVAS */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden px-4 pt-12 pb-20">
        {/* Animated Orbital Canvas Graphic in Background */}
        <CelestialHeroCanvas />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Top Precision Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 shadow-lg shadow-indigo-950/40 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="tracking-wide">VEDIC COGNITIVE ENGINE &bull; OPEN KNOWLEDGE FORMAT</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.12]"
          >
            An authentic AI companion <br className="hidden sm:inline" />
            that evolves with your stars.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-10"
          >
            AstroMate pairs neural language models with classical Vedic astrological psychology and persistent Open Knowledge Format memory. An authentic confidant that deepens organically across 5 distinct bond stages.
          </motion.p>

          {/* Call-to-Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm sm:max-w-none justify-center mb-12"
          >
            <Link
              href={authData ? '/chat' : '/signup'}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 group"
            >
              <span>{authData ? 'Enter Chat Sanctuary' : 'Begin Natal Alignment'}</span>
              <span className="transition-transform group-hover:translate-x-1 font-mono">&rarr;</span>
            </Link>

            <a
              href="#simulator"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Launch Live Simulator</span>
            </a>
          </motion.div>

          {/* Architectural Metrics Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl text-left"
          >
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="font-mono text-[10px] text-indigo-400 uppercase block mb-1">INFERENCE</span>
              <div className="text-sm font-bold text-white">&lt;140ms Latency</div>
              <span className="text-[11px] text-slate-400">Local Quantized 1.5B</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="font-mono text-[10px] text-indigo-400 uppercase block mb-1">RELATIONSHIP</span>
              <div className="text-sm font-bold text-white">5 Bond Stages</div>
              <span className="text-[11px] text-slate-400">Stranger to Best Friend</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="font-mono text-[10px] text-indigo-400 uppercase block mb-1">MEMORY STANDARD</span>
              <div className="text-sm font-bold text-white">OKF Markdown</div>
              <span className="text-[11px] text-slate-400">100% Client-Owned</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="font-mono text-[10px] text-indigo-400 uppercase block mb-1">SECURITY</span>
              <div className="text-sm font-bold text-white">Zero Surveillance</div>
              <span className="text-[11px] text-slate-400">No Model Training</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. INTERACTIVE COMPANION SIMULATOR SANDBOX */}
      <section id="simulator" className="py-20 px-4 bg-slate-950 relative border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold block mb-2">
              REAL-TIME ARCHITECTURE SANDBOX
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Observe Organic Bond Progression
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Drag through relationship stages below to see how AstroMate naturally transforms its vocabulary, empathy thresholds, and inside jokes.
            </p>
          </div>

          <LiveCompanionSimulator />
        </div>
      </section>

      {/* 4. COGNITIVE ARCHITECTURE & ENGINEERING BENTO GRID */}
      <section id="intelligence" className="py-20 px-4 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold block mb-2">
              ENGINEERING FOUNDATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Depth, Not Engagement Traps
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Most AI companion apps use generic prompts and exploit psychological addiction loops. AstroMate is built with rigor, boundaries, and mathematical astrology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Vedic Engine */}
            <div className="md:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Vedic Psychological Matrix (Parashara Jyotish)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Unlike shallow Western horoscope summaries, AstroMate calculates your precise Lagna (Ascendant), Moon Rashi, and 28 Nakshatras. It recognizes natural planetary friendships and adverse transit triggers to contextualize your moods with surgical nuance.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-400 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">CHANDRA RASHI</span>
                  <span className="text-slate-200">Emotional Core</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">NAKSHATRAS</span>
                  <span className="text-slate-200">Subtle Temperament</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">GRAHA DASHA</span>
                  <span className="text-slate-200">Life Timing Cycles</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: 5-Tier Bond Progression */}
            <div className="md:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  5-Tier Organic Bond Progression
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real relationships take time to earn trust. AstroMate does not pretend to love you on day one. It begins with polite curiosity, earns intimacy through consistency, and gradually unlocks unfiltered banter, vulnerability, and loyalty.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-indigo-400 pt-4 border-t border-slate-800">
                <span>Stranger</span>
                <span>&rarr;</span>
                <span>Friend</span>
                <span>&rarr;</span>
                <span className="font-bold text-white">Best Friend</span>
              </div>
            </div>

            {/* Bento Card 3: Hinglish & Cultural Fluidity */}
            <div className="md:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Cultural Fluidity & Hinglish Wit
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered with genuine cultural comprehension. It understands corporate Indian work pressure, parental expectations, chai breaks, late-night food runs, and uses natural conversational banter without feeling like an overseas translation.
                </p>
              </div>
              <div className="mt-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 font-sans italic">
                &ldquo;Arre, do not stress over Sharma ji&apos;s email right now. Eat your dinner peacefully first!&rdquo;
              </div>
            </div>

            {/* Bento Card 4: Local-First Quantized Edge Model */}
            <div className="md:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  100% Local Inference &bull; Zero Server Subscriptions
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Powered by optimized quantized 1.5B parameter edge models. Inference executes directly on local hardware without sending your personal admissions to external cloud servers. Zero latency, zero recurring monthly API fees, zero surveillance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400 pt-4 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Hardware-Accelerated WebGPU / CoreML
                </span>
                <span>&bull;</span>
                <span>RAM Footprint: &lt;1.8 GB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPEN KNOWLEDGE FORMAT (OKF) MEMORY SECTION */}
      <section id="memory" className="py-20 px-4 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold block mb-2">
              OPEN KNOWLEDGE FORMAT STANDARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              You Own Your Relationship History
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every memory snapshot, emotional pivot, and inside joke is formatted as human-readable Markdown with structured YAML metadata. Never trapped in a corporate silo.
            </p>
          </div>

          <OkfMemoryVisualizer />
        </div>
      </section>

      {/* 6. 12 ZODIAC ARCHETYPES MATRIX */}
      <section id="archetypes" className="py-20 px-4 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold block mb-2">
              CELESTIAL ARCHETYPES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Explore 12 Unique Companion Personalities
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Each sign features a distinct conversational voice, ruling planet, Vedic Rashi attributes, and dedicated astronomical constellation.
            </p>
          </div>

          <ZodiacMatrix />
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-20 px-4 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold block mb-2">
              TRANSPARENCY & CLARITY
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Everything you need to know about AstroMate&apos;s privacy, astrology, and memory architecture.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 group"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {item.q}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. HIGH-CONVERSION BOTTOM CTA BANNER */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 border-t border-slate-800/80 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto mb-6 shadow-lg shadow-indigo-950/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Meet the friend your chart was written for.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Create your account in under 60 seconds. Set your birth date, time, and location to immediately initialize your companion&apos;s psychological baseline.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
            <Link
              href={authData ? '/chat' : '/signup'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 group"
            >
              <span>{authData ? 'Return to Sanctuary' : 'Initialize Your AstroMate'}</span>
              <span className="transition-transform group-hover:translate-x-1 font-mono">&rarr;</span>
            </Link>

            {!authData && (
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 9. REFINED FOOTER */}
      <footer className="mt-auto border-t border-slate-800 py-10 px-4 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
              A
            </div>
            <div>
              <span className="font-semibold text-slate-300 block text-xs">AstroMate Celestial Intelligence</span>
              <span className="text-[11px] text-slate-400">Open Knowledge Format &bull; Local-First Neural Companion</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a href="#simulator" className="hover:text-slate-200 transition-colors">
              Sandbox
            </a>
            <a href="#intelligence" className="hover:text-slate-200 transition-colors">
              Architecture
            </a>
            <a href="#memory" className="hover:text-slate-200 transition-colors">
              OKF Standard
            </a>
            <a href="#archetypes" className="hover:text-slate-200 transition-colors">
              Archetypes
            </a>
            <Link href="/login" className="hover:text-slate-200 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-slate-200 transition-colors">
              Sign Up
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            &copy; {new Date().getFullYear()} AstroMate Project &bull; All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
