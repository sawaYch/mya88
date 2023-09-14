"use client";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Input,
  Button,
  Selection,
} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Key, useCallback, useMemo, useState } from "react";
import pack from "../package.json";

const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "CEO",
  },
  {
    key: "2",
    name: "Zoey Lang",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "Technical Lead",
  },
  {
    key: "3",
    name: "Jane Fisher",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "Senior Developer",
  },
  {
    key: "4",
    name: "William Howard",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "Community Manager",
  },
  {
    key: "5",
    name: "Long long long long long long name test",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message:
      "I am going to do it. I have made up my mind. These are the first few words of the new… the best … the Longest Text In The Entire History Of The Known Universe! This Has To Have Over 35,000 words the beat the current world record set by that person who made that flaming chicken handbooky thingy. I might just be saying random things the whole time I type in this so you might get confused a lot. I just discovered something terrible. autocorrect is on!! no!!! this has to be crazy, so I will have to break all the English language rules and the basic knowledge of the average human being. I am not an average human being, however I am special. no no no, not THAT kind of special ;). Why do people send that wink face! it always gives me nightmares! it can make a completely normal sentence creepy. imagine you are going to a friend’s house, so you text this: [ see you soon 🙂 ] seems normal, right? But what is you add the word semi to that colon? (Is that right? or is it the other way around) what is you add a lorry to that briquettes? (Semi-truck to that coal-on) anyway, back to the point: [ see you soon 😉 ]THAT IS JUST SO CREEPY! is that really your friend, or is it a creepy stalker watching your every move? Or even worse, is it your friend who is a creepy stalker? maybe you thought it was your friend, but it was actually your fri end (let me explain: you are happily in McDonalds, getting fat while eating yummy food and some random dude walks up and blots out the sun (he looks like a regular here) you can’t see anything else than him, so you can’t try to avoid eye contact. he finishes eating his cheeseburger (more like horseburgher(I learned that word from the merchant of Venice(which is a good play(if you can understand it(I can cause I got a special book with all the words in readable English written on the side of the page(which is kinda funny because Shakespeare was supposed to be a good poet but no-one can understand him(and he’s racist in act 2 scene1 of the play too))))))) and sits down beside you , like you are old pals (you’ve never met him before but he looks like he could be in some weird cult) he clears his throat and asks you a very personal question. “can i have some French fries?” (I don’t know why there called French fries when I’ve never seen a French person eat fries! all they eat it is stuff like baguettes and crêpes and rats named ratty-two-ee which is a really fun game on the PlayStation 2) And you think {bubbly cloud thinking bubble} “Hahahahahhahahahahahahahaha!!!!!!!!!!!!",
  },
  {
    key: "6",
    name: "Long long long long long long name test",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "88米88貓",
  },
  {
    key: "7",
    name: "Long long long long long long name test",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "88米88貓",
  },
  {
    key: "8",
    name: "Long long long long long long name test",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "88米88貓",
  },
  {
    key: "9",
    name: "Long long long long long long name test",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "88米88貓",
  },
  {
    key: "10",
    name: "Long long long long long long name test",
    pic: "https://yt4.ggpht.com/ytc/AOPolaRyc4u5TCsT76h1lNuQYPbJOzEK9OTdrhguwB6d=s32-c-k-c0x00ffffff-no-rj",
    message: "88米88貓",
  },
];

const columns = [
  {
    key: "name",
    label: "NAME",
    width: 200,
  },
  {
    key: "message",
    label: "MESSAGE",
  },
];

export default function Home() {
  const [liveUrl, setLiveUrl] = useState<string | undefined>();
  const [urlInputValue, setUrlInputValue] = useState("");
  const [readByeBye, setReadByeBye] = useState<Set<Key>>(new Set([]));

  const isReady = useMemo(() => {
    return liveUrl != null && liveUrl.length > 0;
  }, [liveUrl]);

  const handleUrlChange = useCallback(() => {
    if (isReady) {
      setLiveUrl(undefined);
    } else {
      setLiveUrl(urlInputValue);
    }
  }, [urlInputValue, isReady]);
  const appVersion = useMemo(() => {
    return pack.version;
  }, []);

  const handleReadByeBye = useCallback(
    (keys: Selection) => {
      if (keys == "all") return;
      // not allow to un-tick
      if (keys.size < readByeBye.size) return;
      setReadByeBye(keys);
    },
    [readByeBye]
  );

  return (
    <main className="flex flex-col min-h-screen items-center px-10 font-mono">
      <div className="flex self-end mt-2 relative">
        <div className="flex flex-col items-center justify-center text-xs">
          さようなら Mya {appVersion ?? "unknown version"}
          <div>Created By No.159</div>
          <div>Sawa</div>
        </div>
        <a
          className="flex place-items-center p-2"
          href="https://github.com/sawaYch"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="rounded-full"
            src="/author.jpg"
            alt="author"
            width={32}
            height={32}
            priority
          />
        </a>
      </div>
      <motion.div
        className="justify-center flex flex-col w-full grow gap-4"
        layout
      >
        <AnimatePresence>
          <motion.div
            key="url-input-bar"
            layout
            className="flex justify-center items-center gap-2 "
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
            <Button
              isIconOnly
              aria-label="go"
              color={isReady ? "danger" : "secondary"}
              className="text-white h-14 w-14 rounded-full"
              onClick={handleUrlChange}
            >
              <div className="text-4xl">🐼</div>
            </Button>
          </motion.div>
          {isReady && (
            <motion.div
              key="chat-message-table"
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-[65vh]"
            >
              <div className="flex gap-2 pl-[4.5rem] items-center bg-[#18181b] rounded-tl-lg rounded-tr-lg py-2 relative">
                <div className="text-center w-[200px]">NAME</div>
                <div className="text-center w-full">MESSAGE</div>
              </div>
              <Table
                aria-label="yt-chat-message-table"
                selectedKeys={readByeBye}
                onSelectionChange={handleReadByeBye}
                selectionMode="multiple"
                color="success"
                classNames={{
                  base: "max-h-[100%] overflow-hidden",
                  table: "min-h-[25rem] -mt-12",
                  thead: "invisible",
                  wrapper: "rounded-br-none rounded-tr-none rounded-tl-none",
                }}
                isHeaderSticky
              >
                <TableHeader aria-label="header" columns={columns}>
                  {(column) => (
                    <TableColumn aria-label="column" key={column.key} width={column.width}>
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={rows}>
                  {(item) => (
                    <TableRow aria-label="row" key={item.key}>
                      {(columnKey) => (
                        <TableCell aria-label="cell">{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
