# Netlify Deployment Guide - Capso AI

This guide will help you deploy your Capso AI application to Netlify.

## ⚠️ Important Issues to Fix Before Deployment

### 1. Database: SQLite → PostgreSQL Required

**Problem**: Your app currently uses SQLite (`file:./dev.db`), which **won't work on Netlify** because:
- Netlify functions are serverless (no persistent file system)
- SQLite requires a file system to store the database

**Solution**: You **must** switch to PostgreSQL before deploying.

### 2. File System Operations

**Problem**: Your API routes use file system operations (`writeFile`, `readFile`, `mkdir`, `unlink`) which have limitations on Netlify:
- Netlify functions have a read-only file system (except `/tmp`)
- File operations in `/tmp` are temporary and cleared between function invocations

**Current Impact**: 
- Audio generation uses temp files - may need adjustment
- Audio storage uses file system - needs alternative (S3, etc.)

---

## 🔧 Pre-Deployment Setup

### Step 1: Set Up PostgreSQL Database

You **cannot** use SQLite on Netlify. Choose one:

#### Option A: Supabase (Recommended - Free Tier)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. It looks like: `postgresql://user:password@host:5432/dbname`

#### Option B: Neon (Free Tier)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

#### Option C: Railway (Free Trial)

1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string

### Step 2: Update Prisma Schema

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")  // Changed from "file:./dev.db"
}
```

### Step 3: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# For production, you'll run:
# npx prisma migrate deploy
```

### Step 4: Test Locally with PostgreSQL

1. Add `DATABASE_URL` to `.env.local`:
   ```bash
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

2. Test your app locally:
   ```bash
   npm run dev
   ```

3. Verify:
   - User registration works
   - Login works
   - Database operations work

---

## 🚀 Deploy to Netlify

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for Netlify deployment"
git remote add origin https://github.com/YOUR_USERNAME/briefly-ai.git
git push -u origin main
```

### Step 2: Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
```

Or use the web interface (recommended for first deployment).

### Step 3: Deploy via Netlify Dashboard

1. **Sign up/Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub (use: **briefly.contact.10@gmail.com**)

2. **Import Your Project**
   - Click **"Add new site"** → **"Import an existing project"**
   - Select **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub
   - Select your repository

3. **Configure Build Settings**
   Netlify should auto-detect Next.js, but verify:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)

   **Note**: The `netlify.toml` file I created will handle this automatically.

4. **Install Netlify Next.js Plugin**
   - In build settings, Netlify should auto-detect Next.js
   - If not, add: `@netlify/plugin-nextjs` as a build plugin

### Step 4: Add Environment Variables

**Critical**: Add all environment variables in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add each variable:

```
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-site-name.netlify.app
DATABASE_URL=postgresql://user:password@host:5432/dbname
OPENAI_API_KEY=your-openai-key
LEMONFOX_API_KEY=your-lemonfox-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
STRIPE_SECRET_KEY=your-stripe-key (optional)
STRIPE_WEBHOOK_SECRET=your-webhook-secret (optional)
```

**Important Notes:**
- **NEXTAUTH_SECRET**: Generate a new one for production:
  ```bash
  openssl rand -base64 32
  ```
- **NEXTAUTH_URL**: Initially use your Netlify URL (e.g., `https://briefly-ai.netlify.app`)
- **DATABASE_URL**: Your PostgreSQL connection string from Step 1

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (5-10 minutes first time)
3. Your app will be live at: `https://your-site-name.netlify.app`

### Step 6: Run Database Migrations

After first deployment, run migrations:

**Option A: Via Netlify CLI**
```bash
netlify login
netlify link  # Link to your site
netlify functions:invoke --name=___netlify-handler
# Or use Netlify's shell/deploy context
```

**Option B: Via Supabase/Neon Dashboard**
- Use the SQL editor in your database provider
- Or connect locally and run: `npx prisma migrate deploy`

