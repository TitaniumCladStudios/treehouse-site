import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadSchema, saveSchema, deleteSchema } from '$lib/server/schema';
import type { ContentSchema } from '$lib/types/content';

/**
 * GET /api/schemas/[slug]
 * Get a specific schema
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const schema = await loadSchema(params.slug);
		return json(schema);
	} catch (error) {
		console.error(`Error loading schema ${params.slug}:`, error);
		return json({ error: 'Schema not found' }, { status: 404 });
	}
};

/**
 * PUT /api/schemas/[slug]
 * Update an existing schema
 */
export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const schema = (await request.json()) as ContentSchema;

		// Validate required fields
		if (!schema.slug || !schema.name) {
			return json({ error: 'Schema slug and name are required' }, { status: 400 });
		}

		// Ensure slug matches
		if (schema.slug !== params.slug) {
			return json({ error: 'Schema slug cannot be changed' }, { status: 400 });
		}

		// Update timestamp
		schema.updatedAt = new Date().toISOString();

		await saveSchema(schema);

		return json({ success: true });
	} catch (error) {
		console.error(`Error updating schema ${params.slug}:`, error);
		return json({ error: 'Failed to update schema' }, { status: 500 });
	}
};

/**
 * DELETE /api/schemas/[slug]
 * Delete a schema
 */
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await deleteSchema(params.slug);
		return json({ success: true });
	} catch (error) {
		console.error(`Error deleting schema ${params.slug}:`, error);
		return json({ error: 'Failed to delete schema' }, { status: 500 });
	}
};
