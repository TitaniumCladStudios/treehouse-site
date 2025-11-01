# Git-Based CMS for SvelteKit - Implementation Plan

## Project Overview

A lightweight, git-backed CMS built with SvelteKit that stores content in flat JSON files, provides an authenticated admin interface, and can be hosted on Netlify without additional services.

## Requirements

1. Built in SvelteKit
2. Authenticated admin interface
3. Content management for public-facing pages
4. Content stored in flat JSON files versioned via git
5. API exposed via SvelteKit server endpoints
6. Hostable on Netlify without external services

## Selected Architecture Decisions

- **Content Format**: JSON
- **Editor Interface**: Simple form fields
- **Deployment Model**: One instance per client
- **Admin Features**: Image upload/management, Git commit messages

## Difficulty Assessment

**For an experienced SvelteKit developer: Moderate difficulty, 2-4 days for a solid MVP**

### Straightforward Parts
- SvelteKit routing and API endpoints (easy)
- Form-based admin interface (easy)
- JSON file operations (easy)
- Basic authentication (straightforward)
- Image uploads (straightforward)

### Moderately Complex Part
- **Git commits on Netlify** - Netlify builds are read-only in production
  - **Solution**: Use GitHub API to commit changes directly
  - **Alternative**: Trigger rebuilds after content changes

## Project Structure

```
/src
  /routes
    /admin          # Protected admin interface
      +page.svelte  # Content editor
      +layout.server.ts  # Auth guard
    /api            # API endpoints
      /content      # CRUD operations
      /auth         # Login/logout
      /images       # Image upload
    +page.svelte    # Public homepage
  /lib
    /server
      /auth.ts      # Auth logic
      /git.ts       # Git operations via GitHub API
      /content.ts   # Content file operations
    /schemas        # JSON schemas for content types
/content            # JSON content files
/static/uploads     # Uploaded images
```

## Implementation Steps

### Phase 1: Foundation (Day 1)

1. **Initialize SvelteKit project**
   - Set up TypeScript configuration
   - Install necessary dependencies
   - Configure SvelteKit adapter for Netlify

2. **Authentication System**
   - Create login form at `/admin/login`
   - Implement password hashing with bcrypt
   - Set up session management via HTTP-only cookies
   - Create auth guard using SvelteKit hooks (`src/hooks.server.ts`)
   - Protect all `/admin/*` routes

3. **Content Directory Structure**
   - Create `/content` directory for JSON files
   - Define JSON schemas for different content types
   - Set up TypeScript types for content models

### Phase 2: Content Management (Day 2)

4. **API Endpoints for Content** (`/api/content`)
   - **GET**: Read content files from disk
   - **POST**: Create new content entries
   - **PUT**: Update existing content
   - **DELETE**: Remove content entries
   - Validate against JSON schemas

5. **GitHub API Integration**
   - Install and configure Octokit
   - Create git helper functions in `/lib/server/git.ts`
   - Implement commit functionality:
     - Accept custom commit messages from users
     - Commit content changes to GitHub repo
     - Handle authentication via GitHub token

6. **Admin UI - Content Editor**
   - List view showing all content items
   - Create/edit forms dynamically based on content schemas
   - Commit message input field
   - Save button that triggers API call + git commit

### Phase 3: Image Handling (Day 3)

7. **Image Upload Endpoint** (`/api/images`)
   - Handle multipart form data
   - Store images in `/static/uploads`
   - Generate unique filenames (timestamp + hash)
   - Return public URLs for uploaded images
   - Commit uploaded images to git

8. **Image Picker Component**
   - Add image upload widget to admin forms
   - Display thumbnail previews
   - Allow selection from previously uploaded images

9. **Image Library View**
   - Admin page showing all uploaded images
   - Grid view with thumbnails
   - Copy URL functionality
   - Delete functionality

### Phase 4: Public Site & Polish (Day 4)

10. **Public-Facing Pages**
    - Create dynamic routes that fetch from content API
    - Implement SSR for SEO benefits
    - Style pages appropriately

11. **Preview Functionality**
    - Add preview mode in admin interface
    - Show how public page will look with unsaved changes
    - Side-by-side or modal preview

12. **Netlify Configuration**
    - Create `netlify.toml` configuration file
    - Set up environment variables:
      - `ADMIN_PASSWORD_HASH`
      - `GITHUB_TOKEN`
      - `GITHUB_REPO`
      - `SESSION_SECRET`
    - Configure build settings
    - Set up GitHub webhook for auto-deploys

## Key Technical Decisions

### Authentication Strategy

