# Netlify Deployment Review - Capso AI

**Date**: December 2024  
**Status**: ⚠️ **CRITICAL ISSUE FOUND** - Database configuration needs update

---

## 🔴 CRITICAL ISSUE: Database Configuration

### Problem
Your `prisma/schema.prisma` is currently configured for **SQLite**, but Netlify requires **PostgreSQL**:

```prisma
datasource db {
  provider = "sqlite"  // ❌ WRONG for Netlify
  url      = "file:./dev.db"  // ❌ Won't work on serverless
}
```

### Why This Won't Work
- Netlify functions are **serverless** (no persistent file system)
- SQLite requires a file system to store the database
- Your app **will fail** on Netlify with SQLite

### Solution Required
**You MUST switch to PostgreSQL before deploying.**

---

## ✅ What's Already Ready

### 1. Build Configuration ✅
- **File**: `netlify.toml` properly configured
- **Build Command**: `npm run build` (includes `prisma generate`)
- **Publish Directory**: `.next`
- **Plugin**: `@netlify/plugin-nextjs` configured
- **NETLIFY Flag**: Set to `true` for environment detection

### 2. File System Operations ✅
- **Status**: ✅ **FIXED**
- Temp files use `/tmp` when `NETLIFY` env var is set
- Audio returned as base64 (no file storage needed)
- Code: `const tempDir = process.env.NETLIFY ? "/tmp" : join(process.cwd(), "tmp")`

### 3. Next.js Configuration ✅
- **Runtime**: All API routes use `runtime = "nodejs"` (correct for Netlify)
- **Images**: Unoptimized (good for Netlify)
- **TypeScript**: Errors ignored (won't block build)
- **Webpack**: FFmpeg packages externalized

### 4. Audio Generation ✅
- **Status**: ✅ **FIXED**
- Audio returned directly in API response as base64
- No file storage required
- Compatible with Netlify's read-only filesystem

---

## 🔧 REQUIRED FIXES BEFORE DEPLOYMENT

### Fix 1: Update Database to PostgreSQL

**Step 1**: Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // ✅ Changed from "sqlite"
  url      = env("DATABASE_URL")  // ✅ Changed from "file:./dev.db"
}
```

**Step 2**: Set up PostgreSQL database:
- **Option A**: [Supabase](https://supabase.com) (Free tier available)
- **Option B**: [Neon](https://neon.tech) (Free tier available)
- **Option C**: [Railway](https://railway.app) (Free trial)

**Step 3**: Get connection string:
- Format: `postgresql://user:password@host:5432/dbname`
- Add to Netlify environment variables as `DATABASE_URL`

**Step 4**: Run migrations:
```bash
npx prisma migrate dev --name init
# Or for production:
npx prisma migrate deploy
```

---

## 📋 Environment Variables Required

Add these in **Netlify Dashboard** → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**:

### Critical (Required):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-site-name.netlify.app
OPENAI_API_KEY=sk-your-openai-api-key
LEMONFOX_API_KEY=your-lemonfox-api-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

### Optional (For Payments):

```
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### How to Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

---

## ⚠️ Potential Issues to Monitor

### 1. FFmpeg Dependencies
- **Status**: ⚠️ **MAY CAUSE ISSUES**
- `ffmpeg-static` and `fluent-ffmpeg` may not work in Netlify functions
- **Impact**: Audio speed adjustment and background music mixing may fail
- **Solution**: Test after deployment, may need external service

### 2. Function Timeout Limits
- **Free tier**: 10 second timeout
- **Paid**: 26 second timeout
- **Impact**: Audio generation may take longer
- **Solution**: Monitor after deployment, may need optimization

### 3. File Size Limits
- **Request body**: 6MB limit (free tier)
- **Response**: 6MB limit
- **Impact**: Large audio files may fail
- **Solution**: Current base64 approach should work, but monitor

---

## 🚀 Deployment Steps

### Step 1: Fix Database (REQUIRED)
1. Update `prisma/schema.prisma` to PostgreSQL
2. Set up PostgreSQL database (Supabase/Neon/Railway)
3. Run migrations
4. Test locally with PostgreSQL connection string

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Update database to PostgreSQL for Netlify deployment"
git push
```

### Step 3: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select "Deploy with GitHub"
5. Authorize Netlify to access your GitHub
6. Select your repository

### Step 4: Configure Build Settings
Netlify should auto-detect from `netlify.toml`. Verify:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Base directory**: (leave empty)

### Step 5: Add Environment Variables
**Critical**: Add all required environment variables (see list above)

### Step 6: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Check build logs for errors
4. Test the deployed site

### Step 7: Configure Webhooks (If using Stripe)
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-site.netlify.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook secret to Netlify environment variables

---

## 📊 Deployment Readiness Score

| Component | Status | Notes |
|-----------|--------|-------|
| **Database** | ❌ **NOT READY** | Must switch to PostgreSQL |
| **Build Config** | ✅ Ready | netlify.toml complete |
| **File System** | ✅ Fixed | Uses /tmp for Netlify |
| **Audio Storage** | ✅ Fixed | Returns base64 |
| **Environment Vars** | ⚠️ Needs Setup | Add in Netlify dashboard |
| **FFmpeg** | ⚠️ Test After | May need adjustments |
| **Timeouts** | ⚠️ Monitor | May need optimization |

---

## ✅ Summary

**Current Status**: ⚠️ **NOT READY** - Database must be updated to PostgreSQL

**Action Required**: 
1. Update `prisma/schema.prisma` to use PostgreSQL
2. Set up PostgreSQL database
3. Add `DATABASE_URL` to Netlify environment variables
4. Run migrations

**After Fix**: Application should be ready for deployment.

---

## 📝 Notes

- All file system operations are already fixed for Netlify
- Audio generation returns base64 (no file storage needed)
- Build configuration is correct
- Only database configuration needs to be updated




























