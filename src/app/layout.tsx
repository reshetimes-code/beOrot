import type { Metadata } from "next";
import { Rubik, Assistant } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CursorGlow from "@/components/effects/CursorGlow";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://be-orot.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "באורות | BE-OROT – גיוס אנשים. חיבור מדויק.",
  description:
    "באורות BE-OROT מחברת בין מעסיקים למועמדים באמצעות שילוב של עוצמת גיוס, דיוק מקצועי וחיבור אנושי.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "באורות | BE-OROT – גיוס אנשים. חיבור מדויק.",
    description:
      "באורות BE-OROT מחברת בין מעסיקים למועמדים באמצעות שילוב של עוצמת גיוס, דיוק מקצועי וחיבור אנושי.",
    url: siteUrl,
    siteName: "BE-OROT | באורות",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "באורות | BE-OROT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "באורות | BE-OROT – גיוס אנשים. חיבור מדויק.",
    description:
      "באורות BE-OROT מחברת בין מעסיקים למועמדים באמצעות שילוב של עוצמת גיוס, דיוק מקצועי וחיבור אנושי.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "באורות | BE-OROT",
  alternateName: "BE-OROT",
  url: siteUrl,
  logo: `${siteUrl}/logo/be-orot-logo.png`,
  email: "meirav@be-orot.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "meirav@be-orot.com",
      telephone: "+972-50-200-5509",
      areaServed: "IL",
      availableLanguage: ["he"],
    },
  ],
  sameAs: [],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${assistant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <CursorGlow />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
