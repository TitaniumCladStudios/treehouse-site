<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import {
		Plus,
		Trash2,
		GripVertical,
		Image as ImageIcon,
		Upload,
		Loader2,
		X
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { PageContent, PageField, PageFieldType, SchemaList, ContentItem } from '$lib/types/content';

	// Props
	let { pageData, isNew = false }: { pageData: PageContent; isNew?: boolean } = $props();

	// Track uploading state per field
	let uploadingFields: Record<string, boolean> = $state({});

	// Available schemas for content references
	let schemas: SchemaList['schemas'] = $state([]);

	// Content items by schema
	let contentItemsBySchema: Record<string, ContentItem[]> = $state({});

	onMount(async () => {
		await loadSchemas();
		await loadExistingContentReferences();
	});

	async function loadSchemas() {
		try {
			const response = await fetch('/api/schemas');
			if (response.ok) {
				const data: SchemaList = await response.json();
				schemas = data.schemas;
			}
		} catch (err) {
			console.error('Error loading schemas:', err);
		}
	}

	async function loadExistingContentReferences() {
		// Load content items for any existing content reference fields
		const referenceFields = pageData.fields.filter(
			(field) => field.type === 'contentReference' && field.referenceSchema
		);

		// Load all reference schemas in parallel
		await Promise.all(
			referenceFields.map((field) => loadContentItems(field.referenceSchema!))
		);
	}

	async function loadContentItems(schemaSlug: string) {
		if (contentItemsBySchema[schemaSlug]) return;

		try {
			const response = await fetch(`/api/content/${schemaSlug}`);
			if (response.ok) {
				const data = await response.json();
				contentItemsBySchema[schemaSlug] = data.items;
			}
		} catch (err) {
			console.error(`Error loading content items for ${schemaSlug}:`, err);
		}
	}

	async function handleReferenceSchemaChange(field: PageField) {
		if (field.referenceSchema) {
			await loadContentItems(field.referenceSchema);
		}
		// Trigger reactivity
		pageData.fields = [...pageData.fields];
	}

	function addField() {
		const newField: PageField = {
			id: `field_${Date.now()}`,
			label: 'New Field',
			type: 'shortText',
			value: '',
			referenceSchema: undefined,
			multiple: false
		};
		pageData.fields = [...pageData.fields, newField];
	}

	function handleFieldTypeChange(field: PageField) {
		// Initialize contentReference properties when type changes
		if (field.type === 'contentReference') {
			if (field.referenceSchema === undefined) {
				field.referenceSchema = '';
			}
			if (field.multiple === undefined) {
				field.multiple = false;
			}
		}
		// Trigger reactivity by reassigning the fields array
		pageData.fields = [...pageData.fields];
	}

	function removeField(index: number) {
		pageData.fields = pageData.fields.filter((_, i) => i !== index);
	}

	function moveFieldUp(index: number) {
		if (index > 0) {
			[pageData.fields[index - 1], pageData.fields[index]] = [
				pageData.fields[index],
				pageData.fields[index - 1]
			];
			pageData.fields = [...pageData.fields];
		}
	}

	function moveFieldDown(index: number) {
		if (index < pageData.fields.length - 1) {
			[pageData.fields[index], pageData.fields[index + 1]] = [
				pageData.fields[index + 1],
				pageData.fields[index]
			];
			pageData.fields = [...pageData.fields];
		}
	}

	async function uploadImage(fieldId: string, file: File) {
		if (!file) return;

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			toast.error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			toast.error('File size exceeds 5MB limit.');
			return;
		}

		uploadingFields[fieldId] = true;

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

			// Update field value with uploaded image URL
			const field = pageData.fields.find((f) => f.id === fieldId);
			if (field) {
				field.value = data.url;
			}

			toast.success('Image uploaded successfully!');
		} catch (error) {
			console.error('Error uploading image:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to upload image');
		} finally {
			uploadingFields[fieldId] = false;
		}
	}

	function handleFileSelect(fieldId: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			uploadImage(fieldId, file);
		}
	}

	function clearImage(fieldId: string) {
		const field = pageData.fields.find((f) => f.id === fieldId);
		if (field) {
			field.value = '';
		}
	}
</script>

