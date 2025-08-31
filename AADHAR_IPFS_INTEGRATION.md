# Aadhar Number IPFS Integration

This document explains how the Aadhar number is securely stored in IPFS and the CID is saved in Firestore for the disaster relief claim system.

## Overview

When a user submits a disaster relief claim, their Aadhar number is:
1. Stored securely on IPFS (InterPlanetary File System)
2. The IPFS Content Identifier (CID) is saved in Firestore
3. The CID is linked to the claim for verification purposes

## Implementation Details

### 1. Form Changes
- Added Aadhar number input field with validation (12 digits only)
- Input automatically formats and restricts to numbers only
- Field is required for claim submission

### 2. IPFS Storage
- `saveAadharToIPFS()` function handles storing Aadhar number on IPFS
- Returns a unique CID (Content Identifier)
- Currently mocked for development, but ready for production IPFS integration

### 3. Firestore Storage
- New collection: `ipfs_cids`
- Stores metadata about each CID:
  - `type`: "aadhar" for Aadhar numbers
  - `userId`: User's unique identifier
  - `cid`: IPFS Content Identifier
  - `timestamp`: When the CID was created
  - `claimId`: Associated claim ID (updated after claim submission)
  - `createdAt`: Firestore timestamp
  - `updatedAt`: Last update timestamp

### 4. Data Flow
1. User enters Aadhar number in claim form
2. Aadhar number is uploaded to IPFS
3. CID is saved to Firestore with initial data
4. Claim is submitted with Aadhar CID reference
5. CID record is updated with claim ID for linking

## Security Features

- Aadhar number is never stored directly in Firestore
- Only the IPFS CID is stored, providing an additional layer of security
- IPFS provides decentralized, tamper-proof storage
- CIDs are cryptographically secure and unique

## Production Considerations

- Replace mock IPFS functions with actual IPFS client (e.g., Pinata, Infura IPFS)
- Implement proper error handling for IPFS upload failures
- Add retry mechanisms for network issues
- Consider implementing IPFS pinning services for data persistence
- Add encryption for sensitive data before IPFS upload

## Usage Example

```typescript
// Save Aadhar to IPFS
const aadharCID = await saveAadharToIPFS("123456789012")

// Save CID to Firestore
await saveCIDToFirestore({
  type: "aadhar",
  userId: "user123",
  cid: aadharCID,
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
│   ├── cid: "QmX...abc"
│   ├── timestamp: "2024-01-01T00:00:00.000Z"
│   ├── claimId: "claim_123"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
└── document_id_2/
    └── ...
```
