// note: @jsxImportSource pragma seems to be needed for compile to work
/** @jsxImportSource npm/preact */
import { BuildStewConfig } from "../../shared/types/StewConfig.ts";
import { SplashPage } from "./SplashPage.tsx";

export interface InitialStewHtmlProps {
  stewBuildConfig: BuildStewConfig;
}

export function InitialStewHtml(props: InitialStewHtmlProps) {
  const { stewBuildConfig } = props;
  return (
    <html lang={"en"}>
      <head></head>
      <body>
        <div id={"appContainer"}>
          <SplashPage />
        </div>
        <script src={`/app.${stewBuildConfig.stewBuildId}.js`} />
      </body>
    </html>
  );
}
