export type MessageType =
  | "membershipGiftingEvent"
  | "superChatEvent"
  | "memberMilestoneChatEvent"
  | "textMessageEvent"
  | "giftMembershipReceivedEvent"
  | "newSponsorEvent";

export interface MessageData {
  key: string;
  name: string;
  message: string;
  type: MessageType;
  pic: string;
  time: string;
  isChatOwner: boolean; // channel owner
  isChatSponsor: boolean; // channel membership
  isChatModerator: boolean; // channel mod
}

export interface LiveMetadata {
  title: string;
  thumbnail: string;
}
