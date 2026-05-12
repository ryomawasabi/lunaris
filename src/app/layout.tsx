import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProductStatusProvider } from "@/components/providers/ProductStatusProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "YINYANG GUARDIAN | Spiritual Crystal Jewelry for Chakra Alignment",
    template: "%s | YINYANG GUARDIAN",
  },
  description: "Shop handcrafted crystal jewelry designed to align your chakras and restore balance. Featuring natural gemstones like Rose Quartz, Amethyst, and Citrine with meaningful yin-yang symbolism. Free shipping on orders over $100.",
  metadataBase: new URL("https://yinyangguardian.com"),
  verification: {
    google: "2vRn23vj5SKkvImsgZgQte7ixgAiSNRRw_7vTIS-xtI",
  },
  icons: {
    icon: "/icon.svg",
  },
  keywords: ["crystal jewelry", "chakra alignment", "spiritual jewelry", "yin yang", "gemstone bracelet", "crystal healing", "rose quartz", "amethyst", "energy jewelry", "meaningful jewelry", "handcrafted jewelry"],
  authors: [{ name: "YINYANG GUARDIAN" }],
  creator: "YINYANG GUARDIAN",
  alternates: {
    canonical: "https://yinyangguardian.com",
  },
  openGraph: {
    title: "YINYANG GUARDIAN | Spiritual Crystal Jewelry for Chakra Alignment",
    description: "Handcrafted crystal jewelry with natural gemstones and yin-yang symbolism. Align your chakras and find your balance.",
    type: "website",
    locale: "en_US",
    siteName: "YINYANG GUARDIAN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YINYANG GUARDIAN — Spiritual Crystal Jewelry Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YINYANG GUARDIAN | Spiritual Crystal Jewelry",
    description: "Handcrafted crystal jewelry designed to align your chakras. Natural gemstones with meaningful symbolism.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://yinyangguardian.com/#organization",
                  name: "YINYANG GUARDIAN",
                  url: "https://yinyangguardian.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://yinyangguardian.com/icon.svg",
                  },
                  description: "Handcrafted spiritual crystal jewelry designed to align chakras and restore balance through yin-yang harmony.",
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://yinyangguardian.com/#website",
                  url: "https://yinyangguardian.com",
                  name: "YINYANG GUARDIAN",
                  publisher: { "@id": "https://yinyangguardian.com/#organization" },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://yinyangguardian.com/products?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-cream antialiased">
        <AuthProvider>
          <LanguageProvider>
            <ProductStatusProvider>
              <CartProvider>
                <WishlistProvider>
                  <LenisProvider>
                    <Header />
                    {children}
                    <CartDrawer />
                    <Footer />
                  </LenisProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductStatusProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
