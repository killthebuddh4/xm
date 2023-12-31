import { Store } from "./Store.js";
import { Client } from "@xmtp/xmtp-js";

export const startStream = async ({
  store,
  client,
}: {
  store: Store;
  client: Client;
}) => {
  const existingStream = store.get(client.address);
  if (existingStream !== undefined) {
    return existingStream.stream;
  }

  const stream = await client.conversations.streamAllMessages();

  store.set(client.address, { startedAt: Date.now(), stream });

  return stream;
};
