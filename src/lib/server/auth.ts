import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';
import { ADMIN_PASSWORD_HASH } from '$env/static/private';

const SESSION_COOKIE_NAME = 'session';

// Session store (in production, consider using Redis or a database)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

/**
 * Verify a password against the admin password hash from environment
 */
export async function verifyPassword(password: string): Promise<boolean> {
	if (!ADMIN_PASSWORD_HASH) {
		console.error('ADMIN_PASSWORD_HASH environment variable is not set');
		return false;
	}

	try {
		const result = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
		return result;
	} catch (error) {
		console.error('Password verification error:', error);
		return false;
	}
}

/**
 * Generate a random session token
 */
function generateSessionToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new session
 */
export function createSession(userId: string = 'admin'): string {
	const sessionToken = generateSessionToken();
	const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

	sessions.set(sessionToken, { userId, expiresAt });

	// Clean up expired sessions periodically
	cleanupExpiredSessions();

	return sessionToken;
}

/**
 * Validate a session token
 */
export function validateSession(sessionToken: string | undefined): boolean {
	if (!sessionToken) {
		return false;
	}

	const session = sessions.get(sessionToken);

	if (!session) {
		return false;
	}

	// Check if session has expired
	if (Date.now() > session.expiresAt) {
		sessions.delete(sessionToken);
		return false;
	}

	return true;
}

/**
 * Delete a session
 */
export function deleteSession(sessionToken: string): void {
	sessions.delete(sessionToken);
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions(): void {
	const now = Date.now();
	for (const [token, session] of sessions.entries()) {
		if (now > session.expiresAt) {
			sessions.delete(token);
		}
	}
}

/**
 * Get cookie options for session cookie
 */
export function getSessionCookieOptions() {
	return {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax' as const,
		maxAge: 60 * 60 * 24 // 24 hours
	};
}

/**
 * Hash a password (utility for generating ADMIN_PASSWORD_HASH)
 */
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 10);
}
