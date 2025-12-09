# Complete Guide: Setting Up Google Login & Signup

This guide will walk you through setting up Google OAuth authentication step-by-step so users can sign in and sign up with their Google accounts.

## 📋 Prerequisites

- A Google account (use: **briefly.contact.10@gmail.com**)
- Access to Google Cloud Console
- Your app's URL (for local: `http://localhost:3000`, for production: your domain)

---

## 🚀 Step-by-Step Setup

### Step 1: Go to Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account: **briefly.contact.10@gmail.com**

### Step 2: Create a New Project (or Select Existing)

1. At the top of the page, click the **project dropdown** (it might say "Select a project" or show a project name)
2. Click **"New Project"** button
3. Fill in the details:
   - **Project name**: `Briefly AI` (or any name you prefer)
   - **Organization**: Leave as default (if applicable)
   - **Location**: Leave as default
4. Click **"Create"**
5. Wait a few seconds for the project to be created
6. Select your new project from the dropdown

### Step 3: Enable Required APIs

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on **"Google+ API"** or **"Identity Toolkit API"**
4. Click the **"Enable"** button
5. Wait for it to enable (usually takes a few seconds)

**Note**: You might also want to enable:
- **Google Identity API** (if available)
- These APIs allow OAuth authentication

### Step 4: Configure OAuth Consent Screen

**This is required before creating OAuth credentials!**

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
2. You'll see a form. Fill it out:

   **User Type:**
   - Select **"External"** (unless you have Google Workspace)
   - Click **"Create"**

   **App Information:**
   - **App name**: `Briefly AI`
   - **User support email**: Select `briefly.contact.10@gmail.com` from dropdown
   - **App logo**: (Optional - you can skip this)
   - **App domain**: (Optional - leave blank for now)
   - **Application home page**: `http://localhost:3000` (or your production URL)
   - **Privacy policy link**: (Optional - you can add later)
   - **Terms of service link**: (Optional - you can add later)
   - **Authorized domains**: (Leave blank for now)
   - **Developer contact information**: `briefly.contact.10@gmail.com`

   Click **"Save and Continue"**

   **Scopes:**
   - You'll see a list of scopes. The default ones are usually fine:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click **"Save and Continue"**

   **Test Users** (if app is in Testing mode):
   - Add your email: `briefly.contact.10@gmail.com`
   - Click **"Add Users"**
   - Click **"Save and Continue"**

   **Summary:**
   - Review your settings
   - Click **"Back to Dashboard"**

### Step 5: Create OAuth 2.0 Credentials

1. In the left sidebar, go to **"APIs & Services"** → **"Credentials"**
2. At the top, click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"** from the dropdown

   If you see a warning about OAuth consent screen:
   - Click **"Configure Consent Screen"** and complete Step 4 first
   - Then come back to this step

4. **Application type**: Select **"Web application"**

5. **Name**: Enter `Briefly AI Web Client` (or any name)

6. **Authorized JavaScript origins**:
   Click **"+ ADD URI"** and add:
   - For development: `http://127.0.0.1:3000` ⚠️ (Use 127.0.0.1 instead of localhost)
   - For production: `https://your-domain.com` (add this later when you deploy)
   
   **Important**: 
   - ⚠️ **Use `127.0.0.1` instead of `localhost`** - Google sometimes rejects localhost
   - Include the protocol (`http://` or `https://`)
   - No trailing slash
   - Example: `http://127.0.0.1:3000` ✅ (correct)
   - Example: `http://localhost:3000` ⚠️ (may be rejected by Google)

7. **Authorized redirect URIs**:
   Click **"+ ADD URI"** and add:
   - For development: `http://127.0.0.1:3000/api/auth/callback/google` ⚠️ (Use 127.0.0.1)
   - For production: `https://your-domain.com/api/auth/callback/google` (add this later)
   
   **Important**:
   - ⚠️ **Use `127.0.0.1` instead of `localhost`** to avoid Google validation errors
   - Must match exactly (including `/api/auth/callback/google`)
   - Include the protocol
   - No trailing slash

8. Click **"Create"**

### Step 6: Copy Your Credentials

**⚠️ IMPORTANT: Copy these immediately - you won't see the secret again!**

After clicking "Create", you'll see a popup with:

1. **Your Client ID**: 
   - Looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - Click the copy icon or select and copy (Cmd+C / Ctrl+C)

