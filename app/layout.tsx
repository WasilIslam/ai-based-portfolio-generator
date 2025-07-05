import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CutHours - Create Beautiful Portfolios",
    template: "%s | CutHours"
  },
  description: "Create and share beautiful, professional portfolios with CutHours. Showcase your work, skills, and experience with our modern portfolio builder.",
  keywords: ["portfolio", "resume", "developer", "designer", "professional", "showcase", "work"],
  authors: [{ name: "CutHours" }],
  creator: "CutHours",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cuthours.com",
    title: "CutHours - Create Beautiful Portfolios",
    description: "Create and share beautiful, professional portfolios with CutHours.",
    siteName: "CutHours",
  },
  twitter: {
    card: "summary_large_image",
    title: "CutHours - Create Beautiful Portfolios",
    description: "Create and share beautiful, professional portfolios with CutHours.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body data-theme="lofi"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
