# Netlify Deployment Review - Capso AI

## 🔍 Comprehensive Deployment Readiness Review

**Date**: December 2024  
**Status**: ⚠️ **NEEDS FIXES** - Critical file storage issue

---

## ✅ What's Ready

### 1. Build Configuration ✅
- **Status**: ✅ **READY**
- **File**: `netlify.toml` properly configured
- **Build Command**: `npm run build` (includes `prisma generate`)
- **Publish Directory**: `.next`
- **Plugin**: `@netlify/plugin-nextjs` configured
- **Environment Variables**: Placeholder `DATABASE_URL` for build-time
- **NETLIFY Flag**: Set to `true` for environment detection

### 2. Database Configuration ✅
- **Status**: ✅ **READY**
- **Schema**: PostgreSQL configured (`prisma/schema.prisma`)
- **No prisma.config.ts**: Removed (was causing build issues)
- **Build Test**: ✅ Passed locally

### 3. Next.js Configuration ✅
- **Status**: ✅ **READY**
- **Runtime**: All API routes use `runtime = "nodejs"` (correct for Netlify)
- **Images**: Unoptimized (good for Netlify)
- **TypeScript**: Errors ignored (won't block build)
- **Webpack**: FFmpeg packages externalized

### 4. Build Test ✅
- **Status**: ✅ **PASSED**
- Local build completed successfully
- All routes generated correctly
- Prisma client generated successfully

### 5. Rebranding ✅
- **Status**: ✅ **COMPLETE**
- All "Briefly AI" → "Capso AI" replacements done
- Logo component renamed to `CapsoLogo`
- Email domains updated to `capso.ai`

---

## 🔴 Critical Issues - Must Fix

### 1. Audio File Storage ❌ **CRITICAL**

**Problem**: 
- Audio files are saved to `public/audio` directory (line 794 in `app/api/audio/generate/route.ts`)
- Netlify functions have **read-only file system** (except `/tmp`)
- Files written to `public/audio` **won't persist** between function invocations
- Download route tries to read from `public/audio` which **won't work**

**Impact**: 
- ❌ Audio generation will fail when trying to save files
- ❌ Audio downloads will fail (404 errors)
- ❌ Users won't be able to download generated audio

**Current Code** (Line 794-805):
```typescript
const audioDir = join(process.cwd(), "public", "audio")
const audioPath = join(audioDir, audioFileName)
await writeFile(audioPath, audioBuffer)  // ❌ This will fail on Netlify
```

**Solutions** (Choose one):

#### Option A: Return Audio Directly (Quick Fix)
- Don't save to disk
- Return audio as base64 or direct response
- Store only metadata in database
- **Pros**: Quick fix, no external services
- **Cons**: No persistent storage, can't download later

#### Option B: Cloud Storage (Recommended)
- Use AWS S3, Cloudinary, or similar
- Upload audio to cloud storage
- Store URL in database
- **Pros**: Persistent, scalable, reliable
- **Cons**: Requires cloud storage setup

#### Option C: Database Storage (Not Recommended)
- Store audio as base64 in database
- **Pros**: Simple
- **Cons**: Database bloat, slow, expensive

**Recommended**: **Option B** (Cloud Storage)

---

## ⚠️ Known Limitations

### 1. FFmpeg Dependencies ⚠️

**Issue**: `ffmpeg-static` and `fluent-ffmpeg` may not work on Netlify

**Impact**: 
- Audio speed adjustment may fail
- Background music mixing may fail

**Status**: ⚠️ **Test after deployment**
- May work if Netlify has system ffmpeg
- May need external audio processing service

**Workaround**: 
- Graceful fallback (return original audio if ffmpeg fails)
- Already implemented in code

### 2. Function Timeout Limits ⚠️

**Issue**: 
- Free tier: 10 second timeout
- Paid: 26 second timeout
- Audio generation may take longer

**Impact**: 
- Long audio generations may timeout
- Large file processing may timeout

**Status**: ⚠️ **Monitor after deployment**

**Solutions**:
- Optimize processing
- Use background functions
- Consider external service for long tasks

### 3. Temp Files ✅ **FIXED**

**Status**: ✅ **FIXED**
- Temp directories use `/tmp` when `NETLIFY` env var is set
- Code: `const tempDir = process.env.NETLIFY ? "/tmp" : join(process.cwd(), "tmp")`

---

## 📋 Pre-Deployment Checklist

### Must Do (Critical):

- [ ] **Fix audio file storage** ⚠️ **CRITICAL**
  - [ ] Choose storage solution (cloud storage recommended)
  - [ ] Update `app/api/audio/generate/route.ts`
  - [ ] Update `app/api/audio/download/[id]/route.ts`
  - [ ] Test audio generation and download

- [ ] **Set up PostgreSQL database** (Supabase, Neon, or Railway)
- [ ] **Get PostgreSQL connection string**
- [ ] **Add environment variables in Netlify dashboard**

### Should Do (Important):

- [ ] **Test FFmpeg functionality** after deployment
- [ ] **Monitor function timeouts** after deployment
- [ ] **Set up error monitoring** (Sentry, etc.)
- [ ] **Test all features** after deployment

---

## 📋 Environment Variables for Netlify

Add these in **Netlify Dashboard** → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**:

### Required (Critical):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
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

### If Using Cloud Storage (Recommended):

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```

Or for Cloudinary:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🚀 Deployment Steps

### Step 1: Fix Audio Storage

**Choose and implement one of the solutions above** (Cloud Storage recommended).

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Fix audio storage for Netlify deployment"
git push
```

### Step 3: Deploy on Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "Add new site"** → **"Import an existing project"**
4. **Select "Deploy with GitHub"**
5. **Authorize Netlify** to access your GitHub
6. **Select your repository**

### Step 4: Configure Build Settings

Netlify should auto-detect Next.js from `netlify.toml`.

### Step 5: Add Environment Variables

Add all required environment variables (see list above).

### Step 6: Deploy

1. Click **"Deploy site"**
2. Wait for build to complete
3. Your app will be live at: `https://your-site-name.netlify.app`

### Step 7: Run Database Migrations

After first deployment, run Prisma migrations:

```bash
npx prisma migrate deploy
```

Or via database provider SQL editor.

---

## 📊 Deployment Readiness Score

| Component | Status | Notes |
|-----------|--------|-------|
| **Database** | ✅ Ready | PostgreSQL configured |
| **Build Config** | ✅ Ready | netlify.toml complete |
| **Prisma Config** | ✅ Ready | Standard setup |
| **Build Test** | ✅ Passed | Local build successful |
| **Environment Vars** | ⚠️ Needs Setup | Add in Netlify dashboard |
| **API Routes** | ✅ Ready | Correct runtime |
| **Authentication** | ✅ Ready | NextAuth configured |
| **Rebranding** | ✅ Complete | All "Capso AI" |
| **File System** | ✅ Fixed | Temp files use `/tmp` |
| **Audio Storage** | ❌ **CRITICAL** | Must fix before deployment |

**Overall**: 🟡 **80% Ready** - **Audio storage must be fixed**

---

## 🎯 Quick Fix Guide

### Immediate Fix: Return Audio Directly

If you need to deploy quickly, you can modify the code to return audio directly without saving:

1. **Update `app/api/audio/generate/route.ts`**:
   - Remove file saving code (lines 794-805)
   - Return audio as base64 in response
   - Store only metadata in database

2. **Update `app/api/audio/download/[id]/route.ts`**:
   - Remove file reading code
   - Return error or redirect to generation endpoint

**Note**: This is a temporary solution. For production, use cloud storage.

---

## ✅ Summary

**Status**: ⚠️ **NEEDS FIXES BEFORE DEPLOYMENT**

**Critical Issue**: Audio file storage must be fixed before deployment.

**Everything Else**: ✅ Ready for deployment

**Next Steps**:
1. Fix audio storage (cloud storage recommended)
2. Set up PostgreSQL database
3. Add environment variables
4. Deploy!

---

**Last Updated**: December 2024  
**App Name**: Capso AI  
**Status**: Ready after audio storage fix




































