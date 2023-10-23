import { getCssClass } from "stew/utilities/getCssClass.ts";
import {
  Button,
  ClientApp,
  ClientAppProps,
  Input,
  Page,
} from "../../stew-library/components/mod.ts";
import { useMemo, useState } from "../../stew-library/deps/preact/hooks.ts";
import { JSX } from "../../stew-library/deps/preact/mod.ts";
import { Zod } from "../../stew-library/deps/zod/mod.ts";
import { throwInvalidPathError } from "../../stew-library/utilities/mod.ts";
import {
  artistDiscographySystemPrompt,
  artistGroupMembersSystemPrompt,
  artistTypeSystemPrompt,
} from "../library/gptPrompts.ts";
import { queryGptData } from "../library/queryGptData.ts";
import { FormField, FormState } from "../library/FormState.ts";
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
  extends AssistantStateBase<"newArtistForm", NewArtistFormFields> {}

interface SoloArtistAssistantState
  extends AssistantStateBase<"soloArtistForm", SoloArtistFormFields> {}

interface GroupArtistAssistantState
  extends AssistantStateBase<"groupArtistForm", GroupArtistFormFields> {}

interface AssistantStateBase<FormType extends string, SomeArtistFormFields> {
  // formType: FormType;
  artistForm: FormState<SomeArtistFormFields>;
}

interface NewArtistFormFields extends BaseArtistFormFields {}

interface SoloArtistFormFields extends TypedArtistFormFields<"solo"> {}

interface GroupArtistFormFields extends TypedArtistFormFields<"group"> {}

interface TypedArtistFormFields<ArtistType extends string>
  extends BaseArtistFormFields {
  artistType: FormField<ArtistType>;
  artistAlbums: FormField<Array<string>>;
  artistMixtapes: FormField<Array<string>>;
  artistEps: FormField<Array<string>>;
  artistSingles: FormField<Array<string>>;
}

interface BaseArtistFormFields {
  artistName: FormField<string>;
}

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
  SomeAssistantState extends AssistantStateBase<
    string,
    TypedArtistFormFields<string>
  >,
  TypedFormExtensionProps extends Record<string, any>
> extends TypedArtistFormDataProps<SomeAssistantState>,
    TypedArtistFormConfigProps<TypedFormExtensionProps> {}

interface TypedArtistFormDataProps<
  SomeAssistantState extends AssistantStateBase<
    string,
    TypedArtistFormFields<string>
  >
> extends BaseArtistFormDataProps<SomeAssistantState> {}

interface TypedArtistFormConfigProps<
  TypedFormExtensionProps extends Record<string, any>
> extends TypedBaseFormExtensionConfigProps<TypedFormExtensionProps> {}

function TypedArtistForm<
  SomeAssistantState extends AssistantStateBase<
    string,
    TypedArtistFormFields<string>
  >,
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
  SomeAssistantState extends AssistantStateBase<string, BaseArtistFormFields>,
  FormExtensionProps extends Record<string, any>
> extends BaseArtistFormDataProps<SomeAssistantState>,
    BaseArtistFormConfigProps<FormExtensionProps> {}

interface BaseArtistFormDataProps<
  SomeAssistantState extends AssistantStateBase<string, BaseArtistFormFields>
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
  SomeAssistantState extends AssistantStateBase<string, BaseArtistFormFields>,
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
            value={assistantState.artistForm.formFields.artistName.fieldValue}
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
            assistantState.artistForm.formFields.artistName.fieldStatus ===
              "error",
          ])}
        >
          {assistantState.artistForm.formFields.artistName.fieldStatus ===
          "error"
            ? assistantState.artistForm.formFields.artistName.fieldError
            : null}
        </div>
      </div>
      <BaseFormExtension {...baseFormExtensionProps} />
      <div className={cssModule.formFooterContainer}>
        <Button
          className={cssModule.submitButton}
          ariaLabel={"todo"}
          ariaDescription={"todo"}
          disabled={assistantState.artistForm.formStatus === "submitting"}
          onSelect={() => {
            loadNextArtistForm();
          }}
        >
          {assistantState.artistForm.formStatus === "submitting"
            ? "loading"
            : "next"}
        </Button>
      </div>
    </div>
  );
}

function useAssistantApp() {
  const [assistantState, setAssistantState] = useState<AssistantState>({
    artistForm: {
      formStatus: "normal",
      formFields: {
        artistName: {
          fieldStatus: "normal",
          fieldKey: "artistName",
          fieldValue: "",
        },
      },
    },
  });
  const assistantApi = useMemo(() => {
    return {
      updateArtistName: (
        nextArtistName: BaseArtistFormFields["artistName"]["fieldValue"]
      ) => {
        setAssistantState((currentAssistantState) => ({
          ...currentAssistantState,
          artistForm: {
            ...currentAssistantState.artistForm,
            formFields: {
              ...currentAssistantState.artistForm.formFields,
              artistName: {
                ...currentAssistantState.artistForm.formFields.artistName,
                fieldValue: nextArtistName,
              },
            },
          },
        }));
      },
      clearArtistName: () => {},
    };
  }, []);
  return { assistantState, assistantApi };
}

