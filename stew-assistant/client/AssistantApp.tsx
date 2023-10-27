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
import { createElement } from "../../stew-library/deps/preact/mod.ts";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: any;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { assistantState, assistantApi } = useAssistantApp({ assistantConfig });
  const activeFormState =
    assistantState.formStack[assistantState.formStack.length - 1];
  useEffect(() => {
    if (assistantState.fieldChangeHandlers.length > 0) {
      assistantState.fieldChangeHandlers.forEach((someFieldChangeHandler) => {
        someFieldChangeHandler({
          formApi: assistantApi.formApi,
          formFields: activeFormState.formFields,
        });
      });
    }
  }, [assistantState.fieldChangeHandlers]);
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        {activeFormState.formConfig.formFields.map((someFieldConfig: any) =>
          createElement(someFieldConfig.FieldDisplay, {
            key: someFieldConfig.fieldKey,
            formFields: activeFormState.formFields,
            formApi: assistantApi.formApi,
          })
        )}
        {activeFormState.formConfig.formSubmit.submitType === "explicit" ? (
          <div>
            <Button
              ariaLabel="todo"
              ariaDescription="todo"
              onSelect={() => {
                activeFormState.formConfig.formSubmit.submitForm();
              }}
            >
              {activeFormState.formConfig.formSubmit.submitLabel}
            </Button>
          </div>
        ) : null}
      </Page>
    </ClientApp>
  );
}

interface UseAssistantAppApi
  extends Pick<AssitantAppProps, "assistantConfig"> {}

function useAssistantApp(api: UseAssistantAppApi) {
  const { assistantConfig } = api;
  const [assistantState, setAssistantState] = useState<AssistantState>({
    fieldChangeHandlers: [],
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
      clearFieldChangeHandlers: () => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          fieldChangeHandlers: [],
        }));
      },
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
            const targetFieldOnChange =
              activeFormState.formConfig.formFields.find(
                (someFieldConfig: any) => someFieldConfig.fieldKey === fieldKey
              ).fieldOnChange;
            return {
              ...currentAssistantState,
              fieldChangeHandlers: targetFieldOnChange
                ? [
                    ...currentAssistantState.fieldChangeHandlers,
                    targetFieldOnChange,
                  ]
                : currentAssistantState.fieldChangeHandlers,
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
  fieldChangeHandlers: Array<(api: any) => void>;
  formStack: Array<{
    formConfig: any;
    formFields: Record<string, any>;
  }>;
}
