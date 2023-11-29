import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("inviteMemberToChannel"),
  arguments: z.object({
    memberAddress: z.string(),
    channelAddress: z.string(),
  }),
});