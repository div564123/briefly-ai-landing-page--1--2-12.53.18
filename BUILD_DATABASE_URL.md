# How to Build DATABASE_URL for Supabase

## ⚠️ Important

The URL you found (`https://eulpiddbrbqchwrkulug.supabase.co`) is the **REST API URL**, not the **DATABASE_URL**.

We need the **PostgreSQL connection string**, which has a different format.

## ✅ Build DATABASE_URL Manually

Based on your project URL, your DATABASE_URL should be:

```
postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Step 1: Get Your Database Password

1. Go back to **Settings** → **Database**
2. In the **"Database password"** section, you should see your password
3. If you don't see it or don't remember it:
   - Click **"Reset database password"**
   - Copy the new password
   - **⚠️ Save it somewhere safe!**

### Step 2: Build the Connection String

Replace `YOUR_PASSWORD` in this template:

```
postgresql://postgres:YOUR_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

**Example:**
If your password is `MySecurePass123`, your DATABASE_URL would be:
```
postgresql://postgres:MySecurePass123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Step 3: Handle Special Characters in Password

If your password contains special characters, you may need to URL-encode them:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- ` ` (space) → `%20`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

**Example:**
If password is `My@Pass#123`, it becomes:
```
postgresql://postgres:My%40Pass%23123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

## 🎯 Final DATABASE_URL Format

Your complete DATABASE_URL should look like:
```
postgresql://postgres:[PASSWORD]@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

Where:
- `postgres` = username (default for Supabase)
- `[PASSWORD]` = your actual database password
- `db.eulpiddbrbqchwrkulug.supabase.co` = your database host
- `5432` = PostgreSQL port
- `postgres` = database name (default)

## 📋 Next Steps

1. ✅ Get your database password from Database Settings
2. ✅ Build the DATABASE_URL using the format above
3. ✅ Add it to Netlify Dashboard (see `URGENT_FIX_DATABASE.md`)
4. ✅ Redeploy your site

## 🔍 Alternative: Find Connection String in Supabase

If you want to find the connection string directly in Supabase:

1. Go to **Settings** → **Database**
2. Scroll to find **"Connection string"** section (usually at the top)
3. Click on **"URI"** tab
4. Copy the connection string
5. Replace `[PASSWORD]` with your actual password

But if you can't find it, building it manually works perfectly!






