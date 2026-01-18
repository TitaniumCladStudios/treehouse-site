<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		threshold?: number;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { threshold = 0.1, class: className = '', children }: Props = $props();

	let element: HTMLDivElement;
	let isVisible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="transition-all duration-1000 {isVisible
		? 'opacity-100 translate-y-0'
		: 'opacity-0 translate-y-8'} {className}"
>
	{@render children?.()}
</div>
