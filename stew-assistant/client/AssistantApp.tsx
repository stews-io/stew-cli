import {
  Button,
  ClientApp,
  ClientAppProps,
  Page,
} from "../../stew-library/components/mod.ts";
import {
  useEffect,
  useMemo,
  useState,
} from "../../stew-library/deps/preact/hooks.ts";
import {
  ComponentProps,
  FunctionComponent,
  createElement,
} from "../../stew-library/deps/preact/mod.ts";
import { throwInvalidPathError } from "stew/utilities/throwInvalidPathError.ts";
// @deno-types="CssModule"
import cssModule from "./AssistantApp.module.scss";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: any;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { assistantState, assistantApi } = useAssistantApp({ assistantConfig });
  const activeFormState =
    assistantState.formStack[assistantState.formStack.length - 1];
  const ActiveForm =
    activeFormState.formConfig.formSubmit.submitType === "progressive"
      ? ProgressiveAssistantForm
      : activeFormState.formConfig.formSubmit.submitType === "explicit"
      ? ExplicitAssistantForm
      : throwInvalidPathError("AssistantApp.ActiveForm");
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        <ActiveForm
          formApi={assistantApi.formApi}
          formState={activeFormState}
        />
      </Page>
    </ClientApp>
  );
}

interface ProgressiveAssistantFormProps
  extends Pick<AssistantFormBaseProps, "formApi" | "formState"> {}

function ProgressiveAssistantForm(props: ProgressiveAssistantFormProps) {
  const { formApi, formState } = props;
  return (
    <AssistantFormBase
      FormFooter={ProgressiveFormFooter}
      formApi={formApi}
      formState={formState}
    />
  );
}

function ProgressiveFormFooter() {
  return null;
}

interface ExplicitAssistantFormProps
  extends Pick<AssistantFormBaseProps, "formApi" | "formState"> {}

function ExplicitAssistantForm(props: ExplicitAssistantFormProps) {
  const { formApi, formState } = props;
  return (
    <AssistantFormBase
      FormFooter={ExplicitFormFooter}
      formApi={formApi}
      formState={formState}
    />
  );
}

interface ExplicitFormFooterProps
  extends ComponentProps<AssistantFormBaseProps["FormFooter"]> {}

function ExplicitFormFooter(props: ExplicitFormFooterProps) {
  const { formState } = props;
  return (
    <div className={cssModule.formFooterContainer}>
      <Button
        className={cssModule.submitButton}
        ariaLabel="todo"
        ariaDescription="todo"
        onSelect={() => {
          formState.formConfig.formSubmit.submitForm();
        }}
      >
        {formState.formConfig.formSubmit.submitLabel}
      </Button>
    </div>
  );
}

interface AssistantFormBaseProps {
  formApi: any;
  formState: any;
  FormFooter: FunctionComponent<{ formApi: any; formState: any }>;
}

function AssistantFormBase(props: AssistantFormBaseProps) {
  const { formApi, formState, FormFooter } = props;
  return (
    <div className={cssModule.formContainer}>
      {formState.formConfig.formFields.map((someFieldConfig: any) => (
        <FormFieldItem
          key={someFieldConfig.fieldKey}
          formApi={formApi}
          someFieldConfig={someFieldConfig}
          formFields={formState.formFields}
        />
      ))}
      <FormFooter formState={formState} formApi={formApi} />
    </div>
  );
}

function FormFieldItem(props: any) {
  const { someFieldConfig, formApi, formFields } = props;
  useEffect(() => {
    if (someFieldConfig.fieldOnChange) {
      someFieldConfig.fieldOnChange({
        formApi,
        formFields,
      });
    }
  }, [formFields[someFieldConfig.fieldKey]]);
  return createElement(someFieldConfig.FieldDisplay, {
    formApi,
    formFields,
  });
}

interface UseAssistantAppApi
  extends Pick<AssitantAppProps, "assistantConfig"> {}

function useAssistantApp(api: UseAssistantAppApi) {
  const { assistantConfig } = api;
  const [assistantState, setAssistantState] = useState<AssistantState>({
    formStack: [
      {
        formConfig: assistantConfig.assistantEntryFormConfig,
        formFields:
          assistantConfig.assistantEntryFormConfig.getInitialFormFields(),
      },
    ],
  });
  const assistantApi = useMemo(() => {
    return {
      formApi: {
        replaceForm: (
          nextFormKey: string,
          initialFormFields: Record<string, any>
        ) => {
          setAssistantState((currentAssistantState) => {
            const [activeFormState, ...reversedOtherFormStates] = [
              ...currentAssistantState.formStack,
            ].reverse();
            return {
              ...currentAssistantState,
              formStack: [
                ...reversedOtherFormStates.reverse(),
                {
                  formConfig: assistantConfig.assistantForms[nextFormKey],
                  formFields: initialFormFields,
                },
              ],
            };
          });
        },
        setField: (fieldKey: string, nextField: any) => {
          setAssistantState((currentAssistantState) => {
            const [activeFormState, ...reversedOtherFormStates] = [
              ...currentAssistantState.formStack,
            ].reverse();
            return {
              ...currentAssistantState,
              formStack: [
                ...reversedOtherFormStates.reverse(),
                {
                  ...activeFormState,
                  formFields: {
                    ...activeFormState.formFields,
                    [fieldKey]: nextField,
                  },
                },
              ],
            };
          });
        },
      },
    };
  }, [setAssistantState]);
  return {
    assistantState,
    assistantApi,
  };
}

interface AssistantState {
  formStack: Array<{
    formConfig: any;
    formFields: Record<string, any>;
  }>;
}
