'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export function LuxuryBrandShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F9F6F1] text-[#1D2B3A]">
      <NavbarShell />
      <main>
        <header className="relative overflow-hidden border-b border-[#A68955]/30 bg-[#1D2B3A] text-[#F9F6F1]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_-20%,rgba(166,137,85,0.35),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(166,137,85,0.08)_100%)]" />
          <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-5">
                {eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A68955]">{eyebrow}</p>
                ) : null}
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                  {title}
                </h1>
                {description ? (
                  <p className="text-sm leading-relaxed text-[#F9F6F1]/85 sm:text-base">{description}</p>
                ) : null}
              </div>
              <div className="shrink-0 rounded-2xl border border-[#A68955]/40 bg-[#F9F6F1]/5 p-4 backdrop-blur-sm">
                <img
                  src="/favicon.png?v=20260413"
                  alt="Radian Park"
                  className="h-24 w-auto object-contain sm:h-28"
                />
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
