import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full aspect-[16/7] md:aspect-[16/7] sm:aspect-[4/5]">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="Hero Background"
          className="w-full h-full"
          src="https://images.unsplash.com/photo-1515562141589-67f0d569b2d5?w=1600&h=900&fit=crop&q=80"
          alt="Hero Background"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-dark/50 to-dark/30" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-cream mb-6 max-w-3xl leading-tight">
          Awaken Your Spiritual Energy
        </h1>

        <p className="font-sans text-cream/90 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Sacred jewelry infused with ancient wisdom and cosmic energy. Channel protection, attract fortune, and align your chakras with every piece you wear.
        </p>

        <Button
          href="/collections"
          variant="primary"
          size="lg"
          className="uppercase font-medium tracking-wider"
        >
          Explore the Collection
        </Button>
      </div>
    </section>
  );
}
