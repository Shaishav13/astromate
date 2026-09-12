import { Router, Request, Response } from 'express';
import { prisma } from '@astromate/db';
import { OnboardRequest, OnboardResponse } from '@astromate/shared';
import { getZodiacSign, generatePersonalitySeed } from '../services/astrology';

const router = Router();

/**
 * POST /api/onboard
 * Creates or retrieves a user and their AstroMate companion.
 * Calculates zodiac sign and generates personality seed on first load.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, birthdate } = req.body as OnboardRequest;

    if (!name || !email || !birthdate) {
      return res.status(400).json({ error: 'name, email, and birthdate are required' });
    }

    const birthdateObj = new Date(birthdate);
    if (isNaN(birthdateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid birthdate format. Use ISO string.' });
    }

    // Calculate astrology data
    const zodiacSign = getZodiacSign(birthdateObj);
    const personality = generatePersonalitySeed(zodiacSign);

    // Find or create user
    let isNewUser = false;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email,
          name,
          birthdate: birthdateObj,
          zodiacSign,
          personalitySeed: JSON.stringify(personality),
          lastActiveAt: new Date(),
        },
      });
      console.log(`[Onboard] New user created: ${name} (${zodiacSign})`);
    } else {
      // Update lastActiveAt on returning users
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
      console.log(`[Onboard] Returning user: ${name}`);
    }

    // Find or create AstroMate
    let mate = await prisma.astroMate.findUnique({ where: { userId: user.id } });

    if (!mate) {
      mate = await prisma.astroMate.create({
        data: {
          userId: user.id,
          name: personality.suggestedName,
        },
      });
      console.log(`[Onboard] AstroMate created: ${personality.suggestedName} for ${name}`);
    }

    const response: OnboardResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        zodiacSign: user.zodiacSign as any,
        subscriptionTier: user.subscriptionTier as any,
        lastActiveAt: user.lastActiveAt.toISOString(),
      },
      mate: {
        id: mate.id,
        name: mate.name,
        relationshipLevel: mate.relationshipLevel as any,
        relationshipScore: mate.relationshipScore,
        totalInteractions: mate.totalInteractions,
        zodiacSign: zodiacSign,
        personality,
      },
      isNewUser,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Onboard] Error:', error);
    return res.status(500).json({ error: 'Internal server error during onboarding' });
  }
});

export default router;
