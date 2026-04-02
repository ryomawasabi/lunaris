import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProductStatusProvider } from "@/components/providers/ProductStatusProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: "YINYANG GUARDIAN | Meaningful Luxury Jewelry",
  description: "Discover YINYANG GUARDIAN luxury spiritual jewelry crafted with intention. Each piece features natural gemstones and carries symbolic meaning. Shop meaningful jewelry for protection, love, prosperity, and personal transformation.",
  metadataBase: new URL("https://yinyangguardian.com"),
  openGraph: {
    title: "YINYANG GUARDIAN | Meaningful Luxury Jewelry",
    description: "Discover YINYANG GUARDIAN luxury spiritual jewelry crafted with intention and natural gemstones.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YINYANG GUARDIAN Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YINYANG GUARDIAN | Meaningful Luxury Jewelry",
    description: "Discover YINYANG GUARDIAN luxury spiritual jewelry crafted with intention.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-cream antialiased">
        <AuthProvider>
          <ProductStatusProvider>
            <LenisProvider>
              <AnnouncementBar />
              <Header />
              {children}
              <Footer />
            </LenisProvider>
          </ProductStatusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
