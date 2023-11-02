import { Button, TextBadge } from "stew/components/mod.ts";
import { useEffect, useState } from "stew/deps/preact/hooks.ts";
import { Zod } from "stew/deps/zod/mod.ts";
import { queryGptData } from "../../library/utilities/queryGptData.ts";
import { ARTIST_DISCOGRAPHY_SYSTEM_PROMPT } from "../utilities/gptPrompts.ts";
import { CompactListField } from "../../library/components/CompactListField.tsx";
// @deno-types="CssModule"
import cssModule from "./ArtistDetailsForm.module.scss";

export function artistDetailsForm() {
  return [
    {
      formKey: "soloArtistDetailsForm",
      FormFooter: () => null,
      formFields: [
        {
          fieldKey: "musicArtistAlbums",
          FieldDisplay: ArtistAlbumsField,
        },
      ],
    },
    {
      formKey: "groupArtistDetailsForm",
      FormFooter: () => null,
      formFields: [
        {
          fieldKey: "musicArtistAlbums",
          FieldDisplay: ArtistAlbumsField,
        },
      ],
    },
  ];
}

interface ArtistAlbumsFieldProps {}

function ArtistAlbumsField(props: any) {
  const { formState, formApi } = props;
  const [artistAlbumsQueryState, setArtistAlbumsQueryState] = useState<any>({
    queryStatus: "idle",
  });
  useEffect(() => {
    if (artistAlbumsQueryState.queryStatus === "success") {
      formApi.setFieldValue(
        "musicArtistAlbums",
        artistAlbumsQueryState.queryResult
      );
    }
  }, [artistAlbumsQueryState]);
  return (
    <CompactListField
      FieldItemBadge={({ fieldItem }) => (
        <TextBadge badgeLabel={fieldItem.toLowerCase()} />
      )}
      FieldHeaderAddon={ArtistAlbumsHeaderAddon}
      fieldHeaderAddonProps={{
        setArtistAlbumsQueryState,
        artistAlbumsQueryState,
        formState,
      }}
      EmptyContentAddon={() => null}
      emptyContentAddonProps={{}}
      emptyContentMessage={"no artist albums"}
      fieldLabel={"artist albums"}
      fieldItems={formState.fieldValues.musicArtistAlbums as Array<string>}
    />
  );
}

interface ArtistAlbumsHeaderAddonProps {
  artistAlbumsQueryState: any;
  setArtistAlbumsQueryState: any;
  formState: any;
}

function ArtistAlbumsHeaderAddon(props: ArtistAlbumsHeaderAddonProps) {
  const { artistAlbumsQueryState, setArtistAlbumsQueryState, formState } =
    props;
  return (
    <Button
      ariaLabel="todo"
      ariaDescription="todo"
      disabled={artistAlbumsQueryState.queryStatus === "in-progress"}
      onSelect={() => {
        setArtistAlbumsQueryState({
          queryStatus: "in-progress",
          queryWorker: queryArtistAlbums({
            formState,
            setArtistAlbumsQueryState,
          }),
        });
      }}
    >
      {artistAlbumsQueryState.queryStatus === "in-progress"
        ? "loading..."
        : "assist"}
    </Button>
  );
}

interface QueryArtistAlbumsApi {
  formState: any;
  setArtistAlbumsQueryState: any;
}

async function queryArtistAlbums(api: QueryArtistAlbumsApi) {
  const { formState, setArtistAlbumsQueryState } = api;
  try {
    const [mainArtistAlbumsGptQueryResult, liveArtistAlbumsGptQueryResult] =
      await Promise.all([
        queryGptData({
          numberOfResults: 2,
          maxTokens: 1024,
          temperature: 2,
          topProbability: 0.1,
          dataItemSchema: Zod.object({
            discographyAlbums: Zod.array(Zod.string()),
          }),
          systemPrompt: ARTIST_DISCOGRAPHY_SYSTEM_PROMPT,
          userQuery: `Calculate: ${formState.fieldValues.musicArtistName} Studio, Collaborative, and Compilation Albums`,
        }),
        queryGptData({
          numberOfResults: 2,
          maxTokens: 1024,
          temperature: 2,
          topProbability: 0.1,
          dataItemSchema: Zod.object({
            discographyAlbums: Zod.array(Zod.string()),
          }),
          systemPrompt: ARTIST_DISCOGRAPHY_SYSTEM_PROMPT,
          userQuery: `Calculate: ${formState.fieldValues.musicArtistName} Live Albums`,
        }),
      ]);
    setArtistAlbumsQueryState({
      queryStatus: "success",
      queryResult: Array.from(
        new Set([
          ...mainArtistAlbumsGptQueryResult.flatMap(
            (someArtistAlbumsGptQueryResult) =>
              someArtistAlbumsGptQueryResult.discographyAlbums
          ),
          ...liveArtistAlbumsGptQueryResult.flatMap(
            (someArtistAlbumsGptQueryResult) =>
              someArtistAlbumsGptQueryResult.discographyAlbums
          ),
        ])
      ),
    });
  } catch {
    setArtistAlbumsQueryState({
      queryStatus: "error",
    });
  }
}
