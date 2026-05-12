<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/theme.svelte';

	let { children } = $props();

	// Initialize theme on mount
	$effect(() => {
		// Access themeStore.current to trigger initialization
		const _ = themeStore.current;
	});
</script>

{@render children?.()}
