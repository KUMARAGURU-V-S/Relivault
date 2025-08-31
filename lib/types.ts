export interface ClaimFormData {
  disasterType: string
  description: string
  requestedAmount: string
  location: string
  aadharNumber: string
  documents: File[]
}

export interface ClaimSubmissionData {
  userId: string
  disasterType: string
  description: string
  requestedAmount: number
  location: string
  coordinates: { lat: number; lng: number } | null
  documentHashes: string[]
  aadharCID: string | null
  status: string
}

export interface CIDData {
  type: string
  userId: string
  cid: string
  timestamp: string
  claimId: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface ClaimResult {
  claimId: string
}
