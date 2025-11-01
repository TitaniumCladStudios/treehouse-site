import type { PageServerLoad } from './$types';
import { readPage } from '$lib/server/content';
import { expandPageReferences } from '$lib/server/content-expander';

export const load: PageServerLoad = async () => {
	try {
		const page = await readPage('home');
		const expandedPage = await expandPageReferences(page);

		return {
			pageData: expandedPage
		};
	} catch (error) {
		console.error('Error loading home page:', error);
		return {
			pageData: null,
			error: 'Failed to load page content'
		};
	}
};
