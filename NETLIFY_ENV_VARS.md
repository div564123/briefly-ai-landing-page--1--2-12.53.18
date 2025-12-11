# Environment Variables for Netlify

## ⚠️ IMPORTANT: Fix "Database configuration error"

If you see **"Database configuration error"** or **500 errors on `/api/auth/session`**, you need to configure these environment variables in Netlify.

## Required Environment Variables

Add these in **Netlify Dashboard** → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**:

### Critical (Required for App to Work):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://capsoai.com
OPENAI_API_KEY=sk-your-openai-api-key
LEMONFOX_API_KEY=your-lemonfox-api-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

**⚠️ For your site (capsoai.com), use:**
- `NEXTAUTH_URL=https://capsoai.com` (not netlify.app)

### Optional (For Payments):

```
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

## How to Generate NEXTAUTH_SECRET

Run this command:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

## Important Notes

1. **DATABASE_URL**: Must be PostgreSQL (not SQLite)
   - Get from Supabase, Neon, or Railway
   - Format: `postgresql://user:password@host:5432/dbname`

2. **NEXTAUTH_URL**: 
   - Initially: `https://your-site-name.netlify.app`
   - Update if you add a custom domain

3. **All variables are case-sensitive**
   - Match exact names shown above

4. **No quotes needed** in Netlify dashboard
   - Just paste the value directly

## Step-by-Step Configuration

### Step 1: Get DATABASE_URL

You need a PostgreSQL database. Options:

**Option A: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**Option B: Neon (Free)**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Step 2: Generate NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

Copy the generated secret.

### Step 3: Add Variables to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site (capsoai.com)
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **Add variable** for each:

   - **Key**: `DATABASE_URL`  
     **Value**: `postgresql://...` (from Step 1)

   - **Key**: `NEXTAUTH_SECRET`  
     **Value**: `...` (from Step 2)

   - **Key**: `NEXTAUTH_URL`  
     **Value**: `https://capsoai.com`

   - **Key**: `OPENAI_API_KEY`  
     **Value**: `sk-...` (your OpenAI key)

   - **Key**: `LEMONFOX_API_KEY`  
     **Value**: `...` (your LemonFox key)

   - **Key**: `LEMONFOX_API_URL`  
     **Value**: `https://api.lemonfox.ai/v1/audio/speech`

### Step 4: Run Database Migrations

After adding `DATABASE_URL`, you need to create the database tables:

1. **Option A: Use Prisma Studio (Recommended)**
   ```bash
   npx prisma studio
   ```
   This will open a web interface where you can see your database.

2. **Option B: Run migrations via SQL**
   - Go to your database provider's SQL editor
   - Run the SQL from `prisma/schema.prisma` or use `prisma migrate deploy`

### Step 5: Redeploy

1. In Netlify, go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

### Step 6: Test

1. Try to create an account
2. If you still see errors, check **Site settings** → **Functions** → **Logs** for detailed error messages

## After Adding Variables

1. **Redeploy** your site (Netlify will auto-redeploy)
2. **Test** all features
3. **Check logs** if anything fails






































