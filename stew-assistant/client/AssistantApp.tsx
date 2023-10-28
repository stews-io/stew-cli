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
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        <div className={cssModule.formContainer}>
          {activeFormState.formConfig.formFields.map((someFieldConfig: any) => (
            <FormFieldItem
              key={someFieldConfig.fieldKey}
              formApi={assistantApi.formApi}
              someFieldConfig={someFieldConfig}
              formFields={activeFormState.formFields}
            />
          ))}
          <div className={cssModule.formFooterContainer}>
            {activeFormState.formConfig.formSubmit.submitType === "explicit"
              ? createElement(
                  activeFormState.formConfig.formSubmit.SubmitButton,
                  {
                    formState: activeFormState,
                    formApi: assistantApi.formApi,
                  }
                )
              : null}
          </div>
        </div>
      </Page>
    </ClientApp>
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
