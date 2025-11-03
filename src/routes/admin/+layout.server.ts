import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { validateSession } from '$lib/server/auth';
import { listSchemas } from '$lib/server/schema';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { SiteSettings } from '$lib/types/content';

// Disable prerendering for all admin routes
export const prerender = false;
export const ssr = true;

// Find settings path
function getSettingsPath(): string {
	const possiblePaths = [
		join(process.cwd(), 'content', 'settings.json'),
		join(process.cwd(), 'build', 'content', 'settings.json'),
	];

	for (const testPath of possiblePaths) {
		if (existsSync(testPath)) {
			return testPath;
		}
	}

	return join(process.cwd(), 'content', 'settings.json');
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Default settings fallback
	const defaultSettings: SiteSettings = {
		siteName: 'Hyperspace CMS',
		siteDescription: 'A Git-based content management system',
		siteUrl: 'http://localhost:5173',
		adminEmail: 'admin@example.com'
	};

	// Skip auth check for login page
	if (url.pathname === '/admin/login') {
		return {
			settings: defaultSettings,
			schemas: []
		};
	}

	// Validate session
	const sessionToken = cookies.get('session');
	const isValidSession = validateSession(sessionToken);

	if (!isValidSession) {
		throw redirect(303, '/admin/login');
	}

	// Load settings and schemas
	let settings: SiteSettings = defaultSettings;
	let schemas: any[] = [];

	try {
		const settingsPath = getSettingsPath();
		if (existsSync(settingsPath)) {
			const settingsContent = await readFile(settingsPath, 'utf-8');
			settings = JSON.parse(settingsContent);
		}
	} catch (error) {
		console.error('Error loading settings:', error);
	}

	try {
		const schemasData = await listSchemas();
		schemas = schemasData.schemas;
	} catch (error) {
		console.error('Error loading schemas:', error);
	}

	return {
		settings,
		schemas
	};
};
