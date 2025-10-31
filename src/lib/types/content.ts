/**
 * Content type definitions for the CMS
 */

/**
 * Field types available for page content
 */
export type PageFieldType = 'shortText' | 'longText' | 'image' | 'contentReference';

/**
 * A single field in a page's content
 */
export interface PageField {
	/** Unique identifier for the field */
	id: string;
	/** Display label for the field */
	label: string;
	/** Type of field (short text, long text, image) */
	type: PageFieldType;
	/** The actual content value */
	value: string;
	/** For contentReference fields - which schema to reference */
	referenceSchema?: string;
	/** For contentReference fields - allow multiple selections */
	multiple?: boolean;
}

/**
 * Metadata for a page
 */
export interface PageMetadata {
	/** Unique slug/identifier for the page */
	slug: string;
	/** Display title of the page */
	title: string;
	/** When the page was created */
	createdAt: string;
	/** When the page was last updated */
	updatedAt: string;
}

/**
 * Complete page content structure
 */
export interface PageContent {
	/** Page metadata */
	metadata: PageMetadata;
	/** Dynamic fields added by the user */
	fields: PageField[];
}

/**
 * List of all pages (for directory listing)
 */
export interface PageList {
	pages: {
		slug: string;
		title: string;
		updatedAt: string;
	}[];
}

/**
 * Site settings
 */
export interface SiteSettings {
	/** Site name/title */
	siteName: string;
	/** Site description */
	siteDescription: string;
	/** Site URL (used for links to live site) */
	siteUrl: string;
	/** Admin email */
	adminEmail: string;
}

/**
 * Custom Content Type Schemas
 */

/**
 * Field types available for custom content schemas
 */
export type SchemaFieldType =
	| 'shortText'
	| 'longText'
	| 'richText'
	| 'image'
	| 'number'
	| 'boolean'
	| 'date'
	| 'select';

/**
 * A field definition in a content schema
 */
export interface SchemaField {
	/** Unique identifier for the field */
	id: string;
	/** Display label for the field */
	label: string;
	/** Type of field */
	type: SchemaFieldType;
	/** Whether this field is required */
	required: boolean;
	/** Help text shown to editors */
	helpText?: string;
	/** Default value for the field */
	defaultValue?: string;
	/** Options for select fields */
	options?: string[];
}

/**
 * A content type schema definition
 */
export interface ContentSchema {
	/** Unique slug/identifier for the schema */
	slug: string;
	/** Display name of the content type */
	name: string;
	/** Description of what this content type is for */
	description: string;
	/** Icon name (lucide icon) */
	icon: string;
	/** Field definitions for this content type */
	fields: SchemaField[];
	/** When the schema was created */
	createdAt: string;
	/** When the schema was last updated */
	updatedAt: string;
}

/**
 * A content item based on a schema
 */
export interface ContentItem {
	/** Unique identifier for the content item */
	id: string;
	/** The schema this content is based on */
	schemaSlug: string;
	/** Title of the content item */
	title: string;
	/** Field values */
	fields: Record<string, any>;
	/** When the content was created */
	createdAt: string;
	/** When the content was last updated */
	updatedAt: string;
}

/**
 * List of schemas
 */
export interface SchemaList {
	schemas: {
		slug: string;
		name: string;
		description: string;
		icon: string;
		itemCount: number;
	}[];
}
