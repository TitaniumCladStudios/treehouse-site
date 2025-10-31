<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { FileText, Image, GitCommit, Clock, Plus, FolderOpen, Loader2 } from 'lucide-svelte';
	import type { PageList } from '$lib/types/content';

	let pages: PageList['pages'] = [];
	let loading = true;

	onMount(async () => {
		await loadPages();
	});

	async function loadPages() {
		try {
			const response = await fetch('/api/content/pages');
			if (response.ok) {
				const data: PageList = await response.json();
				pages = data.pages;
			}
		} catch (err) {
			console.error('Error loading pages:', err);
		} finally {
			loading = false;
		}
	}

	function getLastUpdated(): string {
		if (pages.length === 0) return 'N/A';

		const sorted = [...pages].sort(
			(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);

		const date = new Date(sorted[0].updatedAt);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffHours < 1) {
			return 'Just now';
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else {
			return `${diffDays}d ago`;
		}
	}

	function getLastUpdatedPage(): string {
		if (pages.length === 0) return '';

		const sorted = [...pages].sort(
			(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);

		return sorted[0].title;
	}
</script>

<svelte:head>
	<title>Dashboard - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Welcome Section -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Welcome back!</h2>
		<p class="text-muted-foreground">Here's what's happening with your content today.</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Pages</Card.Title>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				{#if loading}
					<Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
				{:else}
					<div class="text-2xl font-bold">{pages.length}</div>
					<p class="text-xs text-muted-foreground">Content pages</p>
				{/if}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Images</Card.Title>
				<Image class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">0</div>
				<p class="text-xs text-muted-foreground">Coming soon</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Commits</Card.Title>
				<GitCommit class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">0</div>
				<p class="text-xs text-muted-foreground">Coming soon</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Last Updated</Card.Title>
				<Clock class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				{#if loading}
					<Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
				{:else}
					<div class="text-2xl font-bold">{getLastUpdated()}</div>
					<p class="text-xs text-muted-foreground">
						{getLastUpdatedPage() || 'No pages yet'}
					</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Main Content Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<!-- Recent Pages -->
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Recent Pages</Card.Title>
				<Card.Description>Your recently updated content pages</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if loading}
					<div class="flex items-center justify-center py-8">
						<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				{:else if pages.length === 0}
					<div class="flex flex-col items-center justify-center py-8 text-center">
						<FileText class="mb-4 h-12 w-12 text-muted-foreground" />
						<h3 class="mb-2 text-lg font-semibold">No pages yet</h3>
						<p class="mb-4 text-sm text-muted-foreground">
							Get started by creating your first page
						</p>
						<Button href="/admin/pages/new">
							<Plus class="mr-2 h-4 w-4" />
							Create Page
						</Button>
					</div>
				{:else}
					<div class="space-y-4">
						{#each pages
							.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
							.slice(0, 5) as page}
							<div class="flex items-center">
								<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
									<FileText class="h-4 w-4 text-primary" />
								</div>
								<div class="ml-4 flex-1 space-y-1">
									<p class="text-sm font-medium leading-none">{page.title}</p>
									<p class="text-sm text-muted-foreground">/{page.slug}</p>
								</div>
								<Button variant="ghost" size="sm" href="/admin/pages/{page.slug}">
									Edit
								</Button>
							</div>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Quick Actions -->
		<Card.Root class="col-span-3">
			<Card.Header>
				<Card.Title>Quick Actions</Card.Title>
				<Card.Description>Common tasks and shortcuts</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<Button class="w-full justify-start" href="/admin/pages/new">
					<Plus class="mr-2 h-4 w-4" />
					Create New Page
				</Button>
				<Button class="w-full justify-start" variant="outline" href="/admin/pages">
					<FolderOpen class="mr-2 h-4 w-4" />
					Browse All Pages
				</Button>
				<Button class="w-full justify-start" variant="outline" href="/admin/pages">
					<Image class="mr-2 h-4 w-4" />
					Upload Images
				</Button>
				<Button class="w-full justify-start" variant="outline" href="/admin/settings">
					<GitCommit class="mr-2 h-4 w-4" />
					View Commit History
				</Button>
			</Card.Content>
			<Card.Footer>
				<p class="text-xs text-muted-foreground">
					All changes are automatically versioned with Git
				</p>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
