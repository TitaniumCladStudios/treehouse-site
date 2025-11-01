import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadSchema, saveSchema, deleteSchema } from '$lib/server/schema';
import type { ContentSchema } from '$lib/types/content';
import { buildGitAuthor } from '$lib/server/git';

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
interface SchemaUpdatePayload extends ContentSchema {
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const payload = (await request.json()) as SchemaUpdatePayload;
		const { commitMessage, authorName, authorEmail, branch, ...schema } = payload;

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

		await saveSchema(schema, {
			commitMessage,
			author: buildGitAuthor(authorName, authorEmail),
			branch
		});

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
export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
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
				console.warn(`Failed to parse DELETE payload for schema ${params.slug}:`, parseError);
			}
		}

		await deleteSchema(params.slug, {
			commitMessage,
			branch,
			author: buildGitAuthor(authorName, authorEmail)
		});
		return json({ success: true });
	} catch (error) {
		console.error(`Error deleting schema ${params.slug}:`, error);
		return json({ error: 'Failed to delete schema' }, { status: 500 });
	}
};
