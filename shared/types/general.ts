import { Zod } from "../deps/zod/mod.ts";

export type ArrayOfAtLeastOne<T> = [T, ...Array<T>];

export function ArrayOfOneSchema<SomeSchema extends Zod.ZodTypeAny>(
  someSchema: SomeSchema
) {
  return Zod.tuple([someSchema]).rest(someSchema);
}
