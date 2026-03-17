'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = (currentUser: User | null) => {
      if (!currentUser) return false
      // Check user_metadata for admin role (no RLS needed)
      return currentUser.user_metadata?.role === 'admin'
    }

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const currentUser = session?.user || null
        setUser(currentUser)
        setIsAdmin(checkAdmin(currentUser))
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      setIsAdmin(checkAdmin(currentUser))
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        signOut: handleSignOut,
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
