-- Clear compare_at_price for all Essence Oils
-- This makes them sell at $55 flat (no sale/discount display)
UPDATE products
SET compare_at_price = NULL
WHERE category = 'Essence Oils';

-- Also make gemstone column nullable (allow empty/optional gemstone)
ALTER TABLE products ALTER COLUMN gemstone DROP NOT NULL;
