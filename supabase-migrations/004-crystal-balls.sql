-- Migration: Add Crystal Ball products, category, and collection
-- Run this in Supabase SQL Editor

-- 1. Add "Crystal Balls" category
INSERT INTO categories (name, slug, description, image, product_count, display_order)
VALUES (
  'Crystal Balls',
  'crystal-balls',
  'Hand-polished crystal spheres for divination, meditation, and spiritual practice. Each sphere is crafted from natural gemstone and comes with a velvet cloth and wooden stand.',
  '/crystal Ball/Image_2026-04-20_190702_273.png',
  8,
  3
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Add "Crystal Ball" collection
INSERT INTO collections (name, slug, tagline, description, image, product_count, display_order)
VALUES (
  'Crystal Ball',
  'crystal-ball',
  'Sacred spheres for divination and spiritual insight',
  'Hand-polished crystal spheres crafted from the finest natural gemstones. Each divination sphere channels the unique energy of its crystal, creating a powerful tool for scrying, meditation, and spiritual practice.',
  '/crystal Ball/Image_2026-04-20_190702_273.png',
  8,
  3
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Crystal Ball products
INSERT INTO products (slug, name, price, category, collection, gemstone, crystal_type, crystal_effects, symbolic_meaning, short_description, long_description, materials, images, badges, rating, review_count, is_new, is_giftable, is_active, is_sold_out, is_best_seller)
VALUES
(
  'rose-quartz-divination-sphere',
  'Rose Quartz Divination Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Love & Harmony"]',
  'Rose Quartz',
  'Rose Quartz',
  '["Love", "Emotional Healing", "Compassion", "Inner Peace"]',
  'A sphere of unconditional love — rose quartz opens the heart chakra and invites gentle healing energy into your divination practice.',
  'Hand-polished rose quartz crystal ball for heart-centered divination, meditation, and emotional healing rituals.',
  'The Rose Quartz Divination Sphere is a masterpiece of crystalline compassion, hand-polished from a single piece of premium rose quartz. Its soft pink luminescence carries the gentle vibration of unconditional love, making it the ideal companion for heart-centered scrying and meditation. Rose quartz has been revered across cultures as the stone of the heart — the ancient Greeks associated it with Aphrodite, while Chinese feng shui masters use it to attract love and harmonize relationships. Place this sphere in your sacred space to radiate a constant field of emotional healing energy, or hold it during meditation to dissolve emotional wounds and open yourself to deeper self-love.',
  '["Natural rose quartz sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190638_587.png"]',
  '["new"]',
  4.9, 18, true, true, true, false, false
),
(
  'malachite-vision-sphere',
  'Malachite Vision Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Protection"]',
  'Malachite',
  'Malachite',
  '["Transformation", "Protection", "Abundance", "Insight"]',
  'Deep green malachite channels the transformative power of nature — a guardian stone that absorbs negative energy and reveals hidden truths.',
  'Hand-polished malachite crystal ball for transformative divination, protection rituals, and abundance manifestation.',
  'The Malachite Vision Sphere radiates with deep, swirling greens reminiscent of ancient forests and sacred groves. Malachite is one of the oldest known protective stones — Egyptian pharaohs lined their headdresses with it, believing it granted the power to see into the spiritual realm. This sphere harnesses that same transformative energy, making it an exceptional tool for scrying sessions focused on personal growth and breaking through stagnant patterns. Its vibrant green frequency activates the heart and solar plexus chakras simultaneously, creating a powerful bridge between love and personal power. Use it in abundance rituals to amplify your manifestation practice, or place it near your workspace to shield against electromagnetic and emotional pollution.',
  '["Natural malachite sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190646_587.png"]',
  '["new"]',
  4.8, 14, true, true, true, false, false
),
(
  'aquamarine-serenity-sphere',
  'Aquamarine Serenity Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Calm & Clarity"]',
  'Aquamarine',
  'Aquamarine',
  '["Serenity", "Communication", "Courage", "Clarity"]',
  'The pale blue of aquamarine holds the calm of the ocean depths — a stone of courage and clear communication that soothes the throat chakra.',
  'Hand-polished aquamarine crystal ball for serene divination, throat chakra activation, and clarity rituals.',
  'The Aquamarine Serenity Sphere captures the tranquil essence of still ocean waters within its luminous pale blue form. Aquamarine — literally ''water of the sea'' — has been a sailor''s talisman for millennia, believed to calm waves and ensure safe passage. In your divination practice, this sphere brings that same calming energy, clearing mental chatter and opening channels of intuitive communication. The stone resonates deeply with the throat chakra, making it especially powerful for those seeking to speak their truth or develop clairaudient abilities. Hold this sphere during meditation to enter a state of profound serenity, or use it in scrying sessions when you need answers that require emotional detachment and crystalline clarity.',
  '["Natural aquamarine sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190651_065.png"]',
  '["new"]',
  4.9, 22, true, true, true, false, false
),
(
  'red-jasper-grounding-sphere',
  'Red Jasper Grounding Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Grounding"]',
  'Red Jasper',
  'Red Jasper',
  '["Grounding", "Stability", "Endurance", "Vitality"]',
  'Red jasper embodies the primal energy of the earth — a nurturing stone of endurance and stability that roots you firmly in the present moment.',
  'Hand-polished red jasper crystal ball for grounding divination, root chakra activation, and vitality rituals.',
  'The Red Jasper Grounding Sphere is forged from the earth''s deepest foundations, its rich terracotta surface a testament to millions of years of geological alchemy. Known as the ''Stone of Endurance,'' red jasper was carried by warriors and shamans alike for its ability to channel the earth''s stabilizing force. This sphere activates the root chakra with powerful grounding energy, making it the ideal tool for divination sessions when you feel scattered or unmoored. Its warm, steady vibration creates a protective anchor point during deep scrying, preventing spiritual drift and keeping you firmly connected to your physical body. Place it in the southern corner of your space to ignite the flame of motivation, or hold it when you need the courage to face difficult truths revealed in your practice.',
  '["Natural red jasper sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190657_200.png"]',
  '["new"]',
  4.7, 16, true, true, true, false, false
),
(
  'clear-quartz-oracle-sphere',
  'Clear Quartz Oracle Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Calm & Clarity"]',
  'Clear Quartz',
  'Clear Quartz',
  '["Amplification", "Clarity", "Manifestation", "Healing"]',
  'The master healer — clear quartz amplifies intention and energy, serving as the purest window into the unseen realms of consciousness.',
  'Hand-polished clear quartz crystal ball for pure divination, energy amplification, and full-spectrum healing rituals.',
  'The Clear Quartz Oracle Sphere is the quintessential divination tool, revered by seers and mystics throughout recorded history. Clear quartz — the ''Master Healer'' — possesses the unique ability to amplify any energy or intention directed through it, making it the most versatile crystal sphere in existence. Its pristine transparency serves as a blank canvas for the third eye, allowing visions to form with remarkable clarity during scrying sessions. This sphere resonates with all seven chakras simultaneously, creating a unified energetic field that enhances every aspect of your spiritual practice. Whether you are a seasoned scryer or beginning your journey into crystal divination, the Clear Quartz Oracle Sphere will meet you exactly where you are and elevate your practice to new heights.',
  '["Natural clear quartz sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190702_273.png"]',
  '["new", "bestseller"]',
  4.9, 37, true, true, true, false, true
),
(
  'amethyst-intuition-sphere',
  'Amethyst Intuition Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Spiritual Growth"]',
  'Amethyst',
  'Amethyst',
  '["Intuition", "Spiritual Awareness", "Protection", "Wisdom"]',
  'Amethyst opens the crown chakra gateway — the stone of spiritual wisdom that deepens intuition and guards against psychic attack.',
  'Hand-polished amethyst crystal ball for intuitive divination, crown chakra awakening, and spiritual protection rituals.',
  'The Amethyst Intuition Sphere is a breathtaking vessel of spiritual wisdom, its deep purple depths swirling with the energy of higher consciousness. Amethyst has been the stone of royalty and spirituality since ancient times — Greek legend tells of Dionysus creating the purple crystal to protect the pure-hearted maiden Amethystos. This sphere activates the third eye and crown chakras simultaneously, creating a powerful conduit for psychic visions and spiritual downloads during scrying sessions. Its natural protective frequency shields your energy field from negativity while you explore the deepest layers of consciousness. Place this sphere in your meditation space to create an atmosphere of sacred wisdom, or work with it during full moon rituals to amplify your intuitive gifts to their highest potential.',
  '["Natural amethyst sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190706_386.png"]',
  '["new"]',
  4.8, 29, true, true, true, false, false
),
(
  'rose-quartz-heart-oracle',
  'Rose Quartz Heart Oracle',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Love & Harmony"]',
  'Rose Quartz',
  'Rose Quartz',
  '["Self-Love", "Forgiveness", "Emotional Balance", "Trust"]',
  'A deeper expression of rose quartz energy — this oracle sphere specializes in matters of the heart, revealing pathways to forgiveness and self-acceptance.',
  'Hand-polished rose quartz oracle sphere for love-centered divination, emotional balance, and self-acceptance rituals.',
  'The Rose Quartz Heart Oracle is a luminous sphere of pure emotional alchemy, hand-selected for its exceptional pink clarity and energy. While its sister sphere focuses on the broad spectrum of love energy, this oracle stone specializes in the deeper work of emotional healing — the kind that transforms wounds into wisdom and grief into grace. Its resonance reaches the innermost chambers of the heart chakra, gently dissolving layers of emotional armor built up over lifetimes. Work with this sphere when seeking guidance on matters of love and relationship, whether romantic, familial, or the most important relationship of all — the one with yourself. Its gentle energy creates a safe container for vulnerability during scrying sessions, allowing repressed emotions to surface and be transformed into sources of strength.',
  '["Natural rose quartz sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190710_943.png"]',
  '["new"]',
  4.9, 21, true, true, true, false, false
),
(
  'obsidian-shadow-sphere',
  'Obsidian Shadow Sphere',
  159,
  'Crystal Balls',
  '["Crystal Ball", "Protection"]',
  'Obsidian',
  'Obsidian',
  '["Protection", "Truth", "Shadow Work", "Grounding"]',
  'Born from volcanic fire — obsidian is the mirror of the soul, fearlessly revealing hidden truths and providing impenetrable psychic protection.',
  'Hand-polished obsidian crystal ball for deep shadow work, psychic protection, and truth-revealing divination rituals.',
  'The Obsidian Shadow Sphere is the most powerful protective stone in our crystal ball collection, born from the rapid cooling of volcanic lava — fire transformed into glass in an instant. Ancient Mesoamerican priests used obsidian mirrors for divination, believing the stone''s perfect darkness served as a portal to the spirit world. This sphere carries that same raw, uncompromising energy, making it the ultimate tool for shadow work and truth-seeking scrying sessions. Obsidian does not soften its revelations; it shows you exactly what you need to see, no matter how uncomfortable. It creates an impenetrable shield around your energy field, absorbing and transmuting negativity on contact. Work with this sphere during new moon rituals to confront and integrate your shadow self, or keep it near your front door to guard your home against negative energies and unwanted spiritual visitors.',
  '["Natural obsidian sphere", "Velvet ritual cloth", "Wooden display stand"]',
  '["/crystal Ball/Image_2026-04-20_190714_600.png"]',
  '["new"]',
  4.8, 25, true, true, true, false, false
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Create site_settings table (Phase 4)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create wishlists table (Phase 5)
CREATE TABLE IF NOT EXISTS wishlists (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- Enable RLS on wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Wishlists policies: users can only see/modify their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);
