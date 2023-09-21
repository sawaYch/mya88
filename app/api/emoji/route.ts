import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import puppeteer from "puppeteer";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  console.log("data url", data.url);
  if (data.url != null) {
    const browser = await puppeteer.launch({
      args: ["--disable-features=site-per-process"],
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(data.url);
    const frame = await page.waitForFrame(async (frame) => {
      return frame.name() === "chatframe";
    });

    if (!frame) {
      await browser.close();
      return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    }

    await frame.waitForSelector("yt-emoji-picker-category-renderer > #emoji");
    // let bodyHTML = await frame.evaluate(() => document.body.innerHTML);
    const result = await frame.$("yt-emoji-picker-category-renderer > #emoji");
    if (result == null) {
      await browser.close();
      return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    }
    const a = await (await result.getProperty("textContent")).jsonValue();
    console.log("result", a);
    await browser.close();
    return NextResponse.json({ result: a }, { status: 200, statusText: "OK" });
  }
  return new NextResponse(null, { status: 400, statusText: "Bad Request" });
};
