/**
 * Content type definitions for the CMS
 */

/**
 * Field types available for page content
 */
export type PageFieldType = 'shortText' | 'longText' | 'image';

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
