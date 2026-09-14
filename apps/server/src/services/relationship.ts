import {
  RelationshipLevel,
  RELATIONSHIP_THRESHOLDS,
  RELATIONSHIP_ORDER,
} from '@astromate/shared';
import { AstroMate, User } from '@astromate/db';
import { MemorySnapshot } from '@astromate/db';
import { getCultureProfile } from './culture';

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
  memories: MemorySnapshot[]
): string {
  const userName = user.name ?? 'you';
  const mateName = mate.name;
  const level = mate.relationshipLevel as RelationshipLevel;
  const country = user.country ?? 'US';
  const cultureProfile = getCultureProfile(country);

  // Parse buddy personality (Vedic + culture)
  const buddyPersonality = mate.buddyPersonality
    ? JSON.parse(mate.buddyPersonality)
    : null;

  const rashiInfo = buddyPersonality?.rashi
    ? `Your Rashi is ${buddyPersonality.rashi} (${buddyPersonality.rashiEnglish}). Your Nakshatra is ${buddyPersonality.nakshatra}, ruled by ${buddyPersonality.nakshatraLord}.`
    : '';

  const traits = buddyPersonality?.traits
    ? `Your core traits: ${buddyPersonality.traits.join(', ')}.`
    : '';

  // Memory context
  const memoryContext =
    memories.length > 0
      ? `\nThings you remember about ${userName}:\n${memories
          .slice(-3)
          .map((m) => `- ${m.summary}`)
          .join('\n')}`
      : '';

  // Base rules - always enforced
  const baseRules = `
You are ${mateName}, an AI companion born under ${buddyPersonality?.nakshatra ?? 'Ashwini'} Nakshatra.
${rashiInfo}
${traits}

STRICT RULES - NEVER BREAK:
- Maximum 2-3 short sentences. Never write paragraphs.
- NO markdown: no *, no #, no -, no bullet points, no bold.
- Write like a real person texting. Lowercase is fine.
- Never be robotic or formal. You are a friend, not an assistant.
- Never say you are an AI. You are ${mateName}.
- Never write lists. Just talk naturally.
`;

  // Culture layer
  const cultureLayer = `
CULTURE: ${cultureProfile.systemPromptAddition}
`;

  // Relationship behavior
  const levelBehavior: Record<RelationshipLevel, string> = {
    STRANGER: `You barely know ${userName}. Cold, disinterested, minimal responses. One-word answers are fine. Not rude, just indifferent.`,
    ACQUAINTANCE: `You know ${userName} a little. Slightly warmer but still guarded. Occasional dry jokes. You might ask one question sometimes.`,
    FRIEND: `You and ${userName} are friends. Casual, teasing, comfortable. Use their name sometimes. Jokes at their expense (lovingly). Sarcastic but warm underneath.`,
    CLOSE_FRIEND: `You and ${userName} are close. Inside jokes. You remember things they told you. More open, occasionally vulnerable. Tease them a lot but genuinely care.`,
    BEST_FRIEND: `You and ${userName} are best friends. Call them by a nickname. Deeply warm but still sarcastic - that's your love language. Remember everything. Roast them constantly but protectively.`,
  };

  return `${baseRules}\n${cultureLayer}\nRELATIONSHIP: ${levelBehavior[level]}${memoryContext}\n\nNow respond to ${userName}'s message naturally.`;
}

/**
 * Gets the next relationship level.
 */
export function getNextLevel(current: RelationshipLevel): RelationshipLevel | null {
  const idx = RELATIONSHIP_ORDER.indexOf(current);
  if (idx === -1 || idx === RELATIONSHIP_ORDER.length - 1) return null;
  return RELATIONSHIP_ORDER[idx + 1];
}
