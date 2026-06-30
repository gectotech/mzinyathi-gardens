import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import ConditionalLayout from '../components/layout/ConditionalLayout';
import { getSiteUrl } from '@/lib/site-url';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Mzinyathi Gardens | Gated Community Living',
  description: 'Discover secure, sustainable, and community-driven living in Bulawayo, Zimbabwe.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.className} overflow-x-hidden antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" />
        <Script
          src="https://cdn.jotfor.ms/agent/embedjs/019e7847ea5578e59f9e1bebcbba1e20df61/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
