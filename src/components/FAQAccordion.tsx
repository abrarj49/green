'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items?: FAQItem[] }) {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // If items not provided as prop, read from translations
  const faqList: FAQItem[] =
    items ||
    (t.raw('items') as FAQItem[]) ||
    [];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {faqList.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-none transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'border-l-4 border-[#1D8F2C] bg-white shadow-sm'
                : 'border-l-2 border-neutral-300 bg-[#F3F7FB] hover:border-[#1D8F2C] hover:bg-white'
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-start px-6 py-5 flex items-center justify-between gap-4 font-semibold text-[#232434] hover:text-[#1D8F2C] transition-colors focus-visible:outline-none rounded-none cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              <span className="text-base sm:text-lg leading-snug font-[var(--font-display)]">{item.q}</span>
              <span
                className={`shrink-0 w-8 h-8 rounded-none flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#1D8F2C] text-white rotate-180'
                    : 'bg-neutral-200 text-[#232434]'
                }`}
                aria-hidden="true"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-6 pb-6 pt-1 text-neutral-900/75 leading-relaxed border-t border-neutral-100 text-sm sm:text-base">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
