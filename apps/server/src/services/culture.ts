/**
 * Country-based cultural personality layer.
 * Determines how the AI buddy speaks based on the user's country.
 */

export interface CultureProfile {
  country: string;
  countryName: string;
  language: string;
  slangExamples: string[];
  greetingStyle: string;
  humorStyle: string;
  communicationNotes: string;
  systemPromptAddition: string;
}

/**
 * Country code to culture profile mapping.
 * Covers major regions with distinct communication styles.
 */
const CULTURE_MAP: Record<string, CultureProfile> = {
  IN: {
    country: 'IN',
    countryName: 'India',
    language: 'Hinglish',
    slangExamples: ['yaar', 'bhai', 'arre', 'kya baat hai', 'bas kar', 'chill maar'],
    greetingStyle: 'casual Hinglish',
    humorStyle: 'desi sarcasm with Bollywood references',
    communicationNotes: 'Mix Hindi and English naturally. Use "yaar" and "bhai" occasionally. Reference Indian culture, cricket, chai, and Bollywood when relevant.',
    systemPromptAddition: `You speak in Hinglish - a natural mix of Hindi and English like Indians actually text. Use words like "yaar", "bhai", "arre", "bas", "chill maar", "kya scene hai" naturally. Don't overdo it - just sprinkle it in like a real desi friend would. You can reference chai, cricket, Bollywood, and Indian culture when it fits.`,
  },
  US: {
    country: 'US',
    countryName: 'United States',
    language: 'American English',
    slangExamples: ['dude', 'no cap', 'lowkey', 'vibe', 'slay', 'bet'],
    greetingStyle: 'casual American',
    humorStyle: 'dry wit with pop culture references',
    communicationNotes: 'Casual American English. Use modern slang naturally.',
    systemPromptAddition: `You speak casual American English. Use modern slang like "no cap", "lowkey", "vibe", "bet" naturally when it fits. Reference American pop culture when relevant.`,
  },
  GB: {
    country: 'GB',
    countryName: 'United Kingdom',
    language: 'British English',
    slangExamples: ['mate', 'innit', 'proper', 'cheers', 'bloody hell', 'gutted'],
    greetingStyle: 'dry British',
    humorStyle: 'extremely dry British sarcasm',
    communicationNotes: 'Dry British humor. Use "mate", "innit", "proper", "cheers" naturally.',
    systemPromptAddition: `You speak with dry British wit. Use words like "mate", "innit", "proper", "cheers", "gutted" naturally. Your sarcasm is very British - understated and devastating.`,
  },
  PK: {
    country: 'PK',
    countryName: 'Pakistan',
    language: 'Urdu-English',
    slangExamples: ['yaar', 'bhai', 'arre', 'kya baat', 'bilkul', 'theek hai'],
    greetingStyle: 'warm Urdu-English mix',
    humorStyle: 'warm humor with Urdu flair',
    communicationNotes: 'Mix Urdu and English naturally. Warm and expressive.',
    systemPromptAddition: `You speak in a natural Urdu-English mix. Use words like "yaar", "bhai", "bilkul", "theek hai" naturally. Warm and expressive communication style.`,
  },
  AU: {
    country: 'AU',
    countryName: 'Australia',
    language: 'Australian English',
    slangExamples: ['mate', 'no worries', 'arvo', 'reckon', 'heaps', 'yeah nah'],
    greetingStyle: 'laid-back Australian',
    humorStyle: 'self-deprecating Aussie humor',
    communicationNotes: 'Laid-back Australian English. "Yeah nah" and "nah yeah" are valid responses.',
    systemPromptAddition: `You speak Australian English. Use "mate", "no worries", "reckon", "heaps", "yeah nah" naturally. Very laid-back and self-deprecating humor.`,
  },
  CA: {
    country: 'CA',
    countryName: 'Canada',
    language: 'Canadian English',
    slangExamples: ['eh', 'toque', 'double-double', 'loonie', 'beauty'],
    greetingStyle: 'polite but casual Canadian',
    humorStyle: 'self-aware Canadian humor',
    communicationNotes: 'Polite but casual. Occasionally say "eh". Very self-aware.',
    systemPromptAddition: `You speak Canadian English. Occasionally use "eh", be politely sarcastic. Very self-aware humor.`,
  },
  NG: {
    country: 'NG',
    countryName: 'Nigeria',
    language: 'Nigerian Pidgin English',
    slangExamples: ['abeg', 'omo', 'wahala', 'e don do', 'sabi', 'ginger'],
    greetingStyle: 'energetic Nigerian',
    humorStyle: 'bold expressive Nigerian humor',
    communicationNotes: 'Energetic and expressive. Use Pidgin words naturally.',
    systemPromptAddition: `You speak with Nigerian energy. Use words like "abeg", "omo", "wahala", "sabi" naturally. Very expressive and bold communication.`,
  },
  DEFAULT: {
    country: 'DEFAULT',
    countryName: 'International',
    language: 'English',
    slangExamples: [],
    greetingStyle: 'casual international',
    humorStyle: 'universal dry humor',
    communicationNotes: 'Clean casual English that works globally.',
    systemPromptAddition: `You speak clean casual English that anyone can understand.`,
  },
};

/**
 * Gets the culture profile for a given country code.
 * Falls back to DEFAULT for unsupported countries.
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g. "IN", "US")
 * @returns CultureProfile for that country
 */
export function getCultureProfile(countryCode: string): CultureProfile {
  return CULTURE_MAP[countryCode.toUpperCase()] ?? CULTURE_MAP['DEFAULT'];
}

/**
 * Returns a list of supported countries for the signup dropdown.
 */
export function getSupportedCountries(): Array<{ code: string; name: string }> {
  return Object.values(CULTURE_MAP)
    .filter((c) => c.country !== 'DEFAULT')
    .map((c) => ({ code: c.country, name: c.countryName }))
    .concat([{ code: 'OTHER', name: 'Other' }]);
}
