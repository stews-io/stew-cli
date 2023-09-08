import { hydrate } from "npm/preact";
import { StewApp } from "./StewApp.tsx";
import { throwInvalidErrorPath } from "../../shared/general/throwInvalidPathError.ts";

hydrate(
  <StewApp />,
  document.getElementById("appContainer") ??
    throwInvalidErrorPath("hydrate.appContainer")
);
