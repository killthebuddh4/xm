import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createStream } from "@killthebuddha/xm-rpc/api/createStream.js";
import { createRouter } from "@killthebuddha/xm-rpc/api/createRouter.js";
import { RpcRoute } from "@killthebuddha/xm-rpc/rpc/RpcRoute.js";
import { readConfig } from "xm-lib/config/readConfig.js";
import { env } from "./options/xmtp/env.js";
import { onAlreadyRunning } from "./options/onAlreadyRunning.js";
import { onStreamBefore } from "./options/onStreamBefore.js";
import { onStreamError } from "./options/onStreamError.js";
import { onStreamSuccess } from "./options/onStreamSuccess.js";
import { onUncaughtHandlerError } from "./options/onUncaughtHandlerError.js";
import { onSubscriberCalled } from "./options/onSubscriberCalled.js";
import { onMessageReceived } from "./options/onMessageReceived.js";
import { onNotStarted } from "./options/onNotStarted.js";
import { onJsonParseError } from "./options/rpc/onJsonParseError.js";
import { onRequestParseError } from "./options/rpc/onRequestParseError.js";
import { onMethodNotFound } from "./options/rpc/onMethodNotFound.js";
import { onInvalidParams } from "./options/rpc/onInvalidParams.js";
import { onServerError } from "./options/rpc/onServerError.js";
import { onHandlerError } from "./options/rpc/onHandlerError.js";
import { onMethodCalled } from "./options/rpc/onMethodCalled.js";
import { useConversationId } from "./options/useConversationId.js";
import { onResponse } from "./options/onResponse.js";
import { db } from "./lib/db.js";
import { create as createWriteRoute } from "./routes/write/create.js";
import { route as deleteRoute } from "./routes/delete/route.js";
import { route as publishRoute } from "./routes/publish/route.js";
import { route as subscribeRoute } from "./routes/subscribe/route.js";

const config = await readConfig({
  overridePath: process.env.XM_VAL_CONFIG_PATH,
});
const wallet = new Wallet(config.privateKey);
const client = await Client.create(wallet, { env });

const existingOwner = await db.user.findUnique({
  where: {
    address: process.env.XGC_VAL_OWNER_ADDRESS,
  },
});

if (existingOwner === null) {
  await db.user.create({
    data: {
      address: process.env.XGC_VAL_OWNER_ADDRESS as string,
    },
  });
}

/* TODO stash/recover API. This api is extremely simple except for it wraps the
 * written value in an encrypted envelope. It uses a secondary XMTP identity to
 * encrypt and decrypt the value. */

const routes = new Map<string, RpcRoute<any, any>>([
  ["write", createWriteRoute({ client })],
  ["delete", deleteRoute],
  ["publish", publishRoute],
  ["subscribe", subscribeRoute],
]);

const valServer = createRouter({
  client,
  routeStore: routes,
  withOptions: {
    onJsonParseError,
    onRequestParseError,
    onMethodNotFound,
    onInvalidParams,
    onServerError,
    onHandlerError,
    onMethodCalled,
    useConversationId,
    onResponse,
  },
});

const stream = await createStream({
  client,
  options: {
    onAlreadyRunning,
    onStream: {
      before: onStreamBefore,
      success: onStreamSuccess,
      error: onStreamError,
    },
    onUncaughtHandlerError,
    onSubscriberCalled,
    onMessageReceived,
    onNotStarted,
  },
});

for await (const message of stream.select({ selector: async () => true })) {
  valServer({ message });
}