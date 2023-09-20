import { DistinctUserList, MessageData } from "@/types";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import { AutoSizer, List } from "react-virtualized";
import { useCallback, useMemo } from "react";
import { uniqBy } from "lodash";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { AudienceListRowRenderer } from "./audienceListRowRenderer";

interface AudienceModalListProps {
  isOpen: boolean;
  onClose: () => void;
  audienceList: Set<String>;
  tableData: MessageData[];
  isEnableDistinctAudCheck: boolean;
  onToggleDistinctAudCheck: () => void;
  onSelectionChange: (updateCheckedUsers: string[]) => void;
}

export const AudienceModalList = ({
  onClose,
  isOpen,
  audienceList, // distinct checked user
  tableData, // all messageData include un-read
  isEnableDistinctAudCheck,
  onToggleDistinctAudCheck,
  onSelectionChange,
}: AudienceModalListProps) => {
  const distinctUserList: DistinctUserList[] = useMemo(() => {
    const allDistinctUsersWithReadState = uniqBy(
      tableData,
      (obj) => obj.name,
    ).map((it) => ({
      key: it.key,
      name: it.name,
      pic: it.pic,
      isSelected: audienceList.has(it.name),
      isChatOwner: it.isChatOwner,
      isChatSponsor: it.isChatSponsor,
      isChatModerator: it.isChatModerator,
    }));
    return allDistinctUsersWithReadState;
  }, [audienceList, tableData]);

  const handleValueChange = useCallback(() => {
    onToggleDistinctAudCheck();
  }, [onToggleDistinctAudCheck]);

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center justify-center gap-2">
              Audience List
              <div className="text-xxs font-light">
                Display distinct audience captured from app start only, past
                records are not covered.
              </div>
              <div className="flex flex-1 w-full gap-2 items-end justify-end">
                <Switch
                  isSelected={!isEnableDistinctAudCheck}
                  onValueChange={handleValueChange}
                  aria-label="toggle checkable"
                  color="warning"
                  size="sm"
                  className="font-light"
                  startContent={<AiFillLock style={{ fill: "white" }} />}
                  endContent={<AiFillUnlock style={{ fill: "white" }} />}
                >
                  Lock
                </Switch>
              </div>
            </ModalHeader>
            <ModalBody>
              <AutoSizer className="h-screen w-screen">
                {({ width, height }) => (
                  <List
                    width={width}
                    height={height}
                    rowCount={distinctUserList.length}
                    rowHeight={60}
                    overscanRowCount={3}
                    rowRenderer={(props) => (
                      <AudienceListRowRenderer
                        {...props}
                        childKey={props.key}
                        key={props.key}
                        distinctUserList={distinctUserList}
                        isSelectionEnable={!isEnableDistinctAudCheck}
                        onSelectionChange={onSelectionChange}
                      />
                    )}
                  />
                )}
              </AutoSizer>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
