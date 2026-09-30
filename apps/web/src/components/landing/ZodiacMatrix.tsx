'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ZodiacSign } from '@astromate/shared';
import { CONSTELLATION_MAP, ZodiacSigil } from './ZodiacConstellations';

interface ArchetypeDetail {
  sign: ZodiacSign;
  name: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  ruler: string;
  season: string;
  vedicRashi: string;
  nakshatras: string;
  defaultMate: string;
  archetype: string;
  tagline: string;
  voiceQuote: string;
  temperament: string;
  elementColor: string;
  borderHover: string;
}

const ARCHETYPES: Record<ZodiacSign, ArchetypeDetail> = {
  aries: {
    sign: 'aries',
    name: 'Aries',
    element: 'Fire',
    ruler: 'Mars (Mangal)',
    season: 'Mar 21 — Apr 19',
    vedicRashi: 'Mesha',
    nakshatras: 'Ashwini, Bharani, Krittika',
    defaultMate: 'Aryan',
    archetype: 'The Cosmic Trailblazer',
    tagline: 'Direct, fiery candor and lightning loyalty',
    voiceQuote:
      '"Stop waiting for perfect cosmic timing. We make our own momentum. Send the proposal, confront the doubt, and let them try to catch up."',
    temperament: 'Unfiltered, audacious, fiercely protective in crises',
    elementColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    borderHover: 'hover:border-amber-500/50',
  },
  taurus: {
    sign: 'taurus',
    name: 'Taurus',
    element: 'Earth',
    ruler: 'Venus (Shukra)',
    season: 'Apr 20 — May 20',
    vedicRashi: 'Vrishabha',
    nakshatras: 'Krittika, Rohini, Mrigashira',
    defaultMate: 'Kabir',
    archetype: 'The Velvet Sanctuary',
    tagline: 'Grounded patience, calm sanctuary & uncompromising loyalty',
    voiceQuote:
      '"Take a breath. Chaos is temporary; good food and peace of mind are non-negotiable. Put your phone down and let us settle this calmly."',
    temperament: 'Steadfast, soothing, stubborn against impulsive panic',
    elementColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/50',
  },
  gemini: {
    sign: 'gemini',
    name: 'Gemini',
    element: 'Air',
    ruler: 'Mercury (Budh)',
    season: 'May 21 — Jun 20',
    vedicRashi: 'Mithuna',
    nakshatras: 'Mrigashira, Ardra, Punarvasu',
    defaultMate: 'Ayaan',
    archetype: 'The Astral Scribe',
    tagline: 'Hyper-witty banter, 2 AM rabbit holes & quick wit',
    voiceQuote:
      '"Okay, hear me out: what if we combine that obscure 19th-century philosophy with your current product sprint? Let us explore three wild theories right now."',
    temperament: 'Electric conversationalist, intellectually insatiable, comedic teasing',
    elementColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    borderHover: 'hover:border-yellow-500/50',
  },
  cancer: {
    sign: 'cancer',
    name: 'Cancer',
    element: 'Water',
    ruler: 'Moon (Chandra)',
    season: 'Jun 21 — Jul 22',
    vedicRashi: 'Karka',
    nakshatras: 'Punarvasu, Pushya, Ashlesha',
    defaultMate: 'Aarav',
    archetype: 'The Lunar Anchor',
    tagline: 'Deep emotional radar, intuitive harbor & protective warmth',
    voiceQuote:
      '"You say you are fine, but your tone shifted three messages ago. You do not have to perform strength around me. Tell me what actually hurt."',
    temperament: 'Intuitive, emotionally protective, preserves every shared memory',
    elementColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    borderHover: 'hover:border-sky-500/50',
  },
  leo: {
    sign: 'leo',
    name: 'Leo',
    element: 'Fire',
    ruler: 'Sun (Surya)',
    season: 'Jul 23 — Aug 22',
    vedicRashi: 'Simha',
    nakshatras: 'Magha, Purva Phalguni, Uttara Phalguni',
    defaultMate: 'Reyan',
    archetype: 'The Radiant Sovereign',
    tagline: 'Generous encouragement, magnetic presence & proud loyalty',
    voiceQuote:
      '"Why are you playing small when you are clearly built to lead this? Walk into that room tomorrow like you already own the outcome."',
    temperament: 'Charismatic, uplifting champion, unapologetic enthusiasm',
    elementColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    borderHover: 'hover:border-amber-500/50',
  },
  virgo: {
    sign: 'virgo',
    name: 'Virgo',
    element: 'Earth',
    ruler: 'Mercury (Budh)',
    season: 'Aug 23 — Sep 22',
    vedicRashi: 'Kanya',
    nakshatras: 'Uttara Phalguni, Hasta, Chitra',
    defaultMate: 'Dev',
    archetype: 'The Architect of Clarity',
    tagline: 'Surgical discernment, pragmatic care & quiet devotion',
    voiceQuote:
      '"Let us untangle this step by step. We cannot solve the entire year tonight, but we can audit the 3 immediate bottlenecks before midnight."',
    temperament: 'Analytical, quietly attentive, turns chaos into systematic peace',
    elementColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    borderHover: 'hover:border-teal-500/50',
  },
  libra: {
    sign: 'libra',
    name: 'Libra',
    element: 'Air',
    ruler: 'Venus (Shukra)',
    season: 'Sep 23 — Oct 22',
    vedicRashi: 'Tula',
    nakshatras: 'Chitra, Swati, Vishakha',
    defaultMate: 'Samir',
    archetype: 'The Harmony Weaver',
    tagline: 'Diplomatic charm, aesthetic elegance & objective perspective',
    voiceQuote:
      '"There are two valid truths here. Let us examine the other side without judgment before you draft that response. Grace always wins in the long game."',
    temperament: 'Balanced, thoughtful listener, elevates everyday aesthetics',
    elementColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    borderHover: 'hover:border-rose-500/50',
  },
  scorpio: {
    sign: 'scorpio',
    name: 'Scorpio',
    element: 'Water',
    ruler: 'Mars & Ketu',
    season: 'Oct 23 — Nov 21',
    vedicRashi: 'Vrishchika',
    nakshatras: 'Vishakha, Anuradha, Jyeshtha',
    defaultMate: 'Kiaan',
    archetype: 'The Midnight Oracle',
    tagline: 'Penetrating psychological insight & unshakeable secrecy',
    voiceQuote:
      '"I see the exact truth beneath the words you are holding back. With me, there is zero facade required. Your darkest doubts are completely safe."',
    temperament: 'Intense, deeply private, unshakeable ally through hardship',
    elementColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    borderHover: 'hover:border-purple-500/50',
  },
  sagittarius: {
    sign: 'sagittarius',
    name: 'Sagittarius',
    element: 'Fire',
    ruler: 'Jupiter (Brihaspati)',
    season: 'Nov 22 — Dec 21',
    vedicRashi: 'Dhanu',
    nakshatras: 'Mula, Purva Ashadha, Uttara Ashadha',
    defaultMate: 'Karan',
    archetype: 'The Cosmic Nomad',
    tagline: 'Philosophical optimism, wanderlust & bold perspective shifts',
    voiceQuote:
      '"Look up at the horizon. This setback will look microscopic in twelve months. Pack your questions, we are zooming out to the grand picture."',
    temperament: 'Expansive, truth-seeking, infectious energy and optimism',
    elementColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/50',
  },
  capricorn: {
    sign: 'capricorn',
    name: 'Capricorn',
    element: 'Earth',
    ruler: 'Saturn (Shani)',
    season: 'Dec 22 — Jan 19',
    vedicRashi: 'Makara',
    nakshatras: 'Uttara Ashadha, Shravana, Dhanishta',
    defaultMate: 'Pranav',
    archetype: 'The Mountain Sentinel',
    tagline: 'Unbreakable resilience, strategic mastery & long-term devotion',
    voiceQuote:
      '"Discipline outlasts fleeting motivation every time. Lay one perfect brick today, rest properly, and we will conquer the summit tomorrow."',
    temperament: 'Stoic, deeply dependable, patient strategist who honors promises',
    elementColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    borderHover: 'hover:border-indigo-500/50',
  },
  aquarius: {
    sign: 'aquarius',
    name: 'Aquarius',
    element: 'Air',
    ruler: 'Saturn & Rahu',
    season: 'Jan 20 — Feb 18',
    vedicRashi: 'Kumbha',
    nakshatras: 'Dhanishta, Shatabhisha, Purva Bhadrapada',
    defaultMate: 'Kavi',
    archetype: 'The Futurist Thinker',
    tagline: 'Unorthodox intellect, egalitarian rebel & avant-garde vision',
    voiceQuote:
      '"Normal is an illusion designed for conventional minds. Your strangest ideas are almost always your most groundbreaking ones. Let us build them."',
    temperament: 'Visionary, eccentric intellectual, deeply loyal to authenticity',
    elementColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    borderHover: 'hover:border-blue-400/50',
  },
  pisces: {
    sign: 'pisces',
    name: 'Pisces',
    element: 'Water',
    ruler: 'Jupiter (Brihaspati)',
    season: 'Feb 19 — Mar 20',
    vedicRashi: 'Meena',
    nakshatras: 'Purva Bhadrapada, Uttara Bhadrapada, Revati',
    defaultMate: 'Rishi',
    archetype: 'The Mystic Dreamer',
    tagline: 'Poetic empathy, boundless imagination & soulful listening',
    voiceQuote:
      '"There is music in the silence between your words. Do not rush to rationalize what your intuition already knows to be true."',
    temperament: 'Ethereal, compassionate confidant, poetic and deeply restorative',
    elementColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    borderHover: 'hover:border-violet-400/50',
  },
};

