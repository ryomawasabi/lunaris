-- ============================================
-- Move stones into products table with category 'Stones'
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add 'Stones' category
INSERT INTO public.categories (slug, name, image, product_count) VALUES
('stones', 'Stones', '/stones/Amethyst.png', 8)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert stones as products
INSERT INTO public.products (slug, name, price, compare_at_price, category, collection, gemstone, crystal_type, crystal_effects, symbolic_meaning, short_description, long_description, materials, images, badges, rating, review_count, is_best_seller, is_new, is_giftable, is_active, is_sold_out) VALUES
('smoky-quartz', 'Smoky Quartz', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Smoky Quartz', 'Smoky Quartz', ARRAY['Grounding', 'Stress Relief', 'Negativity Shield'], 'A powerful grounding stone that transmutes negative energy into positive.', 'Natural Smoky Quartz power stone for the Crystal Essence Set.', 'Smoky Quartz is a premier grounding stone, known for its ability to neutralize negative vibrations and detoxify on all levels. It helps relieve stress and anxiety, promoting emotional calmness and positive thoughts.', ARRAY['Natural Smoky Quartz crystal'], ARRAY['/stones/smoky-quartz.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('aquamarine', 'Aquamarine', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Aquamarine', 'Aquamarine', ARRAY['Calm', 'Communication', 'Emotional Balance'], 'A soothing stone of the sea that promotes calm communication and emotional balance.', 'Natural Aquamarine power stone for the Crystal Essence Set.', 'Aquamarine embodies the tranquil energy of the ocean, promoting calm communication and emotional clarity. It soothes the mind, reduces stress, and encourages truthful expression.', ARRAY['Natural Aquamarine crystal'], ARRAY['/stones/Aquamarine.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('amethyst', 'Amethyst', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Amethyst', 'Amethyst', ARRAY['Intuition', 'Restful Sleep', 'Aura Purification'], 'A spiritual stone that enhances intuition and promotes restful sleep.', 'Natural Amethyst power stone for the Crystal Essence Set.', 'Amethyst is a powerful spiritual stone that opens the third eye and crown chakras. It enhances intuition, promotes restful sleep, and purifies the aura of negative energy.', ARRAY['Natural Amethyst crystal'], ARRAY['/stones/Amethyst.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('black-obsidian', 'Black Obsidian', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Black Obsidian', 'Black Obsidian', ARRAY['Protection', 'Negative Energy Clearing', 'Grounding'], 'A powerful protection stone that shields against negativity and grounds energy.', 'Natural Black Obsidian power stone for the Crystal Essence Set.', 'Black Obsidian is a powerful protective stone that forms a shield against negativity. It absorbs negative energies from the environment and provides grounding and stability.', ARRAY['Natural Black Obsidian crystal'], ARRAY['/stones/Black Obsidian.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('green-fluorite', 'Green Fluorite', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Green Fluorite', 'Green Fluorite', ARRAY['Focus', 'Mental Clarity', 'Spiritual Growth'], 'A clarifying stone that enhances focus, mental clarity, and spiritual growth.', 'Natural Green Fluorite power stone for the Crystal Essence Set.', 'Green Fluorite is a highly clarifying stone that enhances focus and mental clarity. It promotes spiritual growth and helps organize thoughts, making it ideal for study and meditation.', ARRAY['Natural Green Fluorite crystal'], ARRAY['/stones/Green Fluorite.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('citrine-stone', 'Citrine', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Citrine', 'Citrine', ARRAY['Abundance', 'Prosperity', 'Career Success'], 'A stone of abundance that attracts prosperity and career success.', 'Natural Citrine power stone for the Crystal Essence Set.', 'Citrine is known as the stone of abundance and manifestation. It carries the power of the sun, promoting prosperity, career success, and positive energy in all endeavors.', ARRAY['Natural Citrine crystal'], ARRAY['/stones/Citrine.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('rose-quartz', 'Rose Quartz', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Rose Quartz', 'Rose Quartz', ARRAY['Love', 'Self-Worth', 'Compassion'], 'The stone of unconditional love that opens the heart to self-worth and compassion.', 'Natural Rose Quartz power stone for the Crystal Essence Set.', 'Rose Quartz is the stone of universal love. It restores trust and harmony in relationships, promoting unconditional love, self-worth, and deep inner healing through compassion.', ARRAY['Natural Rose Quartz crystal'], ARRAY['/stones/Rose Quartz.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE),

('carnelian', 'Carnelian', 0, NULL, 'Stones', ARRAY['Crystal Essence'], 'Carnelian', 'Carnelian', ARRAY['Motivation', 'Vitality', 'Creativity'], 'A vibrant stone of motivation that boosts vitality and creative energy.', 'Natural Carnelian power stone for the Crystal Essence Set.', 'Carnelian is a stabilizing stone of high energy that restores vitality and motivation. It stimulates creativity, gives courage, and promotes positive life choices.', ARRAY['Natural Carnelian crystal'], ARRAY['/stones/Carnelian.png'], ARRAY[]::TEXT[], 0, 0, FALSE, FALSE, FALSE, TRUE, FALSE)

ON CONFLICT (slug) DO NOTHING;

-- 3. Drop the separate stones table (no longer needed)
DROP TABLE IF EXISTS public.stones;

-- ============================================
-- DONE!
-- ============================================
