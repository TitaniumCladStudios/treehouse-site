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
	<title>Pricing - {data.settings?.siteName || 'The Tree House'}</title>
	<meta
		name="description"
		content="Download our pricing brochure and start planning your wedding at The Tree House — a historic wedding venue in Downtown Fort Myers, FL."
	/>
	<script src="https://link.msgsndr.com/js/form_embed.js"></script>
</svelte:head>

<Navigation siteName={data.settings?.siteName || 'The Tree House'} navLinks={navLinksFormatted} />

<!-- Hero Banner -->
<section class="relative h-[40vh] flex items-center justify-center overflow-hidden bg-stone-900">
	<div
		class="absolute inset-0 bg-[url('/uploads/1773660192403_banyan_tree_wide.webp')] bg-cover bg-center opacity-30"
	></div>
	<div class="relative z-10 text-center text-white px-6">
		<p class="text-sm tracking-[0.3em] uppercase opacity-90 mb-4">
			{data.settings?.siteName || 'The Tree House'}
		</p>
		<h1 class="font-cursive text-5xl md:text-7xl mb-4">Pricing</h1>
		<div class="w-16 h-px bg-white/60 mx-auto mb-6"></div>
		<p class="text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-95">
			Begin Your Story With Us
		</p>
	</div>
</section>

<!-- Brochure + Form -->
<section class="py-16 md:py-24 bg-stone-50">
	<div class="max-w-7xl mx-auto px-6 lg:px-12">
		<ScrollReveal>
			<div class="text-center mb-12 md:mb-16">
				<p class="text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">Investment</p>
				<h2 class="font-cursive text-4xl md:text-5xl text-stone-800">Request Our Brochure</h2>
				<div class="w-12 h-px bg-stone-300 mx-auto mt-6"></div>
				<p class="text-stone-600 max-w-2xl mx-auto mt-6 leading-relaxed">
					Share a few details and we'll send our full pricing brochure along with everything you
					need to start planning your day.
				</p>
			</div>
		</ScrollReveal>

		<div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
			<ScrollReveal>
				<div class="bg-white shadow-lg overflow-hidden">
					<img
						src="/uploads/pricing_brochure.png"
						alt="The Tree House 2025 Pricing Brochure cover"
						class="w-full h-auto"
					/>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="bg-white shadow-lg p-6 md:p-8">
					<iframe
						src="https://api.leadconnectorhq.com/widget/form/ShoXHGKOy2kyfwfPFAnQ"
						style="width:100%;height:686px;border:none;border-radius:4px"
						id="inline-ShoXHGKOy2kyfwfPFAnQ"
						data-layout={"{'id':'INLINE'}"}
						data-trigger-type="alwaysShow"
						data-trigger-value=""
						data-activation-type="alwaysActivated"
						data-activation-value=""
						data-deactivation-type="neverDeactivate"
						data-deactivation-value=""
						data-form-name="1.0 Optin form (PW Wed brochure24)"
						data-height="686"
						data-layout-iframe-id="inline-ShoXHGKOy2kyfwfPFAnQ"
						data-form-id="ShoXHGKOy2kyfwfPFAnQ"
						title="Pricing Brochure Request Form"
					></iframe>
				</div>
			</ScrollReveal>
		</div>
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
