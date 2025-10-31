import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const { url, cookies } = event;

	// Check if the request is for an admin route (but not the login page)
	if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
		const sessionToken = cookies.get('session');
		const isValidSession = validateSession(sessionToken);

		if (!isValidSession) {
			// Redirect to login if not authenticated
			throw redirect(303, '/admin/login');
		}
	}

	// If trying to access login page while already authenticated, redirect to admin home
	if (url.pathname === '/admin/login') {
		const sessionToken = cookies.get('session');
		const isValidSession = validateSession(sessionToken);

		if (isValidSession) {
			throw redirect(303, '/admin');
		}
	}

	return resolve(event);
};
