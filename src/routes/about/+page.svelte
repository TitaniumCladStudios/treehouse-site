<script lang="ts">
	import type { PageData } from './$types';
	import { Navigation, ScrollReveal } from '$lib/components/site';
	import { Users } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	function getField(id: string): string {
		return data.pageData?.fields.find((f) => f.id === id)?.value || '';
	}

	// Get expanded content
	const teamMembers = $derived(data.pageData?.expandedFields?.team_members || []);
	const navLinks = $derived(data.pageData?.expandedFields?.navigation_links || []);

	const teamMembersFormatted = $derived(
		(Array.isArray(teamMembers) ? teamMembers : [teamMembers])
			.map((m: any) => ({
				name: m.fields?.name || m.title || '',
				role: m.fields?.role || '',
				bio: m.fields?.bio || '',
				image: m.fields?.image || '',
				imageRotation: parseInt(m.fields?.image_rotation) || 0,
				order: parseInt(m.fields?.order) || 0
			}))
			.sort((a: any, b: any) => a.order - b.order)
	);

	const navLinksFormatted = $derived(
		(Array.isArray(navLinks) ? navLinks : [])
			.map((link: any) => ({
				label: link.fields?.label || link.title || '',
				anchor: link.fields?.anchor || '#',
				order: parseInt(link.fields?.order) || 0
			}))
	);
</script>

<svelte:head>
	<title>About Us - {data.settings?.siteName || 'The Tree House'}</title>
	<meta name="description" content="Meet the family behind The Tree House wedding venue in Historic Downtown Fort Myers, FL." />
</svelte:head>

{#if data.error}
	<div class="flex flex-col items-center justify-center min-h-screen py-12">
		<h1 class="mb-4 text-2xl font-bold text-red-600">Error</h1>
		<p class="text-stone-600">{data.error}</p>
	</div>
{:else if data.pageData}
	<Navigation siteName={data.settings?.siteName || 'The Tree House'} navLinks={navLinksFormatted} />

	<!-- Hero Banner -->
	<section class="relative h-[50vh] flex items-center justify-center overflow-hidden">
		<img
			src={getField('hero_image')}
			alt="The Tree House venue"
			class="absolute inset-0 w-full h-full object-cover"
		/>
		<div class="absolute inset-0 bg-black/50"></div>
		<div class="relative z-10 text-center text-white px-6">
			<p class="text-sm tracking-[0.3em] uppercase opacity-90 mb-4">{data.settings?.siteName || 'The Tree House'}</p>
			<h1 class="font-cursive text-5xl md:text-7xl mb-4">{getField('hero_title')}</h1>
			<div class="w-16 h-px bg-white/60 mx-auto mb-6"></div>
			<p class="text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-95">
				{getField('hero_subtitle')}
			</p>
		</div>
	</section>

	<!-- Introduction -->
	<section class="py-24 md:py-32 bg-stone-50">
		<div class="max-w-3xl mx-auto px-6 text-center">
			<ScrollReveal>
				<div class="space-y-6 text-stone-600 leading-relaxed text-lg">
					<p>{getField('intro_text')}</p>
					<p class="italic text-stone-700">{getField('intro_text_2')}</p>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Team Section -->
	<section class="py-24 md:py-32 bg-white">
		<div class="max-w-6xl mx-auto px-6 lg:px-12">
			<ScrollReveal>
				<div class="text-center mb-16">
					<p class="text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">Our Family</p>
					<h2 class="text-3xl md:text-4xl text-stone-800 tracking-wide">
						{getField('team_heading')}
					</h2>
					<div class="w-12 h-px bg-stone-300 mx-auto mt-6"></div>
				</div>
			</ScrollReveal>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each teamMembersFormatted as member, i}
					<ScrollReveal>
						<div class="group p-8 bg-stone-50 hover:bg-stone-100 transition-colors duration-300">
							{#if member.image}
								<img
									src={member.image}
									alt={member.name}
									class="w-24 h-24 rounded-full object-cover mx-auto mb-6"
									style={member.imageRotation ? `transform: rotate(${member.imageRotation}deg)` : ''}
								/>
							{:else}
								<div class="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center mx-auto mb-6">
									<Users size={32} class="text-stone-400" />
								</div>
							{/if}
							<h3 class="font-cursive text-3xl text-stone-800 text-center mb-2">
								{member.name}
							</h3>
							<p class="text-sm tracking-wider text-stone-500 uppercase text-center mb-4">
								{member.role}
							</p>
							<p class="text-stone-600 leading-relaxed text-center">
								{member.bio}
							</p>
						</div>
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</section>

	<!-- Closing Section -->
	<section class="py-24 md:py-32 bg-stone-800 text-white">
		<div class="max-w-3xl mx-auto px-6 text-center">
			<ScrollReveal>
				<h2 class="font-cursive text-4xl md:text-5xl mb-8">
					{getField('closing_heading')}
				</h2>
				<div class="w-16 h-px bg-white/40 mx-auto mb-8"></div>
				<p class="text-lg md:text-xl leading-relaxed text-white/90">
					{getField('closing_text')}
				</p>
				<div class="mt-12">
					<a
						href="/#contact"
						class="inline-block px-10 py-4 bg-white text-stone-800 tracking-wider hover:bg-stone-100 transition-all"
					>
						Schedule a Visit
					</a>
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
{/if}
