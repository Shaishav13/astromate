import { Router, Request, Response } from 'express';
import { prisma } from '@astromate/db';
import { MateResponse } from '@astromate/shared';
import { generatePersonalitySeed } from '../services/astrology';

const router = Router();

/**
 * GET /api/mate/:userId
 * Returns the full AstroMate profile including personality traits.
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const mate = await prisma.astroMate.findUnique({ where: { userId } });
    if (!mate) return res.status(404).json({ error: 'AstroMate not found' });

    const zodiacSign = user.zodiacSign as any ?? 'aries';
    const personality = user.personalitySeed
      ? JSON.parse(user.personalitySeed)
      : generatePersonalitySeed(zodiacSign);

    const response: MateResponse = {
      mate: {
        id: mate.id,
        name: mate.name,
        relationshipLevel: mate.relationshipLevel as any,
        relationshipScore: mate.relationshipScore,
        totalInteractions: mate.totalInteractions,
        zodiacSign,
        personality,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Mate] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch mate profile' });
  }
});

export default router;
