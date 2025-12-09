# LemonFox TTS Setup Guide

This guide will help you set up LemonFox for text-to-speech generation.

## Step 1: Get Your LemonFox API Key

1. Sign up or log in to your LemonFox account
2. Navigate to your API settings/dashboard
3. Generate or copy your API key
4. Keep it secure - you'll need it for the next step

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# LemonFox TTS API
LEMONFOX_API_KEY=your-api-key-here
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/tts  # Optional, defaults to this URL
```

**Important:** Never commit these credentials to version control!

## Step 3: Available Voices

The application uses these LemonFox voice mappings:

- **Sarah** → `alloy` (Clear & Professional)
- **Emma** → `echo` (Warm & Friendly)
- **Olivia** → `fable` (Energetic & Young)
- **James** → `onyx` (Deep & Authoritative)
- **Liam** → `nova` (Calm & Soothing)
- **Noah** → `shimmer` (Confident & Clear)

**Note:** Adjust these voice IDs in `app/api/audio/generate/route.ts` based on the actual voices available in your LemonFox account.

## Step 4: API Endpoint Configuration

The default API endpoint is:
```
https://api.lemonfox.ai/v1/tts
```

If your LemonFox API uses a different endpoint, update `LEMONFOX_API_URL` in `.env.local`.

## Step 5: API Request Format

The application sends requests in this format:

```json
{
  "text": "Your text to convert to speech",
  "voice": "alloy",
  "format": "mp3"
}
```

## Step 6: Testing

1. Restart your Next.js development server
2. Try generating audio from the dashboard
3. Check the console for any LemonFox-related errors

## Troubleshooting

### Error: "LemonFox API key is invalid or missing"
- Check that `LEMONFOX_API_KEY` is set in `.env.local`
- Verify there are no extra spaces or quotes around the key
- Restart your server after adding the key

### Error: "LemonFox API quota exceeded"
- Check your LemonFox account usage/limits
- Verify your subscription plan
- Wait for quota reset or upgrade your plan

### Error: "Invalid voice ID"
- Verify the voice IDs match those available in your LemonFox account
- Update the voice mapping in `getVoiceIdFromTone()` function if needed
- Check LemonFox documentation for available voices

### Error: "Failed to generate audio"
- Check your internet connection
- Verify the API endpoint URL is correct
- Check LemonFox service status
- Review error logs in the console for more details

## Customizing Voice Mapping

To change which voices are used, edit the `getVoiceIdFromTone()` function in `app/api/audio/generate/route.ts`:

```typescript
function getVoiceIdFromTone(voiceName: string): string {
  const voiceMap: Record<string, string> = {
    sarah: "your-voice-id-here",
    emma: "your-voice-id-here",
    // ... etc
  }
  return voiceMap[voiceName.toLowerCase()] || voiceMap.sarah
}
```

## API Response Format

LemonFox should return audio data as:
- **Content-Type**: `audio/mpeg` or `audio/mp3`
- **Body**: Binary audio data (MP3 format)

## Security Best Practices

1. **Never commit credentials** to version control
2. Use **environment variables** for all API keys
3. **Rotate API keys** regularly
4. Monitor **API usage** to detect unusual activity
5. Use **least privilege** - only grant necessary permissions

## Migration from AWS Polly

The code has been updated to use LemonFox. Simply:
1. Remove AWS credentials from `.env.local`:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
2. Add LemonFox credentials:
   - `LEMONFOX_API_KEY`
   - `LEMONFOX_API_URL` (optional)
3. Restart your server

All existing voice selections will automatically map to LemonFox voices.

## Support

For LemonFox-specific issues:
- Check [LemonFox Documentation](https://docs.lemonfox.ai)
- Contact LemonFox support
- Review your LemonFox dashboard for usage and limits

