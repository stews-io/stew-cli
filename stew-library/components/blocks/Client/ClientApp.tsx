import "./globalReset.scss";
import { ComponentChildren, Fragment } from "../../../deps/preact/mod.ts";

export interface ClientAppProps {
  appCss: string;
  children: ComponentChildren;
}

export function ClientApp(props: ClientAppProps) {
  const { appCss, children } = props;
  return (
    <Fragment>
      <style>{appCss}</style>
      {children}
    </Fragment>
  );
}
