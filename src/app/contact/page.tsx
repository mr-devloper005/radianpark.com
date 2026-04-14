import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { LuxuryBrandShell } from '@/components/shared/luxury-brand-shell'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes =
    productKind === 'directory'
      ? [
          {
            icon: Building2,
            title: 'Buyer & seller advisory',
            body: 'Private tours, pricing strategy, and negotiation support for residential and mixed-use assets.',
          },
          {
            icon: Phone,
            title: 'Institutional & developer desk',
            body: 'Portfolio reviews, capital introductions, and launch planning for marquee developments.',
          },
          {
            icon: MapPin,
            title: 'New market coverage',
            body: 'Request research packs or on-site diligence for geographies we are actively mapping.',
          },
        ]
      : productKind === 'editorial'
        ? [
            {
              icon: FileText,
              title: 'Editorial submissions',
              body: 'Pitch essays, columns, and long-form ideas that fit the publication.',
            },
            {
              icon: Mail,
              title: 'Newsletter partnerships',
              body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.',
            },
            {
              icon: Sparkles,
              title: 'Contributor support',
              body: 'Get help with voice, formatting, and publication workflow questions.',
            },
          ]
        : productKind === 'visual'
          ? [
              {
                icon: ImageIcon,
                title: 'Creator collaborations',
                body: 'Discuss gallery launches, creator features, and visual campaigns.',
              },
              {
                icon: Sparkles,
                title: 'Licensing and use',
                body: 'Reach out about usage rights, commercial requests, and visual partnerships.',
              },
              {
                icon: Mail,
                title: 'Media kits',
                body: 'Request creator decks, editorial support, or visual feature placement.',
              },
            ]
          : [
              {
                icon: Bookmark,
                title: 'Collection submissions',
                body: 'Suggest resources, boards, and links that deserve a place in the library.',
              },
              {
                icon: Mail,
                title: 'Resource partnerships',
                body: 'Coordinate curation projects, reference pages, and link programs.',
              },
              {
                icon: Sparkles,
                title: 'Curator support',
                body: 'Need help organizing shelves, collections, or profile-connected boards?',
              },
            ]

  return (
    <LuxuryBrandShell
      eyebrow="Contact"
      title={`Speak with ${SITE_CONFIG.name}`}
      description="Share a few details about your goals—acquisition, disposition, leasing, or research—and we will route your message to the right specialist."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1D2B3A] sm:text-3xl">Ways we can help</h2>
            <p className="mt-3 text-sm leading-7 text-[#1D2B3A]/70">
              Every inquiry is reviewed by a human advisor. Expect a thoughtful first response—not an automated ticket
              queue.
            </p>
          </div>
          <ul className="space-y-4">
            {lanes.map((lane) => (
              <li
                key={lane.title}
                className="flex gap-4 rounded-3xl border border-[#A68955]/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#A68955]/30 bg-[#F9F6F1]">
                  <lane.icon className="h-5 w-5 text-[#A68955]" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#1D2B3A]">{lane.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-[#1D2B3A]/70">{lane.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-[#A68955]/25 bg-white p-7 shadow-sm sm:p-9">
          <h2 className="font-display text-2xl font-semibold text-[#1D2B3A]">Send a message</h2>
          <p className="mt-2 text-sm text-[#1D2B3A]/65">
            Fields below are for planning only; submitting does not create a client relationship until confirmed in
            writing.
          </p>
          <form className="mt-8 grid gap-4">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[#1D2B3A]">Full name</span>
              <input
                className="h-12 w-full rounded-xl border border-[#A68955]/25 bg-[#F9F6F1]/50 px-4 text-sm text-[#1D2B3A] placeholder:text-[#1D2B3A]/40 focus:border-[#A68955] focus:outline-none focus:ring-2 focus:ring-[#A68955]/25"
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[#1D2B3A]">Email</span>
              <input
                type="email"
                className="h-12 w-full rounded-xl border border-[#A68955]/25 bg-[#F9F6F1]/50 px-4 text-sm text-[#1D2B3A] placeholder:text-[#1D2B3A]/40 focus:border-[#A68955] focus:outline-none focus:ring-2 focus:ring-[#A68955]/25"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[#1D2B3A]">Topic</span>
              <input
                className="h-12 w-full rounded-xl border border-[#A68955]/25 bg-[#F9F6F1]/50 px-4 text-sm text-[#1D2B3A] placeholder:text-[#1D2B3A]/40 focus:border-[#A68955] focus:outline-none focus:ring-2 focus:ring-[#A68955]/25"
                placeholder="e.g. Off-market acquisition in Mumbai"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[#1D2B3A]">How can we help?</span>
              <textarea
                className="min-h-[168px] w-full rounded-2xl border border-[#A68955]/25 bg-[#F9F6F1]/50 px-4 py-3 text-sm text-[#1D2B3A] placeholder:text-[#1D2B3A]/40 focus:border-[#A68955] focus:outline-none focus:ring-2 focus:ring-[#A68955]/25"
                placeholder="Share context: timeline, budget range, property type, and the outcome you are seeking."
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#A68955] px-6 text-sm font-semibold text-[#1D2B3A] transition-colors hover:bg-[#b89968]"
            >
              Submit inquiry
            </button>
          </form>
        </div>
      </div>
    </LuxuryBrandShell>
  )
}
