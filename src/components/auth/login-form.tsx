'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSafeReturnPath } from '@/lib/auth-redirect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const returnTo = getSafeReturnPath(searchParams.get('from'))
  const registerHref =
    returnTo != null ? `/register?from=${encodeURIComponent(returnTo)}` : '/register'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      router.push(returnTo ?? '/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error ? (
        <p className="rounded-2xl bg-[#ffe4e4] px-4 py-3 text-sm text-[#c00]" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="login-email" className="text-[#111]">
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-2xl border-[#e3e3e3] bg-white"
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="login-password" className="text-[#111]">
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-2xl border-[#e3e3e3] bg-white"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 rounded-full bg-[#e60023] text-base font-semibold text-white hover:bg-[#ad081b]"
      >
        {isLoading ? 'Signing in…' : 'Log in'}
      </Button>
      <p className="text-center text-sm text-[#767676]">
        New here?{' '}
        <Link href={registerHref} className="font-semibold text-[#111] hover:underline">
          Create an account
        </Link>
      </p>
      <p className="text-center text-xs text-[#767676]">
        Accounts are stored only in this browser (local demo).
      </p>
    </form>
  )
}
