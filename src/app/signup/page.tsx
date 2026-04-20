'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Mail, Lock, User as UserIcon, AlertCircle, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!captchaToken) {
      setError(t('auth.pleaseComplete'))
      return
    }

    setIsLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          captchaToken,
        },
      })

      if (authError) {
        setError(authError.message || 'Failed to create account')
        return
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: 'customer',
        })

        setIsSuccess(true)
        setEmail('')
        setPassword('')
        setFullName('')

        setTimeout(() => {
          router.push('/login')
        }, 3000)
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
          <h1 className="font-serif text-4xl text-dark mb-2">{t('auth.createAccount')}</h1>
          <p className="text-warm font-sans text-sm">
            {t('auth.createAccountDescription')}
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-emerald-900 text-sm font-sans font-medium mb-1">
                {t('auth.accountCreated')}
              </p>
              <p className="text-emerald-700 text-sm font-sans">
                {t('auth.redirecting')}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !isSuccess && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Signup Form */}
        {!isSuccess && (
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-sans font-medium text-dark mb-2"
              >
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 text-warm-light" size={18} />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans font-medium text-dark mb-2"
              >
                {t('auth.email')}
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
                {t('auth.password')}
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
              <p className="text-xs text-warm-light font-sans mt-2">
                {t('auth.passwordRecommendation')}
              </p>
            </div>

            {/* Turnstile CAPTCHA */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAACzTJrkbtZ3O5wdz'}
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => setCaptchaToken(null)}
                onExpire={() => setCaptchaToken(null)}
                options={{
                  theme: 'light',
                  size: 'normal',
                }}
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  {t('auth.createAccount')}
                </>
              ) : (
                t('auth.createAccount')
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-stone-light"></div>
          <span className="text-warm-light text-xs font-sans">{t('auth.or')}</span>
          <div className="flex-1 h-px bg-stone-light"></div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-dark text-sm font-sans mb-2">
            {t('auth.haveAccount')}
          </p>
          <Link
            href="/login"
            className="text-gold hover:text-gold-dark font-sans font-medium transition-colors"
          >
            {t('auth.signIn')}
          </Link>
        </div>
      </div>
    </main>
  )
}
