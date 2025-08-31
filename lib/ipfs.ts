// IPFS service for uploading data to Pinata
// You'll need to set these environment variables:
// PINATA_API_KEY=your_pinata_api_key
// PINATA_SECRET_API_KEY=your_pinata_secret_key

import { IPFSMetadata, AadharIPFSData } from "./types"

export async function uploadToPinata(data: any, metadata?: IPFSMetadata): Promise<string> {
  try {
    // Prepare the data for IPFS
    const ipfsData = {
      pinataMetadata: metadata || {
        name: "Disaster Relief Data",
        description: "Data uploaded for disaster relief claim"
      },
      pinataContent: data
    }

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.PINATA_API_KEY || '',
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY || ''
      },
      body: JSON.stringify(ipfsData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Pinata upload failed: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()
    console.log('Successfully uploaded to IPFS:', result)
    
    return result.IpfsHash // This is the CID
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function uploadFileToPinata(file: File): Promise<string> {
  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', file)
    
    // Add metadata
    const metadata = {
      name: file.name,
      description: `File uploaded for disaster relief claim: ${file.name}`,
      attributes: [
        {
          trait_type: "File Type",
          value: file.type
        },
        {
          trait_type: "File Size",
          value: `${(file.size / 1024).toFixed(2)} KB`
        }
      ]
    }
    
    formData.append('pinataMetadata', JSON.stringify(metadata))

    // Upload file to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY || '',
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY || ''
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Pinata file upload failed: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()
    console.log('Successfully uploaded file to IPFS:', result)
    
    return result.IpfsHash // This is the CID
  } catch (error) {
    console.error('Error uploading file to IPFS:', error)
    throw new Error(`Failed to upload file to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function saveAadharToIPFS(aadharNumber: string, userId: string, disasterType?: string, location?: string): Promise<string> {
  try {
    // Create structured data for Aadhar
    const aadharData: AadharIPFSData = {
      aadharNumber,
      userId,
      timestamp: new Date().toISOString(),
      claimType: "disaster_relief",
      disasterType,
      location
    }

    // Create metadata for the IPFS content
    const metadata: IPFSMetadata = {
      name: "Aadhar Verification Data",
      description: "Aadhar number verification data for disaster relief claim",
      attributes: [
        {
          trait_type: "Data Type",
          value: "Aadhar Verification"
        },
        {
          trait_type: "Claim Type",
          value: "Disaster Relief"
        },
        {
          trait_type: "Timestamp",
          value: new Date().toISOString()
        }
      ]
    }

    // Upload to IPFS via Pinata
    const cid = await uploadToPinata(aadharData, metadata)
    console.log(`Aadhar number saved to IPFS with CID: ${cid}`)
    
    return cid
  } catch (error) {
    console.error('Error saving Aadhar to IPFS:', error)
    throw new Error(`Failed to save Aadhar to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Function to retrieve data from IPFS using CID
export async function getDataFromIPFS(cid: string): Promise<any> {
  try {
    // You can use any IPFS gateway, here using Pinata's gateway
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from IPFS: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error)
    throw new Error(`Failed to retrieve data from IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
