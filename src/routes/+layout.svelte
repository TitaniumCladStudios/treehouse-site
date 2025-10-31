<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { themeStore } from '$lib/theme.svelte';

	let { children } = $props();

	// Initialize theme on mount
	$effect(() => {
		// Access themeStore.current to trigger initialization
		const _ = themeStore.current;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
