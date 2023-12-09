import { assistantConfig } from "../library/config/AssistantConfig.ts";
import {
  FieldDisplayProps,
  FooterDisplayProps,
  HeaderDisplayProps,
  initialFormViewConfig,
} from "../library/config/FormViewConfig.tsx";
import { VerifiedAssistantConfig } from "../library/config/VerifiedAssistantConfig.ts";

const exampleConfig = assistantConfig([
  initialFormViewConfig({
    viewKey: "bazView",
    formHeader: {
      HeaderDisplay: BazHeaderDisplay,
      headerKey: "bazHeader",
      headerData: {
        headerTing: 7,
      },
    },
    formFooter: {
      FooterDisplay: BazFooterDisplay,
      footerKey: "bazFooter",
      footerData: {
        footerThang: 5,
      },
    },
    formFields: [
      {
        FieldDisplay: AaaBazFieldDisplay,
        fieldKey: "aaaBazField",
        fieldData: {},
      },
    ],
    getInitialViewState: () => ({
      bazTing: "bazzy",
    }),
  }),
]);

const verifiedExampleConfig: VerifiedAssistantConfig<typeof exampleConfig> =
  exampleConfig;

export default verifiedExampleConfig;

interface BazFormViewState {
  bazTing: string;
}

interface BazHeaderData {
  headerTing: number;
}

interface BazHeaderDisplayProps
  extends HeaderDisplayProps<"bazHeader", BazHeaderData, BazFormViewState> {}

function BazHeaderDisplay(props: BazHeaderDisplayProps) {
  props.headerKey;
  props.headerData.headerTing;
  props.viewState.bazTing;
  return <div>baz header {props.headerData.headerTing}</div>;
}

interface BazFooterData {
  footerThang: number;
}

interface BazFooterDisplayProps
  extends FooterDisplayProps<"bazFooter", BazFooterData, BazFormViewState> {}

function BazFooterDisplay(props: BazFooterDisplayProps) {
  return <div>baz footer {props.viewState.bazTing}</div>;
}

interface AaaBazFieldData {}

interface AaaBazFieldDisplayProps
  extends FieldDisplayProps<"aaaBazField", AaaBazFieldData, BazFormViewState> {}

function AaaBazFieldDisplay(props: AaaBazFieldDisplayProps) {
  return <div>aaa field {props.viewState.bazTing}</div>;
}

///
///
