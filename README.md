# Hyperspace CMS

**They're jumping to lightspeed!**

**Live Demo:** [hyperspace.com](https://hyperspace.com) - Running on Hyperspace CMS itself!

Hyperspace CMS is a lightweight, git-backed content management system built with SvelteKit. It's designed to be deployed to a single hosting platform like Netlify or Vercel, with no database required. Content is stored in JSON files and versioned through Git, giving you full history, easy backups, and simple deployments.

Think of it as a headful CMS like WordPress, but the content lives in JSON files within your project, versioned via Git. Perfect for developers who want full control over their frontend while providing clients with an intuitive admin interface.

## Why Hyperspace CMS?

**No Database, No Problem:** I didn't want to host a database for smaller client projects. Most don't need the complexity. Hyperspace CMS stores everything in JSON files, versioned in Git, and deployed as a static site with serverless functions.

**Cheap & Simple Hosting:** Deploy to Netlify's free tier. No external services, no database hosting fees, just a single deployment target.

**The SvelteKit Advantage:** Built entirely in SvelteKit - my preferred stack. TinaCMS got close, but Hyperspace is simpler, requires no complex configuration, and works seamlessly with Netlify's serverless functions.

## Tech Stack

- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **shadcn-svelte** - Beautiful UI components
- **GitHub API** - Automated content commits
- **Sharp** - Image optimization (WebP conversion)
- **bcrypt** - Secure password hashing
- **Octokit** - GitHub integration
- **Storybook** - Component development

## Setup and Configuration

### Authentication Setup

The admin interface is protected by bcrypt-hashed password authentication. To set up your admin password:

1. **Generate a password hash:**
   ```bash
   node scripts/hash-password.js your-secure-password
   ```

2. **Copy the output to your `.env` file:**

   The script will output something like:
   ```
   ADMIN_PASSWORD_HASH=\$2b\$10\$RFx6Z3U9n8UB.UcoDfl9KektGKoedK3MCYh8sYYC7jaPfuCoz5rE2
   ```

3. **Important:** The `$` characters must be escaped with backslashes (`\$`) in your `.env` file to prevent shell variable interpolation.

4. **For production deployment (Netlify, Vercel, etc.):**

   Set the `ADMIN_PASSWORD_HASH` environment variable in your hosting platform's dashboard. You can use the raw hash (without escaping) when setting it through the web interface:
   ```
   $2b$10$RFx6Z3U9n8UB.UcoDfl9KektGKoedK3MCYh8sYYC7jaPfuCoz5rE2
   ```

### Environment Variables

Copy `.env.example` to `.env` and configure the following:

- `ADMIN_PASSWORD_HASH` - Bcrypt hash of your admin password (required)
- `SESSION_SECRET` - Random secret for session cookie signing (required)
- `GITHUB_TOKEN` - GitHub personal access token for content commits (optional, for production)
- `GITHUB_REPO` - Your repository in format `owner/repo-name` (optional, for production)
- `GITHUB_BRANCH` - Target branch for commits, defaults to `main` (optional)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed and configured
- A GitHub account (for production deployment)
- A code editor (VS Code recommended)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hyperspace.git
   cd hyperspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Generate your admin password hash:
   ```bash
   node scripts/hash-password.js your-secure-password
   ```

   Add the output to your `.env` file:
   ```
   ADMIN_PASSWORD_HASH=\$2b\$10\$...
   SESSION_SECRET=your-random-secret-string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the admin interface**
   - Navigate to `http://localhost:5173/admin/login`
   - Log in with your password
   - Start creating content!

### Development Workflow

#### Available Scripts

```bash
# Start development server (with HMR)
npm run dev

# Start dev server + Storybook
npm start

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Storybook for component development
npm run storybook

# Type checking
npm run check

# Format code with Prettier
npm run format

# Lint code
npm run lint
```

#### Project Structure Overview

```
/src
  /routes
    /admin              # Protected admin interface
      +layout.svelte    # Admin layout with sidebar
      +page.svelte      # Dashboard with stats
      /pages            # Page management UI
      /content          # Dynamic content type management
      /content-types    # Schema creation/editing
      /media            # Image library
      /settings         # Site settings
      /commits          # Commit history viewer
    /api                # API endpoints (become serverless functions)
      /auth             # Login/logout
      /content          # Content CRUD operations
      /schemas          # Schema management
      /media            # Media CRUD operations
      /upload           # Image upload endpoint
      /git              # GitHub stats
      /settings         # Settings management
    +page.svelte        # Public homepage
  /lib
    /server             # Server-only code
      /auth.ts          # Authentication logic
      /git.ts           # GitHub API integration
      /content.ts       # Content file operations
      /schema.ts        # Schema management
    /components         # Reusable Svelte components
/content                # JSON content files (versioned in Git)
  /pages                # Page content
  /schemas              # Content type definitions
  settings.json         # Site settings
/static                 # Static assets
  /uploads              # Uploaded images (gitignored locally, committed via API)
/scripts                # Utility scripts
  hash-password.js      # Generate password hashes
  copy-content.js       # Build-time content copying
```

#### Making Changes

1. **Editing Components** - All UI components are in `/src/lib/components`
2. **Adding Routes** - Create new routes in `/src/routes`
3. **Server Logic** - Server-side code goes in `/src/lib/server`
4. **Styling** - Uses Tailwind CSS with custom theme configuration
5. **Types** - TypeScript types are colocated with their modules

#### Development Tips

- **Hot Module Replacement** - Changes to Svelte files reload instantly
- **TypeScript Checking** - Run `npm run check` to catch type errors
- **Component Development** - Use Storybook for isolated component work
- **API Testing** - Use tools like Postman or Thunder Client to test endpoints
- **Database-Free** - All content is in `/content` - just edit JSON files directly if needed

## Deployment

### Deployment Overview

Hyperspace CMS is designed to deploy to platforms like Netlify or Vercel. The recommended approach is Netlify with GitHub integration.

**📖 Full Deployment Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive step-by-step instructions.

### Quick Deployment Checklist

1. ✅ **Generate Credentials**
   - Admin password hash: `node scripts/hash-password.js YOUR_PASSWORD`
   - Session secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - GitHub Personal Access Token: https://github.com/settings/tokens

2. ✅ **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. ✅ **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables (see below)

4. ✅ **Environment Variables**

   Set these in your hosting platform:

   | Variable | Description | Example |
   |----------|-------------|---------|
   | `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | `$2b$10$...` |
   | `SESSION_SECRET` | Random string for session signing | `abc123def456...` |
   | `GITHUB_TOKEN` | Personal access token with repo scope | `ghp_...` |
   | `GITHUB_REPO` | Repository in `owner/repo` format | `username/hyperspace` |
   | `GITHUB_BRANCH` | Target branch (usually `main`) | `main` |

5. ✅ **Configure Webhook** (Optional)
   - Set up GitHub webhook to trigger rebuilds on content changes
   - Enables automatic deployment when you edit content

### Deployment Platforms

#### Netlify (Recommended)
- Automatic adapter detection
- Built-in serverless functions
- Free SSL certificates
- Global CDN
- Simple environment variable management

#### Vercel
- Similar features to Netlify
- Use `@sveltejs/adapter-vercel`
- Excellent performance

### Post-Deployment

After deployment:
1. Visit your site URL
2. Navigate to `/admin/login`
3. Log in with your admin password
4. Test creating content
5. Verify GitHub commits are working (check dashboard stats)

## Using the CMS

### Admin Interface Guide

#### Accessing the Admin

Navigate to `/admin/login` and enter your admin password. You'll be redirected to the dashboard.

#### Dashboard Overview

The dashboard provides:
- **Statistics Cards** - Quick overview of pages, images, commits, and last update
- **Recent Activity** - Latest commits made through the CMS
- **Quick Actions** - Jump to common tasks like creating pages or uploading media

#### Managing Pages

**Creating a Page:**
1. Go to **Pages** in the sidebar
2. Click **Create New Page**
3. Enter a title (slug is auto-generated)
4. Add fields using the **Add Field** button
5. Choose field types: Short Text, Long Text, Image, Rich Text, etc.
6. Fill in content for each field
7. (Optional) Add commit message and author info
8. Click **Save Page**

**Editing a Page:**
1. Go to **Pages** and click on the page you want to edit
2. Modify fields, add new ones, or remove existing ones
3. Reorder fields using the ↑↓ buttons
4. Save your changes

**Deleting a Page:**
1. Go to **Pages** and click on the page
2. Click **Delete Page** at the bottom
3. Confirm the deletion

#### Managing Content Types

Create custom content types beyond pages (e.g., blog posts, products, team members):

1. Go to **Content Types** in the sidebar
2. Click **Create New Content Type**
3. Define your schema:
   - **Type Name**: Singular name (e.g., "BlogPost")
   - **Type Name (Plural)**: Plural name (e.g., "BlogPosts")
   - **Add Fields**: Define the structure of your content
4. Save the schema
5. Access your new content type from the sidebar

#### Media Library

**Uploading Images:**
1. Go to **Media** in the sidebar
2. Click **Upload Images** or drag and drop files
3. Images are automatically optimized to WebP format
4. Use the search bar to find images

**Using Images:**
- When editing content, image fields have an **Upload** button
- Click to upload or enter a URL manually
- Preview appears instantly

**Deleting Images:**
1. Go to **Media Library**
2. Click on an image
3. Click **Delete** and confirm

#### Site Settings

Configure site-wide settings:
1. Go to **Settings** in the sidebar
2. Edit:
   - Site Name
   - Site Description
   - Site URL
   - Admin Email
3. Save changes (page will reload)

#### Commit History

View all commits made through the CMS:
1. Go to **Commits** in the sidebar
2. See commit messages, authors, and timestamps
3. Track your content changes over time

### Git Integration

Every action in the CMS creates a Git commit:
- **Page Created**: "Create page: [title]"
- **Page Updated**: "Update page: [title]"
- **Page Deleted**: "Delete page: [title]"
- **Media Uploaded**: "Upload media: [filename]"
- **Settings Changed**: "Update site settings"

**Custom Commit Messages:**
- Expand the "Git Commit Info (Optional)" section when editing
- Add a custom message and author details
- Helps maintain meaningful version history

### Best Practices

1. **Commit Messages** - Use descriptive messages for important changes
2. **Image Optimization** - Upload reasonably-sized images (they'll be optimized, but start smaller)
3. **Batch Uploads** - Upload multiple images at once to minimize rebuilds
4. **Content Organization** - Use consistent naming for pages and fields
5. **Regular Backups** - Your Git repository is your backup, but consider cloning it periodically
6. **Field Structure** - Plan your content structure before creating many pages
7. **Custom Content Types** - Create schemas for repeated content (blog posts, products, etc.)

## Features

### Content Management
- ✅ **Git-Backed Storage** - All content stored in JSON files, fully versioned
- ✅ **Dynamic Content Types** - Create custom content schemas with flexible field types
- ✅ **Page Management** - Create, edit, and delete pages with dynamic fields
- ✅ **Custom Fields** - Support for text (short/long), images, rich text, numbers, booleans, and dates
- ✅ **Field Reordering** - Drag and drop field organization
- ✅ **Content Preview** - View how your content looks before publishing
- ✅ **Slug Generation** - Automatic URL-friendly slugs with validation

### Media Management
- ✅ **Image Upload** - Drag-and-drop file uploads with instant previews
- ✅ **Automatic Optimization** - WebP conversion at 85% quality for optimal performance
- ✅ **Media Library** - Browse, search, and manage all uploaded images
- ✅ **File Validation** - Client and server-side validation for type and size
- ✅ **Git Integration** - Images automatically committed to repository

### Git & Version Control
- ✅ **GitHub API Integration** - Automatic commits to your repository
- ✅ **Custom Commit Messages** - Add meaningful messages to every change
- ✅ **Author Metadata** - Optional author name and email for commits
- ✅ **Commit Statistics** - Real-time stats on dashboard (total commits, recent activity)
- ✅ **Commit History** - View all commits made through the CMS
- ✅ **Full Version History** - Leverage Git's power for complete content history

### Admin Interface
- ✅ **Modern Dashboard** - Statistics, recent activity, and quick actions
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Light/Dark Theme** - Toggle between themes with persistent preference
- ✅ **Toast Notifications** - Real-time feedback for all actions
- ✅ **Secure Authentication** - Bcrypt-hashed passwords with HTTP-only cookies
- ✅ **Session Management** - Secure, signed session cookies
- ✅ **Settings Management** - Configure site name, description, URL, and admin email

### Developer Experience
- ✅ **Type-Safe** - Full TypeScript support throughout
- ✅ **Component Library** - Built with shadcn-svelte components
- ✅ **API Endpoints** - RESTful API for content, media, and settings
- ✅ **SSR Support** - Server-side rendering for optimal SEO
- ✅ **Storybook Integration** - Component development and documentation
- ✅ **Hot Module Replacement** - Fast development with Vite

### Deployment & Hosting
- ✅ **Single-Platform Deployment** - Deploy everything to Netlify or Vercel
- ✅ **Serverless Functions** - API routes become cloud functions automatically
- ✅ **Static Site Generation** - Fast, cacheable public pages
- ✅ **Webhook Support** - Automatic rebuilds on content changes
- ✅ **Environment Variables** - Secure configuration for production

## API Reference

### Content API

- `GET /api/content/pages` - List all pages
- `POST /api/content/pages` - Create a new page
- `GET /api/content/pages/[slug]` - Get a single page
- `PUT /api/content/pages/[slug]` - Update a page
- `DELETE /api/content/pages/[slug]` - Delete a page

### Schema API

- `GET /api/schemas` - List all content type schemas
- `POST /api/schemas` - Create a new schema
- `GET /api/schemas/[id]` - Get a single schema
- `PUT /api/schemas/[id]` - Update a schema
- `DELETE /api/schemas/[id]` - Delete a schema

### Media API

- `GET /api/media` - List all media files
- `POST /api/upload` - Upload a new image
- `DELETE /api/media/[filename]` - Delete a media file

### Settings API

- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

### Authentication API

- `POST /api/auth/login` - Login to admin
- `POST /api/auth/logout` - Logout from admin

### Git API

- `GET /api/git/commits` - Get commit statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

Future enhancements planned:
- [ ] Multi-user support with role-based access
- [ ] Content rollback using Git history
- [ ] Content scheduling (publish at specific time)
- [ ] Markdown editor for blog content
- [ ] Content relationships and references
- [ ] Webhook notifications on content changes
- [ ] External image storage integration (Cloudinary, S3)
- [ ] Multi-language support

## License

MIT

## Support

If you encounter issues or have questions:
- Check the [Deployment Guide](./DEPLOYMENT.md) for deployment help
- Review existing issues on GitHub
- Open a new issue with detailed information

## Acknowledgments

Built with:
- [SvelteKit](https://kit.svelte.dev/) - The framework
- [shadcn-svelte](https://www.shadcn-svelte.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Octokit](https://github.com/octokit/octokit.js) - GitHub API
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing

---

**Made with ❤️ for developers who want simple, git-backed content management**
