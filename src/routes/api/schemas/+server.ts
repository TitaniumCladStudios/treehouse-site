import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listSchemas, saveSchema } from '$lib/server/schema';
import type { ContentSchema } from '$lib/types/content';
import { buildGitAuthor } from '$lib/server/git';

/**
 * GET /api/schemas
 * List all content type schemas
 */
export const GET: RequestHandler = async () => {
	try {
		const schemas = await listSchemas();
		return json(schemas);
	} catch (error) {
		console.error('Error listing schemas:', error);
		return json({ error: 'Failed to list schemas' }, { status: 500 });
	}
};

/**
 * POST /api/schemas
 * Create a new content type schema
 */
interface SchemaMutationPayload extends ContentSchema {
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as SchemaMutationPayload;
		const { commitMessage, authorName, authorEmail, branch, ...schema } = payload;

		// Validate required fields
		if (!schema.slug || !schema.name) {
			return json({ error: 'Schema slug and name are required' }, { status: 400 });
		}

		// Set timestamps
		schema.createdAt = new Date().toISOString();
		schema.updatedAt = new Date().toISOString();

		await saveSchema(schema, {
			commitMessage,
			author: buildGitAuthor(authorName, authorEmail),
			branch
		});

		return json({ success: true, slug: schema.slug }, { status: 201 });
	} catch (error) {
		console.error('Error creating schema:', error);
		return json({ error: 'Failed to create schema' }, { status: 500 });
	}
};
