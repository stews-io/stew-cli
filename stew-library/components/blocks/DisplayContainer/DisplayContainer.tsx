import { ComponentChildren } from "stew/deps/preact/mod.ts";
// @deno-types="CssModule"
import cssModule from "./DisplayContainer.module.scss";

export interface DisplayContainerProps {
  children: ComponentChildren;
}

export function DisplayContainer(props: DisplayContainerProps) {
  const { children } = props;
  return <div className={cssModule.displayContainer}>{children}</div>;
}
