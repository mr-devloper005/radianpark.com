import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { FOOTER_OVERRIDE_ENABLED, FooterOverride } from '@/overrides/footer'

export function Footer() {
  if (FOOTER_OVERRIDE_ENABLED) {
    return <FooterOverride />
  }

  const year = new Date().getFullYear()
  const links = SITE_CONFIG.tasks.filter((t) => t.enabled)

  return (
    <footer className="border-t border-[#e3e3e3] bg-[#f1f1f1] text-[#111]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#767676]">
          <span className="font-semibold text-[#111]">{SITE_CONFIG.name}</span>
          <span aria-hidden>·</span>
          <span>Image sharing &amp; social profiles</span>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-semibold text-[#111]">
          {links.map((task) => (
            <Link key={task.key} href={task.route} className="hover:underline">
              {task.label}
            </Link>
          ))}
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact us
          </Link>
        </nav>
      </div>
      <div className="border-t border-[#e3e3e3] py-4 text-center text-xs text-[#767676]">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
