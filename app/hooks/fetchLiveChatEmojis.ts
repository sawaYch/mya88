"use server";

const YT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0";

const YT_CONSENT_COOKIE =
  "CONSENT=YES+1; SOCS=CAISNAgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwODI5LjA3X3AxGgJlbiACGgYIgJnupwY";

export type EmojiCatalogMap = Record<string, string>;

export type LiveChatEmojiSession = {
  emojis: EmojiCatalogMap;
  continuation: string;
  apiKey: string;
  clientVersion: string;
};

function extractJsonAssign(html: string, varName: string): unknown | null {
  const patterns = [`${varName}"] = `, `${varName}'] = `, `${varName} = `];
  let start = -1;
  for (const marker of patterns) {
    const idx = html.indexOf(marker);
    if (idx !== -1) {
      start = idx + marker.length;
      break;
    }
  }
  if (start === -1) return null;

  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return null;
  try {
    return JSON.parse(html.slice(start, end));
  } catch {
    return null;
  }
}

function pickThumbnailUrl(
  thumbnails: Array<{ url?: string }> | undefined,
): string | undefined {
  if (!thumbnails?.length) return undefined;
  return thumbnails[thumbnails.length - 1]?.url || thumbnails[0]?.url;
}

/** Collect shortcut → image URL from live chat payload (message runs / emoji objects). */
function collectEmojiCatalog(root: unknown): EmojiCatalogMap {
  const map: EmojiCatalogMap = {};
  const stack: unknown[] = [root];

  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;

    const obj = node as Record<string, unknown>;
    const emoji = obj.emoji as
      | {
          shortcuts?: string[];
          image?: { thumbnails?: Array<{ url?: string }> };
        }
      | undefined;

    if (emoji?.shortcuts?.[0]) {
      const url = pickThumbnailUrl(emoji.image?.thumbnails);
      if (url) map[emoji.shortcuts[0]] = url;
    }

    if (
      Array.isArray(obj.shortcuts) &&
      typeof obj.shortcuts[0] === "string" &&
      obj.image &&
      typeof obj.image === "object"
    ) {
      const url = pickThumbnailUrl(
        (obj.image as { thumbnails?: Array<{ url?: string }> }).thumbnails,
      );
      if (url) map[obj.shortcuts[0]] = url;
    }

    if (Array.isArray(node)) {
      for (const item of node) stack.push(item);
    } else {
      for (const value of Object.values(obj)) stack.push(value);
    }
  }

  return map;
}

function readContinuation(liveChatRenderer: Record<string, unknown>): string {
  const continuations = liveChatRenderer.continuations as
    | Array<Record<string, Record<string, string>>>
    | undefined;
  const first = continuations?.[0];
  return (
    first?.timedContinuationData?.continuation ||
    first?.invalidationContinuationData?.continuation ||
    ""
  );
}

export async function fetchLiveChatEmojiCatalog(
  videoId: string,
): Promise<
  { ok: true; session: LiveChatEmojiSession } | { ok: false; message: string }
> {
  try {
    const url = `https://www.youtube.com/live_chat?is_popout=1&v=${encodeURIComponent(videoId)}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": YT_USER_AGENT,
        Cookie: YT_CONSENT_COOKIE,
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) {
      return { ok: false, message: `live_chat HTTP ${res.status}` };
    }

    const html = await res.text();
    const data = extractJsonAssign(html, "ytInitialData") as {
      contents?: {
        liveChatRenderer?: Record<string, unknown>;
        messageRenderer?: { text?: { runs?: Array<{ text?: string }> } };
      };
    } | null;

    if (!data) {
      return { ok: false, message: "Failed to parse live_chat ytInitialData" };
    }

    const liveChatRenderer = data.contents?.liveChatRenderer;
    if (!liveChatRenderer) {
      const disabledMsg =
        data.contents?.messageRenderer?.text?.runs?.[0]?.text ||
        "Live chat unavailable for emoji catalog";
      return { ok: false, message: disabledMsg };
    }

    const apiKey = html.match(/INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
    const clientVersion = html.match(/"clientVersion":"([^"]+)"/)?.[1];
    const continuation = readContinuation(liveChatRenderer);

    if (!apiKey || !clientVersion || !continuation) {
      return {
        ok: false,
        message: "Missing InnerTube credentials for emoji catalog refresh",
      };
    }

    return {
      ok: true,
      session: {
        emojis: collectEmojiCatalog(liveChatRenderer),
        continuation,
        apiKey,
        clientVersion,
      },
    };
  } catch (err) {
    return {
      ok: false,
      message: `Fail to fetch emoji catalog: ${(err as Error).message}`,
    };
  }
}

export async function refreshLiveChatEmojiCatalog(session: {
  continuation: string;
  apiKey: string;
  clientVersion: string;
}): Promise<
  | { ok: true; emojis: EmojiCatalogMap; continuation: string }
  | { ok: false; message: string }
> {
  try {
    const res = await fetch(
      `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${session.apiKey}&prettyPrint=false`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": YT_USER_AGENT,
          Cookie: YT_CONSENT_COOKIE,
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: session.clientVersion,
            },
          },
          continuation: session.continuation,
        }),
      },
    );

    if (!res.ok) {
      return { ok: false, message: `get_live_chat HTTP ${res.status}` };
    }

    const data = (await res.json()) as {
      continuationContents?: {
        liveChatContinuation?: Record<string, unknown>;
      };
    };

    const liveChatContinuation =
      data.continuationContents?.liveChatContinuation;
    if (!liveChatContinuation) {
      return { ok: false, message: "No liveChatContinuation in refresh" };
    }

    return {
      ok: true,
      emojis: collectEmojiCatalog(liveChatContinuation),
      continuation:
        readContinuation(liveChatContinuation) || session.continuation,
    };
  } catch (err) {
    return {
      ok: false,
      message: `Fail to refresh emoji catalog: ${(err as Error).message}`,
    };
  }
}
