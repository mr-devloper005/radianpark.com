import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  { title: 'Data We Collect', body: 'Account information, usage analytics, and content you submit.' },
  { title: 'How We Use Data', body: 'To personalize your experience, improve search, and keep the platform secure.' },
  { title: 'Your Choices', body: 'You can manage email preferences and delete your account at any time.' },
]

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      description="How we collect, use, and protect your information."
    >
      <Card className="rounded-3xl border border-[#e3e3e3] bg-white shadow-sm">
        <CardContent className="space-y-4 p-6">
          <p className="text-xs text-[#767676]">Last updated: March 16, 2026</p>
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-[#ececec] bg-[#fafafa] p-4">
              <h3 className="text-sm font-semibold text-[#111]">{section.title}</h3>
              <p className="mt-2 text-sm text-[#767676]">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}
