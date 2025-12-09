# OpenAI API Setup Guide

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Give it a name (e.g., "Briefly AI Webapp")
6. Copy the API key immediately (you won't be able to see it again!)

## Step 2: Add API Key to Your Project

Create a `.env.local` file in the root of your project (same folder as `package.json`):

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# LemonFox API (for audio generation)
LEMONFOX_API_KEY=your-lemonfox-api-key-here
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/tts

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (optional, for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
```

**Important:** 
- Replace `sk-your-actual-api-key-here` with your actual OpenAI API key
- Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 3: Verify the Setup

The code is already configured to use `gpt-4o-mini` in:

```85:85:app/api/audio/generate/route.ts
    const model = "gpt-4o-mini" // Change to "gpt-4o" for better quality
```

## Step 4: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try uploading a document in your dashboard
3. Check the console logs - you should see:
   - "Sending prompt to OpenAI..."
   - "Summary generated successfully with gpt-4o-mini..."

## Current Model Configuration

**Currently Using:** `gpt-4o-mini`
- ✅ Fast and cost-effective
- ✅ Perfect for summaries
- ✅ ~$0.15/$0.60 per 1M tokens

**To Change Model:**

Edit `app/api/audio/generate/route.ts` line 85:

```typescript
// For faster/cheaper (current):
const model = "gpt-4o-mini"

// For better quality (more expensive):
const model = "gpt-4o"
```

## Troubleshooting

### Error: "OpenAI API key is invalid or missing"
- Check that your `.env.local` file exists in the project root
- Verify the API key starts with `sk-`
- Make sure there are no extra spaces or quotes around the key
- Restart your dev server after adding the key

### Error: "OpenAI API quota exceeded"
- Check your usage at: https://platform.openai.com/usage
- Add credits to your account: https://platform.openai.com/account/billing

### Error: "Rate limit exceeded"
- You're making too many requests too quickly
- Wait a moment and try again
- Consider upgrading your OpenAI plan

## Cost Estimation

With `gpt-4o-mini`:
- **Input:** $0.15 per 1M tokens
- **Output:** $0.60 per 1M tokens
- Average summary: ~500 tokens = **$0.0003 per summary**

Example monthly costs:
- 100 summaries/month: ~$0.03
- 1,000 summaries/month: ~$0.30
- 10,000 summaries/month: ~$3.00

## Need Help?

- OpenAI Docs: https://platform.openai.com/docs
- API Status: https://status.openai.com/
- Support: https://help.openai.com/


