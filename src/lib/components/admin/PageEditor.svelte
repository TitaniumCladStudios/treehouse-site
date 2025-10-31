<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-svelte';
	import type { PageContent, PageField, PageFieldType } from '$lib/types/content';

	// Props
	let { pageData, isNew = false }: { pageData: PageContent; isNew?: boolean } = $props();

	function addField() {
		const newField: PageField = {
			id: `field_${Date.now()}`,
			label: 'New Field',
			type: 'shortText',
			value: ''
		};
		pageData.fields = [...pageData.fields, newField];
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
											class="border-input bg-background dark:bg-input/30 ring-offset-background shadow-xs flex h-9 w-full rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&>option]:bg-popover [&>option]:text-popover-foreground"
										>
											<option value="shortText">Short Text</option>
											<option value="longText">Long Text</option>
											<option value="image">Image</option>
										</select>
									</div>
								</div>

								<div class="space-y-2">
									<Label for="value-{field.id}">Content</Label>
									{#if field.type === 'longText'}
										<Textarea
											id="value-{field.id}"
											placeholder="Enter content..."
											bind:value={field.value}
											rows={4}
										/>
									{:else}
										<Input
											id="value-{field.id}"
											type="text"
											placeholder={field.type === 'image' ? '/uploads/image.jpg' : 'Enter content...'}
											bind:value={field.value}
										/>
									{/if}
									{#if field.type === 'image'}
										<p class="text-xs text-muted-foreground">
											Enter the image path (e.g., /uploads/image.jpg)
										</p>
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
