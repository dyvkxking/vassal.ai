// Wallet connection utilities for RainbowKit/wagmi integration
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { useMemo } from 'react'
import type { Hex } from 'viem'

// Supported chain configuration
export interface ChainConfig {
  id: number
  name: string
  rpcUrl: string
  blockExplorer: string
}

// Default supported chains
export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 101, // Somnia chain ID
    name: 'Somnia',
    rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://rpc.somnia.network',
    blockExplorer: 'https://explorer.somnia.network',
  },
]

/**
 * Get the current connected wallet address
 * Must be used within a wagmi provider context
 * @returns The connected address or null
 */
export function getConnectedWallet(): string | null {
  // This is a client-side hook usage - must be wrapped in useAccount
  // For server-side, use getWalletFromRequest in middleware
  return null // Placeholder - actual implementation uses useAccount hook in components
}

/**
 * Connect wallet using RainbowKit
 * Returns the connect function from wagmi
 */
export function useWalletConnect() {
  const { connectors, connect, isPending, error } = useConnect()

  return {
    connectors,
    connect,
    isPending,
    error,
  }
}

/**
 * Get current account state
 */
export function useWalletAccount() {
  const { address, isConnected, isConnecting, chain } = useAccount()

  return {
    address: address ?? null,
    isConnected,
    isConnecting,
    chain,
  }
}

/**
 * Disconnect wallet
 */
export function useWalletDisconnect() {
  const { disconnect, isPending, error } = useDisconnect()

  return {
    disconnect,
    isPending,
    error,
  }
}

/**
 * Switch to a required network
 */
export function useNetworkSwitch() {
  const { switchChain, chains, isPending, error } = useSwitchChain()

  return {
    switchChain,
    chains,
    isPending,
    error,
  }
}

/**
 * Check if wallet is on the correct network
 * @param targetChainId - The expected chain ID
 * @returns True if on correct network
 */
export function isOnCorrectChain(currentChainId: number | undefined, targetChainId: number): boolean {
  return currentChainId === targetChainId
}

/**
 * Format wallet address for display
 * @param address - The full address
 * @param chars - Number of chars to show at start and end
 * @returns Truncated address (e.g., 0x1234...abcd)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) {
    return address
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Validate and normalize address for storage
 * @param address - The address to validate
 * @returns Normalized address or null if invalid
 */
export function validateAndNormalizeAddress(address: string): string | null {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return null
  }
  return address.toLowerCase()
}

/**
 * Build EIP-4361 compatible sign message
 * @param address - The wallet address
 * @param domain - The domain name
 * @param uri - The URI being accessed
 * @param nonce - Unique nonce
 * @param expirationTime - When the message expires
 * @returns Formatted sign message
 */
export function buildSignMessage(
  address: string,
  domain: string,
  uri: string,
  nonce: string,
  expirationTime: string
): string {
  return `${domain} wants you to sign in with your Ethereum account:
${address}

URI: ${uri}
Version: 1
Chain ID: 101
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}
Expiration Time: ${expirationTime}`
}

/**
 * Request wallet signature
 * @param message - The message to sign
 * @returns Signature result with address or error
 */
export async function requestWalletSignature(
  message: string
): Promise<{ signature: Hex | null; address: string | null; error: string | null }> {
  // This requires wagmi's useSignMessage hook in client components
  // Placeholder for integration
  return { signature: null, address: null, error: 'Use useSignMessage hook in client component' }
}

/**
 * Get connector icon URL
 * @param connectorId - The connector ID
 * @returns Icon URL or null
 */
export function getConnectorIcon(connectorId: string): string | null {
  const icons: Record<string, string> = {
    metaMask: '/icons/metamask.png',
    walletConnect: '/icons/walletconnect.png',
    coinbase: '/icons/coinbase.png',
    rainbow: '/icons/rainbow.png',
  }
  return icons[connectorId] || null
}

/**
 * Supported wallet connectors
 */
export const WALLET_CONNECTORS = [
  { id: 'metaMask', name: 'MetaMask' },
  { id: 'walletConnect', name: 'WalletConnect' },
  { id: 'coinbase', name: 'Coinbase Wallet' },
  { id: 'rainbow', name: 'Rainbow' },
] as const

/**
 * Get all supported wallet options for RainbowKit
 */
export function getSupportedWallets() {
  return WALLET_CONNECTORS.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    iconUrl: getConnectorIcon(wallet.id),
  }))
}