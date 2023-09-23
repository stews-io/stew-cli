import { Fragment } from "stewcli_preact/jsx-runtime";
import { BuildSegmentItem } from "../../../../../mod.ts";
import {
  useLayoutEffect,
  useRef,
} from "../../../../../shared/deps/preact/hooks.ts";
import { throwInvalidPathError } from "../../../../../shared/general/throwInvalidPathError.ts";
import { StewSegmentMutations } from "../hooks/useStewSegment.ts";
import { SegmentLoadedStewState } from "../types/StewSegmentState.ts";
import { ViewPageNavigation } from "./ViewPageNavigation.tsx";
// @deno-types="CssModule"
import cssModule from "./SegmentContent.module.scss";

export interface ViewPageSegmentContentProps
  extends Pick<
    StewSegmentMutations,
    "gotoPreviousViewPage" | "gotoNextViewPage"
  > {
  stewSegmentState: SegmentLoadedStewState;
  viewPagesCount: number;
  viewPageItems: Array<BuildSegmentItem>;
}

export function ViewPageSegmentContent(props: ViewPageSegmentContentProps) {
  const {
    stewSegmentState,
    viewPageItems,
    viewPagesCount,
    gotoPreviousViewPage,
    gotoNextViewPage,
  } = props;
  const pageTopElementRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const pageContentContainerElement = document.getElementById(
      "pageContentContainer"
    );
    const pageTopElement = pageTopElementRef.current;
    if (document.activeElement instanceof HTMLInputElement) {
      // noop
    } else if (
      stewSegmentState.viewPageIndex === 0 &&
      pageContentContainerElement instanceof HTMLDivElement
    ) {
      pageContentContainerElement.setAttribute("tabIndex", "-1");
      pageContentContainerElement.focus({
        preventScroll: true,
      });
      pageContentContainerElement.removeAttribute("tabIndex");
      window.scrollTo({
        behavior: "auto",
        top: 0,
      });
    } else if (
      stewSegmentState.viewPageIndex > 0 &&
      pageTopElement instanceof HTMLDivElement
    ) {
      pageTopElement.setAttribute("tabIndex", "-1");
      pageTopElement.focus({
        preventScroll: true,
      });
      pageTopElement.removeAttribute("tabIndex");
      const approximateViewHeaderDocumentBottomPlusSome = 88;
      window.scrollTo({
        behavior: "auto",
        top: approximateViewHeaderDocumentBottomPlusSome,
      });
    } else {
      throwInvalidPathError("ViewPageSegmentContent");
    }
  }, [stewSegmentState.segmentViewKey, stewSegmentState.viewPageIndex]);
  return (
    <Fragment>
      <div className={cssModule.viewPageItemsContainer}>
        <div ref={pageTopElementRef} />
        {viewPageItems.map((someSegmentItem) => (
          <stewSegmentState.segmentModule.SegmentItemDisplay
            key={someSegmentItem.itemId}
            someSegmentItem={someSegmentItem}
          />
        ))}
      </div>
      <ViewPageNavigation
        stewSegmentState={stewSegmentState}
        viewPageItems={viewPageItems}
        viewPagesCount={viewPagesCount}
        gotoPreviousViewPage={gotoPreviousViewPage}
        gotoNextViewPage={gotoNextViewPage}
      />
    </Fragment>
  );
}

export interface EmptyViewSegmentContentProps {}

export function EmptyViewSegmentContent(props: EmptyViewSegmentContentProps) {
  return <SegmentMessage segmentMessage={"no items match"} />;
}

export interface LoadingSegmentContentProps {}

export function LoadingSegmentContent(props: LoadingSegmentContentProps) {
  return <SegmentMessage segmentMessage={"loading..."} />;
}

export interface ErrorLoadingSegmentContentProps {}

export function ErrorLoadingSegmentContent(
  props: ErrorLoadingSegmentContentProps
) {
  return <SegmentMessage segmentMessage={"oops, something happened!!!"} />;
}

interface SegmentMessageProps {
  segmentMessage: string;
}

function SegmentMessage(props: SegmentMessageProps) {
  const { segmentMessage } = props;
  return (
    <div className={cssModule.messageContainer}>
      <div className={cssModule.messageText}>{segmentMessage}</div>
    </div>
  );
}