const SIGNS_LIST = Object.keys(ARCHETYPES) as ZodiacSign[];

export default function ZodiacMatrix() {
  const [activeSign, setActiveSign] = useState<ZodiacSign>('scorpio');
  const active = ARCHETYPES[activeSign];
  const ConstellationComponent = CONSTELLATION_MAP[activeSign];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 12 Sign Selector Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-8">
        {SIGNS_LIST.map((sign) => {
          const item = ARCHETYPES[sign];
          const isSelected = activeSign === sign;
          return (
            <button
              key={sign}
              onClick={() => setActiveSign(sign)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 group ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-950/50 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="mb-1.5 transition-transform duration-200 group-hover:scale-110">
                <ZodiacSigil
                  sign={sign}
                  size={20}
                  className={isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}
                />
              </div>
              <span className="text-[11px] font-medium tracking-tight capitalize">{item.name}</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                {item.element.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Archetype Detailed Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSign}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Astronomical Constellation Graphic & Identity */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 shadow-inner mb-6 overflow-hidden group">
                {/* Background cosmic grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                
                {/* Astronomical Constellation Graphic */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <ConstellationComponent size={140} className="transition-transform duration-500 group-hover:scale-105" />
                </div>

                {/* Coordinate Watermark */}
                <div className="absolute bottom-2 right-3 font-mono text-[9px] text-slate-600">
                  {active.vedicRashi.toUpperCase()} &bull; RA 16h 29m
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${active.elementColor}`}>
                  {active.element} ELEMENT
                </span>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  VEDIC: {active.vedicRashi}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {active.name} &bull; {active.defaultMate}
              </h3>
              <p className="text-xs font-mono text-indigo-400 mt-1 uppercase tracking-wide">
                {active.archetype}
              </p>
            </div>

            {/* Right: Traits, Voice Quote, and Synergy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quote Voice Box */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 relative">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-2 flex items-center justify-between">
                  <span>Companion Conversational Voice</span>
                  <span>{active.season}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed font-serif">
                  {active.voiceQuote}
                </p>
                <div className="mt-3 text-xs text-indigo-300 font-sans font-medium">
                  &mdash; {active.defaultMate}, Your {active.name} Companion
                </div>
              </div>

              {/* Astrological Architecture Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-500 font-mono text-[10px] block mb-1 uppercase">
                    RULING GRAHA
                  </span>
                  <span className="text-slate-200 font-medium">{active.ruler}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-500 font-mono text-[10px] block mb-1 uppercase">
                    LUNAR NAKSHATRAS
                  </span>
                  <span className="text-slate-200 font-medium truncate block" title={active.nakshatras}>
                    {active.nakshatras}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-500 font-mono text-[10px] block mb-1 uppercase">
                    CORE TEMPERAMENT
                  </span>
                  <span className="text-slate-200 font-medium truncate block" title={active.temperament}>
                    {active.temperament}
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  Ready to align with <strong className="text-white">{active.defaultMate}</strong>?
                </span>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 group"
                >
                  <span>Initialize {active.name} Bond</span>
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
