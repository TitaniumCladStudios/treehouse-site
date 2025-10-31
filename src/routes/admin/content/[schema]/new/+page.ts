import type { PageLoad } from './$types';
import type { ContentSchema } from '$lib/types/content';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const response = await fetch(`/api/schemas/${params.schema}`);

		if (!response.ok) {
			throw new Error('Schema not found');
		}

		const schema: ContentSchema = await response.json();

		return {
			schema
		};
	} catch (error) {
		console.error('Error loading schema:', error);
		return {
			schema: null,
			error: 'Failed to load schema'
		};
	}
};
