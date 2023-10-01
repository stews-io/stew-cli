import { Fragment } from "../../../../stew-library/deps/preact/mod.ts";
import {
  useLayoutEffect,
  useRef,
} from "../../../../stew-library/deps/preact/hooks.ts";
import { LinkButton } from "../../../../stew-library/components/mod.ts";
import { BuildSegmentItem } from "../../../../stew-library/config/mod.ts";
import { throwInvalidPathError } from "../../../../stew-library/utilities/mod.ts";
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
      <style key={stewSegmentState.segmentKey}>
        {stewSegmentState.segmentCss}
      </style>
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
        displayViewPageIndex={stewSegmentState.viewPageIndex + 1}
        displayViewPagesCount={viewPagesCount}
        previousViewPageButtonEnabled={stewSegmentState.viewPageIndex > 0}
        onSelectPreviousViewPage={() => {
          gotoPreviousViewPage();
        }}
        nextViewPageButtonEnabled={
          stewSegmentState.viewPageIndex < viewPagesCount - 1
        }
        onSelectNextViewPage={() => {
          gotoNextViewPage();
        }}
      />
      <SegmentContentFooter />
    </Fragment>
  );
}

export interface EmptyViewSegmentContentProps {}

export function EmptyViewSegmentContent(props: EmptyViewSegmentContentProps) {
  return (
    <Fragment>
      <SegmentMessage segmentMessage={"no items match"} />
      <ViewPageNavigation
        displayViewPageIndex={1}
        displayViewPagesCount={1}
        previousViewPageButtonEnabled={false}
        nextViewPageButtonEnabled={false}
        onSelectPreviousViewPage={() => {
          throwInvalidPathError(
            "EmptyViewSegmentContent.onSelectPreviousViewPage"
          );
        }}
        onSelectNextViewPage={() => {
          throwInvalidPathError("EmptyViewSegmentContent.onSelectNextViewPage");
        }}
      />
      <SegmentContentFooter />
    </Fragment>
  );
}

export interface LoadingSegmentContentProps {}

export function LoadingSegmentContent(props: LoadingSegmentContentProps) {
  return <SegmentMessage segmentMessage={"loading..."} />;
}

export interface ErrorLoadingSegmentContentProps {}

export function ErrorLoadingSegmentContent(
  props: ErrorLoadingSegmentContentProps
) {
  return (
    <Fragment>
      <SegmentMessage segmentMessage={"oops, something happened!!!"} />
      <SegmentContentFooter />
    </Fragment>
  );
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

interface SegmentContentFooterProps {}

function SegmentContentFooter(props: SegmentContentFooterProps) {
  const {} = props;
  return (
    <div className={cssModule.contentFooterContainer}>
      <div className={cssModule.contentFooter}>
        <LinkButton
          className={cssModule.footerLinkButton}
          ariaLabel={"go to the stews.io landing page"}
          ariaDescription={
            "a button that opens a new tab and navigates to stews.io"
          }
          href={"https://www.stews.io"}
          target={"_blank"}
        >
          stews.io
        </LinkButton>
      </div>
    </div>
  );
}
