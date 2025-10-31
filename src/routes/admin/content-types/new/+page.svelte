<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { ArrowLeft, Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { ContentSchema, SchemaField, SchemaFieldType } from '$lib/types/content';

	let schema: ContentSchema = $state({
		slug: '',
		name: '',
		description: '',
		icon: 'FileText',
		fields: [],
		createdAt: '',
		updatedAt: ''
	});

	let saving = $state(false);
	let error = $state('');

	const fieldTypes: { value: SchemaFieldType; label: string }[] = [
		{ value: 'shortText', label: 'Short Text' },
		{ value: 'longText', label: 'Long Text' },
		{ value: 'richText', label: 'Rich Text' },
		{ value: 'image', label: 'Image' },
		{ value: 'number', label: 'Number' },
		{ value: 'boolean', label: 'Boolean' },
		{ value: 'date', label: 'Date' },
		{ value: 'select', label: 'Select' }
	];

	function generateSlug(name: string): string {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function addField() {
		const newField: SchemaField = {
			id: `field_${Date.now()}`,
			label: 'New Field',
			type: 'shortText',
			required: false,
			helpText: '',
			defaultValue: ''
		};
		schema.fields = [...schema.fields, newField];
	}

	function removeField(index: number) {
		schema.fields = schema.fields.filter((_, i) => i !== index);
	}

	function moveFieldUp(index: number) {
		if (index > 0) {
			[schema.fields[index - 1], schema.fields[index]] = [
				schema.fields[index],
				schema.fields[index - 1]
			];
			schema.fields = [...schema.fields];
		}
	}

	async function saveSchema() {
		// Validate
		if (!schema.name.trim()) {
			error = 'Content type name is required';
			return;
		}

		if (!schema.slug.trim()) {
			schema.slug = generateSlug(schema.name);
		}

		// Validate slug format
		const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugPattern.test(schema.slug)) {
			error = 'Slug must be lowercase letters, numbers, and hyphens only';
			return;
		}

		saving = true;
		error = '';

		try {
			const response = await fetch('/api/schemas', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(schema)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to create content type');
			}

			toast.success('Content type created successfully!');
			goto('/admin/content-types');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save content type';
			console.error('Error saving schema:', err);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>New Content Type - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="icon" href="/admin/content-types">
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Create Content Type</h2>
				<p class="text-muted-foreground">Define a new custom content type</p>
			</div>
		</div>
		<Button onclick={saveSchema} disabled={saving}>
			{#if saving}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2 h-4 w-4" />
				Save Content Type
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

	<!-- Basic Info -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Basic Information</Card.Title>
			<Card.Description>Define the content type name and description</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input
					id="name"
					type="text"
					placeholder="e.g., Blog Post, Product, Team Member"
					bind:value={schema.name}
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="slug">Slug</Label>
				<Input
					id="slug"
					type="text"
					placeholder="blog-post"
					bind:value={schema.slug}
					required
				/>
				<p class="text-xs text-muted-foreground">
					URL-friendly identifier (lowercase, hyphens only)
				</p>
			</div>

			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					placeholder="Describe what this content type is for..."
					bind:value={schema.description}
					rows={3}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Fields -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div>
					<Card.Title>Fields</Card.Title>
					<Card.Description>Define the fields for this content type</Card.Description>
				</div>
				<Button variant="outline" size="sm" onclick={addField}>
					<Plus class="mr-2 h-4 w-4" />
					Add Field
				</Button>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if schema.fields.length === 0}
				<div class="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
					<h3 class="mb-2 text-lg font-semibold">No fields yet</h3>
					<p class="mb-4 text-sm text-muted-foreground">Add your first field to get started</p>
					<Button variant="outline" onclick={addField}>
						<Plus class="mr-2 h-4 w-4" />
						Add Field
					</Button>
				</div>
			{:else}
				{#each schema.fields as field, index (field.id)}
					<div class="rounded-lg border p-4 space-y-3">
						<div class="flex items-start gap-3">
							<div class="flex flex-col gap-1 pt-2">
								<Button
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={() => moveFieldUp(index)}
									disabled={index === 0}
								>
									<GripVertical class="h-4 w-4" />
								</Button>
							</div>

							<div class="flex-1 space-y-3">
								<div class="grid gap-3 sm:grid-cols-2">
									<div class="space-y-2">
										<Label for="label-{field.id}">Field Label</Label>
										<Input
											id="label-{field.id}"
											type="text"
											placeholder="Field label"
											bind:value={field.label}
										/>
									</div>

									<div class="space-y-2">
										<Label for="type-{field.id}">Field Type</Label>
										<select
											id="type-{field.id}"
											bind:value={field.type}
											class="border-input bg-background dark:bg-input/30 ring-offset-background shadow-xs flex h-9 w-full rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&>option]:bg-popover [&>option]:text-popover-foreground"
										>
											{#each fieldTypes as type}
												<option value={type.value}>{type.label}</option>
											{/each}
										</select>
									</div>
								</div>

								<div class="space-y-2">
									<Label for="help-{field.id}">Help Text</Label>
									<Input
										id="help-{field.id}"
										type="text"
										placeholder="Optional help text for editors"
										bind:value={field.helpText}
									/>
								</div>

								<div class="flex items-center gap-2">
									<input
										id="required-{field.id}"
										type="checkbox"
										bind:checked={field.required}
										class="h-4 w-4"
									/>
									<Label for="required-{field.id}">Required field</Label>
								</div>
							</div>

							<Button
								variant="ghost"
								size="icon"
								class="text-destructive hover:text-destructive"
								onclick={() => removeField(index)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>
				{/each}
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Footer Actions -->
	<div class="flex justify-end gap-3">
		<Button variant="outline" href="/admin/content-types">Cancel</Button>
		<Button onclick={saveSchema} disabled={saving}>
			{#if saving}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2 h-4 w-4" />
				Save Content Type
			{/if}
		</Button>
	</div>
</div>
