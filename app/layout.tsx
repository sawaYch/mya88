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
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#da2777" }],
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
    startupImage: [
      {
        url: "/splash_screens/iPhone_14_Pro_Max_landscape.png",
        media:
          "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        media:
          "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_14_Pro_landscape.png",
      },
      {
        media:
          "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",
      },
      {
        media:
          "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/iPhone_11__iPhone_XR_landscape.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",
      },
      {
        media:
          "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",
      },
      {
        media:
          "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/12.9__iPad_Pro_landscape.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png",
      },
      {
        media:
          "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/10.9__iPad_Air_landscape.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/10.5__iPad_Air_landscape.png",
      },
      {
        media:
          "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/10.2__iPad_landscape.png",
      },
      {
        media:
          "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",
      },
      {
        media:
          "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/8.3__iPad_Mini_landscape.png",
      },
      {
        media:
          "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_14_Pro_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_14_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/iPhone_11__iPhone_XR_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
      },
      {
        media:
          "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",
      },
      {
        media:
          "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/12.9__iPad_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/10.9__iPad_Air_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/10.5__iPad_Air_portrait.png",
      },
      {
        media:
          "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/10.2__iPad_portrait.png",
      },
      {
        media:
          "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",
      },
      {
        media:
          "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/8.3__iPad_Mini_portrait.png",
      },
    ],
  },
  icons: {
    icon: "/greeting.webp",
    shortcut: "/favicon.ico",
    apple: "/splash_screens/icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/splash_screens/icon.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden">
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
