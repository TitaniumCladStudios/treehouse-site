<script lang="ts">
	import { GitCommit, ExternalLink, Calendar, User } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffHours < 1) {
			const diffMinutes = Math.floor(diffMs / 60000);
			return diffMinutes < 1 ? 'Just now' : `${diffMinutes}m ago`;
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else if (diffDays < 7) {
			return `${diffDays}d ago`;
		} else {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		}
	}

	function getCommitMessageTitle(message: string): string {
		return message.split('\n')[0];
	}
</script>

<svelte:head>
	<title>Commit History - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Commit History</h2>
			<p class="text-muted-foreground">
				View all changes made to your content ({data.total} total commits)
			</p>
		</div>
		<Button href="/admin" variant="outline">Back to Dashboard</Button>
	</div>

	<!-- Commits List -->
	{#if data.error}
		<Card.Root>
			<Card.Content class="py-8 text-center">
				<GitCommit class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 class="mb-2 text-lg font-semibold">Unable to Load Commits</h3>
				<p class="text-sm text-muted-foreground">{data.error}</p>
			</Card.Content>
		</Card.Root>
	{:else if data.commits.length === 0}
		<Card.Root>
			<Card.Content class="py-8 text-center">
				<GitCommit class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 class="mb-2 text-lg font-semibold">No Commits Yet</h3>
				<p class="text-sm text-muted-foreground">
					Start making changes to see your commit history here
				</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="space-y-4">
			{#each data.commits as commit}
				<Card.Root>
					<Card.Content class="py-4">
						<div class="flex items-start justify-between">
							<div class="flex-1 space-y-2">
								<!-- Commit message -->
								<div class="flex items-start gap-3">
									<div
										class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
									>
										<GitCommit class="h-4 w-4 text-primary" />
									</div>
									<div class="flex-1 space-y-1">
										<p class="font-medium leading-tight">
											{getCommitMessageTitle(commit.message)}
										</p>

										<!-- Author and date -->
										<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
											<div class="flex items-center gap-1">
												<User class="h-3 w-3" />
												<span>{commit.author.name}</span>
											</div>
											<div class="flex items-center gap-1">
												<Calendar class="h-3 w-3" />
												<span>{formatDate(commit.author.date)}</span>
											</div>
											<div class="font-mono text-xs">
												{commit.sha.substring(0, 7)}
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- View on GitHub button -->
							<Button variant="ghost" size="sm" href={commit.url} target="_blank">
								<ExternalLink class="h-4 w-4" />
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Footer -->
		{#if data.total > data.commits.length}
			<Card.Root>
				<Card.Content class="py-4 text-center text-sm text-muted-foreground">
					Showing {data.commits.length} of {data.total} commits. View more on GitHub.
				</Card.Content>
			</Card.Root>
		{/if}
	{/if}
</div>
