import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CinematicLoader } from '@/components/CinematicLoader';
import { CanvasBackground } from '@/components/CanvasBackground';
import { PageTransition } from '@/components/PageTransition';
import { Providers } from '@/components/Providers';
import { SiteNav } from '@/components/SiteNav';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Chromatic Linen — by Beacon Laundry',
  description:
    'Stained write-off linen, rescued from landfill and given a second life. Vat-dyed in earthy tones by Beacon Laundry, a Northern Rivers social enterprise.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <CinematicLoader />
          <CanvasBackground />
          <div className="bg-noise" />
          <div className="outer-burn" />
          <SiteNav />
          <main className="relative z-10 w-full min-h-screen touch-pan-y">
            <PageTransition>{children}</PageTransition>
          </main>
        </Providers>
      </body>
    </html>
  );
}
