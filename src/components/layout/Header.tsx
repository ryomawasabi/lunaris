'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAdmin, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Soul Stone Discovery', href: '/crystal-quiz' },
    { label: 'Gift Box', href: '/gift-box' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-sm'
          : 'bg-cream'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        {/* Desktop Header */}
        <nav className="hidden md:flex items-center justify-between h-20">
          {/* Left Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl tracking-widest-xl text-dark">
              YINYANG GUARDIAN
            </h1>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-sans font-medium text-dark hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6 ml-8">
            <button
              aria-label="Search"
              className="text-dark hover:text-gold transition-colors"
            >
              <Search size={20} />
            </button>

            {/* User Menu */}
            {isLoading ? (
              <div className="w-5 h-5 rounded-full bg-stone-light animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User account"
                  className="text-dark hover:text-gold transition-colors"
                >
                  <User size={20} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cream border border-stone-light rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-stone-light">
                      <p className="text-xs font-sans text-warm-light">Signed in as</p>
                      <p className="text-sm font-sans text-dark truncate">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-sm font-sans text-dark hover:bg-stone-light rounded transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setUserMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-sans text-dark hover:bg-stone-light rounded transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-dark hover:text-gold transition-colors"
                aria-label="Sign in"
              >
                <User size={20} />
              </Link>
            )}

            <button
              aria-label="Wishlist"
              className="text-dark hover:text-gold transition-colors"
            >
              <Heart size={20} />
            </button>
            <div className="relative">
              <button
                aria-label="Shopping bag"
                className="text-dark hover:text-gold transition-colors"
              >
                <ShoppingBag size={20} />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-dark text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-16">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="text-dark"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-xl tracking-widest-xl text-dark">
              YINYANG GUARDIAN
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="text-dark"
            >
              <Search size={20} />
            </button>
            <div className="relative">
              <button aria-label="Shopping bag" className="text-dark">
                <ShoppingBag size={20} />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-dark text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-sans font-medium text-dark hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-6 pt-4 border-t border-stone">
              {isLoading ? (
                <div className="w-5 h-5 rounded-full bg-stone-light animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <div className="text-xs font-sans text-warm-light">{user.email}</div>
                  <button
                    onClick={() => signOut()}
                    aria-label="Sign out"
                    className="text-dark hover:text-gold transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-dark hover:text-gold transition-colors"
                  aria-label="Sign in"
                >
                  <User size={20} />
                </Link>
              )}
              <button aria-label="Wishlist" className="text-dark">
                <Heart size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
