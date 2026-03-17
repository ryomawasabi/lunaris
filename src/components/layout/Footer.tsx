import Link from 'next/link';
import { Instagram, Facebook, MapPin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-cream">
      {/* Main Footer Content */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Column 1: Brand */}
          <div>
            <h2 className="font-serif text-2xl tracking-widest-xl mb-4">
              LUNARIS
            </h2>
            <p className="text-sm text-stone mb-8 leading-relaxed">
              Sacred jewelry channeling ancient wisdom, cosmic energy, and spiritual protection for your soul&apos;s journey.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-cream hover:text-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="text-cream hover:text-gold transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://pinterest.com"
                aria-label="Pinterest"
                className="text-cream hover:text-gold transition-colors"
              >
                <MapPin size={20} />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-cream hover:text-gold transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-gold">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products?type=necklaces"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=bracelets"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Bracelets
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=earrings"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=rings"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=bestselling"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-gold">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/collections/protection"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Protection
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/love-harmony"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Love & Harmony
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/prosperity"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Prosperity
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/evil-eye"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Evil Eye
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/tree-of-life"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Tree of Life
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-gold">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-warm/20">
        <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone">
            <p>
              &copy; {currentYear} LUNARIS. All rights reserved.
            </p>

            {/* Payment Icons */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-wider">Secure Payments:</span>
              <div className="flex gap-3 text-xs font-semibold">
                <span className="px-2 py-1 border border-warm/30 rounded">Visa</span>
                <span className="px-2 py-1 border border-warm/30 rounded">MC</span>
                <span className="px-2 py-1 border border-warm/30 rounded">Amex</span>
                <span className="px-2 py-1 border border-warm/30 rounded">PayPal</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-cream transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-cream transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
