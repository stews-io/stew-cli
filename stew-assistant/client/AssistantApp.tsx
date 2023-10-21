import {
  Button,
  ClientApp,
  ClientAppProps,
  Input,
  Page,
} from "../../stew-library/components/mod.ts";
import { JSX } from "../../stew-library/deps/preact/mod.ts";
import {
  StateUpdater,
  useMemo,
  useState,
} from "../../stew-library/deps/preact/hooks.ts";
import { Zod } from "../../stew-library/deps/zod/mod.ts";
import { getCssClass } from "stew/utilities/getCssClass.ts";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import { AsyncValue } from "../library/AsyncValue.ts";
import { musicArtistTypeSystemPrompt } from "../library/gptPrompts.ts";
import { queryGptData } from "../library/queryGptData.ts";
// @deno-types="CssModule"
import cssModule from "./AssistantApp.module.scss";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss } = props;
  const { assistantState, assistantApi } = useAssistantApp();
  const artistForm = useMemo(
    () =>
      assistantState.formType === "newArtistForm" ? (
        <NewArtistForm
          assistantState={assistantState}
          updateArtistName={assistantApi.updateArtistName}
          clearArtistName={assistantApi.clearArtistName}
          loadNextArtistForm={assistantApi.loadTypedArtistForm}
        />
      ) : assistantState.formType === "soloArtistForm" ? (
        <SoloArtistForm
          assistantState={assistantState}
          updateArtistName={assistantApi.updateArtistName}
          clearArtistName={assistantApi.clearArtistName}
          loadNextArtistForm={() => {}}
        />
      ) : assistantState.formType === "groupArtistForm" ? (
        <GroupArtistForm
          assistantState={assistantState}
          updateArtistName={assistantApi.updateArtistName}
          clearArtistName={assistantApi.clearArtistName}
          loadNextArtistForm={() => {}}
        />
      ) : (
        throwInvalidPathError("artistForm")
      ),
    [assistantState]
  );
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>{artistForm}</Page>
    </ClientApp>
  );
}

type AssistantState =
  | NewArtistAssistantState
  | SoloArtistAssistantState
  | GroupArtistAssistantState;

interface NewArtistAssistantState
  extends AssistantStateBase<"newArtistForm", NewArtistFormState> {}

interface SoloArtistAssistantState
  extends AssistantStateBase<"soloArtistForm", SoloArtistFormState> {}

interface GroupArtistAssistantState
  extends AssistantStateBase<"groupArtistForm", GroupArtistFormState> {}

interface AssistantStateBase<
  FormType extends string,
  SomeArtistFormState extends ArtistFormStateBase
> {
  formType: FormType;
  artistForm: SomeArtistFormState;
}

interface NewArtistFormState extends ArtistFormStateBase {}

interface SoloArtistFormState extends ArtistFormStateBase {}

interface GroupArtistFormState extends ArtistFormStateBase {}

interface ArtistFormStateBase {
  artistName: string;
  artistType: AsyncValue<MusicArtistType>;
}

type MusicArtistType = "solo" | "group";

interface NewArtistFormProps
  extends BaseArtistFormDataProps<NewArtistAssistantState> {}

function NewArtistForm(props: NewArtistFormProps) {
  const {
    assistantState,
    updateArtistName,
    clearArtistName,
    loadNextArtistForm,
  } = props;
  return (
    <BaseArtistForm
      assistantState={assistantState}
      updateArtistName={updateArtistName}
      clearArtistName={clearArtistName}
      loadNextArtistForm={loadNextArtistForm}
      BaseFormExtension={() => null}
      baseFormExtensionProps={{}}
    />
  );
}

interface SoloArtistFormProps
  extends TypedArtistFormDataProps<SoloArtistAssistantState> {}

function SoloArtistForm(props: SoloArtistFormProps) {
  const {
    assistantState,
    updateArtistName,
    clearArtistName,
    loadNextArtistForm,
  } = props;
  return (
    <TypedArtistForm
      assistantState={assistantState}
      updateArtistName={updateArtistName}
      clearArtistName={clearArtistName}
      loadNextArtistForm={loadNextArtistForm}
      TypedFormExtension={SoloTypedFormExtension}
      typedFormExtensionProps={{}}
    />
  );
}

interface SoloTypedFormExtensionProps {}

function SoloTypedFormExtension(props: SoloTypedFormExtensionProps) {
  const {} = props;
  return <div>solo todo</div>;
}

interface GroupArtistFormProps
  extends TypedArtistFormDataProps<GroupArtistAssistantState> {}

function GroupArtistForm(props: GroupArtistFormProps) {
  const {
    assistantState,
    updateArtistName,
    clearArtistName,
    loadNextArtistForm,
  } = props;
  return (
    <TypedArtistForm
      assistantState={assistantState}
      updateArtistName={updateArtistName}
      clearArtistName={clearArtistName}
      loadNextArtistForm={loadNextArtistForm}
      TypedFormExtension={GroupTypedFormExtension}
      typedFormExtensionProps={{}}
    />
  );
}

