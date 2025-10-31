import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listCollectionItems, saveCollectionItem } from '$lib/server/schema';
import type { ContentItem } from '$lib/types/content';

/**
 * GET /api/content/[schema]
 * List all items in a collection
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const items = await listCollectionItems(params.schema);
		return json({ items });
	} catch (error) {
		console.error(`Error listing items for ${params.schema}:`, error);
		return json({ error: 'Failed to list content items' }, { status: 500 });
	}
};

/**
 * POST /api/content/[schema]
 * Create a new content item
 */
export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const data = await request.json();

		// Create new item
		const item: ContentItem = {
			id: `item_${Date.now()}`,
			schemaSlug: params.schema,
			title: data.title || 'Untitled',
			fields: data.fields || {},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		await saveCollectionItem(params.schema, item);

		return json({ success: true, id: item.id }, { status: 201 });
	} catch (error) {
		console.error(`Error creating item for ${params.schema}:`, error);
		return json({ error: 'Failed to create content item' }, { status: 500 });
	}
};
