import { JSX } from "../../../../shared/deps/preact/mod.ts";
import { useMemo } from "../../../../shared/deps/preact/hooks.ts";
import { StewAppProps } from "../StewApp.tsx";
import {
  SegmentDisplay,
  SegmentDisplayConfigProps,
} from "./components/SegmentDisplay.tsx";
import { useStewSegment } from "./hooks/useStewSegment.ts";
import { throwInvalidPathError } from "../../../../shared/general/throwInvalidPathError.ts";
import { SegmentMessage } from "./components/SegmentMessage.tsx";

export interface StewSegmentProps
  extends Pick<
    StewAppProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {}

export function StewSegment(props: StewSegmentProps) {
  const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
  const { stewSegmentState, stewSegmentMutations, stewSegmentData } =
    useStewSegment({
      stewConfig,
      stewResourceMap,
      initialSegmentViewState,
    });
  const segmentDisplayConfigProps = useMemo<
    SegmentDisplayConfigProps<JSX.IntrinsicAttributes>
  >(() => {
    if (
      stewSegmentState.segmentStatus === "segmentLoaded" &&
      stewSegmentData.viewPageItems.length === 0
    ) {
      return {
        SegmentContent: EmptyViewSegmentContent,
        segmentContentProps: {},
      };
    } else if (stewSegmentState.segmentStatus === "segmentLoaded") {
      return {
        SegmentContent: ViewSegmentContent,
        segmentContentProps: {},
      };
    } else if (stewSegmentState.segmentStatus === "loadingSegment") {
      return {
        SegmentContent: LoadingSegmentContent,
        segmentContentProps: {},
      };
    } else if (stewSegmentState.segmentStatus === "errorLoadingSegment") {
      return {
        SegmentContent: ErrorLoadingSegmentContent,
        segmentContentProps: {},
      };
    } else {
      throwInvalidPathError("segmentDisplayConfigProps");
    }
  }, [stewSegmentState, stewSegmentMutations, stewSegmentData]);
  return (
    <SegmentDisplay
      stewConfig={stewConfig}
      stewSegmentState={stewSegmentState}
      selectStewSegment={stewSegmentMutations.selectStewSegment}
      selectSegmentView={stewSegmentMutations.selectSegmentView}
      selectSegmentSortOption={stewSegmentMutations.selectSegmentSortOption}
      updateSegmentViewSearch={stewSegmentMutations.updateSegmentViewSearch}
      clearSegmentViewSearch={stewSegmentMutations.clearSegmentViewSearch}
      {...segmentDisplayConfigProps}
    />
  );
}

interface ViewSegmentContentProps {}

function ViewSegmentContent(props: ViewSegmentContentProps) {
  return <div>todo</div>;
}

interface EmptyViewSegmentContentProps {}

function EmptyViewSegmentContent(props: EmptyViewSegmentContentProps) {
  return <SegmentMessage segmentMessage={"no items match"} />;
}

interface LoadingSegmentContentProps {}

function LoadingSegmentContent(props: LoadingSegmentContentProps) {
  return <SegmentMessage segmentMessage={"loading..."} />;
}

interface ErrorLoadingSegmentContentProps {}

function ErrorLoadingSegmentContent(props: ErrorLoadingSegmentContentProps) {
  return <SegmentMessage segmentMessage={"oops, something happened!!!"} />;
}
