<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Plus, Pencil, Trash2, FileText, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	let items = $state(data.items || []);
	let deleteDialogOpen = $state(false);
	let selectedItem: any = $state(null);
	let deleting = $state(false);

	function openDeleteDialog(item: any) {
		selectedItem = item;
		deleteDialogOpen = true;
	}

	async function deleteItem() {
		if (!selectedItem || !data.schema) return;

		deleting = true;

		try {
			const response = await fetch(`/api/content/${data.schema.slug}/${selectedItem.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.error || 'Failed to delete item');
			}

			items = items.filter((i: any) => i.id !== selectedItem.id);

			toast.success('Item deleted successfully!');
			deleteDialogOpen = false;
			selectedItem = null;
		} catch (error) {
			console.error('Error deleting item:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to delete item');
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>{data.schema?.name || 'Content'} - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	{#if data.error || !data.schema}
		<Card.Root>
			<Card.Content class="py-12 text-center">
				<h3 class="text-lg font-semibold">Error</h3>
				<p class="text-muted-foreground">{data.error || 'Schema not found'}</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<!-- Header -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">{data.schema.name}</h2>
				<p class="text-muted-foreground">{data.schema.description}</p>
			</div>
			<Button href="/admin/content/{data.schema.slug}/new">
				<Plus class="mr-2 h-4 w-4" />
				New {data.schema.name}
			</Button>
		</div>

		<!-- Items List -->
		{#if items.length === 0}
			<Card.Root>
				<Card.Content class="flex flex-col items-center justify-center py-12">
					<FileText class="mb-4 h-12 w-12 text-muted-foreground" />
					<h3 class="mb-2 text-lg font-semibold">No items yet</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						Create your first {data.schema.name.toLowerCase()} to get started
					</p>
					<Button href="/admin/content/{data.schema.slug}/new">
						<Plus class="mr-2 h-4 w-4" />
						Create {data.schema.name}
					</Button>
				</Card.Content>
			</Card.Root>
		{:else}
			<Card.Root>
				<Card.Content class="p-0">
					<div class="divide-y">
						{#each items as item (item.id)}
							<div class="flex items-center justify-between p-4 hover:bg-muted/50">
								<div class="flex-1">
									<h4 class="font-medium">{item.title}</h4>
									<p class="text-sm text-muted-foreground">
										Updated {new Date(item.updatedAt).toLocaleDateString()}
									</p>
								</div>
								<div class="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										href="/admin/content/{data.schema.slug}/{item.id}"
									>
										<Pencil class="mr-1 h-3 w-3" />
										Edit
									</Button>
									<Button
										variant="outline"
										size="sm"
										class="text-destructive hover:text-destructive"
										onclick={() => openDeleteDialog(item)}
									>
										<Trash2 class="h-3 w-3" />
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	{/if}
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Item</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteDialogOpen = false)} disabled={deleting}>
				Cancel
			</Button>
			<Button variant="destructive" onclick={deleteItem} disabled={deleting}>
				{#if deleting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
