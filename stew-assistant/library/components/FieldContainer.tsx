import { ComponentChildren } from "../../../stew-library/deps/preact/mod.ts";
// @deno-types="CssModule"
import cssModule from "./FieldContainer.module.scss";

export interface FieldContainerProps {
  children: ComponentChildren;
}

export function FieldContainer(props: FieldContainerProps) {
  const { children } = props;
  return <div className={cssModule.fieldContainer}>{children}</div>;
}