- **Password Storage**: Store bcrypt-hashed admin password in environment variable
- **Session Management**: Use HTTP-only, secure cookies with signed sessions
- **Auth Guard**: Implement in `src/hooks.server.ts` using SvelteKit's `handle` hook
- **Protected Routes**: All `/admin/*` routes require authentication

```typescript
// Example auth flow
if (event.url.pathname.startsWith('/admin')) {
  const session = event.cookies.get('session');
  if (!isValidSession(session)) {
    throw redirect(303, '/admin/login');
  }
}
```

### Git Integration Approach

- **Primary Method**: Use Octokit (GitHub API) to commit directly to repository
- **Workflow**:
  1. User saves content in admin interface
  2. Server writes changes to JSON file (in-memory or temporary)
  3. Server commits changes via GitHub API with user's commit message
  4. GitHub webhook triggers Netlify rebuild
  5. New build includes updated content

- **Why GitHub API?**: Netlify's production environment is read-only, so we can't use local git commands

### Content Schema Structure

Content is stored in JSON files with a flexible schema:

```json
{
  "pages": {
    "home": {
      "title": "Welcome to Our Site",
      "hero_image": "/uploads/hero-2024-01-15-abc123.jpg",
      "hero_text": "Your journey starts here",
      "sections": [
        {
          "heading": "About Us",
          "content": "We are a company that...",
          "image": "/uploads/about-2024-01-15-def456.jpg"
        }
      ]
    },
    "about": {
      "title": "About Us",
      "content": "Our story began...",
      "team_members": [
        {
          "name": "John Doe",
          "role": "CEO",
          "photo": "/uploads/john-2024-01-15-ghi789.jpg"
        }
      ]
    }
  }
}
```

Each content type can have its own schema defined in `/lib/schemas/`.

### Environment Variables Required

```bash
# Admin authentication
ADMIN_PASSWORD_HASH=<bcrypt_hash_of_password>

# GitHub integration
GITHUB_TOKEN=<personal_access_token_with_repo_scope>
GITHUB_REPO=<owner/repo-name>
GITHUB_BRANCH=main

# Session security
SESSION_SECRET=<random_secret_for_cookie_signing>
```

### Image Upload Strategy

- **Storage**: Save to `/static/uploads` directory
- **Naming Convention**: `{original-name}-{timestamp}-{hash}.{ext}`
- **Git Tracking**: Commit uploaded images to repository
- **URL Format**: `/uploads/{filename}` (served statically by SvelteKit)
- **Size Limits**: Configure max upload size (e.g., 5MB)
- **Allowed Types**: Validate MIME types (jpg, png, webp, svg)

## Dependencies

### Core
- `@sveltejs/kit` - SvelteKit framework
- `@sveltejs/adapter-netlify` - Netlify deployment
- `svelte` - Svelte framework

