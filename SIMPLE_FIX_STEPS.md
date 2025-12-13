# 🚨 Simple Fix: "Cannot connect to database server"

## ✅ Do These 3 Things IN ORDER:

### 1️⃣ Check Netlify Function Logs (2 minutes)

**This tells us EXACTLY what's wrong:**

1. Go to [app.netlify.com](https://app.netlify.com)
2. Your site → **Site settings** → **Functions** → **Logs**
3. Look for the MOST RECENT error (when you tried to sign up)
4. **Copy the error message** - it will say:
   - "DATABASE_URL is not configured" → Go to Step 2
   - "Using build-time placeholder" → Go to Step 2
   - "P1001: Can't reach database server" → Go to Step 2
   - "Table does not exist" → Go to Step 3

### 2️⃣ Add DATABASE_URL to Netlify (5 minutes)

**If the error says DATABASE_URL is missing or using placeholder:**

1. **Get your Supabase password:**
   - Go to [supabase.com](https://supabase.com)
   - Your project → **Settings** → **Database**
   - Find **"Database password"** section
   - Copy the password (or reset it if you don't see it)

2. **Build your DATABASE_URL:**
   ```
   postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```
   Replace `YOUR_PASSWORD` with your actual password.

3. **Add to Netlify:**
   - Netlify → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
   - Click **Add variable** (or edit if it exists)
   - **Key:** `DATABASE_URL`
   - **Value:** Your complete connection string (from step 2)
   - Click **Save**

4. **REDEPLOY:**
   - Netlify → **Deploys**
   - Click **Trigger deploy** → **Deploy site**
   - Wait 2-3 minutes

### 3️⃣ Create Database Tables (3 minutes)

**If the error says "Table does not exist" or you're not sure:**

1. **Update `.env.local`** (in your project root):
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```
   Replace `YOUR_PASSWORD` with your actual password.

2. **Run in terminal:**
   ```bash
   npx prisma db push
   ```

3. **Verify tables exist:**
   - Go to [supabase.com](https://supabase.com)
   - Your project → **Table Editor**
   - You should see: `User` and `AudioGeneration` tables

## 🔍 Quick Diagnostic

### Check 1: Is DATABASE_URL in Netlify?

1. Netlify → Site settings → Environment variables
2. Do you see `DATABASE_URL` in the list?
   - **NO** → Add it (Step 2)
   - **YES** → Check if value is correct (next check)

### Check 2: Is DATABASE_URL value correct?

1. Click on `DATABASE_URL` in Netlify
2. Does it start with `postgresql://postgres:`?
   - **NO** → It's wrong, update it (Step 2)
   - **YES** → Check if it contains `build:build@build:5432`
     - **YES** → It's a placeholder! Replace with real password (Step 2)
     - **NO** → Check if password is real (not `[PASSWORD]` or `VOTRE_MOT_DE_PASSE`)
       - **Placeholder** → Replace with real password (Step 2)
       - **Real password** → Go to Check 3

### Check 3: Do tables exist?

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Table Editor**
3. Do you see `User` and `AudioGeneration` tables?
   - **NO** → Create them (Step 3)
   - **YES** → Check if you redeployed (Check 4)

### Check 4: Did you redeploy after adding DATABASE_URL?

1. Netlify → **Deploys**
2. Look at the most recent deploy
3. Was it AFTER you added DATABASE_URL?
   - **NO** → Redeploy now (Step 2, part 4)
   - **YES** → Check Netlify logs for exact error (Step 1)

## 📋 Most Common Issues

### Issue 1: "DATABASE_URL is not configured"
**Fix:** Add DATABASE_URL to Netlify dashboard (Step 2)

### Issue 2: "Using build-time placeholder"
**Fix:** Replace placeholder with real DATABASE_URL in Netlify (Step 2)

### Issue 3: "P1001: Can't reach database server"
**Causes:**
- DATABASE_URL not in Netlify
- Wrong password in DATABASE_URL
- Wrong hostname

**Fix:** 
- Verify DATABASE_URL is in Netlify
- Check password is correct
- Verify hostname: `db.eulpiddbrbqchwrkulug.supabase.co`

### Issue 4: "Table 'User' does not exist"
**Fix:** Run `npx prisma db push` (Step 3)

## ✅ Final Checklist

Before testing again, make sure:
- [ ] DATABASE_URL is in Netlify dashboard
- [ ] DATABASE_URL value is correct (real password, not placeholder)
- [ ] Tables created (`npx prisma db push` succeeded)
- [ ] Site redeployed after adding DATABASE_URL
- [ ] Checked Netlify logs for exact error

## 🆘 Still Not Working?

Tell me:
1. **Exact error from Netlify logs** (Functions → Logs)
2. **Is DATABASE_URL in Netlify?** (Yes/No)
3. **What does DATABASE_URL value start with?** (first 30 characters)
4. **Do tables exist in Supabase?** (Yes/No)
5. **Did you redeploy after adding DATABASE_URL?** (Yes/No)



