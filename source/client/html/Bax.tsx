// @deno-types="CssModule"
import cssModule from "./Bax.module.css";

export interface BaxProps {}

export function Bax(props: BaxProps) {
  return <div className={cssModule.bax}>bax</div>;
}
