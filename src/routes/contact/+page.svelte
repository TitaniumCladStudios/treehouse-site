<script lang="ts">
	import type { PageData } from './$types';
	import { Navigation, ScrollReveal } from '$lib/components/site';

	let { data }: { data: PageData } = $props();

	const navLinksFormatted = $derived(
		(Array.isArray(data.navLinks) ? data.navLinks : []).map((link: any) => ({
			label: link.fields?.label || link.title || '',
			anchor: link.fields?.anchor || '#',
			order: parseInt(link.fields?.order) || 0
		}))
	);
</script>

<svelte:head>
	<title>Contact - {data.settings?.siteName || 'The Tree House'}</title>
	<meta
		name="description"
		content="Get in touch with The Tree House — a historic wedding venue in Downtown Fort Myers, FL. We'd love to hear from you."
	/>
	<script src="https://link.msgsndr.com/js/form_embed.js"></script>
</svelte:head>

<Navigation siteName={data.settings?.siteName || 'The Tree House'} navLinks={navLinksFormatted} />

<!-- Hero Banner -->
<section class="relative h-[40vh] flex items-center justify-center overflow-hidden bg-stone-900">
	<div
		class="absolute inset-0 bg-[url('/uploads/1773660192403_garden_lights_evening.webp')] bg-cover bg-center opacity-30"
	></div>
	<div class="relative z-10 text-center text-white px-6">
		<p class="text-sm tracking-[0.3em] uppercase opacity-90 mb-4">
			{data.settings?.siteName || 'The Tree House'}
		</p>
		<h1 class="font-cursive text-5xl md:text-7xl mb-4">Contact Us</h1>
		<div class="w-16 h-px bg-white/60 mx-auto mb-6"></div>
		<p class="text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-95">
			We'd Love to Hear From You
		</p>
	</div>
</section>

<!-- Contact Form -->
<section class="py-16 md:py-24 bg-stone-50">
	<div class="max-w-7xl mx-auto px-6 lg:px-12">
		<ScrollReveal>
			<div class="text-center mb-12 md:mb-16">
				<p class="text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">Get in Touch</p>
				<h2 class="font-cursive text-4xl md:text-5xl text-stone-800">Send Us a Message</h2>
				<div class="w-12 h-px bg-stone-300 mx-auto mt-6"></div>
				<p class="text-stone-600 max-w-2xl mx-auto mt-6 leading-relaxed">
					Questions, ideas, or just curious? Fill out the form below and we'll get back to you
					soon.
				</p>
			</div>
		</ScrollReveal>

		<ScrollReveal>
			<div class="max-w-3xl mx-auto bg-white shadow-lg p-6 md:p-8">
				<iframe
					src="https://api.leadconnectorhq.com/widget/form/20GuzmAhFO3hTuQj1qWp"
					style="width:100%;height:688px;border:none;border-radius:4px"
					id="inline-20GuzmAhFO3hTuQj1qWp"
					data-layout={"{'id':'INLINE'}"}
					data-trigger-type="alwaysShow"
					data-trigger-value=""
					data-activation-type="alwaysActivated"
					data-activation-value=""
					data-deactivation-type="neverDeactivate"
					data-deactivation-value=""
					data-form-name="1.0 Optin form (PW Contact Us)"
					data-height="688"
					data-layout-iframe-id="inline-20GuzmAhFO3hTuQj1qWp"
					data-form-id="20GuzmAhFO3hTuQj1qWp"
					title="Contact Us Form"
				></iframe>
			</div>
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
