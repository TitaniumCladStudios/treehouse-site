<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { ArrowLeft, Save, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import DynamicFieldRenderer from '$lib/components/admin/DynamicFieldRenderer.svelte';
	import CommitMetadataFields from '$lib/components/admin/CommitMetadataFields.svelte';
	import type { CommitMetadata } from '$lib/types/git';

	let { data }: { data: PageData } = $props();

	let title = $state('');
	let fields: Record<string, any> = $state({});
	let saving = $state(false);
	let error = $state('');
	let commitMetadata: CommitMetadata = $state({
		message: '',
		authorName: '',
		authorEmail: '',
		branch: ''
	});

	// Initialize fields with default values
	$effect(() => {
		if (data.schema) {
			const initialFields: Record<string, any> = {};
			data.schema.fields.forEach((field) => {
				initialFields[field.id] = field.defaultValue || '';
			});
			fields = initialFields;
		}
	});

	async function saveItem() {
		if (!data.schema) return;

		// Validate
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}

		// Validate required fields
		for (const field of data.schema.fields) {
			if (field.required && !fields[field.id]) {
				error = `${field.label} is required`;
				return;
			}
		}

		saving = true;
		error = '';

		try {
			const { message, authorName, authorEmail, branch } = commitMetadata;

			const response = await fetch(`/api/content/${data.schema.slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					fields,
					commitMessage: message?.trim() || undefined,
					authorName: authorName?.trim() || undefined,
					authorEmail: authorEmail?.trim() || undefined,
					branch: branch?.trim() || undefined
				})
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.error || 'Failed to create item');
			}

			toast.success(`${data.schema.name} created successfully!`);
			goto(`/admin/content/${data.schema.slug}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save item';
			console.error('Error saving item:', err);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>New {data.schema?.name || 'Item'} - Hyperspace CMS</title>
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
			<div class="flex items-center gap-4">
				<Button variant="ghost" size="icon" href="/admin/content/{data.schema.slug}">
					<ArrowLeft class="h-5 w-5" />
				</Button>
				<div>
					<h2 class="text-3xl font-bold tracking-tight">New {data.schema.name}</h2>
					<p class="text-muted-foreground">Create a new {data.schema.name.toLowerCase()}</p>
				</div>
			</div>
			<Button onclick={saveItem} disabled={saving}>
				{#if saving}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save
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

		<!-- Content Form -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Content</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-6">
				<!-- Title -->
				<div class="space-y-2">
					<Label for="title">Title<span class="text-destructive">*</span></Label>
					<Input id="title" type="text" placeholder="Enter title..." bind:value={title} required />
				</div>

				<!-- Dynamic Fields -->
				{#each data.schema.fields as field (field.id)}
					<DynamicFieldRenderer {field} bind:value={fields[field.id]} {commitMetadata} />
				{/each}
			</Card.Content>
		</Card.Root>

		<!-- Git Commit Options -->
		<CommitMetadataFields bind:commitMetadata />

		<!-- Footer Actions -->
		<div class="flex justify-end gap-3">
			<Button variant="outline" href="/admin/content/{data.schema.slug}">Cancel</Button>
			<Button onclick={saveItem} disabled={saving}>
				{#if saving}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save
				{/if}
			</Button>
		</div>
	{/if}
</div>
