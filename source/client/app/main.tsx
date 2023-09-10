import { hydrate, h } from "npm/preact";
import { StewApp } from "./StewApp.tsx";
import { throwInvalidErrorPath } from "../../shared/general/throwInvalidPathError.ts";

(window as unknown as any).h = h;
hydrate(
  <StewApp />,
  document.getElementById("appContainer") ??
    throwInvalidErrorPath("hydrate.appContainer")
);
