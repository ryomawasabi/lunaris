-- ============================================
-- LUNARIS - Sold Out & Stones Setup
-- 1. Add is_sold_out to products
-- 2. Create stones table for crystal sold-out tracking
-- 3. Update all essence oil prices to $55
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add is_sold_out column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT FALSE;

-- 2. Create stones table
CREATE TABLE IF NOT EXISTS public.stones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  is_sold_out BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on stones
ALTER TABLE public.stones ENABLE ROW LEVEL SECURITY;

-- RLS policies for stones
CREATE POLICY "Anyone can view stones"
  ON public.stones FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert stones"
  ON public.stones FOR INSERT
  WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can update stones"
  ON public.stones FOR UPDATE
  USING (public.check_is_admin());

CREATE POLICY "Admins can delete stones"
  ON public.stones FOR DELETE
  USING (public.check_is_admin());

-- 3. Seed the 8 power stones
INSERT INTO public.stones (name) VALUES
  ('Smoky Quartz'),
  ('Aquamarine'),
  ('Amethyst'),
  ('Black Obsidian'),
  ('Green Fluorite'),
  ('Citrine'),
  ('Rose Quartz'),
  ('Carnelian')
ON CONFLICT (name) DO NOTHING;

-- 4. Update all essence oil prices to $55
UPDATE public.products SET price = 55 WHERE category = 'Essence Oils';

-- ============================================
-- DONE!
-- ============================================
