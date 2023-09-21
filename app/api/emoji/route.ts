import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-extra";


export const POST = async (req: NextRequest) => {
  const data = await req.json();
  if (data.url != null) {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({headless: "new"})
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
