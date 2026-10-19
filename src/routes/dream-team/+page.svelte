<script lang="ts">
	import type { PageData } from './$types';
	import { Navigation, ScrollReveal } from '$lib/components/site';
	import { Users } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	function getField(id: string): string {
		return data.pageData?.fields.find((f) => f.id === id)?.value || '';
	}

	// Split a newline-separated CMS field into trimmed, non-empty lines
	function getLines(id: string): string[] {
		return getField(id)
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);
	}

	const vendors = $derived(data.pageData?.expandedFields?.vendors || []);

	const vendorsFormatted = $derived(
		(Array.isArray(vendors) ? vendors : [vendors])
			.map((v: any) => ({
				id: v.id,
				role: v.fields?.role || '',
				name: v.fields?.name || v.title || '',
				line: v.fields?.line || '',
				linkLabel: v.fields?.link_label || '',
				linkUrl: v.fields?.link_url || '',
				image: v.fields?.image || '',
				order: parseFloat(v.fields?.order) || 0
			}))
			.sort((a: any, b: any) => a.order - b.order)
	);

	const navLinksFormatted = $derived(
		(Array.isArray(data.navLinks) ? data.navLinks : []).map((link: any) => ({
			label: link.fields?.label || link.title || '',
			anchor: link.fields?.anchor || '#',
			order: parseFloat(link.fields?.order) || 0
		}))
	);

	const doneItems = $derived(getLines('done_items'));
	const trustLines = $derived(getLines('trust_lines'));

	const phone = $derived(data.settings?.phone || '');
	const phoneHref = $derived('tel:' + phone.replace(/\D/g, ''));
</script>

<svelte:head>
	<title>Dream Team - {data.settings?.siteName || 'The Tree House'}</title>
	<meta name="description" content={getField('meta_description')} />
</svelte:head>

