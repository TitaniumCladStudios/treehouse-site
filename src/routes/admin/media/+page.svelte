<script lang="ts">
	import type { PageData } from './$types';
	import type { MediaFile } from './+page';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Image as ImageIcon, Copy, Trash2, Upload, Search, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	let files = $state<MediaFile[]>(data.files || []);
	let searchQuery = $state('');
	let selectedFile: MediaFile | null = $state(null);
	let deleteDialogOpen = $state(false);
	let uploadDialogOpen = $state(false);
	let uploading = $state(false);

	// Filter files based on search
	const filteredFiles = $derived(
		files.filter((file) => file.filename.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	// Format file size
	function formatSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	// Format date
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}

	// Copy URL to clipboard
	async function copyUrl(url: string) {
		try {
			await navigator.clipboard.writeText(url);
			toast.success('URL copied to clipboard!');
		} catch (error) {
			toast.error('Failed to copy URL');
		}
	}

	// Open delete dialog
	function openDeleteDialog(file: MediaFile) {
		selectedFile = file;
		deleteDialogOpen = true;
	}

	// Delete file
	async function deleteFile() {
		if (!selectedFile) return;

		try {
			const response = await fetch('/api/media', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ filename: selectedFile.filename })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete file');
			}

			// Remove file from list
			files = files.filter((f) => f.filename !== selectedFile?.filename);

			toast.success('Image deleted successfully!');
			deleteDialogOpen = false;
			selectedFile = null;
		} catch (error) {
			console.error('Error deleting file:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to delete image');
		}
	}

	// Upload new image
	async function uploadImage(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload image');
			}

			const data = await response.json();

			// Add new file to list
			const newFile: MediaFile = {
				filename: data.url.split('/').pop() || '',
				url: data.url,
				size: file.size,
				createdAt: new Date().toISOString()
			};

			files = [newFile, ...files];

			toast.success('Image uploaded successfully!');
			uploadDialogOpen = false;

			// Reset input
			input.value = '';
		} catch (error) {
			console.error('Error uploading image:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to upload image');
		} finally {
			uploading = false;
		}
	}
</script>

<svelte:head>
	<title>Media Library - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Media Library</h2>
			<p class="text-muted-foreground">Manage your uploaded images</p>
		</div>
		<Button onclick={() => (uploadDialogOpen = true)}>
			<Upload class="mr-2 h-4 w-4" />
			Upload Image
		</Button>
	</div>

	<!-- Search -->
	<div class="relative">
		<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
		<Input
			type="text"
			placeholder="Search images..."
			bind:value={searchQuery}
			class="pl-9"
		/>
	</div>

	<!-- Stats -->
	<div class="grid gap-4 sm:grid-cols-3">
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-2xl font-bold">{files.length}</div>
				<p class="text-xs text-muted-foreground">Total Images</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-2xl font-bold">
					{formatSize(files.reduce((acc, f) => acc + f.size, 0))}
				</div>
				<p class="text-xs text-muted-foreground">Total Size</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-2xl font-bold">{filteredFiles.length}</div>
				<p class="text-xs text-muted-foreground">Showing</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Image Grid -->
	{#if filteredFiles.length === 0}
		<Card.Root>
			<Card.Content class="flex flex-col items-center justify-center py-12">
				<ImageIcon class="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 class="mb-2 text-lg font-semibold">
					{searchQuery ? 'No images found' : 'No images yet'}
				</h3>
				<p class="mb-4 text-sm text-muted-foreground">
					{searchQuery
						? 'Try a different search term'
						: 'Upload your first image to get started'}
				</p>
				{#if !searchQuery}
					<Button onclick={() => (uploadDialogOpen = true)}>
						<Upload class="mr-2 h-4 w-4" />
						Upload Image
					</Button>
				{/if}
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredFiles as file (file.filename)}
				<Card.Root class="overflow-hidden">
					<div class="aspect-video overflow-hidden bg-muted">
						<img
							src={file.url}
							alt={file.filename}
							class="h-full w-full object-cover transition-transform hover:scale-105"
						/>
					</div>
					<Card.Content class="space-y-3 p-4">
						<div>
							<p class="truncate text-sm font-medium" title={file.filename}>
								{file.filename}
							</p>
							<div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
								<span>{formatSize(file.size)}</span>
								<span>•</span>
								<span>{formatDate(file.createdAt)}</span>
							</div>
						</div>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								class="flex-1"
								onclick={() => copyUrl(file.url)}
							>
								<Copy class="mr-1 h-3 w-3" />
								Copy URL
							</Button>
							<Button
								variant="outline"
								size="sm"
								class="text-destructive hover:text-destructive"
								onclick={() => openDeleteDialog(file)}
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

<!-- Upload Dialog -->
<Dialog.Root bind:open={uploadDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Upload Image</Dialog.Title>
			<Dialog.Description>
				Choose an image to upload. Max size: 5MB. Formats: JPEG, PNG, GIF, WebP
				<br />
				<span class="text-xs">Images will be automatically optimized and converted to WebP format.</span>
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<Input
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
				onchange={uploadImage}
				disabled={uploading}
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Image</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete "{selectedFile?.filename}"? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Cancel</Button>
			<Button variant="destructive" onclick={deleteFile}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
