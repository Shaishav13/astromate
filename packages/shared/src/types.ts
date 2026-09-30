// ============================================
// AstroMate Shared TypeScript Types
// ============================================

/** All 12 zodiac signs */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/** Relationship progression levels */
export type RelationshipLevel =
  | 'STRANGER'
  | 'ACQUAINTANCE'
  | 'FRIEND'
  | 'CLOSE_FRIEND'
  | 'BEST_FRIEND';

/** Subscription tiers */
export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM';

/** Message sender role */
export type MessageRole = 'USER' | 'ASSISTANT';

/** Astrology-based personality traits for the AI companion */
export interface PersonalityTraits {
  zodiacSign: ZodiacSign;
  /** How much energy the AI has (1-10) */
  energyLevel: number;
  /** How sarcastic the AI is (1-10) */
  sarcasmLevel: number;
  /** How lazy/unmotivated the AI acts (1-10) */
  lazinessLevel: number;
  /** The AI's humor style */
  humorStyle: 'dry' | 'slapstick' | 'witty' | 'dark' | 'wholesome';
  /** How the AI communicates */
  communicationStyle:
    | 'blunt'
    | 'passive-aggressive'
    | 'chill'
    | 'dramatic'
    | 'mysterious';
  /** The AI's signature phrase */
  catchphrase: string;
  /** A unique behavioral quirk */
  quirk: string;
  /** Astrological element */
  element: 'fire' | 'earth' | 'air' | 'water';
  /** Zodiac-appropriate name for the AI */
  suggestedName: string;
}

/** Full AI companion profile */
export interface MateProfile {
  id: string;
  name: string;
  relationshipLevel: RelationshipLevel;
  relationshipScore: number;
  totalInteractions: number;
  zodiacSign: ZodiacSign;
  personality: PersonalityTraits;
  buddyBirthTimestamp?: string;
  rashi?: string;
  nakshatra?: string;
  userZodiacSign?: string;
  userBirthdate?: string;
  userName?: string;
  userEmail?: string;
  country?: string;
}

/** A single chat message */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  isProactive: boolean;
  createdAt: string;
}

/** User profile returned from API */
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  zodiacSign: ZodiacSign | null;
  subscriptionTier: SubscriptionTier;
  lastActiveAt: string;
}

// ============================================
// Open Knowledge Format (OKF) Types
// ============================================

export type OkfMemoryType =
  | 'preference'
  | 'milestone'
  | 'inside_joke'
  | 'celestial_observation'
  | 'personal_fact';

export type OkfMemoryCategory =
  | 'lifestyle'
  | 'personal'
  | 'work_study'
  | 'humor'
  | 'astrology';

export interface OkfMemoryItem {
  id: string;
  userId: string;
  type: OkfMemoryType;
  category: OkfMemoryCategory;
  title: string;
  tags: string[];
  confidence: number;
  content: string;
  sourceRange?: string | null;
  createdAt: string;
  updatedAt: string;
  rawOkf?: string;
}

export interface OkfBundleResponse {
  memories: OkfMemoryItem[];
  stats: {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  };
}

export interface CreateOkfMemoryRequest {
  type: OkfMemoryType;
  category: OkfMemoryCategory;
  title: string;
  tags: string[];
  content: string;
  confidence?: number;
}

// ============================================
// API Request / Response Types
// ============================================

/** POST /api/onboard */
export interface OnboardRequest {
  name: string;
  email: string;
  /** ISO date string e.g. "1998-03-15" */
  birthdate: string;
}

/** POST /api/onboard response */
export interface OnboardResponse {
  user: UserProfile;
  mate: MateProfile;
  isNewUser: boolean;
}

/** POST /api/chat */
export interface ChatRequest {
  userId: string;
  message: string;
}

/** POST /api/chat response */
export interface ChatResponse {
  message: ChatMessage;
  relationshipUpdate: {
    newLevel: RelationshipLevel;
    newScore: number;
    leveledUp: boolean;
    previousLevel: RelationshipLevel;
  };
}

/** GET /api/messages/:userId */
export interface MessagesResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
}

/** GET /api/mate/:userId */
export interface MateResponse {
  mate: MateProfile;
}

/** GET /api/health */
export interface HealthResponse {
  status: 'ok' | 'degraded';
  ollama: boolean;
  db: boolean;
  timestamp: string;
}

// ============================================
// Relationship Score Thresholds
// ============================================

export const RELATIONSHIP_THRESHOLDS: Record<RelationshipLevel, number> = {
  STRANGER: 0,
  ACQUAINTANCE: 100,
  FRIEND: 300,
  CLOSE_FRIEND: 700,
  BEST_FRIEND: 1500,
};

/** Ordered list of relationship levels for progression checks */
export const RELATIONSHIP_ORDER: RelationshipLevel[] = [
  'STRANGER',
  'ACQUAINTANCE',
  'FRIEND',
  'CLOSE_FRIEND',
  'BEST_FRIEND',
];
