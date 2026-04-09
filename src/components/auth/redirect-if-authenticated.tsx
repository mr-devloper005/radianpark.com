'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSafeReturnPath } from '@/lib/auth-redirect'

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, authHydrated } = useAuth()

  useEffect(() => {
    if (authHydrated && isAuthenticated) {
      const from = getSafeReturnPath(searchParams.get('from'))
      router.replace(from ?? '/')
    }
  }, [authHydrated, isAuthenticated, router, searchParams])

  if (!authHydrated) {
    return <div className="min-h-screen bg-[#f1f1f1]" aria-busy="true" />
  }
  if (isAuthenticated) {
    return null
  }
  return <>{children}</>
}
