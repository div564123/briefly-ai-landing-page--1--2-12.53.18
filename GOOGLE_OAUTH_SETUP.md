# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for login and signup.

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project (or select existing)**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: "Briefly AI" (or any name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (unless you have Google Workspace)
     - App name: "Briefly AI"
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Click "Save and Continue" (default scopes are fine)
     - Test users: Add your email if needed, then "Save and Continue"

5. **Create OAuth Client ID**
   - Application type: **Web application**
   - Name: "Briefly AI Web Client"
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production - replace with your domain)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID**: `xxxxx.apps.googleusercontent.com`
     - **Client Secret**: `xxxxx`
   - **IMPORTANT**: Copy these immediately - you won't see the secret again!

## Step 2: Add Credentials to .env.local

1. **Open your `.env.local` file**
   - Location: `/Users/owensolano/Desktop/Briefly AI/briefly-ai-landing-page (1) 2/.env.local`

2. **Add these lines:**
   ```bash
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

3. **Replace the placeholders:**
   - Replace `your-client-id-here.apps.googleusercontent.com` with your actual Client ID
   - Replace `your-client-secret-here` with your actual Client Secret

## Step 3: Restart Your Server

After adding the credentials, restart your development server:

```bash
npm run dev
```

## Step 4: Test Google Sign In

1. Go to `/signup` or `/login`
2. Click "Sign up with Google" or "Sign in with Google"
3. You should be redirected to Google's login page
4. After logging in, you'll be redirected back to your app

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Problem**: The redirect URI in your Google Console doesn't match your app URL
- **Solution**: 
  - Check your `.env.local` for `NEXTAUTH_URL`
  - Make sure the redirect URI in Google Console matches: `http://localhost:3000/api/auth/callback/google`
  - For production: `https://yourdomain.com/api/auth/callback/google`

### Error: "invalid_client"
- **Problem**: Client ID or Client Secret is incorrect
- **Solution**: 
  - Double-check your `.env.local` file
  - Make sure there are no extra spaces
  - Restart your server after making changes

### Error: "access_denied"
- **Problem**: OAuth consent screen not configured
- **Solution**: 
  - Go back to Google Cloud Console
  - Complete the OAuth consent screen setup
  - Add your email as a test user if needed

### Google Sign In Button Not Appearing
- **Problem**: Missing environment variables
- **Solution**: 
  - Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env.local`
  - Restart your server

## Production Setup

When deploying to production:

1. **Update Google Console:**
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"

2. **Update Environment Variables:**
   - Set `NEXTAUTH_URL=https://yourdomain.com` in your hosting platform
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your hosting platform's environment variables

3. **OAuth Consent Screen:**
   - Change from "Testing" to "In production" when ready
   - This allows anyone to sign in (not just test users)

## Example .env.local File

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# LemonFox
LEMONFOX_API_KEY=your-lemonfox-api-key-here
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

## Quick Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API or Google Identity API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID (Web application)
- [ ] Added authorized JavaScript origins
- [ ] Added authorized redirect URIs
- [ ] Copied Client ID and Client Secret
- [ ] Added credentials to `.env.local`
- [ ] Restarted development server
- [ ] Tested Google sign in

## Need Help?

- Google Cloud Console: https://console.cloud.google.com/
- NextAuth.js Google Provider Docs: https://next-auth.js.org/providers/google
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2

