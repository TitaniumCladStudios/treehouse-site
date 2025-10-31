import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/upload
 * Upload an image file
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

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		if (file.size > maxSize) {
			return json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
		}

		// Generate unique filename
		const timestamp = Date.now();
		const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
		const filename = `${timestamp}_${sanitizedName}`;

		// Ensure uploads directory exists
		const uploadsDir = join(process.cwd(), 'static', 'uploads');
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true });
		}

		// Save file
		const filepath = join(uploadsDir, filename);
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(filepath, buffer);

		// Return public URL
		const publicUrl = `/uploads/${filename}`;

		return json({ url: publicUrl }, { status: 201 });
	} catch (error) {
		console.error('Error uploading file:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};
