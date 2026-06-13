import { redirect } from 'next/navigation'

// OAuth signup is handled by signing in — no separate signup page needed
// Auth.js creates the account on first OAuth sign-in
export default function SignUpPage() {
  redirect('/auth/signin')
}
