# stews.io/toolkit

> **tools for publishing quality curations to the web**

## get inspired

### [clumsycomputer](https://www.clumsycomputer.stews.io) _(personal stew)_

an assortment of great music, awesome spots, and sweet links

### [pl-archive](https://www.prettylights.stews.io) _(community stew)_

an extensive catalog of the Pretty Lights musical project

### [bakedgoods](https://www.bakedgoods.stews.io) _(curator stew)_

choice selections from modern electronic music

## get started

### create stew

##### run command to create stew

```bash
deno run -A https://deno.stews.io/init.ts ./your-stew
```

##### navigate into your stew's directory

```bash
cd ./your-stew
```

##### build and serve your stew locally

```bash
deno task buildAndServeStew
```

##### see what you get out of the box

> open browser at localhost:8080

### make it yours

- customize your stew at `./source/stew.config.ts`

  - [config documentation](#config)

### publish to vercel

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

## documentation

### config

### command
