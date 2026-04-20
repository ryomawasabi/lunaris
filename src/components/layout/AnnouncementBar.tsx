'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function AnnouncementBar() {
  const { t } = useLanguage();
  const MESSAGES = [
    t('announcement.msg1'),
    t('announcement.msg2'),
    t('announcement.msg3'),
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark text-cream py-2 text-center">
      <p className="text-[11px] uppercase tracking-wider">
        {MESSAGES[currentIndex]}
      </p>
    </div>
  );
}
