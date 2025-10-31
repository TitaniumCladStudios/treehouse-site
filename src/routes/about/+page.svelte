<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ArrowLeft } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// Helper to get field value by ID
	function getField(id: string) {
		return data.pageData?.fields.find((f) => f.id === id)?.value || '';
	}
</script>

<svelte:head>
	<title>{data.pageData?.metadata.title || 'About'} - Hyperspace CMS</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-background to-muted/20">
	<div class="container mx-auto px-4 py-16">
		{#if data.error}
			<div class="flex flex-col items-center justify-center py-12">
				<h1 class="mb-4 text-2xl font-bold text-destructive">Error</h1>
				<p class="text-muted-foreground">{data.error}</p>
				<Button href="/" class="mt-4">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Home
				</Button>
			</div>
		{:else if data.pageData}
			<!-- Back Button -->
			<div class="mb-8">
				<Button href="/" variant="ghost">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Home
				</Button>
			</div>

			<!-- Page Title -->
			<div class="mb-12 text-center">
				<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
					{getField('page_title')}
				</h1>
			</div>

			<!-- Content -->
			<div class="mx-auto max-w-4xl space-y-8">
				<!-- Introduction -->
				<Card.Root>
					<Card.Content class="pt-6">
						<p class="text-lg leading-relaxed text-muted-foreground">
							{getField('intro_text')}
						</p>
					</Card.Content>
				</Card.Root>

				<!-- Mission -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-2xl">{getField('mission_heading')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-lg leading-relaxed text-muted-foreground">
							{getField('mission_text')}
						</p>
					</Card.Content>
				</Card.Root>

				<!-- Features -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-2xl">{getField('features_heading')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid gap-3 text-lg">
							{#each getField('features_list').split('•') as feature}
								{#if feature.trim()}
									<div class="flex items-start gap-2">
										<span class="text-primary">✓</span>
										<span class="text-muted-foreground">{feature.trim()}</span>
									</div>
								{/if}
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Footer Info -->
			<div class="mt-16 text-center text-sm text-muted-foreground">
				<p>
					This page is powered by content from the CMS. Edit it in the
					<a href="/admin/pages/about" class="underline hover:text-foreground">admin dashboard</a>.
				</p>
			</div>
		{/if}
	</div>
</div>
