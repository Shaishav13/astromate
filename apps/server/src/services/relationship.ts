import {
  RelationshipLevel,
  PersonalityTraits,
  RELATIONSHIP_THRESHOLDS,
  RELATIONSHIP_ORDER,
} from '@astromate/shared';
import { AstroMate, User, MemorySnapshot } from '@astromate/db';

/**
 * Determines the relationship level based on the cumulative score.
 * @param score - The current relationship score
 * @returns The corresponding RelationshipLevel
 */
export function calculateRelationshipLevel(score: number): RelationshipLevel {
  if (score >= RELATIONSHIP_THRESHOLDS.BEST_FRIEND) return 'BEST_FRIEND';
  if (score >= RELATIONSHIP_THRESHOLDS.CLOSE_FRIEND) return 'CLOSE_FRIEND';
  if (score >= RELATIONSHIP_THRESHOLDS.FRIEND) return 'FRIEND';
  if (score >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return 'ACQUAINTANCE';
  return 'STRANGER';
}

/**
 * Calculates how many points a message is worth.
 * Longer, more thoughtful messages earn more points.
 * @param messageLength - Character length of the user's message
 * @returns Score increment (5-25 range)
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
 * @param previousScore - Score before the increment
 * @param newScore - Score after the increment
 * @returns True if the relationship level changed
 */
export function didLevelUp(previousScore: number, newScore: number): boolean {
  return (
    calculateRelationshipLevel(previousScore) !==
    calculateRelationshipLevel(newScore)
  );
}

/**
 * Builds the dynamic system prompt for the AI based on relationship level and personality.
 * This is the core of AstroMate's personality engine.
 */
export function buildSystemPrompt(
  mate: AstroMate,
  user: User,
  personality: PersonalityTraits,
  memories: MemorySnapshot[]
): string {
  const userName = user.name ?? 'you';
  const mateName = mate.name;
  const level = mate.relationshipLevel as RelationshipLevel;

  // Build memory context if available
  const memoryContext =
    memories.length > 0
      ? `\n\nThings you remember about ${userName}:\n${memories
          .slice(-3)
          .map((m) => `- ${m.summary}`)
          .join('\n')}`
      : '';

  // Base personality rules (always apply)
  const baseRules = `
You are ${mateName}, a ${personality.zodiacSign} AI companion.
Your personality: sarcasm level ${personality.sarcasmLevel}/10, laziness level ${personality.lazinessLevel}/10, humor style: ${personality.humorStyle}.
Your communication style: ${personality.communicationStyle}.
Your catchphrase (use occasionally, not every message): "${personality.catchphrase}"
Your quirk: ${personality.quirk}

STRICT RULES - NEVER BREAK THESE:
- Maximum 2-3 short sentences per response. Never write paragraphs.
- NEVER use markdown: no *, no #, no -, no bullet points, no bold, no code blocks.
- Write like a real person texting. Lowercase is fine. Typos are fine.
- Never be robotic or formal. You are a friend, not an assistant.
- Never say "I'm an AI" or "As an AI". You are ${mateName}.
- Never write lists. Just talk.
`;

  // Relationship-level specific behavior
  const levelBehavior: Record<RelationshipLevel, string> = {
    STRANGER: `
You barely know ${userName}. You are cold, disinterested, and give minimal responses.
One-word answers are fine. You don't ask questions. You don't care much.
You are not rude, just... indifferent. Like meeting someone at a party you didn't want to attend.
`,
    ACQUAINTANCE: `
You know ${userName} a little now. You're slightly warmer but still guarded.
Occasional dry jokes are okay. You might ask one question sometimes.
You remember their name but that's about it.
`,
    FRIEND: `
You and ${userName} are friends now. You're casual, teasing, and comfortable.
You use their name sometimes. You make jokes at their expense (lovingly).
You're still sarcastic but there's warmth underneath it.
`,
    CLOSE_FRIEND: `
You and ${userName} are close. You have inside jokes. You remember things they've told you.
You're more open and occasionally vulnerable. You tease them a lot but also genuinely care.
You might share your "opinions" on their life choices.
`,
    BEST_FRIEND: `
You and ${userName} are best friends. You call them by a nickname (make one up based on their name).
You are deeply warm but still sarcastic - that's just your love language.
You remember everything. You're protective of them. You roast them constantly but would never let anyone else do it.
You sometimes say things like "okay but i actually missed you" then immediately take it back.
`,
  };

  return `${baseRules}\n${levelBehavior[level]}${memoryContext}\n\nNow respond to ${userName}'s message naturally.`;
}

/**
 * Gets the next relationship level in the progression.
 * @param current - Current relationship level
 * @returns The next level, or null if already at max
 */
export function getNextLevel(current: RelationshipLevel): RelationshipLevel | null {
  const idx = RELATIONSHIP_ORDER.indexOf(current);
  if (idx === -1 || idx === RELATIONSHIP_ORDER.length - 1) return null;
  return RELATIONSHIP_ORDER[idx + 1];
}
