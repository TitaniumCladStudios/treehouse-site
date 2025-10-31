import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readPage } from '$lib/server/content';
import { expandPageReferences } from '$lib/server/content-expander';

/**
 * GET /api/content/pages/[slug]/expanded
 * Get a page with all content references expanded
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		// Load the page
		const page = await readPage(params.slug);

		// Expand all references
		const expandedPage = await expandPageReferences(page);

		return json(expandedPage);
	} catch (error) {
		console.error(`Error loading expanded page ${params.slug}:`, error);
		return json({ error: 'Page not found' }, { status: 404 });
	}
};
