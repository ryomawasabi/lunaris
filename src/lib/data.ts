import { Product, Collection, Category, Review } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "prod_021",
    slug: "rose-berry-essence-oil",
    name: "Rose Berry Essence Oil",
    price: 55,
    category: "Essence Oils",
    collection: ["Essence Oil", "Love & Harmony"],
    gemstone: "Rose Quartz",
    crystalType: "Rose Quartz",
    crystalEffects: ["Love", "Emotional Healing", "Heart Opening", "Self-Care"],
    symbolicMeaning:
      "A nurturing blend of rose and berry botanicals, charged with rose quartz to open the heart chakra and invite unconditional love.",
    shortDescription:
      "Crystal-charged aromatherapy oil infused with rose and wild berry essence, paired with rose quartz stones for heart chakra activation.",
    longDescription:
      "Rose Berry Essence Oil is a luxurious blend of pure rose extract and wild berry botanicals, each drop carefully crafted to harmonize with the heart chakra. The oil is charged alongside hand-selected rose quartz crystals, infusing every application with the gentle vibration of unconditional love. Rose resonates with yin energy — soft, receptive, and nurturing — while the vibrant berry notes carry a subtle yang spark of joy and vitality. Use it as a meditation aid, add it to your bath ritual, or apply to pulse points throughout the day. The included rose quartz stones can be placed in the glass vessel for continuous crystal infusion. A beautiful bridge between aromatherapy and crystal healing.",
    materials: [
      "Pure rose essential oil",
      "Wild berry botanical extract",
      "Rose quartz crystal chips",
      "Glass dropper bottle",
    ],
    images: [
      "/Essence oil/Rose Berry.png",
    ],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_022",
    slug: "chocolate-gourmet-essence-oil",
    name: "Chocolate Gourmet Essence Oil",
    price: 55,
    category: "Essence Oils",
    collection: ["Essence Oil"],
    gemstone: "Smoky Quartz",
    crystalType: "Smoky Quartz",
    crystalEffects: ["Grounding", "Comfort", "Stress Relief", "Warmth"],
    symbolicMeaning:
      "A grounding blend of rich cacao and warm spice, charged with smoky quartz to anchor your root chakra and wrap you in comfort.",
    shortDescription:
      "Crystal-charged aromatherapy oil infused with cacao and hazelnut essence, paired with smoky quartz stones for root chakra grounding.",
    longDescription:
      "Chocolate Gourmet Essence Oil is a decadent blend of pure cacao absolute, warm hazelnut, and a hint of vanilla bean. Each bottle is charged alongside hand-selected smoky quartz crystals, grounding every drop in the stabilizing energy of the root chakra. Cacao has been revered since ancient times as a sacred heart opener, while smoky quartz dissolves stress and negativity. Together they create a deeply comforting ritual — perfect for evening meditation, self-care baths, or moments when you need to feel held by the earth. The included smoky quartz chips can be added to your crystal vessel for continuous infusion.",
    materials: [
      "Pure cacao absolute",
      "Hazelnut botanical extract",
      "Vanilla bean essence",
      "Smoky quartz crystal chips",
      "Glass dropper bottle",
    ],
    images: [
      "/Essence oil/Chocolate Gourmet.png",
    ],
    badges: ["new"],
    rating: 4.7,
    reviewCount: 31,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_023",
    slug: "citrus-mint-essence-oil",
    name: "Citrus Mint Essence Oil",
    price: 55,
    category: "Essence Oils",
    collection: ["Essence Oil"],
    gemstone: "Citrine",
    crystalType: "Citrine",
    crystalEffects: ["Energy", "Clarity", "Joy", "Manifestation"],
    symbolicMeaning:
      "A vibrant blend of citrus and fresh mint, charged with citrine to ignite the solar plexus chakra and awaken joyful energy.",
    shortDescription:
      "Crystal-charged aromatherapy oil infused with lemon, orange, and peppermint essence, paired with citrine stones for solar plexus activation.",
    longDescription:
      "Citrus Mint Essence Oil bursts with the uplifting energy of sun-ripened lemon, sweet orange, and crisp peppermint. Charged alongside golden citrine crystals, this blend activates the solar plexus chakra — your center of confidence, willpower, and radiant joy. Citrus carries pure yang energy: bright, expansive, and forward-moving, while mint clears stagnant chi and sharpens focus. Use it as a morning ritual to set your intention, diffuse it during work for sustained clarity, or apply to pulse points before any situation that calls for your boldest self. The included citrine chips amplify abundance consciousness with every use.",
    materials: [
      "Pure lemon essential oil",
      "Sweet orange extract",
      "Peppermint essential oil",
      "Citrine crystal chips",
      "Glass dropper bottle",
    ],
    images: [
      "/Essence oil/Citrus mint.png",
    ],
    badges: ["new"],
    rating: 4.9,
    reviewCount: 56,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_024",
    slug: "ocean-vetiver-essence-oil",
    name: "Ocean Vetiver Essence Oil",
    price: 55,
    category: "Essence Oils",
    collection: ["Essence Oil"],
    gemstone: "Aquamarine",
    crystalType: "Aquamarine",
    crystalEffects: ["Calm", "Communication", "Purification", "Flow"],
    symbolicMeaning:
      "An oceanic blend of vetiver and sea minerals, charged with aquamarine to open the throat chakra and invite the flow of calm communication.",
    shortDescription:
      "Crystal-charged aromatherapy oil infused with vetiver and ocean botanicals, paired with aquamarine stones for throat chakra purification.",
    longDescription:
      "Ocean Vetiver Essence Oil captures the serene power of the sea — deep vetiver root grounded by oceanic mineral notes and a whisper of sea grass. Charged alongside pale blue aquamarine crystals, this blend resonates with the throat chakra, the energy center of truthful expression and fluid communication. Vetiver is the ultimate yin essence: deep, earthy, and calming, while aquamarine channels the ocean's endless flow. Together they create a profound sense of peace that settles the nervous system and opens the voice. Ideal for meditation near water, pre-speaking rituals, or any time you need to return to your deepest calm.",
    materials: [
      "Pure vetiver essential oil",
      "Sea mineral extract",
      "Sea grass botanical essence",
      "Aquamarine crystal chips",
      "Glass dropper bottle",
    ],
    images: [
      "/Essence oil/Ocean Vetiver.png",
    ],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 38,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_025",
    slug: "oud-wood-essence-oil",
    name: "Oud Wood Essence Oil",
    price: 55,
    category: "Essence Oils",
    collection: ["Essence Oil"],
    gemstone: "Amethyst",
    crystalType: "Amethyst",
    crystalEffects: ["Spiritual Awareness", "Wisdom", "Protection", "Meditation"],
    symbolicMeaning:
      "A sacred blend of ancient oud and forest botanicals, charged with amethyst to activate the third eye and crown chakras for deep spiritual connection.",
    shortDescription:
      "Crystal-charged aromatherapy oil infused with rare oud wood and forest moss, paired with amethyst stones for crown chakra meditation.",
    longDescription:
      "Oud Wood Essence Oil is our most mystical blend, built around the legendary agarwood — one of the rarest and most prized aromatics in the world. Deep oud is layered with forest moss, ancient cedar, and a breath of frankincense, then charged alongside purple amethyst crystals that resonate with the third eye and crown chakras. Oud has been used in spiritual ceremonies across cultures for millennia, valued for its ability to quiet the mind and open the gateway to higher consciousness. This oil is crafted for those who seek depth in their practice — use it during meditation, energy healing sessions, or as an evening ritual to close the day with wisdom and peace.",
    materials: [
      "Rare oud wood absolute",
      "Forest moss extract",
      "Cedar essential oil",
      "Frankincense resin essence",
      "Amethyst crystal chips",
      "Glass dropper bottle",
    ],
    images: [
      "/Essence oil/Oud Wood.png",
    ],
    badges: ["new"],
    rating: 4.9,
    reviewCount: 27,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_026",
    slug: "white-musk-essence-oil",
    name: "White Musk Essence Oil",
    price: 55,
    category: "Essence Oils",
    collection: ["Essence Oil"],
    gemstone: "Clear Quartz",
    crystalType: "Clear Quartz",
    crystalEffects: ["Clarity", "Amplification", "Purity", "Harmony"],
    symbolicMeaning:
      "A pure and ethereal blend of white musk and cotton flower, charged with clear quartz to amplify all chakras and create a sanctuary of clean energy.",
    shortDescription:
      "Crystal-charged aromatherapy oil infused with white musk and cotton blossom, paired with clear quartz stones for full-spectrum chakra amplification.",
    longDescription:
      "White Musk Essence Oil is the purest expression of our collection — a clean, luminous blend of ethically sourced white musk, soft cotton flower, and a touch of white tea. Charged alongside clear quartz, the master healer crystal that amplifies the energy of all seven chakras simultaneously. White musk embodies the balance point of yin and yang: neither heavy nor light, neither warm nor cool, but perfectly centered. This makes it the ideal everyday essence — one that creates a clean energetic field around you without imposing any particular mood. Use it as your daily signature scent, layer it with other oils in our collection, or diffuse it to purify your living space.",
    materials: [
      "Ethically sourced white musk",
      "Cotton flower extract",
      "White tea essence",
      "Clear quartz crystal chips",
      "Glass dropper bottle",
    ],
    images: [
      "/Essence oil/White Musk.png",
    ],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 45,
    isNew: true,
    isGiftable: true,
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "col_005",
    slug: "essence-oil",
    name: "Essence Oil",
    tagline: "Aromatic chi activation through sacred botanicals",
    description: "Pure essential oil blends infused with crystal energy to harmonize your chakras and elevate your daily rituals.",
    longDescription:
      "Our Essence Oil collection bridges the worlds of aromatherapy and crystal healing. Each blend is carefully crafted from pure botanical extracts — lavender for crown chakra calm, eucalyptus for throat chakra clarity, and ylang-ylang for heart chakra opening — then charged alongside their corresponding crystals. In yin-yang philosophy, scent is the invisible bridge between body and spirit: yin in its subtlety, yang in its power to transform a space instantly. Use these oils in meditation, bath rituals, or simply to infuse your environment with balanced chi. Every drop carries the intention of alignment.",
    image: "/Essence oil/Rose Berry.png",
    symbolism:
      "Aromatic chi, botanical alchemy, sensory healing. The invisible energy of scent as a pathway to chakra balance.",
    productCount: 6,
  },
  {
    id: "col_006",
    slug: "crystal-diffuser",
    name: "Crystal Diffuser",
    tagline: "Ambient chi purification through crystal mist",
    description: "Crystal-infused diffusers that cleanse your space with harmonized mist, merging stone energy with aromatic vapor.",
    longDescription:
      "Our Crystal Diffuser collection transforms any room into a sanctuary of balanced energy. Each diffuser is designed with a chamber for genuine crystals — amethyst for spiritual purification, clear quartz for amplification, or rose quartz for heart-centered calm — allowing water vapor to pass through the stones before filling your space with energized mist. In yin-yang philosophy, water is the ultimate yin element: receptive, flowing, and cleansing. When it meets the yang solidity of crystal, the result is a harmonized atmosphere that supports meditation, rest, and inner alignment. Place one in your living space and feel the chi shift.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=1200&h=600&fit=crop&q=80",
    symbolism:
      "Yin water meets yang stone, spatial purification, ambient harmony. The art of transforming your environment through crystal-charged mist.",
    productCount: 0,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "cat_007",
    slug: "essence-oils",
    name: "Essence Oils",
    image: "/Essence oil/Rose Berry.png",
    productCount: 6,
  },
];

