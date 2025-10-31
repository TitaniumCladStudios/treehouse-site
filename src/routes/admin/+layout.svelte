<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Home, FileText, Settings, Menu, ExternalLink, Image, Layout, Folder } from 'lucide-svelte';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Static menu items
	const staticItems = [
		{
			title: 'Home',
			url: '/admin',
			icon: Home
		},
		{
			title: 'Pages',
			url: '/admin/pages',
			icon: FileText
		},
		{
			title: 'Content Types',
			url: '/admin/content-types',
			icon: Layout
		}
	];

	// Dynamic content schema items
	const contentItems = $derived(
		data.schemas.map((schema) => ({
			title: schema.name,
			url: `/admin/content/${schema.slug}`,
			icon: Folder
		}))
	);

	// Bottom menu items
	const bottomItems = [
		{
			title: 'Media',
			url: '/admin/media',
			icon: Image
		},
		{
			title: 'Settings',
			url: '/admin/settings',
			icon: Settings
		}
	];

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST'
			});

			if (response.ok) {
				window.location.href = '/admin/login';
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Header>
				<div class="px-4 py-2">
					<h2 class="text-lg font-semibold tracking-tight">Hyperspace CMS</h2>
					<p class="text-sm text-muted-foreground">Admin Dashboard</p>
				</div>
			</Sidebar.Header>

			<!-- Static Menu Items -->
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each staticItems as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon class="h-4 w-4" />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>

			<!-- Dynamic Content Items -->
			{#if contentItems.length > 0}
				<Sidebar.Group>
					<Sidebar.GroupLabel>Content</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each contentItems as item (item.url)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<item.icon class="h-4 w-4" />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{/if}

			<!-- Bottom Menu Items -->
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each bottomItems as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon class="h-4 w-4" />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>

			<Sidebar.Footer>
				<div class="space-y-2 px-4 py-2">
					<Button
						href={data.settings.siteUrl}
						target="_blank"
						rel="noopener noreferrer"
						variant="outline"
						size="sm"
						class="w-full justify-start"
					>
						<ExternalLink class="mr-2 h-4 w-4" />
						View Live Site
					</Button>
					<p class="text-xs text-muted-foreground">v0.0.1</p>
				</div>
			</Sidebar.Footer>
		</Sidebar.Content>
	</Sidebar.Root>

	<Sidebar.Inset>
		<header
			class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6"
		>
			<Sidebar.Trigger>
				<Button variant="ghost" size="icon">
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle sidebar</span>
				</Button>
			</Sidebar.Trigger>

			<div class="flex flex-1 items-center justify-between">
				<h1 class="text-xl font-semibold">
					{#if $page.url.pathname === '/admin'}
						Dashboard
					{:else if $page.url.pathname.startsWith('/admin/pages')}
						Pages
					{:else if $page.url.pathname.startsWith('/admin/content-types')}
						Content Types
					{:else if $page.url.pathname.startsWith('/admin/content')}
						Content
					{:else if $page.url.pathname.startsWith('/admin/media')}
						Media
					{:else if $page.url.pathname.startsWith('/admin/settings')}
						Settings
					{:else}
						Admin
					{/if}
				</h1>

				<div class="flex items-center gap-4">
					<Button variant="outline" size="sm" onclick={handleLogout}>Sign Out</Button>
				</div>
			</div>
		</header>

		<main class="flex-1 p-4 sm:p-6">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>

<Toaster />

<style>
	:global(body) {
		margin: 0;
	}
</style>
