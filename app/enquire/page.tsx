// TODO: swap the mailto address below for a real Chromatic Linen / Beacon
// Laundry contact once one is confirmed — placeholder for now.
const CONTACT_EMAIL = 'hello@beaconlaundry.com.au';

export default function EnquirePage() {
  return (
    <div className="w-full min-h-screen px-6 md:px-24 pt-32 pb-32 flex flex-col gap-12 max-w-2xl">
      <div className="flex flex-col gap-4">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-mist/40">
          Enquire
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-mist">
          Stock Chromatic Linen at your property
        </h1>
        <p className="font-sans text-sm leading-relaxed text-mist/70">
          Chromatic Linen is currently moving from pilot to first supply
          through Byron Bay Holiday Hire. If you run a BnB, boutique motel,
          caravan park or holiday rental in the Northern Rivers and want to
          get on the list — or you&rsquo;re a partner, funder or media
          contact wanting to know more — get in touch below.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Chromatic Linen Enquiry`}
          className="font-sans text-sm tracking-[0.05em] uppercase text-teal hover:text-teal-deep transition-colors duration-500 self-start border-b border-teal/40 pb-1"
        >
          {CONTACT_EMAIL}
        </a>

        <div className="flex flex-col gap-2 pt-6 border-t border-mist/10">
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/50">
            Want a custom colour match for your property?
          </p>
          <p className="font-sans text-sm text-mist/65 leading-relaxed">
            Bespoke colour runs are available for boutique operators with a
            strong design identity — mention it in your email and we&rsquo;ll
            follow up with swatch options.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-6 border-t border-mist/10">
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/50">
            Distributed by
          </p>
          <p className="font-sans text-sm text-mist/65">
            Byron Bay Holiday Hire — servicing Byron Bay, Ballina, Lennox
            Head &amp; Kingscliff
          </p>
        </div>
      </div>
    </div>
  );
}
