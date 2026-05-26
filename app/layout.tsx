import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '../components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mzinyathi Gardens | Gated Community Living',
  description: 'Discover secure, sustainable, and community-driven living in Bulawayo, Zimbabwe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
