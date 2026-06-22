'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LOOP_STAGES = [
  { n: '01', title: 'Sort & Set Aside', body: 'Beacon staff identify permanently stained write-off stock during normal processing and batch it separately, rather than sending it to landfill.' },
  { n: '02', title: 'Over-Dye & Pattern', body: 'Batches travel to a commercial dyehouse and are vat-dyed in earthy, neutral tones — sage, terracotta, dune, slate, charcoal — with optional resist-pattern finishing.' },
  { n: '03', title: 'Distribute via BBHH', body: 'Dyed stock is delivered to Byron Bay Holiday Hire, who distribute it to BnBs, boutique motels, caravan parks and holiday rentals at a discount to new white stock.' },
  { n: '04', title: 'Launder & Loop', body: 'Used Chromatic Linen returns to Beacon through the normal collection route, is laundered, and re-enters the supply chain — again and again.' },
];

const IMPACT_STATS = [
  { value: '5.9t', label: 'textile waste diverted from landfill per year' },
  { value: '60–70%', label: 'of write-off stock recovered for over-dyeing' },
  { value: '$172k–195k', label: 'total annual value created for Beacon Laundry' },
  { value: '182', label: 'local jobs already created by Beacon Laundry' },
];

export function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const quotes = Array.from(containerRef.current.querySelectorAll<HTMLElement>('.artist-quote'));
    const observers: IntersectionObserver[] = [];
    quotes.forEach((quote) => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.fromTo(entry.target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' });
          obs.disconnect();
        });
      }, { threshold: 0.15 });
      obs.observe(quote);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen px-6 md:px-24 pt-32 pb-32 flex flex-col gap-32">
      <div className="flex flex-col gap-8 max-w-2xl">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-mist/40">The Story</p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-mist">
          Beacon Laundry writes off up to $300,000 of stained linen a year. Chromatic Linen gives it a second life.
        </h1>
        <p className="font-sans text-sm leading-relaxed text-mist/70">
          Beacon Laundry is a jobs-focused social enterprise commercial laundry in Bangalow, NSW, 15 minutes from Byron Bay. It exists to create local jobs and career pathways for people who have historically been shut out of the mainstream jobs market — and it has already created 182 jobs since opening, 79% of them going to people who have faced significant barriers to employment.
        </p>
        <p className="font-sans text-sm leading-relaxed text-mist/70">
          Like every commercial laundry, Beacon permanently retires 10–20% of its linen and towel stock each year to staining that simply will not come out — sunscreen, self-tan, hair dye, food and beverage. Chromatic Linen rescues that stock, vat-dyes it in earthy, neutral tones, and sells it on at a discount to the Byron Bay accommodation operators who are best placed to love it.
        </p>
      </div>

      <blockquote className="artist-quote flex flex-col gap-6 text-center max-w-3xl opacity-0">
        <p className="text-mist font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed font-light">
          &ldquo;The Northern Rivers already knows Beacon as the laundry that gives a sheet. Chromatic Linen gives those sheets a second life.&rdquo;
        </p>
      </blockquote>

      <div className="flex flex-col gap-12 max-w-3xl">
        <h2 className="font-serif text-2xl tracking-wide text-mist">The Circular Loop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {LOOP_STAGES.map((stage) => (
            <div key={stage.n} className="flex flex-col gap-2">
              <span className="font-serif text-sm text-teal tracking-[0.2em]">{stage.n}</span>
              <h3 className="font-serif text-lg text-mist">{stage.title}</h3>
              <p className="font-sans text-sm text-mist/65 leading-relaxed">{stage.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-4xl">
        {IMPACT_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            <span className="font-serif text-3xl text-mist">{stat.value}</span>
            <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-mist/55 leading-snug">{stat.label}</span>
          </div>
        ))}
      </div>

      <blockquote className="artist-quote flex flex-col gap-6 text-center max-w-3xl opacity-0">
        <p className="text-mist font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed font-light">
          &ldquo;A boutique motel that can tell its guests their towels were rescued from waste by a local social enterprise has a guest experience story that money cannot buy from a white linen catalogue.&rdquo;
        </p>
      </blockquote>

      <div className="flex flex-col gap-8 max-w-2xl">
        <h2 className="font-serif text-2xl tracking-wide text-mist">Our Partners</h2>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-serif text-base text-mist">LoomTex — Geelong, VIC</h3>
            <p className="font-sans text-sm text-mist/65 leading-relaxed">
              Australia&rsquo;s last surviving woollen furnishing textile mill and dyehouse, operating since 1922. LoomTex handles the commission vat-dyeing and resist-pattern finishing for every Chromatic Linen batch.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-base text-mist">Byron Bay Holiday Hire</h3>
            <p className="font-sans text-sm text-mist/65 leading-relaxed">
              An existing Beacon distribution partner with over 35 years in Northern Rivers linen hire, servicing Byron Bay, Ballina, Lennox Head and Kingscliff. BBHH carries Chromatic Linen to the BnBs, motels and holiday rentals that need it most.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
