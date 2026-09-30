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

    // Companion's own zodiac sign and personality based on its birth timestamp
    const mateZodiac = (mate.buddyZodiacSign as any) ?? 'aries';
    const buddyPersonality = mate.buddyPersonality
      ? JSON.parse(mate.buddyPersonality)
      : generatePersonalitySeed(mateZodiac);

    const response: MateResponse = {
      mate: {
        id: mate.id,
        name: mate.name,
        relationshipLevel: mate.relationshipLevel as any,
        relationshipScore: mate.relationshipScore,
        totalInteractions: mate.totalInteractions,
        zodiacSign: mateZodiac,
        personality: buddyPersonality,
        buddyBirthTimestamp: mate.buddyBirthTimestamp.toISOString(),
        rashi: mate.rashi ?? undefined,
        nakshatra: mate.nakshatra ?? undefined,
        userZodiacSign: user.zodiacSign ?? undefined,
        userBirthdate: user.birthdate?.toISOString() ?? undefined,
        userName: user.name ?? undefined,
        userEmail: user.email,
        country: user.country,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Mate] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch mate profile' });
  }
});

/**
 * PATCH /api/mate/:userId
 * Updates the companion's name.
 */
router.patch('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Valid companion name is required' });
    }

    const updated = await prisma.astroMate.update({
      where: { userId },
      data: { name: name.trim() },
    });

    console.log(`[Mate] Companion renamed to "${updated.name}" for user ${userId}`);

    return res.status(200).json({
      success: true,
      mate: {
        id: updated.id,
        name: updated.name,
      },
    });
  } catch (error) {
    console.error('[Mate] Update error:', error);
    return res.status(500).json({ error: 'Failed to update companion name' });
  }
});

export default router;
