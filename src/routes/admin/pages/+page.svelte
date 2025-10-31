<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Plus, Search, FileText, Edit, Trash2, Loader2 } from 'lucide-svelte';
	import type { PageList } from '$lib/types/content';

	let pages: PageList['pages'] = [];
	let searchQuery = '';
	let loading = true;
	let error = '';

	onMount(async () => {
		await loadPages();
	});

	async function loadPages() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/content/pages');
			if (!response.ok) {
				throw new Error('Failed to load pages');
			}
			const data: PageList = await response.json();
			pages = data.pages;
		} catch (err) {
			error = 'Failed to load pages. Please try again.';
			console.error('Error loading pages:', err);
		} finally {
			loading = false;
		}
	}

	async function deletePage(slug: string) {
		if (!confirm(`Are you sure you want to delete "${slug}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/content/pages/${slug}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete page');
			}

			await loadPages();
		} catch (err) {
			alert('Failed to delete page. Please try again.');
			console.error('Error deleting page:', err);
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 60) {
			return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
		} else if (diffHours < 24) {
			return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
		} else if (diffDays < 7) {
			return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
		} else {
			return date.toLocaleDateString();
		}
	}

	$: filteredPages = pages.filter(
		(page) =>
			page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			page.slug.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<svelte:head>
	<title>Pages - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Pages</h2>
			<p class="text-muted-foreground">Manage your site's content pages</p>
		</div>
		<Button href="/admin/pages/new">
			<Plus class="mr-2 h-4 w-4" />
			Create Page
		</Button>
	</div>

	{#if error}
		<Card.Root class="border-destructive">
			<Card.Content class="pt-6">
				<p class="text-destructive">{error}</p>
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root>
		<Card.Header>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Card.Title>All Pages</Card.Title>
					<Card.Description>
						{#if loading}
							Loading...
						{:else}
							{filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''}
							{#if searchQuery}(filtered){/if}
						{/if}
					</Card.Description>
				</div>
				<div class="relative w-full sm:w-64">
					<Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search pages..."
						bind:value={searchQuery}
						class="pl-8"
					/>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			{#if loading}
				<div class="flex items-center justify-center py-8">
					<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			{:else if filteredPages.length === 0}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<FileText class="mb-4 h-12 w-12 text-muted-foreground" />
					<h3 class="mb-2 text-lg font-semibold">No pages found</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						{#if searchQuery}
							Try adjusting your search query
						{:else}
							Get started by creating your first page
						{/if}
					</p>
					{#if !searchQuery}
						<Button href="/admin/pages/new">
							<Plus class="mr-2 h-4 w-4" />
							Create Page
						</Button>
					{/if}
				</div>
			{:else}
				<div class="space-y-4">
					{#each filteredPages as page (page.slug)}
						<div
							class="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
						>
							<div class="flex items-center gap-4">
								<div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
									<FileText class="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 class="font-semibold">{page.title}</h3>
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<span>/{page.slug}</span>
										<span>•</span>
										<span>{formatDate(page.updatedAt)}</span>
									</div>
								</div>
							</div>
							<div class="flex gap-2">
								<Button variant="ghost" size="icon" href="/admin/pages/{page.slug}">
									<Edit class="h-4 w-4" />
									<span class="sr-only">Edit {page.title}</span>
								</Button>
								<Button variant="ghost" size="icon" onclick={() => deletePage(page.slug)}>
									<Trash2 class="h-4 w-4" />
									<span class="sr-only">Delete {page.title}</span>
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-sm font-medium">Total Pages</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{pages.length}</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="text-sm font-medium">Last Updated</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-sm">
					{#if pages.length > 0}
						{formatDate(
							pages.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
								.updatedAt
						)}
					{:else}
						N/A
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="text-sm font-medium">Quick Actions</Card.Title>
			</Card.Header>
			<Card.Content>
				<Button variant="outline" size="sm" class="w-full" href="/admin/pages/new">
					<Plus class="mr-2 h-3 w-3" />
					New Page
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
