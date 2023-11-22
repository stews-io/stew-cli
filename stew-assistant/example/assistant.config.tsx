import { FunctionComponent } from "../../stew-library/deps/preact/mod.ts";
import {
  SectionDisplayProps,
  SourceAssistantConfig,
  ViewApi,
  ViewSectionConfig,
  ViewSectionDataConfig,
} from "../library/types/AssistantConfig.ts";
// @deno-types="CssModule"

const fooConfig = assistantConfig({
  assistantViews: [
    {
      viewKey: "fooView",
      viewSections: [
        // {
        //   sectionKe: "asdf",
        //   SectionDisplay: () => null,
        // },
        sectionConfig({
          sectionKey: "bazSection",
          SectionDisplay: BazDisplay,
          foo: 2,
        }),
      ],
      getInitialViewState: () => null,
    },
  ],
});

// fooConfig.assistantViews[0].viewSections[0].foo

export default fooConfig;

interface BazDisplayProps
  extends SectionDisplayProps<BazSectionConfig, any, any, any> {}

function BazDisplay(props: BazDisplayProps) {
  const { sectionConfig, viewApi } = props;
  return <div>{sectionConfig.foo}</div>;
}

interface BazSectionConfig extends ViewSectionDataConfig<"bazSection"> {
  foo: number;
}

function assistantConfig<
  SomeViewKey,
  SomeSectionDataConfig,
  SomeSectionsConfig extends Array<
    ViewSectionConfig<SomeSectionDataConfig, any, any, any>
  >,
  ThisAssistantConfig extends SourceAssistantConfig<
    SomeViewKey,
    SomeSectionDataConfig,
    SomeSectionsConfig
  >
>(thisAssistantConfig: ThisAssistantConfig) {
  return thisAssistantConfig;
}

function sectionConfig<
  ThisSectionDataConfig,
  ThisViewState,
  SomeViewKey,
  SomeViewState
>(
  thisSectionConfig: ViewSectionConfig<
    ThisSectionDataConfig,
    ThisViewState,
    SomeViewKey,
    SomeViewState
  >
) {
  return thisSectionConfig;
}
