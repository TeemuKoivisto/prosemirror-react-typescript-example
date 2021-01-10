# [ProseMirror + React + TypeScript example editor](https://teemukoivisto.github.io/prosemirror-react-typescript-example/)

Just the basic boilerplate needed to get going with this combo.

Originally the editors were served together with the React example-app, but since that is only acceptable for toy apps the editors are now run and compiled as individual libraries which the example-app imports.

I also added a SSR example since I was dabbling with Next.js and wondered how well rich-text editors and SSR go together. Not without friction, I must say.

## How to install

To run the example-app locally you should for each `atlassian`, `full` and `minimal` editor execute:

1. Install their dependencies: `cd full && yarn`
2. Link the library as local npm module: `yarn link`
3. Build the editor `yarn build` or start the compiler `yarn watch`

After having compiled and linked the editors, execute:

1. `cd example-app && yarn`
2. `yarn link atlassian && link full && yarn link minimal`
3. `yarn start`

The react app should open at http://localhost:3000 with the example editors. Any changes to the editors should automatically reload the page. To export types/methods/whatever from the editors for the example-app you should add the import to the `index.ts` eg:

```ts
export { Editor } from './Editor'
export { createNewUnderline } from ./actions
```

## Design

The aim of this project is to showcase how to bootstrap a PM-React-TS editor with the minimum boilerplate to build a PM-based rich-text editor in a sound and robust manner.

The `minimal` editor should contain the absolute minimum required.

The `full` editor should, at one point, contain all the extra functionality that would make the experience of developing such editor somewhat painless. Although there definitely will be some pain.

The `atlassian` editor is a direct derivation of this editor https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-core/ to showcase how a real industrial-grade PM editor is implemented. Although I have to say, some parts of the code are not perhaps up to the latest React software engineering standards.

Contributions or comments would be appreciated.

## Interesting observations

When compiling the editors you should not include React or styled-components as devDependencies as rollup by default seems to point to the editor's dependencies, not the example app's, thus importing them twice and causing very nasty bugs.
