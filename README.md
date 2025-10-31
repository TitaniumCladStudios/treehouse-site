# Hyperspace CMS
They're jumping to lightspeed!

Hyperspace CMS is a simple to use, embedded CMS that is meant to be deployed to a single hosting platform such as Netlify or Vercel. The project serves as a template that can be cloned so that custom frontend components can be built using Sveltkit, while the endpoints already exist to fetch custom CMS data that is created via the admin interface. Think of it as a headful CMS like WordPress, but the content is stored in JSON files in the project itself and versioned via GIT.

## But Why?
I didn't want to host a database, and most of my smaller clients don't need anything larger than this. I needed something minimal in terms of admin functionality that they could log into to edit content, and I wanted to enjoy cheap, single service hosting on Netlify.But

## Doesn't this Exist
Not in my preferred stack of Sveltekit. TinaCMS got close, but configuring it to work with Sveltekit can be a headache, and you can't host it on Netlify. All the endpoints on this project are on netlify as cloud functions, and the frontend is a built static site. It's quite simple.But

## What's the full stack?
Good question. Several pieces of tech went into this, most of which I chose to get better at using:

- Sveltekit
- Typescript
- Tailwind
- Storybook
- The github API for production updates

If I add any more or think of any more, I'll add them here.

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