interface GroupTypedFormExtensionProps {}

function GroupTypedFormExtension(props: GroupTypedFormExtensionProps) {
  const {} = props;
  return <div>group todo</div>;
}

interface TypedArtistFormProps<
  SomeAssistantState extends AssistantStateBase<string, ArtistFormStateBase>,
  TypedFormExtensionProps extends Record<string, any>
> extends TypedArtistFormDataProps<SomeAssistantState>,
    TypedArtistFormConfigProps<TypedFormExtensionProps> {}

interface TypedArtistFormDataProps<
  SomeAssistantState extends AssistantStateBase<string, ArtistFormStateBase>
> extends BaseArtistFormDataProps<SomeAssistantState> {}

interface TypedArtistFormConfigProps<
  TypedFormExtensionProps extends Record<string, any>
> extends TypedBaseFormExtensionConfigProps<TypedFormExtensionProps> {}

function TypedArtistForm<
  SomeAssistantState extends AssistantStateBase<string, ArtistFormStateBase>,
  TypedFormExtensionProps extends Record<string, any>
>(props: TypedArtistFormProps<SomeAssistantState, TypedFormExtensionProps>) {
  const {
    assistantState,
    updateArtistName,
    clearArtistName,
    loadNextArtistForm,
    TypedFormExtension,
    typedFormExtensionProps,
  } = props;
  return (
    <BaseArtistForm
      assistantState={assistantState}
      updateArtistName={updateArtistName}
      clearArtistName={clearArtistName}
      loadNextArtistForm={loadNextArtistForm}
      BaseFormExtension={TypedBaseFormExtension}
      baseFormExtensionProps={{
        TypedFormExtension,
        typedFormExtensionProps,
      }}
    />
  );
}

interface TypedBaseFormExtensionProps<
  TypedFormExtensionProps extends Record<string, any>
> extends TypedBaseFormExtensionDataProps,
    TypedBaseFormExtensionConfigProps<TypedFormExtensionProps> {}

interface TypedBaseFormExtensionDataProps {}

interface TypedBaseFormExtensionConfigProps<
  TypedFormExtensionProps extends Record<string, any>
> {
  typedFormExtensionProps: TypedFormExtensionProps;
  TypedFormExtension: (props: TypedFormExtensionProps) => JSX.Element;
}

function TypedBaseFormExtension<
  TypedFormExtensionProps extends Record<string, any>
>(props: TypedBaseFormExtensionProps<TypedFormExtensionProps>) {
  const { TypedFormExtension, typedFormExtensionProps } = props;
  return (
    <div>
      typed todo
      <TypedFormExtension {...typedFormExtensionProps} />
    </div>
  );
}

interface BaseArtistFormProps<
  SomeAssistantState extends AssistantStateBase<string, ArtistFormStateBase>,
  FormExtensionProps extends Record<string, any>
> extends BaseArtistFormDataProps<SomeAssistantState>,
    BaseArtistFormConfigProps<FormExtensionProps> {}

interface BaseArtistFormDataProps<
  SomeAssistantState extends AssistantStateBase<string, ArtistFormStateBase>
> {
  assistantState: SomeAssistantState;
  updateArtistName: (nextArtistName: string) => void;
  clearArtistName: () => void;
  loadNextArtistForm: () => void;
}

interface BaseArtistFormConfigProps<
  BaseFormExtensionProps extends Record<string, any>
> {
  baseFormExtensionProps: BaseFormExtensionProps;
  BaseFormExtension: (props: BaseFormExtensionProps) => JSX.Element | null;
}

function BaseArtistForm<
  SomeAssistantState extends AssistantStateBase<string, ArtistFormStateBase>,
  FormExtensionProps extends Record<string, any>
>(props: BaseArtistFormProps<SomeAssistantState, FormExtensionProps>) {
  const {
    assistantState,
    updateArtistName,
    clearArtistName,
    BaseFormExtension,
    baseFormExtensionProps,
    loadNextArtistForm,
  } = props;
  return (
    <div className={cssModule.formContainer}>
      <div className={cssModule.fieldContainer}>
        <div className={cssModule.fieldInputContainer}>
          <Input
            placeholder={"artist name"}
            value={assistantState.artistForm.artistName}
            onInput={(someInputEvent) => {
              updateArtistName(someInputEvent.currentTarget.value);
            }}
            clearButtonProps={{
              ariaLabel: "todo",
              ariaDescription: "todo",
              onSelect: () => {
                clearArtistName();
              },
            }}
          />
        </div>
        <div
          className={getCssClass(cssModule.fieldMessage, [
            cssModule.errorFieldMessage,
            assistantState.artistForm.artistType.valueStatus === "error",
          ])}
        >
          {assistantState.artistForm.artistType.valueStatus === "error"
            ? assistantState.artistForm.artistType.errorMessage
            : null}
        </div>
      </div>
      <BaseFormExtension {...baseFormExtensionProps} />
      <div className={cssModule.formFooterContainer}>
        <Button
          className={cssModule.submitButton}
          ariaLabel={"todo"}
          ariaDescription={"todo"}
          disabled={
            assistantState.artistForm.artistType.valueStatus === "loading"
          }
          onSelect={() => {
            loadNextArtistForm();
          }}
        >
          {assistantState.artistForm.artistType.valueStatus === "loading"
            ? "loading"
            : "next"}
        </Button>
      </div>
    </div>
  );
}

