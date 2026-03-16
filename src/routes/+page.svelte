<script lang="ts">
	import type { PageData } from './$types';
	import {
		Navigation,
		Hero,
		Welcome,
		VenueFeatures,
		Experience,
		Gallery,
		Contact
	} from '$lib/components/site';

	let { data }: { data: PageData } = $props();

	// Helper to get field value by ID
	function getField(id: string): string {
		return data.pageData?.fields.find((f) => f.id === id)?.value || '';
	}

	// Get expanded content - uses the field label converted to slug
	const heroImages = $derived(data.pageData?.expandedFields?.hero_images || []);
	const features = $derived(data.pageData?.expandedFields?.features || []);
	const highlights = $derived(data.pageData?.expandedFields?.highlights || []);
	const galleryImages = $derived(data.pageData?.expandedFields?.gallery || []);
	const navLinks = $derived(data.pageData?.expandedFields?.navigation_links || []);

	// Transform expanded data to component props format
	const heroImagesFormatted = $derived(
		heroImages.map((img: any) => ({
			image: img.fields?.image || '',
			alt_text: img.fields?.alt_text || img.title || ''
		}))
	);

	const featuresFormatted = $derived(
		features.map((f: any) => ({
			title: f.fields?.title || f.title || '',
			description: f.fields?.description || '',
			image: f.fields?.image || '',
			alignment: f.fields?.alignment || 'left'
		}))
	);

	const highlightsFormatted = $derived(
		highlights.map((h: any) => ({
			title: h.fields?.title || h.title || '',
			description: h.fields?.description || '',
			icon: h.fields?.icon || 'heart'
		}))
	);

	const galleryFormatted = $derived(
		galleryImages.map((img: any) => ({
			image: img.fields?.image || '',
			alt_text: img.fields?.alt_text || img.title || '',
			span: img.fields?.column_span || img.fields?.span || '1'
		}))
	);

	const navLinksFormatted = $derived(
		navLinks.map((link: any) => ({
			label: link.fields?.label || link.title || '',
			anchor: link.fields?.anchor || '#',
			order: parseInt(link.fields?.order) || 0
		}))
	);
</script>

<svelte:head>
	<title>{data.settings?.siteName || 'The Tree House'} - Wedding Venue</title>
	<meta name="description" content={data.settings?.siteDescription || ''} />
</svelte:head>

{#if data.error}
	<div class="flex flex-col items-center justify-center min-h-screen py-12">
		<h1 class="mb-4 text-2xl font-bold text-red-600">Error</h1>
		<p class="text-stone-600">{data.error}</p>
	</div>
{:else if data.pageData}
	<Navigation siteName={data.settings?.siteName || 'The Tree House'} navLinks={navLinksFormatted} />

	<Hero
		location={getField('hero_location')}
		title={getField('hero_title')}
		subtitle={getField('hero_subtitle')}
		ctaText={getField('hero_cta_text')}
		images={heroImagesFormatted}
	/>

	<Welcome
		label={getField('welcome_label')}
		heading={getField('welcome_heading')}
		paragraph1={getField('welcome_paragraph_1')}
		paragraph2={getField('welcome_paragraph_2')}
		ctaText={getField('welcome_cta_text')}
	/>

	<VenueFeatures
		label={getField('features_label')}
		heading={getField('features_heading')}
		features={featuresFormatted}
	/>

	<Experience
		label={getField('experience_label')}
		heading={getField('experience_heading')}
		description={getField('experience_description')}
		image={getField('experience_image')}
		highlights={highlightsFormatted}
	/>

	<Gallery
		label={getField('gallery_label')}
		heading={getField('gallery_heading')}
		images={galleryFormatted}
	/>

	<Contact
		label={getField('contact_label')}
		heading={getField('contact_heading')}
		description={getField('contact_description')}
		tourHeading={getField('tour_heading')}
		tourDescription={getField('tour_description')}
		submitText={getField('form_submit_text')}
		siteName={data.settings?.siteName || 'The Tree House'}
		address={data.settings?.address || '12345 Palm Drive, Fort Myers, Florida'}
		phone={data.settings?.phone || '(239) 555-0123'}
		hours={data.settings?.hours || 'Mon - Sat: 9AM - 6PM'}
		email={data.settings?.adminEmail || 'hello@thetreehouse.com'}
		eventsEmail={data.settings?.eventsEmail || 'events@thetreehouse.com'}
	/>
{/if}
