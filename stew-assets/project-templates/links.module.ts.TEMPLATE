import { SegmentModule } from "stew/config/mod.ts";
import { LinkItem } from "./LinkItem.ts";
import { LinkItemDisplay } from "./LinkItemDisplay.tsx";

export default getLinksModule();

function getLinksModule(): SegmentModule<LinkItem> {
  return {
    SegmentItemDisplay: LinkItemDisplay,
    segmentSortOptions: [
      {
        sortOptionKey: "linkTitleAsc",
        sortOptionLabel: "title: a → z",
        getSortOrder: (linkItemA, linkItemB) =>
          linkItemA.linkTitle.localeCompare(linkItemB.linkTitle),
      },
      {
        sortOptionKey: "linkTitleDesc",
        sortOptionLabel: "title: z → a",
        getSortOrder: (linkItemA, linkItemB) =>
          linkItemB.linkTitle.localeCompare(linkItemA.linkTitle),
      },
      {
        sortOptionKey: "linkAuthorAsc",
        sortOptionLabel: "author: a → z",
        getSortOrder: (linkItemA, linkItemB) =>
          linkItemA.linkAuthor[0].localeCompare(linkItemB.linkAuthor[0]),
      },
      {
        sortOptionKey: "linkAuthorDesc",
        sortOptionLabel: "author: z → a",
        getSortOrder: (linkItemA, linkItemB) =>
          linkItemB.linkAuthor[0].localeCompare(linkItemA.linkAuthor[0]),
      },
    ],
    getSegmentItemSearchString: (someLinkItem: LinkItem) =>
      `${someLinkItem.linkTitle},${someLinkItem.linkAuthor.join(
        ","
      )},${someLinkItem.linkTags.join(",")},${
        new URL(someLinkItem.linkHref).hostname
      }`,
  };
}
