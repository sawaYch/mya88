import { useCallback } from "react";

interface APIError {
  error: {
    code: number;
    message: string;
  };
}

export const useLiveChat = () => {
  const fetchLiveChatMessage = useCallback(
    async (liveChatId: string, nextToken?: string) => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=2000&${
            nextToken ? `pageToken=${nextToken}&` : ""
          }key=${process.env.NEXT_PUBLIC_YT_DATA_API_TOKEN}`,
        );
        const data = await res.json();
        return data;
      } catch (err) {
        const errorJson = await (err as Response).json();
        return {
          success: false,
          message: `Fail to get chat message: ${(
            errorJson as APIError
          ).error.message.replace(/(<([^>]+)>)/gi, "")}`,
        };
      }
    },
    [],
  );

  const fetchLiveStreamingDetails = useCallback(async (vid: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${vid}&key=${process.env.NEXT_PUBLIC_YT_DATA_API_TOKEN}`,
      );
      if (res.ok) {
        const data = await res.json();
        const activeLiveChatId =
          data.items[0].liveStreamingDetails?.activeLiveChatId;
        const title = data.items[0].snippet?.title;
        const thumbnail = data.items[0].snippet?.thumbnails?.default?.url;
        const channelId = data.items[0].snippet?.channelId;
        if (activeLiveChatId == null) {
          console.error("Url source is not an active live");
          return {
            success: false,
            message: "Url source is not a active live",
          };
        }
        return { success: true, activeLiveChatId, title, thumbnail, channelId };
      } else {
        throw res;
      }
    } catch (err) {
      const errorJson = await (err as Response).json();
      return {
        success: false,
        message: `Fail to get stream information: ${(
          errorJson as APIError
        ).error.message.replace(/(<([^>]+)>)/gi, "")}`,
      };
    }
  }, []);

  const extractMessage = useCallback(
    (messageObject: {
      snippet: {
        type: string;
        hasDisplayContent: boolean;
        displayMessage: string;
      };
    }) => {
      const snippetType = messageObject.snippet.type;

      if (snippetType === "superChatEvent") {
        return messageObject.snippet.hasDisplayContent
          ? messageObject.snippet?.displayMessage
          : "No superchat message";
      } else if (snippetType === "textMessageEvent") {
        return messageObject.snippet.displayMessage;
      } else if (snippetType === "membershipGiftingEvent") {
        return messageObject.snippet.displayMessage;
      }
    },
    [],
  );

  return { fetchLiveChatMessage, fetchLiveStreamingDetails, extractMessage };
};
