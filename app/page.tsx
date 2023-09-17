"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Selection,
  Spinner,
  useDisclosure,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import dayjs from "dayjs";
import { uniqBy } from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { useLiveChat } from "./hooks";
import {
  AuthorSection,
  MetadataSection,
  tableCellRenderer,
  CustomTableHeader,
  ConfirmModal,
  AuthForm,
} from "./components";
import { tableColumns, defaultBaseInterval, mockData } from "./utils";
import type { MessageData, LiveMetadata } from "../types";

export default function Home() {
  const [urlInputValue, setUrlInputValue] = useState("");
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
  const [data, setData] = useState<MessageData[]>([]);
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
      console.log("d", d);
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
      setData((prev) =>
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
  }, [data]);

  const handleUrlChange = useCallback(async () => {
    // start / stop
    if (isReady) {
      onOpen();
    } else {
      setLiveUrlError(undefined);
      setIsLoading(true);
      // check live url vid
      const vid = urlInputValue?.split("watch?v=")?.[1];
      if (vid == null || vid.length === 0) {
        setLiveUrlError("Invalid youtube live url format");
        setIsLoading(false);
        return;
      }

      // check vid is correct
      // const result = await fetchLiveStreamingDetails(vid);
      // if (!result.success) {
      //   setIsLoading(false);
      //   setLiveUrlError(result.message);
      //   return;
      // }

      // setActiveChatMessageId(result.activeLiveChatId);
      // setLiveMetadata({ title: result.title, thumbnail: result.thumbnail });

      // all green, reset any error flag
      setIsReady(true);
      setData([]);
      setFilterData([]);
      setSelectedFilter([]);
      setCheckedUsers(new Set([]));
      setReadByeBye(new Set([]));
      setIsLoading(false);
    }
  }, [fetchLiveStreamingDetails, isReady, onOpen, urlInputValue]);

  const handleReadByeBye = useCallback(
    (keys: Selection) => {
      let t0 = performance.now();

      if (keys == "all") return;
      // not allow to un-tick
      if (keys.size < readByeBye.size) return;

      // find user messageData of the newly selected key
      const selectedKeyUsername = mockData
        .filter((it) => Array.from(keys).includes(it.key))
        .map((it) => it.name);

      // keys should be mark as read
      const keysShouldBeSelected = mockData
        .filter((it) => selectedKeyUsername.includes(it.name))
        .map((it) => it.key);

      // record bye-bye-ed user & checked user
      setCheckedUsers(new Set(selectedKeyUsername));
      setReadByeBye(new Set(keysShouldBeSelected));
      let t1 = performance.now();
      console.log("handleReadByeBye() took " + (t1 - t0) + " milliseconds.");
    },
    [readByeBye],
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

  const handleOnFilterChanged = useCallback((f: string[]) => {
    setSelectedFilter(f);
    if (f.length === 0) {
      return;
    }
    let t0 = performance.now();
    const newData = mockData
      .filter((d) => {
        if (f.includes(d.type)) return true;
        return false;
      })
      .sort((a, b) => {
        return dayjs(b.time).isBefore(dayjs(a.time))
          ? 1
          : dayjs(b.time).isSame(dayjs(a.time))
          ? 0
          : -1;
      });
    setFilterData(newData);
    let t1 = performance.now();
    console.log("handleOnFilterChanged() took " + (t1 - t0) + " milliseconds.");
  }, []);

  const tableData = useMemo(() => {
    return selectedFilter.length > 0 ? filteredData : mockData; //data;
  }, [filteredData, selectedFilter]);

  const numOfRecord = useMemo(() => {
    return tableData.length;
  }, [tableData.length]);

  return (
    <main className="flex flex-col min-h-screen items-center px-10 font-mono">
      <AuthorSection />
      {!isAuth ? (
        <AuthForm onSubmit={handleAuth} />
      ) : (
        <>
          <motion.div
            className={cn("flex flex-col w-full grow", {
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
                <div className="flex flex-col w-full grow">
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
                  />
                  <div className="text-danger">
                    {liveUrlError ?? (isReady && "✅")}
                  </div>
                </div>
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
              </motion.div>
              {isReady && (
                <motion.div
                  key="chat-message-table"
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-[64vh]"
                >
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
                    className="mt-2"
                  >
                    <Checkbox value="superChatEvent">Superchat💬</Checkbox>
                    <Checkbox value="membershipGiftingEvent">
                      Membership Gift🎁
                    </Checkbox>
                  </CheckboxGroup>
                  <MetadataSection
                    title={liveMetadata?.title}
                    thumbnail={liveMetadata?.thumbnail}
                  />
                  <div className="flex justify-end text-center text-xs text-white/50 mr-2">
                    Records: {numOfRecord}
                  </div>
                  <CustomTableHeader />
                  <Table
                    aria-label="yt-chat-message-table"
                    selectedKeys={readByeBye}
                    onSelectionChange={handleReadByeBye}
                    selectionMode="multiple"
                    color="success"
                    classNames={{
                      base: "max-h-[100%] overflow-hidden",
                      table: "min-h-[64vh] -mt-12",
                      thead: "invisible",
                      wrapper:
                        "rounded-br-none rounded-tr-none rounded-tl-none",
                      td: "break-all select-none",
                    }}
                    isHeaderSticky
                    shadow="none"
                  >
                    <TableHeader aria-label="header" columns={tableColumns}>
                      {(column) => (
                        <TableColumn
                          aria-label="column"
                          key={column.key}
                          width={column.width}
                        >
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={tableData}>
                      {(item) => (
                        <TableRow aria-label="row" key={item.key}>
                          {(columnKey) => (
                            <TableCell aria-label="cell">
                              {tableCellRenderer(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="flex  justify-end mt-2">
                    <span className="relative flex h-3 w-3 justify-center items-center">
                      <span
                        ref={updateIndicatorRef}
                        className="animate-ping invisible absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"
                      ></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
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
        </>
      )}
      <Toaster position="bottom-right" reverseOrder={false} />
    </main>
  );
}
