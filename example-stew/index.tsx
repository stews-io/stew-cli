import {
  CurationItem,
  CuratorStewConfig,
  ItemDisplayProps,
} from "../source/StewConfig.ts";

const exampleStewConfig: CuratorStewConfig<FooItem> = {
  ItemDisplay: (props: ItemDisplayProps<FooItem>) => (
    <div>
      <div>{props.someItem.itemId}</div>
      <div>{props.someItem.itemFoo}</div>
    </div>
  ),
};

interface FooItem extends CurationItem {
  itemFoo: number;
}

export default exampleStewConfig;
