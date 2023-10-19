import { throwInvalidPathError } from "../../../../stew-library/utilities/throwInvalidPathError.ts";
import {
  FunctionComponent,
  createElement,
  render as renderElement,
} from "../../../deps/preact/mod.ts";

export interface LoadClientAppApi<AppProps extends Record<string, any>> {
  appGlobals: Record<string, unknown>;
  App: FunctionComponent<AppProps>;
  fetchAppProps: () => Promise<AppProps>;
}

export async function loadClientApp<AppProps extends Record<string, any>>(
  api: LoadClientAppApi<AppProps>
) {
  const { appGlobals, fetchAppProps, App } = api;
  Object.assign(globalThis, {
    h: createElement,
    ...appGlobals,
  });
  const someAppProps: AppProps = await fetchAppProps();
  renderElement(
    createElement(App, someAppProps),
    document.getElementById("appContainer") ??
      throwInvalidPathError("hydrate.appContainer")
  );
  document.getElementById("splashPageStyle")?.remove();
}
