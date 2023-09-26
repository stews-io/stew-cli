import { Zod } from "../deps/zod/mod.ts";

export type SegmentDataset<SomeSegmentItem extends SegmentItem> =
  Array<SomeSegmentItem>;

export function SegmentDatasetSchema() {
  return Zod.array(SourceSegmentItemSchema());
}

export interface SegmentItem {
  itemId: number;
}

interface SourceSegmentItem extends SegmentItem, JsonObject {}

export interface BuildSegmentItem extends SegmentItem {
  __segment_item_search_space: string;
}

export function SourceSegmentItemSchema() {
  return Zod.intersection(
    Zod.object({
      itemId: Zod.number(),
    }),
    Zod.record(JsonSchema())
  );
}

interface JsonObject {
  [key: string]: Json;
}

// https://zod.dev/?id=json-type
type Json = JsonLiteral | { [key: string]: Json } | Json[];

type JsonLiteral = string | number | boolean | null;

function JsonSchema() {
  const literalSchema = Zod.union([
    Zod.string(),
    Zod.number(),
    Zod.boolean(),
    Zod.null(),
  ]);
  const jsonSchema: Zod.ZodType<Json> = Zod.lazy(() =>
    Zod.union([literalSchema, Zod.array(jsonSchema), Zod.record(jsonSchema)])
  );
  return jsonSchema;
}
