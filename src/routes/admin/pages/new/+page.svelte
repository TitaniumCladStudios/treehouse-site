<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { ArrowLeft, Save, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import PageEditor from '$lib/components/admin/PageEditor.svelte';
	import type { PageContent } from '$lib/types/content';

	let pageData: PageContent = $state({
		metadata: {
			slug: '',
			title: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		fields: []
	});

	let saving = $state(false);
	let error = $state('');

	async function savePage() {
		// Validate
		if (!pageData.metadata.title.trim()) {
			error = 'Page title is required';
			return;
		}

		if (!pageData.metadata.slug.trim()) {
			error = 'Page slug is required';
			return;
		}

		// Validate slug format
		const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugPattern.test(pageData.metadata.slug)) {
			error = 'Slug must be lowercase letters, numbers, and hyphens only';
			return;
		}

		saving = true;
		error = '';

		try {
			const response = await fetch('/api/content/pages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(pageData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to create page');
			}

			// Show success toast
			toast.success('Page created successfully!');

			// Redirect to pages list
			goto('/admin/pages');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save page';
			console.error('Error saving page:', err);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>New Page - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="icon" href="/admin/pages">
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Create New Page</h2>
				<p class="text-muted-foreground">Add a new content page to your site</p>
			</div>
		</div>
		<Button onclick={savePage} disabled={saving}>
			{#if saving}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2 h-4 w-4" />
				Save Page
			{/if}
		</Button>
	</div>

	<!-- Error Message -->
	{#if error}
		<Alert.Root variant="destructive">
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{error}</Alert.Description>
		</Alert.Root>
	{/if}

	<!-- Page Editor -->
	<PageEditor bind:pageData isNew={true} />

	<!-- Footer Actions -->
	<div class="flex justify-end gap-3 border-t pt-6">
		<Button variant="outline" href="/admin/pages">Cancel</Button>
		<Button onclick={savePage} disabled={saving}>
			{#if saving}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2 h-4 w-4" />
				Save Page
			{/if}
		</Button>
	</div>
</div>
