import { readdir, readFile, writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { PageContent, PageList } from '$lib/types/content';
import { commitChanges, type GitAuthor } from './git';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');

/**
 * Ensure the content directory exists
 */
async function ensureContentDir(): Promise<void> {
	if (!existsSync(CONTENT_DIR)) {
		await mkdir(CONTENT_DIR, { recursive: true });
	}
}

/**
 * Get a list of all pages
 */
export async function listPages(): Promise<PageList> {
	await ensureContentDir();

	try {
		const files = await readdir(CONTENT_DIR);
		const jsonFiles = files.filter((file) => file.endsWith('.json'));

		const pages = await Promise.all(
			jsonFiles.map(async (file) => {
				const content = await readPage(file.replace('.json', ''));
				return {
					slug: content.metadata.slug,
					title: content.metadata.title,
					updatedAt: content.metadata.updatedAt
				};
			})
		);

		return { pages };
	} catch (error) {
		console.error('Error listing pages:', error);
		return { pages: [] };
	}
}

/**
 * Read a single page by slug
 */
export async function readPage(slug: string): Promise<PageContent> {
	await ensureContentDir();

	const filePath = path.join(CONTENT_DIR, `${slug}.json`);

	try {
		const fileContent = await readFile(filePath, 'utf-8');
		return JSON.parse(fileContent) as PageContent;
	} catch (error) {
		throw new Error(`Page "${slug}" not found`);
	}
}

export interface PageCommitOptions {
	commitMessage?: string;
	author?: GitAuthor;
	branch?: string;
}

/**
 * Create or update a page
 */
export async function savePage(
	slug: string,
	content: PageContent,
	options: PageCommitOptions = {}
): Promise<void> {
	await ensureContentDir();

	const filePath = path.join(CONTENT_DIR, `${slug}.json`);
	const fileExisted = existsSync(filePath);

	// Update metadata
	content.metadata.slug = slug;
	content.metadata.updatedAt = new Date().toISOString();

	// If this is a new page, set createdAt
	if (!fileExisted) {
		content.metadata.createdAt = content.metadata.updatedAt;
	}

	const payload = JSON.stringify(content, null, 2);

	try {
		await writeFile(filePath, payload, 'utf-8');

		const relativePath = path
			.join('content', 'pages', `${slug}.json`)
			.replace(/\\/g, '/');

		await commitChanges(
			[
				{
					type: 'upsert',
					path: relativePath,
					content: payload
				}
			],
			{
				message:
					options.commitMessage ||
					(fileExisted ? `Update page: ${slug}` : `Create page: ${slug}`),
				author: options.author,
				branch: options.branch
			}
		);
	} catch (error) {
		console.error('Error saving page:', error);
		throw new Error(`Failed to save page "${slug}"`);
	}
}

/**
 * Delete a page
 */
export async function deletePage(slug: string, options: PageCommitOptions = {}): Promise<void> {
	await ensureContentDir();

	const filePath = path.join(CONTENT_DIR, `${slug}.json`);

	try {
		await unlink(filePath);

		const relativePath = path.join('content', 'pages', `${slug}.json`).replace(/\\/g, '/');

		await commitChanges(
			[
				{
					type: 'delete',
					path: relativePath
				}
			],
			{
				message: options.commitMessage || `Delete page: ${slug}`,
				author: options.author,
				branch: options.branch
			}
		);
	} catch (error) {
		console.error('Error deleting page:', error);
		throw new Error(`Failed to delete page "${slug}"`);
	}
}

/**
 * Check if a page exists
 */
export async function pageExists(slug: string): Promise<boolean> {
	await ensureContentDir();

	const filePath = path.join(CONTENT_DIR, `${slug}.json`);
	return existsSync(filePath);
}
