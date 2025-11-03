import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';
import { ADMIN_PASSWORD_HASH, SESSION_SECRET } from '$env/static/private';
import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_COOKIE_NAME = 'session';

interface SessionData {
	userId: string;
	expiresAt: number;
}

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
 * Create HMAC signature for session data
 */
function signSessionData(data: string): string {
	if (!SESSION_SECRET) {
		throw new Error('SESSION_SECRET is not configured');
	}
	return createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
}

/**
 * Verify HMAC signature
 */
function verifySignature(data: string, signature: string): boolean {
	if (!SESSION_SECRET) {
		return false;
	}
	const expectedSignature = signSessionData(data);
	const expectedBuffer = Buffer.from(expectedSignature);
	const actualBuffer = Buffer.from(signature);

	if (expectedBuffer.length !== actualBuffer.length) {
		return false;
	}

	return timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Encode session data into a signed string
 */
function encodeSession(sessionData: SessionData): string {
	const payload = Buffer.from(JSON.stringify(sessionData)).toString('base64');
	const signature = signSessionData(payload);
	return `${payload}.${signature}`;
}

/**
 * Decode and verify signed session string
 */
function decodeSession(sessionString: string): SessionData | null {
	try {
		const [payload, signature] = sessionString.split('.');

		if (!payload || !signature) {
			return null;
		}

		if (!verifySignature(payload, signature)) {
			console.warn('Invalid session signature');
			return null;
		}

		const sessionData = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
		return sessionData;
	} catch (error) {
		console.error('Session decode error:', error);
		return null;
	}
}

/**
 * Create a new session
 */
export function createSession(userId: string = 'admin'): string {
	const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
	const sessionData: SessionData = { userId, expiresAt };
	return encodeSession(sessionData);
}

/**
 * Validate a session token
 */
export function validateSession(sessionToken: string | undefined): boolean {
	if (!sessionToken) {
		return false;
	}

	const sessionData = decodeSession(sessionToken);

	if (!sessionData) {
		return false;
	}

	// Check if session has expired
	if (Date.now() > sessionData.expiresAt) {
		return false;
	}

	return true;
}

/**
 * Delete a session (returns empty string to clear cookie)
 */
export function deleteSession(): string {
	return '';
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
