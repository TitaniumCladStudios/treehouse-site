<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Loader2, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { SchemaField } from '$lib/types/content';

	let {
		field,
		value = $bindable(),
		disabled = false
	}: {
		field: SchemaField;
		value: any;
		disabled?: boolean;
	} = $props();

	let uploading = $state(false);

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
			value = data.url;

			toast.success('Image uploaded successfully!');
		} catch (error) {
			console.error('Error uploading image:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to upload image');
		} finally {
			uploading = false;
		}
	}

	function clearImage() {
		value = '';
	}
</script>

<div class="space-y-2">
	<Label for={field.id}>
		{field.label}
		{#if field.required}<span class="text-destructive">*</span>{/if}
	</Label>

	{#if field.type === 'shortText'}
		<Input
			id={field.id}
			type="text"
			placeholder={field.helpText || ''}
			bind:value
			required={field.required}
			{disabled}
		/>
	{:else if field.type === 'longText' || field.type === 'richText'}
		<Textarea
			id={field.id}
			placeholder={field.helpText || ''}
			bind:value
			required={field.required}
			{disabled}
			rows={6}
		/>
	{:else if field.type === 'image'}
		<div class="space-y-3">
			{#if value}
				<div class="relative inline-block">
					<img src={value} alt="Preview" class="max-w-full h-auto max-h-48 rounded-lg border" />
					<Button
						variant="destructive"
						size="icon"
						class="absolute top-2 right-2 h-6 w-6"
						onclick={clearImage}
					>
						<X class="h-3 w-3" />
					</Button>
				</div>
			{/if}

			<div class="flex gap-2">
				<Input
					id={field.id}
					type="file"
					accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
					onchange={uploadImage}
					disabled={uploading || disabled}
					class="flex-1"
				/>
				{#if uploading}
					<Button disabled size="sm">
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Uploading...
					</Button>
				{/if}
			</div>

			<div class="space-y-1">
				<Label for="url-{field.id}" class="text-xs text-muted-foreground"
					>Or enter image URL:</Label
				>
				<Input
					id="url-{field.id}"
					type="text"
					placeholder="/uploads/image.webp"
					bind:value
					disabled={uploading || disabled}
				/>
			</div>
		</div>
	{:else if field.type === 'number'}
		<Input
			id={field.id}
			type="number"
			placeholder={field.helpText || ''}
			bind:value
			required={field.required}
			{disabled}
		/>
	{:else if field.type === 'boolean'}
		<div class="flex items-center gap-2">
			<input
				id={field.id}
				type="checkbox"
				bind:checked={value}
				disabled={disabled}
				class="h-4 w-4"
			/>
			<Label for={field.id} class="font-normal">{field.helpText || 'Enable'}</Label>
		</div>
	{:else if field.type === 'date'}
		<Input
			id={field.id}
			type="date"
			bind:value
			required={field.required}
			{disabled}
		/>
	{:else if field.type === 'select'}
		<select
			id={field.id}
			bind:value
			required={field.required}
			disabled={disabled}
			class="border-input bg-background dark:bg-input/30 ring-offset-background shadow-xs flex h-9 w-full rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&>option]:bg-popover [&>option]:text-popover-foreground"
		>
			<option value="">Select...</option>
			{#each field.options || [] as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	{/if}

	{#if field.helpText && field.type !== 'boolean' && field.type !== 'image'}
		<p class="text-xs text-muted-foreground">{field.helpText}</p>
	{/if}
</div>
