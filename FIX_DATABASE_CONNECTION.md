# Fix: "Cannot connect to database" Error

## 🔴 Problem

You're seeing the error: **"Cannot connect to database. Please check your DATABASE_URL configuration."**

This means the app is trying to use the build-time placeholder `DATABASE_URL` instead of your real database connection string.

## ✅ Solution

You **MUST** add the real `DATABASE_URL` in the **Netlify Dashboard** (not in `netlify.toml`).

### Step 1: Get Your PostgreSQL Connection String

If you're using **Supabase**:
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection string** → **URI**
5. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
6. Replace `[PASSWORD]` with your actual database password

### Step 2: Add DATABASE_URL in Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site (capsoai.com)
3. Go to **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
4. Click **Add variable**
5. Set:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres`
   - (Use your actual connection string from Step 1)
6. Click **Save**

### Step 3: Create Database Tables

After adding `DATABASE_URL`, you need to create the database tables:

**Option A: Using Prisma (Recommended)**
```bash
# In your local terminal (with DATABASE_URL in .env.local)
npx prisma db push
```

**Option B: Using Supabase SQL Editor**
1. Go to Supabase → Your project → **SQL Editor**
2. Run the SQL from your `prisma/schema.prisma` or use Prisma migrations

### Step 4: Redeploy

1. In Netlify, go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

### Step 5: Test

1. Try to create an account
2. The error should be gone

## ⚠️ Important Notes

1. **DATABASE_URL must be in Netlify Dashboard**, not in `netlify.toml`
2. **The connection string must be PostgreSQL** (not SQLite)
3. **Make sure your database is accessible** from the internet (Supabase databases are by default)
4. **The password in the connection string must be URL-encoded** if it contains special characters

## 🔍 Verify Your Configuration

After adding `DATABASE_URL` in Netlify:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. You should see `DATABASE_URL` listed
3. The value should start with `postgresql://` (not `postgresql://build:build@build:5432/build`)

## Still Having Issues?

If you still see the error after adding `DATABASE_URL`:
1. Check that the connection string is correct
2. Verify your database is accessible (try connecting with a PostgreSQL client)
3. Check Netlify function logs: **Site settings** → **Functions** → **Logs**
4. Make sure you redeployed after adding the variable






