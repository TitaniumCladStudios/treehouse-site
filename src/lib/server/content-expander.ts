/**
 * Content expansion utilities
 * Expands content references in pages
 */

import { loadCollectionItem, loadSchema } from './schema';
import type { PageContent, ContentItem, ContentSchema } from '$lib/types/content';

export interface ExpandedPageContent extends PageContent {
	expandedFields?: Record<string, ContentItem | ContentItem[]>;
}

/**
 * Convert a label to a slug (lowercase, hyphens, no special chars)
 */
function labelToSlug(label: string): string {
	return label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

/**
 * Transform content item fields from field IDs to label-based keys
 */
async function transformContentItemFields(item: ContentItem): Promise<ContentItem> {
	try {
		// Load the schema to get field definitions
		const schema = await loadSchema(item.schemaSlug);

		// Create mapping from field ID to label slug
		const fieldMap: Record<string, string> = {};
		for (const field of schema.fields) {
			fieldMap[field.id] = labelToSlug(field.label);
		}

		// Transform the fields object
		const transformedFields: Record<string, any> = {};
		for (const [fieldId, value] of Object.entries(item.fields)) {
			const labelKey = fieldMap[fieldId] || fieldId; // Fallback to original ID if not found
			transformedFields[labelKey] = value;
		}

		return {
			...item,
			fields: transformedFields
		};
	} catch (error) {
		console.error(`Error transforming fields for item ${item.id}:`, error);
		return item; // Return original if transformation fails
	}
}

/**
 * Expand all content references in a page
 */
export async function expandPageReferences(page: PageContent): Promise<ExpandedPageContent> {
	const expandedFields: Record<string, ContentItem | ContentItem[]> = {};

	// Find all contentReference fields
	const referenceFields = page.fields.filter((field) => field.type === 'contentReference');

	// Load referenced content
	for (const field of referenceFields) {
		if (!field.value || !field.referenceSchema) continue;

		try {
			// Check if multiple references (comma-separated IDs)
			const ids = field.value.split(',').map((id) => id.trim()).filter(Boolean);

			// Use field label as key instead of field ID
			const key = labelToSlug(field.label);

			if (ids.length === 1) {
				// Single reference
				const item = await loadCollectionItem(field.referenceSchema, ids[0]);
				const transformedItem = await transformContentItemFields(item);
				expandedFields[key] = transformedItem;
			} else if (ids.length > 1) {
				// Multiple references
				const items = await Promise.all(
					ids.map((id) => loadCollectionItem(field.referenceSchema!, id))
				);
				// Transform all items
				const transformedItems = await Promise.all(
					items.map((item) => transformContentItemFields(item))
				);
				expandedFields[key] = transformedItems;
			}
		} catch (error) {
			console.error(`Error expanding reference ${field.id}:`, error);
			// Continue with other fields even if one fails
		}
	}

	return {
		...page,
		expandedFields
	};
}
