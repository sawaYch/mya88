# Sayonara-mya

![Alt text](./docs/preview.png)

## Problem Statement

[HKVtuber MYA](https://www.youtube.com/@mya.) spends a lot of time saying 'bye bye' to the audience before the live stream ending because some members of the audience say it multiple times, or mixed with different unrelated message. As a result, MYA finds it difficult to differentiate 'bye bye' messages from distinct users. Can you help MYA write a program to solve this issue?

## Usage

This webapp is a youtube live chat viewer powered by NextJS.

1. Input the passphrase to authenticate.
2. Input the live stream URL, for example `https://www.youtube.com/watch?v=92VgDXjI4Xg`.
3. List of youtube chat messages should show and update periodically.
4. Mouse click on the list item, the user message will be marked as "Read" (Green color). The future incoming message of that user will also marked as "Read" automatically. So user just need to click the list item -> focus and read those un-ticked list item.

### Notices

🗝️ Secret Code Protection: only designated individuals can use this application.  
✅ Filtering on chat message by superchat / member gift types.  
👁️ Distinguish different author role and types of message.  
✨ This webapp can **ONLY** retrieve the chat message published from **current moment**.  
✨ This webapp consume Youtube Data API v3, which has daily quota limit (Don't worry, it's free).

## Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
