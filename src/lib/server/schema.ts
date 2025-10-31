/**
 * Server-side schema management functions
 */

import { readdir, readFile, writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { ContentSchema, SchemaList, ContentItem } from '$lib/types/content';

const SCHEMAS_DIR = join(process.cwd(), 'content', 'schemas');
const COLLECTIONS_DIR = join(process.cwd(), 'content', 'collections');

/**
 * List all schemas
 */
export async function listSchemas(): Promise<SchemaList> {
	try {
		if (!existsSync(SCHEMAS_DIR)) {
			return { schemas: [] };
		}

		const files = await readdir(SCHEMAS_DIR);
		const schemaFiles = files.filter((file) => file.endsWith('.json'));

		const schemas = await Promise.all(
			schemaFiles.map(async (file) => {
				const slug = file.replace('.json', '');
				const schema = await loadSchema(slug);

				// Count items in this collection
				const itemCount = await countCollectionItems(slug);

				return {
					slug: schema.slug,
					name: schema.name,
					description: schema.description,
					icon: schema.icon,
					itemCount
				};
			})
		);

		return { schemas };
	} catch (error) {
		console.error('Error listing schemas:', error);
		throw new Error('Failed to list schemas');
	}
}

/**
 * Load a specific schema
 */
export async function loadSchema(slug: string): Promise<ContentSchema> {
	try {
		const filePath = join(SCHEMAS_DIR, `${slug}.json`);

		if (!existsSync(filePath)) {
			throw new Error(`Schema not found: ${slug}`);
		}

		const fileContent = await readFile(filePath, 'utf-8');
		return JSON.parse(fileContent);
	} catch (error) {
		console.error(`Error loading schema ${slug}:`, error);
		throw error;
	}
}

/**
 * Save a schema
 */
export async function saveSchema(schema: ContentSchema): Promise<void> {
	try {
		const filePath = join(SCHEMAS_DIR, `${schema.slug}.json`);
		await writeFile(filePath, JSON.stringify(schema, null, 2), 'utf-8');
	} catch (error) {
		console.error(`Error saving schema ${schema.slug}:`, error);
		throw new Error('Failed to save schema');
	}
}

/**
 * Delete a schema
 */
export async function deleteSchema(slug: string): Promise<void> {
	try {
		const filePath = join(SCHEMAS_DIR, `${slug}.json`);

		if (!existsSync(filePath)) {
			throw new Error(`Schema not found: ${slug}`);
		}

		await unlink(filePath);
	} catch (error) {
		console.error(`Error deleting schema ${slug}:`, error);
		throw error;
	}
}

/**
 * Count items in a collection
 */
async function countCollectionItems(schemaSlug: string): Promise<number> {
	try {
		const collectionDir = join(COLLECTIONS_DIR, schemaSlug);

		if (!existsSync(collectionDir)) {
			return 0;
		}

		const files = await readdir(collectionDir);
		return files.filter((file) => file.endsWith('.json')).length;
	} catch (error) {
		console.error(`Error counting items for ${schemaSlug}:`, error);
		return 0;
	}
}

/**
 * List all items in a collection
 */
export async function listCollectionItems(schemaSlug: string): Promise<ContentItem[]> {
	try {
		const collectionDir = join(COLLECTIONS_DIR, schemaSlug);

		if (!existsSync(collectionDir)) {
			return [];
		}

		const files = await readdir(collectionDir);
		const itemFiles = files.filter((file) => file.endsWith('.json'));

		const items = await Promise.all(
			itemFiles.map(async (file) => {
				const itemId = file.replace('.json', '');
				return await loadCollectionItem(schemaSlug, itemId);
			})
		);

		return items;
	} catch (error) {
		console.error(`Error listing items for ${schemaSlug}:`, error);
		throw new Error('Failed to list collection items');
	}
}

/**
 * Load a specific collection item
 */
export async function loadCollectionItem(
	schemaSlug: string,
	itemId: string
): Promise<ContentItem> {
	try {
		const filePath = join(COLLECTIONS_DIR, schemaSlug, `${itemId}.json`);

		if (!existsSync(filePath)) {
			throw new Error(`Item not found: ${itemId}`);
		}

		const fileContent = await readFile(filePath, 'utf-8');
		return JSON.parse(fileContent);
	} catch (error) {
		console.error(`Error loading item ${schemaSlug}/${itemId}:`, error);
		throw error;
	}
}

/**
 * Save a collection item
 */
export async function saveCollectionItem(
	schemaSlug: string,
	item: ContentItem
): Promise<void> {
	try {
		const collectionDir = join(COLLECTIONS_DIR, schemaSlug);

		// Ensure collection directory exists
		if (!existsSync(collectionDir)) {
			await mkdir(collectionDir, { recursive: true });
			await writeFile(join(collectionDir, '.gitkeep'), '', 'utf-8');
		}

		const filePath = join(collectionDir, `${item.id}.json`);
		await writeFile(filePath, JSON.stringify(item, null, 2), 'utf-8');
	} catch (error) {
		console.error(`Error saving item ${schemaSlug}/${item.id}:`, error);
		throw new Error('Failed to save collection item');
	}
}

/**
 * Delete a collection item
 */
export async function deleteCollectionItem(schemaSlug: string, itemId: string): Promise<void> {
	try {
		const filePath = join(COLLECTIONS_DIR, schemaSlug, `${itemId}.json`);

		if (!existsSync(filePath)) {
			throw new Error(`Item not found: ${itemId}`);
		}

		await unlink(filePath);
	} catch (error) {
		console.error(`Error deleting item ${schemaSlug}/${itemId}:`, error);
		throw error;
	}
}
