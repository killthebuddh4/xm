import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { deleteGroup } from "./deleteGroup.js";

export const route = createRoute({
  createContext: ({ client, message, request }) => ({
    client,
    message,
    request,
  }),
  method: "deleteChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return deleteGroup({
      owner: { address: context.client.address },
      group: { address: input.group.address },
      copilotAddress: context.client.address,
    });
  },
});
