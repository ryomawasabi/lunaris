'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  'Align Your Energy with Every Piece You Wear',
  'Crafted Under the Stars for Spiritual Protection',
  'Free Shipping on Orders Over $150',
];

export default function AnnouncementBar() {
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
