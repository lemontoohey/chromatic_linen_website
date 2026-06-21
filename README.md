# Chromatic Linen

A Next.js site for **Chromatic Linen**, a Beacon Laundry circular-economy
program: stained, write-off linen and towels are rescued, vat-dyed in earthy
tones (sage, terracotta, dune, slate, charcoal), and distributed at a
discount to Northern Rivers accommodation operators through Byron Bay
Holiday Hire.

This is built on the same infrastructure as a previous gallery-style project
(WebGL atmospheric background, Lenis smooth scroll, Framer Motion scroll
reveals, GSAP Ken Burns, 3D tilt on detail views) — recoloured from a dark
gallery palette to a light, warm "linen" palette, and recomposed around the
Chromatic Linen story instead of an art collection.

## Pages

- `/` — hero landing: logo, looping intro clip, tagline, scroll-to-reveal CTA into the range.
- `/collection` — the five colourways (Sage, Terracotta, Dune, Slate, Charcoal), each with a scroll-reveal card and a detail view showing dye technique, suited product, and standard/bespoke pricing.
- `/about` — the Chromatic Linen story: the four-stage circular loop, impact stats, and partners (LoomTex, Byron Bay Holiday Hire).
- `/enquire` — contact point for accommodation operators, partners, and media.

## What's real vs. placeholder

- **Copy and figures** are pulled directly from the Chromatic Linen program proposal (write-off rates, pricing tiers, impact stats, partner details).
- **Logo** (`public/assets/beacon-laundry-logo.svg`) is a recreation based only on the logo image shared in chat — no source logo file was provided. Replace it with the real `.svg`/`.png` as soon as you have it.
- **Intro video** (`public/assets/beacon_laundry_intro.mp4`) is the supplied clip, looping muted on the hero.
- **Colourway swatches** (`public/assets/swatches/*.jpg`) are generated linen-texture placeholders in the correct dye colours — swap for real photography of the dyed stock once the LoomTex pilot batch comes back.
- **Contact email** in `app/enquire/page.tsx` is a placeholder (`hello@beaconlaundry.com.au`) — update to the real address.

## Running locally

```bash
npm install
npm run dev
```

## Building for deployment

```bash
npm run build
```

This produces a static export in `out/`. If the site is deployed under a
sub-path (e.g. `yourdomain.com/chromatic-linen`), set
`NEXT_PUBLIC_BASE_PATH=/chromatic-linen` before building. Leave it unset for
a root-domain or subdomain deployment.
