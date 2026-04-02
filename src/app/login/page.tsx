'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!captchaToken) {
      setError('Please complete the verification.')
      return
    }

    setIsLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      })

      if (authError) {
        setError(authError.message || 'Failed to sign in')
        return
      }

      if (data.user) {
        const isAdmin = data.user.user_metadata?.role === 'admin'
        if (isAdmin) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-md mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-dark mb-2">Sign In</h1>
          <p className="text-warm font-sans text-sm">
            Access your YINYANG GUARDIAN account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-sans font-medium text-dark mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-warm-light" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-sans font-medium text-dark mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-warm-light" size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-warm-light hover:text-dark transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Turnstile CAPTCHA */}
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              options={{
                theme: 'light',
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-stone-light"></div>
          <span className="text-warm-light text-xs font-sans">OR</span>
          <div className="flex-1 h-px bg-stone-light"></div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-dark text-sm font-sans mb-2">
            Don&apos;t have an account?
          </p>
          <Link
            href="/signup"
            className="text-gold hover:text-gold-dark font-sans font-medium transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  )
}
