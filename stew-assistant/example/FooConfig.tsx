import { ComponentProps, FunctionComponent } from "stew/deps/preact/mod.ts";

const exampleConfig = tupleConfig([
  {
    ItemDisplay: AaaDisplay,
    itemKey: "aaa",
    itemDisplayConfig: {
      aaaThang: 2,
      // bbbThing: "Asdfas",
      // cccThing: "Asdfsafasdf"
    },
  },
  {
    itemKey: "bbb",
    ItemDisplay: BbbDisplay,
    itemDisplayConfig: {
      bbbThing: "asdf",
    },
    // thang: 2,
  },
]);

const verifiedExampleConfig: VerifyTuple<typeof exampleConfig> = exampleConfig;

interface AaaDisplayConfig {
  aaaThang: number;
  // aaaThong: string;
}

interface AaaDisplayProps extends ItemDisplayProps<AaaDisplayConfig> {}

function AaaDisplay(props: AaaDisplayProps) {
  props.itemKey;
  return null;
}

interface BbbDisplayConfig {
  bbbThing: string;
}

interface BbbDisplayProps extends ItemDisplayProps<BbbDisplayConfig> {}

function BbbDisplay(props: BbbDisplayProps) {
  return null;
}

function tupleConfig<
  SomeItemKey extends string,
  ThisTupleConfig extends [
    ItemConfig<SomeItemKey, any>,
    ...Array<ItemConfig<SomeItemKey, any>>
  ]
>(thisTupleConfig: ThisTupleConfig) {
  return thisTupleConfig;
}

type VerifyTuple<
  RemainingElements,
  ResultElements extends Array<any> = []
> = RemainingElements extends [
  infer CurrentElement,
  ...infer NextRemainingElements
]
  ? VerifyTuple<
      NextRemainingElements,
      [
        ...ResultElements,
        Exclude<
          keyof CurrentElement,
          keyof ItemConfig<unknown, unknown>
        > extends never
          ? CurrentElement extends {
              itemKey: infer ProvidedItemKey;
              itemDisplayConfig: infer ProvidedItemDisplayConfig;
              ItemDisplay: FunctionComponent<
                ItemDisplayProps<infer DefinedItemDisplayConfig>
              >;
            }
            ? ItemConfig<
                ProvidedItemKey extends ResultElements[number]["itemKey"]
                  ? `error: duplicate 'itemKey'`
                  : ProvidedItemKey,
                DefinedItemDisplayConfig extends ProvidedItemDisplayConfig
                  ? DefinedItemDisplayConfig
                  : `error: `
              >
            : `invalid path: CurrentElement extends 'ItemConfig'`
          : `error: properties provided beyond those in 'ItemConfig'`
      ]
    >
  : ResultElements;

interface ItemConfig<ThisItemKey, ThisItemDisplayConfig> {
  itemKey: ThisItemKey;
  itemDisplayConfig: ThisItemDisplayConfig;
  ItemDisplay: FunctionComponent<ItemDisplayProps<ThisItemDisplayConfig>>;
}

interface ItemDisplayProps<ThisItemDisplayConfig> {
  itemKey: string;
  itemDisplayConfig: ThisItemDisplayConfig;
}
