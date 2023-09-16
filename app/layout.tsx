import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "さようなら Mya 🐼",
  description: "さようなら Mya 🐼",
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
