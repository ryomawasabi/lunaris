'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  Layers,
  Loader,
  ShoppingCart,
  Globe,
  BarChart3,
  Settings,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push('/login')
      } else {
        setChecked(true)
      }
    }
  }, [user, isAdmin, isLoading, router])

  if (isLoading || !checked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader size={32} className="animate-spin text-gold" />
      </div>
    )
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: 'Collections',
      href: '/admin/collections',
      icon: Layers,
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: Grid3x3,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      label: 'SEO',
      href: '/admin/seo',
      icon: Globe,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-light min-h-screen">
          <div className="p-6 border-b border-stone-light">
            <Link href="/" className="block">
              <h1 className="font-serif text-xl text-dark tracking-wide">YINYANG GUARDIAN</h1>
              <p className="text-xs text-warm-light font-sans mt-1">Admin Portal</p>
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-sans text-dark hover:bg-stone-light rounded-lg transition-colors"
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
