import cron from 'node-cron';
import { prisma } from '@astromate/db';
import { differenceInHours } from 'date-fns';
import { generatePersonalitySeed } from '../services/astrology';
import { buildSystemPrompt } from '../services/relationship';
import { generateProactiveMessage } from '../services/ollama';

/**
 * Proactive messaging cron job.
 * Runs every hour and checks for users inactive for 24+ hours.
 * Generates a personalized check-in message from their AstroMate.
 */
export function startProactiveCron(): void {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Running proactive message check...');

    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find users who have been inactive for 24+ hours and have a mate
      const inactiveUsers = await prisma.user.findMany({
        where: {
          lastActiveAt: { lt: twentyFourHoursAgo },
          mate: { isNot: null },
        },
        include: {
          mate: true,
          memorySnapshots: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });

      if (inactiveUsers.length === 0) {
        console.log('[Cron] No inactive users found.');
        return;
      }

      console.log(`[Cron] Found ${inactiveUsers.length} inactive user(s). Generating messages...`);

      for (const user of inactiveUsers) {
        if (!user.mate) continue;

        // Check if we already sent a proactive message in the last 24 hours
        const recentProactive = await prisma.message.findFirst({
          where: {
            userId: user.id,
            isProactive: true,
            createdAt: { gt: twentyFourHoursAgo },
          },
        });

        if (recentProactive) {
          console.log(`[Cron] Already sent proactive message to ${user.name}. Skipping.`);
          continue;
        }

        const zodiacSign = user.zodiacSign as any ?? 'aries';
        const personality = user.personalitySeed
          ? JSON.parse(user.personalitySeed)
          : generatePersonalitySeed(zodiacSign);

        const systemPrompt = buildSystemPrompt(
          user.mate,
          user,
          personality,
          user.memorySnapshots
        );

        const daysSinceActive = Math.floor(
          differenceInHours(new Date(), user.lastActiveAt) / 24
        );

        const proactiveText = await generateProactiveMessage(
          systemPrompt,
          user.name ?? 'you',
          daysSinceActive
        );

        await prisma.message.create({
          data: {
            userId: user.id,
            role: 'ASSISTANT',
            content: proactiveText,
            isProactive: true,
          },
        });

        console.log(`[Cron] Proactive message sent to ${user.name}: "${proactiveText.slice(0, 50)}..."`);
      }
    } catch (error) {
      console.error('[Cron] Proactive message error:', error);
    }
  });

  console.log('[Cron] Proactive messaging scheduler started (runs every hour)');
}
