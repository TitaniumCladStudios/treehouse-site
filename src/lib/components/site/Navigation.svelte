<script lang="ts">
	import { onMount } from 'svelte';
	import { Menu, X, Download } from 'lucide-svelte';

	interface NavLink {
		label: string;
		anchor: string;
		order: number;
	}

	interface Props {
		siteName: string;
		navLinks: NavLink[];
	}

	let { siteName, navLinks }: Props = $props();

	let isScrolled = $state(false);
	let isMobileMenuOpen = $state(false);

	// Sort nav links by order
	let sortedLinks = $derived([...navLinks].sort((a, b) => a.order - b.order));

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled
		? 'bg-white/95 backdrop-blur-sm shadow-sm'
		: 'bg-transparent'}"
>
	<div class="max-w-7xl mx-auto px-6 lg:px-12">
		<div class="flex items-center justify-between h-20">
			<!-- Logo -->
			<a
				href="#home"
				class="text-lg tracking-[0.2em] uppercase {isScrolled ? 'text-stone-800' : 'text-white'}"
			>
				{siteName}
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden xl:flex items-center gap-8">
				{#each sortedLinks as link}
					<a
						href={link.anchor}
						class="text-sm tracking-wider transition-colors {isScrolled
							? 'text-stone-600 hover:text-stone-800'
							: 'text-white/90 hover:text-white'}"
					>
						{link.label}
					</a>
				{/each}
				<a
					href="#contact"
					class="flex items-center gap-2 px-6 py-2 text-sm tracking-wider transition-colors {isScrolled
						? 'bg-stone-800 text-white hover:bg-stone-700'
						: 'bg-white text-stone-800 hover:bg-stone-100'}"
				>
					<Download size={16} />
					PRICING BROCHURE
				</a>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="xl:hidden p-2 {isScrolled ? 'text-stone-800' : 'text-white'}"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{#if isMobileMenuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMobileMenuOpen}
		<div class="xl:hidden bg-white border-t">
			<div class="px-6 py-4 space-y-4">
				{#each sortedLinks as link}
					<a
						href={link.anchor}
						class="block text-sm tracking-wider text-stone-600 hover:text-stone-800"
						onclick={closeMobileMenu}
					>
						{link.label}
					</a>
				{/each}
				<a
					href="#contact"
					class="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white text-sm tracking-wider justify-center"
					onclick={closeMobileMenu}
				>
					<Download size={16} />
					PRICING BROCHURE
				</a>
			</div>
		</div>
	{/if}
</nav>
