'use client'
import { useState, useCallback } from 'react'

interface WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
}

type WalletType = 'metamask' | 'walletconnect' | 'coinbase'

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
  })

  const connect = useCallback(async (walletType: WalletType) => {
    try {
      // Mock connect - in real implementation this would use wagmi/rainbowkit
      setWallet({ address: '0x1234...abcd', isConnected: true, chainId: 1 })
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet({ address: null, isConnected: false, chainId: null })
  }, [])

  return { ...wallet, connect, disconnect }
}