interface __LoadTypedArtistFormApi
  extends Pick<AssistantState["artistForm"], "artistName"> {
  loadSoloArtistForm: () => void;
  loadGroupArtistForm: () => void;
  setArtistNotFoundError: (
    artistName: BaseArtistFormState["artistName"]
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
    const artistTypeGptData = await queryGptData({
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
      systemPrompt: artistTypeSystemPrompt,
      userQuery: `Calculate: ${artistName}`,
    });

    if (artistTypeGptData[0].artistType === "solo") {
      const [
        studioCollaborativeCompilationArtistAlbumsGptData,
        liveArtistAlbumsGptData,
        artistMixtapesGptData,
        artistEpsGptData,
        artistSinglesGptData,
      ] = await queryTypedArtistGptData({
        artistName,
        additionalQueries: [],
      });
    } else if (artistTypeGptData[0].artistType === "group") {
      // loadGroupArtistForm();
      const [
        studioCollaborativeCompilationArtistAlbumsGptData,
        liveArtistAlbumsGptData,
        artistMixtapesGptData,
        artistEpsGptData,
        artistSinglesGptData,
        artistGroupMembersGptData,
      ] = await queryTypedArtistGptData({
        artistName,
        additionalQueries: [
          queryGptData({
            numberOfResults: 2,
            maxTokens: 1024,
            temperature: 2,
            topProbability: 0.1,
            dataItemSchema: Zod.object({
              groupMembers: Zod.array(Zod.string()),
            }),
            systemPrompt: artistGroupMembersSystemPrompt,
            userQuery: `Calculate: ${artistName}`,
          }),
        ],
      });
    } else if (artistTypeGptData[0].artistType === "notAnArtist") {
      setArtistNotFoundError(artistName);
    } else {
      throwInvalidPathError("loadMusicArtistType");
    }
  } catch (someError) {
    console.error(someError);
    setArtistTypeQueryError("oops, something happened!!!");
  }
}

interface QueryTypedArtistGptDataApi<AdditionalQueries extends Array<any>>
  extends Pick<__LoadTypedArtistFormApi, "artistName"> {
  additionalQueries: AdditionalQueries;
}

function queryTypedArtistGptData<AdditionalQueries extends Array<any>>(
  api: QueryTypedArtistGptDataApi<AdditionalQueries>
) {
  const { artistName, additionalQueries } = api;
  return Promise.all([
    queryGptData({
      numberOfResults: 2,
      maxTokens: 1024,
      temperature: 2,
      topProbability: 0.1,
      dataItemSchema: Zod.object({
        discographyAlbums: Zod.array(Zod.string()),
      }),
      systemPrompt: artistDiscographySystemPrompt,
      userQuery: `Calculate: ${artistName} Studio, Collaborative, and Compilation Albums`,
    }),
    queryGptData({
      numberOfResults: 2,
      maxTokens: 1024,
      temperature: 2,
      topProbability: 0.1,
      dataItemSchema: Zod.object({
        discographyAlbums: Zod.array(Zod.string()),
      }),
      systemPrompt: artistDiscographySystemPrompt,
      userQuery: `Calculate: ${artistName} Live Albums`,
    }),
    queryGptData({
      numberOfResults: 2,
      maxTokens: 1024,
      temperature: 2,
      topProbability: 0.1,
      dataItemSchema: Zod.object({
        discographyMixtapes: Zod.array(Zod.string()),
      }),
      systemPrompt: artistDiscographySystemPrompt,
      userQuery: `Calculate: ${artistName} Mixtapes`,
    }),
    queryGptData({
      numberOfResults: 2,
      maxTokens: 1024,
      temperature: 2,
      topProbability: 0.1,
      dataItemSchema: Zod.object({
        discographyEps: Zod.array(Zod.string()),
      }),
      systemPrompt: artistDiscographySystemPrompt,
      userQuery: `Calculate: ${artistName} Eps`,
    }),
    queryGptData({
      numberOfResults: 2,
      maxTokens: 1024,
      temperature: 2,
      topProbability: 0.1,
      dataItemSchema: Zod.object({
        discographySingles: Zod.array(Zod.string()),
      }),
      systemPrompt: artistDiscographySystemPrompt,
      userQuery: `Calculate: ${artistName} Singles`,
    }),
    ...additionalQueries,
  ]);
}
