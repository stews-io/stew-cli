import { createElement, render as renderElement } from "preact";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import { AssistantApp } from "./AssistantApp.tsx";

Object.assign(globalThis, {
  h: createElement,
});
loadClientApp();

async function loadClientApp() {
  const appCss = await fetch("/app.css").then((getAppCssResponse) =>
    getAppCssResponse.text()
  );
  renderElement(
    createElement(AssistantApp, {
      appCss,
    }),
    document.getElementById("appContainer") ??
      throwInvalidPathError("preactRender.appContainer")
  );
}
