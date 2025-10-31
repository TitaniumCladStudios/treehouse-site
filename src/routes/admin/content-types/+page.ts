import type { PageLoad } from './$types';
import type { SchemaList } from '$lib/types/content';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/schemas');

		if (!response.ok) {
			throw new Error('Failed to load schemas');
		}

		const data: SchemaList = await response.json();

		return {
			schemas: data.schemas
		};
	} catch (error) {
		console.error('Error loading schemas:', error);
		return {
			schemas: [],
			error: 'Failed to load content types'
		};
	}
};
