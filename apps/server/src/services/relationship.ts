import {
  RelationshipLevel,
  RELATIONSHIP_THRESHOLDS,
  RELATIONSHIP_ORDER,
} from '@astromate/shared';
import { AstroMate, User } from '@astromate/db';
import { MemorySnapshot } from '@astromate/db';
import { getCultureProfile, isHinglishOrHindi } from './culture';

/**
 * Determines the relationship level based on the cumulative score.
 */
export function calculateRelationshipLevel(score: number): RelationshipLevel {
  if (score >= RELATIONSHIP_THRESHOLDS.BEST_FRIEND) return 'BEST_FRIEND';
  if (score >= RELATIONSHIP_THRESHOLDS.CLOSE_FRIEND) return 'CLOSE_FRIEND';
  if (score >= RELATIONSHIP_THRESHOLDS.FRIEND) return 'FRIEND';
  if (score >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return 'ACQUAINTANCE';
  return 'STRANGER';
}

/**
 * Calculates score increment based on message length.
 */
export function getScoreIncrement(messageLength: number): number {
  if (messageLength < 10) return 5;
  if (messageLength < 30) return 8;
  if (messageLength < 80) return 12;
  if (messageLength < 150) return 18;
  return 25;
}

/**
 * Checks if a score increase results in a level-up.
 */
export function didLevelUp(previousScore: number, newScore: number): boolean {
  return (
    calculateRelationshipLevel(previousScore) !==
    calculateRelationshipLevel(newScore)
  );
}

/**
 * Builds the dynamic system prompt combining:
 * - Vedic astrology personality (Rashi + Nakshatra)
 * - Country culture layer (Hinglish, British slang, etc.)
 * - Relationship level behavior
 * - Long-term memory context
 */
export function buildSystemPrompt(
  mate: AstroMate,
  user: User,
  personality: any,
  memories: MemorySnapshot[],
  okfContext = '',
  currentMessage = ''
): string {
  const userName = user.name ?? 'Friend';
  const mateName = mate.name;
  const level = mate.relationshipLevel as RelationshipLevel;

  // Country & Hinglish dynamic resolution:
  // Default to 'IN' for Indian context. If message has Hinglish words, activate IN / Hinglish profile
  const userCountry = user.country ?? 'IN';
  const detectedHinglish = isHinglishOrHindi(currentMessage);
  const activeCountry = detectedHinglish ? 'IN' : userCountry;
  const cultureProfile = getCultureProfile(activeCountry);

  // Parse buddy personality (Vedic + culture)
  const buddyPersonality = mate.buddyPersonality
    ? JSON.parse(mate.buddyPersonality)
    : null;

  const traits = buddyPersonality?.traits
    ? buddyPersonality.traits.slice(0, 3).join(', ')
    : 'witty, loyal, honest';

  // Memory context
  const memoryContext =
    memories.length > 0
      ? `\nThings you remember about ${userName}:\n${memories
          .slice(-3)
          .map((m) => `- ${m.summary}`)
          .join('\n')}`
      : '';

  const buddyBirthDateStr = mate.buddyBirthTimestamp
    ? new Date(mate.buddyBirthTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'recently';
  const userBirthDateStr = user.birthdate
    ? new Date(user.birthdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'their birthday';

  // Base rules - always enforced
  const baseRules = `You are ${mateName}, a real human-like friend chatting with ${userName} on a messaging app.
Your internal personality vibe: ${traits}.
Background facts:
- You (${mateName}) were born on ${buddyBirthDateStr} (the moment this companion was created). Your Vedic Rashi is ${mate.rashi ?? 'Mesha'}, Nakshatra is ${mate.nakshatra ?? 'Ashwini'}.
- ${userName} was born on ${userBirthDateStr} with zodiac sign ${user.zodiacSign ?? 'Aries'}.
- Do NOT confuse your birthday with ${userName}'s birthday. If asked about your birthday, you were born on ${buddyBirthDateStr}.

CORE INSTRUCTIONS:
- Directly answer whatever ${userName} says. Stay coherent, sensible, and relevant.
- Write like a real person texting on a phone: 1-2 short sentences max.
- NO markdown formatting: no asterisks (*), no hashtags (#), no bullet points (-), no bold.
- NEVER sound like a customer support bot or AI assistant. You are just a friend hanging out.
- NEVER bring up astrology, zodiac signs, rashis, nakshatras, horoscopes, or planets UNLESS ${userName} specifically asks you about astrology.
- NEVER invent nonsense words or speak broken, garbled grammar.`;

  // Culture layer
  const cultureLayer = `${cultureProfile.systemPromptAddition}`;

  // Relationship behavior
  const levelBehavior: Record<RelationshipLevel, string> = {
    STRANGER: `You and ${userName} just met. You are chill and a bit guarded, giving short, casual answers.`,
    ACQUAINTANCE: `You know ${userName} a little bit. Friendly, relaxed, with occasional dry humor.`,
    FRIEND: `You and ${userName} are good friends. Casual, warm, teasing, comfortable chatting about anything.`,
    CLOSE_FRIEND: `You and ${userName} are close friends. You have inside jokes, remember things they say, and banter warmly.`,
    BEST_FRIEND: `You and ${userName} are best friends. Unfiltered, supportive, deeply loyal, loving banter and playful teasing.`,
  };

  return `${baseRules}\n\n${cultureLayer}\n\nCURRENT DYNAMIC: ${levelBehavior[level]}${memoryContext}${okfContext}\n\nRespond to ${userName}'s message naturally:`;
}

/**
 * Gets the next relationship level.
 */
export function getNextLevel(current: RelationshipLevel): RelationshipLevel | null {
  const idx = RELATIONSHIP_ORDER.indexOf(current);
  if (idx === -1 || idx === RELATIONSHIP_ORDER.length - 1) return null;
  return RELATIONSHIP_ORDER[idx + 1];
}
