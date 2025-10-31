# Content References - Usage Guide

Content References allow you to link custom content items to your pages, enabling you to fetch everything in a single API call.

## Setting Up

### 1. Create a Content Type
First, create a custom content type (e.g., "Blog Post"):
- Go to `/admin/content-types`
- Click "New Content Type"
- Add fields like: Title, Body, Author, Featured Image, etc.
- Save the schema

### 2. Create Content Items
- The new content type will appear in the sidebar
- Click on it to create content items
- Add several items

### 3. Add Content Reference to a Page
- Go to `/admin/pages/home` (or any page)
- Click "Add Field"
- Set Field Type to "Content Reference"
- Select the schema you want to reference (e.g., "Blog Post")
- **Optional:** Check "Allow multiple selections" to select multiple items
- Select the content item(s) you want to link
  - Single mode: Dropdown selector
  - Multiple mode: Checkbox list with counter
- Save the page

## API Usage

### Regular API (IDs only)
```
GET /api/content/pages/home
```
Returns:
```json
{
  "metadata": { "slug": "home", "title": "Home" },
  "fields": [
    {
      "id": "featured_posts",
      "type": "contentReference",
      "value": "item_123456789",
      "referenceSchema": "blog-post"
    }
  ]
}
```

### Expanded API (Full content)
```
GET /api/content/pages/home/expanded
```

**Single Reference Returns:**
```json
{
  "metadata": { "slug": "home", "title": "Home" },
  "fields": [
    {
      "id": "featured_post",
      "label": "Featured Post",
      "type": "contentReference",
      "value": "item_123456789",
      "referenceSchema": "blog-post",
      "multiple": false
    }
  ],
  "expandedFields": {
    "featured_post": {
      "id": "item_123456789",
      "title": "My First Blog Post",
      "fields": {
        "body": "This is the post content...",
        "author": "John Doe",
        "featured_image": "/uploads/image.webp"
      }
    }
  }
}
```

> **Note:** Both the `expandedFields` keys AND the content item field keys use label-based slugs instead of IDs. For example, if your Blog Post schema has a field labeled "Post Body", access it as `item.fields.post_body`.

**Multiple References Returns (Array):**
```json
{
  "metadata": { "slug": "home", "title": "Home" },
  "fields": [
    {
      "id": "featured_posts",
      "label": "Featured Posts",
      "type": "contentReference",
      "value": "item_123,item_456,item_789",
      "referenceSchema": "blog-post",
      "multiple": true
    }
  ],
  "expandedFields": {
    "featured_posts": [
      {
        "id": "item_123",
        "title": "First Post",
        "fields": { ... }
      },
      {
        "id": "item_456",
        "title": "Second Post",
        "fields": { ... }
      },
      {
        "id": "item_789",
        "title": "Third Post",
        "fields": { ... }
      }
    ]
  }
}
```

## Frontend Example

### Single Reference
```svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props();

  // Access the expanded content by field label (converted to slug)
  // Field labeled "Featured Post" → expandedFields.featured_post
  const featuredPost = $derived(data.pageData?.expandedFields?.featured_post);
</script>

{#if featuredPost}
  <article>
    <h2>{featuredPost.title}</h2>
    <img src={featuredPost.fields.featured_image} alt={featuredPost.title} />
    <p>{featuredPost.fields.body}</p>
    <p>By {featuredPost.fields.author}</p>
  </article>
{/if}
```

### Multiple References
```svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props();

  // Access the expanded content by field label (converted to slug)
  // Field labeled "Featured Posts" → expandedFields.featured_posts
  const featuredPosts = $derived(data.pageData?.expandedFields?.featured_posts || []);
</script>

{#if Array.isArray(featuredPosts) && featuredPosts.length > 0}
  <div class="posts-grid">
    {#each featuredPosts as post}
      <article>
        <h2>{post.title}</h2>
        <img src={post.fields.featured_image} alt={post.title} />
        <p>{post.fields.body}</p>
        <p>By {post.fields.author}</p>
      </article>
    {/each}
  </div>
{/if}
```

## Page Loader Example

```typescript
// src/routes/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/content/pages/home/expanded');
  const pageData = await response.json();

  return { pageData };
};
```

## Benefits

✅ **Single API Call** - Get page + related content in one request
✅ **Type Safety** - Full TypeScript support
✅ **Flexible** - Reference any custom content type
✅ **Optimized** - Parallel loading of references
✅ **SEO Friendly** - All content available for SSR

## Field Naming Convention

Both `expandedFields` keys AND content item field keys use **field labels** (converted to slugs) instead of field IDs:

### Page-Level Content References
| Field Label | Slug Key | Example |
|------------|----------|---------|
| "Featured Post" | `featured_post` | `expandedFields.featured_post` |
| "Team Members" | `team_members` | `expandedFields.team_members` |
| "Hero Banner" | `hero_banner` | `expandedFields.hero_banner` |
| "Product Categories" | `product_categories` | `expandedFields.product_categories` |

### Content Item Fields
| Schema Field Label | Slug Key | Example |
|-------------------|----------|---------|
| "Post Body" | `post_body` | `item.fields.post_body` |
| "Author Name" | `author_name` | `item.fields.author_name` |
| "Featured Image" | `featured_image` | `item.fields.featured_image` |
| "Publish Date" | `publish_date` | `item.fields.publish_date` |

**Conversion Rules:**
- Lowercase
- Spaces/special chars → underscores
- Trim leading/trailing underscores

This makes your code much more readable and maintainable!

## Tips

- Use content references for: Featured posts, Team members, Products, Testimonials
- Keep the page structure simple and reference rich content
- Use the expanded API for frontend display
- Use the regular API when you only need IDs
- Choose meaningful field labels since they become your code identifiers
