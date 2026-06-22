export interface Colourway {
  id: string;
  name: string;
  hex: string;
  dyeLayers?: string[];
  technique: string;
  description: string;
  suited: string;
  standardFrom: string;
  bespokeFrom: string;
  image: string;
}

export const colourways: Colourway[] = [
  {
    id: 'adobe-sage',
    name: 'Adobe Sage',
    hex: '#7C8A6B',
    dyeLayers: ['#93C572', '#8B864E', '#B33A6B'],
    technique: 'Vat dye, itajime shibori resist',
    description:
      'A muted, grounding green drawn from the coastal hinterland. Folded and clamped before dyeing for a soft geometric texture on towels.',
    suited: 'Bath & hand towels',
    standardFrom: '$5.00',
    bespokeFrom: '$7.00',
    image: '/assets/swatches/sage.jpg',
  },
  {
    id: 'desert-bronze',
    name: 'Desert Bronze',
    hex: '#CD7F32',
    dyeLayers: ['#CD7F32', '#D4A017', '#B33A6B'],
    technique: 'Vat dye, discharge print',
    description:
      'A warm, sun-baked metallic tone. Dyed to a deep ground colour, then selectively lifted to leave a lighter pattern across flat sheets.',
    suited: 'Flat sheets',
    standardFrom: '$6.00',
    bespokeFrom: '$9.00',
    image: '/assets/swatches/terracotta.jpg',
  },
  {
    id: 'verdigris-charcoal',
    name: 'Verdigris Charcoal',
    hex: '#36454F',
    dyeLayers: ['#36454F', '#5F6F58'],
    technique: 'Vat dye, resist print',
    description:
      'A cool, weathered blue-grey with a green undertone, closer to driftwood than denim. A resist paste applied before dyeing leaves a subtler, more artisanal mark.',
    suited: 'Queen & king sheets',
    standardFrom: '$9.00',
    bespokeFrom: '$13.00',
    image: '/assets/swatches/slate.jpg',
  },
  {
    id: 'pecan-v3',
    name: 'Pecan v3',
    hex: '#C19A6B',
    dyeLayers: ['#CD7F32', '#D4A017', '#A0522D'],
    technique: 'Vat dye, solid ground',
    description:
      'A soft, warm pecan that reads as raw, undyed linen even though it is fully colour-bonded for commercial wash cycles.',
    suited: 'Pillowcases & hand towels',
    standardFrom: '$3.00',
    bespokeFrom: '$4.50',
    image: '/assets/swatches/dune.jpg',
  },
  {
    id: 'onyx-moss',
    name: 'Onyx Moss',
    hex: '#2A2E25',
    dyeLayers: ['#1E1E1E', '#5F6F58'],
    technique: 'Vat dye, solid ground',
    description:
      'The deepest run in the palette — best at fully concealing heavier staining while still reading as an intentional, premium colour choice.',
    suited: 'Bath towels & bedding',
    standardFrom: '$5.00',
    bespokeFrom: '$7.00',
    image: '/assets/swatches/charcoal.jpg',
  },
  {
    id: 'castagna-v3',
    name: 'Castagna v3',
    hex: '#8B5E3C',
    dyeLayers: ['#A0522D', '#36454F', '#8B864E'],
    technique: 'Vat dye, itajime shibori resist',
    description:
      'A rich chestnut brown with cool charcoal undertones and a trace of khaki warmth. The resist patterning gives each piece a one-off character.',
    suited: 'Bath towels & flat sheets',
    standardFrom: '$6.00',
    bespokeFrom: '$8.50',
    image: '/assets/swatches/charcoal.jpg',
  },
];
