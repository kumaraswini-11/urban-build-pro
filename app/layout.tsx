import type { Metadata, Viewport } from "next";
import { DM_Sans, Barlow } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Construction branding usually favors high-readability sans-serifs
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap", // Better performance
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Accessibility: allow zooming
  themeColor: "#FFC221", // Update this to match your 'primary' color
};

export const metadata: Metadata = {
  title: {
    default: "Urban Builders | Premier General Contracting & Architecture",
    template: "%s | Urban Builders",
  },
  description:
    "Building excellence through precision engineering and sustainable design. Urban Builders specializes in high-end residential, commercial developments, and industrial infrastructure projects.",
  keywords: [
    "General Contractor",
    "Commercial Construction",
    "Luxury Home Builders",
    "Architecture Design",
    "Civil Engineering",
    "Project Management",
    "Urban Builders Portfolio",
  ],
  authors: [{ name: "Urban Builders", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "Urban Builders",
  publisher: "Urban Builders",

  // Clean URL for sharing
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),

  openGraph: {
    title: "Urban Builders | Engineering the Future",
    description:
      "Discover our award-winning portfolio of residential and commercial masterpieces.",
    url: "/",
    siteName: "Urban Builders",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists in /public
        width: 1200,
        height: 630,
        alt: "Urban Builders Construction Site Excellence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Builders",
    description: "Premier construction and architectural solutions.",
    images: ["/og-image.jpg"], // "/images/skyline-builders-x-image.jpg"
    creator: "@urbanbuilders",
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
    <html
      lang="en"
      suppressHydrationWarning // Prevents mismatches from browser extensions
      className="scroll-smooth" // Native smooth scrolling for your nav links
    >
      <body className={`${dmSans.variable} ${barlow.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
