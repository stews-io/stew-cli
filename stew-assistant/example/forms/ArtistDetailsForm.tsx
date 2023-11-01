import { BadgeList, BadgeListItem, TextBadge } from "stew/components/mod.ts";
import { useEffect, useState } from "stew/deps/preact/hooks.ts";
import { Zod } from "stew/deps/zod/mod.ts";
import { FieldContainer } from "../../library/components/FieldContainer.tsx";
import { queryGptData } from "../../library/utilities/queryGptData.ts";
import { ARTIST_DISCOGRAPHY_SYSTEM_PROMPT } from "../utilities/gptPrompts.ts";
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
  // useEffect(() => {
  //   setArtistAlbumsQueryState({
  //     queryStatus: "in-progress",
  //     queryWorker: queryArtistAlbums({
  //       formState,
  //       setArtistAlbumsQueryState,
  //     }),
  //   });
  // }, []);
  useEffect(() => {
    if (artistAlbumsQueryState.queryStatus === "success") {
      formApi.setFieldValue(
        "musicArtistAlbums",
        artistAlbumsQueryState.queryResult
      );
    }
  }, [artistAlbumsQueryState]);
  return (
    <FieldContainer>
      <div className={cssModule.listFieldHeaderContainer}>
        <div className={cssModule.listFieldLabel}>artist albums</div>
        <div className={cssModule.listFieldQueryStatus}>
          {artistAlbumsQueryState.queryStatus === "in-progress"
            ? "querying gpt..."
            : ""}
        </div>
      </div>
      <BadgeList ariaLabel="todo">
        {formState.fieldValues.musicArtistAlbums.map((someArtistAlbum: any) => (
          <BadgeListItem>
            <TextBadge badgeLabel={someArtistAlbum.toLowerCase()} />
          </BadgeListItem>
        ))}
      </BadgeList>
    </FieldContainer>
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
