import type { PageServerLoad } from './$types';
import { readPage } from '$lib/server/content';
import { expandPageReferences } from '$lib/server/content-expander';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { SiteSettings } from '$lib/types/content';

function getSettingsPath(): string {
	const possiblePaths = [
		join(process.cwd(), 'content', 'settings.json'),
		join(process.cwd(), 'build', 'content', 'settings.json')
	];

	for (const testPath of possiblePaths) {
		if (existsSync(testPath)) {
			return testPath;
		}
	}

	return join(process.cwd(), 'content', 'settings.json');
}

export const load: PageServerLoad = async () => {
	const defaultSettings: SiteSettings = {
		siteName: 'The Tree House',
		siteDescription: 'Where timeless elegance meets natural beauty',
		siteUrl: 'https://thetreehouse.com',
		adminEmail: 'shannon@herday.net'
	};

	let settings: SiteSettings & {
		phone?: string;
		address?: string;
		hours?: string;
		eventsEmail?: string;
	} = defaultSettings;

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
		const page = await readPage('about');
		const expandedPage = await expandPageReferences(page);

		return {
			pageData: expandedPage,
			settings
		};
	} catch (error) {
		console.error('Error loading about page:', error);
		return {
			pageData: null,
			settings,
			error: 'Failed to load page content'
		};
	}
};
