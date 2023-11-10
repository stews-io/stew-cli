import { createElement } from "stew/deps/preact/mod.ts";
import { useEffect, useMemo } from "stew/deps/preact/hooks.ts";
import { BasicSelect, Input } from "stew/components/mod.ts";
import { FieldContainer } from "../library/components/FieldContainer.tsx";
// @deno-types="CssModule"
import cssModule from "./AssistantConfig.module.scss";

export default assistantForms([
  {
    viewKey: "fooForm",
    FormHeader: EmptyFormHeader,
    FormFooter: EmptyFormFooter,
    formFields: [
      {
        fieldKey: "aaa",
        ItemField: AaaField,
      },
    ],
    getInitialFieldValues: () => ({
      aaa: null,
    }),
  },
  {
    viewKey: "bazForm",
    FormHeader: EmptyFormHeader,
    FormFooter: EmptyFormFooter,
    formFields: [
      {
        fieldKey: "aaa",
        ItemField: AaaField,
      },
      {
        fieldKey: "bbb",
        ItemField: BbbField,
      },
    ],
  },
]);

function EmptyFormHeader() {
  return null;
}

function EmptyFormFooter() {
  return null;
}

function AaaField(props: any) {
  const { someFieldConfig, formState, formApi } = props;
  const optionList = AAA_OPTIONS;
  const optionPlaceholder = "select option";
  const { fieldSelectOption, fieldSelectedOption } = useMemo(
    () => ({
      fieldSelectOption: (nextFieldOption: any) => {
        if (
          nextFieldOption.optionValue !==
          formState.fieldValues[someFieldConfig.fieldKey]
        ) {
          formApi.setFieldValue(
            someFieldConfig.fieldKey,
            nextFieldOption.optionValue
          );
        }
      },
      fieldSelectedOption: optionList.find(
        (someFieldOption) =>
          someFieldOption.optionValue ===
          formState.fieldValues[someFieldConfig.fieldKey]
      ) ?? {
        optionLabel: optionPlaceholder,
        optionValue: null,
      },
    }),
    [formState.fieldValues[someFieldConfig.fieldKey]]
  );
  useEffect(() => {
    if (formState.fieldValues["aaa"] === "artist") {
      formApi.replaceView("bazForm", {
        formHeader: {},
        formFooter: {},
        formBody: {
          fieldStates: {},
          fieldErrors: {},
          fieldValues: {
            ...formState.fieldValues,
            bbb: "",
          },
        },
      });
    }
  }, [formState.fieldValues["aaa"]]);
  return (
    <FieldContainer>
      <BasicSelect
        anchorBorderClassName={cssModule.selectFieldBorder}
        anchorAriaLabel={`todo`}
        anchorAriaDescription={`todo`}
        optionLabelKey={"optionLabel"}
        optionList={optionList}
        optionTypeLabel={"aaa"}
        selectOption={fieldSelectOption}
        selectedOption={fieldSelectedOption}
      />
    </FieldContainer>
  );
}

const AAA_OPTIONS = [
  {
    optionLabel: "artist",
    optionValue: "artist",
  },
];

function BbbField(props: any) {
  const { formState, formApi } = props;
  return (
    <FieldContainer>
      <Input
        // inputContainerClassname={cssModule.fieldInputContainer}
        placeholder={"bbb"}
        value={formState.fieldValues["bbb"]}
        onInput={(someInputEvent: any) => {
          formApi.setFieldValue("bbb", someInputEvent.currentTarget.value);
        }}
        InputDecorator={() => null}
        inputDecoratorProps={{}}
      />
    </FieldContainer>
  );
}

function assistantForms(someFormViewConfigs: Array<any>) {
  const [initialFormViewConfig, ...secondaryFormViewConfigs] =
    someFormViewConfigs;
  return {
    assistantViews: [
      {
        ...assistantFormView(initialFormViewConfig),
        getInitialViewSectionStates: () => ({
          formHeader: {},
          formFooter: {},
          formBody: {
            fieldValues: initialFormViewConfig.getInitialFieldValues(),
            fieldErrors: {},
            fieldStates: initialFormViewConfig.formFields.reduce(
              (fieldStatesResult: any, someFieldConfig: any) => {
                fieldStatesResult[someFieldConfig.fieldKey] = {};
                return fieldStatesResult;
              },
              {}
            ),
          },
        }),
      },
      ...secondaryFormViewConfigs.map((someFormViewConfig) =>
        assistantFormView(someFormViewConfig)
      ),
    ],
  };
}

function assistantFormView(someFormViewConfig: any) {
  return {
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
  };
}

function __FormHeader() {
  return null;
}

function __FormBody(props: any) {
  const { viewState, viewApi, someSectionConfig } = props;
  const formState = useMemo(
    () => ({
      formHeader: viewState.viewSectionStates["formHeader"],
      formFooter: viewState.viewSectionStates["formFooter"],
      fieldValues: viewState.viewSectionStates["formBody"]["fieldValues"],
      fieldErrors: viewState.viewSectionStates["formBody"]["fieldErrors"],
      fieldStates: viewState.viewSectionStates["formBody"]["fieldStates"],
    }),
    [viewState]
  );
  const formApi = useMemo(
    () => ({
      ...viewApi,
      setFieldValue: (someFieldKey: string, nextFieldValue: any) => {
        viewApi.setSectionState("formBody", (currentFormBodyState: any) => {
          return {
            ...currentFormBodyState,
            fieldValues: {
              ...currentFormBodyState.fieldValues,
              [someFieldKey]: nextFieldValue,
            },
          };
        });
      },
      setFieldError: (someFieldKey: string, nextFieldError: any) => {
        viewApi.setSectionState("formBody", (currentFormBodyState: any) => {
          return {
            ...currentFormBodyState,
            fieldErrors: {
              ...currentFormBodyState.fieldErrors,
              [someFieldKey]: nextFieldError,
            },
          };
        });
      },
      setFieldState: (someFieldKey: string, getNextFieldState: any) => {
        viewApi.setSectionState("formBody", (currentFormBodyState: any) => {
          return {
            ...currentFormBodyState,
            fieldStates: {
              ...currentFormBodyState.fieldStates,
              [someFieldKey]: getNextFieldState(
                currentFormBodyState.fieldStates[someFieldKey]
              ),
            },
          };
        });
      },
    }),
    [viewApi]
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      {someSectionConfig.formFields.map((someFieldConfig: any) =>
        createElement(someFieldConfig.ItemField, {
          formState,
          formApi,
          someFieldConfig,
          key: someFieldConfig.fieldKey,
        })
      )}
    </div>
  );
}

function __FormFooter() {
  return null;
}
