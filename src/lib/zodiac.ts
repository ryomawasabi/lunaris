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
      { name: 'Carnelian', reason: 'Amplifies your natural vitality and courage, keeping your fire burning bright without burning out.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Black Tourmaline', reason: 'Grounds your intense energy and shields you during bold pursuits.', productSlug: 'moonlit-guardian-bracelet' },
      { name: 'Citrine', reason: 'Channels your ambitious drive into manifested abundance.', productSlug: 'golden-abundance-bracelet' },
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
      { name: 'Lapis Lazuli', reason: 'Deepens your wisdom and helps you trust your grounded intuition.', productSlug: 'celestial-shield-pendant' },
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
      { name: 'Labradorite', reason: 'Mirrors your multifaceted nature and supports transformation through every phase.', productSlug: 'aurora-borealis-earrings' },
      { name: 'Citrine', reason: 'Brightens your communicative gifts and attracts opportunities through your charm.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Lapis Lazuli', reason: 'Deepens your intellectual pursuits and enhances authentic self-expression.', productSlug: 'celestial-shield-pendant' },
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
      { name: 'Labradorite', reason: 'Strengthens your lunar intuition and protects your sensitive spirit.', productSlug: 'aurora-borealis-earrings' },
      { name: 'Black Tourmaline', reason: 'Creates an energetic shield for your deeply empathic nature.', productSlug: 'moonlit-guardian-bracelet' },
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
      { name: 'Carnelian', reason: 'Fuels your creative passion and keeps your expressive fire alive.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Lab-Created Diamond', reason: 'Reflects your brilliance and enduring commitment to those you love.', productSlug: 'eternal-bond-ring' },
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
      { name: 'Lapis Lazuli', reason: 'Enhances your analytical mind and connects wisdom to purpose.', productSlug: 'celestial-shield-pendant' },
      { name: 'Rose Quartz', reason: 'Softens self-criticism and reminds you to extend compassion inward.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Black Tourmaline', reason: 'Grounds your energy and protects against absorbing others\' stress.', productSlug: 'moonlit-guardian-bracelet' },
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
      { name: 'Lapis Lazuli', reason: 'Strengthens your sense of justice and authentic self-expression.', productSlug: 'celestial-shield-pendant' },
      { name: 'Labradorite', reason: 'Helps you see truth beyond surfaces and trust your inner knowing.', productSlug: 'aurora-borealis-earrings' },
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
      { name: 'Black Obsidian', reason: 'Resonates with your shadow-work mastery and deepest protective instincts.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Labradorite', reason: 'Supports your transformative power and reveals hidden truths.', productSlug: 'aurora-borealis-earrings' },
      { name: 'Carnelian', reason: 'Channels your passionate intensity into creative vitality.', productSlug: 'crimson-thread-of-fate-bracelet' },
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
      { name: 'Lapis Lazuli', reason: 'Expands your philosophical vision and connects you to universal wisdom.', productSlug: 'celestial-shield-pendant' },
      { name: 'Citrine', reason: 'Amplifies your optimistic spirit and attracts abundance on your journeys.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Labradorite', reason: 'Fuels your sense of magic and wonder in every new experience.', productSlug: 'aurora-borealis-earrings' },
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
      { name: 'Black Tourmaline', reason: 'Grounds your ambition and protects you on the climb to your summit.', productSlug: 'moonlit-guardian-bracelet' },
      { name: 'Citrine', reason: 'Manifests the material success your discipline deserves.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Black Obsidian', reason: 'Mirrors your depth and supports honest self-reflection on your path.', productSlug: 'midnight-obsidian-necklace' },
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
      { name: 'Labradorite', reason: 'Celebrates your visionary spirit and strengthens your intuitive genius.', productSlug: 'aurora-borealis-earrings' },
      { name: 'Lapis Lazuli', reason: 'Deepens your connection to collective wisdom and truth.', productSlug: 'celestial-shield-pendant' },
      { name: 'Rose Quartz', reason: 'Balances your intellectual energy with heartfelt compassion.', productSlug: 'whisper-of-rose-quartz-earrings' },
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
      { name: 'Labradorite', reason: 'Enhances your natural mysticism and protects during spiritual exploration.', productSlug: 'aurora-borealis-earrings' },
      { name: 'Rose Quartz', reason: 'Amplifies your boundless empathy while nurturing self-love.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Black Tourmaline', reason: 'Grounds your ethereal nature and shields your sensitive spirit.', productSlug: 'moonlit-guardian-bracelet' },
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
  'Black Tourmaline': ['Black Tourmaline'],
  'Lapis Lazuli': ['Lapis Lazuli'],
  'Rose Quartz': ['Rose Quartz'],
  'Lab-Created Diamond': ['Lab-Created Diamond'],
  'Citrine': ['Citrine'],
  'Black Obsidian': ['Black Obsidian'],
  'Carnelian': ['Carnelian'],
  'Labradorite': ['Labradorite'],
};

export function getMatchingCrystalTypes(crystalName: string): string[] {
  return CRYSTAL_NAME_MAP[crystalName] || [crystalName];
}

export { ZODIAC_SIGNS };
