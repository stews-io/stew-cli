import { Zod } from "../../stew-library/deps/zod/mod.ts";

export interface QueryGptDataApi<GptMessageData> {
  numberOfResults: number;
  maxTokens: number;
  topProbability: number;
  temperature: number;
  systemPrompt: string;
  userQuery: string;
  dataItemSchema: Zod.ZodType<GptMessageData>;
}

export async function queryGptData<GptMessageData>(
  api: QueryGptDataApi<GptMessageData>
): Promise<Array<GptMessageData>> {
  const {
    maxTokens,
    temperature,
    topProbability,
    numberOfResults,
    systemPrompt,
    userQuery,
    dataItemSchema,
  } = api;
  const postChatCompletionResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topProbability,
        n: numberOfResults,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      }),
    }
  );
  const unvalidatedChatCompletionJson: unknown =
    await postChatCompletionResponse.json();
  try {
    const successChatCompletionJson = SuccessChatCompletionJsonSchema().parse(
      unvalidatedChatCompletionJson
    );
    return successChatCompletionJson.choices.reduce<Array<GptMessageData>>(
      (gptDataResult, someCompletionChoice) => {
        const unvalidatedGptMessageData: unknown = JSON.parse(
          someCompletionChoice.message.content
        );
        const gptMessageData = dataItemSchema.parse(unvalidatedGptMessageData);
        gptDataResult.push(gptMessageData);
        return gptDataResult;
      },
      []
    );
  } catch {
    const errorChatCompletionJson = ErrorChatCompletionJsonSchema().parse(
      unvalidatedChatCompletionJson
    );
    throw errorChatCompletionJson.error;
  }
}

interface SuccessChatCompletionJson {
  choices: Array<{
    finish_reason: "stop" | "length" | "content_filter";
    message: {
      role: "assistant";
      content: string;
    };
  }>;
}

function SuccessChatCompletionJsonSchema(): Zod.ZodType<SuccessChatCompletionJson> {
  return Zod.object({
    choices: Zod.array(
      Zod.object({
        finish_reason: Zod.union([
          Zod.literal("stop"),
          Zod.literal("length"),
          Zod.literal("content_filter"),
        ]),
        message: Zod.object({
          role: Zod.literal("assistant"),
          content: Zod.string(),
        }),
      })
    ),
  });
}

interface ErrorChatCompletionJson {
  error: Record<string, unknown>;
}

function ErrorChatCompletionJsonSchema(): Zod.ZodType<ErrorChatCompletionJson> {
  return Zod.object({
    error: Zod.record(Zod.unknown()),
  });
}
