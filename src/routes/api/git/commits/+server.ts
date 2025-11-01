import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCommitStats } from '$lib/server/git';

/**
 * GET /api/git/commits
 * Get commit statistics from GitHub
 */
export const GET: RequestHandler = async ({ url }) => {
	try {
		const limitParam = url.searchParams.get('limit');
		const limit = limitParam ? parseInt(limitParam, 10) : 10;

		const stats = await getCommitStats(limit);

		return json(stats);
	} catch (error) {
		console.error('Error fetching commit stats:', error);
		return json({ error: 'Failed to fetch commit stats' }, { status: 500 });
	}
};
