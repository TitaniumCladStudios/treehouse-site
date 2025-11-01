import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listPages, savePage } from '$lib/server/content';
import type { PageContent } from '$lib/types/content';
import { buildGitAuthor } from '$lib/server/git';

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
interface PageMutationPayload extends PageContent {
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as PageMutationPayload;
		const { commitMessage, authorName, authorEmail, branch } = payload;

		const page: PageContent = {
			metadata: payload.metadata,
			fields: payload.fields
		};

		if (!page.metadata?.slug) {
			return json({ error: 'Page slug is required' }, { status: 400 });
		}

		if (!page.metadata?.title) {
			return json({ error: 'Page title is required' }, { status: 400 });
		}

		await savePage(page.metadata.slug, page, {
			commitMessage,
			author: buildGitAuthor(authorName, authorEmail),
			branch
		});

		return json({ success: true, slug: page.metadata.slug }, { status: 201 });
	} catch (error) {
		console.error('Error creating page:', error);
		return json({ error: 'Failed to create page' }, { status: 500 });
	}
};
