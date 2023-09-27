import "../styles/globalReset.scss";
import { Fragment } from "../../stew-library/deps/preact/mod.ts";
import { BuildStewConfig } from "../../stew-library/config/mod.ts";
import { StewResourceMap } from "../../stew-library/internal/mod.ts";
import { StewSegment } from "./StewSegment/StewSegment.tsx";
import { StewSegmentState } from "./StewSegment/types/StewSegmentState.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  stewAppCss: string;
  initialSegmentViewState: StewSegmentState;
}

export function StewApp(props: StewAppProps) {
  const { stewAppCss, stewConfig, stewResourceMap, initialSegmentViewState } =
    props;
  return (
    <Fragment>
      <style>{stewAppCss}</style>
      <StewSegment
        stewConfig={stewConfig}
        stewResourceMap={stewResourceMap}
        initialSegmentViewState={initialSegmentViewState}
      />
    </Fragment>
  );
}
