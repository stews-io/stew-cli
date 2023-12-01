import {
  ComponentProps,
  Fragment,
  FunctionComponent,
  createElement,
} from "stew/deps/preact/mod.ts";
import {
  InitialViewConfig,
  SectionDisplayProps,
  ViewApi,
  ViewSectionConfig,
  ViewSectionDataConfig,
} from "../library/types/AssistantConfig.ts";
import { VerifiedAssistantConfig } from "../library/types/VerifiedAssistantConfig.ts";
import {
  assistantConfig,
  sectionConfig,
} from "../library/utilities/assistantConfig.ts";

const exampleConfig = assistantConfig([
  formView({
    viewKey: "fooFormView",
    FormHeader: FooFormHeader,
    FormFooter: FooFormFooter,
    formFields: [
      fieldConfig({
        fieldKey: "fieldAaa",
        FieldDisplay: AaaFieldDisplay,
        aaaThing: 2,
      }),
    ],
    getInitialViewState: () => ({
      fooThing: 2,
      fieldValues: {},
      fieldErrors: {},
    }),
  }),
  // {
  //   viewKey: "bazView",
  //   viewSections: [
  //     sectionConfig({
  //       sectionKey: "bazSection",
  //       SectionDisplay: BazDisplay,
  //       foo: 2,
  //     }),
  //   ],
  // },
]);

const verifiedExampleConfig: VerifiedAssistantConfig<typeof exampleConfig> =
  exampleConfig;

export default verifiedExampleConfig;

interface FooFormViewState extends FormViewStateBase {
  fooThing: number;
}

interface FooFormHeaderProps extends FormHeaderProps<FooFormViewState> {}

function FooFormHeader(props: FooFormHeaderProps) {
  return <div>foo form header</div>;
}

interface AaaFieldConfig extends FieldDataConfig<"fieldAaa"> {
  aaaThing: number;
}

interface AaaFieldDisplayProps
  extends FieldDisplayProps<FooFormViewState, AaaFieldConfig> {}

function AaaFieldDisplay(props: AaaFieldDisplayProps) {
  return <div>aaa field</div>;
}

interface FooFormFooterProps extends FormFooterProps<FooFormViewState> {}

function FooFormFooter(props: FooFormFooterProps) {
  return <div>foo form footer</div>;
}

///

interface InitialFormViewApi<
  ThisViewKey,
  ThisViewState,
  SomeFieldKey extends string,
  SomeFieldDataConfig extends FieldDataConfig<SomeFieldKey>,
  ThisFieldForms extends [
    FieldConfig<ThisViewState, SomeFieldDataConfig>,
    ...Array<FieldConfig<ThisViewState, SomeFieldDataConfig>>
  ]
> extends Pick<
      InitialViewConfig<ThisViewKey, unknown, () => ThisViewState>,
      "viewKey" | "getInitialViewState"
    >,
    Pick<
      FormViewSections<
        ThisViewState,
        SomeFieldKey,
        SomeFieldDataConfig,
        ThisFieldForms
      >["0"],
      "FormHeader"
    >,
    Pick<
      FormViewSections<
        ThisViewState,
        SomeFieldKey,
        SomeFieldDataConfig,
        ThisFieldForms
      >["1"],
      "formFields"
    >,
    Pick<
      FormViewSections<
        ThisViewState,
        SomeFieldKey,
        SomeFieldDataConfig,
        ThisFieldForms
      >["2"],
      "FormFooter"
    > {}

type FormViewSections<
  ThisViewState,
  SomeFieldKey extends string,
  SomeFieldDataConfig extends FieldDataConfig<SomeFieldKey>,
  ThisFieldForms extends [
    FieldConfig<ThisViewState, SomeFieldDataConfig>,
    ...Array<FieldConfig<ThisViewState, SomeFieldDataConfig>>
  ]
> = [
  ViewSectionConfig<ThisViewState, __FormHeaderConfig<ThisViewState>>,
  ViewSectionConfig<ThisViewState, __FormBodyConfig<ThisFieldForms>>,
  ViewSectionConfig<ThisViewState, __FormFooterConfig<ThisViewState>>
];

