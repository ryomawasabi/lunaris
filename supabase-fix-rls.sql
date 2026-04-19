-- ============================================
-- FIX: Infinite recursion in profiles RLS
-- The is_admin() function queries profiles table,
-- but profiles RLS also calls is_admin() = infinite loop
-- ============================================

-- 1. Drop the problematic is_admin() function
DROP FUNCTION IF EXISTS public.is_admin();

-- 2. Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- 3. Drop all existing policies on products table (they may use is_admin())
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- 4. Drop existing policies on collections and categories
DROP POLICY IF EXISTS "Anyone can view collections" ON public.collections;
DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
DROP POLICY IF EXISTS "Admins can insert collections" ON public.collections;
DROP POLICY IF EXISTS "Admins can update collections" ON public.collections;
DROP POLICY IF EXISTS "Admins can delete collections" ON public.collections;

DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;

-- 5. Make sure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. PROFILES policies (NO recursion - use auth.uid() directly)
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role bypasses RLS, so admin operations via server actions work fine

-- ============================================
-- 7. PRODUCTS policies (use SECURITY DEFINER function to avoid recursion)
-- ============================================

-- Create a SECURITY DEFINER function that bypasses RLS
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Admins can view ALL products (including inactive)
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  USING (public.check_is_admin());

-- Admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.check_is_admin());

-- Admins can update products
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.check_is_admin());

-- Admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.check_is_admin());

-- ============================================
-- 8. COLLECTIONS policies
-- ============================================
CREATE POLICY "Anyone can view collections"
  ON public.collections FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert collections"
  ON public.collections FOR INSERT
  WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can update collections"
  ON public.collections FOR UPDATE
  USING (public.check_is_admin());

CREATE POLICY "Admins can delete collections"
  ON public.collections FOR DELETE
  USING (public.check_is_admin());

-- ============================================
-- 9. CATEGORIES policies
-- ============================================
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.check_is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.check_is_admin());

-- ============================================
-- 10. REVIEWS policies
-- ============================================
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL
  USING (public.check_is_admin());

-- ============================================
-- DONE! The key fix:
-- profiles table policies use auth.uid() directly (no function call)
-- other tables use check_is_admin() with SECURITY DEFINER
-- SECURITY DEFINER bypasses RLS on profiles, breaking the recursion
-- ============================================
