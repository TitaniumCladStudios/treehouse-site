<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Plus, Search, FileText, Edit, Trash2 } from 'lucide-svelte';

  // Mock data for demonstration
  const pages = [
    { id: 1, title: 'Home', slug: 'home', status: 'published', lastModified: '2 hours ago' },
    { id: 2, title: 'About Us', slug: 'about', status: 'published', lastModified: '1 day ago' },
    { id: 3, title: 'Services', slug: 'services', status: 'draft', lastModified: '3 days ago' },
    { id: 4, title: 'Contact', slug: 'contact', status: 'published', lastModified: '1 week ago' },
    { id: 5, title: 'Blog', slug: 'blog', status: 'published', lastModified: '2 weeks ago' }
  ];

  let searchQuery = '';
</script>

<svelte:head>
  <title>Pages - Hyperspace CMS</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Pages</h2>
      <p class="text-muted-foreground">
        Manage your site's content pages
      </p>
    </div>
    <Button>
      <Plus class="mr-2 h-4 w-4" />
      Create Page
    </Button>
  </div>

  <Card.Root>
    <Card.Header>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Card.Title>All Pages</Card.Title>
          <Card.Description>
            {pages.length} total pages
          </Card.Description>
        </div>
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pages..."
            bind:value={searchQuery}
            class="pl-8"
          />
        </div>
      </div>
    </Card.Header>
    <Card.Content>
      <div class="space-y-4">
        {#each pages as page}
          <div class="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
            <div class="flex items-center gap-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <FileText class="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">{page.title}</h3>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>/{page.slug}</span>
                  <span>•</span>
                  <span class={page.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>
                    {page.status}
                  </span>
                  <span>•</span>
                  <span>{page.lastModified}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit class="h-4 w-4" />
                <span class="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 class="h-4 w-4" />
                <span class="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </Card.Content>
  </Card.Root>

  <div class="grid gap-4 md:grid-cols-3">
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-sm font-medium">Published</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">
          {pages.filter(p => p.status === 'published').length}
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title class="text-sm font-medium">Drafts</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">
          {pages.filter(p => p.status === 'draft').length}
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title class="text-sm font-medium">Total Pages</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">{pages.length}</div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
