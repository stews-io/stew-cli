// @deno-types="../declaration.d.ts"
import cssModule from "./SplashPage.module.css";

export interface SplashPageProps {}

export function SplashPage(props: SplashPageProps) {
  return <div className={cssModule.foo}>loading...</div>;
}
