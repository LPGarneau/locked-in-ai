export type Tag = 'sleep'|'diet'|'move'|'skin'|'mind'|'supp'|'test';
export interface Task { title: string; note: string; tags: Tag[]; }
export interface Section { section: string; tasks: Task[]; }
export const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const;
export type Day = typeof DAYS[number];

export const WORKOUTS: Record<Day, string|null> = {
  Monday:'Legs', Tuesday:'Push', Wednesday:'Pull',
  Thursday:null, Friday:'Upper', Saturday:'Lower', Sunday:null,
};

const WD: Record<string,{warmup:string;main:string;mainNote:string;accessory:string}> = {
  Legs:{
    warmup:'Warm-up: leg swings, hip circles, bodyweight squats (2×10)',
    main:'Barbell back squat 4×5, Romanian deadlift 3×8, leg press 3×10',
    mainNote:'Leg day drives the biggest testosterone spike. Prioritize depth and control.',
    accessory:'Walking lunges 3×12, leg curl 3×12, calf raises 3×15',
  },
  Push:{
    warmup:'Warm-up: shoulder circles, band pull-aparts, incline push-ups (2×10)',
    main:'Bench press 4×5, overhead press 3×8, incline dumbbell press 3×10',
    mainNote:'Control the eccentric on all pressing. Time under tension drives hypertrophy.',
    accessory:'Lateral raises 3×15, tricep dips 3×10, cable flyes 3×12',
  },
  Pull:{
    warmup:'Warm-up: arm circles, face pulls, dead hangs 2×20 sec',
    main:'Deadlift 4×4, weighted pull-ups 3×6, barbell rows 3×8',
    mainNote:'Deadlifts + squats are the top two testosterone-spiking lifts. Drive through the floor.',
    accessory:'Cable rows 3×12, face pulls 3×15, hammer curls 3×12',
  },
  Upper:{
    warmup:'Warm-up: shoulder rotations, thoracic extensions, band rows (2×12)',
    main:'Overhead press 4×5, weighted chin-ups 3×6, dumbbell bench 3×8',
    mainNote:'Full upper session — hit push and pull patterns for balanced shoulder health.',
    accessory:'Single-arm rows 3×10, rear delt flyes 3×15, EZ-bar curls 3×10',
  },
  Lower:{
    warmup:'Warm-up: glute bridges 2×15, lateral band walks, hip flexor stretch',
    main:'Front squat 4×5, trap-bar deadlift 3×6, Bulgarian split squat 3×8',
    mainNote:'Focuses on single-leg stability and glute activation. Complements Monday heavy work.',
    accessory:'Nordic hamstring curl 3×8, hip thrust 3×12, step-ups 3×10',
  },
};

