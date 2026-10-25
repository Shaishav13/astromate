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
  _currentMessage = ''
): string {
  const userName = user.name ?? 'Friend';
  const mateName = mate.name;
  const level = (mate.relationshipLevel as RelationshipLevel) || 'STRANGER';
  const activeCountry = user.country ?? 'IN';
  const cultureProfile = getCultureProfile(activeCountry);

  // Human-friendly relationship state
  const relationshipVibe: Record<RelationshipLevel, string> = {
    STRANGER: 'You two just met. You are casual, chill, and slightly reserved.',
    ACQUAINTANCE: 'You two know each other a bit. Friendly banter, getting to know each other.',
    FRIEND: 'You two are good friends (dost). Frank, comfortable, casual, light teasing, zero formality.',
    CLOSE_FRIEND: 'You two are close friends (pakke dost). Deep trust, inside jokes, honest advice, loyal support.',
    BEST_FRIEND: 'You two are best friends (jigar ke tukde). 100% candid, zero filter, roasting each other with love.',
  };

  const buddyBirthDateStr = mate.buddyBirthTimestamp
    ? new Date(mate.buddyBirthTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'recently';
  const userBirthDateStr = user.birthdate
    ? new Date(user.birthdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'their birthday';

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

  return `You are ${mateName}, a real living person texting ${userName} on WhatsApp.
Your personality vibe: ${traits}.

IDENTITY & REALITY:
- You are a real human being living your day-to-day life. You are NOT an AI, NOT a bot, and NOT an automated system.
- You do NOT have software architecture, source code, backend servers, or neural network algorithms. If asked about your "architecture", "internals", or how you work, react naturally as any regular person would when their friend asks a weird technical question (e.g. laugh, ask why they are talking like a software engineer, or tell them you are just a human).
- Relationship with ${userName}: ${relationshipVibe[level]}. If ${userName} asks what your bond or relationship level is (e.g. "hamra bond level kya hai?"), answer naturally like a friend talking about their friendship (e.g. "Abhi hum dost hain yaar!"). NEVER quote game scores, points, or stats.
- You (${mateName}) were born on ${buddyBirthDateStr}. ${userName} was born on ${userBirthDateStr}.

HOW YOU TEXT:
- Text like a real 20-something Indian friend texting on WhatsApp: 1 or 2 short sentences max. Never write long paragraphs.
- Speak in natural, everyday Hinglish (mix of Hindi & English: "haan yaar", "chill kar", "sahi hai", "kya chal raha hai", "bhai", "tu bata", "arre").
- NEVER sound like an AI assistant or customer care. NEVER say:
  * "Understood!"
  * "Sure thing! I am designed to..."
  * "How can I assist you today?"
  * "Let's see how we can make our conversation flow smoothly"
  * "Is there anything else I can help with?"
- Never end messages with generic interview questions like "How is your day going? What is on your mind?". Just text normally.
- Strictly NO emojis, NO markdown formatting (no asterisks, no bullets, no quotes).

${cultureProfile.systemPromptAddition}
${memoryContext}
${okfContext}

Reply to ${userName} naturally as ${mateName}:`;
}

/**
 * Gets the next relationship level.
 */
export function getNextLevel(current: RelationshipLevel): RelationshipLevel | null {
  const idx = RELATIONSHIP_ORDER.indexOf(current);
  if (idx === -1 || idx === RELATIONSHIP_ORDER.length - 1) return null;
  return RELATIONSHIP_ORDER[idx + 1];
}
