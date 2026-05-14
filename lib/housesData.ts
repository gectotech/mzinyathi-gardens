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
  completionDate?: string;
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

// Helper to create house data
const createHouse = (
  id: string,
  houseNumber: number,
  beds: number,
  baths: number,
  price: string,
  phase: string,
  phaseId: string,
  description: string = ''
): House => {
  const currentImageNumber = houseImageCounter;
  houseImageCounter++;
  
  return {
    id,
    title: `House ${houseNumber}`,
    description: description || `${beds} Bedroom ${baths} Bath house with modern finishes`,
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

// Helper for under construction phases
const underConstructionPhase = (id: string, name: string, description: string): Phase => ({
  id,
  name,
  description,
  image: `/images/${id}.jpg`,
  houses: [],
  features: ['Coming Soon', 'Under Development', 'Secure Estate', 'Modern Infrastructure'],
  status: 'under_construction',
});

// Helper for active phases
const activePhase = (id: string, name: string, description: string, houses: House[]): Phase => ({
  id,
  name,
  description,
  image: `/images/${id}.jpg`,
  houses,
  features: ['Borehole Water Supply', 'Solar Street Lighting', '24/7 Armed Security', 'Tarred Roads', 'Recreational Parks'],
  status: 'active',
});

// ============ CREATE ALL HOUSES FIRST ============

// Phase 1 Houses (5 houses)
const phase1Houses: House[] = [
  createHouse('phase-1-house-1', 1, 5, 3, '$59,944.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i', 'Magnificent 5-bedroom royal residence'),
  createHouse('phase-1-house-2', 2, 4, 3, '$50,473.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i', 'Spacious 4-bedroom family home'),
  createHouse('phase-1-house-3', 3, 4, 3, '$50,473.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i', 'Beautiful 4-bedroom villa'),
  createHouse('phase-1-house-4', 4, 4, 3, '$50,473.66', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i', 'Elegant 4-bedroom manor'),
  createHouse('phase-1-house-5', 5, 5, 4, '$73,384.08', 'Phase I: KwaNdebele - Emzini wamaTebele', 'phase_i', 'Stunning double-story home'),
];

// Phase 2 Houses (3 houses)
const phase2Houses: House[] = [
  createHouse('phase-2-house-1', 1, 4, 3, '$50,473.66', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'phase_ii', 'Grand 4-bedroom home'),
  createHouse('phase-2-house-2', 2, 4, 3, '$50,473.66', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'phase_ii', 'Spacious 4-bedroom retreat'),
  createHouse('phase-2-house-3', 3, 3, 2, '$41,060.41', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'phase_ii', 'Cozy 3-bedroom home'),
];

// Phase 3 Houses (3 houses)
const phase3Houses: House[] = [
  createHouse('phase-3-house-1', 1, 4, 3, '$50,473.66', 'Phase III: KwaNdlunkulu - Esikhosini', 'phase_iii', 'Elegant 4-bedroom home'),
  createHouse('phase-3-house-2', 2, 5, 3, '$59,944.66', 'Phase III: KwaNdlunkulu - Esikhosini', 'phase_iii', 'Magnificent 5-bedroom home'),
  createHouse('phase-3-house-3', 3, 4, 3, '$50,473.66', 'Phase III: KwaNdlunkulu - Esikhosini', 'phase_iii', 'Beautiful 4-bedroom villa'),
];

// Phase 4 Houses (2 houses)
const phase4Houses: House[] = [
  createHouse('phase-4-house-1', 1, 3, 2, '$41,060.41', 'Phase IV: Emlanjeni - The River', 'phase_iv', 'Peaceful 3-bedroom home'),
  createHouse('phase-4-house-2', 2, 5, 3, '$59,944.66', 'Phase IV: Emlanjeni - The River', 'phase_iv', 'Luxurious 5-bedroom home'),
];

// Phase 5 Houses (3 houses)
const phase5Houses: House[] = [
  createHouse('phase-5-house-1', 1, 3, 2, '$41,060.41', 'Phase V: KwaZazalizitha - The Signature Phase', 'phase_v', 'Elegant 3-bedroom home'),
  createHouse('phase-5-house-2', 2, 3, 2, '$41,060.41', 'Phase V: KwaZazalizitha - The Signature Phase', 'phase_v', 'Stylish 3-bedroom home'),
  createHouse('phase-5-house-3', 3, 3, 2, '$41,060.41', 'Phase V: KwaZazalizitha - The Signature Phase', 'phase_v', 'Charming 3-bedroom home'),
];

// Phase 6 Houses (1 house)
const phase6Houses: House[] = [
  createHouse('phase-6-house-1', 1, 5, 3, '$59,944.66', 'Phase VI: Ndlabunondo - Lifestyle Estate', 'phase_vi', 'Spacious 5-bedroom home'),
];

// Phase 7 Houses (2 houses)
const phase7Houses: House[] = [
  createHouse('phase-7-house-1', 1, 4, 3, '$50,473.66', 'Phase VII: Umqombothi - Wine Estate', 'phase_vii', 'Elegant 4-bedroom home'),
  createHouse('phase-7-house-2', 2, 3, 2, '$41,060.41', 'Phase VII: Umqombothi - Wine Estate', 'phase_vii', 'Charming 3-bedroom cottage'),
];

// Phase 8 Houses (1 house)
const phase8Houses: House[] = [
  createHouse('phase-8-house-1', 1, 3, 2, '$41,060.41', 'Phase VIII: KwaQueen Lozikeyi - Contemporary Urban Design', 'phase_viii', 'Contemporary 3-bedroom home'),
];

// Phase 10 Houses (1 house)
const phase10Houses: House[] = [
  createHouse('phase-10-house-1', 1, 4, 3, '$50,473.66', 'Phase X: KwaMadlenya', 'phase_x', 'Beautiful 4-bedroom home'),
];

// ============ CREATE ALL PHASES ============

// First, create the phasesData object
export const phasesData: Record<string, Phase> = {};

// Add active phases
phasesData['phase_i'] = activePhase('phase_i', 'Phase I: KwaNdebele - Emzini wamaTebele', 'Cultural heritage meets modern living. Traditional Ndebele architecture with modern amenities. Stands 600-1000 sqm.', phase1Houses);
phasesData['phase_ii'] = activePhase('phase_ii', 'Phase II: KwaMzilikazi - KwaMthwakazi', 'Honoring the great warrior king Mzilikazi. Premium residential stands with a view. Stands 600-1000 sqm.', phase2Houses);
phasesData['phase_iii'] = activePhase('phase_iii', 'Phase III: KwaNdlunkulu - Esikhosini', 'The king\'s residence – central and prestigious. Close to all amenities. Stands 600-1000 sqm.', phase3Houses);
phasesData['phase_iv'] = activePhase('phase_iv', 'Phase IV: Emlanjeni - The River', 'Tranquil living along the river. Peaceful and scenic with water views. Stands 600-1000 sqm.', phase4Houses);
phasesData['phase_v'] = activePhase('phase_v', 'Phase V: KwaZazalizitha - The Signature Phase', 'Signature homes for discerning buyers. Premium finishes and exclusive design. Stands 600-1000 sqm.', phase5Houses);
phasesData['phase_vi'] = activePhase('phase_vi', 'Phase VI: Ndlabunondo - Lifestyle Estate', 'Active lifestyle with premium amenities. Sports facilities and recreational areas. Stands 600-1000 sqm.', phase6Houses);
phasesData['phase_vii'] = activePhase('phase_vii', 'Phase VII: Umqombothi - Wine Estate', 'Wine estate inspired living. Vineyard views and wine tasting experiences. Stands 600-1000 sqm.', phase7Houses);
phasesData['phase_viii'] = activePhase('phase_viii', 'Phase VIII: KwaQueen Lozikeyi - Contemporary Urban Design', 'Modern urban design with contemporary flair. Close to commercial hub. Stands 600-1000 sqm.', phase8Houses);
phasesData['phase_x'] = activePhase('phase_x', 'Phase X: KwaMadlenya', 'Exclusive phase with premium stands and mountain views. Stands 600-1000 sqm.', phase10Houses);

// Add under construction phases
phasesData['phase_ix'] = underConstructionPhase('phase_ix', 'Phase IX: Esibayeni - The Kraal', 'Coming soon! Traditional kraal-inspired design. Register your interest.');
phasesData['phase_xi'] = underConstructionPhase('phase_xi', 'Phase XI: Mzinyathi Bosch', 'Coming soon! Signature homes with premium finishes. Register your interest.');
phasesData['phase_xii'] = underConstructionPhase('phase_xii', 'Phase XII: The Final Frontier', 'Coming soon! The final phase of Mzinyathi Gardens. Register your interest.');
phasesData['2-acres'] = underConstructionPhase('2-acres', '2 Acre Premium Plots', 'Large estate plots for luxury homes. Coming soon! Register your interest.');

// ============ ALL PHASES LIST (in correct order) ============
export const allPhases = [
  { id: 'phase_i', name: phasesData['phase_i'].name, image: '/images/phase_i.jpg', status: phasesData['phase_i'].status, description: phasesData['phase_i'].description },
  { id: 'phase_ii', name: phasesData['phase_ii'].name, image: '/images/phase_ii.jpg', status: phasesData['phase_ii'].status, description: phasesData['phase_ii'].description },
  { id: 'phase_iii', name: phasesData['phase_iii'].name, image: '/images/phase_iii.jpg', status: phasesData['phase_iii'].status, description: phasesData['phase_iii'].description },
  { id: 'phase_iv', name: phasesData['phase_iv'].name, image: '/images/phase_iv.jpg', status: phasesData['phase_iv'].status, description: phasesData['phase_iv'].description },
  { id: 'phase_v', name: phasesData['phase_v'].name, image: '/images/phase_v.jpg', status: phasesData['phase_v'].status, description: phasesData['phase_v'].description },
  { id: 'phase_vi', name: phasesData['phase_vi'].name, image: '/images/phase_vi.jpg', status: phasesData['phase_vi'].status, description: phasesData['phase_vi'].description },
  { id: 'phase_vii', name: phasesData['phase_vii'].name, image: '/images/phase_vii.jpg', status: phasesData['phase_vii'].status, description: phasesData['phase_vii'].description },
  { id: 'phase_viii', name: phasesData['phase_viii'].name, image: '/images/phase_viii.jpg', status: phasesData['phase_viii'].status, description: phasesData['phase_viii'].description },
  { id: 'phase_ix', name: phasesData['phase_ix'].name, image: '/images/phase_ix.jpg', status: phasesData['phase_ix'].status, description: phasesData['phase_ix'].description },
  { id: 'phase_x', name: phasesData['phase_x'].name, image: '/images/phase_x.jpg', status: phasesData['phase_x'].status, description: phasesData['phase_x'].description },
  { id: 'phase_xi', name: phasesData['phase_xi'].name, image: '/images/phase_xi.jpg', status: phasesData['phase_xi'].status, description: phasesData['phase_xi'].description },
  { id: 'phase_xii', name: phasesData['phase_xii'].name, image: '/images/phase_xii.jpg', status: phasesData['phase_xii'].status, description: phasesData['phase_xii'].description },
  { id: '2-acres', name: phasesData['2-acres'].name, image: '/images/2-acres.jpg', status: phasesData['2-acres'].status, description: phasesData['2-acres'].description },
];