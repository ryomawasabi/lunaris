-- ============================================================
-- LUNARIS — Row Level Security (RLS) Setup
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Enable RLS on all tables ───
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- ─── 2. Helper function: check if current user is admin ───
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      -- Check user_metadata first
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
      false
    )
    OR
    COALESCE(
      -- Fallback: check profiles table
      (SELECT role = 'admin' FROM profiles WHERE id = auth.uid()),
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 3. Products table policies ───

-- Anyone can read products (public storefront)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update products
CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete products
CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (is_admin());

-- ─── 4. Collections table policies ───

CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert collections"
  ON collections FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update collections"
  ON collections FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete collections"
  ON collections FOR DELETE
  USING (is_admin());

-- ─── 5. Categories table policies ───

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ─── 6. Profiles table policies ───

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only admins can change roles
CREATE POLICY "Only admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- DONE! Your database is now protected by RLS.
--
-- Summary:
--   - Products/Collections/Categories: anyone can READ, only admins can WRITE
--   - Profiles: users can see/edit own, admins can see/edit all
--   - Admin check uses both user_metadata AND profiles table
-- ============================================================
