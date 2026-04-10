'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'

export function ConditionalLoginLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const { isAuthenticated, authHydrated } = useAuth()
  if (!authHydrated || isAuthenticated) return null
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
