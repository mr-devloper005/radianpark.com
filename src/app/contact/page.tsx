import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
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
            title: 'Business onboarding',
            body: 'Add listings, verify operational details, and bring your business surface live quickly.',
          },
          {
            icon: Phone,
            title: 'Partnership support',
            body: 'Talk through bulk publishing, local growth, and operational setup questions.',
          },
          {
            icon: MapPin,
            title: 'Coverage requests',
            body: 'Need a new geography or category lane? We can shape the directory around it.',
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
    <div className="min-h-screen bg-[#f1f1f1] text-[#111]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#767676]">
              Contact {SITE_CONFIG.name}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#767676]">
              Tell us what you are trying to publish, fix, or launch. We will route it through the right lane instead
              of forcing every request into the same support bucket.
            </p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-3xl border border-[#ececec] bg-[#fafafa] p-5">
                  <lane.icon className="h-5 w-5 text-[#111]" />
                  <h2 className="mt-3 text-xl font-semibold text-[#111]">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[#767676]">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#e3e3e3] bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111]">Send a message</h2>
            <form className="mt-6 grid gap-4">
              <input
                className="h-12 w-full rounded-xl border border-[#e3e3e3] bg-white px-4 text-sm text-[#111] placeholder:text-[#767676] focus:outline-none focus:ring-2 focus:ring-[#e60023]/25"
                placeholder="Your name"
              />
              <input
                className="h-12 w-full rounded-xl border border-[#e3e3e3] bg-white px-4 text-sm text-[#111] placeholder:text-[#767676] focus:outline-none focus:ring-2 focus:ring-[#e60023]/25"
                placeholder="Email address"
              />
              <input
                className="h-12 w-full rounded-xl border border-[#e3e3e3] bg-white px-4 text-sm text-[#111] placeholder:text-[#767676] focus:outline-none focus:ring-2 focus:ring-[#e60023]/25"
                placeholder="What do you need help with?"
              />
              <textarea
                className="min-h-[180px] w-full rounded-2xl border border-[#e3e3e3] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-[#767676] focus:outline-none focus:ring-2 focus:ring-[#e60023]/25"
                placeholder="Share the full context so we can respond with the right next step."
              />
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#e60023] px-6 text-sm font-semibold text-white hover:bg-[#ad081b]"
              >
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
