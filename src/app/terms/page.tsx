import { LuxuryBrandShell } from '@/components/shared/luxury-brand-shell'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { SITE_CONFIG } from '@/lib/site-config'

const sections = [
  {
    id: 'agreement',
    title: 'Agreement to terms',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the websites, applications, and
        services operated by {SITE_CONFIG.name} (collectively, the &quot;Services&quot;). By accessing or using the
        Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the
        Services.
      </p>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        You must be at least the age of majority in your jurisdiction and capable of entering a binding contract to use
        the Services. If you use the Services on behalf of an organization, you represent that you have authority to
        bind that organization to these Terms.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: 'Accounts and security',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>
          You may need to create an account to access certain features. You agree to provide accurate information and
          to keep your credentials confidential. You are responsible for activity under your account and must notify us
          promptly of unauthorized use.
        </p>
        <p>We may suspend or terminate accounts that violate these Terms or present security or legal risk.</p>
      </div>
    ),
  },
  {
    id: 'services',
    title: 'Nature of the Services',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>
          The Services may include property listings, market information, educational content, and tools to contact our
          team. Information is provided for general purposes and may not reflect real-time availability or pricing unless
          expressly stated.
        </p>
        <p>
          Nothing on the Services constitutes legal, tax, or investment advice. You should consult qualified
          professionals before making decisions.
        </p>
      </div>
    ),
  },
  {
    id: 'conduct',
    title: 'Acceptable use',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Violate applicable laws or infringe others&apos; rights.</li>
          <li>Scrape, crawl, or harvest data from the Services without permission.</li>
          <li>Upload malware, interfere with infrastructure, or attempt unauthorized access.</li>
          <li>Harass, defraud, or impersonate any person or entity.</li>
          <li>Use the Services to distribute spam or misleading information about properties or parties.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'content',
    title: 'Content and intellectual property',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>
          The Services, including text, graphics, logos, and software, are owned by {SITE_CONFIG.name} or its licensors
          and are protected by intellectual property laws. Subject to these Terms, we grant you a limited, non-exclusive,
          non-transferable license to access and use the Services for personal or internal business purposes.
        </p>
        <p>
          If you submit content (such as inquiries, feedback, or uploaded files), you grant us a license to use, store,
          and display that content as needed to operate and improve the Services, without waiving any ownership you may
          have in your materials.
        </p>
      </div>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-party links and services',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        The Services may link to third-party websites or integrate third-party tools. We are not responsible for
        third-party content or practices. Your use of third-party services is subject to their terms and policies.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER
        EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
        WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE_CONFIG.name.toUpperCase()} AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
        AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
        LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES. OUR AGGREGATE LIABILITY FOR ANY CLAIM
        RELATING TO THE SERVICES WILL NOT EXCEED THE GREATER OF ONE HUNDRED DOLLARS (USD) OR THE AMOUNTS YOU PAID US FOR
        THE SERVICES GIVING RISE TO THE CLAIM IN THE TWELVE MONTHS PRECEDING THE CLAIM.
      </p>
    ),
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        You agree to indemnify and hold harmless {SITE_CONFIG.name} and its affiliates from claims, damages, losses, and
        expenses (including reasonable attorneys&apos; fees) arising from your use of the Services, your content, or your
        violation of these Terms.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        You may stop using the Services at any time. We may suspend or terminate access to the Services for conduct that
        we believe violates these Terms or harms users, us, or third parties. Provisions that by their nature should
        survive termination will survive, including intellectual property, disclaimers, limitation of liability, and
        governing law.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Governing law and disputes',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        These Terms are governed by the laws of the jurisdiction in which {SITE_CONFIG.name} primarily operates, without
        regard to conflict-of-law principles. Courts in that jurisdiction will have exclusive venue for disputes, unless
        applicable law requires otherwise.
      </p>
    ),
  },
  {
    id: 'changes-terms',
    title: 'Changes',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        We may modify these Terms from time to time. We will post the updated Terms with a revised date. Material changes
        may be communicated through the Services or by email where appropriate. Continued use after the effective date
        constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    id: 'contact-terms',
    title: 'Contact',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        For questions about these Terms, please reach us via the{' '}
        <a href="/contact" className="font-semibold text-[#A68955] underline-offset-4 hover:underline">
          Contact
        </a>{' '}
        page.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LuxuryBrandShell
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms set the rules for using our platform, content, and advisory services."
    >
      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:items-start">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-[#A68955]/20 bg-white/90 p-4 text-sm shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A68955]">On this page</p>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-lg px-2 py-1.5 text-[#1D2B3A]/80 transition-colors hover:bg-[#F9F6F1] hover:text-[#1D2B3A]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 space-y-8">
          <Card className="rounded-3xl border border-[#A68955]/25 bg-white shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A68955]">Last updated</p>
              <p className="mt-2 font-display text-lg font-semibold text-[#1D2B3A]">April 13, 2026</p>
              <p className="mt-4 text-sm leading-7 text-[#1D2B3A]/75">
                Please read these Terms together with our{' '}
                <a href="/privacy" className="font-semibold text-[#A68955] underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                . Capitalized terms used in the Privacy Policy have the same meaning here unless otherwise defined.
              </p>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="rounded-3xl border border-[#A68955]/20 bg-white px-4 shadow-sm sm:px-6">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} id={section.id} className="border-[#A68955]/15">
                <AccordionTrigger className="font-display text-base font-semibold text-[#1D2B3A] hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="pb-6">{section.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </LuxuryBrandShell>
  )
}
