import "./globalReset.scss";
import { SplashPage } from "./SplashPage.tsx";

export interface ClientHtmlProps {
  buildId: string;
  htmlTitle: string;
  htmlDescription: string;
  splashPageCss: string;
}

export function ClientHtml(props: ClientHtmlProps) {
  const { buildId, htmlTitle, htmlDescription, splashPageCss } = props;
  return (
    <html lang={"en"} data-build_id={buildId}>
      <head>
        <title>{htmlTitle}</title>
        <meta name={"description"} content={htmlDescription} />
        <meta charSet={"utf-8"} />
        <meta
          name={"viewport"}
          content={"width=device-width,initial-scale=1"}
        />
        <meta name={"mobile-web-app-capable"} content={"yes"} />
        <meta name={"apple-mobile-web-app-capable"} content={"yes"} />
        <link rel={"apple-touch-icon"} href={"/assets/icon-512x512.png"} />
        <link rel={"icon"} href={"/favicon.ico"} sizes={"any"} />
        <link rel={"icon"} href={"/favicon.svg"} type={"image/svg+xml"} />
        <link rel={"manifest"} href={"/manifest.json"} />
      </head>
      <body>
        <style id={"splashPageStyle"}>{splashPageCss}</style>
        <div id={"appContainer"}>
          <SplashPage />
        </div>
        <script src={`/app.${buildId}.js`} />
      </body>
    </html>
  );
}
