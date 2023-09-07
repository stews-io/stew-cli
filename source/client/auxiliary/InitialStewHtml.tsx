import { BuildStewConfig } from "../../shared/data/StewConfig.ts";

export interface InitialStewHtmlProps {
  stewBuildConfig: BuildStewConfig;
}

export function InitialStewHtml(props: InitialStewHtmlProps) {
  const { stewBuildConfig } = props;
  return (
    <html lang={"en"}>
      <head></head>
      <body></body>
    </html>
  );
}
