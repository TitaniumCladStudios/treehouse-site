import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

/**
 * POST /api/upload
 * Upload and optimize an image file
 * Automatically converts to WebP format for optimal size/quality
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

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

		// Ensure uploads directory exists
		const uploadsDir = join(process.cwd(), 'static', 'uploads');
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true });
		}

		// Process image with sharp
		const buffer = Buffer.from(await file.arrayBuffer());
		const filepath = join(uploadsDir, filename);

		await sharp(buffer)
			.webp({
				quality: 85, // High quality while maintaining good compression
				effort: 6 // Higher effort = better compression (0-6, default 4)
			})
			.toFile(filepath);

		// Return public URL
		const publicUrl = `/uploads/${filename}`;

		return json({ url: publicUrl }, { status: 201 });
	} catch (error) {
		console.error('Error uploading file:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};
