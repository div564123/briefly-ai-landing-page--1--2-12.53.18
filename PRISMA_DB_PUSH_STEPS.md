# Steps to Run `npx prisma db push`

## ✅ Step 1: Confirm Prisma Installation

In your terminal, type `y` and press Enter to install Prisma.

## ✅ Step 2: Verify DATABASE_URL in .env.local

**BEFORE running `prisma db push`, make sure you have DATABASE_URL in `.env.local`:**

1. Open `.env.local` file in your project root
2. Check if it contains:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```

3. **If DATABASE_URL is missing or incorrect:**
   - Get your database password from Supabase (Settings → Database → Database password)
   - Add or update DATABASE_URL in `.env.local`:
     ```
     DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
     ```
   - Replace `YOUR_ACTUAL_PASSWORD` with your real password

## ✅ Step 3: Run prisma db push

After confirming DATABASE_URL is correct, the command will:
1. Connect to your Supabase database
2. Create all tables (User, AudioGeneration, etc.)
3. Generate Prisma Client

**Expected output:**
```
✔ Generated Prisma Client
✔ The database is now in sync with your schema.
```

## ⚠️ If You Get Errors

### Error: "Can't reach database server"
- Check DATABASE_URL in `.env.local` is correct
- Verify password is correct
- Make sure Supabase database is active

### Error: "Authentication failed"
- Password in DATABASE_URL is wrong
- Reset password in Supabase and update `.env.local`

### Error: "DATABASE_URL not set"
- Make sure `.env.local` exists in project root
- Make sure DATABASE_URL line is not commented out (no `#` at start)

## ✅ Step 4: Verify Tables Were Created

After `prisma db push` succeeds:

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Table Editor**
3. You should see tables:
   - `User`
   - `AudioGeneration`

## ✅ Step 5: Next Steps

After tables are created:
1. Make sure DATABASE_URL is also in Netlify dashboard
2. Redeploy your site on Netlify
3. Test signup - it should work!

