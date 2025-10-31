<script lang="ts">
  import { page } from '$app/stores';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { Button } from '$lib/components/ui/button';
  import { Home, FileText, Settings, Menu } from 'lucide-svelte';

  let { children } = $props();

  // Check if current route is active
  function isActive(path: string): boolean {
    if (path === '/admin' && $page.url.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && $page.url.pathname.startsWith(path)) {
      return true;
    }
    return false;
  }
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Content>
      <Sidebar.Header>
        <div class="px-4 py-2">
          <h2 class="text-lg font-semibold tracking-tight">
            Hyperspace CMS
          </h2>
          <p class="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
      </Sidebar.Header>

      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/admin" active={isActive('/admin')}>
                <Home class="h-4 w-4" />
                <span>Home</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>

            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/admin/pages" active={isActive('/admin/pages')}>
                <FileText class="h-4 w-4" />
                <span>Pages</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>

            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/admin/settings" active={isActive('/admin/settings')}>
                <Settings class="h-4 w-4" />
                <span>Settings</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>

      <Sidebar.Footer>
        <div class="px-4 py-2">
          <p class="text-xs text-muted-foreground">
            v0.0.1
          </p>
        </div>
      </Sidebar.Footer>
    </Sidebar.Content>
  </Sidebar.Root>

  <Sidebar.Inset>
    <header class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sidebar.Trigger>
        <Button variant="ghost" size="icon">
          <Menu class="h-5 w-5" />
          <span class="sr-only">Toggle sidebar</span>
        </Button>
      </Sidebar.Trigger>

      <div class="flex flex-1 items-center justify-between">
        <h1 class="text-xl font-semibold">
          {#if $page.url.pathname === '/admin'}
            Dashboard
          {:else if $page.url.pathname.startsWith('/admin/pages')}
            Pages
          {:else if $page.url.pathname.startsWith('/admin/settings')}
            Settings
          {:else}
            Admin
          {/if}
        </h1>

        <div class="flex items-center gap-4">
          <Button variant="outline" size="sm" href="/admin/login">
            Sign Out
          </Button>
        </div>
      </div>
    </header>

    <main class="flex-1 p-4 sm:p-6">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>

<style>
  :global(body) {
    margin: 0;
  }
</style>
