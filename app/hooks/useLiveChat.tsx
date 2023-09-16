import { useCallback } from "react";
import { fetchLiveChat } from "./fetchLiveChat";
import { fetchLiveStreamDetails } from "./fetchLiveStreamDetails";

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
        const data = await fetchLiveChat(liveChatId, nextToken);
        if (data.ok) {
          return data;
        } else {
          throw data;
        }
      } catch (err) {
        return {
          success: false,
          message: `Fail to get chat message: ${(
            err as APIError
          ).error.message.replace(/(<([^>]+)>)/gi, "")}`,
        };
      }
    },
    [],
  );

  const fetchLiveStreamingDetails = useCallback(async (vid: string) => {
    try {
      const data = await fetchLiveStreamDetails(vid);
      if (data.ok) {
        // const data = await res.json();
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
        throw data;
      }
    } catch (err) {
      return {
        success: false,
        message: `Fail to get stream information: ${(
          err as APIError
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
