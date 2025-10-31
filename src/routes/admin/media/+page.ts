import type { PageLoad } from './$types';

export interface MediaFile {
	filename: string;
	url: string;
	size: number;
	createdAt: string;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/media');

		if (!response.ok) {
			throw new Error('Failed to load media files');
		}

		const data = await response.json();

		return {
			files: data.files as MediaFile[]
		};
	} catch (error) {
		console.error('Error loading media files:', error);
		return {
			files: [],
			error: 'Failed to load media files'
		};
	}
};
