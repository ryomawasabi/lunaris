'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-stone bg-white rounded overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 hover:bg-stone-light transition-colors duration-200"
          >
            <h3 className="font-serif text-lg text-dark text-left font-semibold">
              {item.question}
            </h3>
            <ChevronDown
              size={20}
              className={cn(
                'text-gold flex-shrink-0 ml-4 transition-transform duration-300',
                openIndex === index && 'rotate-180'
              )}
            />
          </button>

          {openIndex === index && (
            <div className="px-6 pb-6 pt-2 border-t border-stone-light bg-stone-light/30">
              <p className="font-sans text-warm text-base leading-relaxed">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
