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
  {
    id: "prod_027",
    slug: "rose-quartz-divination-sphere",
    name: "Rose Quartz Divination Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Love & Harmony"],
    gemstone: "Rose Quartz",
    crystalType: "Rose Quartz",
    crystalEffects: ["Love", "Emotional Healing", "Compassion", "Inner Peace"],
    symbolicMeaning:
      "A sphere of unconditional love — rose quartz opens the heart chakra and invites gentle healing energy into your divination practice.",
    shortDescription:
      "Hand-polished rose quartz crystal ball for heart-centered divination, meditation, and emotional healing rituals.",
    longDescription:
      "The Rose Quartz Divination Sphere is a masterpiece of crystalline compassion, hand-polished from a single piece of premium rose quartz. Its soft pink luminescence carries the gentle vibration of unconditional love, making it the ideal companion for heart-centered scrying and meditation. Rose quartz has been revered across cultures as the stone of the heart — the ancient Greeks associated it with Aphrodite, while Chinese feng shui masters use it to attract love and harmonize relationships. Place this sphere in your sacred space to radiate a constant field of emotional healing energy, or hold it during meditation to dissolve emotional wounds and open yourself to deeper self-love.",
    materials: [
      "Natural rose quartz sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190638_587.png",
    ],
    badges: ["new"],
    rating: 4.9,
    reviewCount: 18,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_028",
    slug: "malachite-vision-sphere",
    name: "Malachite Vision Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Protection"],
    gemstone: "Malachite",
    crystalType: "Malachite",
    crystalEffects: ["Transformation", "Protection", "Abundance", "Insight"],
    symbolicMeaning:
      "Deep green malachite channels the transformative power of nature — a guardian stone that absorbs negative energy and reveals hidden truths.",
    shortDescription:
      "Hand-polished malachite crystal ball for transformative divination, protection rituals, and abundance manifestation.",
    longDescription:
      "The Malachite Vision Sphere radiates with deep, swirling greens reminiscent of ancient forests and sacred groves. Malachite is one of the oldest known protective stones — Egyptian pharaohs lined their headdresses with it, believing it granted the power to see into the spiritual realm. This sphere harnesses that same transformative energy, making it an exceptional tool for scrying sessions focused on personal growth and breaking through stagnant patterns. Its vibrant green frequency activates the heart and solar plexus chakras simultaneously, creating a powerful bridge between love and personal power. Use it in abundance rituals to amplify your manifestation practice, or place it near your workspace to shield against electromagnetic and emotional pollution.",
    materials: [
      "Natural malachite sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190646_587.png",
    ],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 14,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_029",
    slug: "aquamarine-serenity-sphere",
    name: "Aquamarine Serenity Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Calm & Clarity"],
    gemstone: "Aquamarine",
    crystalType: "Aquamarine",
    crystalEffects: ["Serenity", "Communication", "Courage", "Clarity"],
    symbolicMeaning:
      "The pale blue of aquamarine holds the calm of the ocean depths — a stone of courage and clear communication that soothes the throat chakra.",
    shortDescription:
      "Hand-polished aquamarine crystal ball for serene divination, throat chakra activation, and clarity rituals.",
    longDescription:
      "The Aquamarine Serenity Sphere captures the tranquil essence of still ocean waters within its luminous pale blue form. Aquamarine — literally 'water of the sea' — has been a sailor's talisman for millennia, believed to calm waves and ensure safe passage. In your divination practice, this sphere brings that same calming energy, clearing mental chatter and opening channels of intuitive communication. The stone resonates deeply with the throat chakra, making it especially powerful for those seeking to speak their truth or develop clairaudient abilities. Hold this sphere during meditation to enter a state of profound serenity, or use it in scrying sessions when you need answers that require emotional detachment and crystalline clarity.",
    materials: [
      "Natural aquamarine sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190651_065.png",
    ],
    badges: ["new"],
    rating: 4.9,
    reviewCount: 22,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_030",
    slug: "red-jasper-grounding-sphere",
    name: "Red Jasper Grounding Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Grounding"],
    gemstone: "Red Jasper",
    crystalType: "Red Jasper",
    crystalEffects: ["Grounding", "Stability", "Endurance", "Vitality"],
    symbolicMeaning:
      "Red jasper embodies the primal energy of the earth — a nurturing stone of endurance and stability that roots you firmly in the present moment.",
    shortDescription:
      "Hand-polished red jasper crystal ball for grounding divination, root chakra activation, and vitality rituals.",
    longDescription:
      "The Red Jasper Grounding Sphere is forged from the earth's deepest foundations, its rich terracotta surface a testament to millions of years of geological alchemy. Known as the 'Stone of Endurance,' red jasper was carried by warriors and shamans alike for its ability to channel the earth's stabilizing force. This sphere activates the root chakra with powerful grounding energy, making it the ideal tool for divination sessions when you feel scattered or unmoored. Its warm, steady vibration creates a protective anchor point during deep scrying, preventing spiritual drift and keeping you firmly connected to your physical body. Place it in the southern corner of your space to ignite the flame of motivation, or hold it when you need the courage to face difficult truths revealed in your practice.",
    materials: [
      "Natural red jasper sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190657_200.png",
    ],
    badges: ["new"],
    rating: 4.7,
    reviewCount: 16,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_031",
    slug: "clear-quartz-oracle-sphere",
    name: "Clear Quartz Oracle Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Calm & Clarity"],
    gemstone: "Clear Quartz",
    crystalType: "Clear Quartz",
    crystalEffects: ["Amplification", "Clarity", "Manifestation", "Healing"],
    symbolicMeaning:
      "The master healer — clear quartz amplifies intention and energy, serving as the purest window into the unseen realms of consciousness.",
    shortDescription:
      "Hand-polished clear quartz crystal ball for pure divination, energy amplification, and full-spectrum healing rituals.",
    longDescription:
      "The Clear Quartz Oracle Sphere is the quintessential divination tool, revered by seers and mystics throughout recorded history. Clear quartz — the 'Master Healer' — possesses the unique ability to amplify any energy or intention directed through it, making it the most versatile crystal sphere in existence. Its pristine transparency serves as a blank canvas for the third eye, allowing visions to form with remarkable clarity during scrying sessions. This sphere resonates with all seven chakras simultaneously, creating a unified energetic field that enhances every aspect of your spiritual practice. Whether you are a seasoned scryer or beginning your journey into crystal divination, the Clear Quartz Oracle Sphere will meet you exactly where you are and elevate your practice to new heights.",
    materials: [
      "Natural clear quartz sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190702_273.png",
    ],
    badges: ["new", "bestseller"],
    rating: 4.9,
    reviewCount: 37,
    isNew: true,
    isBestSeller: true,
    isGiftable: true,
  },
  {
    id: "prod_032",
    slug: "amethyst-intuition-sphere",
    name: "Amethyst Intuition Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Spiritual Growth"],
    gemstone: "Amethyst",
    crystalType: "Amethyst",
    crystalEffects: ["Intuition", "Spiritual Awareness", "Protection", "Wisdom"],
    symbolicMeaning:
      "Amethyst opens the crown chakra gateway — the stone of spiritual wisdom that deepens intuition and guards against psychic attack.",
    shortDescription:
      "Hand-polished amethyst crystal ball for intuitive divination, crown chakra awakening, and spiritual protection rituals.",
    longDescription:
      "The Amethyst Intuition Sphere is a breathtaking vessel of spiritual wisdom, its deep purple depths swirling with the energy of higher consciousness. Amethyst has been the stone of royalty and spirituality since ancient times — Greek legend tells of Dionysus creating the purple crystal to protect the pure-hearted maiden Amethystos. This sphere activates the third eye and crown chakras simultaneously, creating a powerful conduit for psychic visions and spiritual downloads during scrying sessions. Its natural protective frequency shields your energy field from negativity while you explore the deepest layers of consciousness. Place this sphere in your meditation space to create an atmosphere of sacred wisdom, or work with it during full moon rituals to amplify your intuitive gifts to their highest potential.",
    materials: [
      "Natural amethyst sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190706_386.png",
    ],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 29,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_033",
    slug: "rose-quartz-heart-oracle",
    name: "Rose Quartz Heart Oracle",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Love & Harmony"],
    gemstone: "Rose Quartz",
    crystalType: "Rose Quartz",
    crystalEffects: ["Self-Love", "Forgiveness", "Emotional Balance", "Trust"],
    symbolicMeaning:
      "A deeper expression of rose quartz energy — this oracle sphere specializes in matters of the heart, revealing pathways to forgiveness and self-acceptance.",
    shortDescription:
      "Hand-polished rose quartz oracle sphere for love-centered divination, emotional balance, and self-acceptance rituals.",
    longDescription:
      "The Rose Quartz Heart Oracle is a luminous sphere of pure emotional alchemy, hand-selected for its exceptional pink clarity and energy. While its sister sphere focuses on the broad spectrum of love energy, this oracle stone specializes in the deeper work of emotional healing — the kind that transforms wounds into wisdom and grief into grace. Its resonance reaches the innermost chambers of the heart chakra, gently dissolving layers of emotional armor built up over lifetimes. Work with this sphere when seeking guidance on matters of love and relationship, whether romantic, familial, or the most important relationship of all — the one with yourself. Its gentle energy creates a safe container for vulnerability during scrying sessions, allowing repressed emotions to surface and be transformed into sources of strength.",
    materials: [
      "Natural rose quartz sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190710_943.png",
    ],
    badges: ["new"],
    rating: 4.9,
    reviewCount: 21,
    isNew: true,
    isGiftable: true,
  },
  {
    id: "prod_034",
    slug: "obsidian-shadow-sphere",
    name: "Obsidian Shadow Sphere",
    price: 159,
    category: "Crystal Balls",
    collection: ["Crystal Ball", "Protection"],
    gemstone: "Obsidian",
    crystalType: "Obsidian",
    crystalEffects: ["Protection", "Truth", "Shadow Work", "Grounding"],
    symbolicMeaning:
      "Born from volcanic fire — obsidian is the mirror of the soul, fearlessly revealing hidden truths and providing impenetrable psychic protection.",
    shortDescription:
      "Hand-polished obsidian crystal ball for deep shadow work, psychic protection, and truth-revealing divination rituals.",
    longDescription:
      "The Obsidian Shadow Sphere is the most powerful protective stone in our crystal ball collection, born from the rapid cooling of volcanic lava — fire transformed into glass in an instant. Ancient Mesoamerican priests used obsidian mirrors for divination, believing the stone's perfect darkness served as a portal to the spirit world. This sphere carries that same raw, uncompromising energy, making it the ultimate tool for shadow work and truth-seeking scrying sessions. Obsidian does not soften its revelations; it shows you exactly what you need to see, no matter how uncomfortable. It creates an impenetrable shield around your energy field, absorbing and transmuting negativity on contact. Work with this sphere during new moon rituals to confront and integrate your shadow self, or keep it near your front door to guard your home against negative energies and unwanted spiritual visitors.",
    materials: [
      "Natural obsidian sphere",
      "Velvet ritual cloth",
      "Wooden display stand",
    ],
    images: [
      "/crystal Ball/Image_2026-04-20_190714_600.png",
    ],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 25,
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
