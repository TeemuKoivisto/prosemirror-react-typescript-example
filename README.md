# [ProseMirror + React + TypeScript example editor](https://teemukoivisto.github.io/prosemirror-react-typescript-example/)

Just the basic boilerplate needed to get going with this combo.

Originally the editors and the React example app were served together, but since that is only acceptable for toy apps the editors are now run and compiled as individual libraries which the example-app imports.

## How to install

To run the example-app you should open two terminals for both `full` and `minimal` editors and run:

1. Go to their folder and install the dependencies: `cd full && yarn`
2. Link the library as local npm module: `yarn link`
3. Start the compiler: `yarn watch`

Afterwards, open another terminal window and run:

1. `cd example-app && yarn`
2. `yarn link full && yarn link minimal`
3. `yarn start`

There should open a React app at http://localhost:3000 with both editors. Changes in the editors should automatically be loaded. To export types/methods/whatever from the editors for the example-app you should add the import to the `index.ts` eg:

```ts
export { Editor } from './Editor'
export { createNewUnderline } from ./actions
```

## Design

The aim for the editors is to showcase how to bootstrap a PM-React-TS editor with the minimum boilerplate.

The `minimal` editor should be the absolute minimum required.

The `full` editor should, at one point, contain all the extra functionality that would make the experience of developing such editor somewhat painless. Although there definitely will be some pain.

Contributions or comments would be appreciated.
