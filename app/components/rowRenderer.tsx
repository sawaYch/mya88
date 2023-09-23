import { MessageData } from "@/types";
import { ListRowProps } from "react-virtualized";
import cn from "classnames";
import { Key, PropsWithChildren, ReactNode, useCallback, useMemo } from "react";
import { isMobile } from "react-device-detect";
import { Avatar, Badge, Checkbox } from "@nextui-org/react";
import dayjs from "dayjs";
import { Image } from "@nextui-org/react";
import { getEmojiByKey } from "../utils";

interface RowRendererProps extends ListRowProps {
  list: MessageData[];
  onRowCheckChanged: (key: string, checked: boolean) => void;
  checkedList: Set<Key>;
  childKey: string;
}

export interface userRoleBadgeProps {
  isChatModerator: boolean;
  isChatOwner: boolean;
  isChatSponsor: boolean;
}

export const UserRoleBadge = ({
  isChatModerator,
  isChatOwner,
  isChatSponsor,
  children,
}: PropsWithChildren<userRoleBadgeProps>) => {
  const content = isChatModerator
    ? "🔧"
    : isChatOwner
    ? "👑"
    : isChatSponsor
    ? "🚀"
    : undefined;

  const color = isChatModerator
    ? "primary"
    : isChatOwner
    ? "danger"
    : isChatSponsor
    ? "success"
    : undefined;

  if (isChatModerator || isChatSponsor || isChatOwner) {
    return (
      <Badge content={content} color={color} size="sm" placement="bottom-right">
        {children}
      </Badge>
    );
  }

  return children;
};

interface MessageRendererProps {
  rawMessage: string;
}

const MessageRenderer = ({ rawMessage }: MessageRendererProps) => {
  const messageWithEmoji = useMemo(() => {
    return rawMessage.split(/(:.*?:)/g).map((emoText, idx) => {
      if (!emoText) return null;
      const emojiUrl = getEmojiByKey(emoText);
      if (emojiUrl) {
        return (
          <Image
            key={`${emoText}${idx}`}
            src={emojiUrl}
            alt={emoText}
            className="rounded-none mx-[1px]"
          />
        );
      }
      return <p key={`${emoText}${idx}`}>{emoText}</p>;
    });
  }, [rawMessage]);

  return <div className="flex flex-row items-center">{messageWithEmoji}</div>;
};

export const RowRenderer = ({
  index,
  childKey,
  style,
  list,
  checkedList,
  onRowCheckChanged,
}: RowRendererProps) => {
  const user = list[index];

  const handleValueChange = useCallback(
    (isSelected: boolean) => {
      onRowCheckChanged(user.key, isSelected);
    },
    [onRowCheckChanged, user.key],
  );

  const isBordered =
    user.type === "membershipGiftingEvent" ||
    user.type === "superChatEvent" ||
    user.type === "memberMilestoneChatEvent" ||
    user.type === "giftMembershipReceivedEvent" ||
    user.type === "newSponsorEvent";
  const content =
    user.type === "membershipGiftingEvent"
      ? "🎁"
      : user.type === "superChatEvent"
      ? "💬"
      : user.type === "memberMilestoneChatEvent"
      ? "🏆"
      : user.type === "giftMembershipReceivedEvent"
      ? "📦"
      : user.type === "newSponsorEvent"
      ? "🎉"
      : undefined;
  const color =
    user.type === "membershipGiftingEvent" || user.type === "newSponsorEvent"
      ? "primary"
      : user.type === "superChatEvent"
      ? "danger"
      : user.type === "memberMilestoneChatEvent"
      ? "success"
      : user.type === "giftMembershipReceivedEvent"
      ? "default"
      : undefined;

  const isSelected = useMemo(() => {
    return checkedList.has(user.key);
  }, [checkedList, user.key]);

  return (
    <div key={childKey} style={style} className="flex">
      <Checkbox
        aria-label={user.name}
        isSelected={isSelected}
        onValueChange={handleValueChange}
        color="success"
        classNames={{
          base: cn(
            "flex bg-content1/10 backdrop-blur-sm !max-w-full !w-full !m-0",
            "hover:bg-primary/20 items-center justify-start",
            "cursor-pointer",
            "data-[selected=true]:bg-success/20",
          ),
          label: "w-full",
        }}
      >
        <div className="flex items-center p-2">
          <div className="flex">
            <UserRoleBadge
              isChatModerator={user.isChatModerator}
              isChatSponsor={user.isChatSponsor}
              isChatOwner={user.isChatOwner}
            >
              {user.type === "membershipGiftingEvent" ||
              user.type === "superChatEvent" ||
              user.type === "memberMilestoneChatEvent" ||
              user.type === "giftMembershipReceivedEvent" ||
              user.type === "newSponsorEvent" ? (
                <Badge
                  content={content}
                  color={color}
                  size="sm"
                  placement="top-right"
                >
                  <Avatar
                    isBordered={isBordered}
                    color={color}
                    radius="md"
                    src={user.pic}
                  />
                </Badge>
              ) : (
                <Avatar
                  isBordered={isBordered}
                  color={color}
                  radius="md"
                  src={user.pic}
                />
              )}
            </UserRoleBadge>
          </div>
          <div className="flex flex-col pl-4 leading-tight">
            <div
              className={cn("flex", {
                "text-success font-bold": user.isChatSponsor,
                "text-primary font-bold": user.isChatModerator,
                "text-danger font-bold": user.isChatOwner,
              })}
            >
              {user.name}
            </div>
            <div className="text-xxs">
              {dayjs(user.time).format("DD/MMM/YYYY HH:mm:ss")}
            </div>
            <div className={cn("text-xs sm:text-md", { "text-xxs": isMobile })}>
              <MessageRenderer rawMessage={user.message} />
            </div>
          </div>
        </div>
      </Checkbox>
    </div>
  );
};
