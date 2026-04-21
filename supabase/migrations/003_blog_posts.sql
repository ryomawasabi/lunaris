-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'CRESERA',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  related_products TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous and authenticated users to read published posts
CREATE POLICY "Read published blog posts" ON public.blog_posts
  FOR SELECT
  USING (is_published = TRUE AND published_at <= NOW());

-- Create indexes
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER blog_posts_updated_at_trigger
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_blog_posts_updated_at();
