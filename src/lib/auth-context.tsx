'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { currentUser } from '@/data/mock-data'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'

type LocalAccountRecord = { email: string; password: string; name: string }

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  /** True after client has read persisted user from storage (avoids auth UI flash). */
  authHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

function loadLocalAccounts(): LocalAccountRecord[] {
  return loadFromStorage<LocalAccountRecord[]>(storageKeys.localAccounts, [])
}

function saveLocalAccounts(accounts: LocalAccountRecord[]) {
  saveToStorage(storageKeys.localAccounts, accounts)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authHydrated, setAuthHydrated] = useState(false)

  useEffect(() => {
    const storedUser = loadFromStorage<User | null>(storageKeys.user, null)
    if (storedUser) {
      setUser(storedUser)
    }
    setAuthHydrated(true)
  }, [])

  const buildUser = useCallback((overrides: Partial<User>) => {
    const joinedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    return {
      ...currentUser,
      id: `user-${Date.now()}`,
      joinedDate,
      followers: 0,
      following: 0,
      isVerified: false,
      ...overrides,
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) {
      setIsLoading(false)
      throw new Error('Enter your email and password.')
    }

    const accounts = loadLocalAccounts()
    const match = accounts.find((a) => a.email.trim().toLowerCase() === normalizedEmail)
    if (!match || match.password !== password) {
      setIsLoading(false)
      throw new Error('Invalid email or password.')
    }

    const storedUser = loadFromStorage<User | null>(storageKeys.user, null)
    const nextUser =
      storedUser && storedUser.email.trim().toLowerCase() === normalizedEmail
        ? { ...storedUser, name: match.name || storedUser.name }
        : buildUser({
            name: match.name,
            email: match.email.trim(),
          })

    setUser(nextUser)
    saveToStorage(storageKeys.user, nextUser)
    setIsLoading(false)
  }, [buildUser])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKeys.user)
    }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const trimmedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    if (!trimmedName || !normalizedEmail || !password) {
      setIsLoading(false)
      throw new Error('Fill in name, email, and password.')
    }

    const accounts = loadLocalAccounts()
    if (accounts.some((a) => a.email.trim().toLowerCase() === normalizedEmail)) {
      setIsLoading(false)
      throw new Error('An account with this email already exists.')
    }

    const record: LocalAccountRecord = {
      name: trimmedName,
      email: email.trim(),
      password,
    }
    saveLocalAccounts([...accounts, record])

    const nextUser = buildUser({
      name: trimmedName,
      email: email.trim(),
    })
    setUser(nextUser)
    saveToStorage(storageKeys.user, nextUser)
    setIsLoading(false)
  }, [buildUser])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const nextUser = { ...prev, ...updates }
      saveToStorage(storageKeys.user, nextUser)
      if (typeof updates.name === 'string' && updates.name.trim()) {
        const accounts = loadLocalAccounts()
        const i = accounts.findIndex(
          (a) => a.email.trim().toLowerCase() === nextUser.email.trim().toLowerCase(),
        )
        if (i >= 0) {
          const next = [...accounts]
          next[i] = { ...next[i], name: updates.name.trim() }
          saveLocalAccounts(next)
        }
      }
      return nextUser
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authHydrated,
        login,
        logout,
        signup,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
