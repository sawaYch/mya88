"use server";

import { tokenMapper } from "../utils";

const CHANNEL_IDS_PER_REQUEST = 50;

export const fetchChannels = async (
  currentPassphrase: string,
  channelIds: string[],
): Promise<Record<string, string>> => {
  const apiToken = tokenMapper(currentPassphrase);
  if (!apiToken || channelIds.length === 0) return {};

  const result: Record<string, string> = {};
  const ids = [...new Set(channelIds)].filter(Boolean);
  for (let i = 0; i < ids.length; i += CHANNEL_IDS_PER_REQUEST) {
    const chunk = ids.slice(i, i + CHANNEL_IDS_PER_REQUEST);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=${chunk.join(",")}&part=snippet&key=${apiToken}`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (res.ok && Array.isArray(data.items)) {
      for (const it of data.items) {
        if (it.id && it.snippet?.title) result[it.id] = it.snippet.title;
      }
    }
  }
  return result;
};
