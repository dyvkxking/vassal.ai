import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { verifyWalletSignature } from '@/lib/auth/signature'

// POST /api/auth/link-wallet - Link a wallet to the authenticated user's account
export async function POST(request: NextRequest) {
  try {
    // Get the current session from Auth.js
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { address, signature, message } = body

    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing wallet credentials', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Verify the wallet signature
    const isValid = await verifyWalletSignature(message, address, signature)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature', code: 'INVALID_SIGNATURE' },
        { status: 400 }
      )
    }

    // Check if this wallet is already linked to another user
    const existingUser = await prisma.user.findUnique({
      where: { address },
    })

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Wallet is already linked to another account', code: 'WALLET_ALREADY_LINKED' },
        { status: 409 }
      )
    }

    // Link the wallet to the current user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { address },
      select: {
        id: true,
        address: true,
        email: true,
        name: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Failed to link wallet:', error)
    return NextResponse.json(
      { error: 'Failed to link wallet', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/link-wallet - Unlink a wallet from the authenticated user's account
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Unlink the wallet from the current user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { address: null },
      select: {
        id: true,
        address: true,
        email: true,
        name: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Failed to unlink wallet:', error)
    return NextResponse.json(
      { error: 'Failed to unlink wallet', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}