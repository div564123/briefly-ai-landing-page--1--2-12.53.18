# AWS Polly Setup Guide

This guide was for AWS Polly setup. The project now uses LemonFox for text-to-speech generation. See LEMONFOX_SETUP.md for current setup instructions.

## Prerequisites

1. An AWS account
2. AWS IAM user with Amazon Polly permissions

## Step 1: Create IAM User and Access Keys

1. Go to AWS Console → IAM → Users
2. Click "Create user"
3. Enter a username (e.g., `briefly-polly-user`)
4. Select "Provide user access to the AWS Management Console" (optional)
5. Click "Next"
6. Under "Set permissions", select "Attach policies directly"
7. Search for and select `AmazonPollyFullAccess` (or create a custom policy with minimal permissions)
8. Click "Next" → "Create user"
9. Go to the "Security credentials" tab
10. Click "Create access key"
11. Select "Application running outside AWS"
12. Copy the **Access Key ID** and **Secret Access Key** (you won't be able to see the secret key again)

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# AWS Credentials for Polly
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-east-1  # or your preferred region (us-west-2, eu-west-1, etc.)
```

**Important:** Never commit these credentials to version control!

## Step 3: AWS Polly Pricing

AWS Polly pricing is very competitive:
- **Neural voices**: $4.00 per 1 million characters
- **Standard voices**: $4.00 per 1 million characters
- First 5 million characters per month are free (for first 12 months)

Compare to ElevenLabs which can be $5-30+ per month depending on usage.

## Step 4: Available Voices

The application uses these AWS Polly voices:

- **Sarah** → `Joanna` (US English, Female, Neural)
- **Emma** → `Amy` (British English, Female, Neural)
- **Olivia** → `Ivy` (US English, Female, Neural)
- **James** → `Matthew` (US English, Male, Neural)
- **Liam** → `Brian` (British English, Male, Neural)
- **Noah** → `Joey` (US English, Male, Neural)

All voices use the **Neural engine** for high-quality output.

## Step 5: API Gateway Route Selection Expression

If you're creating an AWS API Gateway WebSocket API, use this route selection expression:

```json
$request.body.action
```

Or if you prefer routing by route field:

```json
$request.body.route
```

For REST APIs, route selection expressions are not needed.

### Example WebSocket API Setup:

1. Create WebSocket API in API Gateway
2. Set **Route Selection Expression** to: `$request.body.action`
3. Create routes:
   - `$connect` - Connection route
   - `$disconnect` - Disconnection route
   - `generateAudio` - Your custom route (matches `action: "generateAudio"` in request body)
   - `$default` - Default route for unmatched actions

### Example Request Body:

```json
{
  "action": "generateAudio",
  "text": "Hello, this is a test",
  "voiceId": "Joanna"
}
```

## Step 6: Testing

1. Restart your Next.js development server
2. Try generating audio from the dashboard
3. Check the console for any AWS-related errors

## Troubleshooting

### Error: "InvalidSignatureException"
- Check that your AWS credentials are correct
- Ensure there are no extra spaces in `.env.local`

### Error: "AccessDeniedException"
- Verify your IAM user has `AmazonPollyFullAccess` or equivalent permissions
- Check that the policy is attached to the user

### Error: "InvalidParameterException"
- Verify the voice ID is valid (see Step 4)
- Check that the text is not empty

### High Costs
- Monitor usage in AWS Cost Explorer
- Consider using standard voices instead of neural (modify `Engine: "neural"` to `Engine: "standard"` in the code)
- Set up AWS billing alerts

## Security Best Practices

1. **Never commit credentials** to version control
2. Use **IAM roles** instead of access keys when running on AWS infrastructure
3. **Rotate access keys** regularly
4. Use **least privilege** IAM policies (only grant necessary permissions)
5. Enable **AWS CloudTrail** to monitor API usage

## Migration from ElevenLabs

The code has been updated to use AWS Polly. Simply:
1. Remove `ELEVENLABS_API_KEY` from `.env.local`
2. Add AWS credentials as shown in Step 2
3. Restart your server

All existing voice selections will automatically map to AWS Polly voices.