**Option C: Add Build Command**
Add to `package.json`:
```json
"scripts": {
  "postbuild": "prisma migrate deploy"
}
```

Then update `netlify.toml`:
```toml
[build]
  command = "npm run build && npx prisma migrate deploy"
```

---

## 🔍 Post-Deployment Checklist

- [ ] Site is accessible at Netlify URL
- [ ] User registration works
- [ ] User login works
- [ ] Database operations work
- [ ] API routes respond correctly
- [ ] File upload works (if applicable)
- [ ] Audio generation works (may need adjustments for file system)

---

## ⚠️ Known Limitations & Solutions

### 1. File System Limitations

**Problem**: Netlify functions have limited file system access.

**Current Code Issues**:
- `app/api/audio/generate/route.ts` uses temp files
- Audio files stored in file system

**Solutions**:
- **Option A**: Use cloud storage (S3, Cloudinary, etc.) for audio files
- **Option B**: Store audio in database as base64 (not recommended for large files)
- **Option C**: Use external service for audio processing

**Quick Fix for Temp Files**:
Update temp directory to use `/tmp`:
```typescript
const tempDir = "/tmp"  // Netlify allows /tmp
```

### 2. FFmpeg Dependencies

**Problem**: `ffmpeg-static` and `fluent-ffmpeg` may not work on Netlify.

**Solution**: 
- Consider using external audio processing service
- Or use Netlify's build-time installation (may not work for serverless functions)

### 3. Large File Processing

**Problem**: Netlify functions have execution time limits (10s free, 26s paid).

**Solution**:
- For long-running tasks, use background jobs
- Consider Netlify Background Functions
- Or use external service (AWS Lambda, etc.)

---

## 🛠️ Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Solution**: Check `package.json` dependencies are correct
- Run `npm install` locally to verify

**Error**: "Prisma Client not generated"
- **Solution**: Add to build command: `npm run build && npx prisma generate`

### Database Connection Errors

**Error**: "Can't reach database server"
- **Solution**: 
  - Check `DATABASE_URL` is correct
  - Verify database allows connections from Netlify IPs
  - Check database firewall settings

### API Routes Not Working

**Error**: "404 Not Found" on API routes
- **Solution**: 
  - Verify `netlify.toml` redirects are correct
  - Check `@netlify/plugin-nextjs` is installed
  - Ensure Next.js plugin is enabled in Netlify dashboard

### Environment Variables Not Loading

**Error**: Variables undefined
- **Solution**:
  - Check variable names match exactly (case-sensitive)
  - Redeploy after adding variables
  - Check for typos in variable names

---

## 📝 Netlify Configuration Files

### netlify.toml (Already Created)

The `netlify.toml` file I created includes:
- Build command
- Publish directory
- Next.js plugin configuration
- Redirect rules for API routes

### Additional Configuration (Optional)

You can add to `netlify.toml`:

```toml
# Function configuration
[functions]
  node_bundler = "esbuild"
  included_files = ["prisma/**"]

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🎯 Quick Deployment Checklist

- [ ] Database switched from SQLite to PostgreSQL
- [ ] Prisma schema updated
- [ ] Database migrations run locally
- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Site imported from GitHub
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] Site deployed
- [ ] Database migrations run on production
- [ ] Site tested and working

---

## 📧 Support

**Your Email**: briefly.contact.10@gmail.com

**Netlify Docs**: https://docs.netlify.com/
**Next.js on Netlify**: https://docs.netlify.com/integrations/frameworks/nextjs/

---

## 🚨 Critical: Before You Deploy

1. **✅ Switch to PostgreSQL** - SQLite will NOT work
2. **✅ Test locally** with PostgreSQL connection
3. **✅ Update environment variables** for production
4. **✅ Review file system operations** - may need cloud storage
5. **✅ Test build locally**: `npm run build`

---

**Last Updated**: December 2024

