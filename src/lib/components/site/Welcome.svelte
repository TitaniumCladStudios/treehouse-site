<script lang="ts">
	interface Props {
		label: string;
		heading: string;
		paragraph1: string;
		paragraph2: string;
		ctaText: string;
	}

	let { label, heading, paragraph1, paragraph2, ctaText }: Props = $props();
</script>

<section id="about" class="py-24 md:py-32 bg-stone-50">
	<div class="max-w-3xl mx-auto px-6 text-center">
		<p class="text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">{label}</p>
		<h2 class="text-4xl md:text-5xl text-stone-800 tracking-wide mb-8">
			{heading}
		</h2>
		<div class="w-12 h-px bg-stone-300 mx-auto mb-8"></div>
		<div class="space-y-6 text-stone-600 leading-relaxed">
			<p>{paragraph1}</p>
			<p>{paragraph2}</p>
		</div>
		<div class="mt-10">
			<a
				href="#venue"
				class="inline-block px-10 py-4 border border-stone-800 text-stone-800 tracking-wider hover:bg-stone-800 hover:text-white transition-all"
			>
				{ctaText}
			</a>
		</div>
	</div>
</section>
