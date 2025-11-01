import type { PageServerLoad } from './$types';
import { readPage } from '$lib/server/content';

export const load: PageServerLoad = async () => {
	try {
		const pageData = await readPage('about');

		return {
			pageData
		};
	} catch (error) {
		console.error('Error loading about page:', error);
		return {
			pageData: null,
			error: 'Failed to load page content'
		};
	}
};
