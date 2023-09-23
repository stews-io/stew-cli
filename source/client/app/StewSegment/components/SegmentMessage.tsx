// @deno-types="CssModule"
import cssModule from "./SegmentMessage.module.scss";

export interface SegmentMessageProps {
  segmentMessage: string;
}

export function SegmentMessage(props: SegmentMessageProps) {
  const { segmentMessage } = props;
  return (
    <div className={cssModule.messageContainer}>
      <div className={cssModule.messageText}>{segmentMessage}</div>
    </div>
  );
}
