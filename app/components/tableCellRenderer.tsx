import { Key } from "react";
import { MessageData } from "../../types";
import { Avatar, Badge } from "@nextui-org/react";

export const tableCellRenderer = (user: MessageData, columnKey: Key) => {
  const isBordered =
    user.type === "membershipGiftingEvent" || user.type === "superChatEvent";
  const content =
    user.type === "membershipGiftingEvent"
      ? "🎁"
      : user.type === "superChatEvent"
      ? "💬"
      : undefined;
  const color =
    user.type === "membershipGiftingEvent"
      ? "primary"
      : user.type === "superChatEvent"
      ? "danger"
      : undefined;
  switch (columnKey) {
    case "name":
      if (
        user.type === "membershipGiftingEvent" ||
        user.type === "superChatEvent"
      ) {
        return (
          <div className="flex items-center gap-2">
            <div className="flex">
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
            </div>
            <div className="flex p-2">{user.name}</div>
          </div>
        );
      }

      if (user.isOwner) {
        return (
          <div className="flex items-center gap-2">
            <div className="flex">
              <Badge
                content="🔧"
                color="primary"
                size="sm"
                placement="top-right"
              >
                <Avatar isBordered color="primary" radius="md" src={user.pic} />
              </Badge>
            </div>
            <div className="flex p-2 text-primary bold">{user.name}</div>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            <Avatar
              isBordered={isBordered}
              color={color}
              radius="md"
              src={user.pic}
            />
          </div>
          <div className="flex p-2">{user.name}</div>
        </div>
      );
    default:
      return (user as unknown as { [key: string]: string })[columnKey];
  }
};
