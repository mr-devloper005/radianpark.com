import { LuxuryBrandShell } from '@/components/shared/luxury-brand-shell'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { SITE_CONFIG } from '@/lib/site-config'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        This Privacy Policy describes how {SITE_CONFIG.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects,
        uses, discloses, and safeguards information when you use our website, applications, and related services
        (collectively, the &quot;Services&quot;). By using the Services, you agree to the practices described here. If you
        do not agree, please discontinue use of the Services.
      </p>
    ),
  },
  {
    id: 'collect',
    title: 'Information we collect',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>We may collect the following categories of information, depending on how you interact with us:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#1D2B3A]">Account and profile data:</strong> name, email address, phone number,
            company, preferences, and credentials you provide when registering or updating your profile.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Property and inquiry details:</strong> information you submit about
            listings, tours, financing questions, or investment goals.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Usage and device data:</strong> IP address, browser type, device
            identifiers, pages viewed, referring URLs, and approximate location derived from IP.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Communications:</strong> messages you send through forms, chat, or email,
            including metadata such as timestamps.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Cookies and similar technologies:</strong> as described in our cookie
            practices within this policy.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'use',
    title: 'How we use information',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, personalize, and improve the Services and client experience.</li>
          <li>Respond to inquiries, schedule consultations, and facilitate transactions you request.</li>
          <li>Send administrative notices, security alerts, and (where permitted) marketing communications.</li>
          <li>Analyze usage trends, maintain platform security, and detect fraud or misuse.</li>
          <li>Comply with legal obligations and enforce our terms and policies.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'share',
    title: 'Sharing and disclosure',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>We do not sell your personal information. We may share information in these circumstances:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#1D2B3A]">Service providers:</strong> vendors that assist with hosting, analytics,
            customer support, email delivery, or document management, bound by confidentiality obligations.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Professional partners:</strong> brokers, lenders, title firms, or legal
            counsel when you ask us to coordinate a transaction or introduction.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Legal and safety:</strong> when required by law, court order, or to
            protect rights, safety, and integrity of our users and the public.
          </li>
          <li>
            <strong className="text-[#1D2B3A]">Business transfers:</strong> in connection with a merger, acquisition, or
            asset sale, subject to appropriate safeguards.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'retention',
    title: 'Retention',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        We retain information only as long as necessary for the purposes described above, including satisfying legal,
        accounting, or reporting requirements. Retention periods vary based on the nature of the data and applicable
        law. When retention is no longer required, we delete or anonymize information in line with internal policies.
      </p>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights and choices',
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#1D2B3A]/75">
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal
          information, and to object to or restrict certain processing. You may also opt out of marketing emails via
          the unsubscribe link in those messages.
        </p>
        <p>
          To exercise applicable rights, contact us using the details on our Contact page. We may verify your request
          before responding. You may also lodge a complaint with a supervisory authority where available.
        </p>
      </div>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        We implement administrative, technical, and organizational measures designed to protect personal information.
        No method of transmission over the Internet is completely secure; we encourage you to use strong passwords and
        safeguard your credentials.
      </p>
    ),
  },
  {
    id: 'international',
    title: 'International transfers',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        If you access the Services from outside the country where we operate, your information may be processed in
        countries that may have different data protection laws. Where required, we use appropriate safeguards for
        cross-border transfers.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        The Services are not directed to children under 16, and we do not knowingly collect personal information from
        children. If you believe we have collected such information, please contact us so we can delete it promptly.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        We may update this Privacy Policy from time to time. We will post the revised version with a new &quot;Last
        updated&quot; date and, where appropriate, provide additional notice. Continued use of the Services after
        changes constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    content: (
      <p className="text-sm leading-7 text-[#1D2B3A]/75">
        Questions about this Privacy Policy or our data practices may be directed through the{' '}
        <a href="/contact" className="font-semibold text-[#A68955] underline-offset-4 hover:underline">
          Contact
        </a>{' '}
        page on this site.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LuxuryBrandShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="We are committed to handling personal information responsibly and in line with this policy and applicable law."
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
                This policy is designed to be read alongside our{' '}
                <a href="/terms" className="font-semibold text-[#A68955] underline-offset-4 hover:underline">
                  Terms of Service
                </a>
                . Together, they explain the rules that apply when you use {SITE_CONFIG.name}.
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
