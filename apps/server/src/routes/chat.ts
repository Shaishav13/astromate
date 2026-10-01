import { Router, Request, Response } from 'express';
import { prisma } from '@astromate/db';
import { ChatRequest, ChatResponse, MessagesResponse } from '@astromate/shared';
import { generatePersonalitySeed } from '../services/astrology';
import {
  calculateRelationshipLevel,
  getScoreIncrement,
  didLevelUp,
  buildSystemPrompt,
} from '../services/relationship';
import { generateResponse, generateMemorySummary } from '../services/ollama';
import { getActiveOkfPromptContext, extractOkfMemoriesFromConversation } from '../services/okf';
import { chatRateLimit } from '../middleware/rateLimit';

const router = Router();

/** Number of messages before creating a memory snapshot */
const MEMORY_SNAPSHOT_INTERVAL = 20;

/**
 * POST /api/chat
 * Handles a user message, generates AI response, and updates relationship state.
 */
router.post('/', chatRateLimit, async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body as ChatRequest;

    if (!userId || !message?.trim()) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // Fetch user and mate
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const mate = await prisma.astroMate.findUnique({ where: { userId } });
    if (!mate) return res.status(404).json({ error: 'AstroMate not found. Please onboard first.' });

    // Update user activity
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });

    // Save user message
    await prisma.message.create({
      data: { userId, role: 'USER', content: message.trim() },
    });

    // Fetch recent conversation history (last 20 messages for context)
    const recentMessages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const conversationHistory = recentMessages.reverse().map((m) => ({
      role: m.role as 'USER' | 'ASSISTANT',
      content: m.content,
    }));

    // Fetch memory snapshots for long-term context
    const memories = await prisma.memorySnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    // Build dynamic system prompt with OKF Memory Context
    const personality = user.personalitySeed ? JSON.parse(user.personalitySeed) : null;
    const okfContext = await getActiveOkfPromptContext(userId);
    const systemPrompt = buildSystemPrompt(mate, user, personality, memories, okfContext, message);

    // Generate AI response
    console.log(`[Chat] Generating response for ${user.name} (${mate.relationshipLevel})`);
    const rawAiResponse = await generateResponse(systemPrompt, conversationHistory);
    const aiResponseText = rawAiResponse
      .replace(new RegExp(`^(?:${mate.name}|Assistant|AI):\\s*`, 'i'), '')
      .replace(/^["']|["']$/g, '')
      .trim();

    // Save AI response
    const aiMessage = await prisma.message.create({
      data: { userId, role: 'ASSISTANT', content: aiResponseText },
    });

    // Update relationship score and level
    const previousScore = mate.relationshipScore;
    const increment = getScoreIncrement(message.length);
    const newScore = previousScore + increment;
    const newLevel = calculateRelationshipLevel(newScore);
    const leveledUp = didLevelUp(previousScore, newScore);

    const updatedMate = await prisma.astroMate.update({
      where: { id: mate.id },
      data: {
        relationshipScore: newScore,
        relationshipLevel: newLevel,
        totalInteractions: { increment: 1 },
      },
    });

    if (leveledUp) {
      console.log(`[Relationship] ${user.name} leveled up to ${newLevel}! Score: ${newScore}`);
    }

    // Check if memory snapshot is needed
    const totalMessages = await prisma.message.count({ where: { userId } });
    if (totalMessages % MEMORY_SNAPSHOT_INTERVAL === 0) {
      const messagesToSummarize = await prisma.message.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: MEMORY_SNAPSHOT_INTERVAL,
      });

      // Run memory summarization in background (don't await)
      generateMemorySummary(
        messagesToSummarize.reverse().map((m) => ({
          id: m.id,
          role: m.role as 'USER' | 'ASSISTANT',
          content: m.content,
          isProactive: m.isProactive,
          createdAt: m.createdAt.toISOString(),
        }))
      )
        .then((summary) =>
          prisma.memorySnapshot.create({
            data: {
              userId,
              summary,
              messageRangeStart: totalMessages - MEMORY_SNAPSHOT_INTERVAL,
              messageRangeEnd: totalMessages,
            },
          })
        )
        .then(() => console.log(`[Memory] Snapshot created for ${user.name}`))
        .catch((err) => console.error('[Memory] Snapshot failed:', err));

      // Extract structured OKF memories in background
      extractOkfMemoriesFromConversation(
        userId,
        messagesToSummarize.reverse().map((m) => ({
          role: m.role as 'USER' | 'ASSISTANT',
          content: m.content,
        })),
        user.name ?? 'Friend',
        mate.name
      ).catch((err) => console.error('[OKF] Extraction failed:', err));
    }

    const response: ChatResponse = {
      message: {
        id: aiMessage.id,
        role: 'ASSISTANT',
        content: aiMessage.content,
        isProactive: false,
        createdAt: aiMessage.createdAt.toISOString(),
      },
      relationshipUpdate: {
        newLevel: updatedMate.relationshipLevel as any,
        newScore: updatedMate.relationshipScore,
        leveledUp,
        previousLevel: mate.relationshipLevel as any,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Chat] Error:', error);
    if (error instanceof Error && error.message.includes('Ollama')) {
      return res.status(503).json({
        error: error.message,
        hint: 'Make sure Ollama is running: ollama serve',
      });
    }
    return res.status(500).json({ error: 'Failed to generate response' });
  }
});

/**
 * GET /api/messages/:userId
 * Returns paginated message history for a user.
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where: { userId } }),
    ]);

    const response: MessagesResponse = {
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role as 'USER' | 'ASSISTANT',
        content: m.content,
        isProactive: m.isProactive,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
      page,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Messages] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * DELETE /api/messages/:userId
 * Clears message history for a user to start fresh.
 */
router.delete('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.message.deleteMany({ where: { userId } });
    return res.status(200).json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('[Messages] Clear Error:', error);
    return res.status(500).json({ error: 'Failed to clear messages' });
  }
});

export default router;
