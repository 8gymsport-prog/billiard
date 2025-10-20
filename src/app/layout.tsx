import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/context/app-provider';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import './globals.css';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
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
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AppProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <Toaster />
        </AppProvider>
        <Script
          src="/register-sw.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
