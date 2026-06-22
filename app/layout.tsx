import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { Providers } from '@/components/Providers';
import { SiteNav } from '@/components/SiteNav';

const CanvasBackground = dynamic(() => import('@/components/CanvasBackground').then(mod => mod.CanvasBackground), { ssr: false });
const CinematicLoader = dynamic(() => import('@/components/CinematicLoader').then(mod => mod.CinematicLoader), { ssr: false });
const PageTransition = dynamic(() => import('@/components/PageTransition').then(mod => mod.PageTransition), { ssr: false });

const playfair = Playfair_Display({
  subsets: ['latin'], variable: '--font-playfair', display: 'swap',
  weight: ['400', '500', '600', '700'], style: ['normal', 'italic'],
});
const inter = Inter({
  subsets: ['latin'], variable: '--font-inter', display: 'swap',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Chromatic Linen — by Beacon Laundry',
  description: 'Stained write-off linen, rescued from landfill and given a second life. Vat-dyed in earthy tones by Beacon Laundry, a Northern Rivers social enterprise.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#06000c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-void text-parchment font-sans antialiased overflow-x-hidden selection:bg-vermillion selection:text-void min-h-screen">
        <CinematicLoader />
        <CanvasBackground />
        <PageTransition />
        <Providers>
          <SiteNav />
          <main className="relative z-10 w-full min-h-screen touch-pan-y">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
