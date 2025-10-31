import type { PageLoad } from './$types';
import type { PageContent } from '$lib/types/content';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/content/pages/about');

		if (!response.ok) {
			throw new Error('Failed to load about page');
		}

		const pageData: PageContent = await response.json();

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
