# stews.io/toolkit

tools for publishing quality curations

## get inspired

- [**clumsycomputer _(personal)_**](https://www.clumsycomputer.stews.io)

- [**pl-archive _(community)_**](https://www.prettylights.stews.io)

- [**bakedgoods _(curator)_**](https://www.bakedgoods.stews.io)

## get started

```bash
deno run -A https://deno.stews.io/init.ts ./your-stew
```

```bash
cd ./your-stew
```

```bash
deno task buildAndServeStew
```

open browser at localhost:8080

## make it yours

- customize `stewInfo` in `./source/stew.config.ts`

- customize `stewSegments` in `./source/stew.config.ts`

## publish to vercel

1. create new repository on github

2. create new project in vercel

   - link github repository

3. set secrets in github for repository

   - `VERCEL_ORG_ID`

     - go to settings tab under vercel user and copy vercel id

   - `VERCEL_PROJECT_ID`

     - go to settings tab under vercel project and copy project id

   - `VERCEL_TOKEN`

     - [create vercel token](https://vercel.com/account/tokens)

4. push repository to github

   - if branch === `production` then production deployed

   - if branch !== `production` then preview deployed
