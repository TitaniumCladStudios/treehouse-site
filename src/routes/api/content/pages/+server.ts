import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listPages, savePage } from '$lib/server/content';
import type { PageContent } from '$lib/types/content';

/**
 * GET /api/content/pages
 * List all pages
 */
export const GET: RequestHandler = async () => {
	try {
		const pages = await listPages();
		return json(pages);
	} catch (error) {
		console.error('Error listing pages:', error);
		return json({ error: 'Failed to list pages' }, { status: 500 });
	}
};

/**
 * POST /api/content/pages
 * Create a new page
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = (await request.json()) as PageContent;

		if (!data.metadata?.slug) {
			return json({ error: 'Page slug is required' }, { status: 400 });
		}

		if (!data.metadata?.title) {
			return json({ error: 'Page title is required' }, { status: 400 });
		}

		await savePage(data.metadata.slug, data);

		return json({ success: true, slug: data.metadata.slug }, { status: 201 });
	} catch (error) {
		console.error('Error creating page:', error);
		return json({ error: 'Failed to create page' }, { status: 500 });
	}
};
