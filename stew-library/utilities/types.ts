import { JSX } from "../../stew-library/deps/preact/mod.ts";
import { Zod } from "../deps/zod/mod.ts";

export type ArrayOfAtLeastOne<T> = [T, ...Array<T>];

export function ArrayOfOneSchema<SomeSchema extends Zod.ZodTypeAny>(
  someSchema: SomeSchema
) {
  return Zod.tuple([someSchema]).rest(someSchema);
}

export type SimpleComponentProps<
  SomeComponent extends keyof JSX.IntrinsicElements,
  SomeJsxElement extends JSX.IntrinsicElements[SomeComponent] = JSX.IntrinsicElements[SomeComponent]
> = {
  [JsxKey in keyof SomeJsxElement]: Exclude<
    SomeJsxElement[JsxKey],
    JSX.SignalLike<unknown>
  >;
};
