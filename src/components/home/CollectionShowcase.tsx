import { SectionTitle } from "@/components/ui/SectionTitle";
import { CollectionCard } from "@/components/collection/CollectionCard";
import { COLLECTIONS } from "@/lib/data";

export function CollectionShowcase() {
  // Show first 4 featured collections
  const featuredCollections = COLLECTIONS.slice(0, 4);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          subtitle="Sacred Collections"
          title="Shop by Spiritual Intention"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {featuredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
