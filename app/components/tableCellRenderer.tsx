import { Key, PropsWithChildren } from "react";
import { Avatar, Badge } from "@nextui-org/react";
import cn from "classnames";
import { MessageData } from "../../types";

interface userRoleBadgeProps {
  isChatModerator: boolean;
  isChatOwner: boolean;
  isChatSponsor: boolean;
}

const UserRoleBadge = ({
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

export const tableCellRenderer = (user: MessageData, columnKey: Key) => {
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
      ? "🆙"
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

  switch (columnKey) {
    case "name":
      if (
        user.type === "membershipGiftingEvent" ||
        user.type === "superChatEvent" ||
        user.type === "memberMilestoneChatEvent" ||
        user.type === "giftMembershipReceivedEvent" ||
        user.type === "newSponsorEvent"
      ) {
        return (
          <div className="flex items-center gap-2">
            <div className="flex">
              <UserRoleBadge
                isChatModerator={user.isChatModerator}
                isChatSponsor={user.isChatSponsor}
                isChatOwner={user.isChatOwner}
              >
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
              </UserRoleBadge>
            </div>
            <div
              className={cn("flex p-2", {
                "text-success font-bold": user.isChatSponsor,
                "text-primary font-bold": user.isChatModerator,
                "text-danger font-bold": user.isChatOwner,
              })}
            >
              {user.name}
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            <UserRoleBadge
              isChatModerator={user.isChatModerator}
              isChatSponsor={user.isChatSponsor}
              isChatOwner={user.isChatOwner}
            >
              <Avatar
                isBordered={isBordered}
                color={color}
                radius="md"
                src={user.pic}
              />
            </UserRoleBadge>
          </div>
          <div
            className={cn("flex p-2", {
              "text-success font-bold": user.isChatSponsor,
              "text-primary font-bold": user.isChatModerator,
              "text-danger font-bold": user.isChatOwner,
            })}
          >
            {user.name}
          </div>
        </div>
      );
    default:
      return (user as unknown as { [key: string]: string })[columnKey];
  }
};
