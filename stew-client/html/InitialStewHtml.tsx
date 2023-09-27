import "../styles/globalReset.scss";
import { BuildStewConfig } from "stew-library/config";
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
        <title>{stewBuildConfig.stewInfo.stewName}</title>
        <meta
          name={"description"}
          content={`${stewBuildConfig.stewInfo.stewName}: ${stewBuildConfig.stewInfo.stewMessage}`}
        />
        <meta charSet={"utf-8"} />
        <meta
          name={"viewport"}
          content={"width=device-width,initial-scale=1"}
        />
        <meta name={"mobile-web-app-capable"} content={"yes"} />
        <meta name={"apple-mobile-web-app-capable"} content={"yes"} />
        <link rel="apple-touch-icon" href="/assets/icon-512x512.png" />
        <link rel={"icon"} href={"/favicon.ico"} sizes={"any"} />
        <link rel={"icon"} href={"/favicon.svg"} type={"image/svg+xml"} />
        <link rel={"manifest"} href={"/manifest.json"} />
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
