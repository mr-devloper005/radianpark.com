import { PageShell } from '@/components/shared/page-shell'
import { Bell } from 'lucide-react'

export default function DashboardNotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      description="Stay updated on your activity and community engagement."
    >
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#e3e3e3] bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f1f1] text-[#767676]">
          <Bell className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h2 className="mt-6 text-lg font-semibold text-[#111]">You&apos;re all caught up</h2>
        <p className="mt-2 max-w-sm text-sm text-[#767676]">
          New activity will show up here. We don&apos;t use sample notifications—only real updates when you use the app.
        </p>
      </div>
    </PageShell>
  )
}
