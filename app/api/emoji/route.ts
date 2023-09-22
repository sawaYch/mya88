import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-extra";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  if (
    data.url != null &&
    process.env.GOOGLE_USERNAME &&
    process.env.GOOGLE_PASSWORD
  ) {
    const StealthPlugin = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: false,
    });

    const loginUrl = "https://accounts.google.com/";
    const page = await browser.newPage();
    await page.goto(loginUrl);
    await page.waitForSelector('input[type="email"]');
    console.log("filling username");
    await page.type('input[type="email"]', process.env.GOOGLE_USERNAME);
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 5000));
    console.log("filling password");
    await page.type('input[type="password"]', process.env.GOOGLE_PASSWORD);
    console.log("prepare to navigate (login)");
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    console.log("visit youtube :", data.url);
    await page.goto(data.url);
    await page.waitForNavigation();
    await page.waitForSelector("iframe[id=chatframe]");
    let frame = await page.waitForFrame(async (frame) => {
      return frame.name() === "chatframe";
    });
    if (!frame) {
      await browser.close();
      return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    }

    // check is subscribers only mode
    console.log("checking is subscriber only mode");
    const subOnlyModeDiv = await frame.$(
      "yt-live-chat-restricted-participation-renderer > #container > #explanation > #body > #message",
    );
    const subOnlyModeDivContent = await frame.evaluate(
      (el) => el?.textContent,
      subOnlyModeDiv,
    );
    console.log("subOnlyModeDivContent", subOnlyModeDivContent);
    if (
      subOnlyModeDivContent === "訂閱者專屬模式" ||
      subOnlyModeDivContent === "Subscribers-only mode"
    ) {
      const subscribeButton = await page.$("#subscribe-button");
      console.log("prepare to click subscribe button");
      await subscribeButton?.click();
      console.log("prepare to reload page");
      await page.setCacheEnabled(false);
      await page.reload();
      await new Promise((r) => setTimeout(r, 3000));
      frame = await page.waitForFrame(async (frame) => {
        return frame.name() === "chatframe";
      });
      if (!frame) {
        await browser.close();
        return new NextResponse(null, {
          status: 400,
          statusText: "Bad Request",
        });
      }
    }
    // RIP channel owner set subscriber only mode to 1 min or larger
    console.log("checking is subscriber only mode");
    const subOnlyModeDiv2 = await frame.$(
      "yt-live-chat-restricted-participation-renderer > #container > #explanation > #body > #message",
    );
    const subOnlyModeDivContent2 = await frame.evaluate(
      (el) => el?.textContent,
      subOnlyModeDiv2,
    );
    console.log("subOnlyModeDivContent2", subOnlyModeDivContent2);
    if (
      subOnlyModeDivContent2 === "訂閱者專屬模式" ||
      subOnlyModeDivContent2 === "Subscribers-only mode"
    ) {
      // go plan B
      await frame.waitForSelector(
        "#picker-buttons > yt-live-chat-icon-toggle-button-renderer > yt-icon-button[id='button']",
      );
      const memberListButton = await frame.$(
        "#picker-buttons > yt-live-chat-icon-toggle-button-renderer > yt-icon-button[id='button']",
      );
      await memberListButton?.click();
      const purchaseMemberButton = await frame.$(
        "yt-live-chat-product-button-renderer[icon-id='memberships']",
      );
      await purchaseMemberButton?.click();
      await page.waitForSelector(
        'yt-img-shadow[class*="ytd-sponsorships-perk-renderer"] > img',
      );
      await new Promise((r) => setTimeout(r, 3000));
      const emoji = await page.evaluate(() => {
        return Array.from(
          document
            .querySelectorAll(
              'yt-img-shadow[class*="ytd-sponsorships-perk-renderer"] > img',
            )
            .values(),
        ).map((e) => e.getAttribute("alt") + " " + e.getAttribute("src"));
      });

      browser.close();

      return NextResponse.json({ emoji }, { status: 200, statusText: "OK" });
    }

    const emojiButton = await frame.$("yt-icon-button[id='button']");
    console.log("prepare to click emoji button");
    await emojiButton?.click();

    await frame.waitForSelector(
      "yt-emoji-picker-category-renderer > #emoji > img[role='option'][class*='emoji'][aria-label^=':']",
    );
    await new Promise((r) => setTimeout(r, 5000));

    const emoji = await frame.evaluate(() => {
      return Array.from(
        document
          .querySelectorAll(
            'img[role="option"][class*="emoji"][aria-label^=":"]',
          )
          .values(),
      )
        .filter(
          (e) => e.getAttribute("src")?.startsWith("https://yt3.ggpht.com/"),
        )
        .map((e) => e.getAttribute("aria-label") + " " + e.getAttribute("src"));
    });
    if (emoji == null) {
      await browser.close();
      return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    }
    console.log("result", JSON.stringify(emoji));
    await page.close();
    await browser.close();
    return NextResponse.json({ emoji }, { status: 200, statusText: "OK" });
  }
  return new NextResponse(null, { status: 400, statusText: "Bad Request" });
};
