import { throwInvalidPathError } from "../../../../stew-library/utilities/throwInvalidPathError.ts";
import {
  FunctionComponent,
  createElement,
  render as renderElement,
} from "../../../deps/preact/mod.ts";

export interface LoadClientAppApi<AppProps extends Record<string, any>> {
  appGlobals: Record<string, unknown>;
  clientApp: FunctionComponent<AppProps>;
  fetchClientAppProps: () => Promise<AppProps>;
}

export async function loadClientApp<AppProps extends Record<string, any>>(
  api: LoadClientAppApi<AppProps>
) {
  const { appGlobals, fetchClientAppProps, clientApp } = api;
  Object.assign(globalThis, {
    h: createElement,
    ...appGlobals,
  });
  const clientAppProps: AppProps = await fetchClientAppProps();
  renderElement(
    createElement(clientApp, clientAppProps),
    document.getElementById("appContainer") ??
      throwInvalidPathError("loadClientApp.appContainer")
  );
  document.getElementById("splashPageStyle")?.remove();
}
