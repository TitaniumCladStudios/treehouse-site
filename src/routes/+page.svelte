<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let { data }: { data: PageData } = $props();

	// Helper to get field value by ID
	function getField(id: string) {
		return data.pageData?.fields.find((f) => f.id === id)?.value || '';
	}
</script>

<svelte:head>
	<title>{data.pageData?.metadata.title || 'Home'} - Hyperspace CMS</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-background to-muted/20">
	<div class="container mx-auto px-4 py-16">
		{#if data.error}
			<div class="flex flex-col items-center justify-center py-12">
				<h1 class="mb-4 text-2xl font-bold text-destructive">Error</h1>
				<p class="text-muted-foreground">{data.error}</p>
			</div>
		{:else if data.pageData}
			<!-- Hero Section -->
			<div class="mb-16 text-center">
				<h1 class="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
					{getField('hero_title')}
				</h1>
				<p class="mb-6 text-xl text-muted-foreground md:text-2xl">
					{getField('hero_subtitle')}
				</p>
				<p class="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
					{getField('hero_description')}
				</p>
				<div class="flex justify-center gap-4">
					<Button href="/about" size="lg">Learn More</Button>
					<Button href="/admin" variant="outline" size="lg">Admin Dashboard</Button>
				</div>
			</div>

			<!-- Hero Image -->
			{#if getField('hero_image')}
				<div class="mb-16 flex justify-center">
					<img
						src={getField('hero_image')}
						alt="Hero"
						class="max-h-96 w-auto rounded-lg border shadow-2xl"
					/>
				</div>
			{/if}

			<!-- About Section -->
			<div class="mx-auto max-w-4xl">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-3xl">{getField('about_heading')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-lg leading-relaxed text-muted-foreground">
							{getField('about_text')}
						</p>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Footer Info -->
			<div class="mt-16 text-center text-sm text-muted-foreground">
				<p>
					This page is powered by content from the CMS. Edit it in the
					<a href="/admin/pages/home" class="underline hover:text-foreground">admin dashboard</a>.
				</p>
			</div>
		{/if}
	</div>
</div>
