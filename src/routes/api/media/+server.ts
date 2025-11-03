import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { commitChanges, buildGitAuthor } from '$lib/server/git';

interface MediaFile {
	filename: string;
	url: string;
	size: number;
	createdAt: string;
}

interface MediaManifest {
	files: MediaFile[];
}

// Find manifest path
function getManifestPath(): string {
	const possiblePaths = [
		join(process.cwd(), 'content', 'media-manifest.json'),
		join(process.cwd(), 'build', 'content', 'media-manifest.json'),
	];

	for (const testPath of possiblePaths) {
		if (existsSync(testPath)) {
			return testPath;
		}
	}

	return join(process.cwd(), 'content', 'media-manifest.json');
}

/**
 * GET /api/media
 * List all uploaded images from manifest
 */
export const GET: RequestHandler = async () => {
	try {
		const manifestPath = getManifestPath();

		if (!existsSync(manifestPath)) {
			return json({ files: [] });
		}

		const manifestContent = await readFile(manifestPath, 'utf-8');
		const manifest: MediaManifest = JSON.parse(manifestContent);

		// Sort by creation date (newest first)
		const sortedFiles = manifest.files.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		return json({ files: sortedFiles });
	} catch (error) {
		console.error('Error listing media files:', error);
		return json({ error: 'Failed to list media files' }, { status: 500 });
	}
};

/**
 * DELETE /api/media
 * Delete an uploaded image
 */
interface MediaDeletePayload {
	filename: string;
	commitMessage?: string;
	authorName?: string;
	authorEmail?: string;
	branch?: string;
}

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as MediaDeletePayload;
		const { filename, commitMessage, authorName, authorEmail, branch } = payload;

		if (!filename) {
			return json({ error: 'Filename is required' }, { status: 400 });
		}

		// Security check: ensure filename doesn't contain path traversal
		if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
			return json({ error: 'Invalid filename' }, { status: 400 });
		}

		// Read manifest
		const manifestPath = getManifestPath();
		let manifest: MediaManifest = { files: [] };

		try {
			const manifestContent = await readFile(manifestPath, 'utf-8');
			manifest = JSON.parse(manifestContent);
		} catch (e) {
			return json({ error: 'Media manifest not found' }, { status: 404 });
		}

		// Check if file exists in manifest
		const fileIndex = manifest.files.findIndex((f) => f.filename === filename);
		if (fileIndex === -1) {
			return json({ error: 'File not found' }, { status: 404 });
		}

		// Remove file from manifest
		manifest.files.splice(fileIndex, 1);
		const manifestJson = JSON.stringify(manifest, null, 2);

		// Try to delete local file (for dev), but don't fail if we can't (production)
		try {
			const uploadsDir = join(process.cwd(), 'static', 'uploads');
			const filepath = join(uploadsDir, filename);
			if (existsSync(filepath)) {
				await unlink(filepath);
			}
		} catch (localDeleteError) {
			console.log('Local delete skipped (read-only filesystem)');
		}

		// Commit both the file deletion and updated manifest
		await commitChanges(
			[
				{
					type: 'delete',
					path: join('static', 'uploads', filename).replace(/\\/g, '/')
				},
				{
					type: 'upsert',
					path: 'content/media-manifest.json',
					content: manifestJson
				}
			],
			{
				message: commitMessage || `Delete media: ${filename}`,
				author: buildGitAuthor(authorName, authorEmail),
				branch
			}
		);

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting media file:', error);
		return json({ error: 'Failed to delete media file' }, { status: 500 });
	}
};
