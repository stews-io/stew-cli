import { ComponentChildren } from "preact";
// @deno-types="CssModule"
import cssModule from "./Page.module.scss";

export interface PageProps {
  pageAriaHeader: string;
  children: ComponentChildren;
}

export function Page(props: PageProps) {
  const { pageAriaHeader, children } = props;
  return (
    <div className={cssModule.pageContainer}>
      <h1 style={{ display: "none" }}>{pageAriaHeader}</h1>
      <div
        id={"pageContentContainer"}
        role={"main"}
        className={cssModule.pageContentContainer}
      >
        {children}
      </div>
    </div>
  );
}
