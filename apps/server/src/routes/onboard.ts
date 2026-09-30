import { Router, Request, Response } from 'express';
import { prisma } from '@astromate/db';
import { OnboardRequest, OnboardResponse } from '@astromate/shared';
import { getZodiacSign, generatePersonalitySeed } from '../services/astrology';
import { generateVedicProfile } from '../services/vedic';

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

    // Calculate astrology data for user
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
          password: '',
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

    // Find or create AstroMate (born right now at current date/time)
    let mate = await prisma.astroMate.findUnique({ where: { userId: user.id } });

    if (!mate) {
      const buddyBirthTimestamp = new Date();
      const vedic = generateVedicProfile(buddyBirthTimestamp);
      mate = await prisma.astroMate.create({
        data: {
          userId: user.id,
          name: vedic.buddyName,
          buddyBirthTimestamp,
          rashi: vedic.rashi,
          nakshatra: vedic.nakshatra,
          buddyZodiacSign: vedic.westernSign,
        },
      });
      console.log(`[Onboard] AstroMate created: ${vedic.buddyName} for ${name} at ${buddyBirthTimestamp.toISOString()}`);
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
        zodiacSign: (mate.buddyZodiacSign as any) ?? 'aries',
        personality,
        buddyBirthTimestamp: mate.buddyBirthTimestamp.toISOString(),
        rashi: mate.rashi ?? undefined,
        nakshatra: mate.nakshatra ?? undefined,
        userZodiacSign: user.zodiacSign ?? undefined,
        userBirthdate: user.birthdate?.toISOString() ?? undefined,
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
