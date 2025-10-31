import type { PageLoad } from './$types';
import type { ExpandedPageContent } from '$lib/server/content-expander';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/content/pages/home/expanded');

		if (!response.ok) {
			throw new Error('Failed to load home page');
		}

		const pageData: ExpandedPageContent = await response.json();

		return {
			pageData
		};
	} catch (error) {
		console.error('Error loading home page:', error);
		return {
			pageData: null,
			error: 'Failed to load page content'
		};
	}
};
