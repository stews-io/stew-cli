import { BuildStewConfig } from "../stew-library/config/mod.ts";
import { ClientHtml, ClientHtmlProps } from "../stew-library/components/mod.ts";

export interface StewHtmlProps extends Pick<ClientHtmlProps, "splashPageCss"> {
  stewBuildConfig: BuildStewConfig;
}

export function StewHtml(props: StewHtmlProps) {
  const { splashPageCss, stewBuildConfig } = props;
  return (
    <ClientHtml
      splashPageCss={splashPageCss}
      clientVersionId={stewBuildConfig.stewBuildId}
      htmlTitle={stewBuildConfig.stewInfo.stewName}
      htmlDescription={`${stewBuildConfig.stewInfo.stewName}: ${stewBuildConfig.stewInfo.stewMessage}`}
    />
  );
}
