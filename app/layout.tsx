import type { Metadata, Viewport } from "next";
import { Barlow, DM_Sans } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { siteUrl } from "@/lib/env";
import "./globals.css";

// DM Sans is a variable font: one file covers every weight (P4).
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Barlow is static: load only the weights the UI uses (was 9 files).
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Accessibility: allow zooming
  themeColor: "#FFC221",
};

export const metadata: Metadata = {
  title: {
    default: "UrbanBuild | Premier General Contracting & Architecture",
    template: "%s | UrbanBuild",
  },
  description:
    "Building excellence through precision engineering and sustainable design. UrbanBuild specializes in high-end residential, commercial developments, and industrial infrastructure projects.",
  keywords: [
    "General Contractor",
    "Commercial Construction",
    "Luxury Home Builders",
    "Architecture Design",
    "Civil Engineering",
    "Project Management",
    "UrbanBuild Portfolio",
  ],
  authors: [{ name: "UrbanBuild", url: siteUrl }],
  creator: "UrbanBuild",
  publisher: "UrbanBuild",

  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },

  openGraph: {
    title: "UrbanBuild | Engineering the Future",
    description:
      "Discover our award-winning portfolio of residential and commercial masterpieces.",
    url: "/",
    siteName: "UrbanBuild",
    // Image comes from app/opengraph-image.tsx (real 1200x630).
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanBuild",
    description: "Premier construction and architectural solutions.",
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
      suppressHydrationWarning // next-themes sets the theme class before hydration
      data-scroll-behavior="smooth"
    >
      <body className={`${dmSans.variable} ${barlow.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-primary focus:px-4 focus:py-3 focus:font-bold focus:text-inverse"
          >
            Skip to content
          </a>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
