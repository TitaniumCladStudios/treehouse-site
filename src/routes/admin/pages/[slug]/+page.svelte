<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { ArrowLeft, Save, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import PageEditor from '$lib/components/admin/PageEditor.svelte';
	import CommitMetadataFields from '$lib/components/admin/CommitMetadataFields.svelte';
	import type { PageContent } from '$lib/types/content';
	import type { CommitMetadata } from '$lib/types/git';

	const slug = $page.params.slug;

	let pageData: PageContent | null = $state(null);
	let loading = $state(true);
	let saving = $state(false);
	let error = $state('');
	let commitMetadata: CommitMetadata = $state({
		message: '',
		authorName: '',
		authorEmail: '',
		branch: ''
	});

	onMount(async () => {
		await loadPage();
	});

	async function loadPage() {
		loading = true;
		error = '';

		try {
			const response = await fetch(`/api/content/pages/${slug}`);

			if (!response.ok) {
				throw new Error('Page not found');
			}

			pageData = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load page';
			console.error('Error loading page:', err);
		} finally {
			loading = false;
		}
	}

	async function savePage() {
		if (!pageData) return;

		// Validate
		if (!pageData.metadata.title.trim()) {
			error = 'Page title is required';
			return;
		}

		saving = true;
		error = '';

		try {
			const { message, authorName, authorEmail, branch } = commitMetadata;

			const response = await fetch(`/api/content/pages/${slug}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...pageData,
					commitMessage: message?.trim() || undefined,
					authorName: authorName?.trim() || undefined,
					authorEmail: authorEmail?.trim() || undefined,
					branch: branch?.trim() || undefined
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update page');
			}

			// Update timestamp locally without reloading
			pageData.metadata.updatedAt = new Date().toISOString();

			// Show success toast
			toast.success('Page saved successfully!');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save page';
			console.error('Error saving page:', err);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>{pageData?.metadata.title || 'Edit Page'} - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="icon" href="/admin/pages">
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">
					{pageData?.metadata.title || 'Edit Page'}
				</h2>
				<p class="text-muted-foreground">
					{#if pageData}
						Last updated: {new Date(pageData.metadata.updatedAt).toLocaleString()}
					{:else}
						Edit page content and fields
					{/if}
				</p>
			</div>
		</div>
		<Button onclick={savePage} disabled={saving || loading || !pageData}>
			{#if saving}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2 h-4 w-4" />
				Save Changes
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

	<!-- Loading State -->
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if pageData}
		<!-- Page Editor -->
		<PageEditor bind:pageData isNew={false} {commitMetadata} />

		<!-- Git Commit Options -->
		<CommitMetadataFields bind:commitMetadata />

		<!-- Footer Actions -->
		<div class="flex justify-end gap-3 border-t pt-6">
			<Button variant="outline" href="/admin/pages">Cancel</Button>
			<Button onclick={savePage} disabled={saving}>
				{#if saving}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save Changes
				{/if}
			</Button>
		</div>
	{:else}
		<div class="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
			<h3 class="mb-2 text-lg font-semibold">Page Not Found</h3>
			<p class="mb-4 text-sm text-muted-foreground">
				The page you're looking for doesn't exist.
			</p>
			<Button href="/admin/pages">Back to Pages</Button>
		</div>
	{/if}
</div>
