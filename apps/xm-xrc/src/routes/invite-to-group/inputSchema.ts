import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("inviteToGroup"),
  arguments: z.object({
    memberAddress: z.string(),
    groupAddress: z.string(),
  }),
});
