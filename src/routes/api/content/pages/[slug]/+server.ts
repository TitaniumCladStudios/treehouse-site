import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readPage, savePage, deletePage, pageExists } from '$lib/server/content';
import type { PageContent } from '$lib/types/content';
import { buildGitAuthor } from '$lib/server/git';

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
interface PageUpdatePayload extends PageContent {
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const exists = await pageExists(params.slug);

		if (!exists) {
			return json({ error: 'Page not found' }, { status: 404 });
		}

		const payload = (await request.json()) as PageUpdatePayload;
		const { commitMessage, authorName, authorEmail, branch } = payload;

		const data: PageContent = {
			metadata: payload.metadata,
			fields: payload.fields
		};

		// Ensure slug matches
		data.metadata.slug = params.slug;

		await savePage(params.slug, data, {
			commitMessage,
			author: buildGitAuthor(authorName, authorEmail),
			branch
		});

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
export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		const exists = await pageExists(params.slug);

		if (!exists) {
			return json({ error: 'Page not found' }, { status: 404 });
		}

		let commitMessage: string | undefined;
		let branch: string | undefined;
		let authorName: string | undefined;
		let authorEmail: string | undefined;

		const contentType = request.headers.get('content-type') || '';

		if (contentType.includes('application/json')) {
			try {
				const body = await request.json();
				commitMessage = body?.commitMessage;
				branch = body?.branch;
				authorName = body?.authorName;
				authorEmail = body?.authorEmail;
			} catch (parseError) {
				console.warn('Failed to parse DELETE payload for page commit metadata:', parseError);
			}
		}

		await deletePage(params.slug, {
			commitMessage,
			branch,
			author: buildGitAuthor(authorName, authorEmail)
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting page:', error);
		return json({ error: 'Failed to delete page' }, { status: 500 });
	}
};
