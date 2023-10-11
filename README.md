# stews.io/toolkit

> **power tools for publishing quality curations to the web**

## get inspired

### [clumsycomputer](https://www.clumsycomputer.stews.io) _(personal stew)_

an assortment of great music, awesome spots, and sweet sweet links

### [pl-archive](https://www.prettylights.stews.io) _(community stew)_

an extensive catalog of the Pretty Lights musical project

### [bakedgoods](https://www.bakedgoods.stews.io) _(curator stew)_

choice selections from modern electronic music

## get started

### create stew

##### run command to create stew

```bash
deno run -A https://deno.stews.io/init.ts ./your-stew
```

##### navigate into your stew's directory

```bash
cd ./your-stew
```

##### build and serve your stew locally

```bash
deno task buildAndServeStew
```

##### see what you get out of the box

> open browser at localhost:8080

### make it yours

- customize your stew at `./source/stew.config.ts`

  - [config documentation](#config)

### publish to vercel

1. create new repository on github

2. create new project in vercel

   - link github repository

3. set secrets in github for repository

   - `VERCEL_ORG_ID`

     - go to settings tab under vercel user and copy vercel id

   - `VERCEL_PROJECT_ID`

     - go to settings tab under vercel project and copy project id

   - `VERCEL_TOKEN`

     - [create vercel token](https://vercel.com/account/tokens)

4. push repository to github

   - if branch === `production` then production deployed

   - if branch !== `production` then preview deployed

## documentation

### config

##### main config

```typescript
interface SourceStewConfig {
  stewInfo: {
    stewName: string;
    stewTagline: string;
    stewMessage: string;
    stewLinks: Array<{
      linkLabel: string;
      linkHref: string;
      linkIconSvg: string;
    }>;
  };
  stewSegments: Array<{
    segmentKey: string;
    segmentLabel: string;
    segmentModulePath: string;
    segmentDataset: Array<SomeSegmentItem extends SegmentItem, JsonObject>;
    segmentViews: Array<{
      viewKey: string;
      viewLabel: string;
      viewItemIds: Array<SegmentItem["itemId"]>;
    }>;
  }>;
}
```

##### segment module

```typescript
interface SegmentModule<SomeSegmentItem extends SegmentItem> {
  segmentSortOptions: Array<{
    sortOptionKey: string;
    sortOptionLabel: string;
    getSortOrder: Parameters<Array<SomeSegmentItem>["sort"]>[0];
  }>;
  getSegmentItemSearchString: (someSegmentItem: SomeSegmentItem) => string;
  SegmentItemDisplay: (
    props: SegmentItemDisplayProps<SomeSegmentItem>
  ) => JSX.Element;
}
```

### library/displays

##### BasicLinkDisplay

```typescript
interface BasicLinkDisplayProps {
  itemTitle: string;
  itemHref: string;
  itemLabels: Array<string>;
  itemSecondaryLinks: Array<{
    linkLabel: string;
    linkHref: string;
  }>;
}
```

```typescript
interface CustomLinkItem extends SegmentItem {
  customTitle: string;
  customHref: string;
  customArchiveHref: string;
  customTags: Array<string>;
}

function CustomLinkItemDisplay(props: SegmentItemDisplayProps<CustomLinkItem>) {
  const { someSegmentItem } = props;
  return (
    <BasicLinkDisplay
      itemTitle={someSegmentItem.customTitle}
      itemHref={someSegmentItem.customHref}
      itemLabels={someSegmentItem.customTags}
      itemSecondaryLinks={[
        {
          linkLabel: "archive",
          linkHref: someSegmentItem.customArchiveHref,
        },
      ]}
    />
  );
}
```

##### ThumbnailLinksDisplay

```typescript
interface ThumbnailLinksDisplayProps {
  itemTitle: string;
  itemThumbnailHref: string;
  itemLinks: Array<{
    linkLabel: string;
    linkHref: string;
    ariaLabel: string;
    ariaDescription: string;
  }>;
  itemLabelLists: Array<{
    ariaLabel: string;
    listLabels: Array<string>;
  }>;
}
```

```typescript
interface CustomThumbnailItem extends SegmentItem {
  customTitle: string;
  customThumbnailHref: string;
  customArchiveHref: string;
  customAuthors: Array<string>;
  customTags: Array<string>;
}

function CustomThumbnailItemDisplay(
  props: SegmentItemDisplayProps<CustomThumbnailItem>
) {
  const { someSegmentItem } = props;
  return (
    <ThumbnailLinksDisplay
      itemTitle={someSegmentItem.customTitle}
      itemThumbnailHref={someSegmentItem.customThumbnailHref}
      itemLinks={[
        {
          linkLabel: "archive",
          ariaLabel: "view archive",
          ariaDescription: `open new tab and navigate to ${someSegmentItem.customItemArchiveHref}`,
          linkHref: someSegmentItem.customItemArchiveHref,
        },
      ]}
      itemLabelLists={[
        {
          ariaLabel: "item authors",
          listLabels: someSegmentItem.customAuthors,
        },
        {
          ariaLabel: "item tags",
          listLabels: someSegmentItem.customTags,
        },
      ]}
    />
  );
}
```

### command

##### init

todo

##### build

todo
