'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteNav() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
      <Link href="/" className="font-serif text-[12px] tracking-[0.25em] uppercase text-mist/80 hover:text-mist transition-colors duration-500">
        Chromatic Linen
      </Link>
      <nav className="flex gap-6 md:gap-8 font-sans text-[10px] tracking-[0.3em] uppercase text-mist/50">
        <Link href="/collection" className="hover:text-mist transition-colors duration-500">The Range</Link>
        <Link href="/about" className="hover:text-mist transition-colors duration-500">The Story</Link>
        <Link href="/enquire" className="hover:text-mist transition-colors duration-500">Enquire</Link>
      </nav>
    </header>
  );
}
