# Fix: Google OAuth Localhost Error

## Problem
You're seeing this error when trying to add localhost URLs:
> "Origine non valide : l'URI doit se terminer par une extension de domaine public de premier niveau, telle que .com ou .org."
> (Invalid origin: the URI must end with a public top-level domain extension, such as .com or .org)

## ✅ Solution 1: Use 127.0.0.1 Instead of localhost

Instead of `localhost`, use `127.0.0.1`:

**Authorized JavaScript origins:**
```
http://127.0.0.1:3000
```

**Authorized redirect URIs:**
```
http://127.0.0.1:3000/api/auth/callback/google
```

**Then update your `.env.local`:**
```bash
NEXTAUTH_URL=http://127.0.0.1:3000
```

**Important:** You'll also need to access your app at `http://127.0.0.1:3000` instead of `http://localhost:3000` for OAuth to work.

---

## ✅ Solution 2: Skip Localhost for Now (Use Production URL)

If you're deploying soon, you can:

1. **Skip localhost URLs** in Google Console for now
2. **Add your production URL** directly:
   - JavaScript origin: `https://your-app.vercel.app`
   - Redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
3. **Test locally** by temporarily using your production URL in `.env.local`:
   ```bash
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

---

## ✅ Solution 3: Use a Development Domain (Advanced)

If you have a domain, you can:
1. Create a subdomain like `dev.yourdomain.com`
2. Point it to `127.0.0.1` using your hosts file
3. Use that in Google Console

---

## 🎯 Recommended: Solution 1 (127.0.0.1)

**Step-by-step:**

1. **In Google Cloud Console:**
   - Go to **Credentials** → Click your OAuth Client ID
   - **Authorized JavaScript origins:**
     - Remove `http://localhost:3000` if you added it
     - Add: `http://127.0.0.1:3000`
   - **Authorized redirect URIs:**
     - Remove `http://localhost:3000/api/auth/callback/google` if you added it
     - Add: `http://127.0.0.1:3000/api/auth/callback/google`
   - Click **Save**

2. **Update your `.env.local`:**
   ```bash
   NEXTAUTH_URL=http://127.0.0.1:3000
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

3. **Restart your server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Access your app at:**
   - `http://127.0.0.1:3000` (instead of localhost)

5. **Test Google login:**
   - Go to `http://127.0.0.1:3000/signup`
   - Click "Sign up with Google"
   - It should work!

---

## ⚠️ Important Notes

- **Both `localhost` and `127.0.0.1` work the same** - they're the same address
- **You must use the same URL** in:
  - Google Console (Authorized JavaScript origins)
  - `.env.local` (NEXTAUTH_URL)
  - Your browser (to access the app)
- **If you use `127.0.0.1` in Google Console, you must access your app at `http://127.0.0.1:3000`**

---

## 🔄 When You Deploy to Production

After deploying, add your production URLs:

**In Google Cloud Console:**
- **Authorized JavaScript origins:**
  - `http://127.0.0.1:3000` (keep for local testing)
  - `https://your-app.vercel.app` (add production)
- **Authorized redirect URIs:**
  - `http://127.0.0.1:3000/api/auth/callback/google` (keep for local)
  - `https://your-app.vercel.app/api/auth/callback/google` (add production)

**In Vercel (or your hosting):**
- Set `NEXTAUTH_URL=https://your-app.vercel.app`

---

## ✅ Quick Fix Summary

**Replace:**
- `http://localhost:3000` → `http://127.0.0.1:3000`
- `http://localhost:3000/api/auth/callback/google` → `http://127.0.0.1:3000/api/auth/callback/google`

**Update `.env.local`:**
```bash
NEXTAUTH_URL=http://127.0.0.1:3000
```

**Access app at:** `http://127.0.0.1:3000`

That's it! 🎉

