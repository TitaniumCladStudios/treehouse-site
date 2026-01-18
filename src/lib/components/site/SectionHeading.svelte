<script lang="ts">
	interface Props {
		label: string;
		heading: string;
		light?: boolean;
	}

	let { label, heading, light = false }: Props = $props();
</script>

<div class="text-center mb-16 md:mb-20">
	<p
		class="text-sm tracking-[0.3em] uppercase mb-4 {light
			? 'text-stone-400'
			: 'text-stone-500'}"
	>
		{label}
	</p>
	<h2
		class="text-4xl md:text-5xl tracking-wide {light ? 'text-white' : 'text-stone-800'}"
	>
		{heading}
	</h2>
</div>
