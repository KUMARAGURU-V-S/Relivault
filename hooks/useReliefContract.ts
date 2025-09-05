"use client"

import { useState, useEffect } from 'react'
import { useWeb3 } from '@/contexts/Web3Context'

// Contract ABI (simplified for key functions)
const RELIEF_CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "requested", "type": "uint256" }, { "internalType": "string", "name": "docsIpfs", "type": "string" }],
    "name": "submitClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "getClaim",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "enum EfficientDisasterRelief.ClaimStatus", "name": "", "type": "uint8" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "bool", "name": "", "type": "bool" },
      { "internalType": "bool", "name": "", "type": "bool" },
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint32", "name": "", "type": "uint32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getClaimIds",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "victim", "type": "address" }],
    "name": "isVerifiedVictim",
    "outputs": [{ "internalType": "bool", "name": "isVerified", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "claimId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "claimant", "type": "address" }
    ],
    "name": "ClaimSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "claimId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "FundsDisbursed",
    "type": "event"
  }
]

// Contract address (you'll need to update this with your deployed contract address)
const RELIEF_CONTRACT_ADDRESS = "0x..." // Replace with actual deployed contract address

export interface Claim {
  id: number
  claimant: string
  requested: string
  approved: string
  status: number // 0: PENDING, 1: APPROVED, 2: REJECTED, 3: DISBURSED
  docsIpfs: string
  cidValidated: boolean
  addressVerified: boolean
  ngoVerifier: string
  validationTimestamp: number
}

export function useReliefContract() {
  const { account, isConnected } = useWeb3()
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize contract
  useEffect(() => {
    if (isConnected && window.ethereum) {
      try {
        const contractInstance = new window.ethereum.Contract(
          RELIEF_CONTRACT_ABI,
          RELIEF_CONTRACT_ADDRESS
        )
        setContract(contractInstance)
      } catch (err) {
        console.error('Error initializing contract:', err)
        setError('Failed to initialize contract')
      }
    }
  }, [isConnected])

  // Submit a claim to the smart contract
  const submitClaim = async (requestedAmount: string, ipfsCid: string) => {
    if (!contract || !account) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      // Convert amount to wei (assuming amount is in ETH)
      const amountInWei = window.ethereum.utils.toWei(requestedAmount, 'ether')

      const transaction = await contract.methods.submitClaim(amountInWei, ipfsCid).send({
        from: account,
        gas: 300000 // Adjust gas limit as needed
      })

      return transaction
    } catch (err: any) {
      console.error('Error submitting claim:', err)
      setError(err.message || 'Failed to submit claim')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get user's claims
  const getUserClaims = async (userAddress?: string) => {
    if (!contract) return []

    const address = userAddress || account
    if (!address) return []

    try {
      const claimIds = await contract.methods.getClaimIds(address).call()
      const claims: Claim[] = []

      for (const claimId of claimIds) {
        const claimData = await contract.methods.getClaim(claimId).call()
        claims.push({
          id: parseInt(claimId),
          claimant: claimData[0],
          requested: window.ethereum.utils.fromWei(claimData[1], 'ether'),
          approved: window.ethereum.utils.fromWei(claimData[2], 'ether'),
          status: parseInt(claimData[3]),
          docsIpfs: claimData[4],
          cidValidated: claimData[5],
          addressVerified: claimData[6],
          ngoVerifier: claimData[7],
          validationTimestamp: parseInt(claimData[8])
        })
      }

      return claims
    } catch (err) {
      console.error('Error getting user claims:', err)
      return []
    }
  }

  // Check if user is verified victim
  const isVerifiedVictim = async (address?: string) => {
    if (!contract) return false

    const userAddress = address || account
    if (!userAddress) return false

    try {
      return await contract.methods.isVerifiedVictim(userAddress).call()
    } catch (err) {
      console.error('Error checking verification status:', err)
      return false
    }
  }

  // Get contract balance
  const getContractBalance = async () => {
    if (!contract) return '0'

    try {
      const balance = await contract.methods.contractBalance().call()
      return window.ethereum.utils.fromWei(balance, 'ether')
    } catch (err) {
      console.error('Error getting contract balance:', err)
      return '0'
    }
  }

  // Get claim status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Pending'
      case 1: return 'Approved'
      case 2: return 'Rejected'
      case 3: return 'Disbursed'
      default: return 'Unknown'
    }
  }

  return {
    contract,
    submitClaim,
    getUserClaims,
    isVerifiedVictim,
    getContractBalance,
    getStatusText,
    loading,
    error,
    isConnected: isConnected && !!contract
  }
}