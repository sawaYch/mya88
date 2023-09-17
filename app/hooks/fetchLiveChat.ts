"use server";
export const fetchLiveChat = async (liveChatId: string, nextToken?: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=100&${
      nextToken ? `pageToken=${nextToken}&` : ""
    }key=${process.env.YT_DATA_API_TOKEN}`,
  );
  const data = await res.json();
  if (res.ok) {
    return { ok: true, ...data };
  }
  return { ok: false, ...data };
};