function useAssistantApp() {
  const [assistantState, setAssistantState] = useState<AssistantState>({
    formType: "newArtistForm",
    artistForm: {
      artistName: "",
      artistType: {
        valueStatus: "none",
      },
    },
  });
  const assistantApi = useMemo(() => {
    return {
      updateArtistName: (nextArtistName: ArtistFormStateBase["artistName"]) => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          artistForm: {
            ...currentAssistantState.artistForm,
            artistName: nextArtistName,
          },
        }));
      },
      clearArtistName: () => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          artistForm: {
            ...currentAssistantState.artistForm,
            artistName: "",
          },
        }));
      },
      loadSoloArtistForm: () => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          formType: "soloArtistForm",
          artistForm: {
            ...currentAssistantState.artistForm,
            artistType: {
              valueStatus: "success",
              value: "solo",
            },
          },
        }));
      },
      loadGroupArtistForm: () => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          formType: "groupArtistForm",
          artistForm: {
            ...currentAssistantState.artistForm,
            artistType: {
              valueStatus: "success",
              value: "group",
            },
          },
        }));
      },
      setArtistNotFoundError: (
        artistName: ArtistFormStateBase["artistName"]
      ) => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          artistForm: {
            ...currentAssistantState.artistForm,
            artistType: {
              valueStatus: "error",
              errorMessage: `artist not found: ${artistName}`,
            },
          },
        }));
      },
      setArtistTypeQueryError: (nextErrorMessage: string) => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          artistForm: {
            ...currentAssistantState.artistForm,
            artistType: {
              valueStatus: "error",
              errorMessage: nextErrorMessage,
            },
          },
        }));
      },
      loadTypedArtistForm: () => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          artistForm: {
            ...currentAssistantState.artistForm,
            artistType: {
              valueStatus: "loading",
              valueWorker: __loadTypedArtistForm({
                loadSoloArtistForm: assistantApi.loadSoloArtistForm,
                loadGroupArtistForm: assistantApi.loadGroupArtistForm,
                setArtistNotFoundError: assistantApi.setArtistNotFoundError,
                setArtistTypeQueryError: assistantApi.setArtistTypeQueryError,
                artistName: currentAssistantState.artistForm.artistName,
              }),
            },
          },
        }));
      },
    };
  }, []);
  return { assistantState, assistantApi };
}

interface __LoadTypedArtistFormApi
  extends Pick<AssistantState["artistForm"], "artistName"> {
  loadSoloArtistForm: () => void;
  loadGroupArtistForm: () => void;
  setArtistNotFoundError: (
    artistName: ArtistFormStateBase["artistName"]
  ) => void;
  setArtistTypeQueryError: (nextErrorMessage: string) => void;
}

async function __loadTypedArtistForm(api: __LoadTypedArtistFormApi) {
  const {
    artistName,
    loadSoloArtistForm,
    loadGroupArtistForm,
    setArtistNotFoundError,
    setArtistTypeQueryError,
  } = api;
  try {
    const gptMusicArtistData = await queryGptData({
      numberOfResults: 1,
      maxTokens: 256,
      temperature: 0,
      topProbability: 1,
      dataItemSchema: Zod.object({
        artistType: Zod.union([
          Zod.literal("solo"),
          Zod.literal("group"),
          Zod.literal("notAnArtist"),
        ]),
      }),
      systemPrompt: musicArtistTypeSystemPrompt,
      userQuery: `Calculate: ${artistName}`,
    });
    if (gptMusicArtistData[0].artistType === "solo") {
      loadSoloArtistForm();
    } else if (gptMusicArtistData[0].artistType === "group") {
      loadGroupArtistForm();
    } else if (gptMusicArtistData[0].artistType === "notAnArtist") {
      setArtistNotFoundError(artistName);
    } else {
      throwInvalidPathError("loadMusicArtistType");
    }
  } catch (someError) {
    console.error(someError);
    setArtistTypeQueryError("oops, something happened!!!");
  }
}
