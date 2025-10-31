<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { FileText, Image, GitCommit, Clock, Plus, FolderOpen } from 'lucide-svelte';
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
				<div class="text-2xl font-bold">12</div>
				<p class="text-xs text-muted-foreground">+2 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Images</Card.Title>
				<Image class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">48</div>
				<p class="text-xs text-muted-foreground">+8 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Commits</Card.Title>
				<GitCommit class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">127</div>
				<p class="text-xs text-muted-foreground">+15 this week</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Last Updated</Card.Title>
				<Clock class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">2h ago</div>
				<p class="text-xs text-muted-foreground">Homepage updated</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Main Content Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<!-- Recent Activity -->
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Recent Activity</Card.Title>
				<Card.Description>Your latest content changes and updates</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div class="flex items-center">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<FileText class="h-4 w-4 text-primary" />
						</div>
						<div class="ml-4 space-y-1">
							<p class="text-sm font-medium leading-none">Updated "About Us" page</p>
							<p class="text-sm text-muted-foreground">2 hours ago</p>
						</div>
					</div>
					<div class="flex items-center">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<Image class="h-4 w-4 text-primary" />
						</div>
						<div class="ml-4 space-y-1">
							<p class="text-sm font-medium leading-none">Uploaded 3 new images</p>
							<p class="text-sm text-muted-foreground">5 hours ago</p>
						</div>
					</div>
					<div class="flex items-center">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<GitCommit class="h-4 w-4 text-primary" />
						</div>
						<div class="ml-4 space-y-1">
							<p class="text-sm font-medium leading-none">
								Committed "Update homepage hero section"
							</p>
							<p class="text-sm text-muted-foreground">1 day ago</p>
						</div>
					</div>
					<div class="flex items-center">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<FileText class="h-4 w-4 text-primary" />
						</div>
						<div class="ml-4 space-y-1">
							<p class="text-sm font-medium leading-none">Created "Services" page</p>
							<p class="text-sm text-muted-foreground">2 days ago</p>
						</div>
					</div>
					<div class="flex items-center">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<FileText class="h-4 w-4 text-primary" />
						</div>
						<div class="ml-4 space-y-1">
							<p class="text-sm font-medium leading-none">Updated "Contact" page</p>
							<p class="text-sm text-muted-foreground">3 days ago</p>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Quick Actions -->
		<Card.Root class="col-span-3">
			<Card.Header>
				<Card.Title>Quick Actions</Card.Title>
				<Card.Description>Common tasks and shortcuts</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<Button class="w-full justify-start" href="/admin/pages">
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
