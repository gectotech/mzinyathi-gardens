// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '../components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mzinyathi Gardens | Gated Community Living',
  description: 'Discover secure, sustainable, and community-driven living in Zimbabwe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <script src='https://cdn.jotfor.ms/agent/embedjs/019e7847ea5578e59f9e1bebcbba1e20df61/embed.js'>
</script>
      </body>
    </html>
  );
}