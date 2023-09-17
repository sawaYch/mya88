import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "さようならMya🐼",
  description: "A helper to say goodbye.",
  applicationName: "Sayonara-Mya",
  authors: [{ name: "No.159 Sawa", url: "https://sawaych.github.io/" }],
  generator: "Next.js",
  keywords: ["youtube", "mya", "vtuber", "hkvtuber"],
  referrer: "origin",
  creator: "No.159 Sawa",
  publisher: "Vercel",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#ff79c6" }],
  colorScheme: "dark",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://sayonara-mya.vercel.app/",
    title: "さようならMya🐼",
    description: "A helper to say goodbye.",
    siteName: "Sayonara-Mya",
    images: [
      {
        url: "https://sayonara-mya.vercel.app/og",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@site",
    creator: "@creator",
    images: "https://sayonara-mya.vercel.app/og",
  },
  appleWebApp: {
    capable: true,
    title: "さようならMya🐼",
    statusBarStyle: "black-translucent",
    startupImage: "https://sayonara-mya.vercel.app/greeting.webp",
  },
  icons: [
    {
      rel: "icon",
      url: "/greeting.webp",
      type: "image/webp",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="fixed top-0 left-0 w-screen h-screen">
          <Image
            className="opacity-20 object-cover object-center pointer-events-none select-none"
            src="/bg.jpg"
            alt="bg"
            fill
            quality="100"
            priority
          />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
