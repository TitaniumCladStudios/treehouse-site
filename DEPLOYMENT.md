# Deploying Hyperspace CMS to Netlify

This guide walks you through deploying your Hyperspace CMS to Netlify in production.

## Prerequisites

1. A GitHub account with your Hyperspace CMS repository
2. A Netlify account (free tier works great)
3. A GitHub Personal Access Token with repo permissions

## Step 1: Prepare Your Repository

Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

## Step 2: Create a GitHub Personal Access Token

The CMS needs a GitHub token to commit content changes back to your repository.

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Hyperspace CMS - Production"
4. Set expiration (recommend 90 days for production)
5. Select the following scope:
   - ✅ **repo** (Full control of private repositories)
6. Click "Generate token"
7. **IMPORTANT:** Copy the token immediately - you won't see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Generate Your Admin Password Hash

You need to hash your admin password before deploying:

```bash
node scripts/hash-password.js YOUR_SECURE_PASSWORD
```

This will output a bcrypt hash. Copy this hash - you'll need it in the next step.

**Important:** Use a strong, unique password for production!

## Step 4: Generate a Session Secret

Generate a secure random string for session encryption:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need this in the next step.

## Step 5: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub account
5. Select your Hyperspace CMS repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Functions directory:** `.netlify/functions-internal`
7. Click "Show advanced" → "Add environment variable"
8. Add the following environment variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `ADMIN_PASSWORD_HASH` | Your bcrypt hash from Step 3 | Hashed admin password |
| `SESSION_SECRET` | Your random secret from Step 4 | Session encryption key |
| `GITHUB_TOKEN` | Your GitHub token from Step 2 | GitHub API access token |
| `GITHUB_REPO` | `owner/repo-name` | Your GitHub repository (e.g., `username/hyperspace`) |
| `GITHUB_BRANCH` | `main` | The branch to commit to (usually `main`) |

9. Click "Deploy site"

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Set environment variables
netlify env:set ADMIN_PASSWORD_HASH "your_hash_here"
netlify env:set SESSION_SECRET "your_secret_here"
netlify env:set GITHUB_TOKEN "ghp_your_token_here"
netlify env:set GITHUB_REPO "owner/repo-name"
netlify env:set GITHUB_BRANCH "main"

# Deploy
netlify deploy --prod
```

## Step 6: Configure GitHub Webhook (Optional)

To enable automatic deployments when you make changes via the CMS:

1. In Netlify, go to Site settings → Build & deploy → Build hooks
2. Click "Add build hook"
3. Give it a name like "Content Update"
4. Copy the webhook URL
5. Go to your GitHub repo → Settings → Webhooks → Add webhook
6. Paste the Netlify build hook URL
7. Set content type to `application/json`
8. Select "Just the push event"
9. Click "Add webhook"

Now, whenever the CMS commits content changes to GitHub, Netlify will automatically rebuild your site!

## Step 7: Test Your Deployment

1. Visit your Netlify site URL (e.g., `https://your-site.netlify.app`)
2. Navigate to `/admin/login`
3. Log in with your admin password
4. Try making a content change
5. Check the commit stats on the dashboard to verify GitHub integration is working

## Environment Variables Reference

### Required Variables

- **ADMIN_PASSWORD_HASH**: Bcrypt hash of your admin password
  - Generate with: `node scripts/hash-password.js YOUR_PASSWORD`

- **SESSION_SECRET**: Random secret for session encryption
  - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- **GITHUB_TOKEN**: GitHub Personal Access Token with `repo` scope
  - Create at: https://github.com/settings/tokens

- **GITHUB_REPO**: Your repository in format `owner/repo-name`
  - Example: `johndoe/my-website`

- **GITHUB_BRANCH**: Branch to commit content changes to
  - Usually: `main` or `master`

## Troubleshooting

### Build Fails

**Error: "adapter-netlify is not installed"**
- Make sure you've committed `package.json` with the adapter dependency
- Try `npm install` locally and commit the updated `package-lock.json`

**Error: "Environment variable not found"**
- Double-check all environment variables are set in Netlify dashboard
- Variable names are case-sensitive

### Git Integration Not Working

**Commits not appearing in GitHub:**
- Verify `GITHUB_TOKEN` has correct permissions
- Check `GITHUB_REPO` is in correct format (`owner/repo`, not full URL)
- Verify `GITHUB_BRANCH` exists in your repository
- Check Netlify function logs for errors

**Dashboard shows 0 commits:**
- This is expected if git integration is disabled or token is missing
- Once environment variables are set, commits will appear after next content change

### Can't Login

**"Invalid credentials" error:**
- Verify `ADMIN_PASSWORD_HASH` matches the password you're using
- Make sure to wrap hash in single quotes when setting env var
- Regenerate hash with: `node scripts/hash-password.js`

**"Session error":**
- Verify `SESSION_SECRET` is set
- Clear browser cookies and try again

## Security Best Practices

1. **Use strong passwords** - Admin password should be unique and complex
2. **Rotate tokens** - Regenerate GitHub token every 90 days
3. **Keep secrets secret** - Never commit `.env` file to git
4. **Enable HTTPS** - Netlify provides free SSL certificates
5. **Monitor access** - Check GitHub commit history regularly
6. **Backup content** - Your content is in git, so it's automatically backed up!

## Custom Domain (Optional)

To use your own domain:

1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow Netlify's instructions to configure DNS
5. Netlify will automatically provision an SSL certificate

## Performance Tips

1. **Enable build caching** - Netlify does this by default
2. **Optimize images** - The CMS automatically converts to WebP
3. **Use Netlify's CDN** - Content is distributed globally automatically
4. **Monitor build time** - Keep content files small for faster builds

## Support

If you encounter issues:

1. Check Netlify function logs: Site settings → Functions → View logs
2. Check GitHub webhook delivery: Repository → Settings → Webhooks
3. Review the [SvelteKit Netlify adapter docs](https://kit.svelte.dev/docs/adapter-netlify)
4. Review the [Netlify docs](https://docs.netlify.com/)

## Next Steps

- Set up a custom domain
- Configure email notifications for builds
- Add more content types in the admin
- Customize your public-facing pages
- Invite team members (Netlify Teams feature)

Congratulations! Your Hyperspace CMS is now live in production! 🚀
