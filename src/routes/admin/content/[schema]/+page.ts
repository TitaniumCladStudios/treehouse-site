import type { PageLoad } from './$types';
import type { ContentSchema, ContentItem } from '$lib/types/content';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		// Load schema and items in parallel
		const [schemaResponse, itemsResponse] = await Promise.all([
			fetch(`/api/schemas/${params.schema}`),
			fetch(`/api/content/${params.schema}`)
		]);

		if (!schemaResponse.ok) {
			throw new Error('Schema not found');
		}

		const schema: ContentSchema = await schemaResponse.json();
		const { items }: { items: ContentItem[] } = itemsResponse.ok
			? await itemsResponse.json()
			: { items: [] };

		return {
			schema,
			items
		};
	} catch (error) {
		console.error('Error loading content:', error);
		return {
			schema: null,
			items: [],
			error: 'Failed to load content'
		};
	}
};
