import type { StakePosition, UnlockRequest } from '@/types'
import { MOCK_STAKE_POSITIONS } from '@/lib/mock-data'

// ============ IN-MEMORY STORES ============

export interface UserBalance {
  address: string
  freeBalance: number
  lockedBalance: number
}

// User balances store (address -> balance)
const balancesStore: Map<string, UserBalance> = new Map([
  ['0x1234...abcd', { address: '0x1234...abcd', freeBalance: 10000, lockedBalance: 0 }],
  ['0x5678...efgh', { address: '0x5678...efgh', freeBalance: 5000, lockedBalance: 0 }],
  ['0x9abc...ijkl', { address: '0x9abc...ijkl', freeBalance: 8000, lockedBalance: 0 }],
  ['0xdef0...mnop', { address: '0xdef0...mnop', freeBalance: 12000, lockedBalance: 0 }],
])

// Stake positions store
let stakePositionsStore: StakePosition[] = [...MOCK_STAKE_POSITIONS]

// Unlock requests store
let unlockRequestsStore: UnlockRequest[] = []

// ============ BALANCE HELPERS ============

export function getUserBalance(address: string): UserBalance | undefined {
  return balancesStore.get(address)
}

export function getOrCreateBalance(address: string): UserBalance {
  let balance = balancesStore.get(address)
  if (!balance) {
    balance = { address, freeBalance: 0, lockedBalance: 0 }
    balancesStore.set(address, balance)
  }
  return balance
}

export function updateBalance(address: string, freeDelta: number, lockedDelta: number): void {
  const balance = getOrCreateBalance(address)
  balance.freeBalance = Math.max(0, balance.freeBalance + freeDelta)
  balance.lockedBalance = Math.max(0, balance.lockedBalance + lockedDelta)
}

// ============ STAKE POSITION HELPERS ============

export function getStakePositionsByOwner(address: string): StakePosition[] {
  return stakePositionsStore.filter((p) => p.owner === address)
}

export function getStakePositionById(id: string): StakePosition | undefined {
  return stakePositionsStore.find((p) => p.id === id)
}

export function addStakePosition(position: StakePosition): void {
  stakePositionsStore.push(position)
}

export function updateStakePosition(id: string, updates: Partial<StakePosition>): StakePosition | undefined {
  const index = stakePositionsStore.findIndex((p) => p.id === id)
  if (index === -1) return undefined
  stakePositionsStore[index] = { ...stakePositionsStore[index], ...updates }
  return stakePositionsStore[index]
}

export function deleteStakePosition(id: string): boolean {
  const index = stakePositionsStore.findIndex((p) => p.id === id)
  if (index === -1) return false
  stakePositionsStore.splice(index, 1)
  return true
}

// ============ UNLOCK REQUEST HELPERS ============

export function getUnlockRequestsByOwner(address: string): UnlockRequest[] {
  return unlockRequestsStore.filter((r) => r.owner === address)
}

export function getUnlockRequestById(id: string): UnlockRequest | undefined {
  return unlockRequestsStore.find((r) => r.id === id)
}

export function addUnlockRequest(request: UnlockRequest): void {
  unlockRequestsStore.push(request)
}

export function updateUnlockRequest(id: string, updates: Partial<UnlockRequest>): UnlockRequest | undefined {
  const index = unlockRequestsStore.findIndex((r) => r.id === id)
  if (index === -1) return undefined
  unlockRequestsStore[index] = { ...unlockRequestsStore[index], ...updates }
  return unlockRequestsStore[index]
}

export function deleteUnlockRequest(id: string): boolean {
  const index = unlockRequestsStore.findIndex((r) => r.id === id)
  if (index === -1) return false
  unlockRequestsStore.splice(index, 1)
  return true
}

// Process ready unlocks (call periodically or on access)
export function processReadyUnlocks(): void {
  const now = Date.now()
  for (const request of unlockRequestsStore) {
    if (request.status === 'pending' && request.releaseTime <= now) {
      // Mark as ready
      updateUnlockRequest(request.id, { status: 'ready' })
    }
  }
}
