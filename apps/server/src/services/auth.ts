import crypto from 'crypto';
import { prisma } from '@astromate/db';

const JWT_SECRET = process.env.JWT_SECRET ?? 'astromate-dev-secret-change-in-production';
const SESSION_DURATION_DAYS = 30;

/**
 * Hashes a password using SHA-256 with a salt.
 * Using built-in crypto to avoid extra dependencies.
 * For production, replace with bcrypt.
 * @param password - Plain text password
 * @returns Hashed password string
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(salt + password)
    .digest('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored hash.
 * @param password - Plain text password to verify
 * @param storedHash - The stored "salt:hash" string
 * @returns True if password matches
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const computed = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(salt + password)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
}

/**
 * Generates a secure session token.
 * @returns A random 64-character hex token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Creates a new auth session in the database.
 * @param userId - The user's ID
 * @returns The session token
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.authSession.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

/**
 * Validates a session token and returns the userId if valid.
 * @param token - The session token from the request header
 * @returns userId if valid, null if invalid/expired
 */
export async function validateSession(token: string): Promise<string | null> {
  if (!token) return null;

  const session = await prisma.authSession.findUnique({
    where: { token },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Clean up expired session
    await prisma.authSession.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return session.userId;
}

/**
 * Deletes a session (logout).
 * @param token - The session token to invalidate
 */
export async function deleteSession(token: string): Promise<void> {
  await prisma.authSession.delete({ where: { token } }).catch(() => {});
}

/**
 * Express middleware to require authentication.
 * Reads token from Authorization header: "Bearer <token>"
 */
export async function requireAuth(
  req: any,
  res: any,
  next: any
): Promise<void> {
  const authHeader = req.headers.authorization as string | undefined;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const userId = await validateSession(token);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    return;
  }

  req.userId = userId;
  next();
}
