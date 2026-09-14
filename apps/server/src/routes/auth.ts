import { Router, Request, Response } from 'express';
import { prisma } from '@astromate/db';
import { getZodiacSign, generatePersonalitySeed } from '../services/astrology';
import { generateVedicProfile } from '../services/vedic';
import { getCultureProfile } from '../services/culture';
import { hashPassword, verifyPassword, createSession, deleteSession } from '../services/auth';

const router = Router();

/**
 * POST /api/auth/signup
 * Creates a new user account and their AI buddy.
 * The signup timestamp becomes the buddy's birth moment for Vedic astrology.
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, birthdate, country } = req.body;

    if (!name || !email || !password || !birthdate || !country) {
      return res.status(400).json({
        error: 'name, email, password, birthdate, and country are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const birthdateObj = new Date(birthdate);
    if (isNaN(birthdateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid birthdate format' });
    }

    // === USER ASTROLOGY (Western, based on user's DOB) ===
    const userZodiac = getZodiacSign(birthdateObj);
    const userPersonality = generatePersonalitySeed(userZodiac);

    // === BUDDY BIRTH MOMENT = RIGHT NOW (signup timestamp) ===
    const buddyBirthTimestamp = new Date();

    // === BUDDY ASTROLOGY (Vedic, based on signup moment) ===
    const vedicProfile = generateVedicProfile(buddyBirthTimestamp);

    // === CULTURE LAYER (based on user's country) ===
    const cultureProfile = getCultureProfile(country);

    // Build buddy's full personality combining Vedic + culture
    const buddyPersonality = {
      ...vedicProfile,
      culture: cultureProfile,
      sarcasmLevel: 6 + Math.floor(Math.random() * 4), // 6-9 range
      lazinessLevel: 3 + Math.floor(Math.random() * 6), // 3-8 range
    };

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        country,
        birthdate: birthdateObj,
        zodiacSign: userZodiac,
        personalitySeed: JSON.stringify(userPersonality),
        lastActiveAt: new Date(),
      },
    });

    // Create buddy with Vedic profile
    const mate = await prisma.astroMate.create({
      data: {
        userId: user.id,
        name: vedicProfile.buddyName,
        buddyBirthTimestamp,
        rashi: vedicProfile.rashi,
        nakshatra: vedicProfile.nakshatra,
        buddyZodiacSign: vedicProfile.westernSign,
        buddyPersonality: JSON.stringify(buddyPersonality),
      },
    });

    // Create session
    const token = await createSession(user.id);

    console.log(
      `[Auth] New user signed up: ${name} (${userZodiac}) | Buddy: ${mate.name} (${vedicProfile.nakshatra} Nakshatra, ${vedicProfile.rashi} Rashi) | Country: ${country}`
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        zodiacSign: userZodiac,
      },
      mate: {
        id: mate.id,
        name: mate.name,
        rashi: mate.rashi,
        nakshatra: mate.nakshatra,
        buddyZodiacSign: mate.buddyZodiacSign,
        relationshipLevel: mate.relationshipLevel,
        relationshipScore: mate.relationshipScore,
        buddyPersonality,
      },
      isNewUser: true,
    });
  } catch (error) {
    console.error('[Auth] Signup error:', error);
    return res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns a session token.
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { mate: true },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const token = await createSession(user.id);

    console.log(`[Auth] User logged in: ${user.name}`);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        zodiacSign: user.zodiacSign,
      },
      mate: user.mate
        ? {
            id: user.mate.id,
            name: user.mate.name,
            rashi: user.mate.rashi,
            nakshatra: user.mate.nakshatra,
            buddyZodiacSign: user.mate.buddyZodiacSign,
            relationshipLevel: user.mate.relationshipLevel,
            relationshipScore: user.mate.relationshipScore,
          }
        : null,
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/**
 * POST /api/auth/logout
 * Invalidates the current session token.
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) await deleteSession(token);

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
