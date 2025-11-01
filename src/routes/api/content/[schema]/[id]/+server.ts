import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadCollectionItem, saveCollectionItem, deleteCollectionItem } from '$lib/server/schema';
import type { ContentItem } from '$lib/types/content';
import { buildGitAuthor } from '$lib/server/git';

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
interface CollectionUpdatePayload extends ContentItem {
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const payload = (await request.json()) as CollectionUpdatePayload;
		const { commitMessage, authorName, authorEmail, branch, ...data } = payload;

		const item: ContentItem = {
			...data,
			id: params.id,
			schemaSlug: params.schema,
			updatedAt: new Date().toISOString()
		};

		await saveCollectionItem(params.schema, item, {
			commitMessage,
			author: buildGitAuthor(authorName, authorEmail),
			branch,
			itemTitle: item.title
		});

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
export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		let commitMessage: string | undefined;
		let branch: string | undefined;
		let authorName: string | undefined;
		let authorEmail: string | undefined;
		let itemTitle: string | undefined;

		const contentType = request.headers.get('content-type') || '';

		if (contentType.includes('application/json')) {
			try {
				const body = await request.json();
				commitMessage = body?.commitMessage;
				branch = body?.branch;
				authorName = body?.authorName;
				authorEmail = body?.authorEmail;
				itemTitle = body?.title;
			} catch (parseError) {
				console.warn(
					`Failed to parse DELETE payload for collection item ${params.schema}/${params.id}:`,
					parseError
				);
			}
		}

		await deleteCollectionItem(params.schema, params.id, {
			commitMessage,
			branch,
			author: buildGitAuthor(authorName, authorEmail),
			itemTitle
		});
		return json({ success: true });
	} catch (error) {
		console.error(`Error deleting item ${params.schema}/${params.id}:`, error);
		return json({ error: 'Failed to delete content item' }, { status: 500 });
	}
};
