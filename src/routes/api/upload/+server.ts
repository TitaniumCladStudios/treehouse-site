import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { commitChanges, buildGitAuthor } from '$lib/server/git';

interface MediaManifest {
	files: Array<{
		filename: string;
		url: string;
		size: number;
		createdAt: string;
	}>;
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
 * POST /api/upload
 * Upload and optimize an image file
 * Automatically converts to WebP format for optimal size/quality
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const commitMessage = formData.get('commitMessage')?.toString();
		const authorName = formData.get('authorName')?.toString();
		const authorEmail = formData.get('authorEmail')?.toString();
		const branch = formData.get('branch')?.toString();

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return json(
				{ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
				{ status: 400 }
			);
		}

		// Validate file size (max 5MB for upload)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		if (file.size > maxSize) {
			return json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
		}

		// Generate unique filename with .webp extension
		const timestamp = Date.now();
		const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove original extension
		const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
		const filename = `${timestamp}_${sanitizedName}.webp`;

		// Process image with sharp
		const buffer = Buffer.from(await file.arrayBuffer());
		const processedBuffer = await sharp(buffer)
			.webp({
				quality: 85,
				effort: 6
			})
			.toBuffer();

		// Try to write locally (for dev), but don't fail if we can't (production)
		try {
			const uploadsDir = join(process.cwd(), 'static', 'uploads');
			if (!existsSync(uploadsDir)) {
				await mkdir(uploadsDir, { recursive: true });
			}
			await writeFile(join(uploadsDir, filename), processedBuffer);
		} catch (localWriteError) {
			console.log('Local write skipped (read-only filesystem)');
		}

		// Read and update manifest
		const manifestPath = getManifestPath();
		let manifest: MediaManifest = { files: [] };

		try {
			const manifestContent = await readFile(manifestPath, 'utf-8');
			manifest = JSON.parse(manifestContent);
		} catch (e) {
			console.log('Creating new manifest');
		}

		// Add new file to manifest
		manifest.files.push({
			filename,
			url: `/uploads/${filename}`,
			size: processedBuffer.length,
			createdAt: new Date().toISOString()
		});

		const manifestJson = JSON.stringify(manifest, null, 2);

		// Commit both the image and updated manifest
		await commitChanges(
			[
				{
					type: 'upsert',
					path: join('static', 'uploads', filename).replace(/\\/g, '/'),
					content: processedBuffer
				},
				{
					type: 'upsert',
					path: 'content/media-manifest.json',
					content: manifestJson
				}
			],
			{
				message: commitMessage || `Upload media: ${filename}`,
				author: buildGitAuthor(authorName, authorEmail),
				branch: branch?.trim()
			}
		);

		return json({ url: `/uploads/${filename}` }, { status: 201 });
	} catch (error) {
		console.error('Error uploading file:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};
