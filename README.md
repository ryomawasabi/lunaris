# LUNARIS — Meaningful Luxury Jewelry

A modern spiritual luxury jewelry e-commerce site built with Next.js 14, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Fonts:** Cormorant Garamond (headings) + Inter (body) via Google Fonts

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Full landing page with hero, best sellers, collections, brand values |
| Products | `/products` | Product listing with filters and sort |
| Product Detail | `/products/[slug]` | Individual product page with gallery and reviews |
| Collections | `/collections` | All collections overview |
| Collection Detail | `/collections/[slug]` | Collection page with filtered products |
| About | `/about` | Brand story, values, and process |
| Gifts | `/gifts` | Gift guide with occasions and price ranges |
| FAQ | `/faq` | Accordion-style FAQ |

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Google Fonts
│   ├── about/page.tsx
│   ├── collections/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── faq/page.tsx
│   ├── gifts/page.tsx
│   └── products/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── components/
│   ├── collection/
│   │   ├── CollectionCard.tsx
│   │   └── CollectionSort.tsx
│   ├── home/
│   │   ├── AsSeenIn.tsx
│   │   ├── BestSellers.tsx
│   │   ├── BrandValues.tsx
│   │   ├── CollectionShowcase.tsx
│   │   ├── GiftSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   ├── NewArrivals.tsx
│   │   ├── ShopByCategory.tsx
│   │   └── UGCSection.tsx
│   ├── layout/
│   │   ├── AnnouncementBar.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── PlaceholderImage.tsx
│   ├── product/
│   │   ├── ImageGallery.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductGrid.tsx
│   │   └── QuantitySelector.tsx
│   └── ui/
│       ├── Accordion.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── SectionTitle.tsx
│       └── StarRating.tsx
└── lib/
    ├── data.ts             # All dummy product/collection/category data
    ├── types.ts            # TypeScript interfaces
    └── utils.ts            # Helper functions
```

## Brand Details

- **Name:** LUNARIS
- **Tagline:** Adorn Yourself with Meaning
- **Aesthetic:** Modern spiritual luxury — elegant, intentional, meaningful
- **Colors:** Cream (#FAF8F5), Gold (#C9A96E), Dark (#2C2420), Warm (#8B7355), Stone (#E8DDD0)
- **Fonts:** Cormorant Garamond (serif headings), Inter (sans-serif body)

## Image Replacement

All images use placeholder gradient components. To replace with real images:

1. Add images to `public/images/`
2. Replace `<PlaceholderImage>` components with `<Image>` from `next/image`
3. Update product `images` arrays in `src/lib/data.ts` with actual paths

## Dummy Data

The project includes 20 products across 6 categories and 7 collections, all with realistic pricing, descriptions, gemstone details, and symbolic meanings. Data is in `src/lib/data.ts`.

## License

Private — All rights reserved.
