import { JSX } from "../../../../shared/deps/preact/mod.ts";

export type SimpleComponentProps<
  SomeComponent extends keyof JSX.IntrinsicElements,
  SomeJsxElement extends JSX.IntrinsicElements[SomeComponent] = JSX.IntrinsicElements[SomeComponent]
> = {
  [JsxKey in keyof SomeJsxElement]: Exclude<
    SomeJsxElement[JsxKey],
    JSX.SignalLike<unknown>
  >;
};
