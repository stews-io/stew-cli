import { Fragment } from "stew/deps/preact/mod.ts";
import {
  FieldDisplayProps,
  FormFooterProps,
  FormHeaderProps,
  formViewConfig,
  initialFormViewConfig,
} from "../library/config/FormViewConfigItem.tsx";
import { assistantConfig } from "../library/config/AssistantConfig.ts";
import { StrictAssistantConfig } from "../library/config/StrictAssistantConfig.ts";
import { StricterAssistantConfig } from "../library/config/StricterAssistantConfig.ts";

const exampleConfig = assistantConfig([
  initialFormViewConfig({
    viewKey: "fooFormView",
    FormHeader: FooFormHeader,
    FormFooter: FooFormFooter,
    formFields: [
      {
        fieldKey: "aaaField",
        FieldDisplay: AaaField,
        fieldConfig: {
          aaaThang: 3,
        },
      },
    ],
    getInitialViewState: () => ({
      fooThing: "asdf",
    }),
  }),
  formViewConfig({
    viewKey: "bazFormView",
    FormHeader: BazFormHeader,
    FormFooter: BazFormFooter,
    formFields: [
      {
        fieldKey: "bbbField",
        FieldDisplay: BbbField,
        fieldConfig: {
          bbbThing: "asf",
        },
      },
    ],
  }),
]);

const strictExampleConfig: StrictAssistantConfig<typeof exampleConfig> =
  exampleConfig;

const stricterExampleConfig: StricterAssistantConfig<typeof exampleConfig> =
  exampleConfig;

stricterExampleConfig.assistantViews[1];

export default strictExampleConfig;

interface FooFormState {
  fooThing: string;
}

interface FooFormHeaderProps extends FormHeaderProps<FooFormState> {}

function FooFormHeader(props: FooFormHeaderProps) {
  return <div>foo form header</div>;
}

interface FooFormFooterProps extends FormFooterProps<FooFormState> {}

function FooFormFooter(props: FooFormFooterProps) {
  const { viewState, viewApi } = props;
  return <div>foo form footer</div>;
}

interface AaaFieldConfig {
  aaaThang: number;
}

interface AaaFieldProps
  extends FieldDisplayProps<FooFormState, "aaaField", AaaFieldConfig> {}

function AaaField(props: AaaFieldProps) {
  props.fieldKey;
  props.fieldConfig.aaaThang;
  props.viewState.fooThing;
  return <Fragment />;
}

interface BazFormState {
  bazThing: string;
}

interface BazFormHeaderProps extends FormHeaderProps<BazFormState> {}

function BazFormHeader(props: BazFormHeaderProps) {
  return null;
}

interface BazFormFooterProps extends FormFooterProps<BazFormState> {}

function BazFormFooter(props: BazFormFooterProps) {
  return null;
}

interface BbbFieldConfig {
  bbbThing: string;
}

interface BbbFieldsProps
  extends FieldDisplayProps<BazFormState, "bbbField", BbbFieldConfig> {}

function BbbField(props: BbbFieldsProps) {
  return <Fragment />;
}

///
///

///
///
