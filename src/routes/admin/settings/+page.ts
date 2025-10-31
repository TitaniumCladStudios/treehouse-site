import type { PageLoad } from './$types';
import type { SiteSettings } from '$lib/types/content';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/settings');

		if (!response.ok) {
			throw new Error('Failed to load settings');
		}

		const settings: SiteSettings = await response.json();

		return {
			settings
		};
	} catch (error) {
		console.error('Error loading settings:', error);
		return {
			settings: null,
			error: 'Failed to load settings'
		};
	}
};
