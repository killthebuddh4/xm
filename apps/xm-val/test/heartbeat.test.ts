import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";

describe("heartbeat route", () => {
  it("should have a heartbeat", async function () {
    this.timeout(3000);

    const client = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    const rpcClient = createRpc({
      server: { address: await getTestServerAddress() },
      client,
      forRoute: createRoute({
        createContext: (i) => i,
        method: "heartbeat",
        inputSchema: z.unknown(),
        outputSchema: z.unknown(),
        handler: async () => undefined,
      }),
    });

    const response = await rpcClient({ input: null });

    console.log(response);
  });
});
