import { ZodiacSign } from '@astromate/shared';

export interface VedicProfile {
  rashi: string;
  rashiEnglish: string;
  nakshatra: string;
  nakshatraLord: string;
  element: string;
  quality: string;
  traits: string[];
  buddyName: string;
  westernSign: ZodiacSign;
}

/**
 * 27 Nakshatras with their lords, traits, and suggested buddy names.
 * Each Nakshatra spans 13°20' of the zodiac (360/27).
 * We calculate which Nakshatra the Moon is in at the buddy's birth timestamp.
 * For simplicity we use a time-based approximation (Moon moves ~13.2°/day).
 */
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', traits: ['energetic', 'pioneering', 'restless'], buddyName: 'Aarav' },
  { name: 'Bharani', lord: 'Venus', traits: ['intense', 'passionate', 'determined'], buddyName: 'Reyan' },
  { name: 'Krittika', lord: 'Sun', traits: ['sharp', 'critical', 'ambitious'], buddyName: 'Kiaan' },
  { name: 'Rohini', lord: 'Moon', traits: ['charming', 'creative', 'sensual'], buddyName: 'Rohan' },
  { name: 'Mrigashira', lord: 'Mars', traits: ['curious', 'gentle', 'searching'], buddyName: 'Milan' },
  { name: 'Ardra', lord: 'Rahu', traits: ['stormy', 'intense', 'transformative'], buddyName: 'Aryan' },
  { name: 'Punarvasu', lord: 'Jupiter', traits: ['optimistic', 'generous', 'philosophical'], buddyName: 'Pranay' },
  { name: 'Pushya', lord: 'Saturn', traits: ['nurturing', 'disciplined', 'protective'], buddyName: 'Pranav' },
  { name: 'Ashlesha', lord: 'Mercury', traits: ['mysterious', 'cunning', 'perceptive'], buddyName: 'Ayaan' },
  { name: 'Magha', lord: 'Ketu', traits: ['regal', 'proud', 'ancestral'], buddyName: 'Manav' },
  { name: 'Purva Phalguni', lord: 'Venus', traits: ['playful', 'romantic', 'creative'], buddyName: 'Farhan' },
  { name: 'Uttara Phalguni', lord: 'Sun', traits: ['helpful', 'reliable', 'social'], buddyName: 'Uday' },
  { name: 'Hasta', lord: 'Moon', traits: ['skillful', 'witty', 'resourceful'], buddyName: 'Harsh' },
  { name: 'Chitra', lord: 'Mars', traits: ['artistic', 'glamorous', 'independent'], buddyName: 'Chetan' },
  { name: 'Swati', lord: 'Rahu', traits: ['flexible', 'independent', 'scattered'], buddyName: 'Samir' },
  { name: 'Vishakha', lord: 'Jupiter', traits: ['goal-oriented', 'intense', 'competitive'], buddyName: 'Vivaan' },
  { name: 'Anuradha', lord: 'Saturn', traits: ['devoted', 'friendly', 'disciplined'], buddyName: 'Anand' },
  { name: 'Jyeshtha', lord: 'Mercury', traits: ['protective', 'eldest', 'powerful'], buddyName: 'Jai' },
  { name: 'Mula', lord: 'Ketu', traits: ['investigative', 'destructive', 'philosophical'], buddyName: 'Madhav' },
  { name: 'Purva Ashadha', lord: 'Venus', traits: ['invincible', 'proud', 'energetic'], buddyName: 'Pravin' },
  { name: 'Uttara Ashadha', lord: 'Sun', traits: ['victorious', 'responsible', 'focused'], buddyName: 'Utkarsh' },
  { name: 'Shravana', lord: 'Moon', traits: ['listening', 'learning', 'connected'], buddyName: 'Shaurya' },
  { name: 'Dhanishta', lord: 'Mars', traits: ['wealthy', 'musical', 'ambitious'], buddyName: 'Dev' },
  { name: 'Shatabhisha', lord: 'Rahu', traits: ['healing', 'secretive', 'independent'], buddyName: 'Sahil' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', traits: ['fiery', 'passionate', 'dual-natured'], buddyName: 'Param' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', traits: ['deep', 'wise', 'serpentine'], buddyName: 'Umang' },
  { name: 'Revati', lord: 'Mercury', traits: ['nourishing', 'wealthy', 'compassionate'], buddyName: 'Rishi' },
];

