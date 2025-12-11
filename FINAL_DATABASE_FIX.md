# 🔧 Final Fix: "Cannot connect to database server"

## 🔍 Step 1: Check Where You're Getting This Error

### A. On Your Local Machine (localhost:3000)
- This means `.env.local` DATABASE_URL is wrong or missing
- **Fix:** See Step 2A below

### B. On Netlify (your deployed site)
- This means DATABASE_URL is not set in Netlify dashboard
- **Fix:** See Step 2B below

## ✅ Step 2A: Fix Local (.env.local)

### Check .env.local exists and has DATABASE_URL:

1. Open `.env.local` in your project root
2. Make sure it contains:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```
3. **Replace `YOUR_PASSWORD`** with your actual Supabase password
4. **No quotes** around the value
5. **No spaces** around `=`

### Get Your Password:

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Settings** → **Database**
3. Copy the password from **"Database password"** section
4. If you don't see it, click **"Reset database password"**

### Test Connection Locally:

After updating `.env.local`, test if it works:

```bash
npx prisma db push
```

If this succeeds, your local DATABASE_URL is correct.

## ✅ Step 2B: Fix Netlify (Deployed Site)

### Add DATABASE_URL to Netlify Dashboard:

1. Go to [app.netlify.com](https://app.netlify.com)
2. Your site → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
3. Look for `DATABASE_URL` in the list
4. **If it's NOT there:**
   - Click **Add variable**
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres`
   - Replace `YOUR_PASSWORD` with your actual password
   - Click **Save**
5. **If it IS there:**
   - Click on it to edit
   - Make sure the value is correct (starts with `postgresql://postgres:`)
   - Make sure it contains your real password (not `[PASSWORD]` or placeholder)
   - Update if needed, then **Save**

### Redeploy After Adding DATABASE_URL:

**⚠️ CRITICAL: You MUST redeploy after adding/updating DATABASE_URL**

1. Netlify → **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait 2-3 minutes for build to complete

## ✅ Step 3: Create Database Tables

**Even if DATABASE_URL is correct, tables might not exist!**

### Create Tables:

1. Make sure `.env.local` has correct DATABASE_URL
2. Run:
   ```bash
   npx prisma db push
   ```
3. You should see:
   ```
   ✔ Generated Prisma Client
   ✔ The database is now in sync with your schema.
   ```

### Verify Tables Exist:

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Table Editor**
3. You should see tables:
   - `User`
   - `AudioGeneration`
4. **If tables don't exist:** Run `npx prisma db push` again

## ✅ Step 4: Check Netlify Function Logs

To see the EXACT error:

1. Netlify → Your site → **Site settings** → **Functions** → **Logs**
2. Look for recent errors (when you tried to sign up)
3. The error will tell you:
   - Is DATABASE_URL missing?
   - Is password wrong?
   - Are tables missing?
   - Is server unreachable?

**Share the exact error message with me if you need help!**

## 🔍 Common Issues & Solutions

### Issue 1: "P1001: Can't reach database server"

**Causes:**
- DATABASE_URL not set in Netlify
- Wrong password in DATABASE_URL
- Wrong hostname

**Fix:**
- Verify DATABASE_URL is in Netlify dashboard
- Check password is correct
- Verify hostname: `db.eulpiddbrbqchwrkulug.supabase.co`

### Issue 2: "Table 'User' does not exist"

**Cause:** Tables haven't been created

**Fix:**
- Run `npx prisma db push` locally
- Verify tables exist in Supabase Table Editor

### Issue 3: "Authentication failed"

**Cause:** Wrong password in DATABASE_URL

**Fix:**
- Reset password in Supabase
- Update DATABASE_URL in both `.env.local` and Netlify dashboard
- Redeploy

### Issue 4: Error on localhost but works on Netlify (or vice versa)

**Cause:** DATABASE_URL is set in one place but not the other

**Fix:**
- Make sure DATABASE_URL is in BOTH:
  - `.env.local` (for local development)
  - Netlify dashboard (for deployed site)

## 📋 Complete Checklist

- [ ] `.env.local` exists and has correct DATABASE_URL
- [ ] DATABASE_URL in Netlify dashboard (not just .env.local)
- [ ] Password in DATABASE_URL is correct (no `[PASSWORD]` placeholder)
- [ ] Tables created (`npx prisma db push` succeeded)
- [ ] Tables visible in Supabase Table Editor
- [ ] Site redeployed on Netlify after adding DATABASE_URL
- [ ] Checked Netlify function logs for exact error

## 🆘 Still Not Working?

Tell me:
1. **Where** you see the error (localhost or Netlify site)
2. **Exact error message** from Netlify function logs
3. Whether DATABASE_URL is in Netlify dashboard
4. Whether tables exist in Supabase Table Editor
5. Whether you've redeployed after adding DATABASE_URL

