# Pinata IPFS Setup Guide

To enable real IPFS uploads instead of mock data, you need to configure Pinata IPFS service.

## Step 1: Get Pinata API Keys

1. Go to [Pinata](https://app.pinata.cloud/)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy both the `API Key` and `Secret API Key`

## Step 2: Set Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here
```

## Step 3: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
```

## How It Works

The system now uses **client-side IPFS uploads** directly to Pinata:

1. **Client-side**: Form directly calls IPFS functions
2. **Direct upload**: Functions upload to Pinata using environment variables
3. **Response**: Returns the real IPFS CID directly

This approach ensures:
- ✅ Direct IPFS uploads without API route overhead
- ✅ Real-time upload progress
- ✅ Immediate CID response

## What Gets Uploaded to IPFS

### Aadhar Number Data
When you submit a claim, the Aadhar number is stored on IPFS with this structure:

```json
{
  "aadharNumber": "123456789012",
  "userId": "demo-victim-123",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "claimType": "disaster_relief",
  "disasterType": "flood",
  "location": "Kerala, India"
}
```

### File Uploads
Supporting documents currently return mock CIDs (file uploads will be implemented in the next update).

## Verification

After setup:
1. Submit a claim with an Aadhar number
2. Check your Pinata dashboard - you should see the uploaded data
3. The console will show real CIDs instead of mock ones
4. You can view the data using the IPFS gateway: `https://gateway.pinata.cloud/ipfs/{CID}`

## Troubleshooting

### Common Issues:
1. **"Pinata upload failed"** - Check your API keys are correct
2. **"Failed to upload to IPFS"** - Verify your Pinata account has upload credits
3. **Environment variables not working** - Restart your dev server after adding them

### Check API Keys:
- Verify keys in Pinata dashboard
- Ensure keys have upload permissions
- Check if your account has available upload credits

## Security Notes

- Never commit `.env.local` to version control
- API keys are exposed to the client (NEXT_PUBLIC_ prefix)
- For production, consider using a backend API to handle IPFS uploads
- Pinata API keys should be kept secure and not shared publicly
