'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import QuotePopup from '@/components/QuotePopup';

interface PageShellProps {
  children: React.ReactNode;
  defaultService?: string;
}

export default function PageShell({ children, defaultService }: PageShellProps) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#585858] selection:bg-[#1D8F2C] selection:text-white">
      <Navbar onOpenQuote={() => setIsQuoteOpen(true)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
      <FloatingButtons />
      <QuotePopup
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultService={defaultService}
      />
    </div>
  );
}