function formView(api: any) {
  const { viewKey, getInitialViewState, FormHeader, formFields, FormFooter } =
    api;
  return {
    viewKey,
    getInitialViewState,
    viewSections: [
      {
        sectionKey: "__formHeader",
        SectionDisplay: __FormHeader,
        FormHeader,
      },
      {
        sectionKey: "__formBody",
        SectionDisplay: __FormBody,
        formFields,
      },
      {
        sectionKey: "__formFooter",
        SectionDisplay: __FormFooter,
        FormFooter,
      },
    ],
  };
}

interface FormViewStateBase {
  fieldValues: Record<string, any>;
  fieldErrors: Record<string, string>;
}

interface __FormHeaderConfig<ThisFormViewState>
  extends ViewSectionDataConfig<"__formHeader"> {
  FormHeader: FunctionComponent<FormHeaderProps<ThisFormViewState>>;
}

interface FormHeaderProps<ThisFormViewState> {
  viewState: ThisFormViewState;
  viewApi: ViewApi<ThisFormViewState>;
}

interface __FormHeaderProps<ThisFormViewState>
  extends SectionDisplayProps<
    ThisFormViewState,
    __FormHeaderConfig<ThisFormViewState>
  > {}

function __FormHeader<ThisFormViewState>(
  props: __FormHeaderProps<ThisFormViewState>
) {
  const { sectionConfig, viewState, viewApi } = props;
  return createElement(sectionConfig.FormHeader, {
    viewState,
    viewApi,
  });
}

interface __FormBodyConfig<ThisFormFields>
  extends ViewSectionDataConfig<"__formBody"> {
  formFields: ThisFormFields;
}

function fieldConfig<
  ThisViewState,
  ThisFieldKey extends string,
  ThisFieldDataConfig extends FieldDataConfig<ThisFieldKey>
>(thisFieldConfig: FieldConfig<ThisViewState, ThisFieldDataConfig>) {
  return thisFieldConfig;
}

type FieldConfig<ThisViewState, ThisFieldDataConfig> = ThisFieldDataConfig & {
  FieldDisplay: FunctionComponent<
    FieldDisplayProps<ThisViewState, ThisFieldDataConfig>
  >;
};

interface FieldDisplayProps<ThisViewState, ThisFieldDataConfig> {
  fieldConfig: ThisFieldDataConfig;
  viewState: ThisViewState;
  viewApi: ViewApi<ThisViewState>;
}

interface FieldDataConfig<ThisFieldKey> {
  fieldKey: ThisFieldKey;
}

interface __FormBodyProps<ThisViewState, ThisFormFields>
  extends SectionDisplayProps<
    ThisViewState,
    __FormBodyConfig<ThisFormFields>
  > {}

function __FormBody<
  ThisViewState,
  ThisFormFields extends [
    FieldConfig<ThisViewState, any>,
    ...Array<FieldConfig<ThisViewState, any>>
  ]
>(props: __FormBodyProps<ThisViewState, ThisFormFields>) {
  const { sectionConfig } = props;
  return (
    <Fragment>
      {sectionConfig.formFields.map((someFieldConfig) =>
        createElement(someFieldConfig.FieldDisplay, {
          key: someFieldConfig.fieldKey,
          fieldConfig: someFieldConfig,
        })
      )}
    </Fragment>
  );
}

interface __FormFooterConfig<ThisFormViewState>
  extends ViewSectionDataConfig<"__formFooter"> {
  FormFooter: FunctionComponent<FormFooterProps<ThisFormViewState>>;
}

interface FormFooterProps<ThisFormViewState> {
  viewState: ThisFormViewState;
  viewApi: ViewApi<ThisFormViewState>;
}

interface __FormFooterProps<ThisFormViewState>
  extends SectionDisplayProps<
    ThisFormViewState,
    __FormFooterConfig<ThisFormViewState>
  > {}

function __FormFooter<ThisFormViewState>(
  props: __FormFooterProps<ThisFormViewState>
) {
  const { sectionConfig, viewState, viewApi } = props;
  return createElement(sectionConfig.FormFooter, {
    viewState,
    viewApi,
  });
}
