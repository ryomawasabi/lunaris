import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { Button } from "@/components/ui/Button";

export function GiftSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-stone-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Image */}
          <div className="order-2 md:order-1">
            <PlaceholderImage
              width="w-full"
              height="h-96"
              text="Gift Packaging"
              className="w-full"
              src="https://images.unsplash.com/photo-1549465220-1a8b9238f1b0?w=1200&h=600&fit=crop&q=80"
              alt="Gift Packaging"
            />
          </div>

          {/* Right: Content */}
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-3xl md:text-4xl text-dark mb-6">
              Share Positive Karma
            </h2>

            <p className="font-sans text-stone mb-6 leading-relaxed">
              Gift a piece of spiritual protection to someone you love. Each LUNARIS piece carries intention and sacred energy, making it more than a gift&mdash;it&apos;s a blessing.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                <p className="font-sans text-stone text-sm">
                  <span className="font-medium">Sacred Gift Wrapping</span> - Presented in our ritual-blessed packaging
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                <p className="font-sans text-stone text-sm">
                  <span className="font-medium">Personal Blessing</span> - Add your own intention note to amplify the energy
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                <p className="font-sans text-stone text-sm">
                  <span className="font-medium">Spirit Guide Card</span> - Explains the spiritual properties and how to activate the piece
                </p>
              </div>
            </div>

            <Button
              href="/gifts"
              variant="primary"
              size="md"
            >
              Shop Gifts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
