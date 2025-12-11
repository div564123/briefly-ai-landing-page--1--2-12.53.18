# Netlify Deployment Checklist - Capso AI

**Date**: December 2024  
**Status**: ✅ **READY** (after database fix)

---

## ✅ FIXED: Database Configuration

**Status**: ✅ **FIXED**
- Updated `prisma/schema.prisma` from SQLite to PostgreSQL
- Now uses `env("DATABASE_URL")` for connection string
- Ready for Netlify deployment

---

## ✅ Verified Components

### 1. Build Configuration ✅
- **File**: `netlify.toml` ✅ Properly configured
- **Build Command**: `npm run build` (includes `prisma generate`) ✅
- **Publish Directory**: `.next` ✅
- **Plugin**: `@netlify/plugin-nextjs` ✅
- **NETLIFY Flag**: Set to `true` ✅
- **Node Version**: 18 ✅

### 2. Database Configuration ✅
- **Schema**: PostgreSQL configured ✅
- **Provider**: `postgresql` ✅
- **URL**: Uses `env("DATABASE_URL")` ✅

### 3. File System Operations ✅
- **Temp Files**: Use `/tmp` when `NETLIFY` env var is set ✅
- **Code**: `const tempDir = process.env.NETLIFY ? "/tmp" : join(process.cwd(), "tmp")` ✅
- **Audio Storage**: Returns base64 in API response (no file storage) ✅

### 4. Next.js Configuration ✅
- **Runtime**: All API routes use `runtime = "nodejs"` ✅
- **Images**: Unoptimized ✅
- **TypeScript**: Errors ignored (won't block build) ✅
- **Webpack**: FFmpeg packages externalized ✅

### 5. Audio Generation ✅
- **Status**: ✅ **FIXED**
- Audio returned as base64 in API response ✅
- No file storage required ✅
- Compatible with Netlify's read-only filesystem ✅

### 6. API Routes ✅
- All routes use `export const runtime = "nodejs"` ✅
- File operations use `/tmp` for Netlify ✅
- Audio download route handles Netlify limitations ✅

---

## 📋 Pre-Deployment Checklist

### Required Before Deploying:

- [x] **Database**: Updated to PostgreSQL ✅
- [ ] **Set up PostgreSQL database** (Supabase, Neon, or Railway)
- [ ] **Get PostgreSQL connection string**
- [ ] **Add environment variables in Netlify dashboard**
- [ ] **Run database migrations**

### Recommended:

- [ ] **Test database connection locally** (optional but recommended)
- [ ] **Test audio generation locally** with PostgreSQL
- [ ] **Verify all API routes work**

---

## 📋 Environment Variables for Netlify

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

## 🚀 Deployment Steps

### Step 1: Set Up PostgreSQL Database

**Option A: Supabase (Recommended - Free Tier)**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Format: `postgresql://user:password@host:5432/dbname`

**Option B: Neon (Free Tier)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

**Option C: Railway (Free Trial)**
1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string

### Step 2: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create migration (if not done already)
npx prisma migrate dev --name init

# For production deployment
npx prisma migrate deploy
```

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Update database to PostgreSQL for Netlify deployment"
git push
```

### Step 4: Deploy on Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "Add new site"** → **"Import an existing project"**
4. **Select "Deploy with GitHub"**
5. **Authorize Netlify** to access your GitHub
6. **Select your repository**

### Step 5: Configure Build Settings

Netlify should auto-detect from `netlify.toml`. Verify:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Base directory**: (leave empty)

### Step 6: Add Environment Variables

**Critical**: Add all required environment variables (see list above)

1. Go to **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
2. Add each variable one by one
3. **Important**: No quotes needed, just paste the value

### Step 7: Deploy

1. Click **"Deploy site"** or **"Trigger deploy"**
2. Wait for build to complete
3. Check build logs for errors
4. Test the deployed site

### Step 8: Configure Webhooks (If using Stripe)

1. Go to **Stripe Dashboard** → **Webhooks**
2. Add endpoint: `https://your-site.netlify.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

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
- **Solution**: Monitor after deployment, may need optimization or background functions

### 3. File Size Limits
- **Request body**: 6MB limit (free tier)
- **Response**: 6MB limit
- **Impact**: Large audio files may fail
- **Solution**: Current base64 approach should work, but monitor

---

## 📊 Deployment Readiness Score

| Component | Status | Notes |
|-----------|--------|-------|
| **Database** | ✅ **READY** | PostgreSQL configured |
| **Build Config** | ✅ Ready | netlify.toml complete |
| **File System** | ✅ Fixed | Uses /tmp for Netlify |
| **Audio Storage** | ✅ Fixed | Returns base64 |
| **API Routes** | ✅ Ready | All use nodejs runtime |
| **Environment Vars** | ⚠️ Needs Setup | Add in Netlify dashboard |
| **FFmpeg** | ⚠️ Test After | May need adjustments |
| **Timeouts** | ⚠️ Monitor | May need optimization |

---

## ✅ Summary

**Current Status**: ✅ **READY FOR DEPLOYMENT**

**Action Required**: 
1. ✅ Database updated to PostgreSQL
2. ⚠️ Set up PostgreSQL database (Supabase/Neon/Railway)
3. ⚠️ Add environment variables in Netlify dashboard
4. ⚠️ Run migrations

**After Setup**: Application should deploy successfully.

---

## 📝 Post-Deployment Testing

After deployment, test:
- [ ] User registration
- [ ] User login
- [ ] File upload
- [ ] Text extraction
- [ ] Audio generation
- [ ] Audio playback
- [ ] Stripe payments (if configured)
- [ ] Webhook handling (if configured)

---

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/nextjs/)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)




















