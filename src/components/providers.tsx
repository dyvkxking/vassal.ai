'use client'

import { ReactNode, createContext, useContext, useState, useCallback } from 'react'

// Toast Context
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

// Wallet Context
interface WalletContextValue {
  address: string | null
  isConnected: boolean
  chainId: number | null
  connect: (type: 'metamask' | 'walletconnect' | 'coinbase') => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function Providers({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <WalletContext.Provider
        value={{
          address: null,
          isConnected: false,
          chainId: null,
          connect: async () => {},
          disconnect: () => {},
        }}
      >
        {children}
      </WalletContext.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a Providers component')
  }
  return context
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within a Providers component')
  }
  return context
}