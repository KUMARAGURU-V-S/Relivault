// lib/ipfs.ts - Securely interacts with the backend API for IPFS operations.

import { AadharIPFSData, IPFSMetadata } from "./types";

/**
 * Securely saves Aadhar data to IPFS by sending it to our own backend API.
 * The backend then communicates with Pinata.
 * @param aadharNumber The user's Aadhar number.
 * @param userId The user's ID.
 * @param disasterType The type of disaster for context.
 * @param location The location for context.
 * @returns The IPFS CID (Content Identifier) of the saved data.
 */
export async function saveAadharToIPFS(aadharNumber: string, userId: string, disasterType?: string, location?: string): Promise<string> {
  try {
    // This fetch call goes to our OWN backend API route (/api/ipfs)
    const response = await fetch('/api/ipfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'aadhar',
        data: { aadharNumber, userId, disasterType, location },
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to save Aadhar data to IPFS via the backend.');
    }

    console.log(`Aadhar number securely saved to IPFS with CID: ${result.cid}`);
    return result.cid;

  } catch (error) {
    console.error('Error saving Aadhar to IPFS:', error);
    // Re-throw the error to be caught by the calling component (e.g., claim-form)
    if (error instanceof Error) {
      throw new Error(`Failed to save Aadhar to IPFS: ${error.message}`);
    } else {
      throw new Error(`Failed to save Aadhar to IPFS: ${String(error)}`);
    }
  }
}

/**
 * NOTE: Direct file upload to IPFS from the client is insecure.
 * This function needs to be refactored to send the file to our backend for secure processing.
 * For now, this functionality is disabled in the claim form.
 */
export async function uploadFileToPinata(file: File): Promise<string> {
  console.error("INSECURE FUNCTION CALLED: uploadFileToPinata. This needs to be refactored.");
  throw new Error("Direct file upload is disabled for security reasons. Please implement a backend route for file uploads.");
  
  // The original insecure code is left here for reference during refactoring,
  // but it will not be executed.
  /*
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
    
    if (!apiKey || !secretKey) {
      throw new Error('Pinata API keys are not configured for client-side upload.');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = {
      name: file.name,
      description: `File uploaded for disaster relief claim: ${file.name}`,
    };
    
    formData.append('pinataMetadata', JSON.stringify(metadata));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pinata file upload failed: ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error(`Failed to upload file to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  */
}