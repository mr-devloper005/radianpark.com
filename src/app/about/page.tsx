import Link from 'next/link'
import { LuxuryBrandShell } from '@/components/shared/luxury-brand-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Compass, Gem, ShieldCheck, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'

const pillars = [
  {
    icon: Compass,
    title: 'Location intelligence',
    body: 'We map demand, infrastructure, and lifestyle signals so every recommendation is grounded in how people actually live and invest.',
  },
  {
    icon: Gem,
    title: 'Curated opportunities',
    body: 'Listings and developments are reviewed for clarity, documentation, and fit—so you spend less time filtering noise.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent process',
    body: 'From first conversation to closing, we prioritize plain language, realistic timelines, and accountable follow-through.',
  },
]

const milestones = [
  { year: '2016', label: 'Founded with a focus on premium residential advisory' },
  { year: '2019', label: 'Expanded into mixed-use and hospitality partnerships' },
  { year: '2022', label: 'Launched digital tools for buyers, sellers, and investors' },
  { year: '2026', label: 'Serving clients across key metros with a unified platform' },
]

const leadership = [
  {
    name: 'Elena Marchetti',
    role: 'Managing Director',
    bio: 'Twenty years guiding institutional and private clients through complex acquisitions and portfolio strategy.',
  },
  {
    name: 'James Okonkwo',
    role: 'Head of Acquisitions',
    bio: 'Structures off-market and development opportunities with an emphasis on risk-adjusted returns.',
  },
  {
    name: 'Sofia Reyes',
    role: 'Client Experience',
    bio: 'Leads onboarding, concierge research, and long-term relationship care for families and founders.',
  },
]

export default function AboutPage() {
  return (
    <LuxuryBrandShell
      eyebrow="About us"
      title={`${SITE_CONFIG.name} is where discerning real estate meets modern clarity.`}
      description="We are a boutique advisory and platform team helping buyers, sellers, and investors navigate premium residential and mixed-use markets with confidence."
    >
      <div className="space-y-16">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1D2B3A] sm:text-3xl">
              A calm, capable partner for high-stakes decisions.
            </h2>
            <p className="text-sm leading-8 text-[#1D2B3A]/75 sm:text-base">
              Real estate at the top of the market is rarely about a single listing—it is about timing, leverage, tax
              posture, and the story a property tells. {SITE_CONFIG.name} combines on-the-ground expertise with a
              refined digital experience so you can evaluate opportunities without losing the human judgment that
              matters most.
            </p>
            <p className="text-sm leading-8 text-[#1D2B3A]/75 sm:text-base">
              Whether you are relocating, diversifying wealth, or staging a development for launch, we align specialists,
              data, and white-glove service around your objectives—not ours.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="rounded-full border-0 bg-[#A68955] px-6 text-sm font-semibold text-[#1D2B3A] hover:bg-[#b89968]"
              >
                <Link href="/contact">Schedule a consultation</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#A68955]/50 bg-transparent text-[#1D2B3A] hover:bg-[#1D2B3A]/5"
              >
                <Link href="/search">Explore listings</Link>
              </Button>
            </div>
          </div>
          <Card className="rounded-3xl border border-[#A68955]/25 bg-white/80 shadow-sm backdrop-blur-sm">
            <CardContent className="space-y-6 p-7">
              <div className="flex items-center gap-2 text-[#A68955]">
                <Building2 className="h-5 w-5" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">At a glance</span>
              </div>
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#1D2B3A]/50">Markets</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-[#1D2B3A]">12+</dd>
                  <dd className="text-xs text-[#1D2B3A]/60">Core cities &amp; corridors</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#1D2B3A]/50">Transactions advised</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-[#1D2B3A]">840+</dd>
                  <dd className="text-xs text-[#1D2B3A]/60">Since inception</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#1D2B3A]/50">Average response</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-[#1D2B3A]">&lt; 4h</dd>
                  <dd className="text-xs text-[#1D2B3A]/60">Business days</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#1D2B3A]/50">Client tenure</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-[#1D2B3A]">7 yrs</dd>
                  <dd className="text-xs text-[#1D2B3A]/60">Typical relationship</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A68955]">How we work</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[#1D2B3A] sm:text-3xl">Principles that scale</h2>
            </div>
            <Sparkles className="hidden h-8 w-8 text-[#A68955]/40 sm:block" aria-hidden />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((item) => (
              <Card
                key={item.title}
                className="rounded-3xl border border-[#A68955]/20 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <item.icon className="h-6 w-6 text-[#A68955]" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold text-[#1D2B3A]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#1D2B3A]/70">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#A68955]/25 bg-[#1D2B3A] px-6 py-10 text-[#F9F6F1] sm:px-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Milestones</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#F9F6F1]/75">
            Steady growth, selective hiring, and technology investments keep us aligned with how clients expect to work
            today.
          </p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <li key={m.year} className="relative border-l border-[#A68955]/50 pl-5">
                <span className="absolute -left-px top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#A68955]" />
                <p className="font-display text-xl font-semibold text-[#A68955]">{m.year}</p>
                <p className="mt-2 text-sm leading-6 text-[#F9F6F1]/80">{m.label}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A68955]">Leadership</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-[#1D2B3A] sm:text-3xl">
              Seasoned operators, accessible day to day
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {leadership.map((person) => (
              <Card key={person.name} className="rounded-3xl border border-[#A68955]/20 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#A68955]/40 bg-[#F9F6F1] font-display text-lg font-semibold text-[#1D2B3A]">
                    {person.name.charAt(0)}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-[#1D2B3A]">{person.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#A68955]">{person.role}</p>
                  <p className="mt-3 text-sm leading-7 text-[#1D2B3A]/70">{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </LuxuryBrandShell>
  )
}
