# Environment Variables for Netlify

## Required Environment Variables

Add these in **Netlify Dashboard** → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**:

### Critical (Required for App to Work):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-site-name.netlify.app
OPENAI_API_KEY=sk-your-openai-api-key
LEMONFOX_API_KEY=your-lemonfox-api-key
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
```

### Optional (For Payments):

```
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

## How to Generate NEXTAUTH_SECRET

Run this command:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

## Important Notes

1. **DATABASE_URL**: Must be PostgreSQL (not SQLite)
   - Get from Supabase, Neon, or Railway
   - Format: `postgresql://user:password@host:5432/dbname`

2. **NEXTAUTH_URL**: 
   - Initially: `https://your-site-name.netlify.app`
   - Update if you add a custom domain

3. **All variables are case-sensitive**
   - Match exact names shown above

4. **No quotes needed** in Netlify dashboard
   - Just paste the value directly

## After Adding Variables

1. **Redeploy** your site (Netlify will auto-redeploy)
2. **Test** all features
3. **Check logs** if anything fails



































