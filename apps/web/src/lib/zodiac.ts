import { ZodiacSign } from '@astromate/shared';

/** Returns the emoji for a zodiac sign */
export function getZodiacEmoji(sign: ZodiacSign): string {
  const emojis: Record<ZodiacSign, string> = {
    aries: '\u2648',
    taurus: '\u2649',
    gemini: '\u264a',
    cancer: '\u264b',
    leo: '\u264c',
    virgo: '\u264d',
    libra: '\u264e',
    scorpio: '\u264f',
    sagittarius: '\u2650',
    capricorn: '\u2651',
    aquarius: '\u2652',
    pisces: '\u2653',
  };
  return emojis[sign] ?? '\u2b50';
}

/** Returns a short, fun description for the onboarding zodiac reveal */
export function getZodiacDescription(sign: ZodiacSign): string {
  const descriptions: Record<ZodiacSign, string> = {
    aries: 'Bold, impatient, and always first. Your AstroMate matches your energy.',
    taurus: 'Stubborn, cozy, and obsessed with comfort. Your AstroMate is just as chill.',
    gemini: 'Two-faced (lovingly). Your AstroMate will never make up their mind either.',
    cancer: 'Soft on the inside, sarcastic on the outside. Your AstroMate gets it.',
    leo: 'Dramatic and lovable. Your AstroMate will absolutely steal the spotlight.',
    virgo: 'Overthinks everything. Your AstroMate will notice every detail about you.',
    libra: 'Indecisive but charming. Your AstroMate will never pick a side either.',
    scorpio: 'Intense and mysterious. Your AstroMate already knows your secrets.',
    sagittarius: 'Free-spirited and chaotic. Your AstroMate is down for anything.',
    capricorn: 'Ambitious and blunt. Your AstroMate will keep it real with you.',
    aquarius: 'Weird in the best way. Your AstroMate is on the same frequency.',
    pisces: 'Dreamy and emotional. Your AstroMate will drift off with you.',
  };
  return descriptions[sign] ?? 'Your AstroMate is ready to meet you.';
}

/** Returns a human-readable label for a relationship level */
export function getRelationshipLabel(level: string): string {
  const labels: Record<string, string> = {
    STRANGER: 'Stranger',
    ACQUAINTANCE: 'Acquaintance',
    FRIEND: 'Friend',
    CLOSE_FRIEND: 'Close Friend',
    BEST_FRIEND: 'Best Friend',
  };
  return labels[level] ?? level;
}

/** Returns an emoji for a relationship level */
export function getRelationshipEmoji(level: string): string {
  const emojis: Record<string, string> = {
    STRANGER: '\ud83d\udc64',
    ACQUAINTANCE: '\ud83e\udd1d',
    FRIEND: '\ud83d\ude0a',
    CLOSE_FRIEND: '\ud83d\udc9c',
    BEST_FRIEND: '\u2b50',
  };
  return emojis[level] ?? '\u2b50';
}

/** Returns a Tailwind color class for a relationship level */
export function getRelationshipColor(level: string): string {
  const colors: Record<string, string> = {
    STRANGER: 'text-gray-500 bg-gray-100',
    ACQUAINTANCE: 'text-blue-600 bg-blue-100',
    FRIEND: 'text-green-600 bg-green-100',
    CLOSE_FRIEND: 'text-purple-600 bg-purple-100',
    BEST_FRIEND: 'text-yellow-600 bg-yellow-100',
  };
  return colors[level] ?? 'text-gray-500 bg-gray-100';
}

/** Wallpaper options for the chat background */
export const WALLPAPERS = [
  {
    id: 'default',
    name: 'Default',
    style: 'bg-chat-bg',
    preview: '#fafaf9',
  },
  {
    id: 'cosmic-night',
    name: 'Cosmic Night',
    style: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900',
    preview: 'linear-gradient(135deg, #1e1b4b, #581c87, #0f172a)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    style: 'bg-gradient-to-br from-teal-400 via-cyan-300 to-purple-400',
    preview: 'linear-gradient(135deg, #2dd4bf, #67e8f9, #c084fc)',
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    style: 'bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500',
    preview: 'linear-gradient(135deg, #fb923c, #f472b6, #a855f7)',
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    style: 'bg-gradient-to-br from-blue-200 via-cyan-100 to-teal-200',
    preview: 'linear-gradient(135deg, #bfdbfe, #cffafe, #99f6e4)',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    style: 'bg-gradient-to-br from-yellow-200 via-amber-100 to-orange-200',
    preview: 'linear-gradient(135deg, #fef08a, #fef3c7, #fed7aa)',
  },
];
