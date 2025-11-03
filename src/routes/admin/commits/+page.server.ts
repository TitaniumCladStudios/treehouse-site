import type { PageServerLoad } from './$types';
import { getCommitStats } from '$lib/server/git';

export const load: PageServerLoad = async () => {
	try {
		const stats = await getCommitStats(50); // Get last 50 commits

		return {
			commits: stats.recent,
			total: stats.total
		};
	} catch (error) {
		console.error('Error loading commits:', error);
		return {
			commits: [],
			total: 0,
			error: 'Failed to load commit history'
		};
	}
};
