'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ColourwayCard } from '@/components/ColourwayCard';
import { ColourwayDetail } from '@/components/ColourwayDetail';
import { colourways, Colourway } from '@/data/colourways';

export default function CollectionPage() {
  const [selected, setSelected] = useState<Colourway | null>(null);

  return (
    <div className="w-full relative">
      <div className="w-full pt-40 px-6 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-mist/40">
          The Range
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-mist">
          Five colours, one rescued loop
        </h1>
        <p className="font-sans text-sm text-mist/60 leading-relaxed">
          Every Chromatic Linen colourway starts as stained, write-off stock
          from Beacon Laundry. Each is vat-dyed for wash-fastness at
          commercial 60&ndash;70&deg;C cycles, with an optional resist-pattern
          finish. Standard runs ship at a discount through Byron Bay Holiday
          Hire; bespoke colour matches are available for operators who want a
          shade to fit their own property.
        </p>
      </div>

      <div className="w-full pt-24 pb-32 flex flex-col items-center gap-24">
        {colourways.map((colourway) => (
          <ColourwayCard key={colourway.id} colourway={colourway} onSelect={setSelected} />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <ColourwayDetail colourway={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
