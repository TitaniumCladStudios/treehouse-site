import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { SiteSettings } from '$lib/types/content';
import { commitChanges, buildGitAuthor } from '$lib/server/git';

// Robust path resolution for both dev and production (Netlify)
function getSettingsPath(): string {
	const possiblePaths = [
		join(process.cwd(), 'content', 'settings.json'),
		join(process.cwd(), 'build', 'content', 'settings.json'),
		join(process.cwd(), '..', '..', 'content', 'settings.json'),
		join('/var/task', 'content', 'settings.json'),
	];

	for (const testPath of possiblePaths) {
		if (existsSync(testPath)) {
			return testPath;
		}
	}

	return join(process.cwd(), 'content', 'settings.json');
}

const SETTINGS_PATH = getSettingsPath();

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
interface SettingsPayload extends SiteSettings {
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as SettingsPayload;
		const { commitMessage, authorName, authorEmail, branch, ...settings } = payload;

		// Validate required fields
		if (!settings.siteName || !settings.siteUrl) {
			return json({ error: 'Site name and URL are required' }, { status: 400 });
		}

		const serialized = JSON.stringify(settings, null, 2);

		// Write settings to file
		await writeFile(SETTINGS_PATH, serialized, 'utf-8');

		await commitChanges(
			[
				{
					type: 'upsert',
					path: 'content/settings.json',
					content: serialized
				}
			],
			{
				message: commitMessage || 'Update site settings',
				author: buildGitAuthor(authorName, authorEmail),
				branch
			}
		);

		return json({ success: true });
	} catch (error) {
		console.error('Error updating settings:', error);
		return json({ error: 'Failed to update settings' }, { status: 500 });
	}
};
