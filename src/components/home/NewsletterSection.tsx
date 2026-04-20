'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-dark text-cream texture-noise-dark">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">
          {t('home.newsletter.title')}
        </h2>

        <p className="font-sans text-cream/90 text-base mb-8 leading-relaxed">
          {t('home.newsletter.description')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="email"
            placeholder={t('home.newsletter.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded bg-white/10 border border-cream/30 text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold transition-colors font-sans text-sm"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="bg-cream text-dark hover:bg-cream/90"
          >
            {t('home.newsletter.submitButton')}
          </Button>
        </form>

        {submitted && (
          <p className="text-cream/80 text-sm font-sans mb-4">
            {t('home.newsletter.successMessage')}
          </p>
        )}

        <p className="font-sans text-cream/60 text-xs">
          {t('home.newsletter.agreement')}{' '}
          <a href="/privacy" className="text-gold hover:text-gold/80 transition-colors underline">
            {t('home.newsletter.privacyPolicyLink')}
          </a>
        </p>
      </div>
    </section>
  );
}
