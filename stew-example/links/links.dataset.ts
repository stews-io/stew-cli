import { SegmentDataset } from "stew/config/SegmentDataset.ts";
import { LinkItem } from "./LinkItem.ts";

export const linksDataset: SegmentDataset<LinkItem> = [
  {
    itemId: 0,
    linkTitle: "The Euclidean Algorithm Generates Traditional Musical Rhythms",
    linkHref: "http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf",
    linkAuthor: ["Godfried Toussaint"],
    linkTags: ["math"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230821125813/http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf",
      },
    ],
  },
  {
    itemId: 1,
    linkTitle: "Circles, Sines, and Signals",
    linkHref: "https://jackschaedler.github.io/circles-sines-signals/",
    linkAuthor: ["Jack Schaedler"],
    linkTags: ["math"],
    secondaryLinks: [
      {
        linkLabel: "hnews",
        linkHref: "https://news.ycombinator.com/item?id=9131706",
      },
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230906094100/https://jackschaedler.github.io/circles-sines-signals/",
      },
    ],
  },
  {
    itemId: 2,
    linkTitle: "A Visual, Intuitive Guide to Imaginary Numbers",
    linkHref:
      "https://betterexplained.com/articles/a-visual-intuitive-guide-to-imaginary-numbers/",
    linkAuthor: ["Kalid Azad"],
    linkTags: ["math"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230719081254/https://betterexplained.com/articles/a-visual-intuitive-guide-to-imaginary-numbers/",
      },
      {
        linkLabel: "hnews",
        linkHref: "https://news.ycombinator.com/item?id=17722790",
      },
    ],
  },
  {
    itemId: 3,
    linkTitle: "An Intuitive Guide to Linear Algebra",
    linkHref: "https://betterexplained.com/articles/linear-algebra-guide/",
    linkAuthor: ["Kalid Azad"],
    linkTags: ["math"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230926083923/https://betterexplained.com/articles/linear-algebra-guide/",
      },
      {
        linkLabel: "hnews (1)",
        linkHref: "https://news.ycombinator.com/item?id=22416319",
      },
      {
        linkLabel: "hnews (2)",
        linkHref: "https://news.ycombinator.com/item?id=30866244",
      },
    ],
  },
  {
    itemId: 4,
    linkTitle: "Immersive Linear Algebra",
    linkHref: "https://immersivemath.com/ila/index.html",
    linkAuthor: ["Jacob Ström", "Kalle Åström", "Tomas Akenine-Möller"],
    linkTags: ["math"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230909064031/http://immersivemath.com/ila/index.html",
      },
      {
        linkLabel: "hnews (1)",
        linkHref: "https://news.ycombinator.com/item?id=19264048",
      },
      {
        linkLabel: "hnews (2)",
        linkHref: "https://news.ycombinator.com/item?id=13904881",
      },
      {
        linkLabel: "hnews (3)",
        linkHref: "https://news.ycombinator.com/item?id=10183725",
      },
    ],
  },
  {
    itemId: 5,
    linkTitle: "Concurrency Glossary",
    linkHref: "https://slikts.github.io/concurrency-glossary",
    linkAuthor: ["Reinis Ivanovs"],
    linkTags: ["computation"],
    secondaryLinks: [
      {
        linkLabel: "hnews",
        linkHref: "https://news.ycombinator.com/item?id=18502488",
      },
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230525124402/https://slikts.github.io/concurrency-glossary/",
      },
    ],
  },
  {
    itemId: 6,
    linkTitle: "Bartosz Ciechanowski",
    linkHref: "https://ciechanow.ski",
    linkAuthor: ["Bartosz Ciechanowski"],
    linkTags: ["blog"],
    secondaryLinks: [],
  },
  {
    itemId: 7,
    linkTitle: "Julia Evans",
    linkHref: "https://jvns.ca",
    linkAuthor: ["Julia Evans"],
    linkTags: ["blog"],
    secondaryLinks: [],
  },
  {
    itemId: 8,
    linkTitle: "Floating Point Visually Explained",
    linkHref: "https://fabiensanglard.net/floating_point_visually_explained",
    linkAuthor: ["Fabien Sanglard"],
    linkTags: ["computation"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230917160850/https://fabiensanglard.net/floating_point_visually_explained/",
      },
      {
        linkLabel: "hnews (1)",
        linkHref: "https://news.ycombinator.com/item?id=15359574",
      },
      {
        linkLabel: "hnews (2)",
        linkHref: "https://news.ycombinator.com/item?id=23081924",
      },
      {
        linkLabel: "hnews (3)",
        linkHref: "https://news.ycombinator.com/item?id=29368529",
      },
    ],
  },
  {
    itemId: 9,
    linkTitle: "Float Exposed",
    linkHref: "https://float.exposed",
    linkAuthor: ["Bartosz Ciechanowski"],
    linkTags: ["computation"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230922004644/https://float.exposed/0x44bf9400",
      },
    ],
  },
  {
    itemId: 10,
    linkTitle: "Exposing Floating Point",
    linkHref: "https://ciechanow.ski/exposing-floating-point/",
    linkAuthor: ["Bartosz Ciechanowski"],
    linkTags: ["computation"],
    secondaryLinks: [
      {
        linkLabel: "archive",
        linkHref:
          "https://web.archive.org/web/20230912065316/https://ciechanow.ski/exposing-floating-point/",
      },
      {
        linkLabel: "hnews",
        linkHref: "https://news.ycombinator.com/item?id=36484932",
      },
    ],
  },
];