/**
 * 12 Rashis (Vedic Moon signs) with traits.
 */
const RASHIS = [
  { name: 'Mesh', english: 'Aries', element: 'Fire', quality: 'Cardinal', westernSign: 'aries' as ZodiacSign },
  { name: 'Vrishabh', english: 'Taurus', element: 'Earth', quality: 'Fixed', westernSign: 'taurus' as ZodiacSign },
  { name: 'Mithun', english: 'Gemini', element: 'Air', quality: 'Mutable', westernSign: 'gemini' as ZodiacSign },
  { name: 'Kark', english: 'Cancer', element: 'Water', quality: 'Cardinal', westernSign: 'cancer' as ZodiacSign },
  { name: 'Simha', english: 'Leo', element: 'Fire', quality: 'Fixed', westernSign: 'leo' as ZodiacSign },
  { name: 'Kanya', english: 'Virgo', element: 'Earth', quality: 'Mutable', westernSign: 'virgo' as ZodiacSign },
  { name: 'Tula', english: 'Libra', element: 'Air', quality: 'Cardinal', westernSign: 'libra' as ZodiacSign },
  { name: 'Vrishchik', english: 'Scorpio', element: 'Water', quality: 'Fixed', westernSign: 'scorpio' as ZodiacSign },
  { name: 'Dhanu', english: 'Sagittarius', element: 'Fire', quality: 'Mutable', westernSign: 'sagittarius' as ZodiacSign },
  { name: 'Makar', english: 'Capricorn', element: 'Earth', quality: 'Cardinal', westernSign: 'capricorn' as ZodiacSign },
  { name: 'Kumbh', english: 'Aquarius', element: 'Air', quality: 'Fixed', westernSign: 'aquarius' as ZodiacSign },
  { name: 'Meen', english: 'Pisces', element: 'Water', quality: 'Mutable', westernSign: 'pisces' as ZodiacSign },
];

/**
 * Calculates Nakshatra index from a timestamp.
 * Moon completes one cycle (~27.3 days). We use Unix timestamp modulo
 * to approximate which Nakshatra the Moon occupies at birth.
 * @param timestamp - The buddy's birth timestamp (signup moment)
 * @returns Index 0-26 into NAKSHATRAS array
 */
function getNakshatraIndex(timestamp: Date): number {
  const MOON_CYCLE_MS = 27.3 * 24 * 60 * 60 * 1000;
  const referenceEpoch = new Date('2000-01-06T18:14:00Z').getTime(); // Known new moon
  const elapsed = timestamp.getTime() - referenceEpoch;
  const cyclePosition = ((elapsed % MOON_CYCLE_MS) + MOON_CYCLE_MS) % MOON_CYCLE_MS;
  const fraction = cyclePosition / MOON_CYCLE_MS;
  return Math.floor(fraction * 27) % 27;
}

/**
 * Calculates Rashi index from Nakshatra index.
 * Each Rashi contains 2.25 Nakshatras (27/12).
 * @param nakshatraIndex - 0-26
 * @returns Index 0-11 into RASHIS array
 */
function getRashiIndex(nakshatraIndex: number): number {
  return Math.floor(nakshatraIndex / 2.25) % 12;
}

/**
 * Generates a full Vedic astrology profile for the AI buddy
 * based on the exact signup timestamp.
 * @param buddyBirthTimestamp - The moment the user signed up
 * @returns VedicProfile with Rashi, Nakshatra, and personality data
 */
export function generateVedicProfile(buddyBirthTimestamp: Date): VedicProfile {
  const nakshatraIndex = getNakshatraIndex(buddyBirthTimestamp);
  const rashiIndex = getRashiIndex(nakshatraIndex);

  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const rashi = RASHIS[rashiIndex];

  return {
    rashi: rashi.name,
    rashiEnglish: rashi.english,
    nakshatra: nakshatra.name,
    nakshatraLord: nakshatra.lord,
    element: rashi.element,
    quality: rashi.quality,
    traits: nakshatra.traits,
    buddyName: nakshatra.buddyName,
    westernSign: rashi.westernSign,
  };
}
