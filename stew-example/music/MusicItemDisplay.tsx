import { SegmentItemDisplayProps } from "stew/config/mod.ts";
import { ThumbnailLinksDisplay } from "stew/components/mod.ts";
import { MusicItem } from "./MusicItem.ts";

export interface MusicItemDisplayProps
  extends SegmentItemDisplayProps<MusicItem> {}

export function MusicItemDisplay(props: MusicItemDisplayProps) {
  const { someSegmentItem } = props;
  return (
    <ThumbnailLinksDisplay
      itemTitle={someSegmentItem.musicTitle}
      itemThumbnailHref={someSegmentItem.musicThumbnailHref}
      itemLinks={someSegmentItem.externalLinks.map((someMusicLink) => ({
        ...someMusicLink,
        ariaLabel: `listen on ${someMusicLink.linkLabel}`,
        ariaDescription: `a button that navigates in a new tab to ${someSegmentItem.musicTitle} by ${someSegmentItem.musicArtist[0]} on ${someMusicLink.linkLabel}`,
      }))}
      itemLabelLists={[
        {
          accessibilityLabel: "music title",
          listLabels: [someSegmentItem.musicTitle],
        },
        {
          accessibilityLabel: "music artist",
          listLabels: someSegmentItem.musicArtist,
        },
        {
          accessibilityLabel: "music context",
          listLabels: [
            `${
              someSegmentItem.musicYear
            } ${someSegmentItem.recordingContext.join("/")} ${
              someSegmentItem.sourceType === "collection"
                ? someSegmentItem.collectionType
                : someSegmentItem.sourceType
            }`,
          ],
        },
        {
          accessibilityLabel: "music styles",
          listLabels: someSegmentItem.musicTags,
        },
      ]}
    />
  );
}
