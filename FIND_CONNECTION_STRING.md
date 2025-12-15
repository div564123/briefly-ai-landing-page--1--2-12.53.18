# Where to Find Connection String in Supabase Database Settings

## 📍 Location

The **Connection string** section is usually at the **TOP** of the Database Settings page, **ABOVE** the "Reset database password" section.

## ✅ Steps to Find It

1. **Scroll UP** on the Database Settings page
2. Look for a section called **"Connection string"** or **"Connection info"**
3. It should be near the top, before "Reset database password"

## 🔍 What to Look For

The Connection string section typically shows:
- **URI** tab (this is what you need!)
- **Session mode** tab
- **Transaction mode** tab
- A text box with the connection string

## 📋 Alternative: Check Project Settings

If you don't see "Connection string" in Database Settings, try:

1. Go to **Settings** → **Project Settings** (not Database)
2. Look for **Database** section
3. Find **Connection string** or **Connection info**

## 🎯 What You Need

You're looking for something that looks like:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

OR

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## 💡 Quick Tip

If you still can't find it:
1. Look for any text that starts with `postgresql://`
2. Or look for tabs labeled "URI", "Session mode", "Transaction mode"
3. The **URI** tab is what you need!

## 🔄 If You Still Can't Find It

Try this:
1. In Supabase dashboard, go to **Settings** → **API** (or **Project Settings** → **API**)
2. Look for **Database URL** or **Connection string**
3. Or check the **SQL Editor** - sometimes the connection info is shown there









