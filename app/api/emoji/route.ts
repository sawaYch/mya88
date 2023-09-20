// import { JSDOM } from "jsdom";
// import fetch from "node-fetch";
// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";

// export const POST = async (req: NextRequest) => {
//   const data = await req.json();
//   console.log("data url", data.url);
//   if (data.url != null) {
//     const raw = await fetch(data.url);
//     const htmlText = await raw.text();
//     const dom = new JSDOM(htmlText);
//     const document = dom.window.document;
//     // const result =

//     // Array.from(
//     //   document
//     //     .querySelectorAll('img[role="option"][class*="emoji"][aria-label^=":"]')
//     //     .values()
//     // )
//     // .slice(0, 20)
//     // .map((e) => e.getAttribute("aria-label") + " " + e.getAttribute("src"));
//     fs.writeFile("./debug", htmlText, (err) => {
//       if (err) {
//         console.error(err);
//       }
//       // file written successfully
//     });
//     console.log("API result", htmlText);
//     return new NextResponse(null, { status: 200, statusText: "Bad Request" });
//   }
//   return new NextResponse(null, { status: 400, statusText: "Bad Request" });
// };
