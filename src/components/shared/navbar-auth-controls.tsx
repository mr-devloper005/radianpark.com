'use client'

import Link from 'next/link'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-11 gap-1 rounded-full px-1.5 text-[#111] hover:bg-black/8"
        >
          <Avatar className="h-9 w-9 border border-[#e3e3e3]">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#6e9e6e] text-sm font-semibold text-white">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="hidden h-4 w-4 opacity-60 sm:block" />
          <span className="sr-only">Account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] rounded-3xl border border-[#e3e3e3] bg-white p-0 shadow-xl"
      >
        <div className="flex gap-4 p-4">
          <Avatar className="h-14 w-14 shrink-0 border border-[#e3e3e3]">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#6e9e6e] text-lg font-semibold text-white">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#767676]">Currently in</p>
            <p className="truncate text-base font-semibold text-[#111]">{user.name}</p>
            <p className="text-sm text-[#767676]">Personal</p>
            <p className="truncate text-sm text-[#111]">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-0 bg-[#e3e3e3]" />
        <div className="p-2">
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5 text-[#111] focus:bg-black/5">
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="my-0 bg-[#e3e3e3]" />
        <div className="p-2">
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer rounded-xl px-3 py-2.5 text-[#111] focus:bg-black/5"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
