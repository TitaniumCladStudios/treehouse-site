import type { PageLoad } from './$types';
import type { ContentSchema, ContentItem } from '$lib/types/content';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		// Load schema and item in parallel
		const [schemaResponse, itemResponse] = await Promise.all([
			fetch(`/api/schemas/${params.schema}`),
			fetch(`/api/content/${params.schema}/${params.id}`)
		]);

		if (!schemaResponse.ok) {
			throw new Error('Schema not found');
		}

		if (!itemResponse.ok) {
			throw new Error('Item not found');
		}

		const schema: ContentSchema = await schemaResponse.json();
		const item: ContentItem = await itemResponse.json();

		return {
			schema,
			item
		};
	} catch (error) {
		console.error('Error loading content:', error);
		return {
			schema: null,
			item: null,
			error: 'Failed to load content'
		};
	}
};
