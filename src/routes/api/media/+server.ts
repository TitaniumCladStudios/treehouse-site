import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface MediaFile {
	filename: string;
	url: string;
	size: number;
	createdAt: string;
}

const UPLOADS_DIR = join(process.cwd(), 'static', 'uploads');

/**
 * GET /api/media
 * List all uploaded images
 */
export const GET: RequestHandler = async () => {
	try {
		// Check if uploads directory exists
		if (!existsSync(UPLOADS_DIR)) {
			return json({ files: [] });
		}

		// Read directory
		const files = await readdir(UPLOADS_DIR);

		// Filter out non-image files and .gitkeep
		const imageFiles = files.filter((file) => {
			const ext = file.toLowerCase().split('.').pop();
			return (
				ext &&
				['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) &&
				file !== '.gitkeep'
			);
		});

		// Get file stats
		const mediaFiles: MediaFile[] = await Promise.all(
			imageFiles.map(async (filename) => {
				const filepath = join(UPLOADS_DIR, filename);
				const stats = await stat(filepath);

				return {
					filename,
					url: `/uploads/${filename}`,
					size: stats.size,
					createdAt: stats.birthtime.toISOString()
				};
			})
		);

		// Sort by creation date (newest first)
		mediaFiles.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		return json({ files: mediaFiles });
	} catch (error) {
		console.error('Error listing media files:', error);
		return json({ error: 'Failed to list media files' }, { status: 500 });
	}
};

/**
 * DELETE /api/media
 * Delete an uploaded image
 */
export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { filename } = await request.json();

		if (!filename) {
			return json({ error: 'Filename is required' }, { status: 400 });
		}

		// Security check: ensure filename doesn't contain path traversal
		if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
			return json({ error: 'Invalid filename' }, { status: 400 });
		}

		const filepath = join(UPLOADS_DIR, filename);

		// Check if file exists
		if (!existsSync(filepath)) {
			return json({ error: 'File not found' }, { status: 404 });
		}

		// Delete file
		await unlink(filepath);

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting media file:', error);
		return json({ error: 'Failed to delete media file' }, { status: 500 });
	}
};
