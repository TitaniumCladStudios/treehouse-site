<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	interface GalleryImage {
		image: string;
		alt_text: string;
		span: string;
	}

	interface Props {
		label: string;
		heading: string;
		images: GalleryImage[];
	}

	let { label, heading, images }: Props = $props();

	function getSpanClass(span: string): string {
		return span === '2' ? 'md:col-span-2' : 'md:col-span-1';
	}
</script>

<section id="gallery" class="py-24 md:py-32 bg-stone-50">
	<div class="max-w-7xl mx-auto px-6 lg:px-12">
		<SectionHeading {label} {heading} />

		<div class="grid md:grid-cols-3 gap-4 md:gap-6">
			{#each images as image, index}
				<ScrollReveal class={getSpanClass(image.span)} threshold={0.1}>
					<div class="aspect-[4/3] overflow-hidden group">
						<img
							src={image.image}
							alt={image.alt_text}
							class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
