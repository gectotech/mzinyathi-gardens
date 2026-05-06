// lib/housesData.ts
export interface House {
  id: string;
  title: string;
  description: string;
  image: string;
  beds: number;
  baths: number;
  size: number;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  image: string;
  houses: House[];
  features: string[]; // new
}

// Helper to generate house images (replace with actual paths)
const getHouseImage = (phaseId: string, index: number) => `/images/house_${phaseId}_${index}.jpg`;

// Generate houses for any phase (3 to 5 houses with varied sizes)
const generateHouses = (phaseId: string, phaseNum: number): House[] => {
  const baseBeds = 3 + (phaseNum % 3); // 3,4,5 pattern
  const houses: House[] = [];
  for (let i = 1; i <= 3; i++) {
    houses.push({
      id: `${phaseId}-${i}`,
      title: `${phaseNum === 1 ? 'Traditional' : phaseNum === 7 ? 'Vineyard' : phaseNum === 11 ? 'Signature' : 'Modern'} Home ${i}`,
      description: `Beautiful ${baseBeds + (i-1)}-bedroom design with premium finishes.`,
      image: getHouseImage(phaseId, i),
      beds: baseBeds + (i-1),
      baths: baseBeds + (i-1) - 1,
      size: 120 + (i * 30),
    });
  }
  return houses;
};

// Phase features based on phase number
const getPhaseFeatures = (phaseNum: number): string[] => {
  const common = ['24/7 Armed Security', 'Solar Street Lighting', 'Community Boreholes'];
  const specific: Record<number, string[]> = {
    1: ['Close to main entrance', 'Traditional Ndebele architecture theme', 'Larger stand sizes'],
    2: ['Hilltop views', 'Quiet cul-de-sacs', 'Near proposed school'],
    3: ['Central park view', 'Walking trails', 'Children’s playground'],
    4: ['Eco-friendly design guidelines', 'Rainwater harvesting', 'Community garden'],
    5: ['Near clubhouse', 'Sports field access', 'Borehole priority'],
    6: ['Privacy walls', 'Gated sub-community', 'Low traffic'],
    7: ['Wine estate theme', 'Private vineyard plots', 'Tasting room access'],
    8: ['Commercial node nearby', 'Mixed-use zoning', 'High visibility'],
    9: ['Extra-large plots', 'Luxury finishes', 'Private security patrol'],
    10: ['Highest elevation', 'Panoramic views', 'Exclusive enclave'],
    11: ['Signature homes only', 'Premium landscaping', 'Private access gate'],
  };
  return [...common, ...(specific[phaseNum] || ['Modern infrastructure', 'Quality road network'])];
};

// Generate all phases I to XI
export const phasesData: Record<string, Phase> = {};

const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
for (let i = 1; i <= 11; i++) {
  const id = `phase-${roman[i-1].toLowerCase()}`;
  const phaseNum = i;
  let description = '';
  let image = `/images/phase_icon${i}.jpg`;
  if (i === 1) description = 'KwaNdebele – cultural heritage meets modern living. Stands 600-1000 sqm.';
  else if (i === 7) description = 'Umqombothi – wine estate inspired living. Stands 600-1000 sqm.';
  else if (i === 11) description = 'Mzinyathi Bosch – Matebele Finest. Signature homes.';
  else description = `Phase ${roman[i-1]} – a unique blend of nature and community. Stands 600-1000 sqm.`;

  phasesData[id] = {
    id,
    name: `Phase ${roman[i-1]}${i===1 ? ': KwaNdebele' : i===7 ? ': Umqombothi' : i===11 ? ': Mzinyathi Bosch' : ''}`,
    description,
    image,
    houses: generateHouses(id, i),
    features: getPhaseFeatures(i),
  };
}

// Export also for allPhases list
export const allPhases = Object.values(phasesData);