<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import { Save, Github, Key, Globe, Moon, Sun } from 'lucide-svelte';
  import { themeStore } from '$lib/theme.svelte';

  let siteName = 'Hyperspace CMS';
  let siteUrl = 'https://example.com';
  let githubRepo = 'username/repo';
  let githubBranch = 'main';

  function handleSave() {
    // TODO: Implement settings save functionality
    console.log('Saving settings...');
  }

  function handleThemeToggle(checked: boolean) {
    themeStore.setTheme(checked ? 'dark' : 'light');
  }
</script>

<svelte:head>
  <title>Settings - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h2 class="text-3xl font-bold tracking-tight">Settings</h2>
    <p class="text-muted-foreground">
      Configure your CMS and deployment settings
    </p>
  </div>

  <div class="grid gap-6">
    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          {#if themeStore.current === 'dark'}
            <Moon class="h-5 w-5" />
          {:else}
            <Sun class="h-5 w-5" />
          {/if}
          <Card.Title>Appearance</Card.Title>
        </div>
        <Card.Description>
          Customize the look and feel of the admin interface
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="flex items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <Label for="dark-mode" class="text-base">Dark Mode</Label>
            <p class="text-sm text-muted-foreground">
              Toggle between light and dark theme
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={themeStore.current === 'dark'}
            onCheckedChange={handleThemeToggle}
          />
        </div>
        <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            Your theme preference is automatically saved and will be applied across all admin pages.
          </p>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Globe class="h-5 w-5" />
          <Card.Title>Site Configuration</Card.Title>
        </div>
        <Card.Description>
          General settings for your website
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <Label for="siteName">Site Name</Label>
          <Input
            id="siteName"
            type="text"
            bind:value={siteName}
            placeholder="My Awesome Site"
          />
          <p class="text-sm text-muted-foreground">
            The name of your website
          </p>
        </div>

        <div class="space-y-2">
          <Label for="siteUrl">Site URL</Label>
          <Input
            id="siteUrl"
            type="url"
            bind:value={siteUrl}
            placeholder="https://example.com"
          />
          <p class="text-sm text-muted-foreground">
            The public URL of your website
          </p>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button onclick={handleSave}>
          <Save class="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </Card.Footer>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Github class="h-5 w-5" />
          <Card.Title>GitHub Integration</Card.Title>
        </div>
        <Card.Description>
          Configure Git repository for content versioning
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <Label for="githubRepo">Repository</Label>
          <Input
            id="githubRepo"
            type="text"
            bind:value={githubRepo}
            placeholder="username/repository"
          />
          <p class="text-sm text-muted-foreground">
            Format: owner/repository-name
          </p>
        </div>

        <div class="space-y-2">
          <Label for="githubBranch">Branch</Label>
          <Input
            id="githubBranch"
            type="text"
            bind:value={githubBranch}
            placeholder="main"
          />
          <p class="text-sm text-muted-foreground">
            The branch to commit changes to
          </p>
        </div>

        <div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p class="text-sm text-yellow-800">
            <strong>Note:</strong> GitHub token should be configured via environment variables
            (GITHUB_TOKEN) for security.
          </p>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button onclick={handleSave}>
          <Save class="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </Card.Footer>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Key class="h-5 w-5" />
          <Card.Title>Authentication</Card.Title>
        </div>
        <Card.Description>
          Manage admin access and security settings
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <Label for="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
          />
        </div>

        <div class="space-y-2">
          <Label for="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
          />
        </div>

        <div class="space-y-2">
          <Label for="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
          />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="secondary">
          <Key class="mr-2 h-4 w-4" />
          Update Password
        </Button>
      </Card.Footer>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title>Environment Variables</Card.Title>
        <Card.Description>
          Required environment variables for deployment
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="rounded-lg bg-muted p-4 font-mono text-sm">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">ADMIN_PASSWORD_HASH</span>
              <span class="text-green-600">✓ Set</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">GITHUB_TOKEN</span>
              <span class="text-green-600">✓ Set</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">GITHUB_REPO</span>
              <span class="text-green-600">✓ Set</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">SESSION_SECRET</span>
              <span class="text-green-600">✓ Set</span>
            </div>
          </div>
        </div>
        <p class="mt-4 text-sm text-muted-foreground">
          These should be configured in your deployment platform (e.g., Netlify environment variables).
        </p>
      </Card.Content>
    </Card.Root>
  </div>
</div>