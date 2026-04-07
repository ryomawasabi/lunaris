export interface ZodiacSign {
  name: string;
  nameJa: string;
  symbol: string;
  dateRange: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  energy: string;
  energyDescription: string;
  crystals: CrystalRecommendation[];
}

export interface CrystalRecommendation {
  name: string;
  reason: string;
  productSlug?: string; // Links to an existing YinYang Guardian product if available
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: 'Aries',
    nameJa: '牡羊座',
    symbol: '♈',
    dateRange: 'Mar 21 – Apr 19',
    element: 'Fire',
    energy: 'Warrior Spirit',
    energyDescription: 'Bold, passionate, and driven by courageous fire energy. You thrive when channeling your inner strength into decisive action.',
    crystals: [
      { name: 'Citrine', reason: 'Channels your ambitious drive into manifested abundance and keeps your warrior spirit shining bright.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Obsidian', reason: 'Grounds your intense fire energy and shields you during bold pursuits with its volcanic strength.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Smoky Quartz', reason: 'Transforms overwhelming energy into grounded determination, keeping you centered in battle.' },
    ],
  },
  {
    name: 'Taurus',
    nameJa: '牡牛座',
    symbol: '♉',
    dateRange: 'Apr 20 – May 20',
    element: 'Earth',
    energy: 'Grounded Abundance',
    energyDescription: 'Steady, sensual, and deeply connected to earthly beauty. Your energy attracts luxury and lasting comfort through patience.',
    crystals: [
      { name: 'Rose Quartz', reason: 'Nurtures your deep capacity for love and enhances your natural sensuality.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Citrine', reason: 'Aligns with your innate connection to prosperity and material harmony.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Amazonite', reason: 'Strengthens your resolve and brings hope, empowering your patient pursuit of beauty and truth.' },
    ],
  },
  {
    name: 'Gemini',
    nameJa: '双子座',
    symbol: '♊',
    dateRange: 'May 21 – Jun 20',
    element: 'Air',
    energy: 'Dual Radiance',
    energyDescription: 'Curious, expressive, and intellectually luminous. Your energy dances between worlds, finding connections others miss.',
    crystals: [
      { name: 'Ametrine', reason: 'Mirrors your dual nature perfectly—blending the calm of amethyst with the spark of citrine in one stone.' },
      { name: 'Fluorite', reason: 'Sharpens your already brilliant mind and helps organize your many-layered thoughts with crystal clarity.' },
      { name: 'Aquamarine', reason: 'Enhances your gift for communication and brings flow to your expressive energy.', productSlug: 'ocean-embrace-earrings' },
    ],
  },
  {
    name: 'Cancer',
    nameJa: '蟹座',
    symbol: '♋',
    dateRange: 'Jun 21 – Jul 22',
    element: 'Water',
    energy: 'Lunar Nurture',
    energyDescription: 'Intuitive, protective, and emotionally deep. Ruled by the Moon, your energy flows with tides of compassion and care.',
    crystals: [
      { name: 'Rose Quartz', reason: 'Amplifies your boundless capacity for nurturing love and emotional healing.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Amethyst', reason: 'Deepens your lunar intuition and brings calming clarity to your emotional tides.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Aquamarine', reason: 'Resonates with your water element, soothing your sensitive spirit with oceanic tranquility.', productSlug: 'ocean-embrace-earrings' },
    ],
  },
  {
    name: 'Leo',
    nameJa: '獅子座',
    symbol: '♌',
    dateRange: 'Jul 23 – Aug 22',
    element: 'Fire',
    energy: 'Solar Sovereignty',
    energyDescription: 'Radiant, generous, and magnetically creative. Your energy commands attention and inspires others to shine.',
    crystals: [
      { name: 'Citrine', reason: 'Mirrors your solar energy and amplifies your natural magnetism and abundance.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Rock Crystal', reason: 'Amplifies your radiant energy to its fullest brilliance, like a crown of pure light.' },
      { name: 'Ametrine', reason: 'Fuels your creative passion while maintaining the regal composure that defines you.' },
    ],
  },
  {
    name: 'Virgo',
    nameJa: '乙女座',
    symbol: '♍',
    dateRange: 'Aug 23 – Sep 22',
    element: 'Earth',
    energy: 'Sacred Precision',
    energyDescription: 'Analytical, devoted, and gracefully meticulous. Your energy refines and heals through attention to detail and service.',
    crystals: [
      { name: 'Fluorite', reason: 'Enhances your analytical mind with rainbow clarity, organizing thoughts into purposeful action.' },
      { name: 'Amethyst', reason: 'Softens self-criticism and connects your meticulous nature to spiritual wisdom.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your energy and protects against absorbing others\' stress while you serve.' },
    ],
  },
  {
    name: 'Libra',
    nameJa: '天秤座',
    symbol: '♎',
    dateRange: 'Sep 23 – Oct 22',
    element: 'Air',
    energy: 'Harmonic Balance',
    energyDescription: 'Graceful, diplomatic, and aesthetically attuned. Your energy seeks beauty and equilibrium in all things.',
    crystals: [
      { name: 'Rose Quartz', reason: 'Deepens your gift for love and harmonious relationships.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Ametrine', reason: 'Embodies the balance you seek—two energies in perfect harmony within a single stone.' },
      { name: 'Aquamarine', reason: 'Brings clarity to your diplomatic mind and enhances your natural sense of fairness.', productSlug: 'ocean-embrace-earrings' },
    ],
  },
  {
    name: 'Scorpio',
    nameJa: '蠍座',
    symbol: '♏',
    dateRange: 'Oct 23 – Nov 21',
    element: 'Water',
    energy: 'Phoenix Depth',
    energyDescription: 'Intense, transformative, and magnetically mysterious. Your energy pierces illusions and emerges stronger from every rebirth.',
    crystals: [
      { name: 'Obsidian', reason: 'Resonates with your shadow-work mastery and deepest protective instincts.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Amethyst', reason: 'Supports your transformative power and reveals hidden truths through spiritual clarity.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Smoky Quartz', reason: 'Channels your passionate intensity into grounded power, turning darkness into strength.' },
    ],
  },
  {
    name: 'Sagittarius',
    nameJa: '射手座',
    symbol: '♐',
    dateRange: 'Nov 22 – Dec 21',
    element: 'Fire',
    energy: 'Cosmic Wanderer',
    energyDescription: 'Adventurous, philosophical, and eternally optimistic. Your energy seeks truth across horizons and cultures.',
    crystals: [
      { name: 'Citrine', reason: 'Amplifies your optimistic spirit and attracts abundance on your journeys.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Amazonite', reason: 'Fuels your adventurous hope and courage to explore uncharted territories.' },
      { name: 'Fluorite', reason: 'Expands your philosophical vision with clarity, connecting wisdom across cultures and horizons.' },
    ],
  },
  {
    name: 'Capricorn',
    nameJa: '山羊座',
    symbol: '♑',
    dateRange: 'Dec 22 – Jan 19',
    element: 'Earth',
    energy: 'Mountain Wisdom',
    energyDescription: 'Disciplined, ambitious, and quietly powerful. Your energy climbs steadily toward mastery, guided by ancient patience.',
    crystals: [
      { name: 'Smoky Quartz', reason: 'Grounds your ambition in the earth and protects you on the climb to your summit.' },
      { name: 'Obsidian', reason: 'Mirrors your depth and supports honest self-reflection on the path to mastery.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Rock Crystal', reason: 'Amplifies your disciplined focus and manifests the clarity your patience deserves.' },
    ],
  },
  {
    name: 'Aquarius',
    nameJa: '水瓶座',
    symbol: '♒',
    dateRange: 'Jan 20 – Feb 18',
    element: 'Air',
    energy: 'Visionary Current',
    energyDescription: 'Innovative, humanitarian, and beautifully unconventional. Your energy disrupts the ordinary and envisions new possibilities.',
    crystals: [
      { name: 'Amethyst', reason: 'Celebrates your visionary spirit and strengthens your intuitive genius.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Aquamarine', reason: 'Deepens your connection to collective truth and humanitarian flow.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Fluorite', reason: 'Balances your innovative energy with structured clarity, turning visions into reality.' },
    ],
  },
  {
    name: 'Pisces',
    nameJa: '魚座',
    symbol: '♓',
    dateRange: 'Feb 19 – Mar 20',
    element: 'Water',
    energy: 'Mystic Flow',
    energyDescription: 'Dreamy, empathic, and spiritually boundless. Your energy dissolves barriers between worlds, channeling art and compassion.',
    crystals: [
      { name: 'Amethyst', reason: 'Enhances your natural mysticism and protects during spiritual exploration.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Rose Quartz', reason: 'Amplifies your boundless empathy while nurturing self-love.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Aquamarine', reason: 'Flows with your water energy, bringing peace and clarity to your deep emotional currents.', productSlug: 'ocean-embrace-earrings' },
    ],
  },
];

