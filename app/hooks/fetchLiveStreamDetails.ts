"use server";
export const fetchLiveStreamDetails = async (vid: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${vid}&key=${process.env.YT_DATA_API_TOKEN}`,
  );

  const data = await res.json();
  if (data.items == null || data.items.length === 0) {
    return {
      ok: false,
      error: { message: data?.error?.message ?? "Livestream Unavailable" },
    };
  }
  if (res.ok) {
    return { ok: true, ...data };
  }
  return { ok: false, ...data };
};
