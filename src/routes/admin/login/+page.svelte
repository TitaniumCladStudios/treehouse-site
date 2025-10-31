<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';

  let email = '';
  let password = '';
  let isLoading = false;
  let error = '';

  async function handleSubmit(event: Event) {
    event.preventDefault();
    error = '';
    isLoading = true;

    try {
      // TODO: Implement authentication logic here
      // This will be connected to the auth API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        error = data.message || 'Login failed';
        return;
      }

      // Redirect to admin dashboard on success
      window.location.href = '/admin';
    } catch (err) {
      error = 'An error occurred. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login - Hyperspace CMS</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">
        Hyperspace CMS
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Sign in to your admin account
      </p>
    </div>

    <Card.Root class="shadow-lg">
      <Card.Header>
        <Card.Title class="text-2xl">Sign in</Card.Title>
        <Card.Description>
          Enter your credentials to access the admin panel
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <form on:submit={handleSubmit} class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              bind:value={email}
              required
              disabled={isLoading}
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              bind:value={password}
              required
              disabled={isLoading}
              class="w-full"
            />
          </div>

          {#if error}
            <div class="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          {/if}

          <Button
            type="submit"
            disabled={isLoading}
            class="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card.Content>
      <Card.Footer class="flex flex-col space-y-2">
        <p class="text-center text-xs text-gray-500">
          Protected by HTTP-only cookies and bcrypt password hashing
        </p>
      </Card.Footer>
    </Card.Root>

    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Forgot your password? Contact your system administrator.</p>
    </div>
  </div>
</div>

<style>
  /* Additional responsive styles if needed */
  @media (max-width: 640px) {
    :global(.card) {
      border-radius: 0.5rem;
    }
  }
</style>