<div class="space-y-6">
	<!-- Page Metadata -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Page Information</Card.Title>
			<Card.Description>Basic information about this page</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-2">
				<Label for="title">Page Title</Label>
				<Input
					id="title"
					type="text"
					placeholder="Enter page title"
					bind:value={pageData.metadata.title}
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="slug">Page Slug</Label>
				<Input
					id="slug"
					type="text"
					placeholder="page-url-slug"
					bind:value={pageData.metadata.slug}
					required
					disabled={!isNew}
				/>
				<p class="text-xs text-muted-foreground">
					{#if isNew}
						URL-friendly identifier for this page (lowercase, hyphens only)
					{:else}
						Slug cannot be changed after creation
					{/if}
				</p>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Page Fields -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div>
					<Card.Title>Page Content</Card.Title>
					<Card.Description>Add and organize content fields</Card.Description>
				</div>
				<Button variant="outline" size="sm" onclick={addField}>
					<Plus class="mr-2 h-4 w-4" />
					Add Field
				</Button>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if pageData.fields.length === 0}
				<div class="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
					<ImageIcon class="mb-4 h-12 w-12 text-muted-foreground" />
					<h3 class="mb-2 text-lg font-semibold">No fields yet</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						Add your first content field to get started
					</p>
					<Button variant="outline" onclick={addField}>
						<Plus class="mr-2 h-4 w-4" />
						Add Field
					</Button>
				</div>
			{:else}
				{#each pageData.fields as field, index (field.id)}
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
											onchange={() => handleFieldTypeChange(field)}
											class="border-input bg-background dark:bg-input/30 ring-offset-background shadow-xs flex h-9 w-full rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&>option]:bg-popover [&>option]:text-popover-foreground"
										>
											<option value="shortText">Short Text</option>
											<option value="longText">Long Text</option>
											<option value="image">Image</option>
											<option value="contentReference">Content Reference</option>
										</select>
									</div>
								</div>

								{#if field.type === 'contentReference'}
									<div class="space-y-2">
										<Label for="schema-{field.id}">Reference Schema</Label>
										<select
											id="schema-{field.id}"
											bind:value={field.referenceSchema}
											onchange={() => handleReferenceSchemaChange(field)}
											class="border-input bg-background dark:bg-input/30 ring-offset-background shadow-xs flex h-9 w-full rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&>option]:bg-popover [&>option]:text-popover-foreground"
										>
											<option value="">Select schema...</option>
											{#each schemas as schema}
												<option value={schema.slug}>{schema.name}</option>
											{/each}
										</select>
									</div>

									<div class="flex items-center gap-2">
										<input
											id="multiple-{field.id}"
											type="checkbox"
											bind:checked={field.multiple}
											onchange={() => {
												// Clear value when switching between single/multiple
												field.value = '';
												// Trigger reactivity
												pageData.fields = [...pageData.fields];
											}}
											class="h-4 w-4"
										/>
										<Label for="multiple-{field.id}" class="font-normal">Allow multiple selections</Label>
									</div>
								{/if}

								<div class="space-y-2">
									<Label for="value-{field.id}">Content</Label>
									{#if field.type === 'longText'}
										<Textarea
											id="value-{field.id}"
											placeholder="Enter content..."
											bind:value={field.value}
											rows={4}
										/>
									{:else if field.type === 'contentReference'}
										{#if field.referenceSchema && contentItemsBySchema[field.referenceSchema]}
											{#if field.multiple}
												<!-- Multi-select with checkboxes -->
												<div class="space-y-2 rounded-lg border p-3 max-h-64 overflow-y-auto">
													{#each contentItemsBySchema[field.referenceSchema] as item}
														{@const isSelected = field.value?.split(',').map(id => id.trim()).includes(item.id)}
														<div class="flex items-center gap-2">
															<input
																id="ref-{field.id}-{item.id}"
																type="checkbox"
																checked={isSelected}
																onchange={(e) => {
																	const checked = (e.target as HTMLInputElement).checked;
																	const currentIds = field.value ? field.value.split(',').map(id => id.trim()).filter(Boolean) : [];

																	if (checked && !currentIds.includes(item.id)) {
																		currentIds.push(item.id);
																	} else if (!checked) {
																		const index = currentIds.indexOf(item.id);
																		if (index > -1) currentIds.splice(index, 1);
																	}

																	field.value = currentIds.join(',');
																	// Trigger reactivity
																	pageData.fields = [...pageData.fields];
																}}
																class="h-4 w-4"
															/>
															<Label for="ref-{field.id}-{item.id}" class="font-normal cursor-pointer flex-1">
																{item.title}
															</Label>
														</div>
													{/each}
												</div>
												{#if field.value}
													<p class="text-xs text-muted-foreground">
														{field.value.split(',').filter(Boolean).length} item(s) selected
													</p>
												{/if}
											{:else}
												<!-- Single select dropdown -->
												<select
													id="value-{field.id}"
													bind:value={field.value}
													class="border-input bg-background dark:bg-input/30 ring-offset-background shadow-xs flex h-9 w-full rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&>option]:bg-popover [&>option]:text-popover-foreground"
												>
													<option value="">Select content...</option>
													{#each contentItemsBySchema[field.referenceSchema] as item}
														<option value={item.id}>{item.title}</option>
													{/each}
												</select>
											{/if}
										{:else}
											<p class="text-sm text-muted-foreground">
												{field.referenceSchema ? 'Loading content...' : 'Select a schema first'}
											</p>
										{/if}
									{:else if field.type === 'image'}
										<div class="space-y-3">
											<!-- Image Preview -->
											{#if field.value}
												<div class="relative inline-block">
													<img
														src={field.value}
														alt="Preview"
														class="max-w-full h-auto max-h-48 rounded-lg border"
													/>
													<Button
														variant="destructive"
														size="icon"
														class="absolute top-2 right-2 h-6 w-6"
														onclick={() => clearImage(field.id)}
													>
														<X class="h-3 w-3" />
													</Button>
												</div>
											{/if}

											<!-- File Upload -->
											<div class="space-y-1">
												<div class="flex gap-2">
													<Input
														id="upload-{field.id}"
														type="file"
														accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
														onchange={(e) => handleFileSelect(field.id, e)}
														disabled={uploadingFields[field.id]}
														class="flex-1"
													/>
													{#if uploadingFields[field.id]}
														<Button disabled size="sm">
															<Loader2 class="mr-2 h-4 w-4 animate-spin" />
															Uploading...
														</Button>
													{/if}
												</div>
												<p class="text-xs text-muted-foreground">
													Images will be automatically optimized and converted to WebP format
												</p>
											</div>

											<!-- Manual URL Input -->
											<div class="space-y-1">
												<Label for="url-{field.id}" class="text-xs text-muted-foreground"
													>Or enter image URL manually:</Label
												>
												<Input
													id="url-{field.id}"
													type="text"
													placeholder="/uploads/image.jpg"
													bind:value={field.value}
													disabled={uploadingFields[field.id]}
												/>
											</div>
										</div>
									{:else}
										<Input
											id="value-{field.id}"
											type="text"
											placeholder="Enter content..."
											bind:value={field.value}
										/>
									{/if}
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
</div>
