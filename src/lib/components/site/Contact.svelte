<script lang="ts">
	import { MapPin, Phone, Mail, Calendar } from 'lucide-svelte';
	import SectionHeading from './SectionHeading.svelte';

	interface Props {
		label: string;
		heading: string;
		description: string;
		tourHeading: string;
		tourDescription: string;
		submitText: string;
		siteName: string;
		address: string;
		phone: string;
		hours: string;
		email: string;
		eventsEmail: string;
	}

	let {
		label,
		heading,
		description,
		tourHeading,
		tourDescription,
		submitText,
		siteName,
		address,
		phone,
		hours,
		email,
		eventsEmail
	}: Props = $props();

	let formData = $state({
		name: '',
		email: '',
		phone: '',
		eventDate: '',
		message: ''
	});
</script>

<section id="contact" class="py-24 md:py-32 bg-white">
	<div class="max-w-7xl mx-auto px-6 lg:px-12">
		<SectionHeading {label} {heading} />

		<p class="text-center text-stone-600 max-w-2xl mx-auto mb-16">
			{description}
		</p>

		<div class="grid lg:grid-cols-2 gap-16">
			<!-- Contact Info -->
			<div class="space-y-8">
				<!-- Visit Us -->
				<div class="flex gap-4">
					<div class="flex-shrink-0">
						<MapPin size={24} class="text-stone-400" />
					</div>
					<div>
						<h3 class="text-lg text-stone-800 tracking-wide mb-1">Visit Us</h3>
						<p class="text-stone-600">{address.split(',')[1]?.trim() || address}</p>
						<p class="text-stone-500 text-sm">{address.split(',')[0]}</p>
					</div>
				</div>

				<!-- Call Us -->
				<div class="flex gap-4">
					<div class="flex-shrink-0">
						<Phone size={24} class="text-stone-400" />
					</div>
					<div>
						<h3 class="text-lg text-stone-800 tracking-wide mb-1">Call Us</h3>
						<p class="text-stone-600">{phone}</p>
						<p class="text-stone-500 text-sm">{hours}</p>
					</div>
				</div>

				<!-- Email Us -->
				<div class="flex gap-4">
					<div class="flex-shrink-0">
						<Mail size={24} class="text-stone-400" />
					</div>
					<div>
						<h3 class="text-lg text-stone-800 tracking-wide mb-1">Email Us</h3>
						<p class="text-stone-600">{email}</p>
						<p class="text-stone-500 text-sm">{eventsEmail}</p>
					</div>
				</div>

				<!-- Book a Tour -->
				<div class="mt-12 p-8 bg-stone-50">
					<div class="flex gap-4">
						<div class="flex-shrink-0">
							<Calendar size={24} class="text-stone-400" />
						</div>
						<div>
							<h3 class="text-lg text-stone-800 tracking-wide mb-2">{tourHeading}</h3>
							<p class="text-stone-600 text-sm leading-relaxed">
								{tourDescription}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Contact Form -->
			<form
				name="contact"
				method="POST"
				data-netlify="true"
				netlify-honeypot="bot-field"
				class="space-y-6"
			>
				<input type="hidden" name="form-name" value="contact" />
				<p class="hidden">
					<label>
						Don't fill this out if you're human: <input name="bot-field" />
					</label>
				</p>

				<div>
					<label for="name" class="block text-sm text-stone-600 mb-2">Name *</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						bind:value={formData.name}
						class="w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm text-stone-600 mb-2">Email *</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						bind:value={formData.email}
						class="w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors"
					/>
				</div>

				<div>
					<label for="phone" class="block text-sm text-stone-600 mb-2">Phone</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						bind:value={formData.phone}
						class="w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors"
					/>
				</div>

				<div>
					<label for="eventDate" class="block text-sm text-stone-600 mb-2">Event Date</label>
					<input
						type="date"
						id="eventDate"
						name="eventDate"
						bind:value={formData.eventDate}
						class="w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors"
					/>
				</div>

				<div>
					<label for="message" class="block text-sm text-stone-600 mb-2"
						>Tell us about your vision</label
					>
					<textarea
						id="message"
						name="message"
						rows="6"
						bind:value={formData.message}
						class="w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors resize-none"
					></textarea>
				</div>

				<button
					type="submit"
					class="w-full py-4 bg-stone-800 text-white tracking-wider hover:bg-stone-700 transition-colors"
				>
					{submitText}
				</button>
			</form>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="py-12 bg-stone-50 border-t border-stone-200">
	<div class="max-w-7xl mx-auto px-6 lg:px-12 text-center">
		<p class="font-cursive text-2xl text-stone-800 mb-4">
			{siteName}
		</p>
		<p class="text-sm text-stone-500">
			&copy; {new Date().getFullYear()}
			{siteName}. All rights reserved.
		</p>
	</div>
</footer>