### Authentication
- `bcryptjs` - Password hashing
- `cookie` - Cookie parsing/serialization (or use SvelteKit's built-in)

### Git Integration
- `@octokit/rest` - GitHub API client
- `@octokit/auth-token` - Token authentication

### File Handling
- Built-in Node.js `fs/promises` - File system operations
- `formidable` or `busboy` - Multipart form parsing (or use SvelteKit's built-in)

### Validation (Optional)
- `zod` - Schema validation for content and forms

### Development
- `typescript` - Type safety
- `vite` - Build tool (included with SvelteKit)

## Netlify Deployment Configuration

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  node_bundler = "esbuild"
```

**Deployment Workflow:**
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Configure environment variables in Netlify dashboard
4. Set up GitHub webhook for automatic deploys
5. Each content change commits to GitHub → triggers Netlify rebuild

## Estimated Complexity

**Overall: 6/10**

- Simple enough to build quickly
- One moderately complex piece (GitHub API integration)
- Perfect balance for rapid client deployment
- Easy to template and replicate across clients

## Advantages of This Approach

1. **No Database Required**: All content in git-versioned JSON files
2. **Full History**: Git provides complete change history
3. **Easy Backup**: Clone the repository
4. **Simple Deployment**: Single static site on Netlify
5. **Low Cost**: Netlify free tier sufficient for small sites
6. **Developer Friendly**: Content is plain JSON, easy to seed or migrate
7. **Client Friendly**: Simple form-based interface

## Potential Limitations

1. **Content Size**: Not suitable for thousands of content items (but fine for small sites)
2. **Concurrent Edits**: No conflict resolution for simultaneous edits (acceptable for single-user)
3. **Build Time**: Each content change triggers full rebuild (fast for small sites)
4. **Image Storage**: Images in git can grow repository size (consider external storage for many images)

## Future Enhancements (Optional)

- Multiple content editors with user management
- Rollback functionality using git history
- Image optimization pipeline
- Content scheduling (publish at specific time)
- Media library with search/filtering
- Markdown editor option for blog content
- Content relationships and references
- Custom field types (date picker, color picker, etc.)
- Webhook notifications on content changes
- External image storage (Cloudinary, S3) integration

## Next Steps

1. Review this plan and confirm approach
2. Initialize SvelteKit project
3. Begin Phase 1 implementation
4. Iterate and test with first client site

---

## Implementation Progress

### Phase 1: Foundation

#### Project Setup
- [x] Initialize SvelteKit project
- [x] Install dependencies (shadcn-svelte, lucide-svelte, etc.)
- [x] Configure TypeScript
- [ ] Configure SvelteKit adapter for Netlify

#### Authentication System
- [x] Create login form at `/admin/login`
- [x] Design responsive login UI with shadcn-svelte (Card, Input, Label, Button)
- [x] Set up login route to bypass admin layout
- [x] Implement password hashing with bcrypt
- [x] Set up session management via HTTP-only cookies
- [x] Create auth guard using SvelteKit hooks (`src/hooks.server.ts`)
- [x] Protect all `/admin/*` routes (except login)
- [x] Create `/api/auth/login` endpoint
- [x] Create `/api/auth/logout` endpoint
- [x] Create password hash generator script (`scripts/hash-password.js`)
- [x] Set up environment variables for admin password and session secret

#### Admin Interface - Core Structure
- [x] Create admin layout with sidebar (`/admin/+layout.svelte`)
- [x] Implement sidebar navigation (Home, Pages, Settings)
- [x] Add responsive sidebar with mobile support
- [x] Create dashboard/home page (`/admin/+page.svelte`)
- [x] Add stats cards (pages, images, commits, last updated)
- [x] Add recent activity section
- [x] Add quick actions panel
- [x] Create pages management UI (`/admin/pages/+page.svelte`)
- [x] Create settings UI (`/admin/settings/+page.svelte`)
- [x] Add sonner toast notifications throughout admin
- [x] Add "View Live Site" link in sidebar footer

#### Theme & Appearance
- [x] Add light/dark mode toggle
- [x] Create theme store with localStorage persistence
- [x] Configure theme in settings page
- [x] Apply theme across all admin pages

#### Content Directory Structure
- [x] Create `/content` directory for JSON files
- [x] Create `/content/pages` directory for page content
- [x] Set up TypeScript types for content models (`PageContent`, `PageField`, `PageMetadata`)
- [x] Create demo content files (home.json, about.json)

### Phase 2: Content Management

#### API Endpoints for Content
- [x] Create `/api/content/pages` GET endpoint (list all pages)
- [x] Create `/api/content/pages` POST endpoint (create new page)
- [x] Create `/api/content/pages/[slug]` GET endpoint (read single page)
- [x] Create `/api/content/pages/[slug]` PUT endpoint (update page)
- [x] Create `/api/content/pages/[slug]` DELETE endpoint (delete page)
- [x] Create server-side content management functions (`loadPage`, `savePage`, `listPages`, `deletePage`)
- [x] Add error handling for content operations
- [x] Validate required fields (title, slug)

#### GitHub API Integration
- [x] Install and configure Octokit
- [x] Create git helper functions in `/lib/server/git.ts`
- [x] Implement commit functionality (`commitChanges`, `getCommitStats`)
- [x] Add custom commit message support
- [x] Handle GitHub authentication via token
- [x] Create CommitMetadataFields component for optional git metadata
- [x] Integrate commits into all content operations (pages, settings, media)
- [x] Add commit stats API endpoint (`/api/git/commits`)
- [x] Display real commit stats on dashboard

#### Admin UI - Content Editor
- [x] Create pages list view with stats (`/admin/pages`)
- [x] Build dynamic PageEditor component with field management
- [x] Support multiple field types (shortText, longText, image)
- [x] Add field reordering functionality (move up/down)
- [x] Add/remove fields dynamically
- [x] Create new page form (`/admin/pages/new`)
- [x] Create edit page form (`/admin/pages/[slug]`)
- [x] Connect forms to content API
- [x] Add save functionality with toast notifications
- [x] Add validation and error messages
- [x] Slug generation and validation
- [x] Add commit message input field (via CommitMetadataFields component)
- [ ] Implement content preview

### Phase 3: Image Handling

#### Image Upload System
- [x] Create `/api/upload` POST endpoint
- [x] Handle multipart form data
- [x] Store images in `/static/uploads`
- [x] Generate unique filenames (timestamp + sanitized name)
- [x] Return public URLs for uploaded images
- [x] Add file size limits (5MB)
- [x] Validate MIME types (jpeg, jpg, png, gif, webp)
- [x] Add uploads directory to `.gitignore`
- [x] Create `.gitkeep` for uploads folder structure
- [x] Install and integrate `sharp` for image optimization
- [x] Automatic WebP conversion at 85% quality
- [x] Effort level 6 for best compression
- [x] Commit uploaded images to git via GitHub API

#### Image Management UI
- [x] Create image upload widget in PageEditor
- [x] Display image thumbnail previews
- [x] Add file input with accept filter
- [x] Show upload progress with loading state
- [x] Add clear/remove image button
- [x] Manual URL input option
- [x] Integrate image upload into content forms
- [x] Toast notifications for upload success/errors
- [x] Client-side validation (file type and size)
- [x] Create dedicated image library view (`/admin/media`)
- [x] Add grid view with all uploaded images
- [x] Implement search/filter functionality
- [x] Add upload dialog with drag-and-drop
- [x] Add delete functionality with confirmation dialog
- [x] Display image metadata (filename, size, date)
- [x] Connect media stats to dashboard

#### Content Types & Schemas System
- [x] Create content schema management system
- [x] Create `/api/schemas` endpoints for CRUD operations
- [x] Create `/api/content/[schema]` dynamic endpoints
- [x] Create content types management UI (`/admin/content-types`)
- [x] Create content type editor with field definitions
- [x] Support for custom content types beyond pages
- [x] Dynamic content editing based on schemas
- [x] Type-safe schema definitions with TypeScript
- [x] Field type system (shortText, longText, image, richText, number, boolean, date)

### Additional Features Implemented

#### Settings System
- [x] Create `SiteSettings` TypeScript interface
- [x] Create `/content/settings.json` file
- [x] Create `/api/settings` GET endpoint (read settings)
- [x] Create `/api/settings` PUT endpoint (update settings)
- [x] Create settings page in admin (`/admin/settings`)
- [x] Add settings form with validation
- [x] Integrate settings into admin layout
- [x] Use settings for "View Live Site" link
- [x] Settings fields: siteName, siteDescription, siteUrl, adminEmail
- [x] Auto-reload after settings save

### Phase 4: Public Site & Deployment

#### Public-Facing Pages
- [x] Create home page route (`/+page.svelte`)
- [x] Create about page route (`/about/+page.svelte`)
- [x] Implement SSR with page loaders (`+page.ts`)
- [x] Fetch content from content API
- [x] Style public pages with shadcn-svelte components
- [x] Add gradient backgrounds and responsive design
- [x] Add error handling for failed content loads
- [x] Add navigation between pages
- [x] Add links back to admin dashboard
- [x] Helper functions to access field values by ID

#### Preview Functionality
- [ ] Add preview mode in admin
- [ ] Show unsaved changes in preview
- [ ] Implement side-by-side or modal preview

#### Netlify Deployment
- [ ] Install and configure `@sveltejs/adapter-netlify`
- [ ] Create `netlify.toml` configuration
- [ ] Set up environment variables in Netlify dashboard:
  - [ ] `ADMIN_PASSWORD_HASH`
  - [ ] `GITHUB_TOKEN`
  - [ ] `GITHUB_REPO`
  - [ ] `GITHUB_BRANCH`
  - [ ] `SESSION_SECRET`
- [ ] Configure build settings
- [ ] Set up GitHub webhook for auto-deploys
- [ ] Test deployment pipeline
- [ ] Verify git commit workflow in production
- [ ] Create deployment documentation

### Additional Features

#### Testing & Quality
- [ ] Add unit tests for auth logic
- [ ] Add integration tests for API endpoints
- [ ] Test responsive design on multiple devices
- [ ] Test dark mode across all pages
- [ ] Performance testing
- [ ] Security audit

#### Documentation
- [ ] Write deployment guide
- [ ] Document environment variables
- [ ] Create content schema documentation
- [ ] Write user guide for content editing
- [ ] Document git workflow

---

## Current Status Summary

### ✅ Completed Features
- Full authentication system with login/logout
- Admin dashboard with statistics and quick actions
- Page content management (create, read, update, delete)
- Dynamic field editor with multiple field types
- Image upload with preview and validation
- Image library with search, filter, and delete
- Public-facing pages (home and about) pulling from CMS
- Settings management system
- Content types/schemas system for custom content
- GitHub API integration with Octokit
- Automatic git commits for all content changes
- Custom commit messages and author metadata
- Commit statistics on dashboard
- Native image optimization with Sharp (WebP conversion)
- Toast notifications for user feedback
- Light/dark theme support
- Responsive design throughout

### 🚧 In Progress
- Netlify deployment configuration

### 📋 Next Priorities
1. **Netlify deployment setup** - Install adapter, create config, deploy to production
2. Content preview functionality
3. Documentation and testing
4. User guide for content editors

**Last Updated:** 2025-10-31
