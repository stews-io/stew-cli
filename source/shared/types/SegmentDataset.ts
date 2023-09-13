import Zod from "deps/zod.ts";

export type SegmentDataset<SomeSegmentItem extends SegmentItem> =
  Array<SomeSegmentItem>;

// export function SegmentDatasetSchema<
//   SomeSegmentItem extends SegmentItem,
//   SomeSegmentItemSchema extends Zod.ZodType<SomeSegmentItem>
// >(
//   someSegmentItemSchema: SomeSegmentItemSchema
// ): Zod.ZodType<SegmentDataset<SomeSegmentItem>> {
//   return Zod.array(someSegmentItemSchema);
// }

export interface SegmentItem {
  itemId: number;
}

export function SegmentItemSchema() {
  return Zod.intersection(
    Zod.object({
      itemId: Zod.number(),
    }),
    Zod.record(JsonSchema())
  );
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
