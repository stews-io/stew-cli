// @deno-types="CssModule"
import cssModule from "./SegmentContent.module.scss";

export interface ViewSegmentContentProps {}

export function ViewSegmentContent(props: ViewSegmentContentProps) {
  return <div>todo</div>;
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
