<script lang="ts">
	import { Heart, Sparkles, Users } from 'lucide-svelte';

	interface Highlight {
		title: string;
		description: string;
		icon: string;
	}

	interface Props {
		label: string;
		heading: string;
		description: string;
		image: string;
		highlights: Highlight[];
	}

	let { label, heading, description, image, highlights }: Props = $props();

	const iconMap = {
		heart: Heart,
		sparkles: Sparkles,
		users: Users
	};
</script>

<section class="relative py-24 md:py-32 bg-stone-800 text-white overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 32px 32px;"
		></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
		<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
			<!-- Image -->
			<div class="order-2 lg:order-1">
				<div class="aspect-[3/4] overflow-hidden">
					<img src={image} alt="Wedding Experience" class="w-full h-full object-cover" />
				</div>
			</div>

			<!-- Content -->
			<div class="order-1 lg:order-2 space-y-12">
				<div class="space-y-6">
					<p class="text-sm tracking-[0.3em] uppercase text-stone-400">{label}</p>
					<h2 class="text-4xl md:text-5xl tracking-wide">
						{heading}
					</h2>
					<div class="w-16 h-px bg-white/40"></div>
					<p class="text-stone-300 leading-relaxed">
						{description}
					</p>
				</div>

				<div class="space-y-8">
					{#each highlights as highlight}
						{@const IconComponent = iconMap[highlight.icon as keyof typeof iconMap] || Heart}
						<div class="flex gap-4">
							<div class="flex-shrink-0">
								<IconComponent size={24} class="text-stone-400" />
							</div>
							<div class="space-y-1">
								<h3 class="tracking-wide">{highlight.title}</h3>
								<p class="text-sm text-stone-400">{highlight.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