2. **Your Client Secret**:
   - Looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **⚠️ Copy this NOW** - you won't be able to see it again!
   - If you lose it, you'll need to create new credentials

3. Click **"OK"** to close the popup

### Step 7: Add Credentials to Your App

1. Open your project's `.env.local` file
2. Add or update these lines:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# NextAuth (use 127.0.0.1 if you used that in Google Console)
NEXTAUTH_URL=http://127.0.0.1:3000
```

**Replace with your actual values!**

**Important:** If you used `127.0.0.1` in Google Console (instead of localhost), make sure `NEXTAUTH_URL` also uses `127.0.0.1`.

3. Save the file

### Step 8: Restart Your Development Server

**This is important!** Environment variables are only loaded when the server starts.

1. Stop your server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 9: Test Google Login

1. Open your app: 
   - If you used `127.0.0.1` in Google Console: `http://127.0.0.1:3000`
   - If you used `localhost`: `http://localhost:3000`
   - ⚠️ **Important:** Use the same URL you configured in Google Console!
2. Go to the signup or login page
3. Click **"Sign up with Google"** or **"Sign in with Google"**
4. You should see a Google sign-in popup
5. Select your Google account
6. Grant permissions
7. You should be redirected back to your app and logged in!

---

## 🔧 Troubleshooting

### "Error 400: redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's configured in Google Cloud.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. Check **Authorized redirect URIs**
4. Make sure it exactly matches what you're using:
   - If using `127.0.0.1`: `http://127.0.0.1:3000/api/auth/callback/google`
   - If using `localhost`: `http://localhost:3000/api/auth/callback/google`
5. Also check `NEXTAUTH_URL` in `.env.local` matches
6. Save and try again

### "Error 403: access_denied"

**Problem**: Your app is in "Testing" mode and the user isn't a test user.

**Solution**:
1. Go to OAuth consent screen
2. Add the user's email to "Test users"
3. Or publish your app (change from Testing to Production)

### "Invalid client secret"

**Problem**: The client secret in `.env.local` is wrong or has extra spaces.

**Solution**:
1. Check `.env.local` - make sure there are no spaces around the `=`
2. Make sure you copied the entire secret
3. If you lost the secret, create new credentials in Google Cloud Console

### Google Sign-In Button Not Showing

**Problem**: Environment variables not loaded.

**Solution**:
1. Make sure `.env.local` exists in the project root
2. Make sure variables are named correctly: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Restart your development server

### "This app isn't verified"

**Problem**: Your app is in development/testing mode.

**Solution**:
- This is normal for development! Click "Advanced" → "Go to Briefly AI (unsafe)"
- For production, you'll need to verify your app with Google (requires verification process)

---

## 🌐 Setting Up for Production

When you deploy to production (e.g., Vercel):

### 1. Update OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Change **Publishing status** from "Testing" to **"In production"**
3. This allows anyone to sign in (not just test users)

### 2. Add Production URLs

1. Go to **Credentials** → Click your OAuth Client ID
2. Add to **Authorized JavaScript origins**:
   - `https://your-domain.com`
3. Add to **Authorized redirect URIs**:
   - `https://your-domain.com/api/auth/callback/google`
4. Click **Save**

### 3. Update Environment Variables

In your hosting platform (Vercel, etc.), add:
```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://your-domain.com
```

---

## 📝 Quick Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API or Identity API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID (Web application)
- [ ] Added `http://localhost:3000` to Authorized JavaScript origins
- [ ] Added `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
- [ ] Copied Client ID and Client Secret
- [ ] Added credentials to `.env.local`
- [ ] Restarted development server
- [ ] Tested Google login/signup

---

## 🎯 Summary

**What you need:**
1. **Client ID**: `xxxxx.apps.googleusercontent.com`
2. **Client Secret**: `GOCSPX-xxxxx`

**Where to add them:**
- File: `.env.local`
- Variables: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Important URLs:**
- Development redirect: `http://127.0.0.1:3000/api/auth/callback/google` (use 127.0.0.1 to avoid Google validation errors)
- Production redirect: `https://your-domain.com/api/auth/callback/google`

---

## 📧 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Verify all URLs match exactly (no typos, correct protocol)
3. Make sure you restarted the server after adding env variables
4. Check Google Cloud Console for any error messages

**Your email**: briefly.contact.10@gmail.com

---

## 🔗 Useful Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **NextAuth Google Provider Docs**: https://next-auth.js.org/providers/google

---

**Last Updated**: December 2024

