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
  isChatOwner: boolean;
  isChatSponsor: boolean;
  isChatModerator: boolean;
  channelId?: string;
  userHandleName?: string;
  legacyDisplayName?: string;
}

export interface LiveMetadata {
  title: string;
  thumbnail: string;
}

export interface DistinctUserList {
  key: string;
  name: string;
  pic: string;
  isSelected: boolean;
  isChatOwner: boolean; // channel owner
  isChatSponsor: boolean; // channel membership
  isChatModerator: boolean; // channel mod
}
