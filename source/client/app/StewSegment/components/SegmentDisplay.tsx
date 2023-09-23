import { JSX } from "../../../../../shared/deps/preact/mod.ts";
import { Page } from "../../components/Page/Page.tsx";
import { StewSegmentProps } from "../StewSegment.tsx";
import { UseStewSegmentResult } from "../hooks/useStewSegment.ts";
import { useStickyPageHeaderWorkaround } from "../hooks/useStickyPageHeaderWorkaround.ts";
import { SegmentViewSelect } from "./SegmentViewSelect.tsx";
import { StewInfoBopper } from "./StewInfoBopper.tsx";
import { ViewSearchInput } from "./ViewSearchInput.tsx";
import { ViewSortSelect } from "./ViewSortSelect.tsx";
// @deno-types="CssModule"
import cssModule from "./SegmentDisplay.module.scss";

export interface SegmentDisplayProps<
  DisplayExtensionProps extends JSX.IntrinsicAttributes
> extends SegmentDisplayCoreDataProps,
    SegmentDisplayConfigProps<DisplayExtensionProps> {}

export interface SegmentDisplayCoreDataProps
  extends Pick<StewSegmentProps, "stewConfig">,
    Pick<UseStewSegmentResult, "stewSegmentState">,
    Pick<
      UseStewSegmentResult["stewSegmentMutations"],
      | "selectStewSegment"
      | "selectSegmentView"
      | "selectSegmentSortOption"
      | "updateSegmentViewSearch"
      | "clearSegmentViewSearch"
    > {}

export interface SegmentDisplayConfigProps<
  SegmentContentProps extends JSX.IntrinsicAttributes
> {
  segmentContentProps: SegmentContentProps;
  SegmentContent: (props: SegmentContentProps) => JSX.Element;
}

export function SegmentDisplay<
  DisplayContentProps extends JSX.IntrinsicAttributes
>(props: SegmentDisplayProps<DisplayContentProps>) {
  const {
    stewConfig,
    stewSegmentState,
    selectSegmentView,
    selectStewSegment,
    selectSegmentSortOption,
    updateSegmentViewSearch,
    clearSegmentViewSearch,
    SegmentContent,
    segmentContentProps,
  } = props;
  const { pageHeaderContainerRef } = useStickyPageHeaderWorkaround({
    stickyPageHeaderWorkaroundClassname: cssModule.stickyPageHeaderWorkaround,
  });
  return (
    <Page
      pageAriaHeader={`${stewConfig.stewInfo.stewName}: ${
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel
      } segment`}
    >
      <div
        ref={pageHeaderContainerRef}
        className={cssModule.pageHeaderContainer}
      >
        <div className={cssModule.pageHeader}>
          <div className={cssModule.viewSelectContainer}>
            <SegmentViewSelect
              stewConfig={stewConfig}
              stewSegmentState={stewSegmentState}
              selectSegmentView={selectSegmentView}
            />
          </div>
          <div className={cssModule.infoBopperContainer}>
            <StewInfoBopper
              stewConfig={stewConfig}
              stewSegmentState={stewSegmentState}
              selectStewSegment={selectStewSegment}
            />
          </div>
        </div>
      </div>
      <div className={cssModule.viewHeaderContainer}>
        <div className={cssModule.viewSortSelectContainer}>
          <ViewSortSelect
            stewConfig={stewConfig}
            stewSegmentState={stewSegmentState}
            selectSegmentSortOption={selectSegmentSortOption}
          />
        </div>
        <div className={cssModule.viewSearchInputContainer}>
          <ViewSearchInput
            stewConfig={stewConfig}
            stewSegmentState={stewSegmentState}
            updateSegmentViewSearch={updateSegmentViewSearch}
            clearSegmentViewSearch={clearSegmentViewSearch}
          />
        </div>
      </div>
      <SegmentContent {...segmentContentProps} />
    </Page>
  );
}
