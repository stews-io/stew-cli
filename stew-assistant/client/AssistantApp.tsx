import {
  ClientApp,
  ClientAppProps,
} from "../../stew-library/components/mod.ts";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss } = props;
  return (
    <ClientApp appCss={appCss}>
      <div>todo</div>
    </ClientApp>
  );
}