export const REVIEWS: Review[] = [
  {
    id: "rev_001",
    author: "Sarah M.",
    rating: 5,
    text: "The Rose Berry oil is absolutely divine. The scent is soft and nurturing, perfect for my evening meditation. I can feel the rose quartz energy every time I use it.",
    date: "2026-03-15",
    verified: true,
  },
  {
    id: "rev_002",
    author: "James T.",
    rating: 5,
    text: "Oud Wood is incredible. The depth and richness of the scent is unlike anything I've experienced. It truly transforms my meditation space.",
    date: "2026-03-10",
    verified: true,
  },
  {
    id: "rev_003",
    author: "Michelle L.",
    rating: 4,
    text: "Love the Citrus Mint oil — it's my go-to morning ritual now. Wakes me up and keeps me focused throughout the day. Great quality.",
    date: "2026-03-05",
    verified: true,
  },
  {
    id: "rev_004",
    author: "David K.",
    rating: 5,
    text: "The Crystal Essence Set is a work of art. Choosing my own stones and oil made it feel truly personal. The glass vessel is stunning.",
    date: "2026-02-28",
    verified: true,
  },
  {
    id: "rev_005",
    author: "Elena G.",
    rating: 5,
    text: "White Musk is my daily signature. It's clean, balanced, and somehow makes every space feel more peaceful. Layering it with Rose Berry is magical.",
    date: "2026-02-20",
    verified: true,
  },
];
