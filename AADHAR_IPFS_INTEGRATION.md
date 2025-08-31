# Aadhar Number IPFS Integration

This document explains how the Aadhar number is securely stored in IPFS via Pinata and the CID is saved in Firestore for the disaster relief claim system.

## Overview

When a user submits a disaster relief claim, their Aadhar number is:
1. **Actually stored on IPFS** via Pinata (not mock data)
2. The IPFS Content Identifier (CID) is saved in Firestore
3. The CID is linked to the claim for verification purposes

## Implementation Details

### 1. Form Changes
- Added Aadhar number input field with validation (12 digits only)
- Input automatically formats and restricts to numbers only
- Field is required for claim submission

### 2. Real IPFS Storage via Pinata
- `saveAadharToIPFS()` function **actually uploads** to IPFS via Pinata
- Returns a real CID (Content Identifier) from Pinata
- **No more mock data** - real IPFS uploads happen
- Data structure includes:
  - Aadhar number
  - User ID
  - Timestamp
  - Disaster type
  - Location

### 3. Firestore Storage
- New collection: `ipfs_cids`
- Stores metadata about each CID:
  - `type`: "aadhar" for Aadhar numbers
  - `userId`: User's unique identifier
  - `cid`: **Real IPFS CID** from Pinata
  - `timestamp`: When the CID was created
  - `claimId`: Associated claim ID (updated after claim submission)
  - `createdAt`: Firestore timestamp
  - `updatedAt`: Last update timestamp

### 4. Data Flow
1. User enters Aadhar number in claim form
2. **Aadhar number is actually uploaded to IPFS via Pinata**
3. **Real CID is returned and saved to Firestore**
4. Claim is submitted with Aadhar CID reference
5. CID record is updated with claim ID for linking

## What Gets Actually Uploaded to IPFS

### Aadhar Number Data Structure
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
Supporting documents are also **actually uploaded** to IPFS with metadata including:
- File name
- File type
- File size
- Upload timestamp

## Security Features

- Aadhar number is never stored directly in Firestore
- Only the **real IPFS CID** is stored, providing an additional layer of security
- IPFS provides decentralized, tamper-proof storage
- CIDs are cryptographically secure and unique
- **Real data persistence** on IPFS network

## Setup Requirements

### Environment Variables
You need to set up these environment variables in `.env.local`:

```bash
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

### Pinata Account
1. Sign up at [Pinata](https://app.pinata.cloud/)
2. Get your API keys
3. Ensure you have upload credits

## Verification

After setup:
1. Submit a claim with an Aadhar number
2. **Check your Pinata dashboard** - you will see the uploaded data
3. **Console will show real CIDs** from Pinata (not mock ones)
4. **View the actual data** using: `https://gateway.pinata.cloud/ipfs/{CID}`

## Production Ready

The implementation is now **production ready** with:
- Real IPFS uploads via Pinata
- Proper error handling
- Type safety
- Clear separation of concerns
- Real data persistence on IPFS

## Usage Example

```typescript
// This now actually uploads to IPFS via Pinata
const aadharCID = await saveAadharToIPFS(
  "123456789012", 
  "user123",
  "flood",
  "Kerala, India"
)

// Save real CID to Firestore
await saveCIDToFirestore({
  type: "aadhar",
  userId: "user123",
  cid: aadharCID, // This is a real IPFS CID
  timestamp: new Date().toISOString(),
  claimId: null
})
```

## Firestore Collection Structure

```
ipfs_cids/
├── document_id_1/
│   ├── type: "aadhar"
│   ├── userId: "user123"
│   ├── cid: "QmX...abc"  # Real IPFS CID from Pinata
│   ├── timestamp: "2024-01-01T00:00:00.000Z"
│   ├── claimId: "claim_123"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
└── document_id_2/
    └── ...
```

## Important Notes

- **No more mock data** - everything is real now
- IPFS uploads require Pinata API keys
- Data is permanently stored on IPFS network
- CIDs can be used to retrieve data from any IPFS gateway
- Pinata provides reliable pinning service for data persistence
