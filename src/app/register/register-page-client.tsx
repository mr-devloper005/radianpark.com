'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { RegisterForm } from '@/components/auth/register-form'
import { RedirectIfAuthenticated } from '@/components/auth/redirect-if-authenticated'
import { SITE_CONFIG } from '@/lib/site-config'

export function RegisterPageClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f1f1]" aria-busy="true" />}>
    <RedirectIfAuthenticated>
      <div className="min-h-screen bg-[#f1f1f1] text-[#111]">
        <NavbarShell />
        <main className="mx-auto flex max-w-lg flex-col px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9F6F1] ring-1 ring-[#A68955]/35">
              <img src="/favicon.png?v=20260413" alt="" className="h-10 w-10 object-contain" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Join {SITE_CONFIG.name}</h1>
            <p className="mt-2 text-sm text-[#767676]">
              Create a free account to share images and build your social profile.
            </p>
          </div>
          <div className="rounded-3xl border border-[#e3e3e3] bg-white p-8 shadow-sm">
            <RegisterForm />
          </div>
          <p className="mt-8 text-center text-sm text-[#767676]">
            <Link href="/" className="font-semibold text-[#111] hover:underline">
              ← Back to home
            </Link>
          </p>
        </main>
        <Footer />
      </div>
    </RedirectIfAuthenticated>
    </Suspense>
  )
}
