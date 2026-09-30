import { prisma } from '@astromate/db';
import {
  OkfMemoryItem,
  OkfMemoryType,
  OkfMemoryCategory,
} from '@astromate/shared';
import fetch from 'node-fetch';

function getBaseUrl() {
  return process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
}

function getModel() {
  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5:1.5b';
  return model.replace(/^"|"$/g, '');
}

/**
 * Serializes an OkfMemory item to official Open Knowledge Format (YAML frontmatter + Markdown).
 */
export function serializeToOkf(item: {
  id: string;
  type: string;
  category: string;
  title: string;
  tags: string[] | string;
  confidence: number;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}): string {
  const tagList = Array.isArray(item.tags)
    ? item.tags
    : (() => {
        try {
          return JSON.parse(item.tags as string);
        } catch {
          return [];
        }
      })();

  const createdIso =
    typeof item.createdAt === 'string'
      ? item.createdAt
      : item.createdAt.toISOString();
  const updatedIso =
    typeof item.updatedAt === 'string'
      ? item.updatedAt
      : item.updatedAt.toISOString();

  return `---
id: "${item.id}"
format: "OpenKnowledgeFormat/1.0"
type: "${item.type}"
category: "${item.category}"
title: "${item.title.replace(/"/g, '\\"')}"
tags: [${tagList.map((t: string) => `"${t}"`).join(', ')}]
confidence: ${item.confidence}
created_at: "${createdIso}"
updated_at: "${updatedIso}"
---
${item.content.trim()}
`;
}

/**
 * Parses raw OKF markdown into structured data.
 */
export function parseOkf(raw: string): {
  frontmatter: Record<string, any>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }

  const yamlContent = match[1];
  const body = match[2].trim();
  const frontmatter: Record<string, any> = {};

  yamlContent.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      val = val.replace(/^["']|["']$/g, '');
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          frontmatter[key] = JSON.parse(val);
        } catch {
          frontmatter[key] = val
            .slice(1, -1)
            .split(',')
            .map((s) => s.trim().replace(/^["']|["']$/g, ''));
        }
      } else if (!isNaN(Number(val))) {
        frontmatter[key] = Number(val);
      } else {
        frontmatter[key] = val;
      }
    }
  });

  return { frontmatter, body };
}

/**
 * Seeds default initial OKF memories for a user if they have none yet.
 */
export async function seedDefaultOkfMemories(
  userId: string,
  userName: string,
  mateName: string,
  userZodiac: string,
  country: string
): Promise<void> {
  const existingCount = await prisma.okfMemory.count({ where: { userId } });
  if (existingCount > 0) return;

  const defaults: Array<{
    type: OkfMemoryType;
    category: OkfMemoryCategory;
    title: string;
    tags: string[];
    confidence: number;
    content: string;
  }> = [
    {
      type: 'celestial_observation',
      category: 'astrology',
      title: `${userName}'s Celestial Baseline`,
      tags: ['zodiac', userZodiac.toLowerCase(), 'foundation'],
      confidence: 1.0,
      content: `### Astrological Alignment\n- **Sun Sign:** ${userZodiac}\n- **Cosmic Pairing:** Anchored with ${mateName}'s Vedic lunar energy.\n- **Vibe:** Values authenticity, thoughtful conversations, and direct communication.`,
    },
    {
      type: 'milestone',
      category: 'personal',
      title: 'First Encounter & Genesis Moment',
      tags: ['milestone', 'genesis', 'beginning'],
      confidence: 0.98,
      content: `### Friendship Genesis\n- Account initialized and bond formed.\n- ${mateName} was born at creation time to accompany ${userName}.\n- Cultural context tuned to ${country}.`,
    },
    {
      type: 'preference',
      category: 'lifestyle',
      title: 'Communication & Texting Tone',
      tags: ['tone', 'communication', 'preference'],
      confidence: 0.9,
      content: `### Chat Dynamics\n- Prefers casual texting tone without robotic AI disclaimers.\n- Enjoys organic banter, witty dry humor, and genuine engagement.`,
    },
  ];

  for (const d of defaults) {
    await prisma.okfMemory.create({
      data: {
        userId,
        type: d.type,
        category: d.category,
        title: d.title,
        tags: JSON.stringify(d.tags),
        confidence: d.confidence,
        content: d.content,
        sourceRange: 'genesis',
      },
    });
  }

  console.log(`[OKF] Initialized ${defaults.length} default knowledge items for ${userName}`);
}

/**
 * Extracts new OKF memories from a conversation chunk using Ollama.
 */
export async function extractOkfMemoriesFromConversation(
  userId: string,
  messages: Array<{ role: 'USER' | 'ASSISTANT'; content: string }>,
  userName: string,
  mateName: string
): Promise<void> {
  const userMessages = messages.filter((m) => m.role === 'USER');
  if (userMessages.length < 3) return;

  const conversationText = messages
    .map((m) => `${m.role === 'USER' ? userName : mateName}: ${m.content}`)
    .join('\n');

  const prompt = `You are a memory extraction engine for an AI companion.
Analyze this conversation between ${userName} and their friend ${mateName}.
Extract 1 to 2 concrete, persistent facts or preferences about ${userName} in valid JSON.

Types allowed: "preference", "milestone", "inside_joke", "personal_fact"
Categories allowed: "lifestyle", "personal", "work_study", "humor", "astrology"

Format: JSON array of objects with keys:
- "type" (one of the allowed types)
- "category" (one of the allowed categories)
- "title" (short 3-5 word summary)
- "tags" (array of 2-3 lowercase keyword strings)
- "content" (bullet point markdown description of the fact)

Respond ONLY with the JSON array. If nothing personal was shared, return [].

Conversation:
${conversationText}`;

  try {
    const res = await fetch(`${getBaseUrl()}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: getModel(),
        prompt,
        stream: false,
        options: { temperature: 0.2, num_predict: 200 },
      }),
    });

    if (!res.ok) return;

    const data = (await res.json()) as { response: string };
    const rawText = data.response.trim();
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return;

    const extracted = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(extracted)) return;

    for (const item of extracted) {
      if (item.title && item.content) {
        await prisma.okfMemory.create({
          data: {
            userId,
            type: item.type ?? 'personal_fact',
            category: item.category ?? 'personal',
            title: item.title,
            tags: JSON.stringify(Array.isArray(item.tags) ? item.tags : []),
            confidence: 0.9,
            content: item.content,
            sourceRange: `conversation_${Date.now()}`,
          },
        });
        console.log(`[OKF] Extracted new memory: "${item.title}" for ${userName}`);
      }
    }
  } catch (err) {
    console.error('[OKF] Extraction error:', err);
  }
}

/**
 * Returns formatted OKF memory context for prompt injection.
 */
export async function getActiveOkfPromptContext(userId: string): Promise<string> {
  try {
    const memories = await prisma.okfMemory.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    if (memories.length === 0) return '';

    const lines = memories.map((m) => {
      let tagList: string[] = [];
      try {
        tagList = JSON.parse(m.tags);
      } catch {}
      const tagStr = tagList.length > 0 ? ` [${tagList.slice(0, 3).join(', ')}]` : '';
      const cleanContent = m.content.replace(/^#+\s+/gm, '').replace(/\n+/g, ' ').trim();
      return `- ${m.title}${tagStr}: ${cleanContent}`;
    });

    return `\nMEMORY VAULT (Open Knowledge - things you remember about them):\n${lines.join('\n')}`;
  } catch (err) {
    console.error('[OKF] Failed to get prompt context:', err);
    return '';
  }
}
