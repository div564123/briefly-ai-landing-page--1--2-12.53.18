# Quick Deploy Guide - Capso AI

**Your Email**: briefly.contact.10@gmail.com

## 💡 Recommended: Deploy First, Then Set Up OAuth

**Smart approach:** Deploy your app first to get a domain, then set up Google OAuth with that production domain. This avoids localhost issues!

See `DEPLOY_FIRST_THEN_OAUTH.md` for the complete workflow.

## 🚀 Fastest Way to Deploy (5 Steps)

### Step 1: Push to GitHub
```bash
# If not already a git repo:
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/briefly-ai.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repo
5. Click "Deploy"

### Step 3: Add Environment Variables
In Vercel → Your Project → Settings → Environment Variables, add:

```
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app
DATABASE_URL=will-be-set-in-step-4
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-key
LEMONFOX_API_KEY=your-lemonfox-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

### Step 4: Set Up Database
**In Vercel Dashboard:**
1. Go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Vercel auto-adds `POSTGRES_URL` to env vars
4. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL")
   }
   ```
5. Push changes and redeploy

### Step 5: Update Google OAuth
1. Google Cloud Console → Your Project
2. APIs & Services → Credentials
3. Edit OAuth Client
4. Add to **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`
5. Add to **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`

## ✅ Done!
Your app is live at: `https://your-app.vercel.app`

## 📧 Support
Email: briefly.contact.10@gmail.com

