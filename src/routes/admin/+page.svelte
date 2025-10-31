<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { FileText, Settings, Image, GitCommit } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Dashboard - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h2 class="text-3xl font-bold tracking-tight">Welcome back!</h2>
    <p class="text-muted-foreground">
      Here's what's happening with your CMS today.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">
          Total Pages
        </Card.Title>
        <FileText class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">12</div>
        <p class="text-xs text-muted-foreground">
          +2 from last month
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">
          Images Uploaded
        </Card.Title>
        <Image class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">48</div>
        <p class="text-xs text-muted-foreground">
          +12 from last month
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">
          Git Commits
        </Card.Title>
        <GitCommit class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">23</div>
        <p class="text-xs text-muted-foreground">
          +7 this week
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">
          Last Updated
        </Card.Title>
        <Settings class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">2h</div>
        <p class="text-xs text-muted-foreground">
          ago
        </p>
      </Card.Content>
    </Card.Root>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    <Card.Root class="col-span-full lg:col-span-4">
      <Card.Header>
        <Card.Title>Recent Activity</Card.Title>
        <Card.Description>
          Your latest content updates and changes
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          <div class="flex items-start space-x-4 rounded-md border p-4">
            <GitCommit class="h-5 w-5 text-muted-foreground" />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Updated homepage hero section
              </p>
              <p class="text-sm text-muted-foreground">
                2 hours ago
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4 rounded-md border p-4">
            <FileText class="h-5 w-5 text-muted-foreground" />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Created new "About Us" page
              </p>
              <p class="text-sm text-muted-foreground">
                1 day ago
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4 rounded-md border p-4">
            <Image class="h-5 w-5 text-muted-foreground" />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Uploaded 5 new images
              </p>
              <p class="text-sm text-muted-foreground">
                3 days ago
              </p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root class="col-span-full lg:col-span-3">
      <Card.Header>
        <Card.Title>Quick Actions</Card.Title>
        <Card.Description>
          Common tasks and shortcuts
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-2">
        <Button class="w-full justify-start" variant="outline" href="/admin/pages">
          <FileText class="mr-2 h-4 w-4" />
          Create New Page
        </Button>
        <Button class="w-full justify-start" variant="outline">
          <Image class="mr-2 h-4 w-4" />
          Upload Images
        </Button>
        <Button class="w-full justify-start" variant="outline" href="/admin/settings">
          <Settings class="mr-2 h-4 w-4" />
          Site Settings
        </Button>
        <Button class="w-full justify-start" variant="outline">
          <GitCommit class="mr-2 h-4 w-4" />
          View Git History
        </Button>
      </Card.Content>
    </Card.Root>
  </div>
</div>
