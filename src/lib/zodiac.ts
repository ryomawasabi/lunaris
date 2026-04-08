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

// Canonical effects for the 8 power stones sold on YINYANG GUARDIAN
export const POWER_STONE_EFFECTS: Record<string, { effects: string[]; nameJa: string; description: string }> = {
  'Smoky Quartz': {
    nameJa: 'スモーキークォーツ',
    effects: ['Grounding', 'Stress Relief', 'Negativity Shield'],
    description: 'Grounds your energy, eases stress, and shields against negativity.',
  },
  'Aquamarine': {
    nameJa: 'アクアマリン',
    effects: ['Calm', 'Communication', 'Emotional Balance'],
    description: 'Calms the mind, boosts communication, and brings emotional balance.',
  },
  'Amethyst': {
    nameJa: 'アメジスト',
    effects: ['Intuition', 'Restful Sleep', 'Aura Purification'],
    description: 'Enhances intuition, promotes restful sleep, and purifies your aura.',
  },
  'Black Obsidian': {
    nameJa: 'ブラックオブシディアン',
    effects: ['Protection', 'Negative Energy Clearing', 'Grounding'],
    description: 'Acts as a powerful protection stone, clears negative energy, and grounds the spirit.',
  },
  'Green Fluorite': {
    nameJa: 'グリーンフローライト',
    effects: ['Focus', 'Mental Clarity', 'Spiritual Growth'],
    description: 'Boosts focus, clears mental clutter, and supports spiritual growth.',
  },
  'Citrine': {
    nameJa: 'シトリン',
    effects: ['Abundance', 'Prosperity', 'Career Success'],
    description: 'Attracts abundance, prosperity, and positive energy for career success.',
  },
  'Rose Quartz': {
    nameJa: 'ローズクォーツ',
    effects: ['Love', 'Self-Worth', 'Compassion'],
    description: 'Attracts love, nurtures self-worth, and opens the heart to compassion.',
  },
  'Carnelian': {
    nameJa: 'カーネリアン',
    effects: ['Motivation', 'Vitality', 'Creativity'],
    description: 'Ignites motivation, boosts vitality, and fuels creativity and ambition.',
  },
};

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
      { name: 'Carnelian', reason: 'Ignites your warrior spirit with unstoppable motivation and the vitality to conquer any challenge.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Citrine', reason: 'Channels your ambitious drive into manifested abundance and career success.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your intense fire energy and shields you from negativity during bold pursuits.' },
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
      { name: 'Rose Quartz', reason: 'Nurtures your deep capacity for love and enhances your natural self-worth.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Citrine', reason: 'Aligns with your innate connection to prosperity and material abundance.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your steady energy and eases stress on the patient path to lasting comfort.' },
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
      { name: 'Aquamarine', reason: 'Enhances your gift for communication and brings emotional balance to your expressive energy.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Green Fluorite', reason: 'Sharpens your already brilliant mind and clears mental clutter across your many interests.' },
      { name: 'Carnelian', reason: 'Fuels your creative spark and keeps your vitality high as you explore new ideas.', productSlug: 'crimson-thread-of-fate-bracelet' },
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
      { name: 'Rose Quartz', reason: 'Amplifies your boundless capacity for nurturing love and opens the heart to compassion.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Amethyst', reason: 'Deepens your lunar intuition, promotes restful sleep, and purifies your sensitive aura.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Aquamarine', reason: 'Resonates with your water element, calming your mind with oceanic tranquility.', productSlug: 'ocean-embrace-earrings' },
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
      { name: 'Citrine', reason: 'Mirrors your solar energy, attracting abundance and fueling your natural magnetism.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Carnelian', reason: 'Boosts your creative vitality and keeps your passionate fire burning with ambition.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Black Obsidian', reason: 'Provides powerful protection for your radiant energy and grounds your regal spirit.', productSlug: 'midnight-obsidian-necklace' },
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
      { name: 'Green Fluorite', reason: 'Enhances your analytical focus and clears mental clutter for purposeful action.' },
      { name: 'Amethyst', reason: 'Promotes restful sleep after devoted service and purifies your aura from absorbed stress.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your energy and shields against absorbing others\' negativity while you serve.' },
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
      { name: 'Rose Quartz', reason: 'Deepens your gift for love, nurtures self-worth, and harmonizes relationships.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Aquamarine', reason: 'Calms your diplomatic mind and brings emotional balance to your pursuit of fairness.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Amethyst', reason: 'Enhances your intuition for reading others and purifies the energy around you.', productSlug: 'starlight-amethyst-bracelet' },
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
      { name: 'Black Obsidian', reason: 'Resonates with your shadow-work mastery, clearing negative energy and grounding your spirit.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Amethyst', reason: 'Supports your transformative power with deep intuition and aura purification.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Smoky Quartz', reason: 'Channels your passionate intensity into grounded power, shielding against negativity.' },
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
      { name: 'Citrine', reason: 'Amplifies your optimistic spirit and attracts prosperity on your adventurous journeys.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Carnelian', reason: 'Fuels your motivation and vitality to explore uncharted territories with ambition.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Green Fluorite', reason: 'Expands your philosophical vision with mental clarity and supports spiritual growth.' },
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
      { name: 'Smoky Quartz', reason: 'Grounds your ambition in the earth and eases stress on the climb to your summit.' },
      { name: 'Black Obsidian', reason: 'Provides powerful protection and clears negative energy on the path to mastery.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Carnelian', reason: 'Ignites the motivation and ambition to keep climbing when the path grows steep.', productSlug: 'crimson-thread-of-fate-bracelet' },
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
      { name: 'Aquamarine', reason: 'Deepens your connection to collective truth and boosts humanitarian communication.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Green Fluorite', reason: 'Balances your innovative energy with focused clarity, turning visions into reality.' },
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
      { name: 'Amethyst', reason: 'Enhances your natural mysticism, promotes restful sleep, and purifies your dreamy aura.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Rose Quartz', reason: 'Amplifies your boundless empathy while nurturing self-worth and self-love.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Aquamarine', reason: 'Flows with your water energy, calming the mind and balancing deep emotional currents.', productSlug: 'ocean-embrace-earrings' },
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
  'Black Obsidian': ['Black Obsidian'],
  'Amethyst': ['Amethyst'],
  'Aquamarine': ['Aquamarine'],
  'Smoky Quartz': ['Smoky Quartz'],
  'Green Fluorite': ['Fluorite', 'Green Fluorite'],
  'Carnelian': ['Carnelian'],
};

export function getMatchingCrystalTypes(crystalName: string): string[] {
  return CRYSTAL_NAME_MAP[crystalName] || [crystalName];
}

export { ZODIAC_SIGNS };
