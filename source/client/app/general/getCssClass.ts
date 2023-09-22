import { JSX } from "../../../../shared/deps/preact/mod.ts";

export type CssClass = Exclude<
  JSX.HTMLAttributes["className"],
  JSX.SignalLike<unknown>
>;

export function getCssClass(
  baseClass: CssClass,
  ...extensionClasses: Array<[CssClass, boolean]>
): Exclude<CssClass, undefined> {
  return `${baseClass}${extensionClasses.reduce(
    (result, someExtensionClass) =>
      `${result}${someExtensionClass[1] ? ` ${someExtensionClass[0]}` : ""}`,
    ""
  )}`;
}
