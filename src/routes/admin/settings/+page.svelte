<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Save, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { SiteSettings } from '$lib/types/content';

	let { data }: { data: PageData } = $props();

	let settings: SiteSettings = $state(
		data.settings || {
			siteName: '',
			siteDescription: '',
			siteUrl: '',
			adminEmail: ''
		}
	);

	let saving = $state(false);
	let error = $state('');

	async function saveSettings() {
		// Validate
		if (!settings.siteName.trim()) {
			error = 'Site name is required';
			return;
		}

		if (!settings.siteUrl.trim()) {
			error = 'Site URL is required';
			return;
		}

		saving = true;
		error = '';

		try {
			const response = await fetch('/api/settings', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(settings)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save settings');
			}

			toast.success('Settings saved successfully!');

			// Reload the page to update the sidebar
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save settings';
			console.error('Error saving settings:', err);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Settings - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Site Settings</h2>
			<p class="text-muted-foreground">Configure your site's basic information</p>
		</div>
		<Button onclick={saveSettings} disabled={saving}>
			{#if saving}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2 h-4 w-4" />
				Save Settings
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

	<!-- Settings Form -->
	{#if settings}
		<Card.Root>
			<Card.Header>
				<Card.Title>General Settings</Card.Title>
				<Card.Description>Basic information about your site</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="space-y-2">
					<Label for="siteName">Site Name</Label>
					<Input
						id="siteName"
						type="text"
						placeholder="My Awesome Site"
						bind:value={settings.siteName}
						required
					/>
					<p class="text-xs text-muted-foreground">The name of your website</p>
				</div>

				<div class="space-y-2">
					<Label for="siteDescription">Site Description</Label>
					<Textarea
						id="siteDescription"
						placeholder="A brief description of your site..."
						bind:value={settings.siteDescription}
						rows={3}
					/>
					<p class="text-xs text-muted-foreground">A short description for SEO and metadata</p>
				</div>

				<div class="space-y-2">
					<Label for="siteUrl">Site URL</Label>
					<Input
						id="siteUrl"
						type="url"
						placeholder="https://mysite.com"
						bind:value={settings.siteUrl}
						required
					/>
					<p class="text-xs text-muted-foreground">
						The public URL of your site (used for the "View Live Site" link)
					</p>
				</div>

				<div class="space-y-2">
					<Label for="adminEmail">Admin Email</Label>
					<Input
						id="adminEmail"
						type="email"
						placeholder="admin@example.com"
						bind:value={settings.adminEmail}
					/>
					<p class="text-xs text-muted-foreground">Contact email for site administration</p>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Footer Actions -->
		<div class="flex justify-end">
			<Button onclick={saveSettings} disabled={saving}>
				{#if saving}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save Settings
				{/if}
			</Button>
		</div>
	{/if}
</div>
