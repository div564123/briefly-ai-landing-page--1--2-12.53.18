# Deploy First, Then Set Up Google OAuth

**Smart approach!** Deploy your app first, then configure Google OAuth with your production domain. This avoids localhost issues entirely.

## 🎯 Recommended Workflow

1. ✅ Deploy app to Vercel (get your domain)
2. ✅ Set up Google OAuth with production domain
3. ✅ Test everything in production
4. ✅ (Optional) Add localhost later for local testing

---

## Step 1: Deploy to Vercel First

### 1.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/briefly-ai.git
git push -u origin main
```

### 1.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. **Don't add environment variables yet** - we'll do that after getting the domain
6. Click "Deploy"

### 1.3 Get Your Domain
After deployment, Vercel will give you a URL like:
- `https://briefly-ai-xyz123.vercel.app`
- Or you can set a custom domain

**Write this down!** You'll need it for Google OAuth.

---

## Step 2: Set Up Database

### 2.1 Create Vercel Postgres Database
1. In Vercel project → **Storage** tab
2. Click **"Create Database"** → **Postgres**
3. Vercel automatically adds `POSTGRES_URL` to environment variables

### 2.2 Update Prisma Schema
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

### 2.3 Push Changes and Run Migrations
```bash
git add prisma/schema.prisma
git commit -m "Update to PostgreSQL"
git push

# Then in Vercel, it will auto-deploy
# Or run migrations manually:
npx prisma migrate deploy
```

---

## Step 3: Add Environment Variables in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add all your variables:

```bash
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=we-will-add-this-after-oauth-setup
GOOGLE_CLIENT_SECRET=we-will-add-this-after-oauth-setup
OPENAI_API_KEY=your-openai-key
LEMONFOX_API_KEY=your-lemonfox-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

**Note:** Leave `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` empty for now - we'll add them after setting up OAuth.

3. Click **"Save"**
4. **Redeploy** your app (Vercel will auto-redeploy when you save env vars)

---

## Step 4: Set Up Google OAuth with Production Domain

Now that you have your production domain, set up Google OAuth properly:

### 4.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with: **briefly.contact.10@gmail.com**
3. Select your project (or create one)

### 4.2 Enable Google+ API
1. **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Identity Toolkit API"**
3. Click **"Enable"**

### 4.3 Configure OAuth Consent Screen
1. **APIs & Services** → **OAuth consent screen**
2. Select **"External"**
3. Fill in:
   - **App name**: `Briefly AI`
   - **User support email**: `briefly.contact.10@gmail.com`
   - **Developer contact**: `briefly.contact.10@gmail.com`
   - **Application home page**: `https://your-app.vercel.app` (your Vercel URL)
4. Click through and save

### 4.4 Create OAuth Credentials
1. **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"**
4. **Name**: `Briefly AI Production`

5. **Authorized JavaScript origins:**
   - Add: `https://your-app.vercel.app` (your actual Vercel URL)
   - Example: `https://briefly-ai-xyz123.vercel.app`

6. **Authorized redirect URIs:**
   - Add: `https://your-app.vercel.app/api/auth/callback/google`
   - Example: `https://briefly-ai-xyz123.vercel.app/api/auth/callback/google`

7. Click **"Create"**

### 4.5 Copy Credentials
**⚠️ Copy these immediately!**
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

---

## Step 5: Add Google Credentials to Vercel

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Update:
   ```
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
3. Click **"Save"**
4. Vercel will automatically redeploy

---

## Step 6: Test Everything

1. Wait for deployment to finish (2-3 minutes)
2. Go to: `https://your-app.vercel.app`
3. Click **"Sign Up"**
4. Click **"Sign up with Google"**
5. It should work! 🎉

---

## Step 7: (Optional) Add Localhost for Local Development

If you want to test locally later:

### 7.1 Add Localhost to Google Console
1. Go to Google Cloud Console → Credentials
2. Click your OAuth Client ID
3. **Authorized JavaScript origins:**
   - Add: `http://127.0.0.1:3000`
4. **Authorized redirect URIs:**
   - Add: `http://127.0.0.1:3000/api/auth/callback/google`
5. Click **"Save"**

### 7.2 Update Local `.env.local`
```bash
NEXTAUTH_URL=http://127.0.0.1:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 7.3 Test Locally
- Access app at: `http://127.0.0.1:3000`
- Google login will work!

---

## ✅ Checklist

- [ ] Deployed to Vercel
- [ ] Got production domain (e.g., `https://your-app.vercel.app`)
- [ ] Set up Vercel Postgres database
- [ ] Updated Prisma schema to PostgreSQL
- [ ] Added environment variables in Vercel (except Google OAuth)
- [ ] Enabled Google+ API in Google Cloud
- [ ] Configured OAuth consent screen
- [ ] Created OAuth credentials with production domain
- [ ] Added Google credentials to Vercel
- [ ] Tested Google login in production
- [ ] (Optional) Added localhost for local testing

---

## 🎯 Benefits of This Approach

✅ **No localhost issues** - Everything uses production domain  
✅ **Production-ready from start** - No need to reconfigure later  
✅ **Easier testing** - Test in real environment  
✅ **Cleaner setup** - One domain, one configuration  

---

## 📝 Quick Reference

**Your Production Domain:**
- Vercel URL: `https://your-app.vercel.app`
- Google OAuth Redirect: `https://your-app.vercel.app/api/auth/callback/google`

**Environment Variables Needed:**
- `NEXTAUTH_URL` = your Vercel URL
- `GOOGLE_CLIENT_ID` = from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` = from Google Cloud Console

---

**This is the smart way to do it!** 🚀

