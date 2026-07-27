import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { faqJsonLd, orgJsonLd } from "@/lib/faq-data";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FixedCallButton from "./components/FixedCallButton";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.nameEn} — 전국 파양입소·무료분양`,
    template: `%s | ${SITE.brand}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.brand }],
  creator: SITE.brand,
  publisher: SITE.brand,
  alternates: { canonical: SITE.siteUrl },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE.siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.nameEn}`,
    description: SITE.description,
    images: [
      {
        url: SITE.logo,
        width: 800,
        height: 800,
        alt: `${SITE.name} 로고`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.nameEn}`,
    description: SITE.description,
    images: [SITE.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  verification: {
    other: {
      "naver-site-verification": "99856f697a06fceaa9d1d6d074480d05d082e2f1",
    },
  },
  other: {
    "msapplication-TileColor": "#1a2f55",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = orgJsonLd();
  const faq = faqJsonLd();
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE.name} RSS`}
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE.name} Feed`}
          href="/feed"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      </head>
      <body className="dalbit-root">
        <Header />
        <main>{children}</main>
        <Footer />
        <FixedCallButton />
      </body>
    </html>
  );
}
