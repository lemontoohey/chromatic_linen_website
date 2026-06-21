export interface Colourway {
  id: string;
  name: string;
  hex: string;
  technique: string;
  description: string;
  suited: string;
  standardFrom: string;
  bespokeFrom: string;
  image: string;
}

// Replace `image` filenames once real dyed-linen photography from LoomTex /
// the pilot batch is available — for now these point at generated fabric
// swatch placeholders in /public/assets/swatches/.
export const colourways: Colourway[] = [
  {
    id: 'sage',
    name: 'Sage',
    hex: '#7C8A6B',
    technique: 'Vat dye, itajime shibori resist',
    description:
      'A muted, grounding green drawn from the coastal hinterland. Folded and clamped before dyeing for a soft geometric texture on towels.',
    suited: 'Bath & hand towels',
    standardFrom: '$5.00',
    bespokeFrom: '$7.00',
    image: '/assets/swatches/sage.jpg',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    hex: '#C16A47',
    technique: 'Vat dye, discharge print',
    description:
      'A warm, sun-baked clay tone. Dyed to a deep ground colour, then selectively lifted to leave a lighter pattern across flat sheets.',
    suited: 'Flat sheets',
    standardFrom: '$6.00',
    bespokeFrom: '$9.00',
    image: '/assets/swatches/terracotta.jpg',
  },
  {
    id: 'dune',
    name: 'Dune',
    hex: '#D8C39E',
    technique: 'Vat dye, solid ground',
    description:
      'A soft, sand-pale neutral that reads as raw, undyed linen even though it is fully colour-bonded for commercial wash cycles.',
    suited: 'Pillowcases & hand towels',
    standardFrom: '$3.00',
    bespokeFrom: '$4.50',
    image: '/assets/swatches/dune.jpg',
  },
  {
    id: 'slate',
    name: 'Slate',
    hex: '#5C7480',
    technique: 'Vat dye, resist print',
    description:
      'A cool, weathered blue-grey, closer to driftwood than denim. A resist paste applied before dyeing leaves a subtler, more artisanal mark.',
    suited: 'Queen & king sheets',
    standardFrom: '$9.00',
    bespokeFrom: '$13.00',
    image: '/assets/swatches/slate.jpg',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    hex: '#3A332C',
    technique: 'Vat dye, solid ground',
    description:
      'The deepest run in the palette — best at fully concealing heavier staining while still reading as an intentional, premium colour choice.',
    suited: 'Bath towels & bedding',
    standardFrom: '$5.00',
    bespokeFrom: '$7.00',
    image: '/assets/swatches/charcoal.jpg',
  },
];
