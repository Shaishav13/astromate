import { Router, Request, Response } from 'express';
import { prisma } from '@astromate/db';
import {
  OkfBundleResponse,
  OkfMemoryItem,
  CreateOkfMemoryRequest,
} from '@astromate/shared';
import {
  serializeToOkf,
  seedDefaultOkfMemories,
} from '../services/okf';

const router = Router();

/**
 * GET /api/okf/:userId
 * Returns all OKF memories for a user. Seeds defaults on first call.
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { mate: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Auto-seed initial knowledge items if none exist
    const count = await prisma.okfMemory.count({ where: { userId } });
    if (count === 0) {
      await seedDefaultOkfMemories(
        userId,
        user.name ?? 'Friend',
        user.mate?.name ?? 'AstroMate',
        user.zodiacSign ?? 'Aries',
        user.country ?? 'IN'
      );
    }

    const memories = await prisma.okfMemory.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const items: OkfMemoryItem[] = memories.map((m) => {
      let tags: string[] = [];
      try {
        tags = JSON.parse(m.tags);
      } catch {}

      const itemData = {
        id: m.id,
        userId: m.userId,
        type: m.type as any,
        category: m.category as any,
        title: m.title,
        tags,
        confidence: m.confidence,
        content: m.content,
        sourceRange: m.sourceRange,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      };

      return {
        ...itemData,
        rawOkf: serializeToOkf(itemData),
      };
    });

    // Compute stats
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    items.forEach((item) => {
      byType[item.type] = (byType[item.type] ?? 0) + 1;
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
    });

    const response: OkfBundleResponse = {
      memories: items,
      stats: {
        total: items.length,
        byType,
        byCategory,
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error('[OKF Route] Error fetching memories:', err);
    return res.status(500).json({ error: 'Failed to retrieve OKF memories' });
  }
});

/**
 * POST /api/okf/:userId
 * Create a new OKF knowledge item manually.
 */
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { type, category, title, tags, content, confidence } =
      req.body as CreateOkfMemoryRequest;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const memory = await prisma.okfMemory.create({
      data: {
        userId,
        type: type ?? 'personal_fact',
        category: category ?? 'personal',
        title: title.trim(),
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        confidence: confidence ?? 1.0,
        content: content.trim(),
        sourceRange: 'user_created',
      },
    });

    const itemData = {
      id: memory.id,
      userId: memory.userId,
      type: memory.type as any,
      category: memory.category as any,
      title: memory.title,
      tags: Array.isArray(tags) ? tags : [],
      confidence: memory.confidence,
      content: memory.content,
      createdAt: memory.createdAt.toISOString(),
      updatedAt: memory.updatedAt.toISOString(),
    };

    return res.status(201).json({
      success: true,
      memory: {
        ...itemData,
        rawOkf: serializeToOkf(itemData),
      },
    });
  } catch (err) {
    console.error('[OKF Route] Create error:', err);
    return res.status(500).json({ error: 'Failed to create OKF memory' });
  }
});

/**
 * PATCH /api/okf/:userId/:memoryId
 * Updates an existing knowledge item.
 */
router.patch('/:userId/:memoryId', async (req: Request, res: Response) => {
  try {
    const { userId, memoryId } = req.params;
    const { title, content, type, category, tags } = req.body;

    const existing = await prisma.okfMemory.findFirst({
      where: { id: memoryId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const updated = await prisma.okfMemory.update({
      where: { id: memoryId },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(content ? { content: content.trim() } : {}),
        ...(type ? { type } : {}),
        ...(category ? { category } : {}),
        ...(tags ? { tags: JSON.stringify(Array.isArray(tags) ? tags : []) } : {}),
      },
    });

    let tagList: string[] = [];
    try {
      tagList = JSON.parse(updated.tags);
    } catch {}

    const itemData = {
      id: updated.id,
      userId: updated.userId,
      type: updated.type as any,
      category: updated.category as any,
      title: updated.title,
      tags: tagList,
      confidence: updated.confidence,
      content: updated.content,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    return res.status(200).json({
      success: true,
      memory: {
        ...itemData,
        rawOkf: serializeToOkf(itemData),
      },
    });
  } catch (err) {
    console.error('[OKF Route] Update error:', err);
    return res.status(500).json({ error: 'Failed to update OKF memory' });
  }
});

/**
 * DELETE /api/okf/:userId/:memoryId
 * Deletes a knowledge item (privacy forget).
 */
router.delete('/:userId/:memoryId', async (req: Request, res: Response) => {
  try {
    const { userId, memoryId } = req.params;

    const existing = await prisma.okfMemory.findFirst({
      where: { id: memoryId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    await prisma.okfMemory.delete({ where: { id: memoryId } });

    console.log(`[OKF Route] Deleted memory "${existing.title}" for user ${userId}`);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[OKF Route] Delete error:', err);
    return res.status(500).json({ error: 'Failed to delete OKF memory' });
  }
});

/**
 * GET /api/okf/:userId/export
 * Exports all memories as a combined Open Knowledge bundle text.
 */
router.get('/:userId/export', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { mate: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const memories = await prisma.okfMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const bundleHeader = `# Open Knowledge Format (OKF) Bundle
# Companion: ${user.mate?.name ?? 'AstroMate'}
# User: ${user.name ?? 'Friend'}
# Generated: ${new Date().toISOString()}
# Total Knowledge Units: ${memories.length}
================================================================

`;

    const serializedFiles = memories.map((m) => {
      let tags: string[] = [];
      try {
        tags = JSON.parse(m.tags);
      } catch {}

      return serializeToOkf({
        id: m.id,
        type: m.type,
        category: m.category,
        title: m.title,
        tags,
        confidence: m.confidence,
        content: m.content,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      });
    });

    const fullExport = bundleHeader + serializedFiles.join('\n\n');

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${(user.mate?.name ?? 'astromate').toLowerCase()}-knowledge-bundle.okf.md"`
    );
    return res.status(200).send(fullExport);
  } catch (err) {
    console.error('[OKF Route] Export error:', err);
    return res.status(500).json({ error: 'Failed to export OKF bundle' });
  }
});

export default router;
