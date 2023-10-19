import {
  ClientHtml,
  ClientHtmlProps,
} from "../../stew-library/components/mod.ts";

export interface AssistantHtmlProps
  extends Pick<ClientHtmlProps, "buildId" | "splashPageCss"> {}

export function AssistantHtml(props: AssistantHtmlProps) {
  const { buildId, splashPageCss } = props;
  return (
    <ClientHtml
      buildId={buildId}
      splashPageCss={splashPageCss}
      htmlTitle={"stew-assistant"}
      htmlDescription={"a helper for curating datasets"}
    />
  );
}
