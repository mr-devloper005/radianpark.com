'use client'

import Link from 'next/link'
import { Compass, ImagePlus, Search, User, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { getSafeReturnPath } from '@/lib/auth-redirect'

export type VisualIntroLink = { label: string; href: string }

function iconForHref(href: string): LucideIcon {
  if (href.includes('/profile')) return User
  if (href.includes('/create')) return ImagePlus
  if (href.includes('/search')) return Search
  if (href.includes('image-sharing')) return Compass
  return Compass
}

export function TaskIntroLinks({
  links,
  buttonClass,
}: {
  links: VisualIntroLink[]
  buttonClass: string
}) {
  const { isAuthenticated, authHydrated } = useAuth()

  if (links.length === 0) return null

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((link) => {
        const Icon = iconForHref(link.href)
        const isCreate = link.href.includes('/create')

        if (!authHydrated && isCreate) {
          return (
            <span
              key={link.href}
              className={cn(
                'inline-flex cursor-wait items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold opacity-60 shadow-sm',
                buttonClass,
              )}
              aria-busy="true"
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              {link.label}
            </span>
          )
        }

        const href =
          isCreate && !isAuthenticated
            ? `/login?from=${encodeURIComponent(getSafeReturnPath(link.href) ?? link.href)}`
            : link.href

        return (
          <Link
            key={link.href}
            href={href}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-transform hover:translate-y-[-1px]',
              buttonClass,
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
