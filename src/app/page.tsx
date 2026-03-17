import { HeroSection } from "@/components/home/HeroSection";
import { BrandValues } from "@/components/home/BrandValues";
import { BestSellers } from "@/components/home/BestSellers";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { AsSeenIn } from "@/components/home/AsSeenIn";
import { GiftSection } from "@/components/home/GiftSection";
import { UGCSection } from "@/components/home/UGCSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrandValues />
      <BestSellers />
      <CollectionShowcase />
      <NewArrivals />
      <ShopByCategory />
      <AsSeenIn />
      <GiftSection />
      <UGCSection />
      <NewsletterSection />
    </main>
  );
}
