import { BuildStewConfig } from "../../stew-library/config/mod.ts";
import { StewResourceMap } from "../../stew-library/internal/mod.ts";
import { StewSegment } from "./StewSegment/StewSegment.tsx";
import { StewSegmentState } from "./StewSegment/types/StewSegmentState.ts";
import { ClientApp, ClientAppProps } from "stew/components/mod.ts";

export interface StewAppProps {
  stewAppCss: ClientAppProps["appCss"];
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialSegmentViewState: StewSegmentState;
}

export function StewApp(props: StewAppProps) {
  const { stewAppCss, stewConfig, stewResourceMap, initialSegmentViewState } =
    props;
  return (
    <ClientApp appCss={stewAppCss}>
      <StewSegment
        stewConfig={stewConfig}
        stewResourceMap={stewResourceMap}
        initialSegmentViewState={initialSegmentViewState}
      />
    </ClientApp>
  );
}
