<script lang="ts">
	import { onMount } from 'svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface HeroImage {
		image: string;
		alt_text: string;
	}

	interface Props {
		location: string;
		title: string;
		subtitle: string;
		ctaText: string;
		images: HeroImage[];
	}

	let { location, title, subtitle, ctaText, images }: Props = $props();

	let emblaApi: any;

	const autoplayPlugin = Autoplay({ delay: 5000, stopOnInteraction: false });

	function onEmblaInit(event: CustomEvent) {
		emblaApi = event.detail;
	}

	function scrollPrev() {
		emblaApi?.scrollPrev();
	}

	function scrollNext() {
		emblaApi?.scrollNext();
	}
</script>

<section id="home" class="relative h-[75vh] flex items-center justify-center overflow-hidden">
	<!-- Carousel Background -->
	<div
		class="embla absolute inset-0"
		use:emblaCarouselSvelte={{ options: { loop: true }, plugins: [autoplayPlugin] }}
		onemblaInit={onEmblaInit}
	>
		<div class="embla__container h-full">
			{#each images as image}
				<div class="embla__slide relative h-[75vh] w-full flex-[0_0_100%]">
					<img src={image.image} alt={image.alt_text} class="w-full h-full object-cover" />
					<!-- Overlay -->
					<div class="absolute inset-0 bg-black/40"></div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Carousel Navigation -->
	<button
		onclick={scrollPrev}
		class="absolute left-4 md:left-8 z-20 p-2 text-white border border-white/50 bg-black/20 hover:bg-black/40 transition-colors rounded-full"
		aria-label="Previous slide"
	>
		<ChevronLeft size={24} />
	</button>
	<button
		onclick={scrollNext}
		class="absolute right-4 md:right-8 z-20 p-2 text-white border border-white/50 bg-black/20 hover:bg-black/40 transition-colors rounded-full"
		aria-label="Next slide"
	>
		<ChevronRight size={24} />
	</button>

	<!-- Content -->
	<div class="relative z-10 text-center text-white px-6">
		<div class="max-w-4xl mx-auto space-y-6">
			<div class="space-y-2">
				<p class="text-sm tracking-[0.3em] uppercase opacity-90">{location}</p>
				<h1 class="text-5xl md:text-7xl lg:text-8xl tracking-wide">
					{title}
				</h1>
			</div>
			<div class="w-16 h-px bg-white/60 mx-auto"></div>
			<p class="text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-95">
				{subtitle}
			</p>
			<div class="pt-8">
				<a
					href="#contact"
					class="inline-block px-10 py-4 bg-white text-stone-800 tracking-wider hover:bg-stone-100 transition-all"
				>
					{ctaText}
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
		<a href="#about" class="text-white animate-bounce block">
			<ChevronDown size={32} />
		</a>
	</div>
</section>

<style>
	.embla {
		overflow: hidden;
	}
	.embla__container {
		display: flex;
	}
	.embla__slide {
		min-width: 0;
	}
</style>
