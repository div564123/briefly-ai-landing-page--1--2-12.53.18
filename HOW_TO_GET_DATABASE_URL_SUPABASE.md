# How to Get DATABASE_URL from Supabase

## 📍 Where to Find It

**NOT in Project Settings!** The DATABASE_URL is in **Database Settings**.

## ✅ Step-by-Step Instructions

### Step 1: Go to Database Settings

1. In Supabase dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **Database** (NOT "Project Settings")
   - You should see options like:
     - Connection string
     - Connection pooling
     - Database password
     - etc.

### Step 2: Find Connection String

1. Scroll down to the **Connection string** section
2. You'll see different connection modes:
   - **URI** ← **USE THIS ONE**
   - Session mode
   - Transaction mode
   - etc.

### Step 3: Copy the URI

1. Click on the **URI** tab
2. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

3. **Click the copy button** (or select and copy)

### Step 4: Replace the Password

The connection string will have `[PASSWORD]` or `[YOUR-PASSWORD]` placeholder.

**To get your actual password:**

1. In the same **Database** settings page
2. Scroll to **Database password** section
3. If you don't know it:
   - Click **Reset database password**
   - Copy the new password
   - **⚠️ Save it somewhere safe!**
4. Replace `[PASSWORD]` in the connection string with your actual password

### Step 5: Final Connection String Format

Your final `DATABASE_URL` should look like:
```
postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

**Example:**
```
postgresql://postgres:MySecurePassword123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

## 🔍 Alternative: Direct Connection (Not Pooled)

If you see a "Direct connection" option, use that instead of the pooled connection for better compatibility:

1. In **Database** settings
2. Look for **Connection string** → **Direct connection** or **URI (direct)**
3. Copy that one instead

The direct connection usually looks like:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## ⚠️ Important Notes

1. **Use the URI format**, not "Session mode" or "Transaction mode"
2. **Replace `[PASSWORD]`** with your actual database password
3. **Don't include brackets** `[]` in the final connection string
4. **If password has special characters**, they may need URL encoding:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - Space → `%20`

## 📋 Quick Checklist

- [ ] Went to Settings → **Database** (not Project Settings)
- [ ] Found **Connection string** section
- [ ] Clicked **URI** tab
- [ ] Copied the connection string
- [ ] Got database password from **Database password** section
- [ ] Replaced `[PASSWORD]` with actual password
- [ ] Final format: `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres`

## 🎯 Next Step

After you have the DATABASE_URL:
1. Go to Netlify Dashboard
2. Add it as an environment variable (see `URGENT_FIX_DATABASE.md`)
3. Redeploy your site






