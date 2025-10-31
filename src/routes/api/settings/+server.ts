import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { SiteSettings } from '$lib/types/content';

const SETTINGS_PATH = join(process.cwd(), 'content', 'settings.json');

/**
 * GET /api/settings
 * Get site settings
 */
export const GET: RequestHandler = async () => {
	try {
		const fileContent = await readFile(SETTINGS_PATH, 'utf-8');
		const settings: SiteSettings = JSON.parse(fileContent);

		return json(settings);
	} catch (error) {
		console.error('Error reading settings:', error);
		return json({ error: 'Failed to load settings' }, { status: 500 });
	}
};

/**
 * PUT /api/settings
 * Update site settings
 */
export const PUT: RequestHandler = async ({ request }) => {
	try {
		const settings = (await request.json()) as SiteSettings;

		// Validate required fields
		if (!settings.siteName || !settings.siteUrl) {
			return json({ error: 'Site name and URL are required' }, { status: 400 });
		}

		// Write settings to file
		await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');

		return json({ success: true });
	} catch (error) {
		console.error('Error updating settings:', error);
		return json({ error: 'Failed to update settings' }, { status: 500 });
	}
};
