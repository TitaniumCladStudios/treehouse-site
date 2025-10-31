import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readPage, savePage, deletePage, pageExists } from '$lib/server/content';
import type { PageContent } from '$lib/types/content';

/**
 * GET /api/content/pages/[slug]
 * Get a specific page
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const page = await readPage(params.slug);
		return json(page);
	} catch (error) {
		console.error('Error reading page:', error);
		return json({ error: 'Page not found' }, { status: 404 });
	}
};

/**
 * PUT /api/content/pages/[slug]
 * Update an existing page
 */
export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const exists = await pageExists(params.slug);

		if (!exists) {
			return json({ error: 'Page not found' }, { status: 404 });
		}

		const data = (await request.json()) as PageContent;

		// Ensure slug matches
		data.metadata.slug = params.slug;

		await savePage(params.slug, data);

		return json({ success: true, slug: params.slug });
	} catch (error) {
		console.error('Error updating page:', error);
		return json({ error: 'Failed to update page' }, { status: 500 });
	}
};

/**
 * DELETE /api/content/pages/[slug]
 * Delete a page
 */
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const exists = await pageExists(params.slug);

		if (!exists) {
			return json({ error: 'Page not found' }, { status: 404 });
		}

		await deletePage(params.slug);

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting page:', error);
		return json({ error: 'Failed to delete page' }, { status: 500 });
	}
};
