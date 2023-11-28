import {
  SectionDisplayProps,
  ViewSectionDataConfig,
} from "../library/types/AssistantConfig.ts";
import { VerifiedAssistantConfig } from "../library/types/VerifiedAssistantConfig.ts";
import {
  assistantConfig,
  sectionConfig,
} from "../library/utilities/assistantConfig.ts";
// @deno-types="CssModule"

const exampleConfig = assistantConfig([
  {
    viewKey: "fooView",
    viewSections: [
      sectionConfig({
        sectionKey: "bazSection",
        SectionDisplay: BazDisplay,
        foo: 2,
      }),
      sectionConfig({
        sectionKey: "fazSection",
        SectionDisplay: FazDisplay,
        fazThing: 3,
      }),
    ],
    getInitialViewState: () => ({
      fooThing: 2,
    }),
  },
  {
    viewKey: "bazView",
    viewSections: [
      sectionConfig({
        sectionKey: "bazSection",
        SectionDisplay: BazDisplay,
        foo: 2,
      }),
    ],
  },
]);

const verifiedExampleConfig: VerifiedAssistantConfig<typeof exampleConfig> =
  exampleConfig;

export default verifiedExampleConfig;

interface FooViewState {
  fooThing: number;
}

interface BazSectionConfig extends ViewSectionDataConfig<"bazSection"> {
  foo: number;
}

interface BazDisplayProps
  extends SectionDisplayProps<FooViewState, BazSectionConfig> {}

function BazDisplay(props: BazDisplayProps) {
  const { sectionConfig, viewApi } = props;
  return <div>{sectionConfig.foo}</div>;
}

interface FazSectionConfig extends ViewSectionDataConfig<"fazSection"> {
  fazThing: number;
}

interface FazDisplayProps
  extends SectionDisplayProps<FooViewState, FazSectionConfig> {}

function FazDisplay(props: FazDisplayProps) {
  return <div>faz</div>;
}
