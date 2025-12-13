# Setup .env.local for prisma db push

## ⚠️ Error You're Seeing

```
Error: Prisma schema validation - the URL must start with the protocol `postgresql://` or `postgres://`.
```

This means `DATABASE_URL` is not set in `.env.local`.

## ✅ Solution

### Step 1: Create/Edit .env.local

1. In your project root, create or open `.env.local` file
2. Add this line (replace `YOUR_PASSWORD` with your actual Supabase password):

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Step 2: Get Your Database Password

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Settings** → **Database**
3. Find **"Database password"** section
4. Copy the password
5. If you don't see it, click **"Reset database password"** and copy the new one

### Step 3: Update .env.local

Replace `YOUR_PASSWORD` in the DATABASE_URL with your actual password.

**Example:**
If your password is `MyPass123`, your `.env.local` should contain:
```
DATABASE_URL=postgresql://postgres:MyPass123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Step 4: Run prisma db push Again

After adding DATABASE_URL to `.env.local`, run:

```bash
npx prisma db push
```

It should work now!

## 📋 Complete .env.local Example

Your `.env.local` file should look like this (add other variables you need):

```
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=sk-your-openai-key
LEMONFOX_API_KEY=your-lemonfox-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

## ⚠️ Important Notes

1. **No spaces** around the `=` sign
2. **No quotes** around the value (unless password has special characters that need encoding)
3. **Replace `YOUR_ACTUAL_PASSWORD`** with your real password
4. File should be named exactly `.env.local` (with the dot at the start)

## 🔍 If Password Has Special Characters

If your password contains special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- Space → `%20`

**Example:**
Password: `My@Pass#123`
DATABASE_URL: `postgresql://postgres:My%40Pass%23123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres`






