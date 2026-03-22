export type EvidenceLevel = 'strong'|'moderate'|'emerging';
export type SupplementCategory = 'foundation'|'antiInflammatory'|'longevity'|'testosterone'|'sleep';

export interface Supplement {
  id: string;
  name: string;
  dose: string;
  category: SupplementCategory;
  categoryLabel: string;
  description: string;
  evidence: EvidenceLevel;
  timing: string;
  searchQuery: string;
}

export const SUPPLEMENTS: Supplement[] = [
  {id:'omega3',name:'Omega-3 (DHA/EPA)',dose:'1000-2000 mg/day',category:'foundation',categoryLabel:'Foundation',
   description:"Bryan's #1 supplement. Heart, brain, inflammation. Take with your largest meal.",
   evidence:'strong',timing:'With lunch',searchQuery:'omega 3 DHA EPA high dose fish oil'},
  {id:'d3k2',name:'Vitamin D3 + K2',dose:'2000-5000 IU / 100 mcg',category:'foundation',categoryLabel:'Foundation',
   description:'Most people are deficient. Supports immunity, mood, bone density, and testosterone.',
   evidence:'strong',timing:'Breakfast (with fat)',searchQuery:'vitamin D3 K2 supplement 5000IU'},
  {id:'magnesium',name:'Magnesium Glycinate',dose:'300-400 mg/day',category:'foundation',categoryLabel:'Foundation',
   description:'Taken before bed. Supports deep sleep, muscle function, blood pressure, and testosterone.',
   evidence:'strong',timing:'Bedtime',searchQuery:'magnesium glycinate 400mg capsules'},
  {id:'creatine',name:'Creatine Monohydrate',dose:'5 g/day',category:'foundation',categoryLabel:'Foundation',
   description:'Most-studied supplement ever. Strength, power output, and cognitive function.',
   evidence:'strong',timing:'Morning drink',searchQuery:'creatine monohydrate micronized powder'},
  {id:'collagen',name:'Collagen Peptides',dose:'12-15 g/day',category:'foundation',categoryLabel:'Foundation',
   description:'Skin elasticity, joint health, muscle recovery. Mix into morning drink.',
   evidence:'moderate',timing:'Morning drink',searchQuery:'hydrolyzed collagen peptides powder unflavored'},
  {id:'prebiotic',name:'Prebiotic Fiber (Inulin/GOS)',dose:'5-10 g/day',category:'foundation',categoryLabel:'Foundation',
   description:'Feeds beneficial gut bacteria. Bryan mixes into his morning longevity drink.',
   evidence:'strong',timing:'Morning drink',searchQuery:'inulin prebiotic fiber powder GOS'},
  {id:'nac',name:'NAC + Curcumin + Ginger',dose:'600mg / 1g / 1g',category:'antiInflammatory',categoryLabel:'Anti-inflammatory',
   description:'NAC boosts glutathione; curcumin and ginger reduce systemic inflammation.',
   evidence:'strong',timing:'Breakfast (with fat)',searchQuery:'NAC curcumin ginger anti-inflammatory supplement'},
  {id:'kyolic',name:'Aged Garlic Extract (Kyolic)',dose:'1.2 g/day',category:'antiInflammatory',categoryLabel:'Anti-inflammatory',
   description:'Bryan specifically uses Kyolic brand. Blood pressure, cardiovascular health, immune function.',
   evidence:'moderate',timing:'Morning with food',searchQuery:'Kyolic aged garlic extract 1200mg'},
  {id:'lycopene',name:'Lycopene',dose:'10 mg/day',category:'antiInflammatory',categoryLabel:'Anti-inflammatory',
   description:'Fat-soluble carotenoid. Linked to lower cardiovascular and prostate cancer risk.',
   evidence:'moderate',timing:'Morning (with fat)',searchQuery:'lycopene supplement 10mg softgel'},
  {id:'nmn',name:'NMN',dose:'500 mg, 6x/week',category:'longevity',categoryLabel:'Longevity',
   description:'Raises NAD+ levels, which decline sharply with age affecting energy and DNA repair.',
   evidence:'emerging',timing:'Morning',searchQuery:'NMN nicotinamide mononucleotide 500mg'},
  {id:'spermidine',name:'Spermidine',dose:'1-2 mg/day',category:'longevity',categoryLabel:'Longevity',
   description:"Triggers autophagy - the body's cellular clean-up. Also available as chlorella powder.",
   evidence:'emerging',timing:'Breakfast',searchQuery:'spermidine supplement capsules'},
  {id:'taurine',name:'Taurine',dose:'1-2 g/day',category:'longevity',categoryLabel:'Longevity',
   description:'2023 Science paper: taurine deficiency accelerates aging. Cardiovascular and antioxidant benefits.',
   evidence:'emerging',timing:'Breakfast',searchQuery:'taurine supplement 1000mg powder'},
  {id:'ashwagandha',name:'Ashwagandha KSM-66',dose:'600 mg/day',category:'testosterone',categoryLabel:'Testosterone',
   description:'Most evidence-backed natural testosterone booster. Multiple RCTs confirm ~15-20% increase.',
   evidence:'strong',timing:'Breakfast',searchQuery:'ashwagandha KSM-66 extract 600mg'},
  {id:'zinc',name:'Zinc (Picolinate)',dose:'15-30 mg/day',category:'testosterone',categoryLabel:'Testosterone',
   description:'Essential for testosterone synthesis enzymes. Deficiency directly lowers levels.',
   evidence:'strong',timing:'Breakfast',searchQuery:'zinc picolinate 30mg supplement'},
  {id:'melatonin',name:'Melatonin (low dose)',dose:'0.3-1 mg at bedtime',category:'sleep',categoryLabel:'Sleep',
   description:'Bryan uses low-dose only. 0.3 mg is as effective as 5 mg with fewer side effects.',
   evidence:'strong',timing:'30 min before bed',searchQuery:'melatonin 0.3mg low dose sleep'},
];

export const CATEGORIES = [
  {id:'all',label:'All'},
  {id:'foundation',label:'Foundation'},
  {id:'antiInflammatory',label:'Anti-inflammatory'},
  {id:'longevity',label:'Longevity'},
  {id:'testosterone',label:'Testosterone'},
  {id:'sleep',label:'Sleep'},
] as const;

export function amazonUrl(query: string): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || '';
  const params = new URLSearchParams({k: query});
  if (tag) params.set('tag', tag);
  return `https://www.amazon.com/s?${params}`;
}