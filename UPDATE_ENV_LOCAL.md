# ⚠️ Update .env.local - Replace Password Placeholder

## 🔴 Problem

Your `.env.local` has:
```
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

`VOTRE_MOT_DE_PASSE` is a placeholder - you need to replace it with your **actual Supabase password**.

## ✅ Solution

### Step 1: Get Your Real Password

1. Go to [supabase.com](https://supabase.com)
2. Your project → **Settings** → **Database**
3. Find **"Database password"** section
4. Copy the password shown
5. **If you don't see it:**
   - Click **"Reset database password"**
   - Copy the new password
   - **⚠️ Save it somewhere safe!**

### Step 2: Update .env.local

Replace `VOTRE_MOT_DE_PASSE` with your actual password.

**Before:**
```
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

**After (example):**
```
DATABASE_URL=postgresql://postgres:MyActualPassword123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Step 3: Handle Special Characters

If your password contains special characters, URL-encode them:
- `?` → `%3F`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- Space → `%20`

**Example:**
If password is `MyPass?123`, use:
```
DATABASE_URL=postgresql://postgres:MyPass%3F123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Step 4: Test Connection

After updating `.env.local`, test if it works:

```bash
npx prisma db push
```

If this succeeds, your DATABASE_URL is correct!

## ✅ Your .env.local Should Look Like:

```
DATABASE_URL=postgresql://postgres:YOUR_REAL_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
NEXTAUTH_SECRET=6TG7t/f20Mzo+p/RbTL1iYoldf5fKl83tk7q8x/u3vU=
NEXTAUTH_URL=http://localhost:3000
```

**Replace `YOUR_REAL_PASSWORD` with your actual Supabase password!**

## ⚠️ Important

- **No quotes** around the value
- **No spaces** around `=`
- **Replace the placeholder** with real password
- **Save the file** after editing






