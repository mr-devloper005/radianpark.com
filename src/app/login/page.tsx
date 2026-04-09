import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { LoginPageClient } from './login-page-client'

export const metadata: Metadata = buildPageMetadata({
  path: '/login',
  title: 'Log in',
  description: `Sign in to ${SITE_CONFIG.name}`,
})

export default function LoginPage() {
  return <LoginPageClient />
}
