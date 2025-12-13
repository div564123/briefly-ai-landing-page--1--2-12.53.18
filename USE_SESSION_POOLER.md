# ✅ Use Session Pooler for Netlify (IPv4 Fix)

## 🔴 Problem

Netlify is **IPv4-only**, but Supabase Direct Connection uses IPv6. This causes "Cannot connect to database server" errors.

## ✅ Solution: Use Session Pooler

Supabase provides a **Session Pooler** that works with IPv4 networks like Netlify.

### Step 1: Get Session Pooler Connection String

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Settings** → **Database**
3. Find **"Connection string"** section (usually at the top)
4. Click on **"Session mode"** tab (NOT "URI" or "Transaction mode")
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres
   ```

### Step 2: Replace Password Placeholder

The connection string will have `[PASSWORD]` placeholder. Replace it with your actual password:

1. Get your password from **Settings** → **Database** → **"Database password"**
2. Replace `[PASSWORD]` in the connection string with your actual password

**Example:**
If connection string is:
```
postgresql://postgres.eulpiddbrbqchwrkulug:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

And your password is `abc123`, it becomes:
```
postgresql://postgres.eulpiddbrbqchwrkulug:abc123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Step 3: Update .env.local

Update your `.env.local` with the Session Pooler connection string:

```
DATABASE_URL=postgresql://postgres.eulpiddbrbqchwrkulug:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Replace `YOUR_PASSWORD` with your actual password.

### Step 4: Update Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Your site → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
3. Find `DATABASE_URL` (or add it if it doesn't exist)
4. Update the value with your **Session Pooler** connection string (from Step 2)
5. Click **Save**

### Step 5: Test Locally

After updating `.env.local`:

```bash
npx prisma db push
```

This should work now!

### Step 6: Redeploy on Netlify

**⚠️ IMPORTANT: Must redeploy after updating DATABASE_URL**

1. Netlify → **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait 2-3 minutes

### Step 7: Test Signup

1. Go to your site
2. Try to create an account
3. It should work now!

## 🔍 Differences: Direct vs Session Pooler

### Direct Connection (Doesn't work on Netlify):
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```
- Port: `5432`
- Host: `db.xxxxx.supabase.co`
- IPv6 only ❌

### Session Pooler (Works on Netlify):
```
postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres
```
- Port: `6543`
- Host: `aws-0-region.pooler.supabase.com` or `region.pooler.supabase.com`
- IPv4 compatible ✅

## 📋 Checklist

- [ ] Got Session Pooler connection string from Supabase
- [ ] Replaced `[PASSWORD]` with actual password
- [ ] Updated `.env.local` with Session Pooler URL
- [ ] Updated `DATABASE_URL` in Netlify dashboard with Session Pooler URL
- [ ] Tested `npx prisma db push` locally (should work)
- [ ] Redeployed site on Netlify
- [ ] Tested signup - should work now!

## ⚠️ Important Notes

1. **Use Session Pooler**, not Direct Connection for Netlify
2. **Port is 6543**, not 5432
3. **Host contains "pooler"** in the name
4. **Replace `[PASSWORD]`** with your actual password
5. **Update BOTH** `.env.local` and Netlify dashboard

## 🆘 If You Can't Find Session Pooler Connection String

1. Go to Supabase → **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Look for tabs: **"URI"**, **"Session mode"**, **"Transaction mode"**
4. Click **"Session mode"** tab
5. Copy that connection string

If you still can't find it, the format is usually:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres
```

Replace:
- `[PROJECT-REF]` with your project reference (e.g., `eulpiddbrbqchwrkulug`)
- `[PASSWORD]` with your actual password
- `[REGION]` with your region (e.g., `aws-0-eu-central-1`)



