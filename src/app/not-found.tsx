import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found. Explore our crystal jewelry collection at YINYANG GUARDIAN.',
}

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Yin-Yang Symbol */}
        <div className="mb-8 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
            <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm" />
            <path d="M40 2 A38 38 0 0 1 40 78 A19 19 0 0 1 40 40 A19 19 0 0 0 40 2" fill="currentColor" className="text-dark" />
            <path d="M40 2 A38 38 0 0 0 40 78 A19 19 0 0 0 40 40 A19 19 0 0 1 40 2" fill="currentColor" className="text-stone-light" />
            <circle cx="40" cy="21" r="5.5" fill="currentColor" className="text-stone-light" />
            <circle cx="40" cy="59" r="5.5" fill="currentColor" className="text-dark" />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="font-serif text-7xl md:text-8xl text-dark/20 font-light mb-4 tracking-wider">
          404
        </h1>

        {/* Message */}
        <h2 className="font-serif text-2xl md:text-3xl text-dark mb-4">
          This path has wandered astray
        </h2>
        <p className="text-warm text-base mb-10 leading-relaxed">
          The page you&apos;re seeking seems to have drifted beyond our realm.
          Let us guide you back to balance.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-dark text-cream font-sans text-sm uppercase tracking-wider rounded hover:bg-dark/90 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 border border-dark text-dark font-sans text-sm uppercase tracking-wider rounded hover:bg-dark hover:text-cream transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </main>
  )
}
