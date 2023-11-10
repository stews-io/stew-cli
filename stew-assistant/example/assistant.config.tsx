import {
  FunctionComponent,
  createElement,
} from "../../stew-library/deps/preact/mod.ts";
import { assistantConfig } from "../library/utilities/assistantConfig.ts";
import {
  InitialRequiredAssistantViewConfig,
  RequiredAssistantViewConfig,
  RequiredViewSectionConfig,
  SectionDisplayProps,
} from "../library/types/AssistantConfig.ts";
import { useMemo } from "stew/deps/preact/hooks.ts";

export default formConfig([
  {
    viewKey: "fooForm",
    getInitialViewSectionsState: () => ({}),
    FormHeader: FooHeader,
    FormFooter: FooFooter,
    formFields: [
      {
        fieldKey: "fooField",
        FieldDisplay: FooField,
      },
    ],
  },
]);

function FooHeader() {
  return null;
}

function FooFooter() {
  return null;
}

function FooField() {
  return null;
}

interface InitialRequiredFormViewConfig
  extends RequiredFormViewConfig,
    Pick<
      InitialRequiredAssistantViewConfig<
        string,
        Array<RequiredViewSectionConfig<any>>
      >,
      "getInitialViewSectionsState"
    > {}

interface RequiredFormViewConfig
  extends Pick<
      RequiredAssistantViewConfig<
        string,
        Array<RequiredViewSectionConfig<any>>
      >,
      "viewKey"
    >,
    Pick<FormHeaderSectionConfig, "FormHeader">,
    Pick<FormFooterSectionConfig, "FormFooter">,
    Pick<FormBodySectionConfig, "formFields"> {}

function formConfig(
  someFormConfig: [
    InitialRequiredFormViewConfig,
    ...Array<RequiredFormViewConfig>
  ]
) {
  const [initialFormViewConfig, ...secondaryFormViewConfig] = someFormConfig;
  return formAssistantConfig([
    {
      viewKey: initialFormViewConfig.viewKey,
      getInitialViewSectionsState:
        initialFormViewConfig.getInitialViewSectionsState,
      viewSections: [
        {
          sectionKey: "formHeader",
          SectionDisplay: __FormHeader,
          FormHeader: initialFormViewConfig.FormHeader,
        },
        {
          sectionKey: "formBody",
          SectionDisplay: __FormBody,
          formFields: initialFormViewConfig.formFields,
        },
        {
          sectionKey: "formFooter",
          SectionDisplay: __FormFooter,
          FormFooter: initialFormViewConfig.FormFooter,
        },
      ],
    },
    ...secondaryFormViewConfig.map<
      RequiredAssistantViewConfig<
        string,
        [
          FormHeaderSectionConfig,
          FormBodySectionConfig,
          FormFooterSectionConfig
        ]
      >
    >((someFormViewConfig) => ({
      viewKey: someFormViewConfig.viewKey,
      viewSections: [
        {
          sectionKey: "formHeader",
          SectionDisplay: __FormHeader,
          FormHeader: someFormViewConfig.FormHeader,
        },
        {
          sectionKey: "formBody",
          SectionDisplay: __FormBody,
          formFields: someFormViewConfig.formFields,
        },
        {
          sectionKey: "formFooter",
          SectionDisplay: __FormFooter,
          FormFooter: someFormViewConfig.FormFooter,
        },
      ],
    })),
  ]);
}

interface __FormHeaderProps extends SectionDisplayProps<unknown> {}

function __FormHeader(props: __FormHeaderProps) {
  return null;
}

interface __FormBodyProps
  extends SectionDisplayProps<{
    sectionKey: string;
    formFields: Array<FormFieldConfig>;
  }> {}

function __FormBody(props: __FormBodyProps) {
  const { someSectionConfig, viewState, viewApi } = props;
  const formState = useMemo(
    () => ({
      ...viewState.viewSectionStates["formBody"],
    }),
    [viewState]
  );
  const formApi = useMemo(
    () => ({
      ...viewApi,
      setFieldValue: () => {},
      setFieldError: () => {},
      setFieldState: () => {},
    }),
    []
  );
  return (
    <div>
      {someSectionConfig.formFields.map((someFieldConfig) =>
        createElement(someFieldConfig.FieldDisplay, {
          key: someFieldConfig.fieldKey,
          formState,
          formApi,
        })
      )}
    </div>
  );
}

interface __FormFooterProps extends SectionDisplayProps<unknown> {}

function __FormFooter(props: __FormFooterProps) {
  return null;
}

function formAssistantConfig<
  ViewKey extends string,
  SomeFormViewSectionsConfig extends [
    FormHeaderSectionConfig,
    FormBodySectionConfig,
    FormFooterSectionConfig
  ],
  SomeFormViewsConfig extends [
    InitialRequiredAssistantViewConfig<ViewKey, SomeFormViewSectionsConfig>,
    ...Array<RequiredAssistantViewConfig<ViewKey, SomeFormViewSectionsConfig>>
  ]
>(someFormViewsConfig: SomeFormViewsConfig) {
  return assistantConfig(someFormViewsConfig);
}

interface FormHeaderSectionConfig
  extends RequiredViewSectionConfig<"formHeader"> {
  FormHeader: FunctionComponent;
}

interface FormBodySectionConfig extends RequiredViewSectionConfig<"formBody"> {
  formFields: Array<FormFieldConfig>;
}

interface FormFieldConfig {
  fieldKey: string;
  FieldDisplay: FunctionComponent;
}

interface FormFooterSectionConfig
  extends RequiredViewSectionConfig<"formFooter"> {
  FormFooter: FunctionComponent;
}
