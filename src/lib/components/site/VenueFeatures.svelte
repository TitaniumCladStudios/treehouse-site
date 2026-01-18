<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	interface VenueFeature {
		title: string;
		description: string;
		image: string;
		alignment: string;
	}

	interface Props {
		label: string;
		heading: string;
		features: VenueFeature[];
	}

	let { label, heading, features }: Props = $props();
</script>

<section id="venue" class="py-24 md:py-32 bg-white">
	<div class="max-w-7xl mx-auto px-6 lg:px-12">
		<SectionHeading {label} {heading} />

		<div class="space-y-32">
			{#each features as feature}
				<div
					class="grid md:grid-cols-2 gap-12 lg:gap-16 items-center {feature.alignment === 'right'
						? 'md:grid-flow-dense'
						: ''}"
				>
					<div class={feature.alignment === 'right' ? 'md:col-start-2' : ''}>
						<ScrollReveal>
							<div class="aspect-[4/3] overflow-hidden">
								<img
									src={feature.image}
									alt={feature.title}
									class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
								/>
							</div>
						</ScrollReveal>
					</div>
					<div
						class="space-y-6 {feature.alignment === 'right'
							? 'md:col-start-1 md:row-start-1'
							: ''}"
					>
						<h3 class="text-3xl md:text-4xl text-stone-800 tracking-wide">
							{feature.title}
						</h3>
						<div class="w-12 h-px bg-stone-300"></div>
						<p class="text-stone-600 leading-relaxed">
							{feature.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
