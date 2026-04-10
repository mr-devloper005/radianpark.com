'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSafeReturnPath } from '@/lib/auth-redirect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RegisterForm() {
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const returnTo = getSafeReturnPath(searchParams.get('from'))
  const loginHref = returnTo != null ? `/login?from=${encodeURIComponent(returnTo)}` : '/login'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signup(name, email, password)
      router.push(returnTo ?? '/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account.')
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
        <Label htmlFor="register-name" className="text-[#111]">
          Name
        </Label>
        <Input
          id="register-name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-2xl border-[#e3e3e3] bg-white"
          placeholder="Your name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="register-email" className="text-[#111]">
          Email
        </Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password" className="text-[#111]">
          Password
        </Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-2xl border-[#e3e3e3] bg-white"
          placeholder="At least 6 characters"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 rounded-full bg-[#e60023] text-base font-semibold text-white hover:bg-[#ad081b]"
      >
        {isLoading ? 'Creating account…' : 'Sign up'}
      </Button>
      <p className="text-center text-sm text-[#767676]">
        Already have an account?{' '}
        <Link href={loginHref} className="font-semibold text-[#111] hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
