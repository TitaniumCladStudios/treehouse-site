import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession, getSessionCookieOptions } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const sessionToken = cookies.get('session');

		if (sessionToken) {
			// Delete the session from the session store
			deleteSession(sessionToken);
		}

		// Clear the session cookie
		cookies.delete('session', { path: '/' });

		return json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return json({ error: 'An error occurred during logout' }, { status: 500 });
	}
};
