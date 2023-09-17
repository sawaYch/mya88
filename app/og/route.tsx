/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          background: "#222222",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          tw="opacity-30 absolute"
          width="1024"
          height="570"
          src={"https://sayonara-mya.vercel.app/bg.jpg"}
          alt="og-image"
        />
        <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
          <span tw="text-white/70 ml-2">Goodnight</span>
          <span tw="text-pink-600 text-6xl">さようならMya🐼</span>
        </h2>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
