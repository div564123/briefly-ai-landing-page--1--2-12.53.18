# How to Deploy Briefly AI to the Internet

This guide will walk you through deploying your Briefly AI application to the internet. We'll use **Vercel** (recommended for Next.js apps) as it's the easiest and most reliable option.

## 💡 Recommended Approach: Deploy First, Then OAuth

**Smart tip:** Deploy your app first to get a production domain, then set up Google OAuth with that domain. This avoids localhost validation issues!

See `DEPLOY_FIRST_THEN_OAUTH.md` for the recommended workflow.

## 🚀 Option 1: Deploy to Vercel (Recommended)

Vercel is the company behind Next.js and offers the best integration for Next.js applications.

### Step 1: Prepare Your Code

1. **Make sure your code is in a Git repository:**
   ```bash
   # If you haven't initialized git yet:
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   ```

2. **Push to GitHub (or GitLab/Bitbucket):**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/briefly-ai.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (briefly.contact.10@gmail.com)
   - This allows automatic deployments from your GitHub repo

2. **Import Your Project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Next.js app

3. **Configure Project Settings:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Set Environment Variables

**CRITICAL**: Add all your environment variables in Vercel's dashboard:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add each variable one by one:

```
NEXTAUTH_SECRET=your-production-secret-here
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=file:./dev.db
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
LEMONFOX_API_KEY=your-lemonfox-api-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

**Important Notes:**
- **NEXTAUTH_SECRET**: Generate a new strong secret for production:
  ```bash
  openssl rand -base64 32
  ```
  Or use: https://generate-secret.vercel.app/32

- **NEXTAUTH_URL**: Initially use your Vercel URL (e.g., `https://briefly-ai.vercel.app`)
  - Update this later if you add a custom domain

- **DATABASE_URL**: For production, you'll need a real database (see Database Setup below)

### Step 4: Update Google OAuth for Production

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Update OAuth Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Add to **Authorized JavaScript origins:**
     - `https://your-app-name.vercel.app`
   - Add to **Authorized redirect URIs:**
     - `https://your-app-name.vercel.app/api/auth/callback/google`

3. **Update OAuth Consent Screen:**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Change from "Testing" to "In production" (when ready)
   - Add your email: `briefly.contact.10@gmail.com` as support email

### Step 5: Database Setup for Production

**SQLite won't work on Vercel** (it's serverless). You need a real database:

#### Option A: Vercel Postgres (Easiest)

1. In your Vercel project, go to **Storage** tab
2. Click **Create Database** → Select **Postgres**
3. Vercel will automatically add `POSTGRES_URL` to your environment variables
4. Update your Prisma schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

#### Option B: Supabase (Free Tier Available)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from **Settings** → **Database**
4. Add to Vercel environment variables as `DATABASE_URL`
5. Update Prisma schema to use `postgresql`
6. Run migrations

#### Option C: Railway, PlanetScale, or Neon

- Similar process: get connection string, add to env vars, update Prisma schema

### Step 6: Deploy!

1. Click **Deploy** in Vercel
2. Wait for build to complete (usually 2-5 minutes)
3. Your app will be live at: `https://your-app-name.vercel.app`

### Step 7: Update Environment Variables After First Deploy

After deployment, update `NEXTAUTH_URL` in Vercel to match your actual domain:
- Go to **Settings** → **Environment Variables**
- Update `NEXTAUTH_URL` to your Vercel URL
- Redeploy (or it will auto-redeploy)

---

## 🌐 Option 2: Deploy to Other Platforms

### Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables in **Site settings** → **Environment variables**
5. Deploy!

### Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add environment variables
4. Railway auto-detects Next.js and deploys

### Self-Hosted (VPS)

If you want to host on your own server (DigitalOcean, AWS EC2, etc.):

1. **Set up server:**
   ```bash
   # Install Node.js, npm
   # Clone your repository
   git clone https://github.com/yourusername/briefly-ai.git
   cd briefly-ai
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env.local file
   nano .env.local
   # Add all your environment variables
   ```

3. **Set up database:**
   - Install PostgreSQL or use SQLite for small deployments
   - Run Prisma migrations

4. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

5. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "briefly-ai" -- start
   pm2 save
   pm2 startup
   ```

6. **Set up Nginx as reverse proxy:**
   - Configure Nginx to forward requests to your Next.js app (port 3000)
   - Set up SSL with Let's Encrypt

---

## 🔒 Security Checklist Before Going Live

- [ ] Generate new `NEXTAUTH_SECRET` for production (don't use dev secret)
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update Google OAuth redirect URIs
- [ ] Use production database (not SQLite)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Review and update CSP headers in `next.config.mjs`
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Vercel Analytics is already included)

---

## 📧 Custom Domain Setup (Optional)

### On Vercel:

1. Go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `brieflyai.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs to include custom domain

---

## 🧪 Testing After Deployment

1. **Test Registration:**
   - Go to `https://your-app.vercel.app/signup`
   - Create a test account
   - Verify email/password signup works

2. **Test Google OAuth:**
   - Click "Sign up with Google"
   - Verify OAuth flow works

3. **Test Login:**
   - Log out
   - Log back in with credentials
   - Verify session persists

4. **Test Core Features:**
   - Upload a document
   - Generate summary
   - Generate audio
   - Check usage tracking

5. **Test Error Handling:**
   - Try invalid credentials
   - Try uploading invalid file
   - Verify error messages display correctly

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check for TypeScript errors: `npm run build` locally

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Run migrations: `npx prisma migrate deploy`

### OAuth Not Working
- Verify redirect URIs match exactly (including https://)
- Check `NEXTAUTH_URL` matches your domain
- Verify Google OAuth credentials are correct

### Environment Variables Not Loading
- Restart deployment after adding env vars
- Check variable names match exactly (case-sensitive)
- Verify no extra spaces or quotes

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Already Included)
- Automatically tracks page views
- No additional setup needed

### Add More Monitoring:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User behavior

---

## 💰 Cost Estimates

### Vercel (Free Tier):
- ✅ Free for personal projects
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL

### Database (Free Options):
- **Vercel Postgres**: Free tier available
- **Supabase**: Free tier (500MB database)
- **Railway**: $5/month with $5 credit

### API Costs:
- **OpenAI**: Pay per use (~$0.15-0.60 per 1M tokens)
- **LemonFox**: Check their pricing

---

## 📝 Quick Reference

**Your Contact Email**: briefly.contact.10@gmail.com

**Recommended Deployment:**
1. Vercel (hosting)
2. Vercel Postgres or Supabase (database)
3. Custom domain (optional)

**Estimated Time to Deploy**: 30-60 minutes

**First Deployment Checklist:**
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Database set up
- [ ] Google OAuth updated
- [ ] Deployed and tested

---

## 🎉 You're Live!

Once deployed, share your app URL:
- `https://your-app-name.vercel.app`

Or with custom domain:
- `https://brieflyai.com` (or your domain)

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Email: briefly.contact.10@gmail.com

