import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { RegisterPageClient } from './register-page-client'

export const metadata: Metadata = buildPageMetadata({
  path: '/register',
  title: 'Sign up',
  description: `Create an account on ${SITE_CONFIG.name}`,
})

export default function RegisterPage() {
  return <RegisterPageClient />
}
