'use client';

import Link from 'next/link';
import { Instagram, Facebook, MapPin, Twitter } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-dark text-cream texture-noise-dark">
      {/* Main Footer Content */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Column 1: Brand */}
          <div>
            <h2 className="font-serif text-2xl tracking-widest-xl mb-4">
              YINYANG GUARDIAN
            </h2>
            <p className="text-sm text-stone mb-8 leading-relaxed">
              {t('footer.brandDescription')}
            </p>
            <div className="flex items-center gap-6 mb-6">
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
            <LanguageSwitcher variant="dark" />
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-gold">{t('footer.shop')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products?type=necklaces"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.necklaces')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=bracelets"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.bracelets')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=earrings"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.earrings')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=rings"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.rings')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.newArrivals')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=bestselling"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.bestSellers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-gold">{t('footer.collections')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/collections/protection"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.protection')}
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/love-harmony"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.loveHarmony')}
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/prosperity"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.prosperity')}
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/essence-oil"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.essenceOil')}
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/crystal-diffuser"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.crystalDiffuser')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-gold">{t('footer.help')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.shippingReturns')}
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.sizeGuide')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-stone hover:text-cream transition-colors"
                >
                  {t('footer.aboutUs')}
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
              &copy; {currentYear} YINYANG GUARDIAN. {t('footer.allRightsReserved')}
            </p>

            {/* Payment Icons */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-wider">{t('footer.securePayments')}</span>
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
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                href="/terms"
                className="hover:text-cream transition-colors"
              >
                {t('footer.termsOfService')}
              </Link>
              <Link
                href="/legal/tokutei"
                className="hover:text-cream transition-colors"
              >
                特定商取引法
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
