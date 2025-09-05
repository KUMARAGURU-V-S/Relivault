"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  balance: string
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  loading: boolean
  error: string | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [chainId, setChainId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isConnected = !!account

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Get account balance
  const getBalance = async (address: string) => {
    if (!window.ethereum) return '0'
    
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      
      // Convert from wei to ETH
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18)
      return balanceInEth.toFixed(4)
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAccount(account)
        
        // Get balance
        const balance = await getBalance(account)
        setBalance(balance)

        // Get chain ID
        const chainId = await window.ethereum.request({
          method: 'eth_chainId'
        })
        setChainId(parseInt(chainId, 16))

        // Store in localStorage
        localStorage.setItem('web3_account', account)
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error)
      setError(error.message || 'Failed to connect to MetaMask')
    } finally {
      setLoading(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setBalance('0')
    setChainId(null)
    setError(null)
    localStorage.removeItem('web3_account')
  }

  // Check for existing connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })

        if (accounts.length > 0) {
          const account = accounts[0]
          setAccount(account)
          
          const balance = await getBalance(account)
          setBalance(balance)

          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          })
          setChainId(parseInt(chainId, 16))
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAccount(accounts[0])
        getBalance(accounts[0]).then(setBalance)
      }
    }

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const value: Web3ContextType = {
    account,
    isConnected,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    loading,
    error
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}