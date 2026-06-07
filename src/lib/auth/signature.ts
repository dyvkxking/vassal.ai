// Wallet signature verification using EIP-191
import { recoverMessageAddress } from 'viem'

/**
 * Hash a message using keccak256
 * @param plaintext - The message to hash
 * @returns The keccak256 hash as a hex string
 */
export async function hashMessage(plaintext: string): Promise<string> {
  const encoded = new TextEncoder().encode(plaintext)
  // Use viem's encodeAbiParameters for consistent hashing
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Create a login message with nonce for wallet authentication
 * @param address - The wallet address
 * @param nonce - Unique nonce (optional, generated if not provided)
 * @returns The login message string
 */
export function createLoginMessage(address: string, nonce?: string): string {
  const timestamp = Date.now()
  const nonceValue = nonce || generateNonce()
  const domain = 'vassal.ai'

  const message = [
    `Welcome to ${domain}!`,
    '',
    `Address: ${address}`,
    `Nonce: ${nonceValue}`,
    `Timestamp: ${timestamp}`,
    '',
    'Sign this message to authenticate. This will not cost any gas.',
  ].join('\n')

  return message
}

/**
 * Generate a unique nonce
 * @returns A random 32-character hex string
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

/**
 * Verify a wallet signature using EIP-191
 * @param message - The original message that was signed
 * @param address - The claimed address (checksummed)
 * @param signature - The signature (65 bytes, r + s + v)
 * @returns True if signature is valid and matches address
 */
export async function verifyWalletSignature(
  message: string,
  address: string,
  signature: string
): Promise<boolean> {
  try {
    // Recover the address from signature using viem's recoverMessageAddress
    const recoveredAddress = await recoverMessageAddress({
      message,
      signature: signature as `0x${string}`,
    })

    if (!recoveredAddress) {
      return false
    }

    // Normalize addresses for comparison (lowercase)
    const normalizedRecovered = recoveredAddress.toLowerCase()
    const normalizedAddress = address.toLowerCase()

    return normalizedRecovered === normalizedAddress
  } catch {
    return false
  }
}

/**
 * Verify a login message signature
 * @param message - The login message
 * @param address - The wallet address
 * @param signature - The signature
 * @returns True if the signature is valid
 */
export async function verifyLoginMessage(
  message: string,
  address: string,
  signature: string
): Promise<boolean> {
  return verifyWalletSignature(message, address, signature)
}

/**
 * Validate an Ethereum address format
 * @param address - The address to validate
 * @returns True if valid format (0x + 40 hex chars)
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Normalize an Ethereum address to lowercase
 * @param address - The address to normalize
 * @returns Lowercase address
 */
export function normalizeAddress(address: string): string {
  return address.toLowerCase()
}