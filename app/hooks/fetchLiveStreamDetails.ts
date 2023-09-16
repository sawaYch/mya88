"use server";
export const fetchLiveStreamDetails = async (vid: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${vid}&key=${process.env.YT_DATA_API_TOKEN}`,
  );

  const data = await res.json();
  if (res.ok) {
    return { ok: true, ...data };
  }
  return { ok: false, ...data };
};
