import { DistinctUserList, MessageData } from "@/types";
import { ListRowProps } from "react-virtualized";
import cn from "classnames";
import { Avatar, Checkbox } from "@nextui-org/react";
import { PropsWithChildren, ReactNode, useCallback } from "react";
import { UserRoleBadge } from ".";

interface AudienceListRowRendererProps extends ListRowProps {
  distinctUserList: DistinctUserList[];
  childKey: string;
  isSelectionEnable: boolean;
  onSelectionChange: (updatedAudienceList: string[]) => void;
}

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
}

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: PropsWithChildren<ConditionalWrapperProps>) =>
  condition ? wrapper(children) : children;

export const AudienceListRowRenderer = ({
  index,
  childKey,
  style,
  distinctUserList,
  isSelectionEnable,
  onSelectionChange,
}: AudienceListRowRendererProps) => {
  const user = distinctUserList[index];

  const handleValueChange = useCallback(
    (isSelected: boolean) => {
      console.log("isSelected", isSelected);
      // NOTE Reject is disabled
      if (isSelected) {
        // add
        if (
          distinctUserList
            .filter((it) => it.isSelected)
            .some((i) => i.name === user.name)
        )
          return;
        const newCheckedUserList = [
          ...distinctUserList
            .filter((it) => it.isSelected)
            .map((it) => it.name),
          user.name,
        ];
        console.log("row call added");
        onSelectionChange(newCheckedUserList);
      }
      // else {
      //   // remove
      //   if (
      //     distinctUserList
      //       .filter((it) => !it.isSelected)
      //       .some((i) => i.name === user.name)
      //   )
      //     return;
      //   const newCheckedUserList = distinctUserList
      //     .filter((it) => (it.name === user.name ? false : it.isSelected))
      //     .map((it) => it.name);
      //   onSelectionChange(newCheckedUserList);
      // }
    },
    [distinctUserList, onSelectionChange, user.name],
  );

  return (
    <div key={childKey} style={style} className="flex">
      <ConditionalWrapper
        condition={!isSelectionEnable}
        wrapper={(children) => (
          <Checkbox
            aria-label={user.name}
            isSelected={user.isSelected}
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
            {children}
          </Checkbox>
        )}
      >
        <div
          className={cn("flex items-center p-2 w-full", {
            "bg-success/20": user.isSelected && isSelectionEnable,
          })}
        >
          <div className="flex">
            <UserRoleBadge
              isChatModerator={user.isChatModerator}
              isChatSponsor={user.isChatSponsor}
              isChatOwner={user.isChatOwner}
            >
              <Avatar radius="md" src={user.pic} />
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
          </div>
        </div>
      </ConditionalWrapper>
    </div>
  );
};
