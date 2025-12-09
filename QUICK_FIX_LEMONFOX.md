# Quick Fix: LemonFox API Key Error

## The Problem
You're seeing this error:
```
LemonFox API key is not configured. Please add LEMONFOX_API_KEY to .env.local with your actual API key from LemonFox
```

## The Solution

### Step 1: Get Your LemonFox API Key
1. Go to your LemonFox account dashboard
2. Navigate to API settings or API keys section
3. Copy your API key

### Step 2: Update .env.local

Open `.env.local` in your project root and find this line:

```bash
LEMONFOX_API_KEY=your-lemonfox-api-key-here
```

Replace `your-lemonfox-api-key-here` with your actual API key:

```bash
LEMONFOX_API_KEY=your-actual-api-key-from-lemonfox
```

**Important:**
- No quotes around the key
- No spaces before or after the `=`
- Make sure the key is on a single line

### Step 3: Restart Your Server

**This is critical!** Environment variables are only loaded when the server starts.

1. Stop your current server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Test

Try generating audio again. The error should be gone if:
- ✅ Your API key is correct
- ✅ The server was restarted
- ✅ No extra spaces/quotes in .env.local

## Troubleshooting

### Still getting the error after restarting?

1. **Check the key is correct:**
   ```bash
   cat .env.local | grep LEMONFOX_API_KEY
   ```
   Should show your actual key, not the placeholder

2. **Verify no extra characters:**
   - No quotes: `LEMONFOX_API_KEY="key"` ❌
   - No spaces: `LEMONFOX_API_KEY = key` ❌
   - Correct: `LEMONFOX_API_KEY=key` ✅

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check if the key is valid:**
   - Log in to LemonFox dashboard
   - Verify the API key is active
   - Check if there are any usage limits

## Example .env.local

Your `.env.local` should look like this:

```bash
NEXTAUTH_SECRET=my-dev-secret-1234567890-please-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

OPENAI_API_KEY=sk-proj-your-openai-key-here

LEMONFOX_API_KEY=your-actual-lemonfox-api-key-here
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/tts

STRIPE_SECRET_KEY=sk_live_your-stripe-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

## Need Help?

If you still have issues:
1. Check LemonFox documentation for API key format
2. Verify your LemonFox account is active
3. Check your API usage limits in LemonFox dashboard

