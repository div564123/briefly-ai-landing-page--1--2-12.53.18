# 🔍 Diagnose "Cannot connect to database server" Error

## Step 1: Check Netlify Function Logs

This will tell us EXACTLY what's wrong:

1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Functions** → **Logs**
4. Look for recent errors (especially around the time you tried to sign up)
5. Find errors that mention:
   - `DATABASE_URL`
   - `P1001`
   - `Can't reach database server`
   - `Connection refused`

**Copy the error message and share it with me!**

## Step 2: Verify DATABASE_URL is Set in Netlify

1. Go to **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
2. Check if `DATABASE_URL` exists in the list
3. **If it doesn't exist:**
   - You need to add it (see Step 3)
4. **If it exists:**
   - Click on it to see the value
   - Check that it starts with `postgresql://` (not `postgresql://build:build@build:5432/build`)
   - Check that it contains your real Supabase hostname (`db.eulpiddbrbqchwrkulug.supabase.co`)

## Step 3: Add/Update DATABASE_URL

If DATABASE_URL is missing or incorrect:

### Get Your Database Password

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. In **"Database password"** section, copy your password
5. If you don't see it, click **"Reset database password"** and copy the new one

### Build DATABASE_URL

Format:
```
postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

Replace `YOUR_PASSWORD` with your actual password.

**Example:**
If password is `abc123`, DATABASE_URL is:
```
postgresql://postgres:abc123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Add to Netlify

1. In Netlify, go to **Environment variables**
2. If `DATABASE_URL` exists, click **Edit**
3. If it doesn't exist, click **Add variable**
4. **Key**: `DATABASE_URL`
5. **Value**: Your complete connection string (from above)
6. Click **Save**

## Step 4: Create Database Tables

**⚠️ CRITICAL: Even if DATABASE_URL is correct, the tables might not exist!**

### Option A: Using Prisma (Recommended)

1. Open your terminal
2. Make sure you have `DATABASE_URL` in `.env.local`:
   ```bash
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```
3. Run:
   ```bash
   npx prisma db push
   ```
4. This will create all tables in your database

### Option B: Check if Tables Exist

1. Go to Supabase → **Table Editor**
2. Check if you see tables like:
   - `User`
   - `Audio`
   - `Folder`
   - etc.
3. If tables don't exist, run `npx prisma db push` (Option A)

## Step 5: Redeploy on Netlify

**⚠️ IMPORTANT: You MUST redeploy after adding/updating DATABASE_URL**

1. In Netlify, go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (2-3 minutes)

## Step 6: Test Again

1. Go to your website
2. Try to create an account
3. Check if error is gone

## 🔍 Common Issues & Solutions

### Issue 1: "P1001: Can't reach database server"

**Causes:**
- DATABASE_URL not set in Netlify
- Wrong password in DATABASE_URL
- Database server not accessible

**Solution:**
- Verify DATABASE_URL is in Netlify dashboard
- Check password is correct
- Verify Supabase database is active

### Issue 2: "Table does not exist"

**Cause:**
- Tables haven't been created in database

**Solution:**
- Run `npx prisma db push` locally
- Or create tables via Supabase SQL Editor

### Issue 3: "Connection refused" or "ENOTFOUND"

**Causes:**
- Wrong hostname in DATABASE_URL
- Network restrictions on Supabase

**Solution:**
- Verify hostname: `db.eulpiddbrbqchwrkulug.supabase.co`
- Check Supabase → Settings → Database → Network Restrictions (should allow all IPs)

### Issue 4: "Authentication failed"

**Cause:**
- Wrong password in DATABASE_URL

**Solution:**
- Reset database password in Supabase
- Update DATABASE_URL in Netlify with new password
- Redeploy

## 📋 Quick Checklist

- [ ] Checked Netlify function logs for exact error
- [ ] Verified DATABASE_URL exists in Netlify dashboard
- [ ] Verified DATABASE_URL format is correct
- [ ] Got database password from Supabase
- [ ] Created database tables (`npx prisma db push`)
- [ ] Redeployed site on Netlify
- [ ] Tested signup again

## 🆘 Still Having Issues?

Share with me:
1. The exact error from Netlify function logs
2. Whether DATABASE_URL is set in Netlify
3. Whether tables exist in Supabase (check Table Editor)
4. Whether you've redeployed after adding DATABASE_URL






