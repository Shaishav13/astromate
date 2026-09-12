import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client instance.
 * Uses global caching to prevent multiple instances during Next.js hot reload.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export { prisma };
export * from '@prisma/client';
