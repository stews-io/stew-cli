import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { SplashPage } from "./SplashPage.tsx";

export interface InitialStewHtmlProps {
  stewBuildConfig: BuildStewConfig;
  splashPageBundleCss: string;
}

export function InitialStewHtml(props: InitialStewHtmlProps) {
  const { stewBuildConfig, splashPageBundleCss } = props;
  return (
    <html lang={"en"}>
      <head></head>
      <body>
        <style id={"splashPageStyle"}>{splashPageBundleCss}</style>
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
