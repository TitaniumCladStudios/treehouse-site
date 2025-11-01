<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Plus, Pencil, Trash2, FileText, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import CommitMetadataFields from '$lib/components/admin/CommitMetadataFields.svelte';
	import type { CommitMetadata } from '$lib/types/git';

	let { data }: { data: PageData } = $props();

	let schemas = $state(data.schemas || []);
	let deleteDialogOpen = $state(false);
	let selectedSchema: any = $state(null);
	let deleting = $state(false);
	let commitMetadata: CommitMetadata = $state({
		message: '',
		authorName: '',
		authorEmail: '',
		branch: ''
	});

	// Open delete dialog
	function openDeleteDialog(schema: any) {
		selectedSchema = schema;
		deleteDialogOpen = true;
	}

	// Delete schema
	async function deleteSchema() {
		if (!selectedSchema) return;

		deleting = true;

		try {
			const { message, authorName, authorEmail, branch } = commitMetadata;

			const response = await fetch(`/api/schemas/${selectedSchema.slug}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					commitMessage: message?.trim() || undefined,
					authorName: authorName?.trim() || undefined,
					authorEmail: authorEmail?.trim() || undefined,
					branch: branch?.trim() || undefined
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete schema');
			}

			// Remove from list
			schemas = schemas.filter((s: any) => s.slug !== selectedSchema.slug);

			toast.success('Content type deleted successfully!');
			deleteDialogOpen = false;
			selectedSchema = null;
		} catch (error) {
			console.error('Error deleting schema:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to delete content type');
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Content Types - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Content Types</h2>
			<p class="text-muted-foreground">Create custom content types with custom fields</p>
		</div>
		<Button href="/admin/content-types/new">
			<Plus class="mr-2 h-4 w-4" />
			New Content Type
		</Button>
	</div>

	<!-- Content Types Grid -->
	<CommitMetadataFields bind:commitMetadata />

	<!-- Content Types Grid -->
	{#if schemas.length === 0}
		<Card.Root>
			<Card.Content class="flex flex-col items-center justify-center py-12">
				<FileText class="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 class="mb-2 text-lg font-semibold">No content types yet</h3>
				<p class="mb-4 text-sm text-muted-foreground">
					Create your first custom content type to get started
				</p>
				<Button href="/admin/content-types/new">
					<Plus class="mr-2 h-4 w-4" />
					Create Content Type
				</Button>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each schemas as schema}
				<Card.Root>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="flex items-center gap-2">
									<span>{schema.name}</span>
								</Card.Title>
								<Card.Description>{schema.description}</Card.Description>
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<div class="mb-4 text-sm text-muted-foreground">
							<span class="font-medium">{schema.itemCount}</span> items
						</div>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								class="flex-1"
								href="/admin/content/{schema.slug}"
							>
								<FileText class="mr-1 h-3 w-3" />
								View Items
							</Button>
							<Button
								variant="outline"
								size="sm"
								href="/admin/content-types/{schema.slug}/edit"
							>
								<Pencil class="h-3 w-3" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								class="text-destructive hover:text-destructive"
								onclick={() => openDeleteDialog(schema)}
							>
								<Trash2 class="h-3 w-3" />
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Content Type</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete "{selectedSchema?.name}"? This will not delete the content
				items, but you won't be able to edit them without the schema.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteDialogOpen = false)} disabled={deleting}>
				Cancel
			</Button>
			<Button variant="destructive" onclick={deleteSchema} disabled={deleting}>
				{#if deleting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
