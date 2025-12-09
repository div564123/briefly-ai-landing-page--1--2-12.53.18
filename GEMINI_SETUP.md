# Gemini API Setup Guide

## Problem: "Gemini model not available" Error

If you're getting this error, follow these steps:

## Step 1: Verify Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check if your API key is valid and active
3. Make sure it's copied correctly in your `.env.local` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Step 2: Enable Generative AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services** > **Library**
4. Search for "**Generative Language API**"
5. Click **Enable**

## Step 3: Check API Quotas

1. In Google Cloud Console, go to **APIs & Services** > **Quotas**
2. Search for "Generative Language API"
3. Make sure you have quota available
4. If needed, request quota increase

## Step 4: Verify Model Access

The models you need access to:
- `gemini-1.5-flash` (recommended - fastest)
- `gemini-1.5-pro` (better quality)
- `gemini-pro` (legacy)

## Step 5: Test Your API Key

Run this in your terminal to test:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual key. You should see a list of available models.

## Step 6: Alternative - Use a Different Model

If the above models don't work, check your server logs. The code will now show you which models ARE available.

## Common Issues:

1. **"API key not valid"** → Regenerate your API key in Google AI Studio
2. **"Quota exceeded"** → Wait or upgrade your Google Cloud plan
3. **"Model not found"** → Enable Generative Language API in Google Cloud Console
4. **"Permission denied"** → Check API restrictions in Google Cloud Console

## Quick Fix:

1. Get a new API key from: https://makersuite.google.com/app/apikey
2. Update `.env.local` with the new key
3. Restart your dev server: `npm run dev`