export function getZodiacFromDate(month: number, day: number): ZodiacSign {
  // month: 1-12, day: 1-31
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];  // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];  // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];  // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];  // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];  // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];  // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];  // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];  // Aquarius
  return ZODIAC_SIGNS[11]; // Pisces
}

export function getElementColor(element: string): string {
  switch (element) {
    case 'Fire': return 'from-orange-400/20 to-red-400/20';
    case 'Earth': return 'from-emerald-400/20 to-amber-400/20';
    case 'Air': return 'from-sky-400/20 to-violet-400/20';
    case 'Water': return 'from-blue-400/20 to-indigo-400/20';
    default: return 'from-gold/20 to-gold-light/20';
  }
}

export function getElementBorder(element: string): string {
  switch (element) {
    case 'Fire': return 'border-orange-300/40';
    case 'Earth': return 'border-emerald-300/40';
    case 'Air': return 'border-sky-300/40';
    case 'Water': return 'border-blue-300/40';
    default: return 'border-gold/40';
  }
}

// Map crystal names used in zodiac recommendations to product crystalType values
// This handles cases where the zodiac uses a slightly different name
const CRYSTAL_NAME_MAP: Record<string, string[]> = {
  'Rose Quartz': ['Rose Quartz'],
  'Citrine': ['Citrine'],
  'Obsidian': ['Black Obsidian'],
  'Amethyst': ['Amethyst'],
  'Aquamarine': ['Aquamarine'],
  'Smoky Quartz': ['Smoky Quartz'],
  'Fluorite': ['Fluorite'],
  'Ametrine': ['Ametrine'],
  'Amazonite': ['Amazonite'],
  'Rock Crystal': ['Rock Crystal', 'Clear Quartz'],
};

export function getMatchingCrystalTypes(crystalName: string): string[] {
  return CRYSTAL_NAME_MAP[crystalName] || [crystalName];
}

export { ZODIAC_SIGNS };
