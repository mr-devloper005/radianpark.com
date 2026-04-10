'use client'

import type { ComponentType } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Bell,
  Compass,
  Home,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { NAVBAR_OVERRIDE_ENABLED, NavbarOverride } from '@/overrides/navbar'

const NavbarAuthControls = dynamic(
  () => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls),
  { ssr: false, loading: () => <div className="h-10 w-10 shrink-0 rounded-full bg-[#e2e2e2]" /> },
)

const taskIcons: Record<TaskKey, ComponentType<{ className?: string }>> = {
  article: ImageIcon,
  listing: ImageIcon,
  sbm: ImageIcon,
  classified: ImageIcon,
  image: ImageIcon,
  profile: User,
  social: MessageCircle,
  pdf: ImageIcon,
  org: User,
  comment: ImageIcon,
}

function NavIconButton({
  href,
  label,
  active,
  children,
}: {
  href: string
  label: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
            active ? 'bg-black text-white' : 'text-[#111] hover:bg-black/8',
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="border-0 bg-[#111] text-xs text-white">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export function Navbar() {
  if (NAVBAR_OVERRIDE_ENABLED) {
    return <NavbarOverride />
  }

  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, authHydrated } = useAuth()
  const [q, setQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((t) => t.enabled), [])
  const exploreTask = enabledTasks.find((t) => t.key === 'image') || enabledTasks[0]
  const profileTask = enabledTasks.find((t) => t.key === 'profile')
  const primaryCreateTask = enabledTasks.find((t) => t.key === 'image') || enabledTasks[0]

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`)
    else router.push('/search')
  }

  const rail = (
    <aside
      data-pinterest-rail
      className="fixed bottom-0 left-0 top-0 z-[60] hidden w-[4.5rem] flex-col border-r border-[#e3e3e3] bg-white xl:flex"
    >
      <div className="flex flex-1 flex-col items-center gap-1 py-3">
        <Link href="/" className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#e60023] text-white shadow-sm">
          <img src="/favicon.png?v=20260401" alt="" className="h-7 w-7 object-contain brightness-0 invert" />
          <span className="sr-only">{SITE_CONFIG.name} home</span>
        </Link>
        <NavIconButton href="/" label="Home" active={pathname === '/'}>
          <Home className="h-7 w-7" strokeWidth={pathname === '/' ? 2.5 : 2} />
        </NavIconButton>
        {exploreTask ? (
          <NavIconButton
            href={exploreTask.route}
            label="Explore"
            active={pathname.startsWith(exploreTask.route)}
          >
            <Compass className="h-7 w-7" strokeWidth={pathname.startsWith(exploreTask.route) ? 2.5 : 2} />
          </NavIconButton>
        ) : null}
        {authHydrated && isAuthenticated && primaryCreateTask ? (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-full text-[#111] hover:bg-black/8"
                  >
                    <Plus className="h-7 w-7" />
                    <span className="sr-only">Create</span>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-0 bg-[#111] text-xs text-white">
                Create
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" className="w-56 rounded-2xl border border-[#e3e3e3] bg-white p-1 shadow-lg">
              {enabledTasks.map((task) => {
                const Icon = taskIcons[task.key] || ImageIcon
                return (
                  <DropdownMenuItem key={task.key} asChild className="rounded-xl">
                    <Link href={`/create/${task.key}`} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      New {task.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {authHydrated && isAuthenticated ? (
          <>
            <NavIconButton
              href="/dashboard/notifications"
              label="Notifications"
              active={pathname.startsWith('/dashboard/notifications')}
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <Bell className="h-7 w-7" strokeWidth={2} />
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#e60023]" />
              </span>
            </NavIconButton>
            {profileTask ? (
              <NavIconButton
                href={profileTask.route}
                label="Profile"
                active={pathname.startsWith(profileTask.route)}
              >
                <User className="h-7 w-7" strokeWidth={pathname.startsWith(profileTask.route) ? 2.5 : 2} />
              </NavIconButton>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="flex flex-col items-center gap-1 border-t border-[#e3e3e3] py-3">
        <NavIconButton href="/settings" label="Settings" active={pathname.startsWith('/settings')}>
          <Settings className="h-6 w-6" strokeWidth={2} />
        </NavIconButton>
      </div>
    </aside>
  )

  const topBar = (
    <header
      data-pinterest-top
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-[#e3e3e3] bg-[#f1f1f1] px-3 sm:px-4',
        'xl:left-[4.5rem]',
      )}
    >
      <div className="flex items-center gap-2 xl:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="rounded-full text-[#111] hover:bg-black/8">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] border-[#e3e3e3] bg-white p-0">
            <SheetHeader className="border-b border-[#e3e3e3] p-4 text-left">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e60023]">
                  <img src="/favicon.png?v=20260401" alt="" className="h-5 w-5 object-contain brightness-0 invert" />
                </span>
                {SITE_CONFIG.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5"
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              {exploreTask ? (
                <Link
                  href={exploreTask.route}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5"
                >
                  <Compass className="h-5 w-5" />
                  Explore
                </Link>
              ) : null}
              {profileTask ? (
                <Link
                  href={profileTask.route}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5"
                >
                  <User className="h-5 w-5" />
                  Profiles
                </Link>
              ) : null}
              {authHydrated && isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5"
                  >
                    <Bell className="h-5 w-5" />
                    Notifications
                  </Link>
                  {primaryCreateTask ? (
                    <Link
                      href={`/create/${primaryCreateTask.key}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5"
                    >
                      <Plus className="h-5 w-5" />
                      Create
                    </Link>
                  ) : null}
                </>
              ) : null}
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              {authHydrated && !isAuthenticated ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-[#e3e3e3] pt-4">
                  <Button asChild className="h-11 rounded-full bg-[#e60023] text-white hover:bg-[#ad081b]">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-full border-[#e3e3e3]">
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              ) : null}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e60023] xl:hidden">
          <img src="/favicon.png?v=20260401" alt="" className="h-5 w-5 object-contain brightness-0 invert" />
        </Link>
      </div>

      <form onSubmit={onSearch} className="mx-auto flex max-w-3xl flex-1 items-center gap-2">
        <div className="relative flex h-12 w-full items-center rounded-full bg-[#e3e3e3] px-4 transition-colors focus-within:bg-[#d9d9d9]">
          <Search className="pointer-events-none h-5 w-5 shrink-0 text-[#5f5f5f]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ideas, creators, and images"
            className="h-full w-full border-0 bg-transparent pl-3 pr-2 text-sm text-[#111] placeholder:text-[#767676] focus:outline-none"
            aria-label="Search"
          />
        </div>
      </form>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {!authHydrated ? (
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#e2e2e2]" aria-hidden />
        ) : isAuthenticated ? (
          <NavbarAuthControls />
        ) : (
          <>
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-full text-[#111] hover:bg-black/8 sm:inline-flex"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-full bg-[#e60023] px-4 text-sm text-white hover:bg-[#ad081b]">
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )

  return (
    <TooltipProvider delayDuration={300}>
      {rail}
      {topBar}
    </TooltipProvider>
  )
}
