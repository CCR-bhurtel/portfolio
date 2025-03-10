import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shishirbhurtel.com.np"),
  title: {
    default: "Shishir Bhurtel - Full Stack Developer r",
    template: "%s | Shishir Bhurtel",
  },
  description:
    "Portfolio of Shishir Bhurtel, a Full Stack Developer  specializing in modern web technologies and cloud solutions.",
  keywords: [
    "Shishir Bhurtel",
    "Full Stack Developer",
    "DevOps Engineer",
    "Web Development",
    "React",
    "Node.js",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Shishir Bhurtel" }],
  creator: "Shishir Bhurtel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.shishirbhurtel.com.np",
    title: "Shishir Bhurtel - Full Stack Developer & DevOps Engineer",
    description:
      "Portfolio of Shishir Bhurtel, a Full Stack Developer and DevOps Engineer specializing in modern web technologies and cloud solutions.",
    siteName: "Shishir Bhurtel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shishir Bhurtel - Full Stack Developer & DevOps Engineer",
    description:
      "Portfolio of Shishir Bhurtel, a Full Stack Developer and DevOps Engineer specializing in modern web technologies and cloud solutions.",
    creator: "@shishirbhurtel",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0078FF" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
