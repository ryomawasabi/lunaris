-- ============================================
-- Update blog post cover images
-- Uses existing product images from Supabase Storage
-- ============================================

-- Article 1: Rose Quartz Guide (4 languages) → Rose Quartz stone image
UPDATE blog_posts
SET cover_image = 'https://jygmvcimjgqgtjdvwpum.supabase.co/storage/v1/object/public/product-images/stones/Rose Quartz.png'
WHERE slug IN (
  'rose-quartz-meaning-healing-properties',
  'rose-quartz-meaning-healing-properties-ja',
  'rose-quartz-meaning-healing-properties-zh',
  'rose-quartz-meaning-healing-properties-ko'
);

-- Article 2: Brand Story (4 languages) → Amethyst bracelet image
UPDATE blog_posts
SET cover_image = 'https://jygmvcimjgqgtjdvwpum.supabase.co/storage/v1/object/public/product-images/bracelets/amethyst-bracelet.jpg'
WHERE slug IN (
  'why-we-created-yinyang-guardian',
  'why-we-created-yinyang-guardian-ja',
  'why-we-created-yinyang-guardian-zh',
  'why-we-created-yinyang-guardian-ko'
);

-- Article 3: Morning Chakra Rituals (4 languages) → Amethyst stone image
UPDATE blog_posts
SET cover_image = 'https://jygmvcimjgqgtjdvwpum.supabase.co/storage/v1/object/public/product-images/stones/Amethyst.png'
WHERE slug IN (
  '5-morning-rituals-align-chakras',
  '5-morning-rituals-align-chakras-ja',
  '5-morning-rituals-align-chakras-zh',
  '5-morning-rituals-align-chakras-ko'
);
