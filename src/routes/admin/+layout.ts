import type { LayoutLoad } from './$types';
import type { SiteSettings, SchemaList } from '$lib/types/content';

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		// Load settings and schemas in parallel
		const [settingsResponse, schemasResponse] = await Promise.all([
			fetch('/api/settings'),
			fetch('/api/schemas')
		]);

		const settings: SiteSettings = settingsResponse.ok
			? await settingsResponse.json()
			: {
					siteName: 'Hyperspace CMS',
					siteDescription: 'A Git-based content management system',
					siteUrl: 'http://localhost:5173',
					adminEmail: 'admin@example.com'
				};

		const schemasData: SchemaList = schemasResponse.ok
			? await schemasResponse.json()
			: { schemas: [] };

		return {
			settings,
			schemas: schemasData.schemas
		};
	} catch (error) {
		console.error('Error loading layout data:', error);
		return {
			settings: {
				siteName: 'Hyperspace CMS',
				siteDescription: 'A Git-based content management system',
				siteUrl: 'http://localhost:5173',
				adminEmail: 'admin@example.com'
			},
			schemas: []
		};
	}
};
