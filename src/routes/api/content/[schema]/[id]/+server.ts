import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadCollectionItem, saveCollectionItem, deleteCollectionItem } from '$lib/server/schema';
import type { ContentItem } from '$lib/types/content';

/**
 * GET /api/content/[schema]/[id]
 * Get a specific content item
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const item = await loadCollectionItem(params.schema, params.id);
		return json(item);
	} catch (error) {
		console.error(`Error loading item ${params.schema}/${params.id}:`, error);
		return json({ error: 'Content item not found' }, { status: 404 });
	}
};

/**
 * PUT /api/content/[schema]/[id]
 * Update a content item
 */
export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const data = await request.json();

		const item: ContentItem = {
			...data,
			id: params.id,
			schemaSlug: params.schema,
			updatedAt: new Date().toISOString()
		};

		await saveCollectionItem(params.schema, item);

		return json({ success: true });
	} catch (error) {
		console.error(`Error updating item ${params.schema}/${params.id}:`, error);
		return json({ error: 'Failed to update content item' }, { status: 500 });
	}
};

/**
 * DELETE /api/content/[schema]/[id]
 * Delete a content item
 */
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await deleteCollectionItem(params.schema, params.id);
		return json({ success: true });
	} catch (error) {
		console.error(`Error deleting item ${params.schema}/${params.id}:`, error);
		return json({ error: 'Failed to delete content item' }, { status: 500 });
	}
};
