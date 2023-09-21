import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import puppeteer from "puppeteer";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  console.log("data url", data.url);
  if (data.url != null) {
    // const raw = await fetch(data.url);
    // const htmlText = await raw.text();
    // // const result =
    // Array.from(
    //   document
    //     .querySelectorAll('img[role="option"][class*="emoji"][aria-label^=":"]')
    //     .values()
    // )
    // .slice(0, 20)
    // .map((e) => e.getAttribute("aria-label") + " " + e.getAttribute("src"));
    // fs.writeFile("./debug", htmlText, (err) => {
    //   if (err) {
    //     console.error(err);
    //   }
    //   // file written successfully
    // });
    // console.log("API result", htmlText);

    // const browser = await puppeteer.launch({
    //   args: ["--disable-features=site-per-process"],
    //   headless: false,
    // });
    // const page = await browser.newPage();
    // await page.goto(data.url);
    // const frame = await page.waitForFrame(async (frame) => {
    //   return frame.name() === "chatframe";
    // });

    // if (!frame) {
    //   await browser.close();
    //   return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    // }

    // await frame.waitForSelector(
    //   "yt-emoji-picker-category-renderer > #emoji > img[role='option'][class*='emoji'][aria-label^=':']"
    // );
    // let bodyHTML = await frame.evaluate(() => document.body.innerHTML);
    // const result = await frame.$('img[role="option"]');
    // console.log("result", result);
    // fs.writeFileSync("./body.html", bodyHTML);

    // await browser.close();

    return new NextResponse(null, { status: 200, statusText: "OK" });
  }
  return new NextResponse(null, { status: 400, statusText: "Bad Request" });
};
