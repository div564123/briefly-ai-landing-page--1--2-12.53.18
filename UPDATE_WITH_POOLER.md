# ✅ Update DATABASE_URL with Session Pooler

## ✅ You Found It!

Your Session Pooler connection string:
```
postgresql://postgres.eulpiddbrbqchwrkulug:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

## 🔧 Step 1: Get Your Password

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Settings** → **Database**
3. Find **"Database password"** section
4. Copy the password
5. **If you don't see it:**
   - Click **"Reset database password"**
   - Copy the new password
   - **⚠️ Save it somewhere safe!**

## 🔧 Step 2: Replace [YOUR-PASSWORD]

Replace `[YOUR-PASSWORD]` in the connection string with your actual password.

**Example:**
If your password is `abc123`, your DATABASE_URL becomes:
```
postgresql://postgres.eulpiddbrbqchwrkulug:abc123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

## 🔧 Step 3: Update .env.local

1. Open `.env.local` in your project root
2. Update `DATABASE_URL` with your Session Pooler connection string:
   ```
   DATABASE_URL=postgresql://postgres.eulpiddbrbqchwrkulug:YOUR_ACTUAL_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
   ```
3. Replace `YOUR_ACTUAL_PASSWORD` with your real password
4. **No quotes** around the value
5. **No spaces** around `=`
6. Save the file

## 🔧 Step 4: Update Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Your site → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
3. Find `DATABASE_URL` (or click **Add variable** if it doesn't exist)
4. Update the value with your Session Pooler connection string:
   ```
   postgresql://postgres.eulpiddbrbqchwrkulug:YOUR_ACTUAL_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
   ```
5. Replace `YOUR_ACTUAL_PASSWORD` with your real password
6. Click **Save**

## 🔧 Step 5: Test Locally

After updating `.env.local`:

```bash
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
✔ The database is now in sync with your schema.
```

## 🔧 Step 6: Create Database Tables

If `npx prisma db push` succeeds, your tables are created!

Verify in Supabase:
1. Go to [supabase.com](https://supabase.com)
2. Your project → **Table Editor**
3. You should see:
   - `User`
   - `AudioGeneration`

## 🔧 Step 7: Redeploy on Netlify

**⚠️ CRITICAL: Must redeploy after updating DATABASE_URL**

1. Netlify → **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait 2-3 minutes for build to complete

## 🔧 Step 8: Test Signup

1. Go to your site (capsoai.com)
2. Try to create an account
3. It should work now! 🎉

## ⚠️ Special Characters in Password

If your password contains special characters, URL-encode them:
- `?` → `%3F`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- Space → `%20`

**Example:**
If password is `MyPass?123`, use:
```
postgresql://postgres.eulpiddbrbqchwrkulug:MyPass%3F123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

## 📋 Checklist

- [ ] Got password from Supabase
- [ ] Replaced `[YOUR-PASSWORD]` in connection string
- [ ] Updated `.env.local` with Session Pooler URL
- [ ] Updated `DATABASE_URL` in Netlify dashboard with Session Pooler URL
- [ ] Tested `npx prisma db push` locally (should work)
- [ ] Verified tables exist in Supabase Table Editor
- [ ] Redeployed site on Netlify
- [ ] Tested signup - should work now!

## ✅ Your Final DATABASE_URL Format

Should look like:
```
postgresql://postgres.eulpiddbrbqchwrkulug:YOUR_REAL_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**Key differences from Direct Connection:**
- ✅ Uses `pooler.supabase.com` (not `db.xxxxx.supabase.co`)
- ✅ Uses `postgres.xxxxx` format (not just `postgres`)
- ✅ Compatible with IPv4 (works on Netlify)







