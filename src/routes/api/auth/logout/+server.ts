import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Clear the session cookie
		cookies.delete('session', { path: '/' });

		return json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return json({ error: 'An error occurred during logout' }, { status: 500 });
	}
};
