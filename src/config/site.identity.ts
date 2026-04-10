export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || 'radianpark',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Radian Park',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Image sharing & social profiles',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Share photos, discover visual inspiration, and follow creator profiles in a calm, Pinterest-inspired experience built for community and self-expression.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'radianpark.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://radianpark.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const

