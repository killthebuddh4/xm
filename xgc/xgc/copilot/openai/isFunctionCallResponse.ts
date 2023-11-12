import { signatureSchema } from "../functions/signatureSchema.js";

type MaybeFunctionCallResponse = {
  choices: Array<{
    message: {
      content: string | null | undefined;
      function_call?: unknown;
    };
  }>;
};

export const isFunctionCallResponse = ({
  response,
}: {
  response: MaybeFunctionCallResponse;
}) => {
  return signatureSchema.safeParse(response.choices[0].message.function_call)
    .success;
};