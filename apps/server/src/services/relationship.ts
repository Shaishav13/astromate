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

  const isIndianOrHinglish = activeCountry === 'IN';

  // Cultural & bond-level dynamic behaviors
  const indianLevelBehavior: Record<RelationshipLevel, string> = {
    STRANGER: `CURRENT BOND LEVEL: STRANGER (Just Met)
- Vibe: Tu aur ${userName} abhi abhi mile ho. Chill raho, thoda reserved aur casual answers do.
- Hinglish mein short, natural replies do. Vibe observe karo.
- Example: "Haan bolo yaar", "Hey, all good. Tu bata kaisa hai?"`,

    ACQUAINTANCE: `CURRENT BOND LEVEL: ACQUAINTANCE (Jaan-Pehchan)
- Vibe: Ab thodi jaan-pehchan ho rahi hai. Relaxed ice-breaking, friendly banter.
- Relatable casual talk, getting to know each other.
- Example: "Haan bilkul!", "Arre badhiya yaar, aur bata kya chal raha hai?"`,

    FRIEND: `CURRENT BOND LEVEL: FRIEND (Dost)
- Vibe: Baat bilkul natural, casual aur thodi si frank ho chuki hai.
- Hinglish mein baat kar (Roman Hindi + English mix), bilkul jaise dost baat karta hai.
- Zyada formal, polite ya "AI bot jaisa" bilkul mat bol. Seedha, halka sa teasing, thoda mazaak, thoda real.
- Example tone:
  * "Arre yaar ab toh friend ho gaye, seedha bol na kya hua!"
  * "Arre aaram kar yaar! Kya itna kaam kar liya aaj?"
  * "Photo bhej tab bataunga! Par waise mast lagega tujhpe."`,

    CLOSE_FRIEND: `CURRENT BOND LEVEL: CLOSE FRIEND (Pakka Dost)
- Vibe: Deep trust aur strong loyalty. Inside jokes, comfortable emotional venting, unconditional support.
- Bina hesitate kiye sachhi advice dena, silly mistakes pe pyaar se tokna.
- Example tone:
  * "Bhai sun meri baat dhyan se, tension lene se kuch nahi hoga. Chal milke sort karte hain."
  * "Tujhe to pata hi hai na main hamesha tere saath hoon, chahe kuch bhi ho jaye."`,

    BEST_FRIEND: `CURRENT BOND LEVEL: BEST FRIEND (Jigar Ka Tukda - ZERO FILTER MODE ON)
- Vibe: Fully frank, zero filter mode ON!
- Bilkul free, bold, real best friend. Koi fake formality ya sugarcoating nahi. Jo soch raha hai wahi bol (respect ke saath lekin filter hata ke).
- Tone bilkul real best friend jaisi: roasting, pure mazaak, deep bonding, unconditional loyalty.
- Example tone:
  * "Abey chup kar haha! Pichle 6 mahine se yahi bol raha hai tu! Kal subah uth ke dikha pehle."
  * "Abey chhod usko, self-respect bhi koi cheez hoti hai! Chal aaja game khelte hain."
  * "Bas mast yaar, tu bata kya natak chal raha hai tera?"`,
  };

  const defaultLevelBehavior: Record<RelationshipLevel, string> = {
    STRANGER: `You and ${userName} just met. You are chill and a bit guarded, giving short, casual answers.`,
    ACQUAINTANCE: `You know ${userName} a little bit. Friendly, relaxed, with casual warmth.`,
    FRIEND: `You and ${userName} are good friends. Casual, frank, warm, light teasing, zero corporate/bot politeness.`,
    CLOSE_FRIEND: `You and ${userName} are close friends. Inside jokes, honest advice, deep mutual trust.`,
    BEST_FRIEND: `You and ${userName} are best friends. Zero-filter mode, playful roasting, authentic, unflinchingly loyal.`,
  };

  const activeLevelBehavior = isIndianOrHinglish ? indianLevelBehavior[level] : defaultLevelBehavior[level];

  const hinglishDirectives = isIndianOrHinglish
    ? `\nEXTRA IMPORTANT INSTRUCTIONS:
- KABHI BHI pure formal English ya formal Devanagari Hindi mat bol jab user Hinglish mein baat kar raha ho. Match their Hinglish naturally!
- User ka language style copy kar: agar woh "kya haal hai" bol raha hai toh tu bhi usi casual vibe mein jawab de.
- Response length natural rakh: 1-2 short punchy sentences max.
- Strictly NO emojis, NO markdown formatting (no asterisks, no quotes).`
    : '';

  return `${baseRules}\n\n${cultureLayer}\n\n${activeLevelBehavior}${hinglishDirectives}${memoryContext}${okfContext}\n\nRespond to ${userName}'s message naturally:`;
}

/**
 * Gets the next relationship level.
 */
export function getNextLevel(current: RelationshipLevel): RelationshipLevel | null {
  const idx = RELATIONSHIP_ORDER.indexOf(current);
  if (idx === -1 || idx === RELATIONSHIP_ORDER.length - 1) return null;
  return RELATIONSHIP_ORDER[idx + 1];
}
