import type { Metadata } from 'next'
import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Building2,
  Camera,
  Compass,
  FileText,
  Globe2,
  Heart,
  Image as ImageIcon,
  LayoutGrid,
  MapPin,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Users,
  Zap,
} from 'lucide-react'
import { ConditionalLoginLink } from '@/components/shared/conditional-login-link'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm') return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

function buildHeroImageList(...pools: SitePost[][]) {
  const merged = pools.flat().filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i)
  return Array.from({ length: 6 }, (_, i) =>
    merged.length ? getPostImage(merged[i % merged.length]) : '/placeholder.svg?height=900&width=700',
  )
}

function HeroBentoCollage({ heroImages, featuredLabel = 'Featured' }: { heroImages: string[]; featuredLabel?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full bg-white/10 blur-3xl lg:block" />
      <div className="absolute -bottom-8 -left-8 hidden h-32 w-32 rounded-full bg-white/10 blur-3xl lg:block" />
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-stretch">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50 sm:rounded-[2rem] lg:min-h-0 lg:w-[52%] lg:flex-1">
          <ContentImage src={heroImages[0]} alt="" fill className="object-cover" sizes="(max-width: 1024px) 90vw, 38vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white/95">
            <Heart className="h-4 w-4 text-white/80" />
            {featuredLabel}
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-xl sm:rounded-3xl">
            <ContentImage src={heroImages[1]} alt="" fill className="object-cover" sizes="(max-width: 1024px) 44vw, 20vw" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-xl sm:rounded-3xl">
            <ContentImage src={heroImages[2]} alt="" fill className="object-cover" sizes="(max-width: 1024px) 44vw, 20vw" />
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:col-span-2 sm:rounded-3xl">
            <ContentImage src={heroImages[3]} alt="" fill className="object-cover" sizes="(max-width: 1024px) 90vw, 40vw" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:rounded-3xl">
            <ContentImage src={heroImages[4]} alt="" fill className="object-cover" sizes="22vw" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:rounded-3xl">
            <ContentImage src={heroImages[5]} alt="" fill className="object-cover" sizes="22vw" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PremiumDarkHero({
  gradientCss,
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  tertiary,
  stats,
  bentoImages,
  bentoFeaturedLabel,
  primaryCtaClassName,
}: {
  gradientCss: string
  badge: ReactNode
  title: ReactNode
  description: string
  primaryCta: { href: string; label: string }
  secondaryCta: { href: string; label: string }
  tertiary?: { href: string; label: string; icon?: ComponentType<{ className?: string }> }
  stats: Array<{ dt: string; dd: string; sub: string }>
  bentoImages: string[]
  bentoFeaturedLabel?: string
  /** Override default light primary button (e.g. brand red for visual product) */
  primaryCtaClassName?: string
}) {
  const TertIcon = tertiary?.icon || Search
  const primaryBtnClass =
    primaryCtaClassName ||
    'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-[#0c0c0c] shadow-[0_20px_50px_rgba(255,255,255,0.12)] transition hover:bg-white/90'
  return (
    <section className="relative overflow-hidden bg-[#0c0c0c] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-90" style={{ backgroundImage: gradientCss }} />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%20d%3D%22M0%200h48v48H0z%22%2F%3E%3C%2Fsvg%3E')]" />
      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10 lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
            {badge}
          </div>
          <h1 className="mt-8 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[3.25rem]">{title}</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">{description}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={primaryCta.href} className={primaryBtnClass}>
              {primaryCta.label}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              {secondaryCta.label}
            </Link>
            {tertiary ? (
              <Link
                href={tertiary.href}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <TertIcon className="h-4 w-4" />
                {tertiary.label}
              </Link>
            ) : null}
          </div>
          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 sm:max-w-xl">
            {stats.map((s) => (
              <div key={s.dt}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/45">{s.dt}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">{s.dd}</dd>
                <dd className="text-xs text-white/50">{s.sub}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroBentoCollage heroImages={bentoImages} featuredLabel={bentoFeaturedLabel} />
      </div>
    </section>
  )
}

type FeatureCard = {
  icon: ComponentType<{ className?: string }>
  title: string
  body: string
  href: string
  accent: string
}

function PremiumFeatureGridSection({ eyebrow, heading, sub, cards }: { eyebrow: string; heading: string; sub: string; cards: FeatureCard[] }) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">{heading}</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#767676] sm:text-base">{sub}</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          >
            <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${card.accent} opacity-80`} />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f6f6] text-[#111] transition group-hover:bg-[#111] group-hover:text-white">
              <card.icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="relative mt-5 text-lg font-bold text-[#111]">{card.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-[#767676]">{card.body}</p>
            <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#e60023]">
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

type StepItem = { n: string; title: string; body: string; icon: ComponentType<{ className?: string }> }

function PremiumHowItWorksSection({ steps, loginHint }: { steps: StepItem[]; loginHint?: boolean }) {
  return (
    <section className="border-y border-[#e3e3e3] bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">Three steps that matter</h2>
          </div>
          {loginHint ? (
            <ConditionalLoginLink
              href="/login"
              className="text-sm font-semibold text-[#e60023] hover:underline"
            >
              Already have an account? Log in →
            </ConditionalLoginLink>
          ) : null}
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="relative rounded-3xl border border-[#ececec] bg-[#fafafa] p-8 pt-10">
              <span className="absolute right-8 top-8 text-5xl font-bold tabular-nums text-[#e9e9e9]">{step.n}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111] text-white">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#111]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#767676]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PremiumHighlightsStrip({ items }: { items: Array<{ icon: ComponentType<{ className?: string }>; label: string; sub: string }> }) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-center sm:justify-between sm:text-left">
        {items.map((item) => (
          <div key={item.label} className="flex max-w-xs items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#e3e3e3]">
              <item.icon className="h-5 w-5 text-[#111]" />
            </div>
            <div>
              <p className="font-semibold text-[#111]">{item.label}</p>
              <p className="mt-1 text-sm text-[#767676]">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PremiumBottomCtaBand({
  title,
  description,
  primary,
  secondary,
}: {
  title: string
  description: string
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
}) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#111] px-8 py-14 text-center text-white sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(230,0,35,0.45), transparent), radial-gradient(circle at 10% 20%, rgba(255,255,255,0.06), transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primary.href}
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[#e60023] px-8 text-sm font-semibold text-white hover:bg-[#ad081b]"
            >
              {primary.label}
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white hover:bg-white/10"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function DirectoryHome({ primaryTask, enabledTasks, listingPosts, classifiedPosts, profilePosts, brandPack }: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 6)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const listRoute = primaryTask?.route || '/listings'
  const heroImages = buildHeroImageList(listingPosts, classifiedPosts, profilePosts)
  const isMarket = brandPack === 'market-utility'
  const heroGradient = isMarket
    ? 'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(132,204,22,0.32), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(255,255,255,0.08), transparent 45%), linear-gradient(180deg, #141414 0%, #0a0a0a 55%, #0c0c0c 100%)'
    : 'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(56,189,248,0.35), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(255,255,255,0.08), transparent 45%), linear-gradient(180deg, #141414 0%, #0a0a0a 55%, #0c0c0c 100%)'

  const accents = ['from-sky-500/12 to-transparent', 'from-emerald-500/12 to-transparent', 'from-amber-500/12 to-transparent', 'from-violet-500/12 to-transparent'] as const
  const featureCards: FeatureCard[] = enabledTasks.slice(0, 4).map((task, i) => ({
    icon: taskIcons[task.key as TaskKey] || LayoutGrid,
    title: task.label,
    body: task.description,
    href: task.route,
    accent: accents[i % accents.length],
  }))

  const directorySteps: StepItem[] = [
    { n: '01', title: 'Discover', body: 'Search listings, offers, and profiles in one directory tuned for local intent.', icon: Compass },
    { n: '02', title: 'Compare', body: 'Scan trust cues, categories, and locations without wading through social noise.', icon: LayoutGrid },
    { n: '03', title: 'Act', body: 'Contact, visit, or save what matters—built for decisions, not endless scrolling.', icon: Zap },
  ]

  return (
    <main className="bg-[#f1f1f1]">
      <PremiumDarkHero
        gradientCss={heroGradient}
        badge={
          <>
            <Compass className="h-3.5 w-3.5 text-sky-300" />
            {SITE_CONFIG.name} · Local discovery
          </>
        }
        title={<>Find businesses, offers, and people—without the noise.</>}
        description={SITE_CONFIG.description}
        primaryCta={{ href: listRoute, label: 'Browse directory' }}
        secondaryCta={{ href: '/register', label: 'List your business' }}
        tertiary={{ href: '/search', label: 'Search everywhere', icon: Search }}
        stats={[
          {
            dt: 'Listings lane',
            dd: `${listingPosts.length || classifiedPosts.length ? `${Math.min(Math.max(listingPosts.length, classifiedPosts.length), 99)}+` : '—'}`,
            sub: 'surfaces in feed',
          },
          {
            dt: 'Profiles',
            dd: `${profilePosts.length ? `${Math.min(profilePosts.length, 99)}+` : '—'}`,
            sub: 'public directory entries',
          },
          {
            dt: 'Lanes',
            dd: String(Math.max(enabledTasks.length, 1)),
            sub: 'enabled on this site',
          },
        ]}
        bentoImages={heroImages}
        bentoFeaturedLabel="Spotlight"
      />

      <PremiumFeatureGridSection
        eyebrow="Platform surfaces"
        heading="Everything in one directory experience"
        sub="Jump into the lanes your community uses most—each opens the same polished, action-oriented layout."
        cards={
          featureCards.length >= 4
            ? featureCards
            : [
                ...featureCards,
                {
                  icon: Search,
                  title: 'Search',
                  body: 'Query across posts and surfaces from one search experience.',
                  href: '/search',
                  accent: 'from-slate-500/10 to-transparent',
                },
              ].slice(0, 4)
        }
      />

      <PremiumHowItWorksSection steps={directorySteps} loginHint />

      <PremiumHighlightsStrip
        items={[
          { icon: ShieldCheck, label: 'Trust-forward cards', sub: 'Categories, locations, and cues at a glance' },
          { icon: MapPin, label: 'Local-first discovery', sub: 'Built for places, services, and nearby offers' },
          { icon: Building2, label: 'Business-ready', sub: 'Listings and lanes that feel like a real directory' },
        ]}
      />

      <section className="mx-auto max-w-[1600px] px-4 pb-6 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#e3e3e3] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">Featured picks</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">Highlighted listings &amp; offers</h2>
            <p className="mt-2 max-w-xl text-sm text-[#767676]">Curated from your primary lane—open any card for full details.</p>
          </div>
          <Link href={listRoute} className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#d0d0d0] bg-white px-5 py-2.5 text-sm font-semibold text-[#111] shadow-sm hover:bg-[#ececec]">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((post) => (
            <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">Also explore</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">Profiles &amp; related surfaces</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(profilePosts.length ? profilePosts : classifiedPosts).slice(0, 8).map((post) => {
            const meta = getPostMeta(post)
            const taskKey = resolveTaskKey(post.task, profilePosts.length ? 'profile' : 'classified')
            return (
              <Link
                key={post.id}
                href={getTaskHref(taskKey, post.slug)}
                className="group overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-40 overflow-hidden bg-[#e9e9e9]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition duration-300 group-hover:scale-[1.04]" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#767676]">{meta.category || taskKey}</p>
                  <h3 className="mt-1 line-clamp-2 font-semibold text-[#111]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#767676]">{post.summary || 'Open for hours, contact, and more.'}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <PremiumBottomCtaBand
        title="Ready to get discovered locally?"
        description="Claim your listing, refresh your profile, and show up where people are already searching."
        primary={{ href: '/register', label: 'Get started' }}
        secondary={{ href: '/contact', label: 'Talk to us' }}
      />
    </main>
  )
}

function EditorialHome({ primaryTask, articlePosts, supportTasks }: { primaryTask?: EnabledTask; articlePosts: SitePost[]; supportTasks: EnabledTask[] }) {
  const lead = articlePosts[0]
  const side = articlePosts.slice(1, 5)
  const moreStories = articlePosts.slice(5, 14)
  const articlesRoute = primaryTask?.route || '/articles'
  const heroImages = buildHeroImageList(articlePosts)
  const editorialGradient =
    'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(245,158,11,0.3), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(255,255,255,0.08), transparent 45%), linear-gradient(180deg, #141414 0%, #0a0a0a 55%, #0c0c0c 100%)'

  const taskLane = [primaryTask, ...supportTasks].filter(Boolean) as EnabledTask[]
  const uniqueLanes = taskLane.filter((t, i, a) => a.findIndex((x) => x.key === t.key) === i).slice(0, 4)
  const accents = ['from-amber-500/15 to-transparent', 'from-orange-500/12 to-transparent', 'from-yellow-500/10 to-transparent', 'from-rose-500/10 to-transparent'] as const
  const featureCards: FeatureCard[] = uniqueLanes.map((task, i) => ({
    icon: taskIcons[task.key as TaskKey] || FileText,
    title: task.label,
    body: task.description,
    href: task.route,
    accent: accents[i % accents.length],
  }))

  const editorialSteps: StepItem[] = [
    { n: '01', title: 'Read deeply', body: 'Long-form essays and analysis with typography that respects attention.', icon: FileText },
    { n: '02', title: 'Follow threads', body: 'Move between features, columns, and supporting lanes without losing context.', icon: Bookmark },
    { n: '03', title: 'Share the work', body: 'Pass along stories that matter—every article has a clear, shareable surface.', icon: Share2 },
  ]

  return (
    <main className="bg-[#f1f1f1]">
      <PremiumDarkHero
        gradientCss={editorialGradient}
        badge={
          <>
            <FileText className="h-3.5 w-3.5 text-amber-300" />
            {SITE_CONFIG.name} · Publication
          </>
        }
        title={<>Essays &amp; analysis—published with intention, not algorithmic noise.</>}
        description={SITE_CONFIG.description}
        primaryCta={{ href: articlesRoute, label: 'Start reading' }}
        secondaryCta={{ href: '/about', label: 'About the desk' }}
        tertiary={{ href: '/search', label: 'Search stories', icon: Search }}
        stats={[
          {
            dt: 'Stories live',
            dd: `${articlePosts.length ? `${Math.min(articlePosts.length, 99)}+` : '—'}`,
            sub: 'pieces in rotation',
          },
          {
            dt: 'In this issue',
            dd: String(Math.min(side.length + (lead ? 1 : 0), 12)),
            sub: 'features highlighted',
          },
          {
            dt: 'Lanes',
            dd: String(Math.max(uniqueLanes.length, 1)),
            sub: 'connected sections',
          },
        ]}
        bentoImages={heroImages}
        bentoFeaturedLabel="Cover story"
      />

      <PremiumFeatureGridSection
        eyebrow="Sections & lanes"
        heading="One publication, many entry points"
        sub="Open the lanes your readers use—articles, visuals, resources—without breaking the editorial rhythm."
        cards={
          featureCards.length >= 4
            ? featureCards
            : [
                ...featureCards,
                {
                  icon: Search,
                  title: 'Archive search',
                  body: 'Jump to any story or topic from unified search.',
                  href: '/search',
                  accent: 'from-stone-500/10 to-transparent',
                },
              ].slice(0, 4)
        }
      />

      <PremiumHowItWorksSection steps={editorialSteps} loginHint />

      <PremiumHighlightsStrip
        items={[
          { icon: FileText, label: 'Reading-first layout', sub: 'Room for nuance, not cramped cards' },
          { icon: Sparkles, label: 'Editorial craft', sub: 'Lead stories, features, and clear hierarchy' },
          { icon: Globe2, label: 'Built to grow', sub: 'Add lanes as your publication expands' },
        ]}
      />

      {lead ? (
        <section className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">Lead story</p>
          <div className="mt-4 overflow-hidden rounded-[2rem] border border-[#e3e3e3] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[300px] overflow-hidden bg-[#1a1a1a] lg:min-h-[420px]">
                <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <h2 className="text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">{lead.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#767676] sm:text-base">
                  {lead.summary || 'A deliberate lead story with space for context, argument, and payoff.'}
                </p>
                <Link
                  href={`/articles/${lead.slug}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white hover:bg-[#333]"
                >
                  Read full article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {side.length ? (
        <section className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">Inside this issue</p>
              <h2 className="mt-2 text-2xl font-bold text-[#111] sm:text-3xl">Features &amp; columns</h2>
            </div>
            <Link href={articlesRoute} className="text-sm font-semibold text-[#e60023] hover:underline">
              All articles →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {side.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex gap-5 rounded-3xl border border-[#e3e3e3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl bg-[#e9e9e9] sm:h-32 sm:w-40">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition duration-300 group-hover:scale-[1.05]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#767676]">Feature</p>
                  <h3 className="mt-1 line-clamp-2 text-lg font-bold text-[#111]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#767676]">{post.summary || 'Long-form perspective with a calmer reading rhythm.'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {moreStories.length ? (
        <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-10">
          <h3 className="mb-6 text-lg font-bold text-[#111]">More to read</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreStories.map((post) => (
              <TaskPostCard key={post.id} post={post} href={`/articles/${post.slug}`} taskKey="article" compact />
            ))}
          </div>
        </section>
      ) : null}

      <PremiumBottomCtaBand
        title="Subscribe to the conversation"
        description="Create an account to save articles, follow topics, and get the most from this publication."
        primary={{ href: '/register', label: 'Join free' }}
        secondary={{ href: '/contact', label: 'Pitch a story' }}
      />
    </main>
  )
}

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const feedSource = imagePosts.length ? imagePosts : articlePosts
  const masonryPosts = feedSource.slice(0, 28)
  const spotlightProfiles = profilePosts.slice(0, 8)
  const visualHeroImages = buildHeroImageList(imagePosts, articlePosts, profilePosts)
  const visualGradient =
    'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(230,0,35,0.35), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(255,255,255,0.08), transparent 45%), linear-gradient(180deg, #141414 0%, #0a0a0a 55%, #0c0c0c 100%)'

  const visualFeatureCards: FeatureCard[] = [
    {
      icon: LayoutGrid,
      title: 'Visual boards',
      body: 'Browse a masonry feed of photos and posts tuned for discovery—not endless noise.',
      href: primaryTask?.route || '/image-sharing',
      accent: 'from-[#e60023]/15 to-transparent',
    },
    {
      icon: User,
      title: 'Creator profiles',
      body: 'Showcase your identity, bio, and best work in a profile built for social reach.',
      href: '/profile',
      accent: 'from-[#111]/8 to-transparent',
    },
    {
      icon: Search,
      title: 'Smart search',
      body: 'Find ideas, people, and images quickly with search built across the platform.',
      href: '/search',
      accent: 'from-emerald-500/10 to-transparent',
    },
    {
      icon: Users,
      title: 'Community',
      body: 'Follow voices you care about, join conversations, and grow alongside other creators.',
      href: '/community',
      accent: 'from-violet-500/10 to-transparent',
    },
  ]

  const visualSteps: StepItem[] = [
    { n: '01', title: 'Share', body: 'Upload photos and stories in a few taps. Your work stays front and center.', icon: Camera },
    { n: '02', title: 'Curate', body: 'Organize your public profile and highlight the posts that define your style.', icon: Sparkles },
    { n: '03', title: 'Grow', body: 'Get discovered in Explore, search, and community spaces built for visibility.', icon: Zap },
  ]

  return (
    <main className="bg-[#f1f1f1]">
      <PremiumDarkHero
        gradientCss={visualGradient}
        primaryCtaClassName="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#e60023] px-8 text-base font-semibold text-white shadow-[0_20px_50px_rgba(230,0,35,0.35)] transition hover:bg-[#ad081b]"
        badge={
          <>
            <Sparkles className="h-3.5 w-3.5 text-[#ff6b7a]" />
            {SITE_CONFIG.name}
          </>
        }
        title={<>Where images, ideas, and creators meet.</>}
        description={SITE_CONFIG.description}
        primaryCta={{ href: primaryTask?.route || '/image-sharing', label: 'Start exploring' }}
        secondaryCta={{ href: '/register', label: 'Create free account' }}
        tertiary={{ href: '/search', label: 'Search the platform', icon: Search }}
        stats={[
          {
            dt: 'Feed',
            dd: `${feedSource.length ? `${Math.min(feedSource.length, 40)}+` : '—'}`,
            sub: 'visual posts surfaced',
          },
          {
            dt: 'Profiles',
            dd: `${profilePosts.length ? `${Math.min(profilePosts.length, 40)}+` : '—'}`,
            sub: 'creator surfaces',
          },
          {
            dt: 'Always on',
            dd: '24/7',
            sub: 'discovery & browse',
          },
        ]}
        bentoImages={visualHeroImages}
        bentoFeaturedLabel="Featured"
      />

      <PremiumFeatureGridSection
        eyebrow="Everything you need"
        heading="Built for sharing and discovery"
        sub="A focused toolkit for visual publishing, social profiles, and community—without cluttering the experience."
        cards={visualFeatureCards}
      />

      <PremiumHowItWorksSection steps={visualSteps} loginHint />

      <PremiumHighlightsStrip
        items={[
          { icon: Share2, label: 'Share-ready layouts', sub: 'Optimized cards for feeds & profiles' },
          { icon: ShieldCheck, label: 'You own your presence', sub: 'Profile and content stay yours' },
          { icon: Globe2, label: 'Built to scale with you', sub: 'From hobbyist to growing creator' },
        ]}
      />

      {/* Masonry feed */}
      <section className="mx-auto max-w-[1920px] px-4 pb-6 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">Live from the community</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">Trending visuals</h2>
            <p className="mt-2 max-w-xl text-sm text-[#767676]">Fresh posts in a masonry layout—tap any card to open the full story.</p>
          </div>
          <Link
            href={primaryTask?.route || '/image-sharing'}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#d0d0d0] bg-white px-5 py-2.5 text-sm font-semibold text-[#111] shadow-sm hover:bg-[#ececec]"
          >
            View full feed
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="masonry-feed">
          {masonryPosts.map((post) => (
            <Link
              key={post.id}
              href={getTaskHref(resolveTaskKey(post.task, 'image'), post.slug)}
              className="group block overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e9e9e9]">
                <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="px-3 py-3">
                <p className="line-clamp-2 text-sm font-semibold text-[#111]">{post.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Creators */}
      {spotlightProfiles.length ? (
        <section className="mx-auto max-w-[1920px] px-4 pb-16 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">People to know</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">Creators on {SITE_CONFIG.name}</h2>
            </div>
            <Link href="/profile" className="text-sm font-semibold text-[#e60023] hover:underline">
              Browse all profiles →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spotlightProfiles.map((post) => (
              <Link
                key={post.id}
                href={`/profile/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e9e9e9]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition duration-300 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md">
                      <ContentImage src={getPostImage(post)} alt="" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 text-white drop-shadow">
                      <p className="truncate font-semibold">{post.title}</p>
                      <p className="truncate text-xs text-white/85">View profile</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm text-[#767676]">{post.summary || 'Creator on the platform—follow their public profile and latest posts.'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <PremiumBottomCtaBand
        title="Ready to share your next visual story?"
        description="Join free, publish photos, and connect your profile with people who care about your work."
        primary={{ href: '/register', label: 'Get started free' }}
        secondary={{ href: '/contact', label: 'Talk to us' }}
      />
    </main>
  )
}

function CurationHome({
  primaryTask,
  enabledTasks,
  bookmarkPosts,
  profilePosts,
  articlePosts,
}: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  bookmarkPosts: SitePost[]
  profilePosts: SitePost[]
  articlePosts: SitePost[]
}) {
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 8) : articlePosts.slice(0, 8)
  const collectionTask: TaskKey = bookmarkPosts.length ? 'sbm' : 'article'
  const people = profilePosts.slice(0, 8)
  const sbmRoute = primaryTask?.route || '/sbm'
  const heroImages = buildHeroImageList(bookmarkPosts, articlePosts, profilePosts)
  const curationGradient =
    'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(139,92,246,0.32), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(244,114,182,0.12), transparent 45%), linear-gradient(180deg, #141414 0%, #0a0a0a 55%, #0c0c0c 100%)'

  const accents = ['from-violet-500/15 to-transparent', 'from-fuchsia-500/12 to-transparent', 'from-purple-500/12 to-transparent', 'from-pink-500/10 to-transparent'] as const
  const featureCards: FeatureCard[] = enabledTasks.slice(0, 4).map((task, i) => ({
    icon: taskIcons[task.key as TaskKey] || Bookmark,
    title: task.label,
    body: task.description,
    href: task.route,
    accent: accents[i % accents.length],
  }))

  const curationSteps: StepItem[] = [
    { n: '01', title: 'Save', body: 'Capture links, references, and resources into collections that stay organized.', icon: Bookmark },
    { n: '02', title: 'Arrange', body: 'Group by theme, project, or mood—your shelves, your logic.', icon: LayoutGrid },
    { n: '03', title: 'Return', body: 'Revisit what mattered with calmer cards and less feed anxiety.', icon: Sparkles },
  ]

  return (
    <main className="bg-[#f1f1f1]">
      <PremiumDarkHero
        gradientCss={curationGradient}
        badge={
          <>
            <Bookmark className="h-3.5 w-3.5 text-violet-300" />
            {SITE_CONFIG.name} · Collections
          </>
        }
        title={<>Shelves, boards, and bookmarks—without the chaos of a generic feed.</>}
        description={SITE_CONFIG.description}
        primaryCta={{ href: sbmRoute, label: 'Browse collections' }}
        secondaryCta={{ href: '/register', label: 'Start curating' }}
        tertiary={{ href: '/search', label: 'Search saved work', icon: Search }}
        stats={[
          {
            dt: 'Collections',
            dd: `${collections.length ? `${collections.length}+` : '—'}`,
            sub: 'surfaces on display',
          },
          {
            dt: 'Curators',
            dd: `${people.length ? `${people.length}+` : '—'}`,
            sub: 'profiles to explore',
          },
          {
            dt: 'Lanes',
            dd: String(Math.max(enabledTasks.length, 1)),
            sub: 'on this site',
          },
        ]}
        bentoImages={heroImages}
        bentoFeaturedLabel="Pinned"
      />

      <PremiumFeatureGridSection
        eyebrow="Curator toolkit"
        heading="Save and surface what actually matters"
        sub="Every enabled lane connects back to a calmer collecting rhythm—fewer tabs, clearer intent."
        cards={
          featureCards.length >= 4
            ? featureCards
            : [
                ...featureCards,
                {
                  icon: Search,
                  title: 'Find anything',
                  body: 'Search across collections and related content in one flow.',
                  href: '/search',
                  accent: 'from-slate-500/10 to-transparent',
                },
              ].slice(0, 4)
        }
      />

      <PremiumHowItWorksSection steps={curationSteps} loginHint />

      <PremiumHighlightsStrip
        items={[
          { icon: Bookmark, label: 'Built for return visits', sub: 'Collections you want to open again' },
          { icon: Users, label: 'Curator-forward', sub: 'People and profiles behind every shelf' },
          { icon: LayoutGrid, label: 'Visual calm', sub: 'Less noise than algorithmic timelines' },
        ]}
      />

      <section className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#e3e3e3] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">Featured shelves</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">Collections &amp; boards</h2>
            <p className="mt-2 max-w-xl text-sm text-[#767676]">Open a board to see notes, grouping, and context—not just a raw link dump.</p>
          </div>
          <Link
            href={sbmRoute}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#d0d0d0] bg-white px-5 py-2.5 text-sm font-semibold text-[#111] shadow-sm hover:bg-[#ececec]"
          >
            Open library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((post) => (
            <Link
              key={post.id}
              href={getTaskHref(resolveTaskKey(post.task, collectionTask), post.slug)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#767676]">Collection</p>
              <h3 className="mt-2 line-clamp-2 text-lg font-bold text-[#111]">{post.title}</h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[#767676]">
                {post.summary || 'Curated resources with room for context and grouping.'}
              </p>
              <span className="mt-4 text-sm font-semibold text-[#e60023]">View shelf →</span>
            </Link>
          ))}
        </div>
      </section>

      {people.length ? (
        <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#767676]">People behind the pins</p>
              <h2 className="mt-2 text-2xl font-bold text-[#111] sm:text-3xl">Curators &amp; profiles</h2>
            </div>
            <Link href="/profile" className="text-sm font-semibold text-[#e60023] hover:underline">
              Meet everyone →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {people.map((post) => (
              <Link
                key={post.id}
                href={`/profile/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-36 overflow-hidden bg-[#e9e9e9]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition duration-300 group-hover:scale-[1.04]" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#111]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#767676]">{post.summary || 'Curator profile, saved resources, and collection notes.'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <PremiumBottomCtaBand
        title="Start your first collection"
        description="Sign up to save resources, publish shelves, and connect your curator profile with readers who care."
        primary={{ href: '/register', label: 'Create account' }}
        secondary={{ href: '/contact', label: 'Partner with us' }}
      />
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const postsPerTask = (key: TaskKey) => {
    if (productKind === 'visual' && (key === 'image' || key === 'profile')) return 40
    if (productKind === 'directory' && (key === 'listing' || key === 'classified' || key === 'profile')) return 32
    if (productKind === 'editorial' && key === 'article') return 32
    if (productKind === 'curation' && (key === 'sbm' || key === 'article' || key === 'profile')) return 32
    return 8
  }
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, postsPerTask(task.key), {
          allowMockFallback: false,
          fresh: true,
        }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#111]">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          profilePosts={profilePosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} articlePosts={articlePosts} supportTasks={supportTasks} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          bookmarkPosts={bookmarkPosts}
          profilePosts={profilePosts}
          articlePosts={articlePosts}
        />
      ) : null}
      <Footer />
    </div>
  )
}
