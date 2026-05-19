// lib/housesData.ts

export interface House {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  beds: number;
  baths: number;
  size: number;
  phase: string;
  phaseId: string;
  price: string;
  features: string[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  image: string;
  houses: House[];
  features: string[];
  status: 'active' | 'under_construction';
}

// Counter for house images (1-21)
let houseImageCounter = 1;

// Helper function to create house with sequential images
const createHouse = (
  id: string,
  beds: number,
  baths: number,
  price: string,
  phase: string,
  phaseId: string
): House => {
  const currentImageNumber = houseImageCounter;
  houseImageCounter++;
  
  return {
    id,
    title: `House ${currentImageNumber}`,
    description: `${beds} Bedroom ${baths} Bath house with modern finishes`,
    fullDescription: `This beautiful ${beds}-bedroom, ${baths}-bathroom home features premium finishes, modern kitchen, spacious living areas, and is equipped with borehole water and solar system. Located in ${phase}, this property offers secure living in Mzinyathi Gardens.`,
    image: `/images/house${currentImageNumber}.jpg`,
    images: [`/images/house${currentImageNumber}.jpg`, `/images/${phaseId}.jpg`],
    beds,
    baths,
    size: beds === 5 ? 250 : beds === 4 ? 200 : 160,
    phase,
    phaseId,
    price,
    features: ['Borehole Water Supply', 'Solar System Installed', 'Modern Kitchen', 'Spacious Living Areas', 'Secure Location', 'Tarred Road Access'],
  };
};

// Reset counter and create all houses in order
houseImageCounter = 1;

// ============ PHASE 1: KwaNdebele (5 houses) ============
const phase1Houses: House[] = [
  createHouse('phase-1-house-1', 5, 3, '$59,944.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i'),
  createHouse('phase-1-house-2', 4, 3, '$50,473.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i'),
  createHouse('phase-1-house-3', 4, 3, '$50,473.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i'),
  createHouse('phase-1-house-4', 4, 3, '$50,473.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i'),
  createHouse('phase-1-house-5', 5, 4, '$73,384.08', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i'),
];

// ============ PHASE 2: KwaMzilikazi (3 houses) ============
const phase2Houses: House[] = [
  createHouse('phase-2-house-1', 4, 3, '$50,473.66', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'phase_ii'),
  createHouse('phase-2-house-2', 4, 3, '$50,473.66', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'phase_ii'),
  createHouse('phase-2-house-3', 3, 2, '$41,060.41', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'phase_ii'),
];

// ============ PHASE 3: KwaNdlunkulu (3 houses) ============
const phase3Houses: House[] = [
  createHouse('phase-3-house-1', 4, 3, '$50,473.66', 'Phase III: KwaNdlunkulu - Esikhosini', 'phase_iii'),
  createHouse('phase-3-house-2', 5, 3, '$59,944.66', 'Phase III: KwaNdlunkulu - Esikhosini', 'phase_iii'),
  createHouse('phase-3-house-3', 4, 3, '$50,473.66', 'Phase III: KwaNdlunkulu - Esikhosini', 'phase_iii'),
];

// ============ PHASE 4: Emlanjeni (2 houses) ============
const phase4Houses: House[] = [
  createHouse('phase-4-house-1', 3, 2, '$41,060.41', 'Phase IV: Emlanjeni - The River', 'phase_iv'),
  createHouse('phase-4-house-2', 5, 3, '$59,944.66', 'Phase IV: Emlanjeni - The River', 'phase_iv'),
];

// ============ PHASE 5: KwaZazalizitha (3 houses) ============
const phase5Houses: House[] = [
  createHouse('phase-5-house-1', 3, 2, '$41,060.41', 'Phase V: KwaZazalizitha - The Signature Phase', 'phase_v'),
  createHouse('phase-5-house-2', 3, 2, '$41,060.41', 'Phase V: KwaZazalizitha - The Signature Phase', 'phase_v'),
  createHouse('phase-5-house-3', 3, 2, '$41,060.41', 'Phase V: KwaZazalizitha - The Signature Phase', 'phase_v'),
];

// ============ PHASE 6: Ndlabunondo (1 house) ============
const phase6Houses: House[] = [
  createHouse('phase-6-house-1', 5, 3, '$59,944.66', 'Phase VI: Ndlabunondo - Lifestyle Estate', 'phase_vi'),
];

// ============ PHASE 7: Umqombothi (2 houses) ============
const phase7Houses: House[] = [
  createHouse('phase-7-house-1', 4, 3, '$50,473.66', 'Phase VII: Umqombothi - Wine Estate', 'phase_vii'),
  createHouse('phase-7-house-2', 3, 2, '$41,060.41', 'Phase VII: Umqombothi - Wine Estate', 'phase_vii'),
];

// ============ PHASE 8: KwaQueen Lozikeyi (1 house) ============
const phase8Houses: House[] = [
  createHouse('phase-8-house-1', 3, 2, '$41,060.41', 'Phase VIII: KwaQueen Lozikeyi', 'phase_viii'),
];

// ============ PHASE 10: KwaMadlenya (1 house) ============
const phase10Houses: House[] = [
  createHouse('phase-10-house-1', 4, 3, '$50,473.66', 'Phase X: KwaMadlenya', 'phase_x'),
];

// ============ CREATE PHASES DATA ============
export const phasesData: Record<string, Phase> = {
  phase_i: {
    id: 'phase_i',
    name: 'Phase I: KwaNdebele - Emzini wamaTebele',
    description: 'Cultural heritage meets modern living. Traditional Ndebele architecture with modern amenities. Stands 600-1000 sqm.',
    image: '/images/phase_i.jpg',
    houses: phase1Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_ii: {
    id: 'phase_ii',
    name: 'Phase II: KwaMzilikazi - KwaMthwakazi',
    description: 'Honoring the great warrior king Mzilikazi. Premium residential stands with a view. Stands 600-1000 sqm.',
    image: '/images/phase_ii.jpg',
    houses: phase2Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_iii: {
    id: 'phase_iii',
    name: 'Phase III: KwaNdlunkulu - Esikhosini',
    description: "The king's residence – central and prestigious. Close to all amenities. Stands 600-1000 sqm.",
    image: '/images/phase_iii.jpg',
    houses: phase3Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_iv: {
    id: 'phase_iv',
    name: 'Phase IV: Emlanjeni - The River',
    description: 'Tranquil living along the river. Peaceful and scenic with water views. Stands 600-1000 sqm.',
    image: '/images/phase_iv.jpg',
    houses: phase4Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_v: {
    id: 'phase_v',
    name: 'Phase V: KwaZazalizitha - The Signature Phase',
    description: 'Signature homes for discerning buyers. Premium finishes and exclusive design. Stands 600-1000 sqm.',
    image: '/images/phase_v.jpg',
    houses: phase5Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_vi: {
    id: 'phase_vi',
    name: 'Phase VI: Ndlabunondo - Lifestyle Estate',
    description: 'Active lifestyle with premium amenities. Sports facilities and recreational areas. Stands 600-1000 sqm.',
    image: '/images/phase_vi.jpg',
    houses: phase6Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_vii: {
    id: 'phase_vii',
    name: 'Phase VII: Umqombothi - Wine Estate',
    description: 'Wine estate inspired living. Vineyard views and wine tasting experiences. Stands 600-1000 sqm.',
    image: '/images/phase_vii.jpg',
    houses: phase7Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_viii: {
    id: 'phase_viii',
    name: 'Phase VIII: KwaQueen Lozikeyi - Contemporary Urban Design',
    description: 'Modern urban design with contemporary flair. Close to commercial hub. Stands 600-1000 sqm.',
    image: '/images/phase_viii.jpg',
    houses: phase8Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_ix: {
    id: 'phase_ix',
    name: 'Phase IX: Esibayeni - The Kraal',
    description: 'Coming soon! Traditional kraal-inspired design. Register your interest.',
    image: '/images/phase_ix.jpg',
    houses: [],
    features: ['Coming Soon', 'Under Development', 'Secure Estate', 'Modern Infrastructure'],
    status: 'under_construction',
  },
  phase_x: {
    id: 'phase_x',
    name: 'Phase X: KwaMadlenya',
    description: 'Exclusive phase with premium stands and mountain views. Stands 600-1000 sqm.',
    image: '/images/phase_x.jpg',
    houses: phase10Houses,
    features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
    status: 'active',
  },
  phase_xi: {
    id: 'phase_xi',
    name: 'Phase XI: Mzinyathi Bosch',
    description: 'Coming soon! Signature homes with premium finishes. Register your interest.',
    image: '/images/phase_xi.jpg',
    houses: [],
    features: ['Coming Soon', 'Under Development', 'Secure Estate', 'Modern Infrastructure'],
    status: 'under_construction',
  },
  phase_xii: {
    id: 'phase_xii',
    name: 'Phase XII: The Final Frontier',
    description: 'Coming soon! The final phase of Mzinyathi Gardens. Register your interest.',
    image: '/images/phase_xii.jpg',
    houses: [],
    features: ['Coming Soon', 'Under Development', 'Secure Estate', 'Modern Infrastructure'],
    status: 'under_construction',
  },
  '2-acres': {
    id: '2-acres',
    name: '2 Acre Premium Plots',
    description: 'Large estate plots for luxury homes. Coming soon! Register your interest.',
    image: '/images/2-acres.jpg',
    houses: [],
    features: ['Coming Soon', 'Under Development', 'Secure Estate', 'Modern Infrastructure'],
    status: 'under_construction',
  },
};

// All phases list for properties page
export const allPhases = [
  { id: 'phase_i', name: phasesData.phase_i.name, image: '/images/phase_i.jpg', status: phasesData.phase_i.status, description: phasesData.phase_i.description },
  { id: 'phase_ii', name: phasesData.phase_ii.name, image: '/images/phase_ii.jpg', status: phasesData.phase_ii.status, description: phasesData.phase_ii.description },
  { id: 'phase_iii', name: phasesData.phase_iii.name, image: '/images/phase_iii.jpg', status: phasesData.phase_iii.status, description: phasesData.phase_iii.description },
  { id: 'phase_iv', name: phasesData.phase_iv.name, image: '/images/phase_iv.jpg', status: phasesData.phase_iv.status, description: phasesData.phase_iv.description },
  { id: 'phase_v', name: phasesData.phase_v.name, image: '/images/phase_v.jpg', status: phasesData.phase_v.status, description: phasesData.phase_v.description },
  { id: 'phase_vi', name: phasesData.phase_vi.name, image: '/images/phase_vi.jpg', status: phasesData.phase_vi.status, description: phasesData.phase_vi.description },
  { id: 'phase_vii', name: phasesData.phase_vii.name, image: '/images/phase_vii.jpg', status: phasesData.phase_vii.status, description: phasesData.phase_vii.description },
  { id: 'phase_viii', name: phasesData.phase_viii.name, image: '/images/phase_viii.jpg', status: phasesData.phase_viii.status, description: phasesData.phase_viii.description },
  { id: 'phase_ix', name: phasesData.phase_ix.name, image: '/images/phase_ix.jpg', status: phasesData.phase_ix.status, description: phasesData.phase_ix.description },
  { id: 'phase_x', name: phasesData.phase_x.name, image: '/images/phase_x.jpg', status: phasesData.phase_x.status, description: phasesData.phase_x.description },
  { id: 'phase_xi', name: phasesData.phase_xi.name, image: '/images/phase_xi.jpg', status: phasesData.phase_xi.status, description: phasesData.phase_xi.description },
  { id: 'phase_xii', name: phasesData.phase_xii.name, image: '/images/phase_xii.jpg', status: phasesData.phase_xii.status, description: phasesData.phase_xii.description },
  { id: '2-acres', name: phasesData['2-acres'].name, image: '/images/2-acres.jpg', status: phasesData['2-acres'].status, description: phasesData['2-acres'].description },
];