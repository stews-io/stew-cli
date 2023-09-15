import { Bax } from "./Bax.tsx";
// @deno-types="CssModule"
import cssModule from "./SplashPage.module.css";

export interface SplashPageProps {}

export function SplashPage(props: SplashPageProps) {
  return (
    <div className={cssModule.splash_page}>
      loading...
      <Bax />
    </div>
  );
}
