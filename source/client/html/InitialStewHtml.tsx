import "../shared/styles/globalReset.scss";
import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { SplashPage } from "./SplashPage.tsx";

export interface InitialStewHtmlProps {
  stewBuildConfig: BuildStewConfig;
  splashPageCss: string;
}

export function InitialStewHtml(props: InitialStewHtmlProps) {
  const { stewBuildConfig, splashPageCss } = props;
  return (
    <html lang={"en"}>
      <head>
        <meta
          name={"viewport"}
          content={"width=device-width,initial-scale=1"}
        />
        <meta name={"mobile-web-app-capable"} content={"yes"} />
        <meta name={"apple-mobile-web-app-capable"} content={"yes"} />
      </head>
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
