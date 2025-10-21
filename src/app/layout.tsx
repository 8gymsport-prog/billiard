import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/context/app-provider';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: '8GymSport Billiard',
  description: 'Aplikasi Manajemen Biliar oleh rakarmp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body>
        <AppProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <Toaster />
        </App-Provider>
      </body>
    </html>
  );
}
