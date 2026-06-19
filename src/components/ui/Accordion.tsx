'use client';

import { useState, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';

interface AccordionProps {
  items: { id: string; question: string; answer: string }[];
  className?: string;
}

export default function Accordion({ items, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      trackEvent('faq_opened', { question_id: id });
      return next;
    });
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-surface transition-colors"
            aria-expanded={openId === item.id}
          >
            <span className="text-body-lg font-medium">{item.question}</span>
            <span
              style={{ transform: openId === item.id ? 'rotate(45deg)' : 'rotate(0deg)' }}
              className="text-2xl text-text-secondary transition-transform duration-200"
            >
              +
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ${
              openId === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-6 text-text-secondary">
                {item.answer}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
