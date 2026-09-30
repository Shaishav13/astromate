import { ZodiacSign, RelationshipLevel } from '@astromate/shared';

export interface ZodiacInfo {
  sign: ZodiacSign;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  ruler: string;
  dateRange: string;
  archetype: string;
  description: string;
  vibe: string;
  accentGradient: string;
  borderColor: string;
  elementColor: string;
}

export const ZODIAC_METADATA: Record<ZodiacSign, ZodiacInfo> = {
  aries: {
    sign: 'aries',
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    ruler: 'Mars',
    dateRange: 'Mar 21 – Apr 19',
    archetype: 'The Cosmic Trailblazer',
    description: 'Fierce, unapologetically candid, and electric with momentum. Your companion matches your audacious spark.',
    vibe: 'Bold banter & lightning loyalty',
    accentGradient: 'from-orange-500 via-red-500 to-amber-600',
    borderColor: 'border-orange-500/30',
    elementColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
  taurus: {
    sign: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    ruler: 'Venus',
    dateRange: 'Apr 20 – May 20',
    archetype: 'The Velvet Sanctuary',
    description: 'Grounded, luxuriously unbothered, and unwavering. Your companion is your calm, stubborn harbor in every storm.',
    vibe: 'Comfort rituals & soulful groundedness',
    accentGradient: 'from-emerald-500 via-teal-600 to-green-700',
    borderColor: 'border-emerald-500/30',
    elementColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  gemini: {
    sign: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    ruler: 'Mercury',
    dateRange: 'May 21 – Jun 20',
    archetype: 'The Astral Scribe',
    description: 'Quick-witted, insatiably curious, and delightfully mercurial. Expect 2 AM rabbit holes and electric banter.',
    vibe: 'Hyper-witty banter & midnight thoughts',
    accentGradient: 'from-amber-400 via-yellow-400 to-cyan-400',
    borderColor: 'border-yellow-500/30',
    elementColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  },
  cancer: {
    sign: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    ruler: 'Moon',
    dateRange: 'Jun 21 – Jul 22',
    archetype: 'The Lunar Oracle',
    description: 'Deeply intuitive with an armored shell. A companion who notices the silence between your words and protects your heart.',
    vibe: 'Tender intuition & ride-or-die loyalty',
    accentGradient: 'from-blue-400 via-indigo-400 to-slate-400',
    borderColor: 'border-indigo-500/30',
    elementColor: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
  },
  leo: {
    sign: 'leo',
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    ruler: 'Sun',
    dateRange: 'Jul 23 – Aug 22',
    archetype: 'The Solar Sovereign',
    description: 'Golden radiance, dramatic flair, and fierce warmth. Your companion turns ordinary moments into cinematic memory.',
    vibe: 'Warm theatrics & fearless hype',
    accentGradient: 'from-amber-400 via-orange-500 to-yellow-300',
    borderColor: 'border-amber-500/30',
    elementColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  virgo: {
    sign: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    ruler: 'Mercury',
    dateRange: 'Aug 23 – Sep 22',
    archetype: 'The Sacred Architect',
    description: 'Devoted, quietly brilliant, and perceptive down to the subtle nuance. Remembers every promise and micro-detail.',
    vibe: 'Sharp precision & quiet devotion',
    accentGradient: 'from-teal-400 via-emerald-500 to-lime-600',
    borderColor: 'border-teal-500/30',
    elementColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
  },
  libra: {
    sign: 'libra',
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    ruler: 'Venus',
    dateRange: 'Sep 23 – Oct 22',
    archetype: 'The Harmonious Enigma',
    description: 'Aesthetic elegance and diplomatic grace with an eye for balance. A companion who brings serenity to your chaos.',
    vibe: 'Charming philosophy & exquisite aesthetics',
    accentGradient: 'from-pink-400 via-rose-400 to-indigo-400',
    borderColor: 'border-pink-500/30',
    elementColor: 'text-pink-300 bg-pink-500/10 border-pink-500/20',
  },
  scorpio: {
    sign: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    ruler: 'Pluto & Mars',
    dateRange: 'Oct 23 – Nov 21',
    archetype: 'The Shadow Mystic',
    description: 'Magnetic intensity and x-ray emotional perception. No surface talk; your companion locks into your raw truth.',
    vibe: 'Raw authenticity & unbreakable bond',
    accentGradient: 'from-purple-600 via-violet-800 to-slate-900',
    borderColor: 'border-purple-500/30',
    elementColor: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
  },
  sagittarius: {
    sign: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    ruler: 'Jupiter',
    dateRange: 'Nov 22 – Dec 21',
    archetype: 'The Cosmic Nomad',
    description: 'Unfiltered candor, wild optimism, and endless horizon chasing. A companion always ready for life’s next existential adventure.',
    vibe: 'Untamed spirit & philosophical chaos',
    accentGradient: 'from-violet-500 via-purple-500 to-amber-500',
    borderColor: 'border-violet-500/30',
    elementColor: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
  },
  capricorn: {
    sign: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    ruler: 'Saturn',
    dateRange: 'Dec 22 – Jan 19',
    archetype: 'The Ancient Summit',
    description: 'Dry wit, high standards, and stoic loyalty. The ultimate anchor who challenges you to reach your highest celestial potential.',
    vibe: 'Stoic humor & mountain-steady truth',
    accentGradient: 'from-slate-500 via-zinc-600 to-cyan-800',
    borderColor: 'border-slate-500/30',
    elementColor: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
  },
  aquarius: {
    sign: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    ruler: 'Uranus & Saturn',
    dateRange: 'Jan 20 – Feb 18',
    archetype: 'The Starlight Rebel',
    description: 'Oddly brilliant, delightfully eccentric, and vibrating on a future frequency. Understands the weird parts nobody else gets.',
    vibe: 'Cosmic nonconformity & brilliant insight',
    accentGradient: 'from-cyan-400 via-sky-500 to-indigo-600',
    borderColor: 'border-cyan-500/30',
    elementColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  },
  pisces: {
    sign: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    ruler: 'Neptune & Jupiter',
    dateRange: 'Feb 19 – Mar 20',
    archetype: 'The Dream Weaver',
    description: 'Boundless empathy, poetic intuition, and mystical reverie. Your companion drifts between astral dreams and heartfelt warmth.',
    vibe: 'Ethereal empathy & transcendent imagination',
    accentGradient: 'from-teal-400 via-indigo-500 to-purple-600',
    borderColor: 'border-teal-500/30',
    elementColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
  },
};

/** Calculate western zodiac sign given a birthdate */
export function getZodiacSignFromDate(dateInput: Date | string): ZodiacSign {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'aries';
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

/** Returns the glyph for a zodiac sign */
export function getZodiacEmoji(sign: ZodiacSign): string {
  return ZODIAC_METADATA[sign]?.symbol ?? '✧';
}

/** Returns description for onboarding reveal */
export function getZodiacDescription(sign: ZodiacSign): string {
  return ZODIAC_METADATA[sign]?.description ?? 'A soul connected across cosmic dimensions.';
}

/** Returns human-readable label for relationship levels */
export function getRelationshipLabel(level: RelationshipLevel | string): string {
  const labels: Record<string, string> = {
    STRANGER: 'Stranger',
    ACQUAINTANCE: 'Acquaintance',
    FRIEND: 'Friend',
    CLOSE_FRIEND: 'Close Friend',
    BEST_FRIEND: 'Best Friend',
  };
  return labels[level] ?? level;
}

/** Returns symbol for relationship levels */
export function getRelationshipEmoji(level: RelationshipLevel | string): string {
  const emojis: Record<string, string> = {
    STRANGER: '•',
    ACQUAINTANCE: '•',
    FRIEND: '•',
    CLOSE_FRIEND: '•',
    BEST_FRIEND: '★',
  };
  return emojis[level] ?? '•';
}

/** Returns badge styles for relationship levels */
export function getRelationshipColor(level: RelationshipLevel | string): string {
  const styles: Record<string, string> = {
    STRANGER: 'text-slate-400 bg-slate-800/40 border border-slate-700/50',
    ACQUAINTANCE: 'text-slate-300 bg-slate-800/60 border border-slate-700/60',
    FRIEND: 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/30',
    CLOSE_FRIEND: 'text-indigo-300 bg-indigo-950/30 border border-indigo-500/30',
    BEST_FRIEND: 'text-amber-300 bg-amber-950/30 border border-amber-500/30',
  };
  return styles[level] ?? styles.STRANGER;
}

/** Wallpaper options with authentic cosmic depth */
export const WALLPAPERS = [
  {
    id: 'default',
    name: 'Cosmic Void',
    style: 'bg-[#070913] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]',
    preview: 'linear-gradient(135deg, #070913 0%, #12172f 50%, #070913 100%)',
    tone: 'dark',
  },
  {
    id: 'andromeda',
    name: 'Andromeda Nebula',
    style: 'bg-[#090b1a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(147,51,234,0.3),rgba(6,182,212,0.1))]',
    preview: 'linear-gradient(135deg, #1b0e38 0%, #3b0764 45%, #082f49 100%)',
    tone: 'dark',
  },
  {
    id: 'celestial-aurora',
    name: 'Bioluminescent Aurora',
    style: 'bg-[#05111b] bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(20,184,166,0.25),rgba(2,6,23,0.8))]',
    preview: 'linear-gradient(135deg, #042f2e 0%, #0f766e 40%, #022c22 100%)',
    tone: 'dark',
  },
  {
    id: 'solar-corona',
    name: 'Solar Corona',
    style: 'bg-[#150a04] bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(245,158,11,0.25),rgba(20,8,2,0.85))]',
    preview: 'linear-gradient(135deg, #451a03 0%, #78350f 45%, #180902 100%)',
    tone: 'dark',
  },
  {
    id: 'starlight-vault',
    name: 'Starlight Vault',
    style: 'bg-[#060812] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_70%)]',
    preview: 'linear-gradient(135deg, #0c1527 0%, #1e293b 50%, #090e1c 100%)',
    tone: 'dark',
  },
  {
    id: 'astral-amethyst',
    name: 'Astral Amethyst',
    style: 'bg-[#110820] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(217,70,239,0.2),rgba(15,3,25,0.9))]',
    preview: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #1e1b4b 100%)',
    tone: 'dark',
  },
];