const BASE: Section[] = [
  { section:'Morning — on waking', tasks:[
    {title:'Wake without an alarm',note:'Go to bed early enough to wake naturally — abrupt alarms spike cortisol.',tags:['sleep']},
    {title:'Get bright light within 30 min of waking',note:'Step outside or 10,000-lux lamp 3–5 min. Sets circadian clock and supports testosterone.',tags:['sleep']},
    {title:'5–10 min breathing or meditation',note:'Lowers cortisol — chronically elevated cortisol directly suppresses testosterone.',tags:['mind']},
  ]},
  { section:'Morning — with breakfast', tasks:[
    {title:'Eat a high-fiber, nutrient-dense breakfast',note:'Cruciferous veg (broccoli, cauliflower, kale) support liver estrogen processing.',tags:['diet']},
    {title:'Collagen peptides (12–15 g)',note:'Mix into morning drink. Best absorbed early with vitamin C-rich food.',tags:['supp']},
    {title:'Prebiotic fiber — inulin or GOS (5–10 g)',note:'Stir into water or morning drink. Feeds beneficial gut bacteria.',tags:['supp']},
    {title:'Creatine monohydrate (5 g)',note:'Mix into morning drink. Supports strength, power output, and cognition.',tags:['supp']},
    {title:'Zinc (15–30 mg)',note:'Essential for testosterone synthesis enzymes. Deficiency directly lowers levels.',tags:['test']},
    {title:'Vitamin D3 + K2 (2000–5000 IU / 100 mcg)',note:'Fat-soluble — take with breakfast. D3 strongly correlated with testosterone.',tags:['supp','test']},
    {title:'Ashwagandha KSM-66 (600 mg)',note:'Reduces cortisol, raises free testosterone. RCTs confirm ~15–20% increase.',tags:['test']},
    {title:'NMN (500 mg)',note:'Morning — NAD+ precursors align with circadian energy rhythms. 6×/week.',tags:['supp']},
    {title:'Taurine (1–2 g)',note:'Supports cardiovascular and cellular health throughout the day.',tags:['supp']},
    {title:'Spermidine (1–2 mg)',note:'Triggers autophagy — cellular clean-up. Chlorella powder is a food-based alternative.',tags:['supp']},
    {title:'NAC (600 mg) + Curcumin (1 g) + Ginger (1 g)',note:'Anti-inflammatory stack. Curcumin needs fat for absorption.',tags:['supp']},
    {title:'Aged garlic extract / Kyolic (1.2 g)',note:'Take with food to reduce GI discomfort. Cardiovascular support.',tags:['supp']},
    {title:'Lycopene (10 mg)',note:'Fat-soluble antioxidant — take with your morning meal containing fat.',tags:['supp']},
  ]},
  { section:'Morning — after breakfast', tasks:[
    {title:'Morning cardio or HIIT (3×/week)',note:'Blueprint targets 75 min HIIT/week. Acutely spikes testosterone.',tags:['move']},
    {title:'Apply SPF before going outside',note:'Mineral sunscreen, hat, or UV-protective clothing.',tags:['skin']},
  ]},
  { section:'With lunch / midday meal', tasks:[
    {title:'Hit 100g+ protein from whole foods',note:'Essential for testosterone synthesis. Spread across meals.',tags:['diet']},
    {title:'Omega-3 DHA/EPA (1000–2000 mg)',note:'Take with largest meal — fat improves absorption.',tags:['supp']},
    {title:'Extra virgin olive oil (1 tbsp)',note:'Monounsaturated fats are a key building block for steroid hormones.',tags:['diet','test']},
  ]},
  { section:'Throughout the day', tasks:[
    {title:'5–10 min walk after every meal',note:'Blunts blood sugar spikes. High insulin chronically suppresses testosterone.',tags:['move']},
    {title:'Stand and move every 30 minutes',note:'Prolonged sitting harms longevity even if you exercise.',tags:['move']},
    {title:'Zero alcohol, zero ultra-processed food',note:'Alcohol suppresses testosterone for 24–48 hrs even in moderate amounts.',tags:['diet']},
    {title:'Spend meaningful time with someone you care about',note:'Positive social connection reduces cortisol and supports hormonal health.',tags:['mind']},
  ]},
  { section:'Early evening — last meal', tasks:[
    {title:'Stop eating 3–4 hrs before bed',note:"Bryan's last meal ~11 am–1 pm. Even stopping by 6–7 pm is a meaningful win.",tags:['diet']},
  ]},
];

const BEDTIME: Section = { section:'Bedtime', tasks:[
  {title:'Dim lights and avoid screens 1 hr before bed',note:'Most testosterone is produced during deep sleep.',tags:['sleep']},
  {title:'Magnesium glycinate (300–400 mg)',note:'30–60 min before bed. Promotes deep sleep and testosterone production.',tags:['supp','test']},
  {title:'Melatonin low-dose (0.3–1 mg)',note:"30 min before sleep. Don't exceed 1 mg.",tags:['supp']},
  {title:'Keep bedroom cool (18–20°C), dark, quiet',note:'Majority of daily testosterone is released during deep sleep.',tags:['sleep']},
  {title:'Same bedtime every night',note:'Consistency matters more than duration. 7 days a week.',tags:['sleep']},
]};

export function getSections(day: Day): Section[] {
  const sections = [...BASE];
  const w = WORKOUTS[day];
  if (w && WD[w]) {
    const d = WD[w];
    sections.push({ section:`Evening — strength training (${w})`, tasks:[
      {title:d.warmup,note:'Prepare joints and activate nervous system.',tags:['move']},
      {title:d.main,note:d.mainNote,tags:['move','test']},
      {title:d.accessory,note:'Support muscle balance and injury prevention.',tags:['move']},
      {title:'Cool-down: 5 min static stretching',note:'Lower post-workout cortisol. Focus on hips, hamstrings, chest.',tags:['move']},
      {title:'Post-workout protein (20–30 g)',note:'Within 1–2 hrs. Peak anabolic window of the day.',tags:['diet']},
    ]});
  }
  sections.push(BEDTIME);
  return sections;
}

export function getTotalTasks(day: Day) {
  return getSections(day).reduce((a,s) => a + s.tasks.length, 0);
}

export function getTodayName(): Day {
  const d = new Date().getDay();
  return DAYS[d === 0 ? 6 : d - 1];
}
