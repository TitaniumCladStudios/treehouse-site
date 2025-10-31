import type { LayoutLoad } from './$types';
import type { SiteSettings } from '$lib/types/content';

export const load: LayoutLoad = async ({ fetch }) => {
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
		// Return default settings if load fails
		return {
			settings: {
				siteName: 'Hyperspace CMS',
				siteDescription: 'A Git-based content management system',
				siteUrl: 'http://localhost:5173',
				adminEmail: 'admin@example.com'
			}
		};
	}
};
