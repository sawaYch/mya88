"use client";
import {
  Input,
  Button,
  Spinner,
  useDisclosure,
  CheckboxGroup,
  Checkbox,
  Accordion,
  AccordionItem,
  Tooltip,
} from "@nextui-org/react";
import {
  BreakPointHooks,
  breakpointsTailwind,
  // @ts-ignore next-line
} from "@react-hooks-library/core";
import { AnimatePresence, motion } from "framer-motion";
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import dayjs from "dayjs";
import { uniqBy } from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { AutoSizer, List } from "react-virtualized";
import { isMobile } from "react-device-detect";
import { IoPeopleCircleSharp } from "react-icons/io5";
import "react-virtualized/styles.css";
import {
  AuthorSection,
  MetadataSection,
  ConfirmModal,
  AuthForm,
  RowRenderer,
} from "./components";
import { useLiveChat } from "./hooks";
import { defaultBaseInterval, vidParser } from "./utils";
import type { MessageData, LiveMetadata } from "../types";
import { AudienceModalList } from "./components/audienceModalList";

export default function Home() {
  const [urlInputValue, setUrlInputValue] = useState("");
  // NEW method to handle readByeBye
  const [readByeBye, setReadByeBye] = useState<Set<Key>>(new Set([]));
  const [liveUrlError, setLiveUrlError] = useState<string | undefined>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const readyRef = useRef(isReady);
  readyRef.current = isReady;
  const readByeByeRef = useRef(readByeBye);
  readByeByeRef.current = readByeBye;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeChatMessageId, setActiveChatMessageId] = useState<
    string | undefined
  >();
  const [YtMessageData, setYtMessageData] = useState<MessageData[]>([]);
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checkedUsers, setCheckedUsers] = useState<Set<string>>(new Set([]));
  const checkedUsersRef = useRef(checkedUsers);
  checkedUsersRef.current = checkedUsers;
  const updateIndicatorRef = useRef<HTMLSpanElement>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [filteredData, setFilterData] = useState<MessageData[]>([]);

  const { fetchLiveChatMessage, fetchLiveStreamingDetails, extractMessage } =
    useLiveChat();

  const intervalLiveChatMessage = useCallback(
    async (chatId: string, nextToken?: string) => {
      if (!readyRef.current) {
        Promise.resolve();
        return;
      }
      const d = await fetchLiveChatMessage(chatId, nextToken);
      if (!d.success) {
        setIsLoading(false);
        setLiveUrlError(d.message);
        return;
      }

      const pollingMs = d.pollingIntervalMillis + defaultBaseInterval;
      const nextPageToken = d.nextPageToken;
      const newData: MessageData[] = d.items.map((it: any) => ({
        key: it.id,
        name: it.authorDetails.displayName,
        pic: it.authorDetails.profileImageUrl,
        message: extractMessage(it),
        type: it.snippet.type,
        time: it.snippet.publishedAt,
        isChatOwner: it.authorDetails.isChatOwner,
        isChatSponsor: it.authorDetails.isChatSponsor,
        isChatModerator: it.authorDetails.isChatModerator,
      }));
      setYtMessageData((prev) =>
        uniqBy([...prev, ...newData], (obj) => obj.key).sort((a, b) => {
          return dayjs(b.time).isBefore(dayjs(a.time))
            ? 1
            : dayjs(b.time).isSame(dayjs(a.time))
            ? 0
            : -1;
        }),
      );

      // auto tick marked user
      const newDataKeysShouldMark = newData
        .filter((it) => checkedUsersRef.current.has(it.name))
        .map((it) => it.key);

      const newReadByeBye = new Set([
        ...Array.from(readByeByeRef.current),
        ...newDataKeysShouldMark,
      ]);
      setReadByeBye(newReadByeBye);

      setTimeout(async () => {
        await intervalLiveChatMessage(chatId, nextPageToken);
      }, pollingMs);
    },
    [extractMessage, fetchLiveChatMessage],
  );

  useEffect(() => {
    if (!isReady || activeChatMessageId == null) return;
    (async () => {
      await intervalLiveChatMessage(activeChatMessageId);
    })();
  }, [
    activeChatMessageId,
    extractMessage,
    fetchLiveChatMessage,
    intervalLiveChatMessage,
    isReady,
  ]);

  useEffect(() => {
    if (!isReady || updateIndicatorRef?.current == null) return;
    updateIndicatorRef.current.classList.remove("invisible");

    setTimeout(() => {
      if (updateIndicatorRef?.current != null) {
        updateIndicatorRef.current.classList.add("invisible");
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [YtMessageData]);

  const handleUrlChange = useCallback(async () => {
    // start / stop
    if (isReady) {
      onOpen();
    } else {
      setLiveUrlError(undefined);
      setIsLoading(true);
      // check live url vid
      const vid = vidParser(urlInputValue);
      if (vid == null || vid.length === 0) {
        setLiveUrlError("Invalid youtube live url format");
        setIsLoading(false);
        return;
      }

      // check vid is correct
      const result = await fetchLiveStreamingDetails(vid);
      if (!result.success) {
        setIsLoading(false);
        setLiveUrlError(result.message);
        return;
      }

      setActiveChatMessageId(result.activeLiveChatId);
      setLiveMetadata({ title: result.title, thumbnail: result.thumbnail });

      // all green, reset any error flag
      setIsReady(true);
      setYtMessageData([]);
      setFilterData([]);
      setSelectedFilter([]);
      setCheckedUsers(new Set([]));
      setReadByeBye(new Set([]));
      setIsLoading(false);
    }
  }, [fetchLiveStreamingDetails, isReady, onOpen, urlInputValue]);

  const handleRowCheckChanged = useCallback(
    (key: string, checked: boolean) => {
      if (!checked) return false;
      const newSet = new Set(readByeBye);
      if (!readByeBye.has(key)) {
        newSet.add(key);
      }

      const selectedKeyUsername = YtMessageData.filter((it) =>
        Array.from(newSet).includes(it.key),
      ).map((it) => it.name);

      // keys should be mark as read
      const keysShouldBeSelected = YtMessageData.filter((it) =>
        selectedKeyUsername.includes(it.name),
      ).map((it) => it.key);
      setCheckedUsers(new Set(selectedKeyUsername));
      setReadByeBye(new Set(keysShouldBeSelected));
    },
    [YtMessageData, readByeBye],
  );

  const handleStopProcess = useCallback(() => {
    setIsReady(false);
    onClose();
  }, [onClose]);

  const handleAuth = useCallback(async (passphrase: string) => {
    const result = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ passphrase }),
    });
    if (result.status === 200) {
      toast("Welcome!", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setIsAuth(true);
    } else {
      toast("Wrong Secret Code", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setIsAuth(false);
    }
  }, []);

  const handleOnFilterChanged = useCallback(
    (f: string[]) => {
      setSelectedFilter(f);
      if (f.length === 0) {
        return;
      }
      const newData = YtMessageData.filter((d) => {
        if (f.includes(d.type)) return true;
        return false;
      }).sort((a, b) => {
        return dayjs(b.time).isBefore(dayjs(a.time))
          ? 1
          : dayjs(b.time).isSame(dayjs(a.time))
          ? 0
          : -1;
      });
      setFilterData(newData);
    },
    [YtMessageData],
  );

  const tableData = useMemo(() => {
    return selectedFilter.length > 0 ? filteredData : YtMessageData;
  }, [YtMessageData, filteredData, selectedFilter.length]);

  const numOfRecord = useMemo(() => {
    return tableData.length;
  }, [tableData.length]);

  const {
    isOpen: isAudienceListOpen,
    onOpen: onAudienceListOpen,
    onClose: onAudienceListClose,
  } = useDisclosure();

  const [enableDistinctAudCheck, setEnableDistinctAudCheck] = useState(false);

  const handleSelectionChange = useCallback(
    (updateCheckedUsers: string[]) => {
      if (updateCheckedUsers.length === checkedUsers.size) return;
      if (updateCheckedUsers.length > checkedUsers.size) {
        const checkedUsersArray = Array.from(checkedUsers);
        const extraElement = updateCheckedUsers.find(
          (element) => !checkedUsersArray.includes(element),
        );
        const checkedUserKey = tableData.find((it) => it.name === extraElement);
        if (checkedUserKey == null) return;
        handleRowCheckChanged(checkedUserKey.key, true);
      }
      setCheckedUsers(new Set(updateCheckedUsers));
    },
    [checkedUsers, handleRowCheckChanged, tableData],
  );

  const { useSmaller } = BreakPointHooks(breakpointsTailwind);
  const isMobileBreakpoint = useSmaller("md");

  return (
    <main
      className={cn(
        "fixed flex flex-col h-screen items-center px-2 sm:px-10 font-mono w-screen overflow-hidden",
        {
          "max-h-[85vh]": isMobile,
        },
      )}
    >
      <AuthorSection />
      {!isAuth ? (
        <AuthForm onSubmit={handleAuth} />
      ) : (
        <>
          <motion.div
            className={cn("flex flex-col w-full z-10", {
              grow: isAuth,
              "justify-center": !isReady,
              "justify-start mt-2": isReady,
            })}
            layout
          >
            <AnimatePresence>
              <motion.div
                key="url-input-bar"
                layout
                className="flex justify-center items-start gap-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col w-full">
                  <Input
                    type="url"
                    isClearable={!isReady}
                    label="Enter Youtube Live Url"
                    placeholder="for example: https://www.youtube.com/watch?v=7LA9mAOz7gA"
                    radius="lg"
                    value={urlInputValue}
                    onValueChange={setUrlInputValue}
                    disabled={isReady}
                    autoComplete="off"
                    color={isReady ? "success" : "default"}
                    className={"text-md"}
                  />
                  {liveUrlError && (
                    <div className="text-danger text-xs">{`⚠️${liveUrlError}`}</div>
                  )}
                </div>
                <div className="flex grow">
                  <Button
                    isIconOnly
                    aria-label="go"
                    color={isReady ? "danger" : "secondary"}
                    className="text-white h-14 w-14 rounded-full mb-4"
                    onClick={handleUrlChange}
                  >
                    {isLoading ? (
                      <Spinner color="default" />
                    ) : (
                      <div className="text-4xl">🐼</div>
                    )}
                  </Button>
                </div>
              </motion.div>
              {isReady && (
                <motion.div
                  key="chat-message-table"
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grow mb-4 justify-stretch items-stretch flex flex-col"
                >
                  <Accordion
                    showDivider={false}
                    variant="splitted"
                    isCompact
                    className="mx-0 px-0"
                    itemClasses={{
                      content: "mb-2",
                    }}
                  >
                    <AccordionItem
                      key="1"
                      aria-label="metadata-accordion"
                      indicator={<div>➕</div>}
                      startContent={
                        <MetadataSection
                          title={liveMetadata?.title}
                          thumbnail={liveMetadata?.thumbnail}
                        />
                      }
                    >
                      <div className="flex items-center">
                        <div className="flex">
                          <CheckboxGroup
                            label="Filters"
                            orientation="horizontal"
                            color="primary"
                            value={selectedFilter}
                            onValueChange={handleOnFilterChanged}
                            size="sm"
                            radius="full"
                            classNames={{
                              label: "text-xs",
                            }}
                          >
                            <Checkbox value="superChatEvent">
                              Superchat💬
                            </Checkbox>
                            <Checkbox value="membershipGiftingEvent">
                              Membership Gift🎁
                            </Checkbox>
                          </CheckboxGroup>
                        </div>
                        <div className="flex ml-auto">
                          <Tooltip content="Audience List">
                            <Button
                              isIconOnly
                              color="secondary"
                              aria-label="show-user-list"
                              onClick={onAudienceListOpen}
                            >
                              <IoPeopleCircleSharp size={36} />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex justify-end items-center">
                    <div className="flex">
                      <span className="relative flex h-3 w-3 justify-center items-center">
                        <span
                          ref={updateIndicatorRef}
                          className="animate-ping invisible absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"
                        ></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                      </span>
                    </div>
                    <div className="flex text-center text-xs text-white/50 mr-2 ml-1">
                      Records: {numOfRecord}
                    </div>
                  </div>
                  <div className="flex-1">
                    <AutoSizer>
                      {({ width, height }) => (
                        <List
                          width={width}
                          height={height}
                          rowCount={tableData.length}
                          rowHeight={isMobileBreakpoint ? 128 : 90}
                          overscanRowCount={3}
                          rowRenderer={(props) => (
                            <RowRenderer
                              {...props}
                              childKey={props.key}
                              key={props.key}
                              list={tableData}
                              onRowCheckChanged={handleRowCheckChanged}
                              checkedList={readByeBye}
                            />
                          )}
                        />
                      )}
                    </AutoSizer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            handleStopProcess={handleStopProcess}
          />
          <AudienceModalList
            onClose={onAudienceListClose}
            isOpen={isAudienceListOpen}
            audienceList={checkedUsers}
            tableData={tableData}
            isEnableDistinctAudCheck={enableDistinctAudCheck}
            onToggleDistinctAudCheck={() => {
              setEnableDistinctAudCheck((prev) => !prev);
            }}
            onSelectionChange={handleSelectionChange}
          />
        </>
      )}
      <Toaster position="bottom-right" reverseOrder={false} />
    </main>
  );
}
