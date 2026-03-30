<script lang="ts">
	import type { PageData } from './$types';
	import { Navigation, ScrollReveal } from '$lib/components/site';

	let { data }: { data: PageData } = $props();

	const navLinksFormatted = $derived(
		(Array.isArray(data.navLinks) ? data.navLinks : [])
			.map((link: any) => ({
				label: link.fields?.label || link.title || '',
				anchor: link.fields?.anchor || '#',
				order: parseInt(link.fields?.order) || 0
			}))
	);
</script>

<svelte:head>
	<title>Catering Menu - {data.settings?.siteName || 'The Tree House'}</title>
	<meta name="description" content="View the catering menu for The Tree House wedding venue in Historic Downtown Fort Myers, FL. Wedding & party packages with passed appetizers, protein entrees, and side selections." />
</svelte:head>

<Navigation siteName={data.settings?.siteName || 'The Tree House'} navLinks={navLinksFormatted} />

<!-- Hero Banner -->
<section class="relative h-[40vh] flex items-center justify-center overflow-hidden bg-stone-900">
	<div class="absolute inset-0 bg-[url('/uploads/1774891608016_catering_menu.webp')] bg-cover bg-center opacity-20 blur-sm"></div>
	<div class="relative z-10 text-center text-white px-6">
		<p class="text-sm tracking-[0.3em] uppercase opacity-90 mb-4">{data.settings?.siteName || 'The Tree House'}</p>
		<h1 class="font-cursive text-5xl md:text-7xl mb-4">Catering Menu</h1>
		<div class="w-16 h-px bg-white/60 mx-auto mb-6"></div>
		<p class="text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-95">
			Creating Unforgettable Events
		</p>
	</div>
</section>

<!-- Menu Image -->
<section class="py-16 md:py-24 bg-stone-50">
	<div class="max-w-4xl mx-auto px-6">
		<ScrollReveal>
			<div class="bg-white shadow-lg rounded-sm overflow-hidden">
				<img
					src="/uploads/1774891608016_catering_menu.webp"
					alt="The Tree House Catering Menu - Wedding & Party Packages including passed appetizers, protein entrees, and side selections"
					class="w-full h-auto"
				/>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- CTA Section -->
<section class="py-24 md:py-32 bg-stone-800 text-white">
	<div class="max-w-3xl mx-auto px-6 text-center">
		<ScrollReveal>
			<h2 class="font-cursive text-4xl md:text-5xl mb-8">
				Ready to Plan Your Event?
			</h2>
			<div class="w-16 h-px bg-white/40 mx-auto mb-8"></div>
			<p class="text-lg md:text-xl leading-relaxed text-white/90 mb-12">
				Our catering packages are customizable to make your special day exactly what you've dreamed. Contact us to discuss your menu selections and preferences.
			</p>
			<a
				href="/#contact"
				class="inline-block px-10 py-4 bg-white text-stone-800 tracking-wider hover:bg-stone-100 transition-all"
			>
				Get in Touch
			</a>
		</ScrollReveal>
	</div>
</section>

<!-- Footer -->
<footer class="py-12 bg-stone-50 border-t border-stone-200">
	<div class="max-w-7xl mx-auto px-6 lg:px-12 text-center">
		<p class="font-cursive text-2xl text-stone-800 mb-4">
			{data.settings?.siteName || 'The Tree House'}
		</p>
		<p class="text-sm text-stone-500">
			&copy; {new Date().getFullYear()}
			{data.settings?.siteName || 'The Tree House'}. All rights reserved.
		</p>
	</div>
</footer>
