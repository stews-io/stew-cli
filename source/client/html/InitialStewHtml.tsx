import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { SplashPage } from "./SplashPage.tsx";
import "../shared/styles/global.css";

export interface InitialStewHtmlProps {
  stewBuildConfig: BuildStewConfig;
  splashPageCss: string;
}

export function InitialStewHtml(props: InitialStewHtmlProps) {
  const { stewBuildConfig, splashPageCss } = props;
  return (
    <html lang={"en"}>
      <head></head>
      <body>
        <style id={"splashPageStyle"}>{splashPageCss}</style>
        <div id={"appContainer"}>
          <SplashPage />
        </div>
        <script
          id={"appScript"}
          data-stew_build_id={stewBuildConfig.stewBuildId}
          src={`/app.${stewBuildConfig.stewBuildId}.js`}
        />
      </body>
    </html>
  );
}