{#if data.error}
	<div class="flex min-h-screen flex-col items-center justify-center py-12">
		<h1 class="mb-4 text-2xl font-bold text-red-600">Error</h1>
		<p class="text-stone-600">{data.error}</p>
	</div>
{:else if data.pageData}
	<Navigation
		siteName={data.settings?.siteName || 'The Tree House'}
		navLinks={navLinksFormatted}
		lightBackground
	/>

	<!-- Hero -->
	<section class="bg-stone-50 pt-32 pb-16 md:pt-40 md:pb-20">
		<div class="mx-auto max-w-[1200px] px-6 lg:px-12">
			<div class="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
				<ScrollReveal>
					<div class="flex flex-col gap-6">
						<p class="text-sm tracking-[0.3em] text-stone-500 uppercase">
							{getField('hero_eyebrow')}
						</p>
						<h1 class="font-cursive text-5xl leading-[1.15] text-stone-800 md:text-6xl lg:text-7xl">
							{getField('hero_heading')}
							{getField('hero_heading_emphasis')}
						</h1>
						<p class="max-w-[520px] text-lg leading-relaxed text-stone-600">
							{getField('hero_body')}
						</p>
					</div>
				</ScrollReveal>
				<ScrollReveal>
					<img
						src={getField('hero_image')}
						alt="The wedding party beneath the banyan tree at The Tree House"
						class="aspect-[4/5] w-full object-cover"
					/>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<!-- Story -->
	<section class="border-y border-stone-200 bg-stone-50">
		<div class="mx-auto max-w-[820px] px-6 py-20 text-center md:py-24">
			<ScrollReveal>
				<div class="flex flex-col items-center gap-7">
					<p class="text-2xl leading-relaxed text-stone-700 md:text-3xl">
						{getField('story_lead')}
					</p>
					<p class="max-w-[640px] leading-relaxed text-stone-600">
						{getField('story_body')}
					</p>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Team -->
	<section class="bg-stone-50 py-24 md:py-28">
		<div class="mx-auto max-w-[1200px] px-6 lg:px-12">
			<ScrollReveal>
				<div class="mb-14 flex max-w-[640px] flex-col gap-4">
					<h2 class="text-3xl tracking-wide text-stone-800 md:text-4xl">
						{getField('team_heading')}
					</h2>
					<div class="h-px w-12 bg-stone-300"></div>
					<p class="leading-relaxed text-stone-600">
						{getField('team_intro')}
					</p>
				</div>
			</ScrollReveal>

			<div class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{#each vendorsFormatted as vendor (vendor.id)}
					<ScrollReveal>
						<article class="flex flex-col gap-3.5">
							{#if vendor.image}
								<img
									src={vendor.image}
									alt={vendor.name}
									class="aspect-[4/3] w-full object-cover"
								/>
							{:else}
								<div class="flex aspect-[4/3] w-full items-center justify-center bg-stone-200">
									<Users size={32} class="text-stone-400" />
								</div>
							{/if}
							<p class="text-sm tracking-wider text-stone-500 uppercase">
								{vendor.role}
							</p>
							<h3 class="font-cursive text-3xl leading-tight text-stone-800">
								{vendor.name}
							</h3>
							<p class="leading-relaxed text-stone-600">
								{vendor.line}
							</p>
							{#if vendor.linkUrl && vendor.linkLabel}
								<a
									href={vendor.linkUrl}
									target="_blank"
									rel="noopener"
									class="w-fit text-stone-700 underline underline-offset-[3px] transition-colors hover:text-stone-900"
								>
									{vendor.linkLabel}
								</a>
							{/if}
						</article>
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</section>

	<!-- One Team -->
	<section class="bg-stone-800 text-white">
		<div class="mx-auto max-w-[1000px] px-6 py-24 text-center md:py-28">
			<ScrollReveal>
				<div class="flex flex-col items-center gap-6">
					<p class="text-2xl leading-snug md:text-4xl">
						{getField('oneteam_quote')}
						<em class="text-white/90">{getField('oneteam_quote_emphasis')}</em>
					</p>
					<div class="h-px w-16 bg-white/40"></div>
					<p class="text-sm tracking-[0.2em] text-white/70 uppercase">
						{getField('oneteam_tag')}
					</p>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Done For You -->
	<section class="bg-stone-50 py-24 md:py-28">
		<div class="mx-auto max-w-[1200px] px-6 lg:px-12">
			<div class="grid grid-cols-1 gap-14 lg:grid-cols-2">
				<ScrollReveal>
					<div class="flex flex-col gap-5">
						<h2 class="text-3xl tracking-wide text-stone-800 md:text-4xl">
							{getField('done_heading')}
						</h2>
						<div class="h-px w-12 bg-stone-300"></div>
						<p class="max-w-[480px] leading-relaxed text-stone-600">
							{getField('done_body')}
						</p>
					</div>
				</ScrollReveal>
				<ScrollReveal>
					<div class="flex flex-col">
						<p class="pb-4 text-sm tracking-wider text-stone-500 uppercase">
							{getField('done_label')}
						</p>
						{#each doneItems as item, i (i)}
							<div
								class="border-t border-stone-200 py-[18px] text-xl text-stone-700 md:text-2xl {i ===
								doneItems.length - 1
									? 'border-b'
									: ''}"
							>
								{item}
							</div>
						{/each}
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<!-- Trust -->
	<section class="border-t border-stone-200 bg-stone-50">
		<div class="mx-auto max-w-[820px] px-6 py-24 text-center md:py-28">
			<ScrollReveal>
				<div class="flex flex-col items-center gap-8">
					<p class="max-w-[560px] leading-relaxed text-stone-600">
						{getField('trust_body')}
					</p>
					<div class="flex flex-col gap-1 text-2xl leading-snug text-stone-700 md:text-3xl">
						{#each trustLines as line, i (i)}
							<span class={i === trustLines.length - 1 ? 'text-stone-500 italic' : ''}>
								{line}
							</span>
						{/each}
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Closing -->
	<section class="bg-stone-100">
		<div class="mx-auto max-w-[1000px] px-6 py-24 text-center md:py-28">
			<ScrollReveal>
				<div class="flex flex-col items-center gap-7">
					<p class="max-w-[560px] leading-relaxed text-stone-600">
						{getField('closing_body')}
					</p>
					<h2 class="font-cursive text-4xl leading-[1.2] text-stone-800 md:text-5xl">
						{getField('closing_heading')}
					</h2>
					<p class="max-w-[600px] leading-relaxed text-stone-600">
						{getField('closing_body_2')}
					</p>
					<div class="mt-2 flex flex-wrap justify-center gap-3">
						<a
							href={getField('cta_primary_href')}
							class="inline-block bg-stone-800 px-8 py-4 text-sm tracking-[0.14em] text-white uppercase transition-colors hover:bg-stone-700"
						>
							{getField('cta_primary_text')}
						</a>
						<a
							href={getField('cta_secondary_href')}
							class="inline-block border border-stone-800 px-8 py-4 text-sm tracking-[0.14em] text-stone-800 uppercase transition-colors hover:bg-stone-800 hover:text-white"
						>
							{getField('cta_secondary_text')}
						</a>
					</div>
					<div class="flex flex-wrap justify-center gap-x-5 gap-y-2 text-stone-600">
						{#if data.settings?.address}
							<span>{data.settings.address}</span>
						{/if}
						{#if phone}
							<a
								href={phoneHref}
								class="text-stone-700 underline underline-offset-[3px] transition-colors hover:text-stone-900"
							>
								{phone}
							</a>
						{/if}
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-stone-200 bg-stone-50 py-12">
		<div class="mx-auto max-w-7xl px-6 text-center lg:px-12">
			<p class="font-cursive mb-4 text-2xl text-stone-800">
				{data.settings?.siteName || 'The Tree House'}
			</p>
			<p class="text-sm text-stone-500">
				&copy; {new Date().getFullYear()}
				{data.settings?.siteName || 'The Tree House'}. All rights reserved.
			</p>
		</div>
	</footer>
{/if}
