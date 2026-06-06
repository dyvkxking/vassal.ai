# Authentication Layer — Production Readiness Checklist

## Overview

Implement wallet-based authentication for the platform. No passwords — pure Ethereum wallet signatures. All authentication must be self-sovereign.

---

## Phase 1: Wallet Connection Flow

### 1.1 Signature Request
- [ ] Generate unique nonce per connection attempt
- [ ] Store nonce in database with expiration (5 minutes)
- [ ] Construct EIP-4361 compatible message format
- [ ] Include: domain, address, statement, nonce, issued-at, expiration
- [ ] Sign using `personal_sign` (not signTypedData_v4 for simplicity)

### 1.2 Signature Verification
- [ ] Recover signer address from signature using `ecrecover`
- [ ] Compare recovered address with claimed address
- [ ] Verify nonce matches stored nonce
- [ ] Verify message not expired
- [ ] Invalidate nonce after use (prevent replay)

### 1.3 Session Creation
- [ ] Create JWT with user address as subject
- [ ] Include roles claim from user profile
- [ ] Set appropriate expiration (1 hour default, 7 days for "remember me")
- [ ] Store session ID in database for revocation

---

## Phase 2: Middleware Integration

### 2.1 Route Protection
- [ ] Middleware checks Authorization header on protected routes
- [ ] Extract Bearer token, decode JWT
- [ ] Verify JWT signature (RS256)
- [ ] Check token not expired
- [ ] Check user still exists and not banned
- [ ] Attach user address and roles to request context

### 2.2 Role-Based Access
- [ ] Middleware supports role requirements per route
- [ ] Require 'creator' for agent creation endpoints
- [ ] Require 'provider' for node registration endpoints
- [ ] Require 'governor' for proposal creation endpoints
- [ ] Return 401 for missing auth, 403 for insufficient role

### 2.3 CORS Configuration
- [ ] Whitelist frontend domains only
- [ ] Support credentials with wildcards disabled
- [ ] Preflight request handling

---

## Phase 3: Session Management

### 3.1 Session Storage
- [ ] Store sessions in database (not just JWT)
- [ ] Track: user_address, session_id, created_at, last_active, expires_at, revoked
- [ ] Index on user_address for quick lookup

### 3.2 Session Revocation
- [ ] Allow user to revoke all sessions
- [ ] Allow user to revoke specific session by ID
- [ ] Revocation marks session as revoked in DB
- [ ] Rejected JWT checked against revoked list

### 3.3 Automatic Cleanup
- [ ] Background job to delete expired sessions
- [ ] Run every hour
- [ ] Delete sessions where expires_at < now

---

## Phase 4: Web3 Auth Utilities

### 4.1 Address Validation
- [ ] Check address is valid Ethereum format (0x + 40 hex chars)
- [ ] Validate checksum (EIP-55) if provided
- [ ] Normalize to lowercase for storage

### 4.2 Message Construction
- [ ] Build EIP-4361 compliant messages
- [ ] Include chain ID for replay protection
- [ ] Domain binding (your app's domain)

### 4.3 Signature Types
- [ ] Support personal_sign (primary)
- [ ] Support EIP-712 typed data (optional)
- [ ] Handle signing errors gracefully

---

## Phase 5: Frontend Integration Points

### 5.1 Client-Side Hook
- [ ] `useAuth()` hook returns: address, isConnected, isAuthenticated, connect, disconnect
- [ ] Store JWT in httpOnly cookie (not localStorage)
- [ ] Auto-refresh token before expiration
- [ ] Handle disconnection on token expiry

### 5.2 Connection Flow
- [ ] Step 1: User clicks "Connect Wallet"
- [ ] Step 2: Frontend requests nonce from `/api/auth/nonce`
- [ ] Step 3: Frontend calls `personal_sign` with message
- [ ] Step 4: Frontend sends signature to `/api/auth/verify`
- [ ] Step 5: Server returns JWT, frontend stores in cookie

### 5.3 Disconnection
- [ ] Clear local state
- [ ] Call `/api/auth/logout` to revoke session
- [ ] Clear httpOnly cookie

---

## Phase 6: Security Hardening

### 6.1 Rate Limiting
- [ ] Limit nonce requests to 5 per minute per IP
- [ ] Limit signature verification attempts to 10 per minute per IP
- [ ] Lock account after 10 failed verification attempts

### 6.2 Signature Replay Prevention
- [ ] Nonces are single-use
- [ ] Nonces expire after 5 minutes
- [ ] Store used nonces for 24 hours to prevent replay

### 6.3 Frontend Protection
- [ ] CSRF tokens for all state-changing operations
- [ ] SameSite cookie attribute set to 'strict'
- [ ] Secure cookie flag in production

---

## Phase 7: Testing

- [ ] Test wallet connection flow end-to-end
- [ ] Test signature verification with valid signature
- [ ] Test signature verification with invalid signature
- [ ] Test expired nonce rejection
- [ ] Test session revocation
- [ ] Test role-based access enforcement
- [ ] Test rate limiting kicks in

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Run Playwright tests for auth flow — must pass all
3. Use `mcp__Neon__run_sql` to verify session data is persisted correctly