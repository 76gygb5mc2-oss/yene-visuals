import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yene Visuals | Professional Photography Services",
    template: "%s | Yene Visuals",
  },
  description:
    "Yene Visuals captures timeless moments with artistry and precision. Professional photography services for portraits, weddings, events, and commercial projects.",
  keywords: [
    "photography",
    "professional photographer",
    "portrait photography",
    "wedding photography",
    "event photography",
    "commercial photography",
    "Yene Visuals",
  ],
  authors: [{ name: "Yene Visuals" }],
  creator: "Yene Visuals",
  metadataBase: new URL("https://yenevisuals.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yenevisuals.com",
    siteName: "Yene Visuals",
    title: "Yene Visuals | Professional Photography Services",
    description:
      "Capturing timeless moments with artistry and precision. Professional photography for portraits, weddings, events, and commercial projects.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yene Visuals Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yene Visuals | Professional Photography Services",
    description:
      "Capturing timeless moments with artistry and precision. Professional photography services.",
    images: ["/og-image.jpg"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Yene Visuals",
  description:
    "Professional photography services for portraits, weddings, events, and commercial projects.",
  url: "https://yenevisuals.com",
  image: "https://yenevisuals.com/og-image.jpg",
  telephone: "+1-555-000-0000",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  priceRange: "$$",
  sameAs: [
    "https://instagram.com/yenevisuals",
    "https://facebook.com/yenevisuals",
  ],
  openingHours: "Mo-Sa 09:00-18:00",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Photography Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Portrait Photography",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wedding Photography",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Event Photography",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
