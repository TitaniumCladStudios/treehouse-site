import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyPassword, createSession, getSessionCookieOptions } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { password } = await request.json();

		if (!password) {
			return json({ error: 'Password is required' }, { status: 400 });
		}

		// Verify password
		const isValid = await verifyPassword(password);

		if (!isValid) {
			return json({ error: 'Invalid password' }, { status: 401 });
		}

		// Create session
		const sessionToken = createSession();

		// Set session cookie
		cookies.set('session', sessionToken, getSessionCookieOptions());

		return json({ success: true });
	} catch (error) {
		console.error('Login error:', error);
		return json({ error: 'An error occurred during login' }, { status: 500 });
	}
};
