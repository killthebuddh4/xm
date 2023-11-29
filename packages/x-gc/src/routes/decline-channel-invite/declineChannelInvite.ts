import { User } from "../../db/User.js";
import { updateChannelDeclineInvitation } from "../../db/store/updateChannelDeclineInvitation.js";

export const declineChannelInvite = async ({
  userDoingTheDeclining,
  channelAddress,
}: {
  userDoingTheDeclining: User;
  channelAddress: string;
}) => {
  updateChannelDeclineInvitation({
    userDoingTheDeclining,
    channelAddress,
  });

  return {
    ok: true,
    result: {
      declinedInviteToChannelAddress: channelAddress,
    },
  } as const;
};