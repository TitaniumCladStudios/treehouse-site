<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { CommitMetadata } from '$lib/types/git';

	let {
		title = 'Git Commit Options',
		description = 'Optionally customize the commit message and author used for this change.',
		commitMetadata = $bindable<CommitMetadata>({
			message: '',
			authorName: '',
			authorEmail: '',
			branch: ''
		})
	}: {
		title?: string;
		description?: string;
		commitMetadata: CommitMetadata;
	} = $props();
</script>

<div class="space-y-4 rounded-lg border border-dashed bg-muted/30 p-4 text-sm">
	<div>
		<h3 class="text-sm font-semibold tracking-tight">{title}</h3>
		<p class="text-xs text-muted-foreground">{description}</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<Label for="commit-message">Commit Message</Label>
			<Input
				id="commit-message"
				type="text"
				placeholder="Describe what changed..."
				bind:value={commitMetadata.message}
			/>
			<p class="text-xs text-muted-foreground">Leave blank to use the automatic message.</p>
		</div>

		<div class="space-y-2">
			<Label for="commit-branch">Target Branch</Label>
			<Input
				id="commit-branch"
				type="text"
				placeholder="Defaults to configured branch"
				bind:value={commitMetadata.branch}
			/>
		</div>

		<div class="space-y-2">
			<Label for="commit-author-name">Author Name</Label>
			<Input
				id="commit-author-name"
				type="text"
				placeholder="Optional commit author name"
				bind:value={commitMetadata.authorName}
			/>
		</div>

		<div class="space-y-2">
			<Label for="commit-author-email">Author Email</Label>
			<Input
				id="commit-author-email"
				type="email"
				placeholder="Optional commit author email"
				bind:value={commitMetadata.authorEmail}
			/>
		</div>
	</div>
</div>
